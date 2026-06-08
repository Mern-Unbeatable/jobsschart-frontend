// src/services/twilioVideoService.js
import { connect as connectTwilioVideo, createLocalAudioTrack, createLocalVideoTrack } from 'twilio-video';

class TwilioVideoService {
    constructor() {
        this.room = null;
        this.localTracks = [];
        this.isMuted = false;
        this.isVideoOff = false;
        this._audioContainer = null;
    }

  _getAudioContainer() {
    if (!this._audioContainer) {
        let container = document.getElementById('twilio-audio-container');

        if (!container) {
            container = document.createElement('div');
            container.id = 'twilio-audio-container';

        
            container.style.cssText = `
                position: fixed;
                width: 0;
                height: 0;
                opacity: 0;
                pointer-events: none;
                overflow: hidden;
            `;

            document.body.appendChild(container);
        }

        this._audioContainer = container;
    }
    return this._audioContainer;
}

    // ── Clean up existing connection BEFORE creating a new one ──
    _cleanupBeforeConnect() {
        this.localTracks.forEach(track => {
            try {
                track.stop();
                track.detach().forEach(el => el.remove());
            } catch (e) { /* ignore */ }
        });
        this.localTracks = [];

        if (this.room) {
            try {
                this.room.removeAllListeners();
                this.room.disconnect();
            } catch (e) { /* ignore */ }
            this.room = null;
        }

        if (this._audioContainer) {
            this._audioContainer.innerHTML = '';
        }
    }

    // ── Create local tracks gracefully ──
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

    // ── Attach a participant's tracks (BOTH audio + video) ──
    _attachParticipant(participant, remoteVideoRef) {
        const audioContainer = this._getAudioContainer();

        // Attach all already-subscribed tracks
        participant.tracks.forEach(publication => {
            if (publication.isSubscribed && publication.track) {
                this._attachTrack(publication.track, remoteVideoRef, audioContainer);
            }
        });

        // Listen for future tracks being subscribed
        participant.on('trackSubscribed', track => {
            this._attachTrack(track, remoteVideoRef, audioContainer);
        });

        // Clean up when tracks are unsubscribed
        participant.on('trackUnsubscribed', track => {
            track.detach().forEach(el => el.remove());
        });
    }

    // ── FIX: Attach track with explicit play() call ──
    _attachTrack(track, remoteVideoRef, audioContainer) {
        const el = track.attach();

       if (track.kind === 'audio') {
    const el = track.attach();

    el.autoplay = true;
    el.playsInline = true;
    el.muted = false;
    el.volume = 1;

    audioContainer.appendChild(el);

    // ✅ HARD FORCE PLAY (fixes user-side silent audio)
    const tryPlay = () => {
        const p = el.play();
        if (p) {
            p.catch(() => {
                setTimeout(() => el.play().catch(() => {}), 500);
            });
        }
    };

    tryPlay();

    // fallback unlock on ANY interaction
    const unlock = () => {
        tryPlay();
        document.removeEventListener('click', unlock);
        document.removeEventListener('touchstart', unlock);
    };

    document.addEventListener('click', unlock);
    document.addEventListener('touchstart', unlock);
} else if (track.kind === 'video') {
            if (remoteVideoRef) {
                remoteVideoRef.appendChild(el);
            }
        }
    }

    // ── Connect to VIDEO room ──
    async connectVideo(token, roomName, localVideoRef, remoteVideoRef) {
        this._cleanupBeforeConnect();

        const localTracks = await this._getLocalTracks('VIDEO');
        this.localTracks = localTracks;

        this.room = await connectTwilioVideo(token, {
            name: roomName,
            tracks: localTracks,
        });

        // Attach local video to PiP
        localTracks.forEach(track => {
            if (track.kind === 'video' && localVideoRef) {
                const el = track.attach();
                el.style.width = '100%';
                el.style.height = '100%';
                el.style.objectFit = 'cover';
                localVideoRef.innerHTML = '';
                localVideoRef.appendChild(el);
            }
        });

        // ✅ Attach ALREADY-CONNECTED remote participants
        this.room.participants.forEach(participant => {
            this._attachParticipant(participant, remoteVideoRef);
        });

        // ✅ Attach NEW participants as they connect
        this.room.on('participantConnected', participant => {
            this._attachParticipant(participant, remoteVideoRef);
        });

        this.room.on('participantDisconnected', participant => {
            participant.tracks.forEach(publication => {
                if (publication.track) {
                    publication.track.detach().forEach(el => el.remove());
                }
            });
        });

        this.room.on('disconnected', () => {
            this.cleanup();
        });

        return this.room;
    }

    // ── Connect to AUDIO-ONLY room ──
async connectAudio(token, roomName, onConnect, onDisconnect) {
    this._cleanupBeforeConnect();

    const localTracks = await this._getLocalTracks('PHONE');
    this.localTracks = localTracks;

    this.room = await connectTwilioVideo(token, {
        name: roomName,
        tracks: localTracks,
    });

    const audioContainer = this._getAudioContainer();

    // ✅ attach existing participants FIRST
    this.room.participants.forEach(participant => {
        this._attachParticipant(participant, null);
    });

    // ✅ attach new participants
    this.room.on('participantConnected', participant => {
        this._attachParticipant(participant, null);
    });

    this.room.on('participantDisconnected', participant => {
        participant.tracks.forEach(pub => {
            pub.track?.detach()?.forEach(el => el.remove());
        });
    });

    this.room.on('disconnected', () => {
        this.cleanup();
        onDisconnect?.();
    });

    // ✅ IMPORTANT: trigger connect callback ONCE after room ready
    setTimeout(() => {
        onConnect?.();
    }, 500);

    return this.room;
}

    // ── Mute / Unmute ──
    mute() {
        this.localTracks.forEach(t => { if (t.kind === 'audio') t.disable(); });
        this.isMuted = true;
    }

    unmute() {
        this.localTracks.forEach(t => { if (t.kind === 'audio') t.enable(); });
        this.isMuted = false;
    }

    // ── Video on/off ──
    disableVideo() {
        if (this.room) {
            this.room.localParticipant.videoTracks.forEach(publication => {
                if (publication.track) publication.track.disable();
            });
        }
        this.isVideoOff = true;
    }

    enableVideo() {
        if (this.room) {
            this.room.localParticipant.videoTracks.forEach(publication => {
                if (publication.track) publication.track.enable();
            });
        }
        this.isVideoOff = false;
    }

    // ── Cleanup ──
    cleanup() {
        this.localTracks.forEach(track => {
            try {
                track.stop();
                track.detach().forEach(el => el.remove());
            } catch (e) { /* ignore */ }
        });
        this.localTracks = [];

        if (this.room) {
            try {
                this.room.removeAllListeners();
                this.room.disconnect();
            } catch (e) { /* ignore */ }
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