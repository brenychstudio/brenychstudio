import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useScroll } from "framer-motion";
import { getLocalizedPath } from "../../i18n/routes";
import HomeManagedVideo, { type HomeManagedVideoHandle, type HomeManagedVideoStatus } from "../../media/home/HomeManagedVideo";
import { useHomeMediaRuntime } from "../../media/home/useHomeMediaRuntime";
import { homeCopy } from "./homeCopy";
import { Arrow, HomeLink, HomeSection, SectionLabel, type HomeSectionProps } from "./HomePrimitives";
import type { HomeSpatialProof } from "./homeSpatialPresentation";
import { resolveHomeSpatialFrame, resolveHomeSpatialLayoutProfile, resolveHomeSpatialMediaFit, resolveHomeSpatialMotionRate, resolveHomeSpatialScene,
  stepHomeSpatialMotion, type HomeSpatialBounds, type HomeSpatialMotionState, type HomeSpatialPlane, type SpatialRect } from "./homeSpatialModel";

const CINEMATIC_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const MEDIA_KEYS = ["whisperSourceEligible", "whisperPlaybackEligible", "webheroSourceEligible", "webheroPlaybackEligible", "webheroRevealEligible"] as const;
const ENV_VARS = ["--spatial-env-x", "--spatial-env-y", "--spatial-env-w", "--spatial-env-h", "--spatial-bleed-left", "--spatial-bleed-right", "--spatial-rail-x", "--spatial-rail-y"];
type Anchor = { element: HTMLElement; y: number; focus: boolean };
// Preserve the focused proof's position when possible; a shorter viewport still
// needs room below the target for the fixed Home sound control.
const visibleAnchorY = (saved: Anchor) => {
  const height = saved.element.offsetHeight;
  if (!saved.focus || (saved.y >= 84 && saved.y + height <= innerHeight - 60)) return saved.y;
  return Math.min(Math.max(84, innerHeight - height - 80), Math.max(84, saved.y));
};
const px = (n: number) => `${n.toFixed(2)}px`, num = (n: number) => n.toFixed(5);
// Cinematic posters are frames of each proof's own video at the time its playback starts (WHISPER 0 s, WEBHERO's 4 s
// entry), so a reveal never cuts between two compositions. Reader keeps the projected posters.
const CINEMATIC_POSTERS: Record<HomeSpatialProof["key"], string> = {
  whisper: "/immersive/Whisper/desktop/whisper-hero-video-frame-0000ms.webp",
  webhero: "/immersive/webhero/desktop/webhero-field-video-frame-4000ms.webp",
};
const WEBHERO_ENTRY_SECONDS = 4;

