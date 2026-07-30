import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Phone, PhoneOff, User, Volume2, VolumeX } from 'lucide-react';
import { socketService } from '../services/socketService';
import { useAcceptCallMutation, useRejectCallMutation } from '../features/api/callApi';
import {
    playNotificationRingtone,
    stopNotificationRingtone,
    unlockBrowserAudio,
} from '../utils/notificationSound';
import toast from 'react-hot-toast';

const LISTENER_KEY = 'incoming-call-notification';

export const IncomingCallNotification = () => {
    const [incomingCall, setIncomingCall] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const reconnectTimerRef = useRef(null);
    const { user, token, isAuthenticated } = useSelector(state => state.auth);
    const [acceptCall, { isLoading: isAccepting }] = useAcceptCallMutation();
    const [rejectCall, { isLoading: isRejecting }] = useRejectCallMutation();

    const isConsultant = user?.role === 'CONSULTANT' || user?.role === 'ADMIN';

    const dismissIncoming = useCallback(() => {
        setIncomingCall(null);
        stopNotificationRingtone();
    }, []);

    useEffect(() => {
        if (!isAuthenticated || !user?.id || !token || !isConsultant) return;

        const setupSocket = () => {
            socketService.connect(user.id, token);

            socketService.on('incoming_call', LISTENER_KEY, (callData) => {
                setIncomingCall(callData);
                playNotificationRingtone();

                if (typeof Notification !== 'undefined') {
                    if (Notification.permission === 'granted') {
                        new Notification('Incoming Call', {
                            body: `${callData.callerName} is calling (${callData.callType})`,
                            icon: '/logo.webp',
                            requireInteraction: true,
                            tag: `call-${callData.callId}`,
                        });
                    } else if (Notification.permission === 'default') {
                        Notification.requestPermission();
                    }
                }
            });

            socketService.on('call_rejected', LISTENER_KEY, dismissIncoming);
        };

        const onCallEnding = () => dismissIncoming();
        const onCallEnded = () => dismissIncoming();
        const onCallRejectedEvt = () => dismissIncoming();

        window.addEventListener('rtcall:call_ending', onCallEnding);
        window.addEventListener('rtcall:call_ended', onCallEnded);
        window.addEventListener('rtcall:call_rejected', onCallRejectedEvt);

        setupSocket();

        const interval = setInterval(() => {
            if (!socketService.isConnected() && !reconnectTimerRef.current) {
                reconnectTimerRef.current = setTimeout(() => {
                    reconnectTimerRef.current = null;
                    if (isAuthenticated && user?.id && token) {
                        socketService.connect(user.id, token);
                    }
                }, 2000);
            }
        }, 3000);

        if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        return () => {
            clearInterval(interval);
            if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
            window.removeEventListener('rtcall:call_ending', onCallEnding);
            window.removeEventListener('rtcall:call_ended', onCallEnded);
            window.removeEventListener('rtcall:call_rejected', onCallRejectedEvt);
            socketService.off('incoming_call', LISTENER_KEY);
            socketService.off('call_rejected', LISTENER_KEY);
            stopNotificationRingtone();
        };
    }, [isAuthenticated, user?.id, token, isConsultant, dismissIncoming]);

    const handleAccept = async () => {
        if (!incomingCall) return;
        unlockBrowserAudio();
        stopNotificationRingtone();

        try {
            const result = await acceptCall(incomingCall.callId).unwrap();
            const freshToken = result?.consultantToken || result?.token;
            const roomName = result?.call?.roomName || incomingCall.roomName;
            const callType = result?.call?.callType || incomingCall.callType;

            window.dispatchEvent(new CustomEvent('open-call-window', {
                detail: {
                    callId: incomingCall.callId,
                    roomName,
                    token: freshToken,
                    callType,
                    callerName: incomingCall.callerName,
                },
            }));

            setIncomingCall(null);
            toast.success('Call connected!');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to accept call');
        }
    };

    const handleReject = async () => {
        if (!incomingCall) return;
        stopNotificationRingtone();
        try {
            await rejectCall(incomingCall.callId).unwrap();
            toast('Call rejected');
        } catch (err) {
            console.error('Reject error:', err);
        } finally {
            setIncomingCall(null);
        }
    };

    const toggleMute = () => {
        setIsMuted((prev) => {
            const next = !prev;
            const audio = document.querySelector('#notification-ringtone-preview');
            if (audio) audio.volume = next ? 0 : 1;
            return next;
        });
    };

    if (!isConsultant || !incomingCall) return null;

    return (
        <div className="fixed top-4 right-4 z-[9999]">
            <div className="bg-white rounded-2xl shadow-2xl w-96 overflow-hidden border-l-4 border-green-500">
                <div className="bg-gradient-to-r from-green-50 to-white p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-lg text-gray-800">Incoming Call</h3>
                        <div className="flex gap-1">
                            {[0, 150, 300].map((d) => (
                                <div
                                    key={d}
                                    className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                                    style={{ animationDelay: `${d}ms` }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {incomingCall.callerName?.charAt(0)?.toUpperCase() || <User size={32} />}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 text-lg">{incomingCall.callerName}</p>
                            <p className="text-sm text-gray-500">{incomingCall.callerEmail}</p>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                                {incomingCall.callType} Call
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleAccept}
                            disabled={isAccepting}
                            className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                        >
                            <Phone size={18} />
                            {isAccepting ? 'Connecting...' : 'Accept'}
                        </button>
                        <button
                            type="button"
                            onClick={handleReject}
                            disabled={isRejecting}
                            className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                        >
                            <PhoneOff size={18} />
                            Reject
                        </button>
                        <button
                            type="button"
                            onClick={toggleMute}
                            className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all"
                        >
                            {isMuted ? (
                                <VolumeX size={18} className="text-gray-600" />
                            ) : (
                                <Volume2 size={18} className="text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
