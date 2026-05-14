import type { AmbientConfig, AmbientState, SoundEvent, SoundScene } from "./audioTypes";
import { playMicroSound } from "./microSounds";

type ToneModule = typeof import("tone");

class AudioEngine {
  private tone: ToneModule | null = null;
  private started = false;
  private muted = true;
  private volume = 0.06;
  private scene: SoundScene = "portfolio";
  private hoverPlayedAt = 0;
  private enabling: Promise<boolean> | null = null;
  private ambientAudio: HTMLAudioElement | null = null;
  private ambientConfig: AmbientConfig | null = null;
  private ambientState: AmbientState = "off";
  private ambientFadeFrame: number | null = null;

  async enable({ volume, scene }: { volume: number; scene: SoundScene }) {
    this.volume = volume;
    this.scene = scene;
    this.muted = false;

    if (this.started) return true;
    if (this.enabling) return this.enabling;

    this.enabling = import("tone")
      .then(async (Tone) => {
        this.tone = Tone;
        await Tone.start();
        this.started = true;
        return true;
      })
      .catch(() => false)
      .finally(() => {
        this.enabling = null;
      });

    return this.enabling;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (muted) {
      this.stopAmbient(this.ambientConfig?.fadeOut, "muted");
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0.012, Math.min(0.11, volume));
  }

  setScene(scene: SoundScene) {
    this.scene = scene;
  }

  private setAmbientState(state: AmbientState) {
    this.ambientState = state;
  }

  private cancelAmbientFade() {
    if (this.ambientFadeFrame === null) return;
    window.cancelAnimationFrame(this.ambientFadeFrame);
    this.ambientFadeFrame = null;
  }

  private fadeAmbientTo(targetVolume: number, durationSeconds: number, after?: () => void) {
    const audio = this.ambientAudio;
    if (!audio) return;

    this.cancelAmbientFade();

    const startVolume = audio.volume;
    const startedAt = performance.now();
    const duration = Math.max(1, durationSeconds * 1000);

    const tick = (time: number) => {
      const progress = Math.min(1, (time - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      audio.volume = startVolume + (targetVolume - startVolume) * eased;

      if (progress < 1) {
        this.ambientFadeFrame = window.requestAnimationFrame(tick);
        return;
      }

      this.ambientFadeFrame = null;
      after?.();
    };

    this.ambientFadeFrame = window.requestAnimationFrame(tick);
  }

  private createAmbientAudio(config: AmbientConfig) {
    const audio = new Audio(config.src);
    audio.loop = config.loop;
    audio.preload = "auto";
    audio.volume = 0;

    if (config.fallbackSrc) {
      audio.addEventListener(
        "error",
        () => {
          if (!this.ambientAudio || this.ambientAudio.src.endsWith(config.fallbackSrc ?? "")) {
            this.setAmbientState("failed");
            return;
          }

          const fallback = new Audio(config.fallbackSrc);
          fallback.loop = config.loop;
          fallback.preload = "auto";
          fallback.volume = 0;
          this.ambientAudio = fallback;
          void this.startAmbient(config);
        },
        { once: true },
      );
    }

    return audio;
  }

  async loadAmbient(config: AmbientConfig) {
    if (!this.started) return;
    if (this.ambientAudio && this.ambientConfig?.src === config.src) return;

    this.stopAmbient(0);
    this.ambientConfig = config;
    this.ambientAudio = this.createAmbientAudio(config);
  }

  async startAmbient(config?: AmbientConfig, targetVolume?: number) {
    if (!this.started || this.muted) return false;

    const nextConfig = config ?? this.ambientConfig;
    if (!nextConfig) return false;

    await this.loadAmbient(nextConfig);
    const audio = this.ambientAudio;
    if (!audio) return false;

    try {
      this.setAmbientState("loading");
      await audio.play();
      this.setAmbientState("playing");
      this.fadeAmbientTo(targetVolume ?? nextConfig.volume, nextConfig.fadeIn);
      return true;
    } catch {
      this.setAmbientState("failed");
      return false;
    }
  }

  stopAmbient(fadeOut = 0.9, state: AmbientState = "off") {
    const audio = this.ambientAudio;
    if (!audio) {
      this.setAmbientState(state);
      return;
    }

    const finish = () => {
      audio.pause();
      audio.volume = 0;
      this.setAmbientState(state);
    };

    if (fadeOut <= 0) {
      this.cancelAmbientFade();
      finish();
      return;
    }

    this.fadeAmbientTo(0, fadeOut, finish);
  }

  setAmbientVolume(volume: number, rampSeconds = 1.35) {
    const audio = this.ambientAudio;
    if (!audio) return;
    this.fadeAmbientTo(Math.max(0, Math.min(0.09, volume)), rampSeconds);
  }

  isAmbientPlaying() {
    return Boolean(this.ambientAudio && !this.ambientAudio.paused && this.ambientState === "playing");
  }

  getAmbientState() {
    return this.ambientState;
  }

  play(event: SoundEvent, options?: { volume?: number; sceneId?: string | null }) {
    if (!this.started || this.muted || !this.tone) return;

    if (event === "hoverSoft") {
      const now = performance.now();
      if (now - this.hoverPlayedAt < 180) return;
      this.hoverPlayedAt = now;
    }

    try {
      playMicroSound(this.tone, event, options?.volume ?? this.volume, this.scene, options?.sceneId);
    } catch {
      // Sound is optional; interaction must never fail because audio failed.
    }
  }
}

export const audioEngine = new AudioEngine();
