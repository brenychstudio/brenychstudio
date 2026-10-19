import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { useScroll } from "framer-motion";
import type { ProjectRecord } from "../../data/projectRegistry.types";
import { resolveHomeProjectPoster } from "../../data/ecosystemHome";
import { getLocalizedPath } from "../../i18n";
import PortfolioImage from "../media/PortfolioImage";
import { homeCopy } from "./homeCopy";
import { Arrow, HomeLink, HomeSection, ProjectSignal, SectionLabel, type HomeSectionProps } from "./HomePrimitives";
import { projectPath, projectText } from "./homeProjectPresentation";
import { EVIDENCE_HOLD_PROGRESS, resolveEvidenceScene, type EvidenceMode } from "./homeEvidenceModel";

const CINEMATIC_QUERY = "(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)";
const PROGRESS_DAMPING = 20;
type PositionAnchor = { element: HTMLElement; y: number; preserveFocus: boolean };

export default function EcosystemEvidence({ locale, navigate, projects }: HomeSectionProps & { projects: readonly ProjectRecord[] }) {
  const copy = homeCopy[locale];
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const articles = useRef<(HTMLElement | null)[]>([]);
  const lastActive = useRef<0 | 1 | 2>(0);
  const anchor = useRef<PositionAnchor | null>(null);
  const returnToHold = useRef(false);
  const [eligible, setEligible] = useState(() => window.matchMedia(CINEMATIC_QUERY).matches);
  const [reader, setReader] = useState(false);
  const [contentFits, setContentFits] = useState(true);
  const mode: EvidenceMode = eligible && !reader && contentFits ? "cinematic" : "reader";
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 84px", "end end"] });

  function rememberPosition(preserveFocus = false) {
    const focused = document.activeElement;
    const element = preserveFocus && focused instanceof HTMLElement && stage.current?.contains(focused) ? focused : heading.current;
    if (element) anchor.current = { element, y: element.getBoundingClientRect().top, preserveFocus };
  }

  useEffect(() => {
    const query = window.matchMedia(CINEMATIC_QUERY);
    let previousMatch = query.matches;
    const update = () => {
      const bounds = stage.current?.getBoundingClientRect();
      if (query.matches !== previousMatch && bounds && bounds.bottom > 84 && bounds.top < window.innerHeight) {
        rememberPosition(true);
        if (query.matches) {
          const focusedIndex = articles.current.findIndex(item => item?.contains(document.activeElement));
          if (focusedIndex >= 0) {
            lastActive.current = focusedIndex as 0 | 1 | 2;
            // A reader's focused proof must not be hidden by automatic pinning.
            setReader(true);
          } else {
            const visibleIndex = articles.current.findIndex(item => {
              const rect = item?.getBoundingClientRect();
              return rect && rect.top < window.innerHeight / 2 && rect.bottom > 84;
            });
            if (visibleIndex >= 0) lastActive.current = visibleIndex as 0 | 1 | 2;
            returnToHold.current = true;
          }
        }
      }
      previousMatch = query.matches;
      setEligible(query.matches);
      setContentFits(true);
    };
    query.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => { query.removeEventListener("change", update); window.removeEventListener("resize", update); };
  }, []);

  useLayoutEffect(() => {
    const node = stage.current;
    const trackNode = track.current;
    if (!node || !trackNode) return;
    const allArticles = articles.current.filter((item): item is HTMLElement => Boolean(item));
    const captions = allArticles.map(item => item.querySelector<HTMLElement>(".eco-evidence-caption")!);
    const actions = allArticles.map(item => item.querySelector<HTMLElement>(".eco-evidence-actions")!);
    const mediaWindows = allArticles.map(item => item.querySelector<HTMLElement>(".eco-evidence-media")!);
    const masks = allArticles.map(item => item.querySelector<HTMLElement>(".eco-evidence-mask")!);
    const posters = allArticles.map(item => item.querySelector<HTMLElement>(".eco-evidence-pixels")!);
    const pointerLayers = allArticles.map(item => item.querySelector<HTMLElement>(".eco-evidence-pointer")!);
    const archive = node.querySelector<HTMLElement>(".eco-evidence-archive")!;
    const index = node.querySelector<HTMLElement>(".eco-evidence-index")!;
    const rail = document.querySelector<HTMLElement>(".home-section-rail");
    let width = node.clientWidth;
    let area = node.clientHeight - 140;
    let proofShare = .70;
    let apertureShare = .72;
    let posterWidth = proofShare * width;
    let apertureWidth = apertureShare * width;
    let stopped = false;
    let rendered = 0;
    let target = 0;
    let velocity = 0;
    let frame = 0;
    let previousTime = 0;
    const resetPointer = () => pointerLayers.forEach(item => { item.style.transform = ""; item.style.removeProperty("--depth-x"); item.style.removeProperty("--depth-y"); });
    const restorePosition = () => {
      if (returnToHold.current && mode === "cinematic") {
        returnToHold.current = false;
        const p = EVIDENCE_HOLD_PROGRESS[lastActive.current];
        window.scrollTo({ top: trackNode.getBoundingClientRect().top + window.scrollY - 84 + p * (trackNode.offsetHeight - node.offsetHeight), behavior: "instant" });
        row.current?.focus({ preventScroll: true });
        anchor.current = null;
      } else if (anchor.current) {
        const saved = anchor.current;
        anchor.current = null;
        window.scrollBy({ top: saved.element.getBoundingClientRect().top - saved.y, behavior: "instant" });
        if (!saved.preserveFocus) allArticles[0]?.querySelector<HTMLElement>("h3")?.focus({ preventScroll: true });
      }
    };
    if (mode === "reader") {
      allArticles.forEach(item => { item.inert = false; item.removeAttribute("aria-hidden"); });
      [...captions, ...actions, ...masks, ...posters, ...mediaWindows, archive].forEach(item => item.removeAttribute("style"));
      archive.inert = false;
      archive.removeAttribute("aria-hidden");
      captions.forEach(item => item.querySelector<HTMLElement>(".eco-evidence-identity")!.removeAttribute("style"));
      resetPointer();
      restorePosition();
      return;
    }
    const apply = (p: number) => {
      if (stopped) return;
      const scene = resolveEvidenceScene(p);
      const focused = document.activeElement;
      const focusedIndex = allArticles.findIndex(item => item.contains(focused));
      // Keep the focused DOM node alive and visible before changing any inert/ARIA state.
      if (focusedIndex >= 0 && (focusedIndex !== scene.activeIndex || scene.outgoingIndex === focusedIndex || scene.identities[focusedIndex].opacity < .999 || scene.identities[focusedIndex].reveal < .999 || (archive.contains(focused) && scene.archiveOpacity < 1))) {
        rememberPosition(true);
        stopped = true;
        resetPointer();
        setReader(true);
        return;
      }
      if (lastActive.current !== scene.activeIndex) resetPointer();
      lastActive.current = scene.activeIndex;
      node.dataset.activeIndex = String(scene.activeIndex);
      node.dataset.progress = String(p);
      index.textContent = `0${scene.activeIndex + 1} / 03`;
      scene.planes.forEach((plane, i) => {
        const active = i === scene.activeIndex;
        allArticles[i].inert = !active;
        allArticles[i].setAttribute("aria-hidden", String(!active));
        allArticles[i].dataset.active = String(active);
        allArticles[i].dataset.departing = String(i === scene.outgoingIndex);
        const identity = scene.identities[i];
        const boundary = apertureWidth * (1 - scene.transfer);
        const outgoing = i === scene.outgoingIndex;
        const incoming = i === scene.incomingIndex;
        // Complementary moving apertures keep screenshot pixels from ghosting
        // through one another. Both follow the same progress and depth targets.
        mediaWindows[i].style.clipPath = `inset(0 ${outgoing ? apertureWidth - boundary : 0}px 0 ${incoming ? boundary + 12 : 0}px)`;
        mediaWindows[i].style.zIndex = String(plane.zOrder);
        Object.assign(masks[i].style, {
          width: `${posterWidth}px`, height: `${Math.min(posterWidth * 5 / 8, area - 32)}px`,
          left: `${posterWidth / 2}px`, top: `${64 + area / 2}px`,
          opacity: String(plane.opacity), zIndex: String(plane.zOrder),
          visibility: plane.opacity === 0 ? "hidden" : "visible",
          transform: `translate(-50%, -50%) translate3d(${plane.x * width}px, ${plane.y}px, ${plane.depth}px) scale(${plane.scale}) rotateY(${plane.rotateY}deg)`,
        });
        captions[i].style.opacity = String(identity.opacity);
        captions[i].style.visibility = identity.opacity === 0 ? "hidden" : "visible";
        captions[i].style.transform = "translateY(-50%)";
        captions[i].querySelector<HTMLElement>(".eco-evidence-identity")!.style.transform = `translateY(${identity.y}px)`;
        captions[i].style.clipPath = `inset(0 0 ${(1 - identity.reveal) * 100}% 0)`;
        captions[i].style.pointerEvents = active ? "auto" : "none";
        // Retire the departing action as soon as its identity starts yielding.
        // The arriving action is shown only once it owns the readable identity.
        actions[i].style.visibility = active && scene.outgoingIndex !== i ? "visible" : "hidden";
        captions[i].style.zIndex = String(5 + i);

      });
      archive.style.opacity = String(scene.archiveOpacity);
      archive.inert = scene.archiveOpacity < 1;
      archive.setAttribute("aria-hidden", String(scene.archiveOpacity < 1));
    };
    const measure = () => {
      // Only the cinematic track escapes the editorial wrap. Its right boundary
      // is the localized Rail, never the capped width of the intro's parent.
      const composition = getComputedStyle(trackNode);
      const safetyGap = Number.parseFloat(composition.getPropertyValue("--evidence-rail-gap"));
      width = Math.max(0, (rail?.getBoundingClientRect().left ?? document.documentElement.clientWidth) - trackNode.getBoundingClientRect().left - safetyGap);
      trackNode.style.setProperty("--evidence-width", `${width}px`);
      area = node.clientHeight - 140;
      proofShare = Number.parseFloat(composition.getPropertyValue("--evidence-proof-share"));
      apertureShare = Number.parseFloat(composition.getPropertyValue("--evidence-aperture-share"));
      posterWidth = Math.min(proofShare * width, (area - 32) * 16 / 9);
      // A height-limited proof retains its adjacent identity; residual space is
      // after the cluster. The same aperture transfer still owns both proofs.
      apertureWidth = posterWidth + (apertureShare - proofShare) * width;
      node.style.setProperty("--evidence-proof-width", `${posterWidth}px`);
      node.style.setProperty("--evidence-aperture-width", `${apertureWidth}px`);
      if (captions.some(caption => caption.scrollHeight > area - 32 || caption.scrollWidth > caption.clientWidth + 1)) {
        rememberPosition(true);
        stopped = true;
        setContentFits(false);
        return;
      }
      const start = trackNode.getBoundingClientRect().top + window.scrollY - 84;
      target = rendered = Math.max(0, Math.min(1, (window.scrollY - start) / (trackNode.offsetHeight - node.offsetHeight)));
      velocity = 0;
      apply(rendered);
    };
    // One critically damped progress, shared by all proof and identity geometry.
    // Analytic integration is independent of refresh rate; a direction reversal
    // drops stale velocity so the scene never travels against the user's input.
    const tick = (time: number) => {
      const dt = Math.min(.05, (time - previousTime) / 1000);
      previousTime = time;
      const displacement = rendered - target;
      const impulse = velocity + PROGRESS_DAMPING * displacement;
      const decay = Math.exp(-PROGRESS_DAMPING * dt);
      const next = target + (displacement + impulse * dt) * decay;
      velocity = (velocity - PROGRESS_DAMPING * impulse * dt) * decay;
      rendered = Math.max(Math.min(rendered, target), Math.min(Math.max(rendered, target), next));
      if (Math.abs(rendered - target) < .00001 && Math.abs(velocity) < .001) {
        rendered = target;
        velocity = 0;
      }
      apply(rendered);
      frame = !stopped && rendered !== target ? requestAnimationFrame(tick) : 0;
    };
    const seek = (progress: number) => {
      const next = Math.max(0, Math.min(1, progress));
      if ((next - rendered) * velocity < 0) velocity = 0;
      target = next;
      if (!frame) { previousTime = performance.now(); frame = requestAnimationFrame(tick); }
    };
    restorePosition();
    measure();
    const unsubscribe = scrollYProgress.on("change", seek);
    const observer = new ResizeObserver(measure);
    // Rail position can move without its size changing, especially once type
    // reaches its cap. Reuse this measurement on viewport resize as well.
    window.addEventListener("resize", measure);
    observer.observe(node);
    if (rail) observer.observe(rail);
    captions.forEach(caption => {
      observer.observe(caption);
      // The reserved band does not resize when its text grows or a font resolves.
      Array.from(caption.children).forEach(child => observer.observe(child));
    });
    return () => { stopped = true; cancelAnimationFrame(frame); unsubscribe(); observer.disconnect(); window.removeEventListener("resize", measure); resetPointer(); };
  }, [mode, locale, scrollYProgress]);

  function movePointer(event: PointerEvent<HTMLDivElement>) {
    if (mode !== "cinematic" || event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const poster = articles.current[lastActive.current]?.querySelector<HTMLElement>(".eco-evidence-pointer");
    if (!poster) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    const length = Math.max(1, Math.hypot(x, y));
    poster.style.transform = `translate3d(${6 * x / length}px, ${6 * y / length}px, 0) rotateX(${-y}deg) rotateY(${x}deg)`;
    poster.style.setProperty("--depth-x", `${-3 * x}px`);
    poster.style.setProperty("--depth-y", `${-3 * y}px`);
  }
  function leavePointer() {
    articles.current.forEach(item => { const layer = item?.querySelector<HTMLElement>(".eco-evidence-pointer"); if (layer) layer.removeAttribute("style"); });
  }
  function toggleReader() {
    rememberPosition();
    if (mode === "cinematic") setReader(true);
    else { returnToHold.current = true; setReader(false); }
  }

  return <HomeSection id="evidence" className="eco-evidence eco-wrap">
    <SectionLabel number="04">{copy.evidence}</SectionLabel>
    <div className="eco-section-heading"><h2 id="evidence-title" ref={heading}>{copy.evidenceTitle}</h2></div>
    <p className="eco-evidence-summary">AUREL EON GT, Oria House Barcelona, SprintCRM.</p>
    <div ref={track} className="eco-evidence-track" data-mode={mode}>
      <div ref={stage} className="eco-evidence-stage" onPointerMove={movePointer} onPointerLeave={leavePointer}>
        <div ref={row} className="eco-evidence-top-row" tabIndex={-1} aria-label={copy.evidence}>
          <span>{copy.evidence}</span><span className="eco-evidence-index" aria-hidden="true">01 / 03</span>
          {eligible && contentFits && <button type="button" onClick={toggleReader}>
            {mode === "cinematic" ? (locale === "es" ? "Ver toda la evidencia" : "Read all evidence") : (locale === "es" ? "Ver secuencia cinematográfica" : "View cinematic sequence")}
          </button>}
        </div>
        <div className="eco-evidence-alignment" aria-hidden="true" />
        {projects.map((project, i) => {
          const poster = resolveHomeProjectPoster(project, locale);
          return <article key={project.id} ref={node => { articles.current[i] = node; }} className="eco-evidence-proof" data-project-id={project.id} aria-labelledby={`evidence-${project.id}`}
            onFocusCapture={event => {
              const caption = event.currentTarget.querySelector<HTMLElement>(".eco-evidence-caption");
              if (mode === "cinematic" && caption && (event.currentTarget.dataset.departing === "true" || Number(caption.style.opacity) < .999 || Number.parseFloat(caption.style.clipPath.split(" ")[2]) > 0)) {
                rememberPosition(true);
                setReader(true);
              }
            }}>
            <div className="eco-evidence-media"><figure className="eco-evidence-mask"><div className="eco-evidence-pixels"><div className="eco-evidence-pointer">
              <PortfolioImage src={poster.src} alt={poster.alt} sizes="(min-width: 1024px) 70vw, (min-width: 768px) calc(100vw - 64px), calc(100vw - 40px)" loading="lazy" containerClassName="eco-evidence-poster" imageClassName="eco-evidence-poster-img" />
            </div></div></figure></div>
            <div className="eco-evidence-caption">
              <div className="eco-evidence-identity"><h3 id={`evidence-${project.id}`} tabIndex={-1}>{project.publicName === "SprintCRM" ? <>Sprint<wbr />CRM</> : project.publicName}</h3><ProjectSignal project={project} locale={locale} /></div>
              <p className="eco-project-description">{projectText(project.copy.oneLiner, locale)}</p>
              <div className="eco-evidence-actions"><HomeLink href={projectPath(project, locale, "work")} navigate={navigate} className="eco-text-link eco-evidence-case-link">{copy.case}<Arrow /></HomeLink>
              </div>
            </div>
            {i === 2 && <div className="eco-evidence-archive"><HomeLink href={getLocalizedPath("/work", locale)} navigate={navigate} className="eco-text-link">{copy.archive}<Arrow /></HomeLink></div>}
          </article>;
        })}
      </div>
    </div>
  </HomeSection>;
}
