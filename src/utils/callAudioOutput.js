/**
 * Route Twilio remote audio to loudspeaker or earpiece (WhatsApp / Imo style).
 * Uses HTMLMediaElement.setSinkId() where supported, with a volume fallback
 * when the browser cannot route to a physical earpiece.
 */

const SPEAKER_VOLUME = 1;
/** Softer playback when hardware earpiece routing is unavailable (e.g. laptop speakers). */
const EARPIECE_SOFT_VOLUME = 0.38;

let cachedOutputs = null;
let cacheTimestamp = 0;
const OUTPUT_CACHE_MS = 1500;

function getTwilioAudioElements() {
  const container = document.getElementById('twilio-audio-container');
  if (!container) return [];
  return Array.from(container.querySelectorAll('audio'));
}

function getTwilioRemoteVideoElements() {
  return Array.from(document.querySelectorAll('[data-twilio-remote-video="true"]'));
}

export function getRemoteMediaElements() {
  return [...getTwilioAudioElements(), ...getTwilioRemoteVideoElements()];
}

function normalizeLabel(label = '') {
  return label.toLowerCase().trim();
}

function isEarpieceDevice(device) {
  const label = normalizeLabel(device.label);
  const id = device.deviceId || '';
  return (
    id === 'communications'
    || /earpiece|receiver|handset|built-in receiver|internal receiver|phone earpiece/i.test(label)
  );
}

function isSpeakerDevice(device) {
  const label = normalizeLabel(device.label);
  const id = device.deviceId || '';
  return (
    id === 'default'
    || /speaker|loud|speakerphone|built-in speaker|external speaker/i.test(label)
  );
}

function isHeadphoneDevice(device) {
  const label = normalizeLabel(device.label);
  return /headphone|headset|earbud|airpod|bluetooth|usb audio|hdmi/i.test(label);
}

async function enumerateAudioOutputs(forceRefresh = false) {
  if (!navigator.mediaDevices?.enumerateDevices) return [];

  const now = Date.now();
  if (!forceRefresh && cachedOutputs && now - cacheTimestamp < OUTPUT_CACHE_MS) {
    return cachedOutputs;
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    cachedOutputs = devices.filter((d) => d.kind === 'audiooutput');
    cacheTimestamp = now;
    return cachedOutputs;
  } catch {
    return cachedOutputs || [];
  }
}

function pickAudioRoute(outputs, useLoudspeaker) {
  if (!outputs.length) {
    return {
      sinkId: useLoudspeaker ? 'default' : null,
      hardwareRouted: false,
      usedSoftFallback: !useLoudspeaker,
    };
  }

  const earpieces = outputs.filter(isEarpieceDevice);
  const speakers = outputs.filter(isSpeakerDevice);
  const headphones = outputs.filter(isHeadphoneDevice);
  const remaining = outputs.filter(
    (d) => !isEarpieceDevice(d) && !isSpeakerDevice(d) && !isHeadphoneDevice(d),
  );

  if (useLoudspeaker) {
    const explicitSpeaker = speakers.find((d) => d.deviceId !== 'default');
    const sinkId =
      explicitSpeaker?.deviceId
      || speakers[0]?.deviceId
      || headphones[0]?.deviceId
      || remaining[0]?.deviceId
      || 'default';

    return { sinkId, hardwareRouted: true, usedSoftFallback: false };
  }

  if (earpieces.length) {
    return {
      sinkId: earpieces[0].deviceId,
      hardwareRouted: true,
      usedSoftFallback: false,
    };
  }

  const nonSpeaker = outputs.find(
    (d) => d.deviceId !== 'default' && !isSpeakerDevice(d),
  );
  if (nonSpeaker?.deviceId) {
    return {
      sinkId: nonSpeaker.deviceId,
      hardwareRouted: true,
      usedSoftFallback: false,
    };
  }

  // Only one output (typical laptop/desktop) — cannot hardware-route to earpiece.
  return {
    sinkId: null,
    hardwareRouted: false,
    usedSoftFallback: true,
  };
}

function canUseSetSinkId() {
  return (
    typeof HTMLMediaElement !== 'undefined'
    && typeof HTMLMediaElement.prototype.setSinkId === 'function'
  );
}

async function applySinkToElement(el, sinkId) {
  el.muted = false;

  try {
    await el.play();
  } catch {
    // Continue — stream may not be ready yet.
  }

  if (sinkId != null && canUseSetSinkId()) {
    try {
      await el.setSinkId(sinkId);
    } catch (err) {
      console.warn('[callAudio] setSinkId failed:', err?.message || err);
      return false;
    }

    try {
      await el.play();
    } catch {
      // ignore
    }

    if (el.sinkId !== sinkId) {
      await new Promise((resolve) => setTimeout(resolve, 80));
      try {
        await el.setSinkId(sinkId);
        await el.play();
      } catch {
        return false;
      }
    }
  }

  return sinkId == null || el.sinkId === sinkId;
}

/**
 * @param {boolean} useLoudspeaker - true = loudspeaker, false = earpiece
 * @param {HTMLMediaElement[]} [elements]
 * @param {{ forceRefresh?: boolean }} [options]
 */
export async function applyAudioOutputRoute(useLoudspeaker, elements = null, options = {}) {
  const mediaEls = elements?.length ? elements : getRemoteMediaElements();
  const useSpeaker = Boolean(useLoudspeaker);

  if (!mediaEls.length) {
    return {
      route: useSpeaker ? 'speaker' : 'earpiece',
      supported: false,
      elementCount: 0,
      usedSoftFallback: false,
    };
  }

  const outputs = await enumerateAudioOutputs(Boolean(options.forceRefresh));
  const { sinkId, hardwareRouted, usedSoftFallback } = pickAudioRoute(outputs, useSpeaker);

  const targetVolume = useSpeaker
    ? SPEAKER_VOLUME
    : (hardwareRouted ? SPEAKER_VOLUME : EARPIECE_SOFT_VOLUME);

  let applied = 0;
  for (const el of mediaEls) {
    el.volume = targetVolume;
    const ok = await applySinkToElement(el, hardwareRouted ? sinkId : null);
    if (ok || !hardwareRouted) applied += 1;
  }

  return {
    route: useSpeaker ? 'speaker' : 'earpiece',
    supported: applied > 0,
    sinkId: hardwareRouted ? sinkId : null,
    elementCount: mediaEls.length,
    hardwareRouted,
    usedSoftFallback: !useSpeaker && usedSoftFallback,
    volume: targetVolume,
  };
}

export function getSpeakerToastMessage(useLoudspeaker, { supported, usedSoftFallback } = {}) {
  if (useLoudspeaker) {
    return supported === false
      ? 'Loudspeaker mode (output routing may be limited on this device)'
      : 'Loudspeaker on';
  }

  if (usedSoftFallback) {
    return 'Earpiece mode (reduced speaker volume on this device)';
  }

  return supported === false
    ? 'Earpiece mode (output routing may be limited on this device)'
    : 'Earpiece mode';
}

export function getSpeakerAriaLabel(useLoudspeaker) {
  return useLoudspeaker ? 'Switch to earpiece' : 'Switch to loudspeaker';
}

/** @deprecated use applyAudioOutputRoute */
export async function applyRemoteListenMode(listenOn) {
  return applyAudioOutputRoute(Boolean(listenOn));
}

/** @deprecated use applyAudioOutputRoute */
export async function applyCallSpeakerMode(speakerOn) {
  return applyAudioOutputRoute(Boolean(speakerOn));
}
