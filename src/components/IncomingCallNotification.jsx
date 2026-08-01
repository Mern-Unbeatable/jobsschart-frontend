import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Phone, PhoneOff, User, Volume2, VolumeX } from 'lucide-react';
import { socketService } from '../services/socketService';
import { useAcceptCallMutation, useRejectCallMutation } from '../features/api/callApi';
import {
    playCallRingtone,
    stopNotificationRingtone,
    unlockBrowserAudio,
    setRingtoneMuted,
    isRingtoneMuted,
} from '../utils/notificationSound';
import toast from 'react-hot-toast';
import { matchesCallId } from '../utils/callEndUtils';
import { shouldShowNotification } from '../utils/notificationDedupe';
import { responsiveToastOptions } from '../utils/responsiveToast';
import NotificationShell, {
    NotificationHeader,
    NotificationBody,
    NotificationActions,
    NotificationActionButton,
    NotificationIconButton,
} from './notifications/NotificationShell';

const LISTENER_KEY = 'incoming-call-notification';

export const IncomingCallNotification = () => {
    const [incomingCall, setIncomingCall] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const reconnectTimerRef = useRef(null);
    const incomingCallRef = useRef(null);
    incomingCallRef.current = incomingCall;
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
                unlockBrowserAudio();
                playCallRingtone();

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

        const onCallEnding = (e) => {
            if (matchesCallId(e.detail, incomingCallRef.current?.callId)) dismissIncoming();
        };
        const onCallEnded = (e) => {
            if (matchesCallId(e.detail, incomingCallRef.current?.callId)) dismissIncoming();
        };
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
            const callType = (result?.call?.callType || incomingCall.callType || 'PHONE').toUpperCase();

            window.dispatchEvent(new CustomEvent('open-call-window', {
                detail: {
                    callId: incomingCall.callId,
                    roomName,
                    token: freshToken,
                    callType,
                    callerName: incomingCall.callerName,
                    startTime: result?.call?.startTime,
                },
            }));

            setIncomingCall(null);
            if (shouldShowNotification(`call-connected:${incomingCall.callId}`, 5000)) {
                toast.success('Call connected!', responsiveToastOptions());
            }
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to accept call', responsiveToastOptions());
        }
    };

    const handleReject = async () => {
        if (!incomingCall) return;
        stopNotificationRingtone();
        try {
            await rejectCall(incomingCall.callId).unwrap();
            toast('Call rejected', responsiveToastOptions());
        } catch (err) {
            console.error('Reject error:', err);
        } finally {
            setIncomingCall(null);
        }
    };

    const toggleMute = () => {
        setIsMuted((prev) => {
            const next = !prev;
            setRingtoneMuted(next);
            if (next) {
                stopNotificationRingtone();
            } else if (incomingCall) {
                unlockBrowserAudio();
                playCallRingtone();
            }
            return next;
        });
    };

    if (!isConsultant || !incomingCall) return null;

    return (
        <NotificationShell accent="green" zIndex={9999}>
            <NotificationHeader title="Incoming Call" pulseColor="bg-green-500" />
            <NotificationBody
                avatar={
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-lg font-bold text-white shadow-lg sm:h-14 sm:w-14 sm:text-xl md:h-16 md:text-2xl">
                        {incomingCall.callerName?.charAt(0)?.toUpperCase() || (
                            <User className="h-7 w-7 sm:h-8 sm:w-8" />
                        )}
                    </div>
                }
                title={incomingCall.callerName || 'Unknown caller'}
                subtitle={incomingCall.callerEmail}
                badge={
                    <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 sm:text-xs">
                        {incomingCall.callType} Call
                    </span>
                }
            />
            <NotificationActions>
                <NotificationActionButton
                    onClick={handleAccept}
                    disabled={isAccepting}
                    variant="primary"
                    icon={Phone}
                >
                    {isAccepting ? 'Connecting...' : 'Accept'}
                </NotificationActionButton>
                <NotificationActionButton
                    onClick={handleReject}
                    disabled={isRejecting}
                    variant="danger"
                    icon={PhoneOff}
                >
                    Reject
                </NotificationActionButton>
                <NotificationIconButton onClick={toggleMute} ariaLabel={isMuted ? 'Unmute ringtone' : 'Mute ringtone'}>
                    {isMuted || isRingtoneMuted() ? (
                        <VolumeX size={16} className="text-gray-600 sm:size-[18px]" />
                    ) : (
                        <Volume2 size={16} className="text-gray-600 sm:size-[18px]" />
                    )}
                </NotificationIconButton>
            </NotificationActions>
        </NotificationShell>
    );
};
