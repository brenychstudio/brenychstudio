import { useSound } from "./useSound";

export default function SoundSignalControl() {
  const sound = useSound();
  const { ambientState, preference } = sound;
  const enabled = preference.enabled && !preference.muted;
  const muted = preference.enabled && preference.muted;
  const status = enabled ? "Enabled" : muted ? "Muted" : "Silent";
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
    ? `Micro layer active / ${ambientLabel}`
    : muted
      ? "Sound layer paused"
      : preference.mode === "silent"
        ? "Silent route stored"
        : "Micro-sound and spatial ambience available";

  return (
    <div className="max-w-[23rem] border-y border-neutral-950/12 bg-white/20 px-4 py-3 text-neutral-950 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-5">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
            Sound signal
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-neutral-400">
            {status} / {detail}
          </div>
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
          <button
            type="button"
            onClick={preference.muted ? sound.unmute : sound.mute}
            className="rounded-full border border-neutral-950/20 bg-white/50 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-neutral-700 transition hover:-translate-y-0.5 hover:border-neutral-950/40 hover:bg-white"
          >
            {preference.muted ? "Unmute" : "Mute"}
          </button>
        )}
      </div>
    </div>
  );
}
