import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { createPortal } from "react-dom";
import type { PublicLocale } from "../../data/projectRegistry.types";
import { getLocalizedPath } from "../../i18n";
import { headerSceneThemes } from "../header/headerThemeTokens";
import type { DirectorReceipt, PresenterCta } from "./directorContract";
import type { PresenterAnswer, PresenterCopy } from "./presenterContent";
import Disclosure from "./PresenterDisclosure";
import type { PresenterPhase } from "./presenterMachine";
import { presenterRestFrame, type PresenterClip } from "./presenterMedia";
import type { PresenterPosition } from "./usePresenterPlayback";

const RECEIPT_MARK = { running: "→", done: "✓", failed: "!", interrupted: "‖", cancelled: "", skipped: "" } as const;
const PLATE_SIZES = "(min-width: 1440px) 200px, 132px";

// The dock wears the tone the header is heading to over the scene the director is showing: a scene whose header text
// is light is a dark scene. Read from the scene tokens, not the header's live colour, which morphs over time.
function sceneTone(): "dark" | "light" {
  const foreground = headerSceneThemes[document.documentElement.dataset.activeHeaderScene ?? ""]?.foreground ?? "#000000";
  const value = parseInt(/^#([0-9a-f]{6})$/i.exec(foreground)?.[1] ?? "000000", 16);
  return 0.2126 * (value >> 16) + 0.7152 * ((value >> 8) & 255) + 0.0722 * (value & 255) > 150 ? "dark" : "light";
}

function DockCta({ cta, locale, onCta }: { cta: PresenterCta; locale: PublicLocale; onCta: (cta: PresenterCta) => void }) {
  if (cta.kind !== "route") return <button type="button" className="studio-presence__cta" onClick={() => onCta(cta)}>
    {cta.label}<span aria-hidden="true">{cta.kind === "project" ? "↗" : "✓"}</span>
  </button>;
  const href = getLocalizedPath(cta.path, locale);
  return <a className="studio-presence__cta" href={href} onClick={(event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onCta(cta);
  }}>{cta.label}<span aria-hidden="true">↗</span></a>;
}

/** The presenter while it directs the site: the live portrait, the line being spoken, what is on screen, one next step. */
export default function PresenterDock({ locale, copy, answer, phase, position, receipt, clip, muted, plateRef, origin, mountMedia,
  onStop, onReplay, onBack, onClose, onCta, onToggleVoice }: {
  locale: PublicLocale;
  copy: PresenterCopy;
  answer: PresenterAnswer;
  phase: PresenterPhase;
  position: PresenterPosition;
  receipt: DirectorReceipt | null;
  clip?: PresenterClip;
  muted: boolean;
  plateRef: RefObject<HTMLDivElement | null>;
  // Where the HOME stage plate was when the answer started; the dock plate grows out of it.
  origin: DOMRect | null;
  mountMedia: (host: HTMLElement) => () => void;
  onStop: () => void;
  onReplay: () => void;
  onBack: () => void;
  onClose: () => void;
  onCta: (cta: PresenterCta) => void;
  onToggleVoice: () => void;
}) {
  const dockRef = useRef<HTMLDivElement>(null);
  const [tone, setTone] = useState(sceneTone);
  const playing = phase === "playing_answer";
  const speaking = playing && position.status === "speaking";
  const withVoice = Boolean(clip?.hasAudio) && (position.status === "loading" || position.status === "speaking");

  useEffect(() => {
    const observer = new MutationObserver(() => setTone(sceneTone()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-active-header-scene"] });
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const plate = plateRef.current;
    return plate ? mountMedia(plate) : undefined;
  }, [mountMedia, plateRef]);

  // The portrait travels from the HOME stage into the dock once, when the dock first appears.
  const originRef = useRef(origin);
  useLayoutEffect(() => {
    const plate = plateRef.current;
    const from = originRef.current;
    if (!plate || !from || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const to = plate.getBoundingClientRect();
    if (!to.width) return;
    const animation = plate.animate([
      { transformOrigin: "0 0", transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})` },
      { transformOrigin: "0 0", transform: "none" },
    ], { duration: 720, easing: "cubic-bezier(.22, 1, .36, 1)" });
    return () => animation.cancel();
  }, [plateRef]);

  // A new tour moves keyboard focus to its controls; the page behind keeps scrolling normally.
  useEffect(() => { dockRef.current?.focus({ preventScroll: true }); }, [answer.id]);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    event.stopPropagation();
    onClose();
  };
  const receiptText = !receipt ? null
    : receipt.status === "interrupted" ? copy.receipt.interrupted
    : `${copy.receipt[receipt.status === "done" ? "done" : receipt.status === "failed" ? "failed" : "running"]} · ${receipt.label}`;
  const status = !playing ? null
    : position.status === "loading" ? copy.media.loading
    : position.status === "transcript" ? copy.media.pending
    : position.status === "unavailable" ? copy.media.unavailable
    : null;
  const showCue = playing && position.started;

  return createPortal(<div ref={dockRef} className="studio-dock" role="region" aria-label={copy.region} lang={locale} tabIndex={-1}
    data-phase={phase} data-tone={tone} data-media={playing ? position.status : "rest"} data-sound-safe-area onKeyDown={onKeyDown}>
    <div ref={plateRef} className="studio-dock__plate" data-active={speaking ? "true" : undefined}>
      <img src={presenterRestFrame.src} srcSet={presenterRestFrame.srcSet} sizes={PLATE_SIZES}
        width={presenterRestFrame.width} height={presenterRestFrame.height} alt="" decoding="async" />
      <span className="studio-presence__progress" aria-hidden="true"><span /></span>
    </div>
    <div className="studio-dock__bar">
      <p className="studio-presence__disclosure"><Disclosure text={copy.disclosure} /></p>
      <button type="button" className="studio-presence__toggle studio-dock__close" onClick={onClose}>
        <span className="studio-dock__close-label">{copy.close}</span><span aria-hidden="true" className="studio-presence__x">×</span>
      </button>
    </div>
    <div className="studio-dock__body">
      {/* Stable live regions (a re-inserted node is often not announced); only the inner line is re-keyed to animate. */}
      <p className="studio-dock__caption" data-kind={showCue ? "cue" : "question"} aria-live="polite">
        <span key={showCue ? position.cue : "question"}>{showCue ? answer.cues[position.cue] : answer.question}</span>
      </p>
      <p className="studio-dock__status" data-status={status ? position.status : undefined} role="status">{status}</p>
      {receiptText && receipt && <p key={`${receipt.step}-${receipt.status}`} className="studio-dock__receipt" data-status={receipt.status}>
        <span aria-hidden="true">{RECEIPT_MARK[receipt.status]}</span>{receiptText}
      </p>}
    </div>
    <div className="studio-dock__actions">
      <DockCta cta={answer.cta} locale={locale} onCta={onCta} />
      {playing
        ? <button type="button" className="studio-presence__utility" onClick={onStop}><span aria-hidden="true" className="studio-presence__glyph-stop" />{copy.stop}</button>
        : <button type="button" className="studio-presence__utility" onClick={onReplay}><span aria-hidden="true">↺</span>{copy.replay}</button>}
      <button type="button" className="studio-presence__utility" onClick={onBack}><span aria-hidden="true">←</span>{copy.back}</button>
      {withVoice && <button type="button" className="studio-presence__utility" aria-pressed={!muted} onClick={onToggleVoice}>{copy.voice}</button>}
    </div>
  </div>, document.body);
}
