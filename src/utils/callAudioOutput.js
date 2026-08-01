/**
 * Chrome-compatible call audio routing (earpiece vs loudspeaker).
 *
 * Strategy:
 * 1. Pipe each remote <audio>/<video> through Web Audio (GainNode) so volume
 *    changes always take effect in Chrome.
 * 2. Route output with AudioContext.setSinkId() (Chrome 110+) when available,
 *    otherwise HTMLMediaElement.setSinkId().
 * 3. When no real earpiece exists (desktop Chrome), duck gain for "earpiece" mode.
 */

const SPEAKER_GAIN = 1;
/** Desktop / unknown-output fallback when earpiece hardware is unavailable */
const EARPIECE_FALLBACK_GAIN = 0.18;

/** @type {WeakMap<HTMLMediaElement, { ctx: AudioContext, gain: GainNode, source: MediaElementAudioSourceNode }>} */
const elementGraphs = new WeakMap();

let cachedOutputs = null;
let cacheTimestamp = 0;

function getTwilioAudioElements() {
  const container = document.getElementById('twilio-audio-container');
  if (!container) return [];
  return Array.from(container.querySelectorAll('audio, video'));
}

function getTwilioRemoteVideoElements() {
  return Array.from(document.querySelectorAll('[data-twilio-remote-video="true"]'));
}

export function getRemoteMediaElements() {
  const seen = new Set();
  const list = [...getTwilioAudioElements(), ...getTwilioRemoteVideoElements()];
  return list.filter((el) => {
    if (seen.has(el)) return false;
    seen.add(el);
    return true;
  });
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
  if (id === 'communications') return false;
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
  if (!forceRefresh && cachedOutputs && now - cacheTimestamp < 800) {
    return cachedOutputs;
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    cachedOutputs = devices.filter((d) => d.kind === 'audiooutput');
    cacheTimestamp = Date.now();
    return cachedOutputs;
  } catch {
    return cachedOutputs || [];
  }
}

/**
 * @returns {{ sinkId: string|null, explicitEarpiece: boolean, explicitSpeaker: boolean }}
 */
function pickSinkId(outputs, useLoudspeaker) {
  if (!outputs.length) {
    return {
      sinkId: useLoudspeaker ? 'default' : null,
      explicitEarpiece: false,
      explicitSpeaker: Boolean(useLoudspeaker),
    };
  }

  const earpieces = outputs.filter(isEarpieceDevice);
  const speakers = outputs.filter(isSpeakerDevice);
  const headphones = outputs.filter(isHeadphoneDevice);
  const others = outputs.filter(
    (d) => !isEarpieceDevice(d) && !isSpeakerDevice(d) && !isHeadphoneDevice(d),
  );

  if (useLoudspeaker) {
    const explicitSpeaker = speakers.find((d) => d.deviceId !== 'default') || speakers[0];
    const sinkId =
      explicitSpeaker?.deviceId
      || headphones[0]?.deviceId
      || others[0]?.deviceId
      || 'default';

    return { sinkId, explicitEarpiece: false, explicitSpeaker: true };
  }

  if (earpieces.length) {
    return {
      sinkId: earpieces[0].deviceId,
      explicitEarpiece: true,
      explicitSpeaker: false,
    };
  }

  const nonDefault = outputs.find(
    (d) => d.deviceId !== 'default' && !isSpeakerDevice(d),
  );
  if (nonDefault?.deviceId) {
    return {
      sinkId: nonDefault.deviceId,
      explicitEarpiece: false,
      explicitSpeaker: false,
    };
  }

  return {
    sinkId: null,
    explicitEarpiece: false,
    explicitSpeaker: false,
  };
}

async function ensureElementGraph(el) {
  const existing = elementGraphs.get(el);
  if (existing) {
    if (existing.ctx.state === 'closed') {
      elementGraphs.delete(el);
    } else {
      return existing;
    }
  }

  if (!el.srcObject && !el.src) {
    return null;
  }

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  try {
    const ctx = new AudioCtx({ latencyHint: 'interactive' });
    const source = ctx.createMediaElementSource(el);
    const gain = ctx.createGain();
    gain.gain.value = SPEAKER_GAIN;
    source.connect(gain);
    gain.connect(ctx.destination);

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const graph = { ctx, gain, source };
    elementGraphs.set(el, graph);
    return graph;
  } catch (err) {
    console.warn('[callAudio] Web Audio graph failed:', err?.message || err);
    return null;
  }
}

