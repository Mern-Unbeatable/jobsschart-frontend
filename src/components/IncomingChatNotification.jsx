import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { MessageSquare, Check, X, Volume2, VolumeX } from 'lucide-react';
import { socketService } from '../services/socketService';
import { useAcceptSessionMutation, useDeclineSessionMutation } from '../features/api/chatApi';
import toast from 'react-hot-toast';

const LISTENER_KEY = 'incoming-chat-notification';

export const IncomingChatNotification = () => {
    const [incomingChat, setIncomingChat] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(null);
    const { user, token, isAuthenticated } = useSelector(state => state.auth);
    const [acceptSession, { isLoading: isAccepting }] = useAcceptSessionMutation();
    const [declineSession, { isLoading: isDeclining }] = useDeclineSessionMutation();

    const isConsultant = user?.role === 'CONSULTANT' || user?.role === 'ADMIN';

    useEffect(() => {
        audioRef.current = new Audio('/ringtone.mp3');
        audioRef.current.loop = true;
        return () => { audioRef.current?.pause(); };
    }, []);

    const incomingChatRef = useRef(null);
    incomingChatRef.current = incomingChat;

    const stopSound = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated || !user?.id || !token || !isConsultant) return;

        const handleIncoming = (data) => {
            setIncomingChat(data);
            if (audioRef.current) {
                audioRef.current.play().catch(() => {
                    try {
                        const ctx = new (window.AudioContext || window.webkitAudioContext)();
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.frequency.value = 880;
                        gain.gain.value = 0.15;
                        osc.start();
                        setTimeout(() => osc.stop(), 200);
                    } catch { /* ignore */ }
                });
            }

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
            audioRef.current?.pause();
            audioRef.current.currentTime = 0;
        });
        socketService.on('session_started', LISTENER_KEY, (data) => {
            if (incomingChatRef.current?.conversationId === data.conversationId) {
                setIncomingChat(null);
                stopSound();
            }
        });
        socketService.on('chat_request_accepted', LISTENER_KEY, (data) => {
            if (incomingChatRef.current?.conversationId === data.conversationId) {
                setIncomingChat(null);
                stopSound();
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
        };
    }, [isAuthenticated, user?.id, token, isConsultant, stopSound]);

    const handleAccept = async () => {
        if (!incomingChat?.conversationId) return;
        stopSound();
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
        stopSound();
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
                        <button onClick={() => { audioRef.current.volume = isMuted ? 1 : 0; setIsMuted(!isMuted); }}
                            className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center">
                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
