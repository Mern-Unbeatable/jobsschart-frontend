import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
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
            if (isConsultant && data?.message?.senderId !== user.id) {
                const preview = data?.message?.message || 'New message';
                const name = data?.message?.sender?.name || 'Customer';
                toast(`${name}: ${preview}`, { duration: 3500, icon: '💬' });
            }
        };

        const onSessionStarted = (data) => {
            invalidateChat();
            forward('session_started', data);
            if (!isConsultant) {
                toast.success('Consultant accepted your chat — session started!', { duration: 5000 });
            }
        };

        const onChatPending = (data) => {
            invalidateChat();
            forward('chat_request_pending', data);
            if (isConsultant) {
                toast('New chat request', { duration: 4000, icon: '💬' });
            } else {
                toast('Waiting for consultant to accept…', { duration: 4000 });
            }
        };

        const onChatDeclined = (data) => {
            invalidateChat();
            forward('chat_request_declined', data);
            if (!isConsultant) {
                toast.error('Consultant declined your chat request');
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
        socketService.on('chat_request_accepted', BRIDGE_KEY, onSessionStarted);
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
                'new_message', 'new_file', 'session_started', 'chat_request_accepted',
                'chat_request_pending', 'incoming_chat_request', 'chat_request_declined',
                'session_ended', 'session_ending', 'registered',
            ].forEach((e) => socketService.off(e, BRIDGE_KEY));
        };
    }, [isAuthenticated, user?.id, token, isConsultant, dispatch]);

    return null;
}

export default ChatSocketBridge;