function SpatialPreview({ proof, sourceEligible, sceneEligible, revealEligible, autoplay, cinematic, locale, navigate, final }: {
  proof: HomeSpatialProof; sourceEligible: boolean; sceneEligible: boolean; revealEligible: boolean; autoplay: boolean; cinematic: boolean;
  locale: HomeSectionProps["locale"]; navigate: HomeSectionProps["navigate"]; final: boolean;
}) {
  // The media and its sibling control share one handle; visibility remains in the Home provider.
  const handle = useRef<HomeManagedVideoHandle>(null);
  const plane = useRef<HTMLDivElement>(null), userPaused = useRef(false);
  const control = useRef<HTMLButtonElement | null>(null);
  const retainControlFocus = useCallback((node: HTMLButtonElement | null) => {
    if (!node && control.current === document.activeElement) {
      control.current?.closest("article")?.querySelector<HTMLElement>(".eco-spatial-case-link")?.focus({ preventScroll: true });
    }
    control.current = node;
  }, []);
  const [status, setStatus] = useState<HomeManagedVideoStatus>("far");
  useEffect(() => {
    // WEBHERO paused by the page (scene exit or scrolled out of view, not a viewer's Pause): once its entry-frame poster
    // fully covers the frame, the source returns to that entry frame, so every re-entry resolves ring -> identical ring.
    if (proof.key !== "webhero" || !cinematic || !autoplay || status !== "paused" || userPaused.current) return;
    const timer = window.setTimeout(() => {
      const host = plane.current?.querySelector<HTMLElement>("[data-home-managed-video]"), video = host?.querySelector("video");
      const covered = host?.lastElementChild ? Number(getComputedStyle(host.lastElementChild).opacity) >= .999 : false;
      if (!video?.getAttribute("src") || !covered || !video.paused || video.ended || video.seeking || userPaused.current ||
        Math.abs(video.currentTime - WEBHERO_ENTRY_SECONDS) < .05) return;
      video.currentTime = WEBHERO_ENTRY_SECONDS;
    }, 600);
    return () => window.clearTimeout(timer);
  }, [proof.key, cinematic, autoplay, status]);
  const { mode } = useHomeMediaRuntime();
  const copy = homeCopy[locale];
  const label = status === "failed" ? copy.previewUnavailable : status === "active" ? copy.pausePreview : status === "ended" ? copy.replayPreview : status === "paused" ? copy.resumePreview : copy.playPreview;
  return <>
    <div ref={plane} className="eco-spatial-plane-window"><div className="eco-spatial-frame" role="img" aria-label={proof.posterAlt}>
      <div className="eco-spatial-content">
        <HomeManagedVideo src={proof.videoSrc} poster={cinematic ? CINEMATIC_POSTERS[proof.key] : proof.posterSrc} className="eco-spatial-video" controlRef={handle}
          sourceEligible={sourceEligible} sceneEligible={sceneEligible} revealEligible={revealEligible} autoplay={autoplay}
          playbackGroup="home-spatial" playbackId={proof.key} startTime={proof.key === "webhero" ? 4 : 0}
          loop={proof.key !== "webhero"} revealDurationMs={proof.key === "webhero" ? 420 : 150} onStatusChange={setStatus} />
        <span className="eco-spatial-feather" aria-hidden="true" />
      </div>
      <span className="eco-spatial-field-shade" aria-hidden="true" />
    </div></div>
    <div className="eco-spatial-caption"><div><h3 id={`spatial-${proof.key}`} tabIndex={-1}>{proof.title}</h3><p className="eco-spatial-status">{proof.statusLabel}</p></div><p className="eco-spatial-summary">{proof.summary}</p><div className="eco-spatial-actions">
      <HomeLink href={proof.casePath} navigate={navigate} className="eco-text-link eco-spatial-case-link">{proof.caseLabel}<Arrow /></HomeLink>
      <div className="eco-spatial-control-slot">
      {mode !== "reducedMotion" && <button ref={retainControlFocus} type="button" className="eco-spatial-preview-control" aria-disabled={status === "failed" || undefined} aria-label={`${label} — ${proof.title}`} onClick={() => {
          if (status === "failed") return;
          userPaused.current = status === "active";
          if (status === "active") handle.current?.pause(); else if (status === "ended") handle.current?.replay(); else handle.current?.play();
        }}>{label}</button>}
      </div>
      {final && <div className="eco-spatial-archive"><HomeLink href={getLocalizedPath("/immersive", locale)} navigate={navigate} className="eco-text-link">{copy.immersive}<Arrow /></HomeLink></div>}
    </div></div>
  </>;
}

