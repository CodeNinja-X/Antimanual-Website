// Realistic Physical UI Sound Engine for Antimanual
// 100% Organic Physical Mechanical Card Slide & Whoosh (Zero notification/synth beeps)

let audioCtx = null;
let compressor = null;

export function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx) {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    if (!compressor && audioCtx) {
      try {
        compressor = audioCtx.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-18, audioCtx.currentTime);
        compressor.knee.setValueAtTime(12, audioCtx.currentTime);
        compressor.ratio.setValueAtTime(6, audioCtx.currentTime);
        compressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
        compressor.release.setValueAtTime(0.15, audioCtx.currentTime);
        compressor.connect(audioCtx.destination);
      } catch (e) {}
    }
  }
  return audioCtx;
}

// Unlock audio context on initial user interaction
if (typeof window !== 'undefined') {
  const unlock = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  };
  window.addEventListener('pointerdown', unlock, { passive: true });
  window.addEventListener('mousedown', unlock, { passive: true });
  window.addEventListener('touchstart', unlock, { passive: true });
  window.addEventListener('keydown', unlock, { passive: true });
  window.addEventListener('wheel', unlock, { passive: true });
}

/**
 * Creates realistic noise buffer for organic physical materials
 */
function createRichNoiseBuffer(ctx, durationSec = 0.35) {
  const bufferSize = Math.floor(ctx.sampleRate * durationSec);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let last = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    // Brown/pink smoothed noise for organic physical texture
    last = (last + 0.08 * white) / 1.08;
    data[i] = last * 3.5 + white * 0.25;
  }
  return buffer;
}

/**
 * Realistic Physical Card Swoosh & Slide
 * Plays a rich, physical card sliding sound with aerodynamic whoosh and surface snap
 */
export function playRealCardWhoosh(direction = 1) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => playEffect(ctx, direction)).catch(() => {});
    } else {
      playEffect(ctx, direction);
    }
  } catch (e) {}
}

function playEffect(ctx, direction = 1) {
  try {
    const dest = compressor || ctx.destination;
    const now = ctx.currentTime + 0.001;
    const duration = 0.26;

    // 1. Aerodynamic Air Displacement (Whoosh)
    const noiseBuffer = createRichNoiseBuffer(ctx, duration);
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;

    const whooshFilter = ctx.createBiquadFilter();
    whooshFilter.type = 'bandpass';
    whooshFilter.Q.setValueAtTime(1.4, now);

    const startFreq = direction >= 0 ? 600 : 1800;
    const peakFreq = direction >= 0 ? 2200 : 1000;
    const endFreq = 400;

    whooshFilter.frequency.setValueAtTime(startFreq, now);
    whooshFilter.frequency.exponentialRampToValueAtTime(peakFreq, now + 0.09);
    whooshFilter.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

    const whooshGain = ctx.createGain();
    whooshGain.gain.setValueAtTime(0.001, now);
    whooshGain.gain.linearRampToValueAtTime(0.75, now + 0.07);
    whooshGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseNode.connect(whooshFilter);
    whooshFilter.connect(whooshGain);
    whooshGain.connect(dest);

    // 2. Physical Card Surface Friction (Mid texture slide)
    const frictionNode = ctx.createBufferSource();
    frictionNode.buffer = noiseBuffer;

    const frictionFilter = ctx.createBiquadFilter();
    frictionFilter.type = 'lowpass';
    frictionFilter.frequency.setValueAtTime(1400, now);
    frictionFilter.frequency.exponentialRampToValueAtTime(500, now + duration);

    const frictionGain = ctx.createGain();
    frictionGain.gain.setValueAtTime(0.001, now);
    frictionGain.gain.linearRampToValueAtTime(0.55, now + 0.04);
    frictionGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.85);

    frictionNode.connect(frictionFilter);
    frictionFilter.connect(frictionGain);
    frictionGain.connect(dest);

    // 3. Low-Frequency Air Displacement (Sub-bass wind body)
    const subNode = ctx.createBufferSource();
    subNode.buffer = noiseBuffer;

    const subFilter = ctx.createBiquadFilter();
    subFilter.type = 'lowpass';
    subFilter.frequency.setValueAtTime(180, now);
    subFilter.frequency.exponentialRampToValueAtTime(70, now + 0.18);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.65, now + 0.05);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    subNode.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(dest);

    // 4. Physical Card Snap / Click at departure
    const snapSize = Math.floor(ctx.sampleRate * 0.025);
    const snapBuffer = ctx.createBuffer(1, snapSize, ctx.sampleRate);
    const snapData = snapBuffer.getChannelData(0);
    for (let i = 0; i < snapSize; i++) {
      snapData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (snapSize * 0.18));
    }
    const snapNode = ctx.createBufferSource();
    snapNode.buffer = snapBuffer;

    const snapFilter = ctx.createBiquadFilter();
    snapFilter.type = 'highpass';
    snapFilter.frequency.setValueAtTime(2000, now);

    const snapGain = ctx.createGain();
    snapGain.gain.setValueAtTime(0.45, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    snapNode.connect(snapFilter);
    snapFilter.connect(snapGain);
    snapGain.connect(dest);

    // Start all nodes
    noiseNode.start(now);
    noiseNode.stop(now + duration);
    frictionNode.start(now);
    frictionNode.stop(now + duration);
    subNode.start(now);
    subNode.stop(now + 0.22);
    snapNode.start(now + 0.005);
    snapNode.stop(now + 0.03);
  } catch (e) {}
}

export const playHapticSnap = playRealCardWhoosh;
export const playZepSound = playRealCardWhoosh;
