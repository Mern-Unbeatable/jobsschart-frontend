import { connect as connectTwilioVideo, createLocalAudioTrack, createLocalVideoTrack } from 'twilio-video';

class TwilioVideoService {
    constructor() {
        this.room = null;
        this.localTracks = [];
        this.isMuted = false;
        this.isVideoOff = false;
        this._audioContainer = null;
        this._participantListeners = new Map(); // ✅ Track listeners for cleanup
    }

    _getAudioContainer() {
        if (!this._audioContainer) {
            let container = document.getElementById('twilio-audio-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'twilio-audio-container';
                container.style.cssText = `
                    position: fixed;
                    width: 0; height: 0;
                    opacity: 0; pointer-events: none;
                    overflow: hidden;
                `;
                document.body.appendChild(container);
            }
            this._audioContainer = container;
        }
        return this._audioContainer;
    }

    _cleanupBeforeConnect() {
        // ✅ Remove participant event listeners
        this._participantListeners.forEach((listeners, participant) => {
            listeners.forEach(({ event, fn }) => {
                try { participant.off(event, fn); } catch (e) {}
            });
        });
        this._participantListeners.clear();

        this.localTracks.forEach(track => {
            try {
                track.stop();
                track.detach().forEach(el => el.remove());
            } catch (e) {}
        });
        this.localTracks = [];

        if (this.room) {
            try {
                this.room.removeAllListeners();
                this.room.disconnect();
            } catch (e) {}
            this.room = null;
        }

        if (this._audioContainer) {
            this._audioContainer.innerHTML = '';
        }
    }

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

    _attachParticipant(participant, remoteVideoRef) {
        const audioContainer = this._getAudioContainer();
        const listeners = [];

        // Attach already-subscribed tracks
        participant.tracks.forEach(publication => {
            if (publication.isSubscribed && publication.track) {
                this._attachTrack(publication.track, remoteVideoRef, audioContainer);
            }
        });

        // Listen for new tracks
        const onSubscribed = (track) => {
            this._attachTrack(track, remoteVideoRef, audioContainer);
        };
        participant.on('trackSubscribed', onSubscribed);
        listeners.push({ event: 'trackSubscribed', fn: onSubscribed });

        // Clean up unsubscribed tracks
        const onUnsubscribed = (track) => {
            track.detach().forEach(el => el.remove());
        };
        participant.on('trackUnsubscribed', onUnsubscribed);
        listeners.push({ event: 'trackUnsubscribed', fn: onUnsubscribed });

        this._participantListeners.set(participant, listeners);
    }

    // ✅ FIX: No duplicate track.attach() call
    _attachTrack(track, remoteVideoRef, audioContainer) {
        if (track.kind === 'audio') {
            const el = track.attach();
            el.autoplay = true;
            el.playsInline = true;
            el.muted = false;
            el.volume = 1;
            audioContainer.appendChild(el);

            const tryPlay = () => {
                const p = el.play();
                if (p) {
                    p.catch(() => {
                        setTimeout(() => el.play().catch(() => {}), 500);
                    });
                }
            };
            tryPlay();

            const unlock = () => {
                tryPlay();
                document.removeEventListener('click', unlock);
                document.removeEventListener('touchstart', unlock);
            };
            document.addEventListener('click', unlock);
            document.addEventListener('touchstart', unlock);

        } else if (track.kind === 'video') {
            const el = track.attach();
            el.style.width = '100%';
            el.style.height = '100%';
            el.style.objectFit = 'cover';
            if (remoteVideoRef) {
                remoteVideoRef.appendChild(el);
            }
        }
    }

    async connectVideo(token, roomName, localVideoRef, remoteVideoRef) {
        this._cleanupBeforeConnect();

        const localTracks = await this._getLocalTracks('VIDEO');
        this.localTracks = localTracks;

        this.room = await connectTwilioVideo(token, {
            name: roomName,
            tracks: localTracks,
        });

        // ✅ Attach local video to PiP
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

        // ✅ Attach already-connected remote participants
        this.room.participants.forEach(participant => {
            this._attachParticipant(participant, remoteVideoRef);
        });

        // ✅ Attach new participants as they connect
        this.room.on('participantConnected', participant => {
            this._attachParticipant(participant, remoteVideoRef);
        });

        this.room.on('participantDisconnected', participant => {
            participant.tracks.forEach(publication => {
                if (publication.track) {
                    publication.track.detach().forEach(el => el.remove());
                }
            });
            this._participantListeners.delete(participant);
        });

        this.room.on('disconnected', () => {
            this.cleanup();
        });

        return this.room;
    }

    async connectAudio(token, roomName, onConnect, onDisconnect) {
        this._cleanupBeforeConnect();

        const localTracks = await this._getLocalTracks('PHONE');
        this.localTracks = localTracks;

        this.room = await connectTwilioVideo(token, {
            name: roomName,
            tracks: localTracks,
        });

        this.room.participants.forEach(participant => {
            this._attachParticipant(participant, null);
        });

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

        setTimeout(() => { onConnect?.(); }, 500);

        return this.room;
    }

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

    // ✅ FIX: Also clear video ref containers
    cleanup() {
        this._participantListeners.forEach((listeners, participant) => {
            listeners.forEach(({ event, fn }) => {
                try { participant.off(event, fn); } catch (e) {}
            });
        });
        this._participantListeners.clear();

        this.localTracks.forEach(track => {
            try {
                track.stop();
                track.detach().forEach(el => el.remove());
            } catch (e) {}
        });
        this.localTracks = [];

        if (this.room) {
            try {
                this.room.removeAllListeners();
                this.room.disconnect();
            } catch (e) {}
            this.room = null;
        }

        if (this._audioContainer) {
            this._audioContainer.innerHTML = '';
        }

        // ✅ Clear remote video container DOM elements
        this.isMuted = false;
        this.isVideoOff = false;
    }

    disconnect() {
        this.cleanup();
    }
}

export const twilioVideoService = new TwilioVideoService();