import React, { memo, useState, useEffect, useRef } from 'react';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
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
} from '../../../features/api/callApi';
import { twilioVideoService } from '../../../services/twilioVideoService';
import toast from 'react-hot-toast';


const LISTENER_KEY = 'video-call-modal';

const VideoCallModal = memo(({ isOpen, onClose, consultant, callData: incomingCallData }) => {
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentBilling, setCurrentBilling] = useState(0);
  const [callState, setCallState] = useState(null);
  const [actualStartTime, setActualStartTime] = useState(null);
  const [isVideoConnected, setIsVideoConnected] = useState(false);

  const { user, token } = useSelector(state => state.auth);
  const [initiateCall, { isLoading: isInitiating }] = useInitiateCallMutation();
  const [endCall, { isLoading: isEnding }] = useEndCallMutation();
  const [cancelCall] = useCancelCallMutation();
  const [acceptCall] = useAcceptCallMutation();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const timerRef = useRef(null);
  const callStateRef = useRef(null);
  const isClosingRef = useRef(false);
  const isAcceptedRef = useRef(false);
  callStateRef.current = callState;
  const hasInitiatedRef = useRef(false);
  // Poll for call status
  const { data: callData } = useGetCallByIdQuery(callState?.callId, {
    skip: !callState?.callId || showFeedback,
    pollingInterval: 2000,
  });

  // Sync call duration from server when call ends
  useEffect(() => {
    if (callData?.data?.durationSeconds && showFeedback === false && !isClosingRef.current) {
      const serverDuration = callData.data.durationSeconds;
      if (serverDuration > 0 && seconds === 0) {
        setSeconds(serverDuration);
        const pricePerSecond = (consultant?.pricePerMinute || 2.5) / 60;
        setCurrentBilling(Number((serverDuration * pricePerSecond).toFixed(2)));
      }
    }
  }, [callData, showFeedback, consultant?.pricePerMinute, seconds]);

  // Timer based on actual start time
  useEffect(() => {
    if (isOpen && !showFeedback && callState?.status === 'active' && actualStartTime && !isClosingRef.current) {
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        if (!isClosingRef.current && callStateRef.current?.status === 'active') {
          const now = Date.now();
          const diffSeconds = Math.floor((now - actualStartTime) / 1000);
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

  // Handle incoming call data (for consultant side)
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

  // Connect video after call is accepted
  const connectVideoAfterAccept = async (callId, roomName, tokenToUse) => {
    if (!tokenToUse || !roomName) {
      console.error('Missing token or roomName for video connection');
      return false;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      await twilioVideoService.connectVideo(
        tokenToUse,
        roomName,
        localVideoRef.current,
        remoteVideoRef.current
      );
      setIsVideoConnected(true);
      return true;
    } catch (err) {
      console.error('❌ Video connect error:', err);
      toast.error('Failed to connect video, but audio may work');
      return false;
    }
  };

  // Socket listeners
  useEffect(() => {
    if (!isOpen || !user?.id || !token) return;

    socketService.connect(user.id, token);

    const handleCallAccepted = async (data) => {
      if (isClosingRef.current || isAcceptedRef.current) return;
      isAcceptedRef.current = true;

      const startTime = data.actualStartTime ? new Date(data.actualStartTime).getTime() : Date.now();
      setActualStartTime(startTime);
      setSeconds(0);
      setCurrentBilling(0);

      setCallState(prev => ({
        ...prev,
        status: 'active',
        roomName: data.roomName || prev?.roomName,
        callId: data.callId || prev?.callId,
        userToken: data.token || prev?.userToken,
      }));

      toast.success('Call accepted! Connecting video...');

      const currentState = callStateRef.current;
      const roomName = data.roomName || currentState?.roomName;
      let tokenToUse = data.token || currentState?.userToken;

      // If no token, accept via API
      if (!tokenToUse && (data.callId || currentState?.callId)) {
        const acceptCallId = data.callId || currentState?.callId;
        try {
          const acceptResult = await acceptCall(acceptCallId).unwrap();
          tokenToUse = acceptResult?.data?.token || acceptResult?.token;

          setCallState(prev => prev ? { ...prev, userToken: tokenToUse } : null);
        } catch (err) {
          console.error('Failed to accept call:', err);
          toast.error('Failed to accept call');
          isAcceptedRef.current = false;
          return;
        }
      }

      // ✅ Connect to Twilio room (handles both audio AND video)
      if (tokenToUse && roomName) {
        await connectVideoAfterAccept(data.callId || currentState?.callId, roomName, tokenToUse);
      }
    };

    const handleCallRejected = (data) => {
      if (isClosingRef.current) return;

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      toast.error('Call was rejected by consultant');
      setTimeout(() => {
        if (!isClosingRef.current) closeAll();
      }, 500);
    };

    const handleCallEnded = (data) => {
      if (isClosingRef.current) return;

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      twilioVideoService.disconnect();

      const finalSeconds = data?.durationSeconds || seconds;
      setSeconds(finalSeconds);

      if (finalSeconds > 0) {
        setShowFeedback(true);
      } else {
        setTimeout(() => {
          if (!isClosingRef.current) closeAll();
        }, 500);
      }
    };

    socketService.on('call_accepted', LISTENER_KEY, handleCallAccepted);
    socketService.on('call_rejected', LISTENER_KEY, handleCallRejected);
    socketService.on('call_ended', LISTENER_KEY, handleCallEnded);

    return () => {
      socketService.off('call_accepted', LISTENER_KEY);
      socketService.off('call_rejected', LISTENER_KEY);
      socketService.off('call_ended', LISTENER_KEY);
      isAcceptedRef.current = false;
    };
  }, [isOpen, user?.id, token, acceptCall]);

  // Initiate call (caller side)
  // useEffect(() => {
  //   if (!isOpen || callState || !consultant || isInitiating || incomingCallData || isClosingRef.current) return;

  //   const startCall = async () => {
  //     try {
  //       const consultantUserId = consultant.user?.id || consultant.id;

  //       if (!consultantUserId) {
  //         toast.error('Consultant ID not found');
  //         closeAll();
  //         return;
  //       }

  //       const response = await initiateCall({
  //         consultantId: consultantUserId,
  //         callType: 'VIDEO',
  //       }).unwrap();

  //       const callObj = response?.data?.call || response?.call;
  //       const tokensObj = response?.data?.tokens || response?.tokens;

  //       setCallState({
  //         callId: callObj.id,
  //         roomName: callObj.roomName,
  //         userToken: tokensObj.user.token,
  //         status: 'pending',
  //         isIncoming: false,
  //       });

  //       toast('Calling consultant...', { icon: '📹' });
  //     } catch (err) {
  //       console.error('❌ initiateCall error:', err);
  //       toast.error(err?.data?.message || 'Failed to start video call');
  //       closeAll();
  //     }
  //   };

  //   startCall();
  // }, [isOpen, consultant, incomingCallData]);

  useEffect(() => {
    if (!isOpen || !consultant || incomingCallData || isClosingRef.current) return;

    // ✅ HARD STOP DUPLICATE CALLS
    if (hasInitiatedRef.current) return;
    hasInitiatedRef.current = true;

    const startCall = async () => {
      try {
        const consultantUserId = consultant.user?.id || consultant.id;

        if (!consultantUserId) {
          toast.error('Consultant ID not found');
          closeAll();
          return;
        }

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

        // ✅ allow retry
        hasInitiatedRef.current = false;

        toast.error(err?.data?.message || 'Failed to start video call');
        closeAll();
      }
    };

    startCall();
  }, [isOpen, consultant, incomingCallData]);

  const handleEndCall = async () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    twilioVideoService.disconnect();

    try {
      if (callStateRef.current?.callId) {
        if (callStateRef.current.status === 'pending') {
          await cancelCall(callStateRef.current.callId).unwrap();
          closeAll();
        } else {
          const result = await endCall(callStateRef.current.callId).unwrap();

          const finalDuration = result?.data?.durationSeconds || result?.durationSeconds || seconds;
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
      if (seconds > 0) {
        setShowFeedback(true);
        isClosingRef.current = false;
      } else {
        closeAll();
      }
    }
  };

  const handleAcceptCall = async () => {
    if (!callState?.callId || isClosingRef.current) return;

    try {
      const result = await acceptCall(callState.callId).unwrap();

      const tokenToUse = result?.data?.token || result?.token;
      const roomName = result?.data?.call?.roomName || callState.roomName;

      if (tokenToUse && roomName) {
        setCallState(prev => ({
          ...prev,
          userToken: tokenToUse,
          status: 'active',
        }));

        setActualStartTime(Date.now());
        toast.success('Call accepted, connecting...');

        // ✅ Connect to Twilio room (handles both audio AND video)
        await connectVideoAfterAccept(callState.callId, roomName, tokenToUse);
      }
    } catch (err) {
      console.error('Failed to accept call:', err);
      toast.error('Failed to accept call');
    }
  };

  const closeAll = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
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
        {/* Remote Video (full background) */}
        <div
          ref={remoteVideoRef}
          className="absolute inset-0 w-full h-full bg-gray-800"
        >
          {callState?.status !== 'active' && (
            <div className="w-full h-full flex flex-col items-center justify-center">
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

          {callState?.status === 'active' && !isVideoConnected && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-400 mx-auto mb-4" />
                <p className="text-white">Connecting video...</p>
              </div>
            </div>
          )}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

        {/* Local Video (PiP) */}
        {callState?.status === 'active' && (
          <div className="absolute top-4 right-4 w-20 h-28 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg bg-gray-700 z-10">
            <div ref={localVideoRef} className="w-full h-full" />
            {isVideoOff && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <VideoOff size={20} className="text-white/60" />
              </div>
            )}
          </div>
        )}

        {/* Top Info Bar */}
        <div className="absolute top-4 left-4 z-10">
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
        </div>

        {/* Bottom Controls */}
        {callState?.status === 'active' && (
          <div className="absolute bottom-8 left-0 right-0 z-10">
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