import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import type { CharacterMedia } from "../../data/avatarMedia";
import type { AvatarLocale, AvatarProfile } from "../../data/avatarProfiles";
import type { AvatarsCopy } from "../../data/avatarsCopy";
import { useStagePresence } from "./useStagePresence";

const clock = (seconds: number) => {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

type Props = {
  profile: AvatarProfile;
  media: CharacterMedia | undefined;
  lang: AvatarLocale;
  copy: AvatarsCopy["presence"];
  stage: RefObject<HTMLElement | null>;
  children: ReactNode;
  instanceId?: string;
};

/** The stage screen: the poster stills (children) with the actor's recorded media layered on top in exactly the same frame,
 *  and a restrained overlay for the introduction. Characters without media keep the still and an honest status. */
export default function StagePresence({ profile, media, lang, copy, stage, children, instanceId }: Props) {
  const overlay = useRef<HTMLDivElement>(null);
  // Keyboard focus follows the overlay when it swaps (Play ⇄ controls ⇄ Try again), so it never drops to the page.
  const focusNext = useRef<"controls" | "play" | null>(null);
  const keepFocus = useCallback((target: "controls" | "play") => {
    if (overlay.current?.contains(document.activeElement)) focusNext.current = target;
  }, []);
  const onSettle = useCallback((outcome: "ended" | "failed") => keepFocus(outcome === "ended" ? "play" : "controls"), [keepFocus]);
  const { idleRef, speechRef, state, heard, caption, time, muted, idle, spoken, captionTrack, start, pause, resume, stop, toggleMute, speechEvents, idleEvents } =
    useStagePresence({ media, locale: lang, stage, onSettle });
  useEffect(() => {
    if (!focusNext.current) return;
    const target = overlay.current?.querySelector<HTMLButtonElement>(focusNext.current === "play" ? ".av-presence__play" : ".av-presence__controls button");
    if (!target) return;
    focusNext.current = null;
    target.focus({ preventScroll: true });
  });
  const onPlay = () => {
    keepFocus("controls");
    start();
  };
  const onStop = () => {
    keepFocus("play");
    stop();
  };

  const frame = { "--focal": profile.imageFocalPoint, "--zoom": profile.stageZoom } as CSSProperties;
  const speechShown = state === "speech-playing" || state === "speech-paused";
  const busy = state === "speech-loading";
  const active = speechShown || busy;
  const length = spoken ? clock(spoken.durationSec) : "";
  const transcriptId = `avatar-transcript-${profile.id}-${lang}${instanceId ? `-${instanceId}` : ''}`;

  return (
    <div className="av-stage__screen" data-presence={state}>
      <figure className="av-stage__figure">
        {children}
        {idle ? (
          <video
            crossOrigin="anonymous"
            key={`${profile.id}:${idle.src}`}
            ref={idleRef}
            className={state === "idle-playing" ? "av-stage__video is-on" : "av-stage__video"}
            style={frame}
            muted
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            aria-hidden="true"
            tabIndex={-1}
            {...idleEvents}
          />
        ) : null}
        {spoken ? (
          <video
            crossOrigin="anonymous"
            key={`${profile.id}:${lang}:${spoken.src}`}
            ref={speechRef}
            className={speechShown ? "av-stage__video av-stage__video--speech is-on" : "av-stage__video av-stage__video--speech"}
            style={frame}
            playsInline
            preload="none"
            disablePictureInPicture
            aria-label={`${copy.groupLabel}: ${profile.name}`}
            aria-describedby={transcriptId}
            tabIndex={-1}
            {...speechEvents}
          >
            {captionTrack ? <track key={captionTrack.src} kind="captions" src={captionTrack.src} srcLang={captionTrack.srcLang} label={captionTrack.label} /> : null}
          </video>
        ) : null}
      </figure>

      {spoken ? (
        <div className="av-presence" ref={overlay} role="group" aria-label={`${copy.groupLabel} — ${profile.name}`} data-sound-safe-area onKeyDown={event => { if (event.key === 'Escape' && active) { event.stopPropagation(); onStop(); } }}>
          <span className="sr-only" role="status">{busy ? copy.loading : state === "media-error" ? copy.error : ""}</span>
          {active ? (
            <>
              <p className="av-presence__caption" aria-hidden={caption ? undefined : true}>{caption ? <span>{caption}</span> : null}</p>
              <div className="av-presence__bar" aria-hidden="true">
                <span style={{ transform: `scaleX(${time.duration ? Math.min(1, time.current / time.duration) : 0})` }} />
              </div>
              <div className="av-presence__controls">
                {state === "speech-paused" ? (
                  <button type="button" className="av-presence__button" onClick={resume}>{copy.resume}</button>
                ) : (
                  <button type="button" className="av-presence__button" onClick={busy ? undefined : pause} aria-disabled={busy || undefined}>{busy ? copy.loading : copy.pause}</button>
                )}
                <button type="button" className="av-presence__button" onClick={onStop}>{copy.stop}</button>
                <button type="button" className="av-presence__button" onClick={toggleMute}>{muted ? copy.unmute : copy.mute}</button>
                <span className="av-presence__time">{clock(time.current)} / {clock(time.duration || spoken.durationSec)}</span>
                <button type="button" className="av-presence__button av-presence__close" onClick={onStop} aria-label={lang === 'es' ? 'Cerrar presentación' : 'Close introduction'}>×</button>
              </div>
            </>
          ) : state === "media-error" ? (
            <div className="av-presence__controls">
              <span className="av-presence__note" aria-hidden="true">{copy.error}</span>
              <button type="button" className="av-presence__button" onClick={onPlay}>{copy.retry}</button>
            </div>
          ) : (
            <button type="button" className="av-presence__play" onClick={onPlay} aria-describedby={transcriptId} aria-label={`${heard ? copy.replay : copy.play} — ${profile.name}, ${copy.recorded}, ${length}`}>
              <span className="av-presence__glyph" aria-hidden="true" />
              <span>{heard ? copy.replay : copy.play}</span>
              <span className="av-presence__meta" aria-hidden="true">{copy.recorded} · {length}</span>
            </button>
          )}
        </div>
      ) : (
        <p className="av-presence av-presence--concept">{media ? copy.unavailable : copy.concept}</p>
      )}
      {spoken ? <p id={transcriptId} className="sr-only" lang={spoken.audioLocale}>{spoken.transcript}</p> : null}
    </div>
  );
}
