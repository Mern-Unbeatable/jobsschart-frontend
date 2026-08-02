import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Send, Paperclip, ArrowLeft, Search, Phone, Video,
    MessageSquare,
} from 'lucide-react';
import { socketService } from '../../services/socketService';
import {
    useGetConversationsQuery,
    useSendMessageMutation,
    useMarkAsReadMutation,
    useGetOrCreateConversationMutation,
    useStartSessionMutation,
    useEndSessionMutation,
    useAcceptSessionMutation,
    useDeclineSessionMutation,
} from '../../features/api/chatApi';
import toast from 'react-hot-toast';
import { showBalanceWarning } from '../../utils/balanceWarningUtils';
import { shouldShowNotification } from '../../utils/notificationDedupe';
import { responsiveToastOptions } from '../../utils/responsiveToast';
import { formatSessionDuration, formatSessionEndMessage } from '../../utils/formatSessionDuration';
import axios from 'axios';
import MessageBubble from '../../components/chat/MessageBubble';
import ConversationItem from '../../components/chat/ConversationItem';
import BillingBanner from '../../components/chat/BillingBanner';
import SessionSummaryModal from '../../components/chat/SessionSummaryModal';
import StartSessionModal from '../../components/chat/StartSessionModal';
import { useGetMeQuery } from '../../features/api/userApi';
import { updateUser } from '../../features/slices/authSlice';
import { markConsultationCompleted } from '../../utils/consultantChatHistory';

const LISTENER_KEY = 'rtchat';
const PRICE_PER_MINUTE = 2.50;

const parseCreditBalance = (value) => {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : 0;
};

