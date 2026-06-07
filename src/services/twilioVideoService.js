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

    // ── Hidden container for <audio> elements (MUST be in DOM for sound to play) ──
    _getAudioContainer() {
        if (!this._audioContainer) {
            let container = document.getElementById('twilio-audio-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'twilio-audio-container';
                container.style.display = 'none';
                document.body.appendChild(container);
            }
            this._audioContainer = container;
        }
        return this._audioContainer;
    }

    // ── Create local tracks gracefully (no crash if no camera/mic) ──
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

    // ── Attach a single track to the correct DOM element ──
    _attachTrack(track, remoteVideoRef, audioContainer) {
        const el = track.attach();

        if (track.kind === 'audio') {
            // ✅ Audio MUST be in the DOM for the browser to play it
            el.setAttribute('autoplay', '');
            el.setAttribute('playsinline', '');
            audioContainer.appendChild(el);
        } else if (track.kind === 'video') {
            if (remoteVideoRef) {
                remoteVideoRef.appendChild(el);
            }
        }
    }

    // ── Connect to VIDEO room ──
    async connectVideo(token, roomName, localVideoRef, remoteVideoRef) {
        const localTracks = await this._getLocalTracks('VIDEO');
        this.localTracks = localTracks;

        this.room = await connectTwilioVideo(token, {
            name: roomName,
            tracks: localTracks,
        });

        console.log('✅ Connected to video room:', this.room.name);

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
        const localTracks = await this._getLocalTracks('PHONE');
        this.localTracks = localTracks;

        this.room = await connectTwilioVideo(token, {
            name: roomName,
            tracks: localTracks,
        });

        console.log('✅ Connected to audio room:', this.room.name);

        // ✅ Attach ALREADY-CONNECTED remote participants (for their audio)
        this.room.participants.forEach(participant => {
            this._attachParticipant(participant, null);
        });

        // ✅ Attach NEW participants as they connect
        this.room.on('participantConnected', participant => {
            this._attachParticipant(participant, null);
            onConnect?.();
        });

        this.room.on('participantDisconnected', () => {
            onDisconnect?.();
        });

        this.room.on('disconnected', () => {
            this.cleanup();
            onDisconnect?.();
        });

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
            track.stop();
            track.detach().forEach(el => el.remove());
        });
        this.localTracks = [];

        if (this.room) {
            this.room.disconnect();
            this.room = null;
        }

        // Clean up the hidden audio container
        if (this._audioContainer) {
            this._audioContainer.innerHTML = '';
        }
    }

    disconnect() {
        this.cleanup();
    }
}

export const twilioVideoService = new TwilioVideoService();