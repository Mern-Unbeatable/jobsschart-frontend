import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { socketService } from '../services/socketService';

const BRIDGE_KEY = 'call-socket-bridge';

/** App-wide call socket listeners — instant call_ending / call_ended on both sides */
export function CallSocketBridge() {
    const { user, token, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!isAuthenticated || !user?.id || !token) return;

        socketService.connect(user.id, token);

        const forward = (type, data) => {
            window.dispatchEvent(new CustomEvent(`rtcall:${type}`, { detail: data }));
        };

        const handlers = {
            call_ending: (data) => forward('call_ending', data),
            call_ended: (data) => forward('call_ended', data),
            call_accepted: (data) => forward('call_accepted', data),
            call_rejected: (data) => forward('call_rejected', data),
            incoming_call: (data) => forward('incoming_call', data),
            call_balance_warning: (data) => forward('call_balance_warning', data),
            call_billing_tick: (data) => forward('call_billing_tick', data),
        };

        Object.entries(handlers).forEach(([event, handler]) => {
            socketService.on(event, BRIDGE_KEY, handler);
        });

        return () => {
            Object.keys(handlers).forEach((event) => {
                socketService.off(event, BRIDGE_KEY);
            });
        };
    }, [isAuthenticated, user?.id, token]);

    return null;
}

export default CallSocketBridge;