const RealTimeChat = memo(({
    className = '',
    initialOtherUserId = null,
    showSidebar = true,
    onConversationChange = null,
    onSessionEnded = null,
}) => {
    const { user, token } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const walletBalance = useSelector(state => state.auth?.user?.wallet?.creditBalance ?? 0);

    const { data: meData, isFetching: isFetchingMe } = useGetMeQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    });

    const liveWalletBalance = useMemo(() => {
        const fromApi = meData?.user?.wallet?.creditBalance;
        if (fromApi !== undefined && fromApi !== null) {
            return parseCreditBalance(fromApi);
        }
        return parseCreditBalance(walletBalance);
    }, [meData?.user?.wallet?.creditBalance, walletBalance]);

    const isConsultant = user?.role === 'CONSULTANT' || user?.role === 'ADMIN';

    const [activeConv, setActiveConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [showMobileSidebar, setShowMobileSidebar] = useState(true);
    const [typingUsers, setTypingUsers] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);

    // Session state
    const [sessionStatus, setSessionStatus] = useState(null);
    const [sessionType, setSessionType] = useState(null);
    const [sessionStartedAt, setSessionStartedAt] = useState(null);
    const [sessionTotalCost, setSessionTotalCost] = useState(0);
    const [currentBalance, setCurrentBalance] = useState(() => parseCreditBalance(walletBalance));
    const [showStartModal, setShowStartModal] = useState(false);
    const [isEndingSession, setIsEndingSession] = useState(false);
    const [sessionSummary, setSessionSummary] = useState(null);
    const [isStartingSession, setIsStartingSession] = useState(false);
    const [frozenElapsedSeconds, setFrozenElapsedSeconds] = useState(null);

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const forceScrollToBottomRef = useRef(true);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    const typingTimerRef = useRef(null);
    const activeConvRef = useRef(null);
    activeConvRef.current = activeConv;

    const sessionStatusRef = useRef(null);
    sessionStatusRef.current = sessionStatus;

    const isEndingSessionRef = useRef(false);
    isEndingSessionRef.current = isEndingSession;

    const skipSessionEndToastRef = useRef(false);

    const sessionTypeRef = useRef(null);
    sessionTypeRef.current = sessionType;

    const sessionStartedAtRef = useRef(null);
    sessionStartedAtRef.current = sessionStartedAt;

    const { data: conversations = [], refetch: refetchConversations } = useGetConversationsQuery(undefined, {
        skip: !token,
    });
    const [sendMessage] = useSendMessageMutation();
    const [markAsRead] = useMarkAsReadMutation();
    const [getOrCreateConversation] = useGetOrCreateConversationMutation();
    const [startSessionMutation] = useStartSessionMutation();
    const [endSessionMutation] = useEndSessionMutation();
    const [acceptSessionMutation, { isLoading: isAccepting }] = useAcceptSessionMutation();
    const [declineSessionMutation, { isLoading: isDeclining }] = useDeclineSessionMutation();


    const isSessionActive = sessionStatus === 'ACTIVE';
    const isSessionPending = sessionStatus === 'PENDING';
    const isHistoryLocked = isConsultant && (
        sessionStatus === 'ENDED'
        || activeConv?.sessionStatus === 'ENDED'
    );
    // Users can send to start a session (IDLE/ENDED) or while waiting (PENDING); consultants only when ACTIVE
    const canSend = !!inputValue.trim() && !isUploading && !isStartingSession && !isEndingSession
        && sessionStatus !== 'ENDING'
        && (
            (isConsultant && isSessionActive) ||
            (!isConsultant && (isSessionActive || isSessionPending || !sessionStatus || sessionStatus === 'IDLE' || sessionStatus === 'ENDED'))
        );

    const openingConvRef = useRef(false);

    const scrollToBottom = useCallback((behavior = 'auto') => {
        const container = messagesContainerRef.current;
        if (!container) return;
        if (behavior === 'smooth') {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        } else {
            container.scrollTop = container.scrollHeight;
        }
    }, []);

    // ── Join all conversation rooms when list updates ─────────────
    useEffect(() => {
        if (!user?.id || !conversations?.length) return;
        conversations.forEach((c) => socketService.joinConversation(c.id));
    }, [user?.id, conversations]);

    // ── Auto-open conversation from prop ──────────────────────────
    useEffect(() => {
        if (!initialOtherUserId || !user?.id || openingConvRef.current) return;
        openingConvRef.current = true;

        getOrCreateConversation(initialOtherUserId)
            .unwrap()
            .then(conv => {
                if (!conv?.id) return;
                forceScrollToBottomRef.current = true;
                setActiveConv(conv);
                setShowMobileSidebar(false);
                socketService.joinConversation(conv.id);
                if (onConversationChange) onConversationChange(conv.id, conv);
                refetchConversations();
            })
            .catch(() => toast.error('Could not open conversation.'))
            .finally(() => {
                openingConvRef.current = false;
            });
    }, [initialOtherUserId, user?.id]);

    const lockConsultantHistory = useCallback((conversationId) => {
        if (!isConsultant || !conversationId) return;
        setMessages([]);
        markConsultationCompleted(conversationId);
        onSessionEnded?.(conversationId);
    }, [isConsultant, onSessionEnded]);

    // ── Load messages when active conversation changes ────────────
    useEffect(() => {
        if (!activeConv?.id) return;
        forceScrollToBottomRef.current = true;
        setIsLoadingMessages(true);
        setMessages([]);

        const isActive = activeConv.sessionStatus === 'ACTIVE';
        const isPending = activeConv.sessionStatus === 'PENDING';
        const isEnded = activeConv.sessionStatus === 'ENDED';
        setSessionStatus(isActive ? 'ACTIVE' : isPending ? 'PENDING' : isEnded ? 'ENDED' : null);
        setSessionType(activeConv.sessionType || null);
        setSessionTotalCost(parseFloat(activeConv.totalCost || 0));
        setSessionStartedAt(activeConv.startedAt || null);

        if (isConsultant && isEnded) {
            setIsLoadingMessages(false);
            return;
        }

        fetch(
            `${process.env.REACT_APP_API_BASE_URL}/chat/conversations/${activeConv.id}/messages?limit=50`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(async (r) => {
                const data = await r.json();
                if (!r.ok) {
                    if (isConsultant && (r.status === 403 || data?.message?.includes('cannot access chat history'))) {
                        setMessages([]);
                        return;
                    }
                    throw new Error(data?.message || 'Failed to load messages');
                }
                setMessages(data?.data?.messages || []);
            })
            .catch(() => {
                if (isConsultant && isEnded) {
                    setMessages([]);
                }
            })
            .finally(() => setIsLoadingMessages(false));

        markAsRead(activeConv.id);
        socketService.joinConversation(activeConv.id);
    }, [activeConv?.id, activeConv?.sessionStatus, token, markAsRead, isConsultant]);

    // ── Sync wallet balance from API + Redux ──────────────────────
    useEffect(() => {
        setCurrentBalance(liveWalletBalance);
        if (meData?.user?.wallet) {
            dispatch(updateUser({ wallet: meData.user.wallet }));
        }
    }, [liveWalletBalance, meData?.user?.wallet, dispatch]);

    // ── Realtime updates (via ChatSocketBridge window events + direct socket for billing/typing)
    useEffect(() => {
        if (!user?.id) return;

        const appendMessage = (data) => {
            const convId = data.conversationId;
            if (convId !== activeConvRef.current?.id) {
                refetchConversations();
                return;
            }
            setMessages(prev => {
                if (prev.some(m => m.id === data.message.id)) return prev;
                if (
                    data.message.senderId === user.id &&
                    prev.some(m => m.id.startsWith('temp-') && m.senderId === user.id)
                ) {
                    return prev.map(m =>
                        m.id.startsWith('temp-') && m.senderId === user.id ? data.message : m
                    );
                }
                return [...prev, data.message];
            });
            markAsRead(convId);
            refetchConversations();
        };

        const onNewMessage = (e) => appendMessage(e.detail);
        const onNewFile = (e) => appendMessage(e.detail);

        const onChatPending = (e) => {
            const data = e.detail;
            if (data.conversationId === activeConvRef.current?.id) {
                setSessionStatus('PENDING');
                setSessionType(data.sessionType);
                setIsStartingSession(false);
            }
            refetchConversations();
        };

        const onChatDeclined = (e) => {
            const data = e.detail;
            if (data.conversationId === activeConvRef.current?.id) {
                setSessionStatus(null);
                setSessionType(null);
                setSessionStartedAt(null);
                setIsStartingSession(false);
                refetchConversations();
            }
        };

        const onSessionStarted = (e) => {
            const data = e.detail;
            if (sessionStatusRef.current === 'ENDING' || sessionStatusRef.current === 'ENDED') return;
            if (data.conversationId !== activeConvRef.current?.id) {
                refetchConversations();
                return;
            }
            setSessionStatus('ACTIVE');
            setSessionType(data.sessionType);
            setSessionStartedAt(data.startedAt);
            setSessionTotalCost(0);
            setFrozenElapsedSeconds(null);
            setIsStartingSession(false);
            setActiveConv((prev) => prev ? { ...prev, sessionStatus: 'ACTIVE', startedAt: data.startedAt } : prev);
            refetchConversations();
        };

        const onSessionEnding = (e) => {
            const data = e.detail;
            if (data.conversationId !== activeConvRef.current?.id) return;
            if (sessionStatusRef.current === 'ENDED') return;

            const frozen = data.durationSeconds != null
                ? data.durationSeconds
                : (data.endedAt && sessionStartedAtRef.current)
                    ? Math.max(0, Math.floor((new Date(data.endedAt).getTime() - new Date(sessionStartedAtRef.current).getTime()) / 1000))
                    : null;

            setSessionStatus('ENDING');
            if (frozen != null) setFrozenElapsedSeconds(frozen);
        };

        const onSessionEnded = (e) => {
            const data = e.detail;
            if (data.conversationId !== activeConvRef.current?.id) return;
            const wasAlreadyEnded = sessionStatusRef.current === 'ENDED';
            setSessionStatus('ENDED');
            setSessionStartedAt(null);
            setIsEndingSession(false);
            setIsStartingSession(false);
            if (data.durationSeconds != null) setFrozenElapsedSeconds(data.durationSeconds);
            if (data.totalCost != null) setSessionTotalCost(parseFloat(data.totalCost));
            setActiveConv((prev) => prev ? { ...prev, sessionStatus: 'ENDED', startedAt: null } : prev);
            const totalCost = Number(data.totalCost || 0).toFixed(2);
            const durationSeconds = data.durationSeconds != null
                ? data.durationSeconds
                : frozenElapsedSeconds;
            if (!wasAlreadyEnded && !isEndingSessionRef.current && !skipSessionEndToastRef.current) {
                if (shouldShowNotification(`session-ended:${data.conversationId}`, 5000)) {
                    toast.success(
                        formatSessionEndMessage({ durationSeconds, totalCost }),
                        responsiveToastOptions({ duration: 4000 }),
                    );
                }
            }
            skipSessionEndToastRef.current = false;
            if (isConsultant) {
                lockConsultantHistory(data.conversationId);
            }
            if (!isConsultant && !wasAlreadyEnded) {
                setSessionSummary({
                    sessionType: data.sessionType || sessionTypeRef.current,
                    durationSeconds,
                    totalMinutes: Number(data.totalMinutes || 0),
                    totalCost,
                });
            }
            refetchConversations();
        };

        window.addEventListener('rtchat:new_message', onNewMessage);
        window.addEventListener('rtchat:new_file', onNewFile);
        window.addEventListener('rtchat:chat_request_pending', onChatPending);
        window.addEventListener('rtchat:chat_request_declined', onChatDeclined);
        window.addEventListener('rtchat:session_started', onSessionStarted);
        window.addEventListener('rtchat:session_ending', onSessionEnding);
        window.addEventListener('rtchat:session_ended', onSessionEnded);

        socketService.on('user_typing', LISTENER_KEY, (data) => {
            if (data.conversationId === activeConvRef.current?.id && data.userId !== user.id) {
                setTypingUsers(prev => ({ ...prev, [data.userId]: data.isTyping }));
            }
        });

        socketService.on('messages_read', LISTENER_KEY, (data) => {
            if (data.conversationId === activeConvRef.current?.id) {
                setMessages(prev => prev.map(m => m.senderId === user.id ? { ...m, isRead: true } : m));
            }
        });

        socketService.on('billing_tick', LISTENER_KEY, (data) => {
            if (sessionStatusRef.current === 'ENDING' || sessionStatusRef.current === 'ENDED') return;
            if (data.conversationId === activeConvRef.current?.id) {
                setSessionTotalCost(prev => data.amountCharged ? prev + data.amountCharged : prev + PRICE_PER_MINUTE);
                if (data.balanceAfter !== undefined) setCurrentBalance(data.balanceAfter);
            }
        });

        socketService.on('balance_warning', LISTENER_KEY, (data) => {
            if (data.conversationId === activeConvRef.current?.id) {
                showBalanceWarning(data);
            }
        });

        return () => {
            window.removeEventListener('rtchat:new_message', onNewMessage);
            window.removeEventListener('rtchat:new_file', onNewFile);
            window.removeEventListener('rtchat:chat_request_pending', onChatPending);
            window.removeEventListener('rtchat:chat_request_declined', onChatDeclined);
            window.removeEventListener('rtchat:session_started', onSessionStarted);
            window.removeEventListener('rtchat:session_ending', onSessionEnding);
            window.removeEventListener('rtchat:session_ended', onSessionEnded);
            ['user_typing', 'messages_read', 'billing_tick', 'balance_warning']
                .forEach(e => socketService.off(e, LISTENER_KEY));
        };
    }, [user?.id, isConsultant, markAsRead, refetchConversations, lockConsultantHistory]);

    // ── Auto-scroll: open at latest message (WhatsApp-style) ────
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container || isLoadingMessages) return;

        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;

        if (forceScrollToBottomRef.current || isNearBottom) {
            requestAnimationFrame(() => {
                scrollToBottom(forceScrollToBottomRef.current ? 'auto' : 'smooth');
            });
            forceScrollToBottomRef.current = false;
        }
    }, [messages, typingUsers, isLoadingMessages, scrollToBottom]);

    // Catch late layout shifts (images) right after messages load
    useEffect(() => {
        if (isLoadingMessages || messages.length === 0) return;
        const timer = setTimeout(() => scrollToBottom('auto'), 100);
        return () => clearTimeout(timer);
    }, [isLoadingMessages, activeConv?.id, scrollToBottom]);

    // ── Handlers ──────────────────────────────────────────────────

    const handleSelectConversation = useCallback((conv) => {
        forceScrollToBottomRef.current = true;
        setActiveConv(conv);
        setShowMobileSidebar(false);
        setMessages([]);
        setTypingUsers({});
        const status = conv?.sessionStatus;
        setSessionStatus(status === 'ACTIVE' ? 'ACTIVE' : status === 'PENDING' ? 'PENDING' : status === 'ENDED' ? 'ENDED' : null);
        setSessionType(conv?.sessionType || null);
        setSessionStartedAt(conv?.startedAt || null);
        setSessionSummary(null);
        setIsStartingSession(false);
        setIsEndingSession(false);
        if (onConversationChange && conv?.id) onConversationChange(conv.id, conv);
    }, [onConversationChange]);

    const handleSend = useCallback(async () => {
        const text = inputValue.trim();
        if (!text || !activeConvRef.current?.id || isStartingSession || isEndingSession) return;

        // Consultants need active session
        if (isConsultant) {
            if (sessionStatusRef.current !== 'ACTIVE') {
                toast.error(sessionStatusRef.current === 'PENDING'
                    ? 'Please accept the chat request first.'
                    : 'No active session. Wait for the client to start one.');
                return;
            }
            setInputValue('');
            socketService.emit('typing_stop', { conversationId: activeConvRef.current.id });

            const tempId = `temp-${Date.now()}`;
            const optimistic = {
                id: tempId, conversationId: activeConvRef.current.id, senderId: user.id,
                message: text, isRead: false, createdAt: new Date().toISOString(),
                sender: { id: user.id, name: user.name, avatar: user.avatar, role: user.role },
            };
            setMessages(prev => [...prev, optimistic]);
            forceScrollToBottomRef.current = true;

            try {
                const result = await sendMessage({ conversationId: activeConvRef.current.id, message: text }).unwrap();
                if (result?.id) setMessages(prev => prev.map(m => m.id === tempId ? result : m));
                refetchConversations();
            } catch (err) {
                setMessages(prev => prev.filter(m => m.id !== tempId));
                toast.error(err?.data?.message || 'Failed to send message');
            }
            return;
        }

        // User: request session if not active/pending
        if (!isSessionActive && sessionStatusRef.current !== 'PENDING') {
            if (isFetchingMe) {
                toast.error('Loading your balance, please try again.');
                return;
            }
            if (liveWalletBalance < PRICE_PER_MINUTE) {
                toast.error(`Insufficient balance. Minimum €${PRICE_PER_MINUTE} required. Current: €${liveWalletBalance.toFixed(2)}`);
                return;
            }

            setIsStartingSession(true);
            try {
                await startSessionMutation({
                    conversationId: activeConvRef.current.id,
                    sessionType: 'CHAT',
                }).unwrap();

                setSessionStatus('PENDING');
                setSessionType('CHAT');
                toast('Chat request sent — waiting for consultant to accept', responsiveToastOptions({ duration: 4000 }));
            } catch (err) {
                setIsStartingSession(false);
                toast.error(err?.data?.message || 'Failed to send chat request.');
                return;
            }
            setIsStartingSession(false);
        }
        setInputValue('');
        socketService.emit('typing_stop', { conversationId: activeConvRef.current.id });

        const tempId = `temp-${Date.now()}`;
        const optimistic = {
            id: tempId, conversationId: activeConvRef.current.id, senderId: user.id,
            message: text, isRead: false, createdAt: new Date().toISOString(),
            sender: { id: user.id, name: user.name, avatar: user.avatar, role: user.role },
        };
        setMessages(prev => [...prev, optimistic]);
        forceScrollToBottomRef.current = true;

        try {
            const result = await sendMessage({ conversationId: activeConvRef.current.id, message: text }).unwrap();
            if (result?.id) setMessages(prev => prev.map(m => m.id === tempId ? result : m));
            refetchConversations();
        } catch (err) {
            setMessages(prev => prev.filter(m => m.id !== tempId));
            toast.error(err?.data?.message || 'Failed to send message');
        }
    }, [inputValue, user, sendMessage, refetchConversations, isSessionActive, isConsultant, startSessionMutation, liveWalletBalance, isFetchingMe, isStartingSession, isEndingSession]);

    const handleFileUpload = useCallback(async (file) => {
        if (!file || !activeConvRef.current?.id) return;
        if (!isSessionActive) { toast.error('No active session.'); return; }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/chat/upload`,
                formData,
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
            );
            const { fileUrl, fileName, fileType, fileSize } = res.data.data;
            const tempId = `temp-${Date.now()}`;
            const optimistic = {
                id: tempId, conversationId: activeConvRef.current.id, senderId: user.id,
                fileUrl, fileName, fileType, fileSize, isRead: false, createdAt: new Date().toISOString(),
                sender: { id: user.id, name: user.name, avatar: user.avatar, role: user.role },
            };
            setMessages(prev => [...prev, optimistic]);
            forceScrollToBottomRef.current = true;
            socketService.emit('send_file', { conversationId: activeConvRef.current.id, fileUrl, fileName, fileType, fileSize }, (r) => {
                if (r?.success) setMessages(prev => prev.map(m => m.id === tempId ? r.message : m));
            });
            refetchConversations();
        } catch { toast.error('File upload failed'); }
        finally { setIsUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
    }, [token, user, refetchConversations, isSessionActive]);

    const handleAcceptSession = useCallback(async () => {
        if (!activeConvRef.current?.id || isAccepting) return;
        try {
            const session = await acceptSessionMutation(activeConvRef.current.id).unwrap();
            setSessionStatus('ACTIVE');
            setSessionType(session?.sessionType || 'CHAT');
            setSessionStartedAt(session?.startedAt || new Date().toISOString());
            setSessionTotalCost(0);
            refetchConversations();
            if (shouldShowNotification(`session-accepted:${activeConvRef.current.id}`, 5000)) {
                toast.success('Chat accepted — session started', responsiveToastOptions());
            }
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to accept chat request');
        }
    }, [acceptSessionMutation, isAccepting, refetchConversations]);

    const handleDeclineSession = useCallback(async () => {
        if (!activeConvRef.current?.id || isDeclining) return;
        try {
            await declineSessionMutation(activeConvRef.current.id).unwrap();
            setSessionStatus(null);
            setSessionType(null);
            setSessionStartedAt(null);
            refetchConversations();
            if (shouldShowNotification(`session-declined:${activeConvRef.current.id}`, 5000)) {
                toast('Chat request declined', responsiveToastOptions());
            }
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to decline chat request');
        }
    }, [declineSessionMutation, isDeclining, refetchConversations]);

    const handleStartSession = useCallback(async (type) => {
        if (!activeConvRef.current?.id) return;
        setShowStartModal(false);
        setIsStartingSession(true);
        try {
            await startSessionMutation({ conversationId: activeConvRef.current.id, sessionType: type }).unwrap();
            setSessionStatus('PENDING');
            setSessionType(type);
            toast('Chat request sent — waiting for consultant to accept', responsiveToastOptions({ duration: 4000 }));
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to send chat request');
        } finally {
            setIsStartingSession(false);
        }
    }, [startSessionMutation]);

    // ✅✅✅ KEY FIX: End session — IMMEDIATELY stops UI, then API call
    const handleEndSession = useCallback(async () => {
        if (!activeConvRef.current?.id || isEndingSession) return;

        const endTs = Date.now();
        const frozen = sessionStartedAtRef.current
            ? Math.max(0, Math.floor((endTs - new Date(sessionStartedAtRef.current).getTime()) / 1000))
            : 0;

        setIsEndingSession(true);
        setSessionStatus('ENDING');
        setFrozenElapsedSeconds(frozen);

        toast.loading('Ending session...', { id: 'end-session' });

        try {
            const result = await endSessionMutation(activeConvRef.current.id).unwrap();

            toast.dismiss('end-session');

            const totalCost = Number(result?.totalCost || 0).toFixed(2);
            const durationSeconds = result?.durationSeconds != null
                ? result.durationSeconds
                : frozen;

            skipSessionEndToastRef.current = true;

            toast.success(
                formatSessionEndMessage({ durationSeconds, totalCost }),
                responsiveToastOptions({ duration: 4000 }),
            );

            setSessionStatus('ENDED');
            setSessionStartedAt(null);
            setIsEndingSession(false);
            if (result?.durationSeconds != null) {
                setFrozenElapsedSeconds(result.durationSeconds);
            }
            if (result?.totalCost != null) {
                setSessionTotalCost(parseFloat(result.totalCost));
            }

            if (!isConsultant) {
                setSessionSummary({
                    sessionType: result?.sessionType || sessionTypeRef.current || 'CHAT',
                    durationSeconds,
                    totalMinutes: Number(result?.totalMinutes || 0),
                    totalCost,
                });
            } else {
                lockConsultantHistory(activeConvRef.current.id);
            }

            refetchConversations();

        } catch (err) {
            toast.dismiss('end-session');
            const status = err?.status || err?.originalStatus;
            const apiMsg =
                err?.data?.message
                || (typeof err?.data === 'string' ? err.data : null)
                || err?.error
                || err?.message;

            // Session may already be ended on server despite client error
            if (status === 404 || String(apiMsg || '').toLowerCase().includes('not found')) {
                setSessionStatus('ENDED');
                setSessionStartedAt(null);
                setIsEndingSession(false);
                refetchConversations();
                toast.success('Session ended');
                return;
            }

            setIsEndingSession(false);
            setFrozenElapsedSeconds(null);
            setSessionStatus('ACTIVE');
            toast.error(apiMsg || 'Failed to end session. Please try again.');
        }
    }, [endSessionMutation, isConsultant, isEndingSession, lockConsultantHistory]);

    const handleTyping = useCallback((e) => {
        setInputValue(e.target.value);
        if (!activeConvRef.current?.id) return;
        if (!isSessionActive && !isConsultant) return;
        socketService.emit('typing_start', { conversationId: activeConvRef.current.id });
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => {
            socketService.emit('typing_stop', { conversationId: activeConvRef.current.id });
        }, 1500);
    }, [isSessionActive, isConsultant]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    }, [handleSend]);

    const isTyping = Object.values(typingUsers).some(Boolean);

    // One conversation per other user (safety net if duplicates exist in cache)
    const uniqueConversations = useMemo(() => {
        const byOtherUser = new Map();
        for (const conv of conversations) {
            const key = conv.otherUser?.id || conv.id;
            const existing = byOtherUser.get(key);
            if (!existing || new Date(conv.updatedAt) > new Date(existing.updatedAt)) {
                byOtherUser.set(key, conv);
            }
        }
        return Array.from(byOtherUser.values()).sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
    }, [conversations]);

    const filteredConversations = uniqueConversations.filter(c =>
        c.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const inputPlaceholder = () => {
        if (isStartingSession) return 'Sending chat request…';
        if (isEndingSession) return 'Ending session…';
        if (isConsultant && isSessionPending) return 'Accept the chat request to start replying…';
        if (isConsultant && !isSessionActive) return 'Waiting for a chat request…';
        if (!isConsultant && isSessionPending) return 'Waiting for consultant to accept…';
        if (isSessionActive) return 'Type a message…';
        return 'Type a message to request a chat session…';
    };

    // ── Format elapsed time for the "Ending" banner ───────────────
    const formatElapsedTime = () => {
        if (frozenElapsedSeconds != null) {
            return formatSessionDuration(frozenElapsedSeconds);
        }
        if (!sessionStartedAt) return '';
        const seconds = Math.floor((Date.now() - new Date(sessionStartedAt).getTime()) / 1000);
        return formatSessionDuration(seconds);
    };

    return (
        <>
            <div className={`flex h-full min-h-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}>

                {/* Sidebar */}
                {showSidebar && (
                    <aside className={`${showMobileSidebar ? 'flex' : 'hidden'} lg:flex h-full min-h-0 w-full shrink-0 flex-col border-r border-gray-100 lg:w-80`}>
                        <div className='px-4 py-4 border-b border-gray-100'>
                            <h2 className='text-lg font-bold text-gray-900 mb-3'>Messages</h2>
                            <div className='relative'>
                                <Search size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    placeholder='Search conversations...'
                                    className='w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6E35AE]/30' />
                            </div>
                        </div>
                        <div className='flex-1 overflow-y-auto'>
                            {filteredConversations.length === 0
                                ? <div className='flex items-center justify-center h-48 text-gray-400 text-sm'>No conversations yet</div>
                                : filteredConversations.map(conv => (
                                    <ConversationItem key={conv.id} conv={conv}
                                        isActive={activeConv?.id === conv.id}
                                        isConsultant={isConsultant}
                                        onClick={handleSelectConversation} />
                                ))
                            }
                        </div>
                    </aside>
                )}

                {/* Chat Window */}
                <section className={`${showSidebar ? (!showMobileSidebar ? 'flex' : 'hidden') : 'flex'} lg:flex h-full min-h-0 flex-1 flex-col`}>
                    {!activeConv ? (
                        <div className='flex-1 flex flex-col items-center justify-center text-gray-400 gap-3'>
                            <div className='w-16 h-16 rounded-full bg-[#F5F1FD] flex items-center justify-center'>
                                <MessageSquare size={24} className='text-[#6E35AE]' />
                            </div>
                            <p className='text-sm font-medium'>
                                {showSidebar ? 'Select a conversation to start' : 'Loading conversation...'}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className='flex shrink-0 items-center gap-2 border-b border-gray-100 bg-white px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3'>
                                {showSidebar && (
                                    <button onClick={() => setShowMobileSidebar(true)} className='lg:hidden text-gray-500'>
                                        <ArrowLeft size={20} />
                                    </button>
                                )}
                                <div className='w-10 h-10 rounded-full bg-[#D1C4E9] flex items-center justify-center text-[#6E35AE] font-bold overflow-hidden shrink-0'>
                                    {activeConv.otherUser?.avatar
                                        ? <img src={activeConv.otherUser.avatar} alt='' className='w-full h-full object-cover' />
                                        : activeConv.otherUser?.name?.charAt(0)?.toUpperCase() || '?'
                                    }
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='font-semibold text-gray-900 text-sm'>{activeConv.otherUser?.name}</p>
                                    <p className='text-xs text-gray-400 capitalize'>{activeConv.otherUser?.role?.toLowerCase()}</p>
                                </div>

                                {isSessionActive && sessionType && (
                                    <div className='flex items-center gap-1 text-xs text-[#6E35AE] bg-[#F5F1FD] px-2 py-1 rounded-full'>
                                        {sessionType === 'CHAT' && <MessageSquare size={12} />}
                                        {sessionType === 'AUDIO' && <Phone size={12} />}
                                        {sessionType === 'VIDEO' && <Video size={12} />}
                                        <span className='font-medium'>{sessionType}</span>
                                    </div>
                                )}
                            </div>

                            {/* Pending request banner + consultant actions */}
                            {isSessionPending && (
                                <div className='px-4 py-3 bg-amber-50 border-b border-amber-200 shrink-0'>
                                    {isConsultant ? (
                                        <div className='flex flex-col sm:flex-row items-center justify-between gap-3'>
                                            <p className='text-sm text-amber-800 font-medium text-center sm:text-left'>
                                                New chat request from {activeConv.otherUser?.name || 'customer'}
                                            </p>
                                            <div className='flex gap-2 w-full sm:w-auto'>
                                                <button
                                                    type='button'
                                                    onClick={handleAcceptSession}
                                                    disabled={isAccepting || isDeclining}
                                                    className='flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg'
                                                >
                                                    {isAccepting ? 'Accepting…' : 'Accept Chat'}
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={handleDeclineSession}
                                                    disabled={isAccepting || isDeclining}
                                                    className='flex-1 sm:flex-none px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-semibold rounded-lg'
                                                >
                                                    {isDeclining ? 'Declining…' : 'Decline'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className='text-xs text-amber-700 text-center'>
                                            Waiting for consultant to accept your chat request…
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Consultant: session ended — history not available */}
                            {isHistoryLocked && (
                                <div className='px-4 py-3 bg-gray-50 border-b border-gray-200 text-center shrink-0'>
                                    <p className='text-sm text-gray-600 font-medium'>
                                        Consultation completed
                                    </p>
                                    <p className='text-xs text-gray-500 mt-1'>
                                        Chat history is only available to the customer after a session ends.
                                    </p>
                                </div>
                            )}

                            {/* Info banner — users before session starts */}
                            {!isSessionActive && !isSessionPending && !isConsultant && sessionStatus !== 'ENDING' && (
                                <div className='px-4 py-2 bg-amber-50 border-b border-amber-200 text-center shrink-0'>
                                    <p className='text-xs text-amber-700'>
                                        Send a message to request a <strong>CHAT</strong> session (€{PRICE_PER_MINUTE}/min). Billing starts after the consultant accepts.
                                    </p>
                                </div>
                            )}

                            {/* ✅ ENDING banner — shown instead of BillingBanner when ending */}
                            {sessionStatus === 'ENDING' && (
                                <div className='px-4 py-3 bg-orange-50 border-b border-orange-200 flex items-center justify-center gap-2'>
                                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500' />
                                    <span className='text-sm text-orange-700 font-medium'>
                                        Ending session... {formatElapsedTime()} · €{Number(sessionTotalCost || 0).toFixed(2)}
                                    </span>
                                </div>
                            )}

                            {/* Billing Banner — active session only (NOT when ENDING) */}
                            {isSessionActive && sessionStatus !== 'ENDING' && (
                                <BillingBanner
                                    sessionType={sessionType}
                                    startedAt={sessionStartedAt}
                                    totalCost={sessionTotalCost}
                                    walletBalance={currentBalance}
                                    onBalanceUpdate={setCurrentBalance}
                                    onEnd={handleEndSession}
                                    frozenElapsed={frozenElapsedSeconds}
                                    isEnding={isEndingSession}
                                    isConsultant={isConsultant}
                                />
                            )}

                            {/* Messages */}
                            <div ref={messagesContainerRef} className='min-h-0 flex-1 overflow-y-auto bg-gray-50 px-3 py-3 sm:px-4 sm:py-4' style={{ overflowAnchor: 'none' }}>
                                {isLoadingMessages ? (
                                    <div className='flex justify-center py-8'>
                                        <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-[#6E35AE]' />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className='flex flex-col items-center justify-center h-full text-gray-400 gap-3'>
                                        <MessageSquare size={32} className='text-gray-200' />
                                        <p className='text-sm'>
                                            {isHistoryLocked
                                                ? 'Previous messages are not available'
                                                : 'No messages yet'}
                                        </p>
                                        {!isSessionActive && !isConsultant && sessionStatus !== 'ENDING' && !isHistoryLocked && (
                                            <p className='text-xs text-gray-300'>Type a message below to begin</p>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {messages.map(msg => (
                                            <MessageBubble key={msg.id} msg={msg} isOwn={msg.senderId === user?.id} />
                                        ))}
                                        {isTyping && (
                                            <div className='flex items-center gap-2 mt-2'>
                                                <div className='bg-white rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm border border-gray-100'>
                                                    <div className='flex gap-1'>
                                                        {[0, 1, 2].map(i => (
                                                            <div key={i} className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce'
                                                                style={{ animationDelay: `${i * 0.15}s` }} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Bar */}
                            <div className='shrink-0 border-t border-gray-100 bg-white px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-3'>
                                {isUploading && (
                                    <div className='flex items-center gap-2 mb-2 text-xs text-[#6E35AE]'>
                                        <div className='animate-spin rounded-full h-3 w-3 border-b border-[#6E35AE]' />
                                        Uploading file...
                                    </div>
                                )}
                                {isStartingSession && (
                                    <div className='flex items-center gap-2 mb-2 text-xs text-amber-600'>
                                        <div className='animate-spin rounded-full h-3 w-3 border-b border-amber-600' />
                                        Starting session…
                                    </div>
                                )}
                                {sessionStatus === 'ENDING' && (
                                    <div className='flex items-center gap-2 mb-2 text-xs text-orange-600'>
                                        <div className='animate-spin rounded-full h-3 w-3 border-b border-orange-600' />
                                        Ending session…
                                    </div>
                                )}
                                <div className='flex items-end gap-2'>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={!isSessionActive || isUploading}
                                        className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-colors ${!isSessionActive ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-500'}`}
                                    >
                                        <Paperclip size={18} />
                                    </button>
                                    <input ref={fileInputRef} type='file' accept='image/*,video/*,.pdf,.doc,.docx,.txt,.zip' className='hidden'
                                        onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />

                                    <textarea
                                        ref={inputRef}
                                        value={inputValue}
                                        onChange={handleTyping}
                                        onKeyDown={handleKeyDown}
                                        placeholder={inputPlaceholder()}
                                        disabled={isStartingSession || isEndingSession}
                                        rows={1}
                                        className={`flex-1 resize-none rounded-2xl px-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6E35AE]/30 max-h-32 overflow-y-auto ${isStartingSession || isEndingSession ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-50 text-gray-800'}`}
                                        style={{ minHeight: '40px' }}
                                    />

                                    <button
                                        onClick={handleSend}
                                        disabled={!canSend}
                                        className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-colors ${!canSend ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#6E35AE] hover:bg-[#5A2A8A] text-white'}`}
                                    >
                                        {isStartingSession || isEndingSession
                                            ? <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white' />
                                            : <Send size={16} />
                                        }
                                    </button>
                                </div>

                                <p className='text-xs text-center text-gray-400 mt-2'>
                                    {sessionStatus === 'ENDING'
                                        ? 'Ending session…'
                                        : isConsultant
                                            ? isSessionActive ? 'Session active · Respond to your client' : 'Waiting for client to start a session'
                                            : isSessionActive ? `Session active · €${PRICE_PER_MINUTE}/minute` : `First message starts a CHAT session · €${PRICE_PER_MINUTE}/min`
                                    }
                                </p>
                            </div>
                        </>
                    )}
                </section>
            </div>

            {/* Modals */}
            {showStartModal && (
                <StartSessionModal
                    walletBalance={currentBalance}
                    onStart={handleStartSession}
                    onClose={() => setShowStartModal(false)}
                />
            )}

            {sessionSummary && (
                <SessionSummaryModal
                    summary={sessionSummary}
                    consultantRecordId={activeConv?.consultantRecordId || activeConv?.otherUser?.consultantRecordId}
                    consultantUserId={activeConv?.otherUser?.id}
                    consultantId={activeConv?.consultantRecordId || activeConv?.otherUser?.consultantRecordId}
                    onClose={() => setSessionSummary(null)}
                />
            )}
        </>
    );
});

RealTimeChat.displayName = 'RealTimeChat';
export default RealTimeChat;