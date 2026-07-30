import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import {
  PhoneOff, Mic, MicOff, Video, VideoOff, Volume2,
} from 'lucide-react';
import CallFeedbackModal from './CallFeedbackModal';
import { socketService } from '../../../services/socketService';
import { useSelector } from 'react-redux';
import {
  useInitiateCallMutation,
  useEndCallMutation,
  useGetCallByIdQuery,
  useCancelCallMutation,
  useAcceptCallMutation,
  useClearStuckCallsMutation,
} from '../../../features/api/callApi';
import { twilioVideoService } from '../../../services/twilioVideoService';
import toast from 'react-hot-toast';
import { freezeCallUI, matchesCallId } from '../../../utils/callEndUtils';
import { showBalanceWarning } from '../../../utils/balanceWarningUtils';
import InCallCreditTopUp from '../../../components/credit/InCallCreditTopUp';
import { unlockBrowserAudio } from '../../../utils/notificationSound';

const LISTENER_KEY = 'video-call-modal';

const VideoCallModal = memo(({ isOpen, onClose, consultant, callData: incomingCallData }) => {
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentBilling, setCurrentBilling] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [callState, setCallState] = useState(null);
  const [actualStartTime, setActualStartTime] = useState(null);
  const [isVideoConnected, setIsVideoConnected] = useState(false);

  const { user, token } = useSelector(state => state.auth);
  const [initiateCall, { isLoading: isInitiating }] = useInitiateCallMutation();
  const [clearStuckCalls] = useClearStuckCallsMutation();
  const [endCall, { isLoading: isEnding }] = useEndCallMutation();
  const [cancelCall] = useCancelCallMutation();
  const [acceptCall] = useAcceptCallMutation();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const timerRef = useRef(null);
  const callStateRef = useRef(null);
  const isClosingRef = useRef(false);
  const isAcceptedRef = useRef(false);
  const hasInitiatedRef = useRef(false);
  // Store pending connection params so we can retry once refs are ready
  const pendingVideoConnectRef = useRef(null);
  const actualStartTimeRef = useRef(null);
  callStateRef.current = callState;
  actualStartTimeRef.current = actualStartTime;

  useEffect(() => {
    setWalletBalance(parseFloat(user?.wallet?.creditBalance || 0));
  }, [user?.wallet?.creditBalance]);

  const { data: callData } = useGetCallByIdQuery(callState?.callId, {
    skip: !callState?.callId || showFeedback,
    pollingInterval: 2000,
  });

  useEffect(() => {
    if (callData?.data?.durationSeconds && !showFeedback && !isClosingRef.current) {
      const serverDuration = callData.data.durationSeconds;
      if (serverDuration > 0 && seconds === 0) {
        setSeconds(serverDuration);
        const pricePerSecond = (consultant?.pricePerMinute || 2.5) / 60;
        setCurrentBilling(Number((serverDuration * pricePerSecond).toFixed(2)));
      }
    }
  }, [callData, showFeedback, consultant?.pricePerMinute, seconds]);

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
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    };
  }, [isOpen, showFeedback, callState?.status, actualStartTime, consultant?.pricePerMinute]);

  // Handle incoming call data
  useEffect(() => {
    if (incomingCallData && !callState && isOpen && !isClosingRef.current) {
      setCallState({
        callId: incomingCallData.callId,
        roomName: incomingCallData.roomName,
        userToken: incomingCallData.token,
        status: 'pending',
        isIncoming: true,
      });
    }
  }, [incomingCallData, isOpen]);

  // ─────────────────────────────────────────────────────────────────
  // KEY FIX: connectVideo using the LIVE ref values at call time.
  // We do NOT use useCallback with captured refs — instead we read
  // remoteVideoRef.current and localVideoRef.current at the moment
  // we actually call twilioVideoService.connectVideo, after waiting
  // for them to be present in the DOM via a polling loop (no guessed
  // timeout).
  // ─────────────────────────────────────────────────────────────────
  const waitForRefs = useCallback((maxMs = 5000) => {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const check = () => {
        if (localVideoRef.current && remoteVideoRef.current) {
          resolve({ local: localVideoRef.current, remote: remoteVideoRef.current });
          return;
        }
        if (Date.now() - start > maxMs) {
          reject(new Error('Video ref elements not available after ' + maxMs + 'ms'));
          return;
        }
        requestAnimationFrame(check);
      };
      check();
    });
  }, []);

  const connectVideo = useCallback(async (roomName, tokenToUse) => {
    if (!tokenToUse || !roomName) {
      console.error('connectVideo: missing token or roomName');
      return false;
    }
    try {
      const { local, remote } = await waitForRefs(5000);
      await twilioVideoService.connectVideo(tokenToUse, roomName, local, remote);
      setIsVideoConnected(true);
      console.log('✅ Video connected successfully');
      return true;
    } catch (err) {
      console.error('❌ Video connect error:', err);
      toast.error('Failed to connect video');
      return false;
    }
  }, [waitForRefs]);

  // If a connection was requested before refs were ready, retry once
  // the component re-renders with active state (refs now in DOM).
  useEffect(() => {
    if (
      callState?.status === 'active' &&
      !isVideoConnected &&
      !isClosingRef.current &&
      pendingVideoConnectRef.current
    ) {
      const { roomName, tokenToUse } = pendingVideoConnectRef.current;
      pendingVideoConnectRef.current = null;
      connectVideo(roomName, tokenToUse);
    }
  }, [callState?.status, isVideoConnected, connectVideo]);

  // Socket listeners
  useEffect(() => {
    if (!isOpen || !user?.id || !token) return;
    socketService.connect(user.id, token);

    const handleCallAccepted = async (data) => {
      if (isClosingRef.current || isAcceptedRef.current) return;
      isAcceptedRef.current = true;
      unlockBrowserAudio();

      const startTime = data.actualStartTime ? new Date(data.actualStartTime).getTime() : Date.now();
      setActualStartTime(startTime);
      setSeconds(0);
      setCurrentBilling(0);

      const roomName = data.roomName || callStateRef.current?.roomName;
      const tokenToUse = data.token || callStateRef.current?.userToken;

      // Update state first so the active UI (with video divs) renders
      setCallState(prev => ({
        ...prev,
        status: 'active',
        roomName: data.roomName || prev?.roomName,
        callId: data.callId || prev?.callId,
        userToken: data.token || prev?.userToken,
      }));

      toast.success('Call accepted! Connecting video...');

      // Store params; the useEffect above will call connectVideo once
      // refs are in the DOM after the state update re-render.
      pendingVideoConnectRef.current = { roomName, tokenToUse };
    };

    const handleCallRejected = () => {
      if (isClosingRef.current) return;
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      toast.error('Call was rejected by consultant');
      setTimeout(() => { if (!isClosingRef.current) closeAll(); }, 500);
    };

    const handleCallEnding = (data) => {
      if (!matchesCallId(data, callStateRef.current?.callId)) return;
      if (callStateRef.current?.status === 'ending') return;
      freezeCallUI({
        timerRef,
        twilioVideoService,
        setSeconds,
        setCurrentBilling,
        setCallState,
        actualStartTime: actualStartTimeRef.current,
        pricePerMinute: consultant?.pricePerMinute,
        durationSeconds: data.durationSeconds,
      });
      setIsVideoConnected(false);
    };

    const handleCallEnded = (data) => {
      if (!matchesCallId(data, callStateRef.current?.callId)) return;
      if (data?.reason === 'insufficient_balance') {
        toast.error('Call ended — your credit balance was exhausted.');
      }
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      twilioVideoService.disconnect();
      setIsVideoConnected(false);
      const finalSeconds = data?.durationSeconds ?? seconds;
      setSeconds(finalSeconds);
      if (finalSeconds > 0) {
        setShowFeedback(true);
        isClosingRef.current = false;
      } else if (!isClosingRef.current) {
        setTimeout(() => closeAll(), 500);
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

    socketService.on('call_accepted', LISTENER_KEY, handleCallAccepted);
    socketService.on('call_rejected', LISTENER_KEY, handleCallRejected);

    return () => {
      window.removeEventListener('rtcall:call_ending', onCallEnding);
      window.removeEventListener('rtcall:call_ended', onCallEnded);
      window.removeEventListener('rtcall:call_balance_warning', onBalanceWarning);
      window.removeEventListener('rtcall:call_billing_tick', onBillingTick);
      socketService.off('call_accepted', LISTENER_KEY);
      socketService.off('call_rejected', LISTENER_KEY);
      isAcceptedRef.current = false;
    };
  }, [isOpen, user?.id, token, consultant?.pricePerMinute]);

  // Initiate call (caller side)
  useEffect(() => {
    if (!isOpen || !consultant || incomingCallData || isClosingRef.current) return;
    if (hasInitiatedRef.current) return;
    hasInitiatedRef.current = true;

    const startCall = async () => {
      try {
        const consultantUserId = consultant?.userId || consultant?.user?.id;
        if (!consultantUserId) {
          toast.error('Consultant user ID not found');
          closeAll();
          return;
        }

        // Clear orphaned PENDING calls from previous failed attempts
        await clearStuckCalls().unwrap().catch(() => {});

        const response = await initiateCall({
          consultantId: consultantUserId,
          callType: 'VIDEO',
        }).unwrap();

        const callObj = response?.data?.call || response?.call;
        const tokensObj = response?.data?.tokens || response?.tokens;

        setCallState({
          callId: callObj.id,
          roomName: callObj.roomName,
          userToken: tokensObj.user.token,
          status: 'pending',
          isIncoming: false,
        });

        toast('Calling consultant...', { icon: '📹' });
      } catch (err) {
        console.error('❌ initiateCall error:', err);
        hasInitiatedRef.current = false;
        const msg = err?.data?.message || err?.message || 'Failed to start video call';
        toast.error(msg);
        closeAll();
      }
    };

    startCall();
  }, [isOpen, consultant, incomingCallData]);

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
    setIsVideoConnected(false);

    try {
      if (callStateRef.current?.callId) {
        if (wasPending) {
          await cancelCall(callStateRef.current.callId).unwrap();
          closeAll();
        } else {
          const result = await endCall(callStateRef.current.callId).unwrap();
          const finalDuration = result?.durationSeconds || result?.data?.durationSeconds || frozen;
          setSeconds(finalDuration);
          if (finalDuration > 0) {
            setShowFeedback(true);
            isClosingRef.current = false;
          } else {
            closeAll();
          }
        }
      } else {
        closeAll();
      }
    } catch (err) {
      console.error('End call error:', err);
      if (frozen > 0) { setShowFeedback(true); isClosingRef.current = false; }
      else { closeAll(); }
    }
  };

  // Consultant accepts incoming call
  const handleAcceptCall = async () => {
    if (!callState?.callId || isClosingRef.current) return;

    try {
      const result = await acceptCall(callState.callId).unwrap();

      const tokenToUse = result?.data?.consultantToken || result?.consultantToken || callState.userToken;
      const roomName = result?.data?.call?.roomName || callState.roomName;

      // Set active state first so video divs render, then connectVideo
      // will find the refs via waitForRefs polling.
      setCallState(prev => ({
        ...prev,
        userToken: tokenToUse,
        status: 'active',
      }));
      setActualStartTime(Date.now());
      toast.success('Call accepted, connecting...');

      // Store params for the pending-connect useEffect
      pendingVideoConnectRef.current = { roomName, tokenToUse };
    } catch (err) {
      console.error('Failed to accept call:', err);
      toast.error('Failed to accept call');
    }
  };

  const closeAll = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (remoteVideoRef.current) remoteVideoRef.current.innerHTML = '';
    if (localVideoRef.current) localVideoRef.current.innerHTML = '';
    pendingVideoConnectRef.current = null;
    setSeconds(0);
    setCurrentBilling(0);
    setShowFeedback(false);
    setCallState(null);
    setActualStartTime(null);
    setIsVideoConnected(false);
    twilioVideoService.disconnect();
    isClosingRef.current = false;
    isAcceptedRef.current = false;
    hasInitiatedRef.current = false;
    onClose();
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  if (isInitiating) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">
        <div className="bg-gray-900 w-full max-w-md rounded-2xl p-8 flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-400 mb-4" />
          <p className="text-white text-lg">Connecting video call to {consultant?.name}...</p>
        </div>
      </div>
    );
  }

  if (showFeedback) {
    return (
      <CallFeedbackModal
        consultant={consultant}
        seconds={seconds}
        callId={callStateRef.current?.callId}
        onClose={closeAll}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[9999] p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="relative w-full max-w-sm aspect-[3/4] max-h-[80vh] rounded-2xl overflow-hidden bg-gray-900 shadow-2xl border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Remote Video Container — Twilio appends <video> elements here */}
        <div
          ref={remoteVideoRef}
          className="absolute inset-0 w-full h-full bg-gray-800"
        />

        {/* Pending state overlay */}
        {callState?.status !== 'active' && (
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center z-[5]">
            <div className="w-24 h-24 rounded-full bg-[#D1C4E9] flex items-center justify-center text-[#5E35B1] text-3xl font-bold mb-4">
              {consultant?.name?.charAt(0) || 'C'}
            </div>
            <p className="text-white font-semibold text-lg">{consultant?.name}</p>
            <p className="text-yellow-400 text-sm mt-2 animate-pulse">
              {callState?.isIncoming ? '● Incoming call...' : '● Waiting for answer...'}
            </p>
            {callState?.isIncoming && (
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleAcceptCall}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-full text-white font-semibold"
                >
                  Accept
                </button>
                <button
                  onClick={handleEndCall}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-full text-white font-semibold"
                >
                  Decline
                </button>
              </div>
            )}
          </div>
        )}

        {/* Connecting video spinner */}
        {callState?.status === 'active' && !isVideoConnected && (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center z-[5]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-400 mx-auto mb-4" />
              <p className="text-white">Connecting video...</p>
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none z-[6]" />

        {/* Local Video PiP — only rendered when active so ref is available */}
        {callState?.status === 'active' && (
          <div className="absolute top-4 right-4 w-20 h-28 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg bg-gray-700 z-20">
            <div ref={localVideoRef} className="w-full h-full" />
            {isVideoOff && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center z-[2]">
                <VideoOff size={20} className="text-white/60" />
              </div>
            )}
          </div>
        )}

        {/* Top Info Bar */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          <div className="bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
            <div className={`w-2 h-2 rounded-full ${callState?.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400 animate-pulse'}`} />
            <p className="text-xs font-bold text-white tracking-wide">
              {callState?.status === 'active'
                ? `${formatTime(seconds)} | €${currentBilling.toFixed(2)}`
                : callState?.isIncoming
                  ? `Incoming call from ${consultant?.name}...`
                  : `Calling ${consultant?.name}...`
              }
            </p>
          </div>
          {callState?.status === 'active' && !callState?.isIncoming && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/80 bg-black/30 px-2 py-0.5 rounded-full">
                Bal: €{walletBalance.toFixed(2)}
              </span>
              <InCallCreditTopUp compact onBalanceUpdate={setWalletBalance} />
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        {callState?.status === 'active' && (
          <div className="absolute bottom-8 left-0 right-0 z-20">
            <div className="flex items-center justify-center gap-3 px-4">
              <button
                onClick={() => {
                  const newMuted = !isMuted;
                  setIsMuted(newMuted);
                  newMuted ? twilioVideoService.mute() : twilioVideoService.unmute();
                }}
                className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-xl transition-all ${isMuted ? 'bg-red-500/90 text-white' : 'bg-white/15 text-white hover:bg-white/30'}`}
              >
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <button
                onClick={() => {
                  const newVideoOff = !isVideoOff;
                  setIsVideoOff(newVideoOff);
                  newVideoOff ? twilioVideoService.disableVideo() : twilioVideoService.enableVideo();
                }}
                className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-xl transition-all ${isVideoOff ? 'bg-red-500/90 text-white' : 'bg-white/15 text-white hover:bg-white/30'}`}
              >
                {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
              </button>

              <button className="w-11 h-11 rounded-full bg-white/15 text-white hover:bg-white/30 flex items-center justify-center backdrop-blur-xl transition-all">
                <Volume2 size={18} />
              </button>

              <button
                onClick={handleEndCall}
                disabled={isEnding}
                className="w-13 h-13 bg-red-500 hover:bg-red-600 disabled:opacity-50 rounded-full flex items-center justify-center text-white transition-all shadow-lg hover:scale-105"
              >
                <PhoneOff size={22} fill="currentColor" />
              </button>
            </div>
          </div>
        )}

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/20 rounded-full" />
      </div>
    </div>
  );
});

VideoCallModal.displayName = 'VideoCallModal';
export default VideoCallModal;