// src/services/twilioVideoService.js
import {
  connect as connectTwilioVideo,
  createLocalAudioTrack,
  createLocalVideoTrack,
} from 'twilio-video';

class TwilioVideoService {
  constructor() {
    this.room = null;
    this.localTracks = [];
    this.isMuted = false;
    this.isVideoOff = false;
    this._audioContainer = null;
  }

  // ── Hidden audio container for remote audio elements ──
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
    this.localTracks.forEach((track) => {
      try {
        track.stop();
        track.detach().forEach((el) => el.remove());
      } catch (e) {
        /* ignore */
      }
    });
    this.localTracks = [];

    if (this.room) {
      try {
        this.room.removeAllListeners();
        this.room.disconnect();
      } catch (e) {
        /* ignore */
      }
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
  _attachParticipant(participant, remoteVideoContainer) {
    // Attach all already-subscribed tracks
    participant.tracks.forEach((publication) => {
      if (publication.isSubscribed && publication.track) {
        this._attachTrack(publication.track, remoteVideoContainer);
      }
    });

    // Listen for future tracks being subscribed
    participant.on('trackSubscribed', (track) => {
      this._attachTrack(track, remoteVideoContainer);
    });

    // Clean up when tracks are unsubscribed
    participant.on('trackUnsubscribed', (track) => {
      track.detach().forEach((el) => el.remove());
    });
  }

  // ── BUG FIX: Attach track correctly — only ONE track.attach() call per track ──
  _attachTrack(track, remoteVideoContainer) {
    // ✅ FIX: Only ONE attach() call. The first `const el = track.attach()` at
    //    the top of the old function was creating a detached element that was
    //    never inserted into the DOM, leaking the track subscription.

    if (track.kind === 'audio') {
      const audioContainer = this._getAudioContainer();
      const el = track.attach(); // ✅ single attach call

      el.autoplay = true;
      el.playsInline = true;
      el.muted = false;
      el.volume = 1;

      audioContainer.appendChild(el);

      // Force play to handle autoplay policy
      const tryPlay = () => {
        const p = el.play();
        if (p) {
          p.catch(() => {
            setTimeout(() => el.play().catch(() => {}), 500);
          });
        }
      };

      tryPlay();

      // Fallback unlock on any user interaction
      const unlock = () => {
        tryPlay();
        document.removeEventListener('click', unlock);
        document.removeEventListener('touchstart', unlock);
      };
      document.addEventListener('click', unlock);
      document.addEventListener('touchstart', unlock);

    } else if (track.kind === 'video') {
      // ✅ FIX: remoteVideoContainer is a DOM element (ref.current), not the ref itself.
      //    We append the <video> element directly to the container div.
      if (remoteVideoContainer) {
        const el = track.attach(); // ✅ single attach call

        el.style.width = '100%';
        el.style.height = '100%';
        el.style.objectFit = 'cover';
        el.autoplay = true;
        el.playsInline = true;

        // ✅ FIX: Clear existing video elements before appending to avoid duplicates
        //    (e.g. if participant reconnects)
        const existingVideos = remoteVideoContainer.querySelectorAll('video');
        existingVideos.forEach((v) => v.remove());

        remoteVideoContainer.appendChild(el);
      }
    }
  }

  // ── Connect to VIDEO room ──
  async connectVideo(token, roomName, localVideoRef, remoteVideoRef) {
    // localVideoRef  = ref.current (DOM element) for local PiP
    // remoteVideoRef = ref.current (DOM element) for remote full-screen

    this._cleanupBeforeConnect();

    const localTracks = await this._getLocalTracks('VIDEO');
    this.localTracks = localTracks;

    this.room = await connectTwilioVideo(token, {
      name: roomName,
      tracks: localTracks,
    });

    // ── Attach local video to PiP ──
    localTracks.forEach((track) => {
      if (track.kind === 'video' && localVideoRef) {
        const el = track.attach();
        el.style.width = '100%';
        el.style.height = '100%';
        el.style.objectFit = 'cover';
        el.autoplay = true;
        el.playsInline = true;
        localVideoRef.innerHTML = '';
        localVideoRef.appendChild(el);
      }
    });

    // ── Attach ALREADY-CONNECTED remote participants ──
    this.room.participants.forEach((participant) => {
      console.log('👤 Already connected participant:', participant.identity);
      this._attachParticipant(participant, remoteVideoRef);
    });

    // ── Attach NEW participants as they join ──
    this.room.on('participantConnected', (participant) => {
      console.log('👤 Participant connected:', participant.identity);
      this._attachParticipant(participant, remoteVideoRef);
    });

    this.room.on('participantDisconnected', (participant) => {
      console.log('👤 Participant disconnected:', participant.identity);
      participant.tracks.forEach((publication) => {
        if (publication.track) {
          publication.track.detach().forEach((el) => el.remove());
        }
      });
    });

    this.room.on('disconnected', () => {
      this.cleanup();
    });

    console.log('✅ Connected to VIDEO room:', roomName);
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

    // Attach existing participants first
    this.room.participants.forEach((participant) => {
      this._attachParticipant(participant, null);
    });

    // Attach new participants
    this.room.on('participantConnected', (participant) => {
      this._attachParticipant(participant, null);
    });

    this.room.on('participantDisconnected', (participant) => {
      participant.tracks.forEach((pub) => {
        pub.track?.detach()?.forEach((el) => el.remove());
      });
    });

    this.room.on('disconnected', () => {
      this.cleanup();
      onDisconnect?.();
    });

    setTimeout(() => {
      onConnect?.();
    }, 500);

    console.log('✅ Connected to AUDIO room:', roomName);
    return this.room;
  }

  // ── Mute / Unmute ──
  mute() {
    this.localTracks.forEach((t) => {
      if (t.kind === 'audio') t.disable();
    });
    this.isMuted = true;
  }

  unmute() {
    this.localTracks.forEach((t) => {
      if (t.kind === 'audio') t.enable();
    });
    this.isMuted = false;
  }

  // ── Video on/off ──
  disableVideo() {
    if (this.room) {
      this.room.localParticipant.videoTracks.forEach((publication) => {
        if (publication.track) publication.track.disable();
      });
    }
    this.isVideoOff = true;
  }

  enableVideo() {
    if (this.room) {
      this.room.localParticipant.videoTracks.forEach((publication) => {
        if (publication.track) publication.track.enable();
      });
    }
    this.isVideoOff = false;
  }

  // ── Full Cleanup ──
  cleanup() {
    this.localTracks.forEach((track) => {
      try {
        track.stop();
        track.detach().forEach((el) => el.remove());
      } catch (e) {
        /* ignore */
      }
    });
    this.localTracks = [];

    if (this.room) {
      try {
        this.room.removeAllListeners();
        this.room.disconnect();
      } catch (e) {
        /* ignore */
      }
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