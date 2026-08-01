import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import {
  PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, VolumeX,
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
import { freezeCallUI, matchesCallId, parseServerStartTimeMs } from '../../../utils/callEndUtils';
import { showBalanceWarning } from '../../../utils/balanceWarningUtils';
import InCallCreditTopUp from '../../../components/credit/InCallCreditTopUp';
import { unlockBrowserAudio } from '../../../utils/notificationSound';
import DraggableCallPiP from '../../../components/call/DraggableCallPiP';
import { useResponsiveCallLayout } from '../../../hooks/useResponsiveCallLayout';

const LISTENER_KEY = 'video-call-modal';

const VideoCallModal = memo(({ isOpen, onClose, consultant, callData: incomingCallData }) => {
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentBilling, setCurrentBilling] = useState(0);
  const [sessionTotalCost, setSessionTotalCost] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [callState, setCallState] = useState(null);
  const [actualStartTime, setActualStartTime] = useState(null);
  const [isVideoConnected, setIsVideoConnected] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const callLayout = useResponsiveCallLayout();

  const { user, token } = useSelector(state => state.auth);
  const [initiateCall, { isLoading: isInitiating }] = useInitiateCallMutation();
  const [clearStuckCalls] = useClearStuckCallsMutation();
  const [endCall, { isLoading: isEnding }] = useEndCallMutation();
  const [cancelCall] = useCancelCallMutation();
  const [acceptCall] = useAcceptCallMutation();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const videoContainerRef = useRef(null);
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
      setIsSpeakerOn(twilioVideoService.getSpeakerOn());
      await twilioVideoService.setSpeakerOn(true);
      console.log('✅ Video connected successfully');
      return true;
    } catch (err) {
      console.error('❌ Video connect error:', err);
      const msg = String(err?.message || '');
      if (msg.includes('issuer/subject') || msg.includes('AccessTokenIssuerInvalid')) {
        toast.error('Video server credentials are misconfigured. Contact support.');
      } else {
        toast.error('Failed to connect video. Check camera/mic permissions.');
      }
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

      const startTime = data.actualStartTime || data.serverStartTime;
      const startMs = parseServerStartTimeMs(startTime) ?? Date.now();
      setActualStartTime(startMs);
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
      const startMs = parseServerStartTimeMs(
        result?.data?.call?.startTime || result?.call?.startTime
      ) ?? Date.now();

      // Set active state first so video divs render, then connectVideo
      // will find the refs via waitForRefs polling.
      setCallState(prev => ({
        ...prev,
        userToken: tokenToUse,
        status: 'active',
      }));
      setActualStartTime(startMs);
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
    setSessionTotalCost(null);
    setShowFeedback(false);
    setCallState(null);
    setActualStartTime(null);
    setIsVideoConnected(false);
    setIsSpeakerOn(true);
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
      <div className="fixed inset-0 z-[9999] flex h-[100dvh] w-screen items-center justify-center bg-black/80 p-4">
        <div className="flex w-full max-w-md flex-col items-center rounded-2xl bg-gray-900 p-6 sm:p-8">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-b-2 border-green-400" />
          <p className="text-center text-base text-white sm:text-lg">Connecting video call to {consultant?.name}...</p>
        </div>
      </div>
    );
  }

  if (showFeedback) {
    return (
      <CallFeedbackModal
        consultant={consultant}
        seconds={seconds}
        totalCost={sessionTotalCost ?? currentBilling}
        callId={callStateRef.current?.callId}
        onClose={closeAll}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex h-[100dvh] w-screen items-center justify-center bg-black/70 backdrop-blur-md p-0 md:bg-black/70 md:p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        ref={videoContainerRef}
        className="relative h-full w-full overflow-hidden bg-gray-900 shadow-2xl md:h-auto md:max-h-[80vh] md:max-w-sm md:rounded-2xl md:border md:border-white/10 md:aspect-[3/4]"
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
              <div className="mt-6 flex w-full max-w-xs flex-col gap-3 px-6 sm:max-w-none sm:flex-row sm:justify-center sm:px-0">
                <button
                  type="button"
                  onClick={handleAcceptCall}
                  className="flex-1 rounded-full bg-green-500 px-6 py-3 font-semibold text-white active:bg-green-600 sm:py-2"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={handleEndCall}
                  className="flex-1 rounded-full bg-red-500 px-6 py-3 font-semibold text-white active:bg-red-600 sm:py-2"
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

        {/* Local Video PiP — draggable like WhatsApp */}
        {callState?.status === 'active' && (
          <DraggableCallPiP
            containerRef={videoContainerRef}
            videoRef={localVideoRef}
            width={callLayout.pipWidth}
            height={callLayout.pipHeight}
            margin={callLayout.pipMargin}
            bottomInset={callLayout.bottomControlInset}
            topInset={callLayout.topInset}
            defaultCorner={callLayout.pipDefaultCorner}
            className={callLayout.pipShellClass}
            overlay={
              isVideoOff ? (
                <div className="absolute inset-0 z-[2] flex items-center justify-center bg-gray-800 pointer-events-none">
                  <VideoOff size={20} className="text-white/60" />
                </div>
              ) : null
            }
          />
        )}

        {/* Top Info Bar */}
        <div className="absolute left-[max(0.75rem,env(safe-area-inset-left))] top-[max(0.75rem,env(safe-area-inset-top))] z-20 flex max-w-[calc(100%-5.5rem)] flex-col gap-2">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-sm">
            <div className={`h-2 w-2 shrink-0 rounded-full ${callState?.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400 animate-pulse'}`} />
            <p className="truncate text-xs font-bold tracking-wide text-white">
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
          <div className="absolute bottom-0 left-0 right-0 z-20 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
            <div className={`flex items-center justify-center px-3 ${callLayout.controlGapClass}`}>
              <button
                type="button"
                onClick={() => {
                  const newMuted = !isMuted;
                  setIsMuted(newMuted);
                  newMuted ? twilioVideoService.mute() : twilioVideoService.unmute();
                }}
                className={`${callLayout.controlBtnClass} flex items-center justify-center rounded-full backdrop-blur-xl transition-all ${isMuted ? 'bg-red-500/90 text-white' : 'bg-white/15 text-white active:bg-white/30'}`}
              >
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  const newVideoOff = !isVideoOff;
                  setIsVideoOff(newVideoOff);
                  newVideoOff ? twilioVideoService.disableVideo() : twilioVideoService.enableVideo();
                }}
                className={`${callLayout.controlBtnClass} flex items-center justify-center rounded-full backdrop-blur-xl transition-all ${isVideoOff ? 'bg-red-500/90 text-white' : 'bg-white/15 text-white active:bg-white/30'}`}
              >
                {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
              </button>

              <button
                type="button"
                onClick={async () => {
                  unlockBrowserAudio();
                  const next = await twilioVideoService.toggleSpeaker();
                  setIsSpeakerOn(next);
                  toast(next ? 'Sound on' : 'Sound off — you will not hear the other person', {
                    duration: 2000,
                    position: 'top-center',
                  });
                }}
                className={`${callLayout.controlBtnClass} flex items-center justify-center rounded-full backdrop-blur-xl transition-all ${isSpeakerOn ? 'bg-white/15 text-white active:bg-white/30' : 'bg-[#6E35AE]/90 text-white'}`}
                aria-label={isSpeakerOn ? 'Mute incoming sound' : 'Unmute incoming sound'}
              >
                {isSpeakerOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>

              <button
                type="button"
                onClick={handleEndCall}
                disabled={isEnding}
                className={`${callLayout.endCallBtnClass} flex items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all active:scale-95 disabled:opacity-50`}
              >
                <PhoneOff size={22} fill="currentColor" />
              </button>
            </div>
          </div>
        )}

        <div className="absolute bottom-[max(0.25rem,env(safe-area-inset-bottom))] left-1/2 hidden h-1 w-10 -translate-x-1/2 rounded-full bg-white/20 md:block" />
      </div>
    </div>
  );
});

VideoCallModal.displayName = 'VideoCallModal';
export default VideoCallModal;