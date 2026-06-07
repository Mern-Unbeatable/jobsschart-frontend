// src/services/twilioVideoService.js
import { connect as connectTwilioVideo } from 'twilio-video';

class TwilioVideoService {
    constructor() {
        this.room = null;
        this.localTracks = [];
        this.isMuted = false;
        this.isVideoOff = false;
    }

    // Connect to video room
    async connectVideo(token, roomName, localVideoRef, remoteVideoRef) {
        try {
            // Connect to the room
            this.room = await connectTwilioVideo(token, {
                name: roomName,
                audio: true,
                video: { width: 640, height: 480 },
            });


            // Handle local participant
            this.room.localParticipant.videoTracks.forEach(publication => {
                if (publication.track) {
                    const track = publication.track;
                    const videoElement = track.attach();
                    if (localVideoRef) {
                        localVideoRef.innerHTML = '';
                        localVideoRef.appendChild(videoElement);
                    }
                }
            });

            this.room.localParticipant.audioTracks.forEach(publication => {
                if (publication.track) {
                    this.localTracks.push(publication.track);
                }
            });

            // Handle remote participants
            this.room.on('participantConnected', (participant) => {

                participant.videoTracks.forEach(publication => {
                    if (publication.isSubscribed) {
                        const track = publication.track;
                        const videoElement = track.attach();
                        if (remoteVideoRef) {
                            remoteVideoRef.innerHTML = '';
                            remoteVideoRef.appendChild(videoElement);
                        }
                    }
                });

                participant.on('trackSubscribed', (track) => {
                    if (track.kind === 'video') {
                        const videoElement = track.attach();
                        if (remoteVideoRef) {
                            remoteVideoRef.innerHTML = '';
                            remoteVideoRef.appendChild(videoElement);
                        }
                    }
                });
            });

            // Handle participant disconnection
            this.room.on('participantDisconnected', (participant) => {
                if (remoteVideoRef) {
                    remoteVideoRef.innerHTML = '';
                }
            });

            // Handle disconnect
            this.room.on('disconnected', () => {
                this.cleanup();
            });

            return this.room;
        } catch (error) {
            console.error('Failed to connect to video room:', error);
            throw error;
        }
    }

    // Connect to audio-only call
    async connectAudio(token, roomName, onConnect, onDisconnect) {
        try {
            this.room = await connectTwilioVideo(token, {
                name: roomName,
                audio: true,
                video: false,
            });

            this.room.localParticipant.audioTracks.forEach(publication => {
                if (publication.track) {
                    this.localTracks.push(publication.track);
                }
            });

            this.room.on('participantConnected', () => {
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
        } catch (error) {
            console.error('Failed to connect to audio call:', error);
            throw error;
        }
    }

    // Mute audio
    mute() {
        if (this.localTracks.length > 0) {
            this.localTracks.forEach(track => {
                if (track.kind === 'audio') {
                    track.disable();
                }
            });
            this.isMuted = true;
        }
    }

    // Unmute audio
    unmute() {
        if (this.localTracks.length > 0) {
            this.localTracks.forEach(track => {
                if (track.kind === 'audio') {
                    track.enable();
                }
            });
            this.isMuted = false;
        }
    }

    // Disable video
    disableVideo() {
        if (this.room) {
            this.room.localParticipant.videoTracks.forEach(publication => {
                if (publication.track) {
                    publication.track.disable();
                }
            });
            this.isVideoOff = true;
        }
    }

    // Enable video
    enableVideo() {
        if (this.room) {
            this.room.localParticipant.videoTracks.forEach(publication => {
                if (publication.track) {
                    publication.track.enable();
                }
            });
            this.isVideoOff = false;
        }
    }

    // Cleanup tracks
    cleanup() {
        if (this.localTracks.length > 0) {
            this.localTracks.forEach(track => {
                track.stop();
                track.detach();
            });
            this.localTracks = [];
        }

        if (this.room) {
            this.room.disconnect();
            this.room = null;
        }
    }

    // Disconnect
    disconnect() {
        this.cleanup();
    }
}

export const twilioVideoService = new TwilioVideoService();