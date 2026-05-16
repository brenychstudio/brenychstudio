import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { audioEngine } from "./audioEngine";
import { audioManifest, resolveAmbientVolume, resolveSoundEvent, resolveSoundVolume } from "./audioManifest";
import {
  readSoundPreference,
  writeSoundPreference,
} from "./audioPreferences";
import type { AmbientState, SoundEvent, SoundEventRole, SoundPreference, SoundScene } from "./audioTypes";

type SoundContextValue = {
  preference: SoundPreference;
  scene: SoundScene;
  sceneId: string | null;
  ambientState: AmbientState;
  ambientEnabled: boolean;
  enable: () => Promise<void>;
  enableAmbient: () => Promise<void>;
  disableAmbient: () => void;
  startSceneAmbient: (scene: SoundScene, sceneId?: string | null) => Promise<void>;
  stopAmbient: () => void;
  setAmbientSceneLevel: (sceneId: string | null) => void;
  continueSilent: () => void;
  disable: () => void;
  mute: () => void;
  unmute: () => Promise<void>;
  play: (event: SoundEvent) => void;
  playRole: (role: SoundEventRole) => void;
  setScene: (scene: SoundScene, sceneId?: string | null) => void;
  setSceneId: (sceneId: string | null) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<SoundPreference>(() => readSoundPreference());
  const [scene, setSceneState] = useState<SoundScene>("portfolio");
  const [sceneId, setSceneIdState] = useState<string | null>(null);
  const [ambientState, setAmbientState] = useState<AmbientState>("off");
  const [ambientSuppressed, setAmbientSuppressed] = useState(false);

  const setSoundCssVariable = useCallback((name: string, value: string) => {
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty(name, value);
  }, []);

  const triggerVisualPulse = useCallback(() => {
    if (typeof window === "undefined") return;
    setSoundCssVariable("--sound-pulse", "1");
    window.setTimeout(() => setSoundCssVariable("--sound-pulse", "0"), 260);
  }, [setSoundCssVariable]);

  useEffect(() => {
    audioEngine.setMuted(preference.muted || !preference.enabled);
    audioEngine.setVolume(preference.volume);
  }, [preference.enabled, preference.muted, preference.volume]);

  useEffect(() => {
    setSoundCssVariable("--sound-presence", preference.enabled && !preference.muted ? "1" : "0");
    setSoundCssVariable("--sound-ambient", ambientState === "playing" || ambientState === "loading" ? "1" : "0");
  }, [ambientState, preference.enabled, preference.muted, setSoundCssVariable]);

  const updatePreference = useCallback((nextPreference: SoundPreference) => {
    setPreference(nextPreference);
    writeSoundPreference(nextPreference);
    audioEngine.setMuted(nextPreference.muted || !nextPreference.enabled);
    audioEngine.setVolume(nextPreference.volume);
  }, []);

  const syncAmbientState = useCallback(() => {
    setAmbientState(audioEngine.getAmbientState());
  }, []);

  const setScene = useCallback((nextScene: SoundScene, nextSceneId: string | null = null) => {
    setSceneState(nextScene);
    setSceneIdState(nextSceneId);
    if (nextScene !== "immersive") setAmbientSuppressed(false);
    audioEngine.setScene(nextScene);
    audioEngine.setVolume(resolveSoundVolume(nextScene, nextSceneId));
    audioEngine.rampAmbientVolume(resolveAmbientVolume(nextScene, nextSceneId), 1.45);
  }, []);

  const setSceneId = useCallback(
    (nextSceneId: string | null) => {
      setSceneIdState(nextSceneId);
      audioEngine.setVolume(resolveSoundVolume(scene, nextSceneId));
      audioEngine.rampAmbientVolume(resolveAmbientVolume(scene, nextSceneId), 1.45);
    },
    [scene],
  );

  const enable = useCallback(async () => {
    const nextVolume = resolveSoundVolume(scene, sceneId);
    const started = await audioEngine.enable({ volume: nextVolume, scene });
    if (!started) return;

    const nextMode = audioManifest[scene].ambient ? "micro-ambient" : "micro";
    updatePreference({
      enabled: true,
      muted: false,
      mode: nextMode,
      volume: nextVolume,
    });
    setAmbientSuppressed(false);

    const ambient = audioManifest[scene].ambient;
    if (ambient) {
      setAmbientState("loading");
      await audioEngine.startAmbient(ambient, resolveAmbientVolume(scene, sceneId));
      syncAmbientState();
    }

    audioEngine.play("successQuiet");
  }, [scene, sceneId, syncAmbientState, updatePreference]);

  const startSceneAmbient = useCallback(
    async (nextScene: SoundScene, nextSceneId: string | null = null) => {
      const ambient = audioManifest[nextScene].ambient;
      if (!ambient || ambientSuppressed || !preference.enabled || preference.muted) {
        audioEngine.stopAmbient(ambient?.fadeOut ?? 0.9);
        setAmbientState("off");
        return;
      }

      setAmbientState("loading");
      await audioEngine.startAmbient(ambient, resolveAmbientVolume(nextScene, nextSceneId));
      syncAmbientState();
    },
    [ambientSuppressed, preference.enabled, preference.muted, syncAmbientState],
  );

  const setAmbientSceneLevel = useCallback(
    (nextSceneId: string | null) => {
      if (!preference.enabled || preference.muted) return;
      audioEngine.rampAmbientVolume(resolveAmbientVolume(scene, nextSceneId), 1.2);
    },
    [preference.enabled, preference.muted, scene],
  );

  const enableAmbient = useCallback(async () => {
    setAmbientSuppressed(false);

    const ambient = audioManifest[scene].ambient;
    if (!ambient || !preference.enabled || preference.muted) {
      audioEngine.stopAmbient(ambient?.fadeOut ?? 0.9);
      setAmbientState("off");
      return;
    }

    setAmbientState("loading");
    await audioEngine.startAmbient(ambient, resolveAmbientVolume(scene, sceneId));
    syncAmbientState();
  }, [preference.enabled, preference.muted, scene, sceneId, syncAmbientState]);

  const stopAmbient = useCallback(() => {
    audioEngine.stopAmbient(audioManifest[scene].ambient?.fadeOut ?? 0.9);
    setAmbientState("off");
  }, [scene]);

  const disableAmbient = useCallback(() => {
    setAmbientSuppressed(true);
    audioEngine.stopAmbient(audioManifest[scene].ambient?.fadeOut ?? 0.9);
    setAmbientState("off");
  }, [scene]);

  const continueSilent = useCallback(() => {
    audioEngine.stopAmbient(audioManifest[scene].ambient?.fadeOut ?? 0.9);
    setAmbientSuppressed(false);
    setAmbientState("off");
    updatePreference({
      enabled: false,
      muted: true,
      mode: "silent",
      volume: resolveSoundVolume(scene, sceneId),
    });
  }, [scene, sceneId, updatePreference]);

  const disable = useCallback(() => {
    continueSilent();
  }, [continueSilent]);

  const mute = useCallback(() => {
    audioEngine.stopAmbient(audioManifest[scene].ambient?.fadeOut ?? 0.9, "muted");
    setAmbientState("muted");
    updatePreference({
      ...preference,
      enabled: true,
      muted: true,
      mode: audioManifest[scene].ambient ? "micro-ambient" : "micro",
    });
  }, [preference, scene, updatePreference]);

  const unmute = useCallback(async () => {
    const nextVolume = resolveSoundVolume(scene, sceneId);
    const started = await audioEngine.enable({ volume: nextVolume, scene });
    if (!started) return;
    const nextMode = audioManifest[scene].ambient ? "micro-ambient" : "micro";
    updatePreference({ enabled: true, muted: false, mode: nextMode, volume: nextVolume });
    const ambient = audioManifest[scene].ambient;
    if (ambient && !ambientSuppressed) {
      setAmbientState("loading");
      await audioEngine.startAmbient(ambient, resolveAmbientVolume(scene, sceneId));
      syncAmbientState();
    }
    audioEngine.play("successQuiet");
  }, [ambientSuppressed, scene, sceneId, syncAmbientState, updatePreference]);

  const play = useCallback(
    (event: SoundEvent) => {
      if (!preference.enabled || preference.muted) return;
      if (event === "transitionPulse") triggerVisualPulse();
      audioEngine.play(event, { volume: resolveSoundVolume(scene, sceneId), sceneId });
    },
    [preference.enabled, preference.muted, scene, sceneId, triggerVisualPulse],
  );

  const playRole = useCallback(
    (role: SoundEventRole) => {
      if (!preference.enabled || preference.muted) return;
      const event = resolveSoundEvent(role, scene, sceneId);
      if (event === "transitionPulse") triggerVisualPulse();
      audioEngine.play(event, {
        volume: resolveSoundVolume(scene, sceneId),
        sceneId,
      });
    },
    [preference.enabled, preference.muted, scene, sceneId, triggerVisualPulse],
  );

  const value = useMemo<SoundContextValue>(
    () => ({
      preference,
      scene,
      sceneId,
      ambientState,
      ambientEnabled: ambientState === "playing" || ambientState === "loading",
      enable,
      enableAmbient,
      disableAmbient,
      startSceneAmbient,
      stopAmbient,
      setAmbientSceneLevel,
      continueSilent,
      disable,
      mute,
      unmute,
      play,
      playRole,
      setScene,
      setSceneId,
    }),
    [
      preference,
      scene,
      sceneId,
      ambientState,
      enable,
      enableAmbient,
      disableAmbient,
      startSceneAmbient,
      stopAmbient,
      setAmbientSceneLevel,
      continueSilent,
      disable,
      mute,
      unmute,
      play,
      playRole,
      setScene,
      setSceneId,
    ],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSoundContext() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used inside SoundProvider.");
  }
  return context;
}
