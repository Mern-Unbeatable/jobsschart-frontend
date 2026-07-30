/** Shared ringtone + Web Audio fallback when /ringtone.mp3 is missing or autoplay is blocked */

let ringtoneAudio = null;
let beepInterval = null;
let audioContext = null;

function getRingtoneAudio() {
  if (!ringtoneAudio) {
    ringtoneAudio = new Audio('/ringtone.mp3');
    ringtoneAudio.loop = true;
    ringtoneAudio.preload = 'auto';
  }
  return ringtoneAudio;
}

function startBeepFallback() {
  stopBeepFallback();
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    audioContext = audioContext || new Ctx();

    const playBeep = () => {
      if (!audioContext) return;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.value = 0.2;
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.35);
      osc.stop(audioContext.currentTime + 0.35);
    };

    playBeep();
    beepInterval = setInterval(playBeep, 1200);
  } catch {
    /* ignore */
  }
}

function stopBeepFallback() {
  if (beepInterval) {
    clearInterval(beepInterval);
    beepInterval = null;
  }
}

export function playNotificationRingtone() {
  const audio = getRingtoneAudio();
  audio.currentTime = 0;
  audio.volume = 1;

  const playPromise = audio.play();
  if (playPromise) {
    playPromise.catch(() => startBeepFallback());
  }
}

export function stopNotificationRingtone() {
  stopBeepFallback();
  if (ringtoneAudio) {
    ringtoneAudio.pause();
    ringtoneAudio.currentTime = 0;
  }
}

/** Unlock browser audio after a user gesture (call accept, button click) */
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
    silent.play().catch(() => {});
  } catch {
    /* ignore */
  }
}
