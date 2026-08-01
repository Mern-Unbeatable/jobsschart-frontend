import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { MessageSquare, Check, X, Volume2, VolumeX } from 'lucide-react';
import { socketService } from '../services/socketService';
import { useAcceptSessionMutation, useDeclineSessionMutation } from '../features/api/chatApi';
import {
    playChatRingtone,
    stopNotificationRingtone,
    unlockBrowserAudio,
    setRingtoneMuted,
    isRingtoneMuted,
} from '../utils/notificationSound';
import toast from 'react-hot-toast';
import { responsiveToastOptions } from '../utils/responsiveToast';
import { shouldShowNotification } from '../utils/notificationDedupe';
import NotificationShell, {
    NotificationHeader,
    NotificationBody,
    NotificationActions,
    NotificationActionButton,
    NotificationIconButton,
} from './notifications/NotificationShell';

const LISTENER_KEY = 'incoming-chat-notification';

export const IncomingChatNotification = () => {
    const [incomingChat, setIncomingChat] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const { user, token, isAuthenticated } = useSelector(state => state.auth);
    const [acceptSession, { isLoading: isAccepting }] = useAcceptSessionMutation();
    const [declineSession, { isLoading: isDeclining }] = useDeclineSessionMutation();

    const isConsultant = user?.role === 'CONSULTANT' || user?.role === 'ADMIN';
    const incomingChatRef = useRef(null);
    incomingChatRef.current = incomingChat;

    useEffect(() => {
        if (!isAuthenticated || !user?.id || !token || !isConsultant) return;

        const handleIncoming = (data) => {
            setIncomingChat(data);
            unlockBrowserAudio();
            playChatRingtone();

            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                new Notification('💬 New Chat Request', {
                    body: `${data.customerName || 'A customer'} wants to start a chat`,
                    icon: '/logo.webp',
                    requireInteraction: true,
                });
            }
        };

        socketService.on('incoming_chat_request', LISTENER_KEY, handleIncoming);
        socketService.on('chat_request_pending', LISTENER_KEY, (data) => {
            if (data.conversationId) handleIncoming(data);
        });
        socketService.on('chat_request_declined', LISTENER_KEY, () => {
            setIncomingChat(null);
            stopNotificationRingtone();
        });
        socketService.on('session_started', LISTENER_KEY, (data) => {
            if (incomingChatRef.current?.conversationId === data.conversationId) {
                setIncomingChat(null);
                stopNotificationRingtone();
            }
        });
        socketService.on('chat_request_accepted', LISTENER_KEY, (data) => {
            if (incomingChatRef.current?.conversationId === data.conversationId) {
                setIncomingChat(null);
                stopNotificationRingtone();
            }
        });

        if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        return () => {
            socketService.off('incoming_chat_request', LISTENER_KEY);
            socketService.off('chat_request_pending', LISTENER_KEY);
            socketService.off('chat_request_declined', LISTENER_KEY);
            socketService.off('session_started', LISTENER_KEY);
            socketService.off('chat_request_accepted', LISTENER_KEY);
            stopNotificationRingtone();
        };
    }, [isAuthenticated, user?.id, token, isConsultant]);

    const handleAccept = async () => {
        if (!incomingChat?.conversationId) return;
        stopNotificationRingtone();
        try {
            await acceptSession(incomingChat.conversationId).unwrap();
            setIncomingChat(null);
            if (shouldShowNotification(`session-accepted:${incomingChat.conversationId}`, 5000)) {
                toast.success('Chat request accepted — session started', responsiveToastOptions());
            }
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to accept chat request', responsiveToastOptions());
        }
    };

    const handleDecline = async () => {
        if (!incomingChat?.conversationId) return;
        stopNotificationRingtone();
        try {
            await declineSession(incomingChat.conversationId).unwrap();
            toast('Chat request declined', responsiveToastOptions());
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to decline chat request', responsiveToastOptions());
        } finally {
            setIncomingChat(null);
        }
    };

    const toggleMute = () => {
        setIsMuted((prev) => {
            const next = !prev;
            setRingtoneMuted(next);
            if (next) {
                stopNotificationRingtone();
            } else if (incomingChat) {
                unlockBrowserAudio();
                playChatRingtone();
            }
            return next;
        });
    };

    if (!incomingChat) return null;

    const sessionLabel = incomingChat.sessionType || 'CHAT';

    return (
        <NotificationShell accent="purple" zIndex={9998}>
            <NotificationHeader title="💬 New Chat Request" pulseColor="bg-[#6E35AE]" />
            <NotificationBody
                avatar={
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#6E35AE] to-[#9B59B6] text-white sm:h-14 sm:w-14">
                        <MessageSquare className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                }
                title={incomingChat.customerName || 'Customer'}
                subtitle={`Wants to start a ${sessionLabel} session`}
                badge={
                    <span className="inline-block rounded-full bg-[#F5F1FD] px-2 py-0.5 text-[10px] font-medium text-[#6E35AE] sm:text-xs">
                        €{incomingChat.pricePerMinute || '2.50'}/min
                    </span>
                }
            />
            <NotificationActions>
                <NotificationActionButton
                    onClick={handleAccept}
                    disabled={isAccepting}
                    variant="primary"
                    icon={Check}
                >
                    {isAccepting ? 'Accepting...' : 'Accept'}
                </NotificationActionButton>
                <NotificationActionButton
                    onClick={handleDecline}
                    disabled={isDeclining}
                    variant="danger"
                    icon={X}
                >
                    Decline
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
