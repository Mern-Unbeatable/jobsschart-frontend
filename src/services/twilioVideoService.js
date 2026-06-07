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

    // ── Hidden container for <audio> elements (MUST be in DOM for sound) ──
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

    // ── Clean up existing connection BEFORE creating a new one ──
    _cleanupBeforeConnect() {
        // Stop and detach local tracks
        this.localTracks.forEach(track => {
            try {
                track.stop();
                track.detach().forEach(el => el.remove());
            } catch (e) { /* ignore */ }
        });
        this.localTracks = [];

        // Disconnect existing room
        if (this.room) {
            try {
                this.room.removeAllListeners();
                this.room.disconnect();
            } catch (e) { /* ignore */ }
            this.room = null;
        }

        // Clear audio container
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
            console.log('✅ Local audio track created:', audioTrack.id);
        } catch (e) {
            console.warn('⚠️ No microphone:', e.message);
        }
        if (callType === 'VIDEO') {
            try {
                const videoTrack = await createLocalVideoTrack({ width: 640, height: 480 });
                tracks.push(videoTrack);
                console.log('✅ Local video track created:', videoTrack.id);
            } catch (e) {
                console.warn('⚠️ No camera:', e.message);
            }
        }
        return tracks;
    }

    // ── Attach a participant's tracks (BOTH audio + video) ──
    _attachParticipant(participant, remoteVideoRef) {
        const audioContainer = this._getAudioContainer();
        console.log(`📎 Attaching participant: ${participant.identity}, tracks: ${participant.tracks.size}`);

        // Attach all already-subscribed tracks
        participant.tracks.forEach(publication => {
            if (publication.isSubscribed && publication.track) {
                console.log(`  → Already subscribed: ${publication.track.kind} (${publication.track.id})`);
                this._attachTrack(publication.track, remoteVideoRef, audioContainer);
            } else {
                console.log(`  → Not yet subscribed: ${publication.kind}`);
            }
        });

        // Listen for future tracks being subscribed
        participant.on('trackSubscribed', track => {
            console.log(`  → Track subscribed: ${track.kind} (${track.id})`);
            this._attachTrack(track, remoteVideoRef, audioContainer);
        });

        // Clean up when tracks are unsubscribed
        participant.on('trackUnsubscribed', track => {
            console.log(`  → Track unsubscribed: ${track.kind} (${track.id})`);
            track.detach().forEach(el => el.remove());
        });
    }

    // ── Attach a single track to the correct DOM element ──
    _attachTrack(track, remoteVideoRef, audioContainer) {
        const el = track.attach();

        if (track.kind === 'audio') {
            el.setAttribute('autoplay', '');
            el.setAttribute('playsinline', '');
            audioContainer.appendChild(el);
            console.log(`🔊 Audio element appended to container, total audio elements: ${audioContainer.children.length}`);
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

        console.log('✅ Connected to VIDEO room:', this.room.name, 'Local identity:', this.room.localParticipant.identity);

        // Log local tracks published
        this.room.localParticipant.tracks.forEach(publication => {
            console.log(`📤 Published local track: ${publication.kind} (${publication.track?.id})`);
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
            console.log(`👤 Participant connected: ${participant.identity}`);
            this._attachParticipant(participant, remoteVideoRef);
        });

        this.room.on('participantDisconnected', participant => {
            console.log(`👤 Participant disconnected: ${participant.identity}`);
            participant.tracks.forEach(publication => {
                if (publication.track) {
                    publication.track.detach().forEach(el => el.remove());
                }
            });
        });

        this.room.on('disconnected', () => {
            console.log('🔌 Disconnected from room');
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

        console.log('✅ Connected to AUDIO room:', this.room.name, 'Local identity:', this.room.localParticipant.identity);

        // Log local tracks published
        this.room.localParticipant.tracks.forEach(publication => {
            console.log(`📤 Published local track: ${publication.kind} (${publication.track?.id})`);
        });

        // ✅ Attach ALREADY-CONNECTED remote participants (for their audio)
        this.room.participants.forEach(participant => {
            this._attachParticipant(participant, null);
            onConnect?.();
        });

        // ✅ Attach NEW participants as they connect
        this.room.on('participantConnected', participant => {
            console.log(`👤 Participant connected: ${participant.identity}`);
            this._attachParticipant(participant, null);
            onConnect?.();
        });

        this.room.on('participantDisconnected', participant => {
            console.log(`👤 Participant disconnected: ${participant.identity}`);
            participant.tracks.forEach(publication => {
                if (publication.track) {
                    publication.track.detach().forEach(el => el.remove());
                }
            });
            onDisconnect?.();
        });

        this.room.on('disconnected', () => {
            console.log('🔌 Disconnected from audio room');
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