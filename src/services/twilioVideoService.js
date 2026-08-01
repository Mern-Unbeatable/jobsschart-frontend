import { connect as connectTwilioVideo, createLocalAudioTrack, createLocalVideoTrack } from 'twilio-video';
import { applyRemoteListenMode } from '../utils/callAudioOutput';

class TwilioVideoService {
    constructor() {
        this.room = null;
        this.localTracks = [];
        this.isMuted = false;
        this.isVideoOff = false;
        this.isSpeakerOn = true;
        this._audioContainer = null;
        this._participantListeners = new Map();
        this._remoteAudioElements = new Set();
        this._remoteVideoElements = new Set();
    }

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

    _cleanupBeforeConnect() {
        this._participantListeners.forEach((listeners, participant) => {
            listeners.forEach(({ target, event, fn }) => {
                try { (target || participant).off(event, fn); } catch (_) {}
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
        this._remoteAudioElements.clear();
        this._remoteVideoElements.clear();
    }

    async _applySpeakerToRemoteAudio() {
        await applyRemoteListenMode(this.isSpeakerOn);

        this._remoteAudioElements.forEach((el) => {
            if (!this.isSpeakerOn) {
                el.muted = true;
                el.volume = 0;
            } else {
                el.muted = false;
                el.volume = 1;
                el.play().catch(() => {});
            }
        });

        this._remoteVideoElements.forEach((el) => {
            el.muted = !this.isSpeakerOn;
            el.volume = this.isSpeakerOn ? 1 : 0;
        });
    }

    async setSpeakerOn(enabled) {
        this.isSpeakerOn = Boolean(enabled);
        await this._applySpeakerToRemoteAudio();
        return this.isSpeakerOn;
    }

    async toggleSpeaker() {
        return this.setSpeakerOn(!this.isSpeakerOn);
    }

    getSpeakerOn() {
        return this.isSpeakerOn;
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

    _attachTrack(track, remoteVideoRef) {
        if (track.kind === 'audio') {
            const audioContainer = this._getAudioContainer();
            const el = track.attach();
            el.autoplay = true;
            el.playsInline = true;
            el.muted = !this.isSpeakerOn;
            el.volume = this.isSpeakerOn ? 1 : 0;
            audioContainer.appendChild(el);
            this._remoteAudioElements.add(el);

            const tryPlay = () => {
                const p = el.play();
                if (p) {
                    p.then(() => this._applySpeakerToRemoteAudio()).catch(() => {
                        setTimeout(() => el.play().then(() => this._applySpeakerToRemoteAudio()).catch(() => {}), 500);
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
            if (!remoteVideoRef) return;
            const el = track.attach();
            el.style.cssText = 'width:100%;height:100%;object-fit:cover;';
            el.setAttribute('data-twilio-remote-video', 'true');
            el.muted = !this.isSpeakerOn;
            el.volume = this.isSpeakerOn ? 1 : 0;
            this._remoteVideoElements.add(el);
            remoteVideoRef.appendChild(el);
        }
    }

    _attachParticipant(participant, remoteVideoRef) {
        const listeners = [];

        const attachIfReady = (publication) => {
            if (publication?.track) {
                this._attachTrack(publication.track, remoteVideoRef);
            }
        };

        // Tracks already subscribed when we join
        participant.tracks.forEach((publication) => {
            attachIfReady(publication);
        });

        // automaticSubscription: true — SDK subscribes for us; attach when ready
        const onTrackSubscribed = (track) => {
            this._attachTrack(track, remoteVideoRef);
        };
        participant.on('trackSubscribed', onTrackSubscribed);
        listeners.push({ target: participant, event: 'trackSubscribed', fn: onTrackSubscribed });

        const onTrackPublished = (publication) => {
            attachIfReady(publication);
        };
        participant.on('trackPublished', onTrackPublished);
        listeners.push({ target: participant, event: 'trackPublished', fn: onTrackPublished });

        const onUnsubscribed = (track) => {
            track.detach().forEach(el => el.remove());
        };
        participant.on('trackUnsubscribed', onUnsubscribed);
        listeners.push({ target: participant, event: 'trackUnsubscribed', fn: onUnsubscribed });

        this._participantListeners.set(participant, listeners);
    }

    async connectVideo(token, roomName, localVideoRef, remoteVideoRef) {
        this._cleanupBeforeConnect();

        const localTracks = await this._getLocalTracks('VIDEO');
        this.localTracks = localTracks;

        this.room = await connectTwilioVideo(token, {
            name: roomName,
            tracks: localTracks,
            automaticSubscription: true,
            dominantSpeaker: false,
            networkQuality: { local: 1, remote: 1 },
            maxAudioBitrate: 16000,
        });

        console.log('✅ Connected to video room:', this.room.name);

        if (remoteVideoRef) remoteVideoRef.innerHTML = '';

        // Attach local video to PiP
        localTracks.forEach(track => {
            if (track.kind === 'video' && localVideoRef) {
                const el = track.attach();
                el.style.cssText = 'width:100%;height:100%;object-fit:cover;';
                localVideoRef.innerHTML = '';
                localVideoRef.appendChild(el);
            }
        });

        // Wire up remote participants already in the room
        this.room.participants.forEach(participant => {
            this._attachParticipant(participant, remoteVideoRef);
        });

        // Wire up participants who join after us
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

    async connectAudio(token, roomName, onConnect, onDisconnect) {
        this._cleanupBeforeConnect();

        const localTracks = await this._getLocalTracks('PHONE');
        this.localTracks = localTracks;

        this.room = await connectTwilioVideo(token, {
            name: roomName,
            tracks: localTracks,
            automaticSubscription: true,
            dominantSpeaker: false,
            networkQuality: { local: 1, remote: 1 },
            maxAudioBitrate: 16000,
        });

        console.log('✅ Connected to audio room:', this.room.name);

        this.room.participants.forEach(participant => {
            this._attachParticipant(participant, null);
        });

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

        if (this.room.participants.size > 0) {
            setTimeout(() => onConnect?.(), 200);
        }

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

    cleanup() {
        this._participantListeners.forEach((listeners, participant) => {
            listeners.forEach(({ target, event, fn }) => {
                try { (target || participant).off(event, fn); } catch (_) {}
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
        this.isSpeakerOn = true;
        this._remoteAudioElements.clear();
        this._remoteVideoElements.clear();
    }

    disconnect() {
        this.cleanup();
    }
}

export const twilioVideoService = new TwilioVideoService();