async function setOutputSink(target, sinkId) {
  if (!sinkId) return false;

  if (target?.setSinkId) {
    try {
      await target.setSinkId(sinkId);
      return target.sinkId === sinkId;
    } catch (err) {
      console.warn('[callAudio] setSinkId failed:', err?.message || err);
    }
  }

  return false;
}

async function routeElement(el, useSpeaker, route) {
  const { sinkId, explicitEarpiece } = route;
  const useSoftEarpiece = !useSpeaker && !explicitEarpiece;

  el.muted = false;
  el.volume = 1;

  const graph = await ensureElementGraph(el);

  const gainValue = useSpeaker
    ? SPEAKER_GAIN
    : (useSoftEarpiece ? EARPIECE_FALLBACK_GAIN : SPEAKER_GAIN);

  if (graph) {
    graph.gain.gain.setValueAtTime(gainValue, graph.ctx.currentTime);
    if (graph.ctx.state === 'suspended') {
      await graph.ctx.resume();
    }
  } else {
    el.volume = gainValue;
  }

  try {
    await el.play();
  } catch {
    // stream may not be ready
  }

  let sinkApplied = false;
  if (sinkId) {
    if (graph?.ctx?.setSinkId) {
      sinkApplied = await setOutputSink(graph.ctx, sinkId);
    }
    if (!sinkApplied && el.setSinkId) {
      sinkApplied = await setOutputSink(el, sinkId);
    }
  }

  try {
    await el.play();
  } catch {
    // ignore
  }

  return {
    gainValue,
    sinkApplied,
    hasGraph: Boolean(graph),
    usedSoftFallback: useSoftEarpiece,
  };
}

/**
 * @param {boolean} useLoudspeaker
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
  const route = pickSinkId(outputs, useSpeaker);

  let applied = 0;
  let usedSoftFallback = false;
  let lastGain = useSpeaker ? SPEAKER_GAIN : EARPIECE_FALLBACK_GAIN;

  for (const el of mediaEls) {
    const result = await routeElement(el, useSpeaker, route);
    if (result) {
      applied += 1;
      usedSoftFallback = usedSoftFallback || result.usedSoftFallback;
      lastGain = result.gainValue;
    }
  }

  return {
    route: useSpeaker ? 'speaker' : 'earpiece',
    supported: applied > 0,
    sinkId: route.sinkId,
    elementCount: mediaEls.length,
    hardwareRouted: Boolean(route.sinkId && route.explicitEarpiece),
    usedSoftFallback,
    volume: lastGain,
    explicitEarpiece: route.explicitEarpiece,
  };
}

export function releaseCallAudioRoutes(elements = null) {
  const targets = elements?.length ? elements : getRemoteMediaElements();
  for (const el of targets) {
    const graph = elementGraphs.get(el);
    if (!graph) continue;
    try {
      graph.source.disconnect();
      graph.gain.disconnect();
      graph.ctx.close();
    } catch {
      // ignore
    }
    elementGraphs.delete(el);
  }
}

export function getSpeakerToastMessage(useLoudspeaker, { supported, usedSoftFallback } = {}) {
  if (useLoudspeaker) {
    return supported === false
      ? 'Loudspeaker on (limited on this browser)'
      : 'Loudspeaker on';
  }

  if (usedSoftFallback) {
    return 'Earpiece mode — audio volume reduced';
  }

  return supported === false
    ? 'Earpiece mode (limited on this browser)'
    : 'Earpiece mode';
}

export function getSpeakerAriaLabel(useLoudspeaker) {
  return useLoudspeaker ? 'Switch to earpiece' : 'Switch to loudspeaker';
}

/** @deprecated */
export async function applyRemoteListenMode(listenOn) {
  return applyAudioOutputRoute(Boolean(listenOn));
}

/** @deprecated */
export async function applyCallSpeakerMode(speakerOn) {
  return applyAudioOutputRoute(Boolean(speakerOn));
}
