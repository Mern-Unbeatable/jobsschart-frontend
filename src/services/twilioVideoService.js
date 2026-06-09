import { connect as connectTwilioVideo, createLocalAudioTrack, createLocalVideoTrack } from 'twilio-video';

class TwilioVideoService {
    constructor() {
        this.room = null;
        this.localTracks = [];
        this.isMuted = false;
        this.isVideoOff = false;
        this._audioContainer = null;
        this._participantListeners = new Map();
    }

    // ── Dedicated hidden audio container in <body> ──────────────────
    _getAudioContainer() {
        if (!this._audioContainer) {
            let container = document.getElementById('twilio-audio-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'twilio-audio-container';
                container.style.cssText =
                    'position:fixed;width:0;height:0;opacity:0;pointer-events:none;overflow:hidden;';
                document.body.appendChild(container);
            }
            this._audioContainer = container;
        }
        return this._audioContainer;
    }

    // ── Stop / detach everything before a new connection ───────────
    _cleanupBeforeConnect() {
        this._participantListeners.forEach((listeners, participant) => {
            listeners.forEach(({ event, fn }) => {
                try { participant.off(event, fn); } catch (_) {}
            });
        });
        this._participantListeners.clear();

        this.localTracks.forEach(track => {
            try { track.stop(); track.detach().forEach(el => el.remove()); } catch (_) {}
        });
        this.localTracks = [];

        if (this.room) {
            try { this.room.removeAllListeners(); this.room.disconnect(); } catch (_) {}
            this.room = null;
        }

        if (this._audioContainer) {
            this._audioContainer.innerHTML = '';
        }
    }

    // ── Acquire local tracks without throwing ──────────────────────
    async _getLocalTracks(callType) {
        const tracks = [];
        try {
            const audioTrack = await createLocalAudioTrack();
            tracks.push(audioTrack);
        } catch (e) {
            console.warn('⚠️ No microphone:', e.message);
        }
        if (callType === 'VIDEO') {
            try {
                const videoTrack = await createLocalVideoTrack({ width: 640, height: 480 });
                tracks.push(videoTrack);
            } catch (e) {
                console.warn('⚠️ No camera:', e.message);
            }
        }
        return tracks;
    }

    // ── Attach a single track to the right container ───────────────
    // Audio → hidden _audioContainer  (autoplay + unlock on first gesture)
    // Video → remoteVideoRef DOM node
    _attachTrack(track, remoteVideoRef) {
        if (track.kind === 'audio') {
            const audioContainer = this._getAudioContainer();
            const el = track.attach();
            el.autoplay = true;
            el.playsInline = true;
            el.muted = false;
            el.volume = 1;
            audioContainer.appendChild(el);

            const tryPlay = () => {
                const p = el.play();
                if (p) p.catch(() => setTimeout(() => el.play().catch(() => {}), 500));
            };
            tryPlay();

            // Unlock audio after any user gesture (mobile safari)
            const unlock = () => {
                tryPlay();
                document.removeEventListener('click', unlock);
                document.removeEventListener('touchstart', unlock);
            };
            document.addEventListener('click', unlock);
            document.addEventListener('touchstart', unlock);

        } else if (track.kind === 'video') {
            if (!remoteVideoRef) return;
            const el = track.attach();
            el.style.cssText = 'width:100%;height:100%;object-fit:cover;';
            remoteVideoRef.appendChild(el);
        }
    }

    // ── Wire up all tracks for one remote participant ──────────────
    _attachParticipant(participant, remoteVideoRef) {
        const listeners = [];

        // Tracks already subscribed when we attach
        participant.tracks.forEach(publication => {
            if (publication.isSubscribed && publication.track) {
                this._attachTrack(publication.track, remoteVideoRef);
            }
        });

        // Tracks that arrive later
        const onSubscribed = (track) => {
            this._attachTrack(track, remoteVideoRef);
        };
        participant.on('trackSubscribed', onSubscribed);
        listeners.push({ event: 'trackSubscribed', fn: onSubscribed });

        // Clean up detached tracks
        const onUnsubscribed = (track) => {
            track.detach().forEach(el => el.remove());
        };
        participant.on('trackUnsubscribed', onUnsubscribed);
        listeners.push({ event: 'trackUnsubscribed', fn: onUnsubscribed });

        this._participantListeners.set(participant, listeners);
    }

