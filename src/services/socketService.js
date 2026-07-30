import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this._userId = null;
        this._token = null;
        this._connectKey = null;
        this._isConnected = false;
        this._isRegistered = false;
        this._listeners = {};
        this._heartbeatInterval = null;
        this._handlersAttached = false;
    }

    _getSocketUrl() {
        const configured = (process.env.REACT_APP_SOCKET_URL || '').trim();
        if (configured) {
            return configured.replace(/\/$/, '');
        }
        // Dev: same origin → webpack proxies /socket.io to backend
        if (typeof window !== 'undefined') {
            return window.location.origin;
        }
        const apiBase = process.env.REACT_APP_API_BASE_URL || '';
        return apiBase.replace(/\/api\/v1\/?$/, '') || 'http://localhost:5000';
    }

    _attachCoreHandlers() {
        if (!this.socket || this._handlersAttached) return;

        this.socket.on('connect', () => {
            this._isConnected = true;
            this._isRegistered = false;
            if (this._userId) {
                this.socket.emit('register', this._userId);
            }
            this._startHeartbeat();
        });

        this.socket.on('registered', (data) => {
            if (!data?.error) {
                this._isRegistered = true;
            }
            this._emit('registered', data);
        });

        this.socket.on('disconnect', () => {
            this._isConnected = false;
            this._isRegistered = false;
            this._stopHeartbeat();
        });

        this.socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message);
            this._isConnected = false;
            this._isRegistered = false;
        });

        this.socket.on('reconnect', () => {
            this._isConnected = true;
            this._isRegistered = false;
            if (this._userId) {
                this.socket.emit('register', this._userId);
            }
            this._startHeartbeat();
        });

        this.socket.onAny((event, ...args) => {
            this._emit(event, ...args);
        });

        this._handlersAttached = true;
    }

    connect(userId, token) {
        const connectKey = `${userId}::${token}`;
        this._userId = userId;
        this._token = token;

        // Same session — keep existing socket (connected or reconnecting)
        if (this.socket && this._connectKey === connectKey) {
            this._attachCoreHandlers();
            if (this.socket.connected) {
                if (!this._isRegistered) {
                    this.socket.emit('register', userId);
                }
            } else if (!this.socket.active) {
                this.socket.auth = { token };
                this.socket.connect();
            }
            return this.socket;
        }

        // Different user/token — tear down previous connection
        if (this.socket) {
            this._stopHeartbeat();
            this.socket.removeAllListeners();
            this.socket.disconnect();
            this.socket = null;
            this._handlersAttached = false;
        }

        this._connectKey = connectKey;

        this.socket = io(this._getSocketUrl(), {
            auth: { token },
            transports: ['websocket', 'polling'],
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
        });

        this._attachCoreHandlers();
        return this.socket;
    }

    _startHeartbeat() {
        this._stopHeartbeat();
        this._heartbeatInterval = setInterval(() => {
            if (this.socket?.connected) {
                this.socket.emit('heartbeat');
            }
        }, 30_000);
    }

    _stopHeartbeat() {
        if (this._heartbeatInterval) {
            clearInterval(this._heartbeatInterval);
            this._heartbeatInterval = null;
        }
    }

    _emit(event, ...args) {
        const cbs = this._listeners[event];
        if (!cbs) return;
        Object.values(cbs).forEach((cb) => {
            if (typeof cb === 'function') {
                try {
                    cb(...args);
                } catch (e) {
                    console.error(`Error in listener for ${event}:`, e);
                }
            }
        });
    }

    on(event, keyOrCallback, callback) {
        if (!this._listeners[event]) this._listeners[event] = {};
        if (typeof keyOrCallback === 'function') {
            this._listeners[event][event] = keyOrCallback;
        } else {
            this._listeners[event][keyOrCallback] = callback;
        }
    }

    off(event, key) {
        if (!this._listeners[event]) return;
        if (key) {
            delete this._listeners[event][key];
        } else {
            delete this._listeners[event];
        }
    }

    emit(event, data, callback) {
        if (!this.socket?.connected) {
            return false;
        }
        if (callback) {
            this.socket.emit(event, data, callback);
        } else {
            this.socket.emit(event, data);
        }
        return true;
    }

    emitWithAck(event, data) {
        return new Promise((resolve, reject) => {
            if (!this.socket?.connected) {
                reject(new Error('Socket not connected'));
                return;
            }
            this.socket.emit(event, data, resolve);
        });
    }

    joinConversation(conversationId) {
        if (!conversationId) return;
        this.emit('join_conversation', { conversationId });
    }

    setStatus(status) {
        this.emit('set_status', { status });
    }

    disconnect({ clearListeners = true } = {}) {
        this._stopHeartbeat();
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket.disconnect();
            this.socket = null;
        }
        this._isConnected = false;
        this._isRegistered = false;
        this._connectKey = null;
        this._handlersAttached = false;
        if (clearListeners) {
            this._listeners = {};
        }
    }

    isConnected() {
        return this._isConnected && !!this.socket?.connected;
    }

    isRegistered() {
        return this._isRegistered;
    }
}

export const socketService = new SocketService();
export default socketService;
