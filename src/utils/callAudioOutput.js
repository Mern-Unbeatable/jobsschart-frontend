/**
 * Route Twilio remote audio to loudspeaker or earpiece (WhatsApp / Imo style).
 * Uses HTMLMediaElement.setSinkId() where the browser supports it.
 */

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

async function enumerateAudioOutputs() {
  if (!navigator.mediaDevices?.enumerateDevices) return [];
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((d) => d.kind === 'audiooutput');
  } catch {
    return [];
  }
}

function normalizeLabel(label = '') {
  return label.toLowerCase();
}

function pickSinkId(outputs, useLoudspeaker) {
  if (!outputs.length) {
    return useLoudspeaker ? 'default' : '';
  }

  if (useLoudspeaker) {
    const speaker = outputs.find((d) =>
      /speaker|loud|speakerphone|built-in speaker|external|hdmi|bluetooth/i.test(normalizeLabel(d.label)),
    );
    if (speaker?.deviceId) return speaker.deviceId;

    const notEarpiece = outputs.find(
      (d) => !/earpiece|receiver|handset|phone/i.test(normalizeLabel(d.label)),
    );
    return notEarpiece?.deviceId || outputs[0]?.deviceId || 'default';
  }

  const earpiece = outputs.find((d) =>
    /earpiece|receiver|handset|built-in receiver|phone/i.test(normalizeLabel(d.label)),
  );
  if (earpiece?.deviceId) return earpiece.deviceId;

  return '';
}

function canUseSetSinkId() {
  return (
    typeof HTMLMediaElement !== 'undefined'
    && typeof HTMLMediaElement.prototype.setSinkId === 'function'
  );
}

/**
 * @param {boolean} useLoudspeaker - true = loudspeaker, false = earpiece / normal phone
 * @param {HTMLMediaElement[]} [elements]
 */
export async function applyAudioOutputRoute(useLoudspeaker, elements = null) {
  const mediaEls = elements?.length ? elements : getRemoteMediaElements();

  for (const el of mediaEls) {
    el.muted = false;
    el.volume = 1;
  }

  if (!mediaEls.length) {
    return {
      route: useLoudspeaker ? 'speaker' : 'earpiece',
      supported: false,
      elementCount: 0,
    };
  }

  if (!canUseSetSinkId()) {
    return {
      route: useLoudspeaker ? 'speaker' : 'earpiece',
      supported: false,
      elementCount: mediaEls.length,
    };
  }

  const outputs = await enumerateAudioOutputs();
  const sinkId = pickSinkId(outputs, useLoudspeaker);

  let applied = 0;
  for (const el of mediaEls) {
    try {
      if (el.sinkId !== sinkId) {
        await el.setSinkId(sinkId);
      }
      await el.play().catch(() => {});
      applied += 1;
    } catch (err) {
      console.warn('[callAudio] setSinkId failed:', err?.message || err);
    }
  }

  return {
    route: useLoudspeaker ? 'speaker' : 'earpiece',
    supported: applied > 0,
    sinkId,
    elementCount: mediaEls.length,
  };
}

export function getSpeakerToastMessage(useLoudspeaker, { supported } = {}) {
  if (useLoudspeaker) {
    return supported === false
      ? 'Loudspeaker mode (output routing may be limited on this device)'
      : 'Loudspeaker on';
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
