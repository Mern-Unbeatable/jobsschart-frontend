/**
 * Mute/unmute remote call audio locally (what you hear from the other person).
 */

function getTwilioAudioElements() {
  const container = document.getElementById('twilio-audio-container');
  if (!container) return [];
  return Array.from(container.querySelectorAll('audio'));
}

function getTwilioRemoteVideoElements() {
  return Array.from(document.querySelectorAll('[data-twilio-remote-video="true"]'));
}

/**
 * @param {boolean} listenOn - true = hear remote party, false = silence remote audio
 */
export async function applyRemoteListenMode(listenOn) {
  const audios = getTwilioAudioElements();
  const videos = getTwilioRemoteVideoElements();

  for (const audio of audios) {
    if (!listenOn) {
      audio.muted = true;
      audio.volume = 0;
    } else {
      audio.muted = false;
      audio.volume = 1;
    }
  }

  for (const video of videos) {
    video.muted = !listenOn;
    if (!listenOn) {
      video.volume = 0;
    } else {
      video.volume = 1;
    }
  }

  return { listenOn, elementCount: audios.length + videos.length };
}

/** @deprecated use applyRemoteListenMode */
export async function applyCallSpeakerMode(speakerOn) {
  return applyRemoteListenMode(speakerOn);
}
