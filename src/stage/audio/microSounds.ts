import type { SoundEvent, SoundScene } from "./audioTypes";

type ToneModule = typeof import("tone");

function toDb(volume: number, trim = 0) {
  const safeVolume = Math.max(0.0001, Math.min(0.16, volume));
  return 20 * Math.log10(safeVolume) + trim;
}

function disposeLater(node: { dispose: () => void }, ms = 1200) {
  window.setTimeout(() => node.dispose(), ms);
}

export function playMicroSound(
  Tone: ToneModule,
  event: SoundEvent,
  volume: number,
  scene: SoundScene,
  sceneId?: string | null,
) {
  const now = Tone.now();
  const sceneLift = scene === "immersive" ? 0.8 : 0;
  const proofSoftness = sceneId === "immersive-proof" ? -3 : 0;

  if (event === "hoverSoft") {
    const synth = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.044, release: 0.022 },
      harmonicity: 3.8,
      modulationIndex: 2.4,
      resonance: 1150,
      octaves: 0.24,
      volume: toDb(volume, -14 + proofSoftness),
    }).toDestination();
    synth.frequency.value = 240 + sceneLift * 14;
    synth.triggerAttackRelease("32n", now);
    disposeLater(synth, 360);
    return;
  }

  if (event === "selectPrecise") {
    const synth = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.006, decay: 0.072, sustain: 0, release: 0.055 },
      volume: toDb(volume, -11 + proofSoftness),
    }).toDestination();
    synth.triggerAttackRelease("A4", "32n", now);
    synth.triggerAttackRelease("E5", "32n", now + 0.044);
    disposeLater(synth, 520);
    return;
  }

  if (event === "openAir") {
    const noise = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.055, decay: 0.28, sustain: 0.012, release: 0.16 },
      volume: toDb(volume, -16 + proofSoftness),
    }).toDestination();
    const synth = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.035, decay: 0.24, sustain: 0.025, release: 0.2 },
      volume: toDb(volume, -12 + proofSoftness),
    }).toDestination();
    noise.triggerAttackRelease("8n", now);
    synth.triggerAttackRelease("A4", "8n", now + 0.035);
    synth.triggerAttackRelease("E5", "8n", now + 0.09);
    disposeLater(noise, 900);
    disposeLater(synth, 900);
    return;
  }

  if (event === "closeReverse") {
    const synth = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.004, decay: 0.095, sustain: 0.01, release: 0.14 },
      volume: toDb(volume, -15 + proofSoftness),
    }).toDestination();
    synth.triggerAttackRelease("E4", "16n", now);
    synth.triggerAttackRelease("A3", "16n", now + 0.075);
    disposeLater(synth, 580);
    return;
  }

  if (event === "transitionPulse") {
    const synth = new Tone.MembraneSynth({
      pitchDecay: 0.012,
      octaves: 1.4,
      oscillator: { type: "sine" },
      envelope: { attack: 0.008, decay: 0.22, sustain: 0, release: 0.1 },
      volume: toDb(volume, -16 + proofSoftness),
    }).toDestination();
    synth.triggerAttackRelease("G1", "16n", now);
    disposeLater(synth, 680);
    return;
  }

  if (event === "surfaceDrift") {
    const noise = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.018, decay: 0.16, sustain: 0.01, release: 0.09 },
      volume: toDb(volume, -18 + proofSoftness),
    }).toDestination();
    const synth = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.012, decay: 0.12, sustain: 0, release: 0.08 },
      volume: toDb(volume, -17 + proofSoftness),
    }).toDestination();
    noise.triggerAttackRelease("32n", now);
    synth.triggerAttackRelease("D4", "32n", now + 0.012);
    synth.triggerAttackRelease("A4", "32n", now + 0.055);
    disposeLater(noise, 520);
    disposeLater(synth, 560);
    return;
  }

  if (event === "atlasOpen") {
    const pulse = new Tone.MembraneSynth({
      pitchDecay: 0.02,
      octaves: 1.8,
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.32, sustain: 0, release: 0.16 },
      volume: toDb(volume, -12 + proofSoftness),
    }).toDestination();
    const air = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.045, decay: 0.38, sustain: 0.02, release: 0.2 },
      volume: toDb(volume, -17 + proofSoftness),
    }).toDestination();
    const reveal = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.035, decay: 0.3, sustain: 0.025, release: 0.22 },
      volume: toDb(volume, -13 + proofSoftness),
    }).toDestination();
    pulse.triggerAttackRelease("A1", "8n", now);
    air.triggerAttackRelease("8n", now + 0.025);
    reveal.triggerAttackRelease("D4", "8n", now + 0.07);
    reveal.triggerAttackRelease("A4", "8n", now + 0.16);
    disposeLater(pulse, 820);
    disposeLater(air, 920);
    disposeLater(reveal, 920);
    return;
  }

  if (event === "successQuiet") {
    const synth = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.008, decay: 0.11, sustain: 0.018, release: 0.13 },
      volume: toDb(volume, -12 + proofSoftness),
    }).toDestination();
    synth.triggerAttackRelease("G5", "16n", now);
    synth.triggerAttackRelease("C6", "16n", now + 0.055);
    disposeLater(synth, 600);
    return;
  }

  const synth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.004, decay: 0.075, sustain: 0, release: 0.1 },
    volume: toDb(volume, -18 + proofSoftness),
  }).toDestination();
  synth.triggerAttackRelease("F3", "16n", now);
  disposeLater(synth, 520);
}
