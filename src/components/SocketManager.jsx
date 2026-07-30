import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { socketService } from '../services/socketService';

export function SocketManager() {
    const { user, token, isAuthenticated } = useSelector((state) => state.auth);
    const wasAuthenticatedRef = useRef(false);

    useEffect(() => {
        if (isAuthenticated && user?.id && token) {
            wasAuthenticatedRef.current = true;
            socketService.connect(user.id, token);
            return undefined;
        }

        if (wasAuthenticatedRef.current) {
            socketService.disconnect({ clearListeners: true });
            wasAuthenticatedRef.current = false;
        }

        return undefined;
    }, [isAuthenticated, user?.id, token]);

    return null;
}

export default SocketManager;
