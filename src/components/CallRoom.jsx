import React, { useEffect, useRef, useState } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2 } from 'lucide-react';
import { twilioVideoService } from '../services/twilioVideoService';
import { useJoinCallMutation, useEndCallMutation } from '../features/api/callApi';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { freezeCallUI, matchesCallId, parseServerStartTimeMs } from '../utils/callEndUtils';
import { unlockBrowserAudio } from '../utils/notificationSound';
import { isVideoCallType, parseTwilioToken, resolveTwilioRoom } from '../utils/twilioTokenUtils';
import { acquireTwilioCallLock, releaseTwilioCallLock } from '../utils/twilioConnectionLock';

const CallRoom = ({ callData, onClose }) => {
    const [seconds, setSeconds] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [callStatus, setCallStatus] = useState('connecting');
    const [actualStartTime, setActualStartTime] = useState(null);
    const [connectionError, setConnectionError] = useState(false);
    const [connectError, setConnectError] = useState(null);
    const [connectAttempt, setConnectAttempt] = useState(0);
    const [currentBilling, setCurrentBilling] = useState(0);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const timerRef = useRef(null);
    const isConnectingRef = useRef(false);
    const hasConnectedRef = useRef(false);
    const isEndingRef = useRef(false);
    const callIdRef = useRef(callData?.callId ?? null);
    const actualStartTimeRef = useRef(null);
    const onCloseRef = useRef(onClose);
    const callDataRef = useRef(callData);

    callIdRef.current = callData?.callId ?? callIdRef.current;
    actualStartTimeRef.current = actualStartTime;
    onCloseRef.current = onClose;
    callDataRef.current = callData;

    const { user, token } = useSelector(state => state.auth);
    const [joinCall] = useJoinCallMutation();
    const [endCall] = useEndCallMutation();

    const isVideoCall = isVideoCallType(callData?.callType);
    const callId = callData?.callId;

    const formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    useEffect(() => {
        unlockBrowserAudio();
    }, []);

    useEffect(() => {
        if (!user?.id || !token || !callId) return;

        const handleCallEnding = (data) => {
            if (!matchesCallId(data, callIdRef.current)) return;
            if (callStatus === 'ending') return;
            const startMs = parseServerStartTimeMs(data.serverStartTime);
            if (startMs != null) setActualStartTime(startMs);
            freezeCallUI({
                timerRef,
                twilioVideoService,
                setSeconds,
                setCurrentBilling,
                setCallStatus,
                actualStartTime: startMs ?? actualStartTimeRef.current,
                durationSeconds: data.durationSeconds,
                totalCost: data.totalCost,
            });
        };

        const handleCallEnded = (data) => {
            if (!matchesCallId(data, callIdRef.current)) return;
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            twilioVideoService.disconnect();
            hasConnectedRef.current = false;
            if (data?.durationSeconds != null) setSeconds(data.durationSeconds);
            if (data?.totalCost != null) setCurrentBilling(parseFloat(data.totalCost));
            toast.success('Call ended');
            setTimeout(() => onCloseRef.current(), 500);
        };

        const onCallEnding = (e) => handleCallEnding(e.detail);
        const onCallEnded = (e) => handleCallEnded(e.detail);
        window.addEventListener('rtcall:call_ending', onCallEnding);
        window.addEventListener('rtcall:call_ended', onCallEnded);

        return () => {
            window.removeEventListener('rtcall:call_ending', onCallEnding);
            window.removeEventListener('rtcall:call_ended', onCallEnded);
        };
    }, [user?.id, token, callId, callStatus]);

    useEffect(() => {
        if (!callId || hasConnectedRef.current || isConnectingRef.current) return;
        if (!acquireTwilioCallLock(callId)) return;

        let cancelled = false;

        const waitForRef = (ref, maxMs = 8000) => new Promise((resolve, reject) => {
            const start = Date.now();
            const check = () => {
                if (cancelled) return;
                if (ref.current) {
                    resolve(ref.current);
                    return;
                }
                if (Date.now() - start > maxMs) {
                    reject(new Error('Media element not ready'));
                    return;
                }
                requestAnimationFrame(check);
            };
            check();
        });

        const connectToCall = async () => {
            if (isConnectingRef.current || hasConnectedRef.current) return;
            isConnectingRef.current = true;

            try {
                setCallStatus('connecting');
                setConnectionError(false);
                setConnectError(null);
                unlockBrowserAudio();

                // Always fetch a fresh token from the API the app is using (avoids stale/wrong accept token).
                const result = await joinCall(callId).unwrap();
                let tokenToUse = result?.token;
                let roomName = result?.call?.roomName || callDataRef.current?.roomName;
                const startTime = result?.call?.startTime || callDataRef.current?.startTime;

                if (!tokenToUse) {
                    throw new Error('Server did not return a Twilio token');
                }

                roomName = resolveTwilioRoom(tokenToUse, roomName);
                if (!roomName) {
                    throw new Error('Could not resolve Twilio room name');
                }

                const tokenInfo = parseTwilioToken(tokenToUse);
                if (tokenInfo?.expired) {
                    throw new Error('Twilio token expired — please try again');
                }

                if (cancelled) return;

                if (startTime) {
                    setActualStartTime(parseServerStartTimeMs(startTime) ?? Date.now());
                } else {
                    setActualStartTime(Date.now());
                }

                if (isVideoCall) {
                    setCallStatus('active');
                    const remoteEl = await waitForRef(remoteVideoRef);
                    const localEl = await waitForRef(localVideoRef).catch(() => null);
                    if (cancelled) return;

                    try {
                        await twilioVideoService.connectVideo(tokenToUse, roomName, localEl, remoteEl);
                        hasConnectedRef.current = true;
                        toast.success('Video call connected');
                    } catch (videoError) {
                        console.warn('Video failed, falling back to audio:', videoError);
                        setConnectionError(true);
                        if (cancelled) return;
                        await twilioVideoService.connectAudio(tokenToUse, roomName);
                        hasConnectedRef.current = true;
                        toast('Connected with audio only', { icon: '📞' });
                    }
                } else {
                    if (cancelled) return;
                    await twilioVideoService.connectAudio(tokenToUse, roomName);
                    if (cancelled) return;
                    hasConnectedRef.current = true;
                    setCallStatus('active');
                    toast.success('Audio call connected');
                }
            } catch (error) {
                const tokenInfo = parseTwilioToken(callDataRef.current?.token);
                console.error('Failed to connect to call:', {
                    message: error?.message,
                    callId,
                    api: process.env.REACT_APP_API_BASE_URL,
                    tokenIdentity: tokenInfo?.identity,
                    tokenRoom: tokenInfo?.room,
                    tokenIss: tokenInfo?.iss,
                });

                if (!cancelled) {
                    const isAuthError = String(error?.message || '').toLowerCase().includes('authorization');
                    const msg = isAuthError
                        ? 'Twilio rejected the token. Check server TWILIO_API_KEY + TWILIO_API_SECRET match the same Twilio account.'
                        : (error?.data?.message || error?.message || 'Failed to connect to call');
                    setConnectError(msg);
                    setCallStatus('failed');
                    toast.error(msg);
                }
            } finally {
                isConnectingRef.current = false;
            }
        };

        connectToCall();

        return () => {
            cancelled = true;
            isConnectingRef.current = false;
            releaseTwilioCallLock(callId);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            if (hasConnectedRef.current) {
                twilioVideoService.disconnect();
                hasConnectedRef.current = false;
            }
        };
    }, [callId, isVideoCall, joinCall, connectAttempt]);

    useEffect(() => {
        if (callStatus === 'active' && actualStartTime) {
            if (timerRef.current) clearInterval(timerRef.current);

            timerRef.current = setInterval(() => {
                const start = actualStartTimeRef.current;
                if (!start) return;
                const diffSeconds = Math.floor((Date.now() - start) / 1000);
                setSeconds(diffSeconds);
                const pricePerSecond = 2.5 / 60;
                setCurrentBilling(Number((diffSeconds * pricePerSecond).toFixed(2)));
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [callStatus, actualStartTime]);

    useEffect(() => {
        if (!hasConnectedRef.current) return;
        if (isMuted) twilioVideoService.mute();
        else twilioVideoService.unmute();
    }, [isMuted]);

    useEffect(() => {
        if (!hasConnectedRef.current) return;
        if (isVideoOff) twilioVideoService.disableVideo();
        else twilioVideoService.enableVideo();
    }, [isVideoOff]);

    const handleRetryConnect = () => {
        hasConnectedRef.current = false;
        isConnectingRef.current = false;
        setConnectError(null);
        setCallStatus('connecting');
        setConnectAttempt((n) => n + 1);
    };

    const handleEndCall = async () => {
        if (isEndingRef.current) return;
        isEndingRef.current = true;

        freezeCallUI({
            timerRef,
            twilioVideoService,
            setSeconds,
            setCurrentBilling,
            setCallStatus,
            actualStartTime: actualStartTimeRef.current,
        });
        hasConnectedRef.current = false;

        try {
            if (callIdRef.current) {
                const result = await endCall(callIdRef.current).unwrap();
                if (result?.durationSeconds != null) setSeconds(result.durationSeconds);
                if (result?.totalCost != null) setCurrentBilling(parseFloat(result.totalCost));
            }
            toast.success('Call ended');
            onCloseRef.current();
        } catch (error) {
            console.error('Failed to end call:', error);
            onCloseRef.current();
        }
    };

    if (isVideoCall) {
        return (
            <div className="fixed inset-0 bg-black z-[10000]">
                <div className="relative h-full">
                    <div ref={remoteVideoRef} className="w-full h-full bg-gray-900 flex items-center justify-center">
                        {callStatus === 'connecting' && (
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-400 mx-auto mb-4" />
                                <p className="text-white text-lg">Connecting...</p>
                            </div>
                        )}
                        {callStatus === 'failed' && connectError && (
                            <div className="text-center px-6 max-w-lg">
                                <p className="text-red-300 text-lg mb-2">Connection failed</p>
                                <p className="text-white/70 text-sm mb-4">{connectError}</p>
                                <button
                                    type="button"
                                    onClick={handleRetryConnect}
                                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg mr-3"
                                >
                                    Retry
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                        {connectionError && callStatus === 'active' && (
                            <div className="text-center pointer-events-none">
                                <VideoOff size={48} className="text-white/50 mx-auto mb-4" />
                                <p className="text-white">Camera not available</p>
                                <p className="text-white/60 text-sm">Audio only mode</p>
                            </div>
                        )}
                    </div>

                    <div className="absolute bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden shadow-lg border-2 border-white bg-gray-800 z-20">
                        <div ref={localVideoRef} className="w-full h-full" />
                        {isVideoOff && (
                            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                                <VideoOff size={24} className="text-white/60" />
                            </div>
                        )}
                    </div>

                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg z-20">
                        <p className="text-white font-semibold">{callData?.callerName || 'Unknown'}</p>
                        <p className="text-white/70 text-sm">{formatTime(seconds)} · €{currentBilling.toFixed(2)}</p>
                    </div>

                    <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-20">
                        <button
                            type="button"
                            onClick={() => setIsMuted(!isMuted)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                        >
                            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsVideoOff(!isVideoOff)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                        >
                            {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                        </button>
                        <button
                            type="button"
                            onClick={handleEndCall}
                            className="w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg"
                        >
                            <PhoneOff size={24} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000]">
            <div className="bg-[#2D2D2D] w-full max-w-md rounded-2xl p-8 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-4xl font-bold mb-4">
                    {callData?.callerName?.charAt(0) || 'C'}
                </div>

                <h2 className="text-white font-bold text-2xl mb-1">{callData?.callerName || 'Unknown'}</h2>
                <p className="text-green-400 text-sm mb-6">
                    {callStatus === 'ending'
                        ? '● Ending call...'
                        : callStatus === 'failed'
                            ? '● Connection failed'
                            : callStatus === 'active'
                                ? `● ${isVideoCall ? 'Video' : 'Audio'} call in progress`
                                : 'Connecting...'}
                </p>

                {callStatus === 'failed' && connectError && (
                    <div className="bg-red-500/20 border border-red-500/40 text-red-200 text-sm rounded-xl px-4 py-3 mb-6 text-center max-w-sm">
                        {connectError}
                        <p className="text-xs text-red-300/80 mt-2">
                            API: {process.env.REACT_APP_API_BASE_URL || 'not set'}
                        </p>
                    </div>
                )}

                <div className="text-5xl font-bold text-white mb-4 font-mono">
                    {formatTime(seconds)}
                </div>

                <div className="bg-white/10 px-6 py-3 rounded-xl mb-8 text-center">
                    <p className="text-xs text-gray-400 mb-1 uppercase">Current Billing</p>
                    <p className="text-white font-bold text-xl">€{currentBilling.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-6">
                    {callStatus === 'failed' && (
                        <button
                            type="button"
                            onClick={handleRetryConnect}
                            className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold"
                        >
                            Retry
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => setIsMuted(!isMuted)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                    >
                        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>
                    <button
                        type="button"
                        onClick={handleEndCall}
                        className="w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg"
                    >
                        <PhoneOff size={28} />
                    </button>
                    <button type="button" className="w-14 h-14 rounded-full bg-gray-700 text-gray-300 flex items-center justify-center">
                        <Volume2 size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallRoom;
