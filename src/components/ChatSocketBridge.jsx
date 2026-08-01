import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { responsiveToastOptions } from '../utils/responsiveToast';
import { shouldShowNotification } from '../utils/notificationDedupe';
import { socketService } from '../services/socketService';
import { baseApi } from '../features/baseApi';
import { selectUserRole } from '../features/slices/authSlice';

const BRIDGE_KEY = 'chat-socket-bridge';

/** App-wide chat socket listeners — stay mounted even when chat page unmounts */
export function ChatSocketBridge() {
    const dispatch = useDispatch();
    const { user, token, isAuthenticated } = useSelector((state) => state.auth);
    const userRole = useSelector(selectUserRole);
    const isConsultant = userRole === 'CONSULTANT' || userRole === 'ADMIN';

    useEffect(() => {
        if (!isAuthenticated || !user?.id || !token) return;

        socketService.connect(user.id, token);

        const invalidateChat = () => {
            dispatch(baseApi.util.invalidateTags(['ChatConversation', 'ChatUnread']));
        };

        const forward = (type, data) => {
            window.dispatchEvent(new CustomEvent(`rtchat:${type}`, { detail: data }));
        };

        const onNewMessage = (data) => {
            invalidateChat();
            forward('new_message', data);
            if (
                isConsultant
                && data?.message?.senderId !== user.id
                && shouldShowNotification(`chat-msg:${data.conversationId}:${data.message?.id}`, 3000)
            ) {
                const preview = data?.message?.message || 'New message';
                const name = data?.message?.sender?.name || 'Customer';
                toast(`${name}: ${preview}`, responsiveToastOptions({ duration: 3500, icon: '💬' }));
            }
        };

        const onSessionStarted = (data) => {
            const convId = data?.conversationId;
            if (!convId) return;
            if (!shouldShowNotification(`session-started:${convId}`, 5000)) return;

            invalidateChat();
            forward('session_started', data);

            // User-only toast; consultant UI handles accept in chat / notification card
            if (!isConsultant) {
                toast.success(
                    'Consultant accepted your chat — session started!',
                    responsiveToastOptions({ duration: 5000 }),
                );
            }
        };

        const onChatPending = (data) => {
            const convId = data?.conversationId;
            if (!convId) return;
            if (!shouldShowNotification(`chat-pending:${convId}`, 5000)) return;

            invalidateChat();
            forward('chat_request_pending', data);
            // No toast: consultant sees IncomingChatNotification; user sees RealTimeChat banner/toast
        };

        const onChatDeclined = (data) => {
            const convId = data?.conversationId;
            if (!convId) return;
            if (!shouldShowNotification(`chat-declined:${convId}`, 5000)) return;

            invalidateChat();
            forward('chat_request_declined', data);
            if (!isConsultant) {
                toast.error('Consultant declined your chat request', responsiveToastOptions());
            }
        };

        const onSessionEnded = (data) => {
            invalidateChat();
            forward('session_ended', data);
        };

        const onSessionEnding = (data) => {
            forward('session_ending', data);
        };

        socketService.on('new_message', BRIDGE_KEY, onNewMessage);
        socketService.on('new_file', BRIDGE_KEY, (data) => {
            invalidateChat();
            forward('new_file', data);
        });
        socketService.on('session_started', BRIDGE_KEY, onSessionStarted);
        socketService.on('chat_request_pending', BRIDGE_KEY, onChatPending);
        socketService.on('incoming_chat_request', BRIDGE_KEY, onChatPending);
        socketService.on('chat_request_declined', BRIDGE_KEY, onChatDeclined);
        socketService.on('session_ended', BRIDGE_KEY, onSessionEnded);
        socketService.on('session_ending', BRIDGE_KEY, onSessionEnding);

        socketService.on('registered', BRIDGE_KEY, (data) => {
            if (data?.success) {
                console.info('[ChatSocket] registered:', data.userId);
            }
        });

        return () => {
            [
                'new_message', 'new_file', 'session_started',
                'chat_request_pending', 'incoming_chat_request', 'chat_request_declined',
                'session_ended', 'session_ending', 'registered',
            ].forEach((e) => socketService.off(e, BRIDGE_KEY));
        };
    }, [isAuthenticated, user?.id, token, isConsultant, dispatch]);

    return null;
}

export default ChatSocketBridge;
