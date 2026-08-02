/**
 * Remote call audio routing (earpiece vs loudspeaker).
 *
 * Mobile (Android/iOS): route HTMLMediaElement output directly with setSinkId().
 * Web Audio is NOT used on mobile — it usually forces the loudspeaker.
 *
 * Desktop Chrome: optional Web Audio gain ducking when no earpiece device exists.
 */

const SPEAKER_GAIN = 1;
const EARPIECE_FALLBACK_GAIN = 0.12;

/** @type {WeakMap<HTMLMediaElement, { ctx: AudioContext, gain: GainNode, source: MediaElementAudioSourceNode }>} */
const elementGraphs = new WeakMap();

let cachedOutputs = null;
let cacheTimestamp = 0;

export function isMobileBrowser() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return (
    /Android|iPhone|iPad|iPod|Mobile/i.test(ua)
    || (navigator.maxTouchPoints > 1 && typeof window !== 'undefined' && window.innerWidth < 1024)
  );
}

function isAndroidBrowser() {
  return /Android/i.test(navigator.userAgent || '');
}

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
  const label = normalizeLabel(device?.label);
  const id = device?.deviceId || '';
  return (
    id === 'communications'
    || /earpiece|receiver|handset|built-in receiver|internal receiver|phone earpiece/i.test(label)
    || (isAndroidBrowser() && /^phone$|ear piece|in-ear/i.test(label))
  );
}

function isSpeakerDevice(device) {
  const label = normalizeLabel(device?.label);
  const id = device?.deviceId || '';
  if (id === 'communications') return false;
  return (
    id === 'default'
    || /speaker|loud|speakerphone|built-in speaker|external speaker/i.test(label)
  );
}

function isHeadphoneDevice(device) {
  const label = normalizeLabel(device?.label);
  return /headphone|headset|earbud|airpod|bluetooth|usb audio|hdmi|wired/i.test(label);
}

