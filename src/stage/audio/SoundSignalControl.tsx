import { useSound } from "./useSound";

export default function SoundSignalControl() {
  const sound = useSound();
  const { ambientState, preference, scene } = sound;
  const enabled = preference.enabled && !preference.muted;
  const muted = preference.enabled && preference.muted;
  const immersiveAmbient = scene === "immersive" && (ambientState === "playing" || ambientState === "loading");
  const status = enabled ? (immersiveAmbient ? "Ambient" : "Active") : muted ? "Muted" : "Silent";
  const ambientLabel =
    ambientState === "playing"
      ? "Ambient: spatial air"
      : ambientState === "loading"
        ? "Ambient: loading"
        : ambientState === "muted"
          ? "Ambient paused"
          : ambientState === "failed"
            ? "Ambient unavailable"
            : "Ambient off";
  const detail = enabled
    ? immersiveAmbient
      ? "Micro + ambient active"
      : "Micro layer active"
    : muted
      ? "Sound layer paused"
      : preference.mode === "silent"
        ? "Silent route stored"
        : "Micro-sound layer available";

  return (
    <div className="max-w-[23rem] border-y border-neutral-950/12 bg-white/78 px-4 py-3 text-neutral-950 shadow-[0_18px_70px_rgba(20,20,20,0.08)] backdrop-blur-md">
      <div className="flex items-center justify-between gap-5">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
            Sound signal
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-neutral-400">
            {status} / {detail}
          </div>
          {scene === "immersive" && enabled ? (
            <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-300">{ambientLabel}</div>
          ) : null}
        </div>
        <span
          className={[
            "h-2 w-2 rounded-full",
            enabled ? "bg-neutral-950" : "bg-neutral-300",
          ].join(" ")}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {!preference.enabled ? (
          <>
            <button
              type="button"
              onClick={sound.enable}
              onMouseEnter={() => sound.playRole("hover")}
              className="rounded-full border border-neutral-950 bg-neutral-950 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
            >
              Enable sound
            </button>
            <button
              type="button"
              onClick={sound.continueSilent}
              className="rounded-full border border-neutral-300 bg-white/50 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-neutral-600 transition hover:-translate-y-0.5 hover:bg-white"
            >
              Continue silent
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={preference.muted ? sound.unmute : sound.mute}
              onMouseEnter={() => sound.playRole("hover")}
              className="rounded-full border border-neutral-950/20 bg-white/50 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-neutral-700 transition hover:-translate-y-0.5 hover:border-neutral-950/40 hover:bg-white"
            >
              {preference.muted ? "Unmute" : "Mute"}
            </button>
            {scene === "immersive" && !preference.muted ? (
              <button
                type="button"
                onClick={sound.ambientEnabled ? sound.disableAmbient : sound.enableAmbient}
                onMouseEnter={() => sound.playRole("hover")}
                className="rounded-full border border-neutral-950/10 bg-white/38 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-neutral-500 transition hover:-translate-y-0.5 hover:border-neutral-950/28 hover:bg-white hover:text-neutral-800"
              >
                {sound.ambientEnabled ? "Ambient off" : "Ambient on"}
              </button>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
