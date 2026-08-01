/**
 * Consultant notification ringtones — file-based with Web Audio fallback.
 * Browsers block autoplay until a user gesture; call setupConsultantAudioUnlock() once logged in.
 */

const CALL_RINGTONE_URL = '/sounds/incoming-call-ringtone.wav';
const CHAT_RINGTONE_URL = '/sounds/incoming-call-ringtone.wav';

let callRingtoneAudio = null;
let chatRingtoneAudio = null;
let beepInterval = null;
let audioContext = null;
let oscillatorNodes = [];
let gainNode = null;
let isMuted = false;
let audioUnlocked = false;
let unlockListenerAttached = false;

function getCallRingtoneAudio() {
  if (!callRingtoneAudio) {
    callRingtoneAudio = new Audio(CALL_RINGTONE_URL);
    callRingtoneAudio.loop = true;
    callRingtoneAudio.preload = 'auto';
    callRingtoneAudio.setAttribute('playsinline', '');
  }
  return callRingtoneAudio;
}

function getChatRingtoneAudio() {
  if (!chatRingtoneAudio) {
    chatRingtoneAudio = new Audio(CHAT_RINGTONE_URL);
    chatRingtoneAudio.loop = true;
    chatRingtoneAudio.preload = 'auto';
    chatRingtoneAudio.setAttribute('playsinline', '');
  }
  return chatRingtoneAudio;
}

function stopWebAudioRing() {
  oscillatorNodes.forEach((osc) => {
    try {
      osc.stop();
      osc.disconnect();
    } catch {
      /* already stopped */
    }
  });
  oscillatorNodes = [];
  if (gainNode) {
    try {
      gainNode.disconnect();
    } catch {
      /* ignore */
    }
    gainNode = null;
  }
  if (beepInterval) {
    clearInterval(beepInterval);
    beepInterval = null;
  }
}

/** Classic dual-tone phone ring via Web Audio (fallback when file play is blocked) */
function startWebAudioCallRing() {
  stopWebAudioRing();
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;

    audioContext = audioContext || new Ctx();
    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }

    const playBurst = (startTime, duration) => {
      [440, 480].forEach((freq) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(isMuted ? 0 : 0.18, startTime + 0.02);
        gain.gain.setValueAtTime(isMuted ? 0 : 0.18, startTime + duration - 0.02);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
        oscillatorNodes.push(osc);
      });
    };

    const cycle = () => {
      if (!audioContext) return;
      const now = audioContext.currentTime;
      playBurst(now, 0.4);
      playBurst(now + 0.55, 0.4);
    };

    cycle();
    beepInterval = setInterval(cycle, 3000);
  } catch {
    /* ignore */
  }
}

function playAudioElement(audio) {
  if (!audio || isMuted) return Promise.reject(new Error('muted'));

  audio.currentTime = 0;
  audio.volume = 1;
  audio.muted = false;

  const playPromise = audio.play();
  if (playPromise) {
    return playPromise.catch((err) => {
      startWebAudioCallRing();
      throw err;
    });
  }
  return Promise.resolve();
}

function stopAudioElement(audio) {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
}

export function preloadCallRingtone() {
  const audio = getCallRingtoneAudio();
  audio.load();
  getChatRingtoneAudio().load();
}

export function setRingtoneMuted(muted) {
  isMuted = muted;
  if (callRingtoneAudio) callRingtoneAudio.muted = muted;
  if (chatRingtoneAudio) chatRingtoneAudio.muted = muted;
  if (muted) stopWebAudioRing();
}

export function isRingtoneMuted() {
  return isMuted;
}

export function playCallRingtone() {
  if (isMuted) return;
  stopWebAudioRing();
  const audio = getCallRingtoneAudio();
  playAudioElement(audio).catch(() => {});
}

export function playChatRingtone() {
  if (isMuted) return;
  stopWebAudioRing();
  const audio = getChatRingtoneAudio();
  playAudioElement(audio).catch(() => {});
}

/** @deprecated use playCallRingtone or playChatRingtone */
export function playNotificationRingtone() {
  playCallRingtone();
}

export function stopNotificationRingtone() {
  stopWebAudioRing();
  stopAudioElement(callRingtoneAudio);
  stopAudioElement(chatRingtoneAudio);
}

/** Unlock browser audio after a user gesture (required on mobile & Safari) */
export function unlockBrowserAudio() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) {
      audioContext = audioContext || new Ctx();
      if (audioContext.state === 'suspended') {
        audioContext.resume().catch(() => {});
      }
    }

    const silent = new Audio();
    silent.muted = true;
    silent.setAttribute('playsinline', '');
    silent.play().catch(() => {});

    const ring = getCallRingtoneAudio();
    const prevVolume = ring.volume;
    ring.volume = 0.001;
    ring.play()
      .then(() => {
        ring.pause();
        ring.currentTime = 0;
        ring.volume = prevVolume;
        audioUnlocked = true;
      })
      .catch(() => {});

    audioUnlocked = true;
  } catch {
    /* ignore */
  }
}

/**
 * Attach a one-time document listener so consultant dashboard clicks unlock audio.
 * Safe to call multiple times — only attaches once.
 */
export function setupConsultantAudioUnlock() {
  if (unlockListenerAttached || typeof document === 'undefined') return;
  unlockListenerAttached = true;

  const unlock = () => {
    unlockBrowserAudio();
    preloadCallRingtone();
    document.removeEventListener('pointerdown', unlock, true);
    document.removeEventListener('keydown', unlock, true);
    document.removeEventListener('touchstart', unlock, true);
  };

  document.addEventListener('pointerdown', unlock, true);
  document.addEventListener('keydown', unlock, true);
  document.addEventListener('touchstart', unlock, true);

  preloadCallRingtone();
}

export function isAudioUnlocked() {
  return audioUnlocked;
}
