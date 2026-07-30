import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { MessageSquare, Check, X, Volume2, VolumeX } from 'lucide-react';
import { socketService } from '../services/socketService';
import { useAcceptSessionMutation, useDeclineSessionMutation } from '../features/api/chatApi';
import {
    playNotificationRingtone,
    stopNotificationRingtone,
} from '../utils/notificationSound';
import toast from 'react-hot-toast';

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
            playNotificationRingtone();

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
            toast.success('Chat request accepted — session started');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to accept chat request');
        }
    };

    const handleDecline = async () => {
        if (!incomingChat?.conversationId) return;
        stopNotificationRingtone();
        try {
            await declineSession(incomingChat.conversationId).unwrap();
            toast('Chat request declined');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to decline chat request');
        } finally {
            setIncomingChat(null);
        }
    };

    if (!incomingChat) return null;

    return (
        <div className="fixed top-4 right-4 z-[9998]">
            <div className="bg-white rounded-2xl shadow-2xl w-96 overflow-hidden border-l-4 border-[#6E35AE]">
                <div className="bg-gradient-to-r from-[#F5F1FD] to-white p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-lg text-gray-800">💬 New Chat Request</h3>
                        <div className="flex gap-1">
                            {[0, 150, 300].map(d => (
                                <div key={d} className="w-2 h-2 bg-[#6E35AE] rounded-full animate-pulse"
                                    style={{ animationDelay: `${d}ms` }} />
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#6E35AE] to-[#9B59B6] flex items-center justify-center text-white">
                            <MessageSquare size={28} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">{incomingChat.customerName || 'Customer'}</p>
                            <p className="text-sm text-gray-500">Wants to start a {incomingChat.sessionType || 'CHAT'} session</p>
                            <span className="text-xs bg-[#F5F1FD] text-[#6E35AE] px-2 py-0.5 rounded-full mt-1 inline-block">
                                €{incomingChat.pricePerMinute || '2.50'}/min
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleAccept} disabled={isAccepting}
                            className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2">
                            <Check size={18} />
                            {isAccepting ? 'Accepting...' : 'Accept'}
                        </button>
                        <button onClick={handleDecline} disabled={isDeclining}
                            className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2">
                            <X size={18} />
                            Decline
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsMuted(!isMuted)}
                            className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center"
                        >
                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