async function enumerateAudioOutputs(forceRefresh = false) {
  if (!navigator.mediaDevices?.enumerateDevices) return [];

  const now = Date.now();
  if (!forceRefresh && cachedOutputs && now - cacheTimestamp < 500) {
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

function releaseElementGraph(el) {
  const graph = elementGraphs.get(el);
  if (!graph) return;
  try {
    graph.source.disconnect();
    graph.gain.disconnect();
    graph.ctx.close();
  } catch {
    // ignore
  }
  elementGraphs.delete(el);
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
    const explicitSpeaker =
      speakers.find((d) => d.deviceId !== 'default' && d.deviceId !== 'communications')
      || speakers[0];
    const sinkId =
      explicitSpeaker?.deviceId
      || headphones[0]?.deviceId
      || others[0]?.deviceId
      || 'default';

    return { sinkId, explicitEarpiece: false, explicitSpeaker: true };
  }

  // ── Earpiece / receiver mode ──────────────────────────────────
  const communications = outputs.find((d) => d.deviceId === 'communications');
  if (communications) {
    return {
      sinkId: communications.deviceId,
      explicitEarpiece: true,
      explicitSpeaker: false,
    };
  }

  if (earpieces.length) {
    return {
      sinkId: earpieces[0].deviceId,
      explicitEarpiece: true,
      explicitSpeaker: false,
    };
  }

  if (isAndroidBrowser() && outputs.length >= 2) {
    const likelySpeaker = speakers[0] || outputs.find((d) => d.deviceId === 'default');
    const alternate = outputs.find((d) => d !== likelySpeaker && d.deviceId !== 'default');
    if (alternate?.deviceId) {
      return {
        sinkId: alternate.deviceId,
        explicitEarpiece: true,
        explicitSpeaker: false,
      };
    }
  }

  const nonSpeaker = outputs.find(
    (d) => d.deviceId !== 'default' && !isSpeakerDevice(d),
  );
  if (nonSpeaker?.deviceId) {
    return {
      sinkId: nonSpeaker.deviceId,
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

async function setOutputSink(target, sinkId) {
  if (!target?.setSinkId || sinkId == null) return false;

  try {
    await target.setSinkId(sinkId);
    return target.sinkId === sinkId;
  } catch (err) {
    console.warn('[callAudio] setSinkId failed:', sinkId, err?.message || err);
    return false;
  }
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

  if (!el.srcObject && !el.src) return null;

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

async function applyAudioSessionType(useSpeaker) {
  if (!('audioSession' in navigator)) return false;
  try {
    navigator.audioSession.type = useSpeaker ? 'playback' : 'voice';
    return true;
  } catch {
    return false;
  }
}

async function routeElementDirect(el, useSpeaker, route) {
  releaseElementGraph(el);

  await applyAudioSessionType(useSpeaker);

  el.muted = false;
  el.volume = 1;
  el.setAttribute('playsinline', 'true');
  el.setAttribute('webkit-playsinline', 'true');

  let sinkApplied = false;
  const candidates = [];

  if (useSpeaker) {
    if (route.sinkId) candidates.push(route.sinkId);
    candidates.push('default');
  } else if (route.sinkId) {
    candidates.push(route.sinkId);
    if (isAndroidBrowser()) candidates.push('communications');
  }

  for (const sinkId of candidates) {
    if (sinkId == null) continue;
    sinkApplied = await setOutputSink(el, sinkId);
    if (sinkApplied) break;
  }

  const usedSoftFallback = !useSpeaker && !sinkApplied;
  if (usedSoftFallback) {
    el.volume = EARPIECE_FALLBACK_GAIN;
  }

  try {
    await el.play();
  } catch {
    // stream may not be ready
  }

  return {
    gainValue: el.volume,
    sinkApplied,
    hasGraph: false,
    usedSoftFallback,
  };
}

async function routeElementWithGraph(el, useSpeaker, route) {
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

async function routeElement(el, useSpeaker, route) {
  if (isMobileBrowser()) {
    return routeElementDirect(el, useSpeaker, route);
  }
  return routeElementWithGraph(el, useSpeaker, route);
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
      mobile: isMobileBrowser(),
    };
  }

  if (isMobileBrowser()) {
    mediaEls.forEach(releaseElementGraph);
    await applyAudioSessionType(useSpeaker);
  }

  const outputs = await enumerateAudioOutputs(Boolean(options.forceRefresh));
  const route = pickSinkId(outputs, useSpeaker);

  let applied = 0;
  let usedSoftFallback = false;
  let sinkAppliedAny = false;
  let lastGain = useSpeaker ? SPEAKER_GAIN : EARPIECE_FALLBACK_GAIN;

  for (const el of mediaEls) {
    const result = await routeElement(el, useSpeaker, route);
    if (result) {
      applied += 1;
      usedSoftFallback = usedSoftFallback || result.usedSoftFallback;
      sinkAppliedAny = sinkAppliedAny || result.sinkApplied;
      lastGain = result.gainValue;
    }
  }

  return {
    route: useSpeaker ? 'speaker' : 'earpiece',
    supported: applied > 0,
    sinkId: route.sinkId,
    elementCount: mediaEls.length,
    hardwareRouted: sinkAppliedAny || route.explicitEarpiece,
    usedSoftFallback,
    volume: lastGain,
    explicitEarpiece: route.explicitEarpiece,
    mobile: isMobileBrowser(),
  };
}

export function releaseCallAudioRoutes(elements = null) {
  const targets = elements?.length ? elements : getRemoteMediaElements();
  for (const el of targets) {
    releaseElementGraph(el);
  }
}

export function getSpeakerToastMessage(useLoudspeaker, { supported, usedSoftFallback, mobile, hardwareRouted } = {}) {
  if (useLoudspeaker) {
    if (supported === false) return 'Loudspeaker on (limited on this browser)';
    return 'Loudspeaker on';
  }

  if (mobile && hardwareRouted) {
    return 'Earpiece mode';
  }

  if (usedSoftFallback) {
    return 'Earpiece mode — audio volume reduced (hardware routing unavailable)';
  }

  if (supported === false) {
    return 'Earpiece mode (limited on this browser)';
  }

  return 'Earpiece mode';
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