    // ── VIDEO CALL ─────────────────────────────────────────────────
    async connectVideo(token, roomName, localVideoRef, remoteVideoRef) {
        this._cleanupBeforeConnect();

        const localTracks = await this._getLocalTracks('VIDEO');
        this.localTracks = localTracks;

        this.room = await connectTwilioVideo(token, {
            name: roomName,
            tracks: localTracks,
        });

        console.log('✅ Connected to video room:', this.room.name);

        // Show our own camera in the PiP box
        localTracks.forEach(track => {
            if (track.kind === 'video' && localVideoRef) {
                const el = track.attach();
                el.style.cssText = 'width:100%;height:100%;object-fit:cover;';
                localVideoRef.innerHTML = '';
                localVideoRef.appendChild(el);
            }
        });

        // Remote participants already in the room
        this.room.participants.forEach(participant => {
            this._attachParticipant(participant, remoteVideoRef);
        });

        // Remote participants who join after us
        this.room.on('participantConnected', participant => {
            this._attachParticipant(participant, remoteVideoRef);
        });

        this.room.on('participantDisconnected', participant => {
            participant.tracks.forEach(pub => {
                if (pub.track) pub.track.detach().forEach(el => el.remove());
            });
            this._participantListeners.delete(participant);
        });

        this.room.on('disconnected', () => { this.cleanup(); });

        return this.room;
    }

    // ── AUDIO CALL ─────────────────────────────────────────────────
    async connectAudio(token, roomName, onConnect, onDisconnect) {
        this._cleanupBeforeConnect();

        const localTracks = await this._getLocalTracks('PHONE');
        this.localTracks = localTracks;

        this.room = await connectTwilioVideo(token, {
            name: roomName,
            tracks: localTracks,
        });

        console.log('✅ Connected to audio room:', this.room.name);

        // Wire up any participants already present
        this.room.participants.forEach(participant => {
            this._attachParticipant(participant, null); // null → audio only
        });

        // Wire up participants who join later
        this.room.on('participantConnected', participant => {
            this._attachParticipant(participant, null);
            onConnect?.();
        });

        this.room.on('participantDisconnected', participant => {
            participant.tracks.forEach(pub => {
                if (pub.track) pub.track.detach().forEach(el => el.remove());
            });
            onDisconnect?.();
        });

        this.room.on('disconnected', () => {
            this.cleanup();
            onDisconnect?.();
        });

        // If a participant is already there, fire onConnect right away
        if (this.room.participants.size > 0) {
            setTimeout(() => onConnect?.(), 200);
        }

        return this.room;
    }

    // ── Controls ───────────────────────────────────────────────────
    mute() {
        this.localTracks.forEach(t => { if (t.kind === 'audio') t.disable(); });
        this.isMuted = true;
    }

    unmute() {
        this.localTracks.forEach(t => { if (t.kind === 'audio') t.enable(); });
        this.isMuted = false;
    }

    disableVideo() {
        if (this.room) {
            this.room.localParticipant.videoTracks.forEach(pub => {
                if (pub.track) pub.track.disable();
            });
        }
        this.isVideoOff = true;
    }

    enableVideo() {
        if (this.room) {
            this.room.localParticipant.videoTracks.forEach(pub => {
                if (pub.track) pub.track.enable();
            });
        }
        this.isVideoOff = false;
    }

    // ── Full teardown ──────────────────────────────────────────────
    cleanup() {
        this._participantListeners.forEach((listeners, participant) => {
            listeners.forEach(({ event, fn }) => {
                try { participant.off(event, fn); } catch (_) {}
            });
        });
        this._participantListeners.clear();

        this.localTracks.forEach(track => {
            try { track.stop(); track.detach().forEach(el => el.remove()); } catch (_) {}
        });
        this.localTracks = [];

        if (this.room) {
            try { this.room.removeAllListeners(); this.room.disconnect(); } catch (_) {}
            this.room = null;
        }

        if (this._audioContainer) {
            this._audioContainer.innerHTML = '';
        }

        this.isMuted = false;
        this.isVideoOff = false;
    }

    disconnect() {
        this.cleanup();
    }
}

export const twilioVideoService = new TwilioVideoService();