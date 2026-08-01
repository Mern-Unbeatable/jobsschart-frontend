import React, { memo, useState, useEffect, useRef } from 'react';
import { PhoneOff, Mic, Volume2, MicOff } from 'lucide-react';
import CallFeedbackModal from './CallFeedbackModal';
import { socketService } from '../../../services/socketService';
import { useSelector } from 'react-redux';
import {
  useInitiateCallMutation,
  useEndCallMutation,
  useGetCallByIdQuery,
  useCancelCallMutation,
  useClearStuckCallsMutation,
} from '../../../features/api/callApi';
import toast from 'react-hot-toast';
import { twilioVideoService } from '../../../services/twilioVideoService';
import { freezeCallUI, matchesCallId, parseServerStartTimeMs } from '../../../utils/callEndUtils';
import { showBalanceWarning } from '../../../utils/balanceWarningUtils';
import InCallCreditTopUp from '../../../components/credit/InCallCreditTopUp';
import { unlockBrowserAudio } from '../../../utils/notificationSound';

const LISTENER_KEY = 'audio-call-modal';

const AudioCallModal = memo(({ isOpen, onClose, consultant }) => {
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentBilling, setCurrentBilling] = useState(0);
  const [sessionTotalCost, setSessionTotalCost] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [callState, setCallState] = useState(null);
  const [actualStartTime, setActualStartTime] = useState(null);

  const { user, token } = useSelector(state => state.auth);
  const [initiateCall, { isLoading: isInitiating }] = useInitiateCallMutation();
  const [clearStuckCalls] = useClearStuckCallsMutation();
  const [endCall, { isLoading: isEnding }] = useEndCallMutation();
  const [cancelCall] = useCancelCallMutation();

  const timerRef = useRef(null);
  const callStateRef = useRef(null);
  const isClosingRef = useRef(false);
  const isConnectedRef = useRef(false);
  const actualStartTimeRef = useRef(null);
  callStateRef.current = callState;
  actualStartTimeRef.current = actualStartTime;

  const { data: callData } = useGetCallByIdQuery(callState?.callId, {
    skip: !callState?.callId || showFeedback,
    pollingInterval: 2000,
  });

  const hasInitiatedRef = useRef(false);

  useEffect(() => {
    setWalletBalance(parseFloat(user?.wallet?.creditBalance || 0));
  }, [user?.wallet?.creditBalance]);

  // Sync call duration from server
  useEffect(() => {
    if (callData?.data?.durationSeconds && showFeedback === false) {
      const serverDuration = callData.data.durationSeconds;
      if (serverDuration > 0 && seconds === 0) {
        setSeconds(serverDuration);
        const pricePerSecond = (consultant?.pricePerMinute || 2.5) / 60;
        setCurrentBilling(Number((serverDuration * pricePerSecond).toFixed(2)));
      }
    }
  }, [callData, showFeedback, consultant?.pricePerMinute]);

  // Timer
  useEffect(() => {
    if (isOpen && !showFeedback && callState?.status === 'active' && actualStartTime && !isClosingRef.current) {
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        if (!isClosingRef.current && callStateRef.current?.status === 'active') {
          const start = actualStartTimeRef.current;
          if (!start) return;
          const diffSeconds = Math.floor((Date.now() - start) / 1000);
          setSeconds(diffSeconds);
          const pricePerSecond = (consultant?.pricePerMinute || 2.5) / 60;
          setCurrentBilling(Number((diffSeconds * pricePerSecond).toFixed(2)));
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen, showFeedback, callState?.status, actualStartTime, consultant?.pricePerMinute]);

  // Socket listeners
  useEffect(() => {
    if (!isOpen || !user?.id || !token) return;

    socketService.connect(user.id, token);

    const handleCallEnding = (data) => {
      if (!matchesCallId(data, callStateRef.current?.callId)) return;
      if (callStateRef.current?.status === 'ending') return;
      const startMs = parseServerStartTimeMs(data.serverStartTime);
      if (startMs != null) setActualStartTime(startMs);
      freezeCallUI({
        timerRef,
        twilioVideoService,
        setSeconds,
        setCurrentBilling,
        setCallState,
        actualStartTime: startMs ?? actualStartTimeRef.current,
        pricePerMinute: consultant?.pricePerMinute,
        durationSeconds: data.durationSeconds,
        totalCost: data.totalCost,
      });
      if (data.totalCost != null) setSessionTotalCost(parseFloat(data.totalCost));
      isConnectedRef.current = false;
    };

    const handleCallEnded = (data) => {
      if (!matchesCallId(data, callStateRef.current?.callId)) return;
      if (data?.reason === 'insufficient_balance') {
        toast.error('Call ended — your credit balance was exhausted.');
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      twilioVideoService.disconnect();
      isConnectedRef.current = false;
      const startMs = parseServerStartTimeMs(data.serverStartTime);
      if (startMs != null) setActualStartTime(startMs);
      const finalSeconds = data?.durationSeconds ?? seconds;
      setSeconds(finalSeconds);
      if (data?.totalCost != null) {
        const cost = parseFloat(data.totalCost);
        setSessionTotalCost(cost);
        setCurrentBilling(cost);
      }
      if (finalSeconds > 0) {
        setShowFeedback(true);
        isClosingRef.current = false;
      } else if (!isClosingRef.current) {
        closeAll();
      }
    };

    const onCallEnding = (e) => handleCallEnding(e.detail);
    const onCallEnded = (e) => handleCallEnded(e.detail);
    const onBalanceWarning = (e) => {
      if (!matchesCallId(e.detail, callStateRef.current?.callId)) return;
      if (callStateRef.current?.isIncoming) return;
      showBalanceWarning(e.detail);
    };
    const onBillingTick = (e) => {
      if (!matchesCallId(e.detail, callStateRef.current?.callId)) return;
      if (e.detail?.balanceAfter != null) {
        setWalletBalance(parseFloat(e.detail.balanceAfter));
      }
      if (e.detail?.amountCharged != null) {
        setCurrentBilling((prev) => Number((prev + e.detail.amountCharged).toFixed(2)));
      }
    };
    window.addEventListener('rtcall:call_ending', onCallEnding);
    window.addEventListener('rtcall:call_ended', onCallEnded);
    window.addEventListener('rtcall:call_balance_warning', onBalanceWarning);
    window.addEventListener('rtcall:call_billing_tick', onBillingTick);

    socketService.on('call_accepted', LISTENER_KEY, async (data) => {
      if (isClosingRef.current || isConnectedRef.current) return;

      const startTime = data.actualStartTime || data.serverStartTime;
      const startMs = parseServerStartTimeMs(startTime) ?? Date.now();
      setActualStartTime(startMs);
      setSeconds(0);
      setCurrentBilling(0);

      // Update call state
      setCallState(prev => prev ? {
        ...prev,
        status: 'active',
        roomName: data.roomName || prev.roomName,
        userToken: data.token || prev.userToken,
      } : null);

      toast.success('Call accepted! Connecting audio...');

      // 🔥 ADD THIS
      unlockBrowserAudio();

      //  Connect to Twilio audio room
      const roomName = data.roomName || callStateRef.current?.roomName;
      const tokenToUse = data.token || callStateRef.current?.userToken;

      if (tokenToUse && roomName) {
        try {
          isConnectedRef.current = true;
          await twilioVideoService.connectAudio(tokenToUse, roomName);
          console.log(' User audio connected successfully');
        } catch (err) {
          console.error(' Audio connect error:', err);
          toast.error('Audio connection failed');
          isConnectedRef.current = false;
        }
      } else {
        console.error('Missing token or roomName for audio connection');
      }
    });

    socketService.on('call_rejected', LISTENER_KEY, () => {
      if (isClosingRef.current) return;

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      twilioVideoService.disconnect();
      isConnectedRef.current = false;
      setCallState(null);
      setActualStartTime(null);
      toast.error('Call was rejected by consultant');
      onClose();
    });

    return () => {
      window.removeEventListener('rtcall:call_ending', onCallEnding);
      window.removeEventListener('rtcall:call_ended', onCallEnded);
      window.removeEventListener('rtcall:call_balance_warning', onBalanceWarning);
      window.removeEventListener('rtcall:call_billing_tick', onBillingTick);
      socketService.off('call_accepted', LISTENER_KEY);
      socketService.off('call_rejected', LISTENER_KEY);
    };
  }, [isOpen, user?.id, token, consultant?.pricePerMinute]);

  // Initiate call
  // useEffect(() => {
  //   if (!isOpen || callState || !consultant || isInitiating || isClosingRef.current) return;

  //   const startCall = async () => {
  //     try {
  //       const consultantUserId = consultant.user?.id || consultant.id;

  //       if (!consultantUserId) {
  //         toast.error('Consultant ID not found');
  //         onClose();
  //         return;
  //       }

  //       const response = await initiateCall({
  //         consultantId: consultantUserId,
  //         callType: 'PHONE',
  //       }).unwrap();

  //       const callObj = response?.data?.call || response?.call;
  //       const tokensObj = response?.data?.tokens || response?.tokens;

  //       setCallState({
  //         callId: callObj.id,
  //         roomName: callObj.roomName,
  //         userToken: tokensObj.user.token,
  //         status: 'pending',
  //       });

  //       toast('Calling consultant...', { icon: '📞' });
  //     } catch (err) {
  //       console.error('❌ initiateCall error:', err);
  //       toast.error(err?.data?.message || err?.message || 'Failed to start call');
  //       onClose();
  //     }
  //   };

  //   startCall();
  // }, [isOpen, consultant]);

  const handleEndCall = async () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    const wasPending = callStateRef.current?.status === 'pending';
    const frozen = freezeCallUI({
      timerRef,
      twilioVideoService,
      setSeconds,
      setCurrentBilling,
      setCallState,
      actualStartTime: actualStartTimeRef.current,
      pricePerMinute: consultant?.pricePerMinute,
    });
    isConnectedRef.current = false;

    try {
      if (callStateRef.current?.callId) {
        if (wasPending) {
          await cancelCall(callStateRef.current.callId).unwrap();
          closeAll();
        } else {
          const result = await endCall(callStateRef.current.callId).unwrap();
          const finalDuration = result?.durationSeconds || result?.data?.durationSeconds || frozen;
          const finalCost = result?.totalCost ?? result?.data?.totalCost ?? sessionTotalCost ?? currentBilling;
          setSeconds(finalDuration);
          if (finalCost != null) {
            const cost = parseFloat(finalCost);
            setSessionTotalCost(cost);
            setCurrentBilling(cost);
          }

          if (finalDuration > 0) {
            setShowFeedback(true);
            isClosingRef.current = false;
          } else {
            closeAll();
          }
        }
      }
    } catch (err) {
      console.error('End call error:', err);
      if (frozen > 0) {
        setShowFeedback(true);
        isClosingRef.current = false;
      } else {
        closeAll();
      }
    }
  };

  useEffect(() => {
    if (!isOpen || !consultant || isClosingRef.current) return;

    // ✅ HARD STOP DUPLICATE CALLS
    if (hasInitiatedRef.current) return;
    hasInitiatedRef.current = true;

    const startCall = async () => {
      try {
        const consultantUserId = consultant?.userId || consultant?.user?.id;

        if (!consultantUserId) {
          toast.error('Consultant user ID not found');
          onClose();
          return;
        }

        await clearStuckCalls().unwrap().catch(() => {});

        const response = await initiateCall({
          consultantId: consultantUserId,
          callType: 'PHONE',
        }).unwrap();

        const callObj = response?.data?.call || response?.call;
        const tokensObj = response?.data?.tokens || response?.tokens;

        setCallState({
          callId: callObj.id,
          roomName: callObj.roomName,
          userToken: tokensObj.user.token,
          status: 'pending',
        });

        toast('Calling consultant...', { icon: '📞' });

      } catch (err) {
        console.error('❌ initiateCall error:', err);
        hasInitiatedRef.current = false;
        const msg = err?.data?.message || err?.message || 'Failed to start call';
        toast.error(msg);
        onClose();
      }
    };

    startCall();
  }, [isOpen, consultant]);
  const closeAll = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setSeconds(0);
    setCurrentBilling(0);
    setSessionTotalCost(null);
    setShowFeedback(false);
    setCallState(null);
    setActualStartTime(null);

    twilioVideoService.disconnect();
    isConnectedRef.current = false;
    isClosingRef.current = false;

    // ✅ ADD THIS (CRITICAL FIX)
    hasInitiatedRef.current = false;

    onClose();
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  if (isInitiating) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
        <div className="bg-[#2D2D2D] w-full max-w-md rounded-2xl p-8 flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400 mb-4" />
          <p className="text-white text-lg">Connecting to {consultant?.name}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      {!showFeedback ? (
        <div className="bg-[#2D2D2D] w-full max-w-md rounded-2xl p-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#D1C4E9] flex items-center justify-center mb-4 text-[#5E35B1] text-3xl font-bold">
            {consultant?.name?.charAt(0) || 'C'}
          </div>

          <h2 className="text-white font-bold text-xl mb-1">{consultant?.name}</h2>

          <p className={`text-sm font-semibold mb-6 uppercase tracking-wider ${callState?.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
            {callState?.status === 'active' ? '● In Progress' : '● Waiting for answer...'}
          </p>

          <div className="text-5xl font-bold text-white mb-8 font-mono">
            {formatTime(seconds)}
          </div>

          <div className="bg-white/10 px-6 py-3 rounded-xl mb-4 text-center w-full max-w-xs">
            <p className="text-xs text-gray-400 mb-1 uppercase">Current Billing</p>
            <p className="text-white font-bold text-xl">€{currentBilling.toFixed(2)}</p>
            {!callState?.isIncoming && callState?.status === 'active' && (
              <p className="text-xs text-gray-400 mt-2">
                Balance: <span className="text-white font-semibold">€{walletBalance.toFixed(2)}</span>
              </p>
            )}
          </div>

          {!callState?.isIncoming && callState?.status === 'active' && (
            <div className="mb-6">
              <InCallCreditTopUp compact onBalanceUpdate={setWalletBalance} />
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const newMuted = !isMuted;
                setIsMuted(newMuted);
                newMuted ? twilioVideoService.mute() : twilioVideoService.unmute();
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center ${isMuted ? 'bg-red-500' : 'bg-white/10'} text-white`}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button
              onClick={handleEndCall}
              disabled={isEnding}
              className="w-14 h-14 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-full flex items-center justify-center"
            >
              <PhoneOff size={22} />
            </button>
            <button className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center">
              <Volume2 size={20} />
            </button>
          </div>
        </div>
      ) : (
        <CallFeedbackModal
          consultant={consultant}
          seconds={seconds}
          totalCost={sessionTotalCost ?? currentBilling}
          callId={callStateRef.current?.callId}
          onClose={closeAll}
        />
      )}
    </div>
  );
});

AudioCallModal.displayName = 'AudioCallModal';
export default AudioCallModal;