export default function EcosystemSpatial({ locale, navigate, proofs }: HomeSectionProps & { proofs: readonly HomeSpatialProof[] }) {
  const copy = homeCopy[locale], runtime = useHomeMediaRuntime();
  const track = useRef<HTMLDivElement>(null), stage = useRef<HTMLDivElement>(null), row = useRef<HTMLDivElement>(null);
  const articles = useRef<(HTMLElement | null)[]>([]), anchor = useRef<Anchor | null>(null), lastActive = useRef(0), returnToHold = useRef(false);
  const focusedAnchor = useRef<Anchor | null>(null);
  const [eligible, setEligible] = useState(() => window.matchMedia(CINEMATIC_QUERY).matches);
  const [viewport, setViewport] = useState(() => ({ viewportWidth: innerWidth, viewportHeight: innerHeight }));
  const [finePointer, setFinePointer] = useState(() => window.matchMedia(POINTER_QUERY).matches);
  const [reader, setReader] = useState(false), [fits, setFits] = useState(true);
  const [media, setMedia] = useState(() => resolveHomeSpatialScene(0));
  const layoutInput = { ...viewport, reducedMotion: !eligible, proofCount: proofs.length, contentFits: fits };
  const profile = resolveHomeSpatialLayoutProfile({ ...layoutInput, explicitReader: reader });
  const canChooseCinematic = resolveHomeSpatialLayoutProfile({ ...layoutInput, explicitReader: false }) !== "reader";
  const mode = profile === "reader" ? "reader" : "cinematic";
  const autoplay = mode === "cinematic" && finePointer && runtime.mode === "normal";
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 84px", "end end"] });
  function remember(focus = false) {
    const focused = document.activeElement;
    const element = focus && focused instanceof HTMLElement && stage.current?.contains(focused) ? focused : row.current;
    if (element) anchor.current = { element, y: element.getBoundingClientRect().top, focus };
  }
  useLayoutEffect(() => {
    const query = window.matchMedia(CINEMATIC_QUERY), pointer = window.matchMedia(POINTER_QUERY);
    const viewportProfile = () => resolveHomeSpatialLayoutProfile({ viewportWidth: innerWidth, viewportHeight: innerHeight,
      reducedMotion: !query.matches, explicitReader: false, proofCount: 2, contentFits: true });
    let previous = viewportProfile(), restoreFrame = 0;
    const update = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches && document.activeElement?.matches(".eco-spatial-preview-control")) {
        // Reduced mode omits playback controls; keep focus on this proof's case.
        document.activeElement.closest("article")?.querySelector<HTMLElement>(".eco-spatial-case-link")?.focus({ preventScroll: true });
      }
      const rect = stage.current?.getBoundingClientRect();
      const focused = articles.current.findIndex(item => item?.contains(document.activeElement));
      const next = viewportProfile();
      if (next !== previous && (focused >= 0 || (rect && rect.bottom > 84 && rect.top < innerHeight))) {
        remember(true);
        if (focusedAnchor.current?.element === document.activeElement) anchor.current = focusedAnchor.current;
        const saved = anchor.current;
        // Restore after neighbouring pinned sections finish their breakpoint layout.
        if (focused >= 0 && saved) restoreFrame = requestAnimationFrame(() => {
          if (!saved.element.isConnected) return;
          scrollBy({ top: saved.element.getBoundingClientRect().top - visibleAnchorY(saved), behavior: "instant" });
          saved.element.focus({ preventScroll: true });
          restoreFrame = 0;
        });
        if (previous === "reader" && next !== "reader") {
          if (focused >= 0) { lastActive.current = focused; setReader(true); }
          else returnToHold.current = true;
        }
      }
      previous = next; setEligible(query.matches); setFinePointer(pointer.matches); setFits(true);
      setViewport({ viewportWidth: innerWidth, viewportHeight: innerHeight });
    };
    const rememberFocusedPosition = () => {
      const focused = focusedAnchor.current;
      if (!restoreFrame && viewportProfile() === previous && focused?.element === document.activeElement) focused.y = focused.element.getBoundingClientRect().top;
    };
    query.addEventListener("change", update); pointer.addEventListener("change", update); window.addEventListener("resize", update);
    window.addEventListener("scroll", rememberFocusedPosition, { passive: true });
    return () => { cancelAnimationFrame(restoreFrame); query.removeEventListener("change", update); pointer.removeEventListener("change", update); window.removeEventListener("resize", update); window.removeEventListener("scroll", rememberFocusedPosition); };
  }, []);

  useLayoutEffect(() => {
    const node = stage.current, trackNode = track.current;
    if (!node || !trackNode) return;
    const all = articles.current.filter((item): item is HTMLElement => Boolean(item));
    const pick = (selector: string) => all.map(item => item.querySelector<HTMLElement>(selector)!);
    const captions = pick(".eco-spatial-caption"), controls = pick(".eco-spatial-control-slot"), frames = pick(".eco-spatial-frame");
    const windows = pick(".eco-spatial-plane-window"), shades = pick(".eco-spatial-field-shade"), contents = pick(".eco-spatial-content"), feathers = pick(".eco-spatial-feather");
    const scan = node.querySelector<HTMLElement>(".eco-spatial-scan")!, veils = Array.from(node.querySelectorAll<HTMLElement>(".eco-spatial-veil>span"));
    const index = node.querySelector<HTMLElement>(".eco-spatial-index")!;
    const archive = node.querySelector<HTMLElement>(".eco-spatial-archive");
    const rail = document.querySelector<HTMLElement>(".home-section-rail");
    let stopped = false;
    const restore = () => {
      if (returnToHold.current && mode === "cinematic") {
        returnToHold.current = false;
        const p = lastActive.current === 0 ? .35 : .96;
        scrollTo({ top: trackNode.getBoundingClientRect().top + scrollY - 84 + p * (trackNode.offsetHeight - node.offsetHeight), behavior: "instant" });
        row.current?.focus({ preventScroll: true }); anchor.current = null;
      } else if (anchor.current) {
        const saved = anchor.current; anchor.current = null;
        scrollBy({ top: saved.element.getBoundingClientRect().top - visibleAnchorY(saved), behavior: "instant" });
        if (saved.focus) saved.element.focus({ preventScroll: true });
        else all[0]?.querySelector<HTMLElement>("h3")?.focus({ preventScroll: true });
      }
    };
    if (profile === "reader") {
      all.forEach(item => { item.inert = false; item.removeAttribute("aria-hidden"); item.style.zIndex = ""; });
      [...captions, ...controls, ...frames, ...windows, ...shades, ...contents, ...feathers, scan, ...veils].forEach(item => { item.removeAttribute("style"); item.inert = false; });
      all.forEach(item => { item.removeAttribute("data-spatial-banded"); item.removeAttribute("data-spatial-live"); });
      ENV_VARS.forEach(name => node.style.removeProperty(name));
      if (archive) { archive.removeAttribute("style"); archive.inert = false; }
      restore(); return;
    }
    // Native scroll is the only input; one smoothed visual clock drives both planes and every caption.
    let bounds: HomeSpatialBounds | null = null, fitsByPlane: SpatialRect[] = [], geometryKey = "";
    let target = scrollYProgress.get(), motion: HomeSpatialMotionState = { value: target, velocity: 0 }, frame = 0, last = 0, posterDecoded = false;
    const written = new WeakMap<HTMLElement, Record<string, string>>();
    const write = (element: HTMLElement, property: "opacity" | "transform", value: string) => {
      const cache = written.get(element) ?? {};
      if (cache[property] === value) return;
      cache[property] = value; written.set(element, cache); element.style[property] = value;
    };
    const readTarget = () => {
      const rect = trackNode.getBoundingClientRect();
      return Math.min(1, Math.max(0, (84 - rect.top) / Math.max(1, rect.height - node.offsetHeight)));
    };
    const writePlane = (i: number, plane: HomeSpatialPlane, env: HomeSpatialBounds) => {
      const sx = plane.clip.width / env.envWidth, sy = plane.clip.height / env.envHeight, fit = fitsByPlane[i];
      const visible = plane.opacity > .001 && sx > 1e-4 && sy > 1e-4;
      write(frames[i], "opacity", visible ? plane.opacity.toFixed(4) : "0");
      if (!visible) return;
      // Outer clip and inner counter-scale are pure transforms: no layout or repaint per frame.
      write(frames[i], "transform", `translate3d(${px(plane.clip.x)},${px(plane.clip.y)},0) scale(${num(sx)},${num(sy)})`);
      const scale = plane.content.width / fit.width;
      write(contents[i], "transform", `translate3d(${px((plane.content.x - plane.clip.x) / sx - fit.x)},${px((plane.content.y - plane.clip.y) / sy - fit.y)},0) scale(${num(scale / sx)},${num(scale / sy)})`);
      write(shades[i], "opacity", plane.shade.toFixed(4));
      write(feathers[i], "opacity", plane.feather.toFixed(4));
    };
    const apply = () => {
      if (stopped || !bounds) return;
      const p = motion.value, scene = resolveHomeSpatialScene(p), opacity = [scene.whisperCaptionOpacity, scene.webheroCaptionOpacity];
      const focused = all.findIndex(item => item.contains(document.activeElement));
      if (focused >= 0 && (scene.activeIndex !== focused || opacity[focused] < 1 || (archive?.contains(document.activeElement) && scene.archiveOpacity < 1))) {
        // Keyboard focus (a visible ring) escapes to Reader so it is never stranded in a fading proof. Focus a pointer
        // click leaves on a control is incidental: release it and keep the cinematic scroll.
        const active = document.activeElement as HTMLElement;
        if (active.matches(":focus-visible")) { remember(true); stopped = true; cancelAnimationFrame(frame); setReader(true); return; }
        active.blur();
      }
      // Once the stage starts, decode WEBHERO's large poster off-thread so its first raster (p .42) does not stall a frame.
      if (!posterDecoded && p > 0) { posterDecoded = true; node.querySelector<HTMLImageElement>('[data-spatial-proof="webhero"] img')?.decode().catch(() => undefined); }
      const view = resolveHomeSpatialFrame(scene, bounds, profile);
      node.dataset.progress = String(p); node.dataset.targetProgress = String(target);
      node.dataset.activeIndex = String(scene.activeIndex); node.dataset.phase = scene.phase; lastActive.current = scene.activeIndex;
      const indexText = `0${scene.activeIndex + 1} / 02`;
      if (index.textContent !== indexText) index.textContent = indexText;
      write(scan, "opacity", scene.scanOpacity.toFixed(4));
      write(scan, "transform", `translateY(-50%) scaleX(${num(scene.scanScale)})`);
      veils.forEach(veil => write(veil, "opacity", view.fill.toFixed(4)));
      // A plane's video layer is drawn only while its scene may play; a prepared but covered video costs frames.
      const live = [String(scene.whisperPlaybackEligible), String(scene.webheroPlaybackEligible)];
      [view.whisper, view.webhero].forEach((plane, i) => {
        writePlane(i, plane, bounds!);
        write(captions[i], "opacity", opacity[i].toFixed(4));
        const inert = i !== scene.activeIndex || opacity[i] < .999;
        if (all[i].inert !== inert) { all[i].inert = inert; all[i].setAttribute("aria-hidden", String(inert)); }
        if (all[i].dataset.spatialLive !== live[i]) all[i].dataset.spatialLive = live[i];
      });
      if (archive) { write(archive, "opacity", scene.archiveOpacity.toFixed(4)); if (archive.inert !== scene.archiveOpacity < 1) archive.inert = scene.archiveOpacity < 1; }
      setMedia(previous => MEDIA_KEYS.every(key => previous[key] === scene[key]) ? previous : scene);
    };
    const tick = (now: number) => {
      frame = 0;
      motion = stepHomeSpatialMotion(motion, target, last ? (now - last) / 1000 : 1 / 60, resolveHomeSpatialMotionRate(motion.value, target)); last = now;
      apply();
      if (!stopped && (motion.velocity !== 0 || motion.value !== Math.min(1, Math.max(0, target)))) frame = requestAnimationFrame(tick);
      else last = 0;
    };
    const follow = (p: number) => {
      // Wheel and trackpad input stays far below .4 per frame even on short windows; larger single jumps are
      // restorations or programmatic scrolls, which show their destination rather than replaying the whole story.
      if (Math.abs(p - target) > .4) { target = p; motion = { value: p, velocity: 0 }; apply(); return; }
      target = p; if (!frame && !stopped) frame = requestAnimationFrame(tick);
    };
    const measure = () => {
      if (stopped) return;
      const railRect = rail?.getBoundingClientRect(), railLeft = railRect && railRect.width ? railRect.left : innerWidth;
      node.style.setProperty("--spatial-safe-width", `${Math.max(0, Math.min(innerWidth, railLeft) - node.getBoundingClientRect().left - 24)}px`);
      const stageRect = node.getBoundingClientRect(), clientWidth = document.documentElement.clientWidth;
      const header = document.querySelector<HTMLElement>(".site-header")?.getBoundingClientRect();
      const envTop = header && header.height ? Math.min(Math.max(0, header.bottom), innerHeight / 2) : 0, stickyTop = parseFloat(getComputedStyle(node).top) || 84;
      bounds = { viewportWidth: innerWidth, viewportHeight: innerHeight, envTop, envWidth: clientWidth, envHeight: innerHeight - envTop,
        stageLeft: stageRect.left, stageTop: stickyTop, stageWidth: node.clientWidth, stageHeight: node.clientHeight };
      const vars: Record<string, number> = { "--spatial-env-x": -stageRect.left, "--spatial-env-y": envTop - stickyTop, "--spatial-env-w": clientWidth, "--spatial-env-h": bounds.envHeight,
        "--spatial-bleed-left": -stageRect.left, "--spatial-bleed-right": stageRect.right - clientWidth,
        "--spatial-rail-x": railRect && railRect.width ? railRect.left + railRect.width / 2 : clientWidth - 106,
        "--spatial-rail-y": railRect && railRect.width ? railRect.top + railRect.height / 2 - envTop : bounds.envHeight / 2 };
      Object.entries(vars).forEach(([name, value]) => node.style.setProperty(name, px(value)));
      // Media boxes are laid out once per environment size; motion only transforms them.
      fitsByPlane = (["whisper", "webhero"] as const).map(key => resolveHomeSpatialMediaFit(key, bounds!.envWidth, bounds!.envHeight));
      contents.forEach((content, i) => {
        const fit = fitsByPlane[i];
        Object.assign(content.style, { left: px(fit.x), top: px(fit.y), width: px(fit.width), height: px(fit.height) });
        // A narrower-than-environment WEBHERO frame dissolves into its matching dark extension.
        const bands = [fit.x > .5 && "linear-gradient(90deg,#02050c,#02050c00 8%,#02050c00 92%,#02050c)",
          fit.y + fit.height < bounds!.envHeight - .5 && "linear-gradient(0deg,#02050c,#02050c00 9%)"].filter(Boolean);
        feathers[i].style.backgroundImage = bands.length ? bands.join(",") : "none";
        all[i].dataset.spatialBanded = String(bands.length > 0);
      });
      // Height-limit media in the frame model. Reader is only a content safety net.
      const contentOverflows = captions.some(caption => Array.from(caption.children).some(child => child.scrollHeight > caption.clientHeight || child.scrollWidth > child.clientWidth + 1)) ||
        captions.some(caption => Array.from(caption.querySelectorAll<HTMLElement>("a,button")).some(child => child.clientWidth > 0 && (child.scrollWidth > child.clientWidth + 1 || child.scrollHeight > child.clientHeight + 1))) ||
        Boolean(row.current && row.current.scrollWidth > row.current.clientWidth + 1);
      if (contentOverflows) {
        remember(true);
        if (focusedAnchor.current?.element === document.activeElement) anchor.current = focusedAnchor.current;
        stopped = true; setFits(false); return;
      }
      // A new environment size shows its frame directly instead of animating across the re-layout.
      const key = [innerWidth, innerHeight, clientWidth, envTop].join();
      if (key !== geometryKey) { geometryKey = key; target = readTarget(); motion = { value: target, velocity: 0 }; }
      apply();
    };
    restore(); measure();
    const unsubscribe = scrollYProgress.on("change", follow), observer = new ResizeObserver(measure);
    observer.observe(node); captions.forEach(caption => Array.from(caption.children).forEach(child => observer.observe(child)));
    if (rail) observer.observe(rail);
    window.addEventListener("resize", measure);
    return () => { stopped = true; cancelAnimationFrame(frame); unsubscribe(); observer.disconnect(); window.removeEventListener("resize", measure); };
  }, [mode, profile, eligible, locale, proofs.length, scrollYProgress]);

  const archiveLink = <HomeLink href={getLocalizedPath("/immersive", locale)} navigate={navigate} className="eco-text-link">{copy.immersive}<Arrow /></HomeLink>;
  return <HomeSection id="spatial" className="eco-spatial" scene="living-systems">
    <div className="eco-spatial-intro eco-wrap"><SectionLabel number="05">{copy.spatial}</SectionLabel><div className="eco-section-heading"><h2 id="spatial-title">{copy.spatialTitle}</h2><p>{copy.spatialIntro}</p></div></div>
    <div className="eco-spatial-threshold" aria-hidden="true"><span /></div>
    <div data-home-spatial-surface="dark" data-header-scene="living-whisper" className="eco-spatial-surface">
      <div ref={track} className="eco-spatial-track" data-mode={mode} data-cinematic-profile={profile === "reader" ? "reader" : profile === "compact-cinematic" ? "compact" : "full"} data-content-fits={fits}>
        {proofs.length ? <div ref={stage} className="eco-spatial-stage eco-spatial-layout">
          <div ref={row} className="eco-spatial-top-row" tabIndex={-1} aria-label={copy.spatial}><span>05 / {copy.spatial}</span><span className="eco-spatial-index" aria-hidden="true">01 / 0{proofs.length}</span>
            {canChooseCinematic && <button type="button" onClick={() => { remember(); if (mode === "cinematic") setReader(true); else { returnToHold.current = true; setReader(false); } }}>{mode === "cinematic" ? copy.viewBothProofs : copy.viewCinematicSpatial}</button>}
          </div>
          <div className="eco-spatial-scan" aria-hidden="true" />
          <div className="eco-spatial-veil" aria-hidden="true"><span className="eco-spatial-veil-top" /><span className="eco-spatial-veil-rail" /></div>
          {proofs.map((proof, i) => <article key={proof.key} ref={node => { articles.current[i] = node; }} className="eco-spatial-proof" data-spatial-proof={proof.key} aria-labelledby={`spatial-${proof.key}`} onFocusCapture={event => {
            lastActive.current = i;
            focusedAnchor.current = { element: event.target as HTMLElement, y: (event.target as HTMLElement).getBoundingClientRect().top, focus: true };
            if (mode === "cinematic" && Number(event.currentTarget.querySelector<HTMLElement>(".eco-spatial-caption")?.style.opacity) < .999) { remember(true); setReader(true); }
          }}>
            <SpatialPreview proof={proof} locale={locale} autoplay={autoplay} cinematic={mode === "cinematic"} navigate={navigate} final={i === proofs.length - 1}
              // WEBHERO prewarm is an autoplaying-desktop detail; explicit-play contexts keep the takeover threshold.
              sourceEligible={mode === "reader" || (proof.key === "whisper" ? media.whisperSourceEligible : autoplay ? media.webheroSourceEligible : media.webheroPlaybackEligible)}
              sceneEligible={mode === "reader" || (proof.key === "whisper" ? media.whisperPlaybackEligible : media.webheroPlaybackEligible)}
              revealEligible={mode === "reader" || (proof.key === "whisper" ? media.whisperPlaybackEligible : media.webheroRevealEligible)} />
          </article>)}
        </div> : <div className="eco-spatial-empty eco-spatial-layout">{archiveLink}</div>}
      </div>
    </div>
  </HomeSection>;
}
