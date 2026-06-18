import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type WheelEvent,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import type { CaseStoryMedia } from "../../data/caseStories";
import type { ImmersiveItem, ImmersiveMedia } from "../../data/immersive";
import { getChamberEngines } from "../../data/immersiveSystems";
import { whisperCaseI18n } from "../../data/whisperCaseI18n";
import { useSound } from "../../stage/audio/useSound";
import SectionRail, { type SectionRailItem } from "../SectionRail";
import SiteFooterV2 from "../SiteFooterV2";
import { startSpaPageTransition } from "../pageTransition";
import { useSectionRailActive } from "../useSectionRailActive";
import CinematicInspectReveal from "../work/CinematicInspectReveal";

type WhisperCaseLayoutProps = {
  item: ImmersiveItem;
  onOpenProject?: () => void;
  copy?: (typeof whisperCaseI18n)[keyof typeof whisperCaseI18n];
};

type SectionId = "threshold" | "atlas" | "web" | "xr" | "collector" | "mobile" | "engine";

type VideoProof = {
  title: string;
  label: string;
  src: string;
  poster?: string;
  caption?: string;
};

type LayerId = "web" | "xr" | "collector" | "mobile";

const WHISPER_HERO_VIDEO = "/immersive/Whisper/Video/whisper-hero-poster.mp4";
const WHISPER_HOME_VIDEO = "/immersive/Whisper/Video/hero-home-video.mp4";
const WHISPER_DESKTOP_VIDEO = "/immersive/Whisper/Video/whisper-desktop-video.mp4";
const WHISPER_VR_VIDEO = "/immersive/Whisper/Video/whisper-vr-video.mp4";
const WHISPER_LIVE_URL = "https://whisper-sg8.pages.dev/";
const WHISPER_REPO_URL = "https://github.com/brenychstudio/Whisper";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const railItems: SectionRailItem[] = [
  { id: "whisper-threshold", index: "01", label: "Threshold" },
  { id: "whisper-atlas", index: "02", label: "Atlas" },
  { id: "whisper-web", index: "03", label: "Web" },
  { id: "whisper-evidence", index: "3.1", label: "Field" },
  { id: "whisper-xr", index: "04", label: "Quest" },
  { id: "whisper-collector", index: "05", label: "Collector" },
  { id: "whisper-mobile", index: "06", label: "Mobile" },
  { id: "whisper-engine", index: "07", label: "Engine" },
];

const darkRailSections = new Set(["whisper-threshold", "whisper-evidence", "whisper-xr", "whisper-mobile", "whisper-engine"]);

const proofLayers: Array<{
  id: LayerId;
  index: string;
  title: string;
  signal: string;
  text: string;
}> = [
  {
    id: "web",
    index: "01",
    title: "Cinematic web exhibition",
    signal: "public surface",
    text:
      "The website is the first room: editorial pacing, series navigation, print logic, and collector intent are staged before the user enters XR.",
  },
  {
    id: "xr",
    index: "02",
    title: "Quest-tested spatial proof",
    signal: "room-scale layer",
    text:
      "The headset capture proves the system can leave the page and still keep the same quiet museum rhythm.",
  },
  {
    id: "collector",
    index: "03",
    title: "Print, AR, and edition continuation",
    signal: "object handoff",
    text:
      "The digital exhibition returns to the artwork through edition detail, AR preview, notes, and collector-facing continuation.",
  },
  {
    id: "mobile",
    index: "04",
    title: "Handheld exhibition route",
    signal: "small-screen proof",
    text:
      "Mobile keeps the atmosphere intact while compressing navigation, series pages, print detail, and AR entry into a direct path.",
  },
];

const flagshipSignals = [
  "Web exhibition",
  "Quest capture",
  "Mobile proof",
  "Print / AR flow",
  "Cloudflare live",
];

const surfaceShortLabels: Record<LayerId, string> = {
  web: "Web",
  xr: "Quest",
  collector: "Collector",
  mobile: "Mobile",
};

const interactionRules = [
  {
    title: "Presence before interface",
    text:
      "Navigation, hover states, and proof controls stay quiet so the artwork keeps priority over the UI.",
  },
  {
    title: "One system across surfaces",
    text:
      "Website, headset, mobile, print detail, and AR preview use the same visual grammar instead of separate case fragments.",
  },
  {
    title: "Inspect as a spatial mode",
    text:
      "Screenshots open through a cinematic reveal, turning evidence review into part of the immersive language.",
  },
];

function formatIndex(value: number) {
  return String(value).padStart(2, "0");
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function enrichFrame(media: ImmersiveMedia, copy?: { label?: string; alt?: string; caption?: string }) {
  return {
    ...media,
    label: copy?.label ?? media.label,
    alt: copy?.alt ?? media.alt,
    caption: copy?.caption ?? media.caption,
  };
}

function toInspectFrame(frame: ImmersiveMedia, index: number, role: CaseStoryMedia["role"]): CaseStoryMedia {
  return {
    id: `whisper-${frame.device ?? "media"}-${index}-${frame.src.split("/").pop() ?? "frame"}`,
    kind: "image",
    src: frame.src,
    alt: frame.alt ?? frame.label ?? "WHISPER project frame",
    label: frame.label ?? `Frame ${formatIndex(index + 1)}`,
    caption: frame.caption ?? "WHISPER proof frame.",
    role,
  };
}

function SectionLabel({ index, label, dark = false }: { index: string; label: string; dark?: boolean }) {
  return (
    <div className={cx("flex min-w-0 items-center gap-2 text-[9px] uppercase tracking-[0.18em] sm:gap-3 sm:text-[10px] sm:tracking-[0.22em]", dark ? "text-white/44" : "text-neutral-500")}>
      <span className={cx("h-px w-8 shrink-0 sm:w-10", dark ? "bg-white/24" : "bg-neutral-950/18")} />
      <span>{index}</span>
      <span className="min-w-0 leading-none">{label}</span>
    </div>
  );
}

function Chapter({
  id,
  children,
  className = "",
  soundSafeArea = false,
  footerRailState,
}: {
  id: SectionId;
  children: React.ReactNode;
  className?: string;
  soundSafeArea?: boolean;
  footerRailState?: "closing";
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <section
        id={`whisper-${id}`}
        data-header-scene={`whisper-${id}`}
        data-sound-safe-area={soundSafeArea ? true : undefined}
        data-footer-rail-state={footerRailState}
        className={cx("scroll-mt-[5.5rem] md:scroll-mt-28", className)}
      >
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={`whisper-${id}`}
      data-header-scene={`whisper-${id}`}
      data-sound-safe-area={soundSafeArea ? true : undefined}
      data-footer-rail-state={footerRailState}
      className={cx("scroll-mt-[5.5rem] md:scroll-mt-28", className)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.18 }}
      transition={{ duration: 0.86, ease }}
    >
      {children}
    </motion.section>
  );
}

function KineticTitle({
  as = "h2",
  text,
  className,
}: {
  as?: "h1" | "h2" | "h3";
  text: string;
  className: string;
}) {
  const reduceMotion = useReducedMotion();
  const MotionTag = as === "h1" ? motion.h1 : as === "h3" ? motion.h3 : motion.h2;
  const StaticTag = as;

  if (reduceMotion) return <StaticTag className={className}>{text}</StaticTag>;

  return (
    <MotionTag className={className}>
      {text.split(" ").map((word, index, words) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block"
          initial={{ opacity: 0, y: 24, rotateX: -28 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: false, amount: 0.42 }}
          transition={{ duration: 0.68, delay: index * 0.026, ease }}
        >
          {word}
          {index < words.length - 1 ? "\u00a0" : ""}
        </motion.span>
      ))}
    </MotionTag>
  );
}

function TypedSignalText({
  text,
  dark = false,
  className,
}: {
  text: string;
  dark?: boolean;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [typedText, setTypedText] = useState("");
  const visibleText = reduceMotion ? text : typedText;

  useEffect(() => {
    if (reduceMotion) return;

    let index = 0;
    const timer = window.setInterval(() => {
      index += 2;
      setTypedText(text.slice(0, index));
      if (index >= text.length) window.clearInterval(timer);
    }, 28);

    return () => window.clearInterval(timer);
  }, [reduceMotion, text]);

  return (
    <span className={cx("font-mono", className)}>
      {visibleText}
      {!reduceMotion && visibleText.length < text.length ? (
        <span className={cx("ml-1 inline-block h-3 w-px translate-y-0.5", dark ? "bg-white/76" : "bg-neutral-950/70")} />
      ) : null}
    </span>
  );
}

function VideoSurface({
  video,
  tone = "dark",
  mobileBleed = false,
  onOpen,
}: {
  video: VideoProof;
  tone?: "dark" | "paper";
  mobileBleed?: boolean;
  onOpen: () => void;
}) {
  const sound = useSound();
  const isDark = tone === "dark";
  const signalText = isDark
    ? "Quest proof is playing as a spatial capture stream; open terminal for full cinematic review."
    : "Desktop proof is running as a live capture surface; open terminal for full cinematic review.";

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => sound.playRole("hover")}
      className={cx(
        "group relative block w-full overflow-visible text-left transition duration-500",
        mobileBleed ? "max-[640px]:ml-[calc(50%-50vw)] max-[640px]:mr-[calc(50%-50vw)] max-[640px]:w-screen" : "",
        isDark ? "text-white" : "text-neutral-950",
      )}
    >
      <div
        className={cx(
          "relative overflow-hidden border p-2 transition duration-500",
          isDark
            ? "border-white/13 bg-white/[0.025] shadow-[0_26px_120px_rgba(0,0,0,0.34)] group-hover:border-white/32"
            : "border-neutral-950/12 bg-white/50 shadow-[0_26px_120px_rgba(38,34,26,0.12)] group-hover:border-neutral-950/24",
          mobileBleed
            ? "max-[640px]:overflow-visible max-[640px]:border-x-0 max-[640px]:bg-transparent max-[640px]:p-0 max-[640px]:shadow-none"
            : "",
        )}
      >
        <div className="pointer-events-none absolute left-[8%] top-[12%] h-[72%] w-[70%] rounded-full border border-current opacity-[0.055] max-[640px]:hidden" />
        <div className="pointer-events-none absolute bottom-[13%] left-[-3%] h-px w-[82%] -rotate-[6deg] bg-current opacity-10 max-[640px]:hidden" />

        <div
          className={cx(
            "relative aspect-video overflow-hidden bg-[#050505]",
            mobileBleed ? "max-[640px]:aspect-[16/10] max-[640px]:shadow-[0_34px_100px_rgba(37,32,21,0.22)]" : "",
          )}
        >
          <video
            className={cx(
              "h-full w-full object-contain opacity-95 saturate-[0.98] transition duration-700 group-hover:scale-[1.01] group-hover:opacity-100",
              mobileBleed ? "max-[640px]:object-cover" : "",
            )}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={video.poster}
          >
            <source src={video.src} type="video/mp4" />
          </video>

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),transparent_36%,rgba(0,0,0,0.26)),radial-gradient(circle_at_50%_46%,transparent_42%,rgba(0,0,0,0.2))]" />

          <div className="absolute left-4 top-4 md:left-6 md:top-6">
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/42">live capture signal</div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.16em] text-white/82">{video.label}</div>
          </div>

          <div className={cx("absolute bottom-4 left-4 max-w-[32rem] md:bottom-6 md:left-6", mobileBleed ? "max-[640px]:hidden" : "")}>
            <TypedSignalText
              text={signalText}
              dark
              className="block text-[10px] uppercase leading-5 tracking-[0.16em] text-white/58"
            />
          </div>

          <div className="absolute bottom-4 right-4 border border-white/18 bg-[#f7f1e8] px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-neutral-950 shadow-[0_18px_54px_rgba(0,0,0,0.25)] transition group-hover:bg-white max-[640px]:bottom-5 max-[640px]:right-5 max-[640px]:px-3 max-[640px]:py-2 max-[640px]:text-[9px] md:bottom-6 md:right-6">
            Open terminal
          </div>
        </div>

        <div
          className={cx(
            "relative gap-2 px-2 pb-2 pt-4 md:px-3 md:pb-3",
            isDark
              ? "grid max-w-[58rem] md:grid-cols-[12rem_minmax(0,42rem)] md:items-start"
              : "grid max-w-[34rem]",
            mobileBleed
              ? cx(
                  "max-[640px]:mx-7 max-[640px]:max-w-none max-[640px]:border-b max-[640px]:px-0 max-[640px]:pb-5 max-[640px]:pt-4",
                  isDark ? "max-[640px]:border-white/12" : "max-[640px]:border-neutral-950/12",
                )
              : "",
          )}
        >
          <div className={cx("text-[10px] uppercase tracking-[0.18em]", isDark ? "text-white/38" : "text-neutral-400")}>
            {video.title}
          </div>
          <p className={cx("text-sm leading-6", isDark ? "max-w-[54rem] text-white/56" : "max-w-[32rem] text-neutral-600")}>
            {video.caption}
          </p>
        </div>
      </div>
    </button>
  );
}

function FramePlate({
  frame,
  index,
  tone = "paper",
  variant = "wide",
  onOpen,
}: {
  frame: ImmersiveMedia;
  index: number;
  tone?: "dark" | "paper";
  variant?: "wide" | "phone" | "compact";
  onOpen: () => void;
}) {
  const sound = useSound();
  const aspectClass =
    variant === "phone"
      ? "aspect-[9/16]"
      : variant === "compact"
        ? "aspect-[4/3]"
        : "aspect-[16/10]";

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => sound.playRole("hover")}
      className="group block min-w-0 text-left"
    >
      <div
        className={cx(
          "overflow-hidden border p-2 transition",
          tone === "dark"
            ? "border-white/12 bg-white/[0.035] group-hover:border-white/34"
            : "border-neutral-950/10 bg-white/72 group-hover:border-neutral-950/28",
        )}
      >
        <div className={cx("grid place-items-center overflow-hidden bg-black/92", aspectClass)}>
          <img
            src={frame.src}
            alt={frame.alt ?? ""}
            className="h-full w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[2.75rem_1fr] gap-3">
        <span className={cx("text-[10px] uppercase tracking-[0.16em]", tone === "dark" ? "text-white/32" : "text-neutral-400")}>
          {formatIndex(index + 1)}
        </span>
        <div>
          <div className={cx("text-[10px] uppercase tracking-[0.16em]", tone === "dark" ? "text-white/60" : "text-neutral-700")}>
            {frame.label}
          </div>
          <p className={cx("mt-2 text-sm leading-6", tone === "dark" ? "text-white/50" : "text-neutral-600")}>
            {frame.caption}
          </p>
        </div>
      </div>
    </button>
  );
}

function WhisperPhoneFrame({
  frame,
  active,
}: {
  frame: ImmersiveMedia;
  active: boolean;
}) {
  return (
    <span
      className={cx(
        "relative block aspect-[9/19] overflow-hidden rounded-[1.7rem] border-[7px] border-black bg-black shadow-[0_34px_110px_rgba(0,0,0,0.5)] transition sm:border-[9px]",
        active
          ? "ring-1 ring-[#f4efe4]/68 shadow-[0_44px_140px_rgba(0,0,0,0.62)]"
          : "ring-1 ring-white/10 group-hover:ring-white/30",
      )}
    >
      <span className="absolute inset-[2px] overflow-hidden rounded-[1.15rem] bg-black">
        <img
          src={frame.src}
          alt={frame.alt ?? ""}
          className={cx(
            "h-full w-full object-cover saturate-[1.05] contrast-[1.04] transition duration-500",
            active ? "opacity-100 brightness-[1.04]" : "opacity-[0.76] brightness-[0.9] group-hover:opacity-95 group-hover:brightness-100",
          )}
          loading="lazy"
          decoding="async"
        />
      </span>
      <span className="pointer-events-none absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-white/14" />
      <span className="pointer-events-none absolute inset-0 rounded-[1.15rem] ring-1 ring-inset ring-white/12" />
      <span className="pointer-events-none absolute bottom-2 left-1/2 h-1 w-9 -translate-x-1/2 rounded-full bg-white/18" />
    </span>
  );
}

function SpatialEvidenceField({
  frames,
  startIndex = 0,
  onOpenFrame,
}: {
  frames: ImmersiveMedia[];
  startIndex?: number;
  onOpenFrame: (src: string) => void;
}) {
  const sound = useSound();
  const reduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const dragRef = useRef<{ x: number; scrollLeft: number; moved: boolean; lastDelta: number } | null>(null);
  const mobileDragStartRef = useRef<number | null>(null);
  const clickSuppressRef = useRef(false);
  const scrollRafRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const wrapIndex = useCallback(
    (index: number) => {
      if (!frames.length) return 0;
      return ((index % frames.length) + frames.length) % frames.length;
    },
    [frames.length],
  );

  const findClosestFrame = useCallback(() => {
    const scroller = scrollRef.current;
    if (!scroller || !frames.length) return 0;

    const viewportCenter = scroller.scrollLeft + scroller.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cardRefs.current.forEach((node, index) => {
      if (!node) return;
      const nodeCenter = node.offsetLeft + node.offsetWidth / 2;
      const distance = Math.abs(nodeCenter - viewportCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }, [frames.length]);

  const updateActiveFromScroll = useCallback(() => {
    const nextIndex = findClosestFrame();
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
    return nextIndex;
  }, [findClosestFrame]);

  const getScrollEdge = useCallback(() => {
    const scroller = scrollRef.current;
    if (!scroller) return { atStart: false, atEnd: false };

    const maxLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    return {
      atStart: scroller.scrollLeft <= 2,
      atEnd: scroller.scrollLeft >= maxLeft - 2,
    };
  }, []);

  const centerFrame = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const safeIndex = wrapIndex(index);
      const scroller = scrollRef.current;
      const node = cardRefs.current[safeIndex];
      if (!scroller || !node) return;

      const nextLeft = node.offsetLeft - scroller.clientWidth / 2 + node.offsetWidth / 2;
      const maxLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      const clampedLeft = Math.min(Math.max(0, nextLeft), maxLeft);

      scroller.scrollTo({
        left: clampedLeft,
        behavior: reduceMotion ? "auto" : behavior,
      });

      setActiveIndex(safeIndex);
    },
    [reduceMotion, wrapIndex],
  );

  const focusFrame = useCallback(
    (index: number, feedback: "select" | "transition" = "select") => {
      const safeIndex = wrapIndex(index);
      sound.playRole(feedback);
      setFocusedIndex(safeIndex);
      centerFrame(safeIndex);
    },
    [centerFrame, sound, wrapIndex],
  );

  const openFocusedFrame = useCallback(
    (index: number) => {
      const frame = frames[wrapIndex(index)];
      if (!frame) return;
      sound.playRole("select");
      onOpenFrame(frame.src);
    },
    [frames, onOpenFrame, sound, wrapIndex],
  );

  const scheduleSettle = useCallback(
    (delay = 220) => {
      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current);
      }

      settleTimerRef.current = window.setTimeout(() => {
        settleTimerRef.current = null;
        centerFrame(updateActiveFromScroll());
      }, delay);
    },
    [centerFrame, updateActiveFromScroll],
  );

  const handleScroll = useCallback(() => {
    if (scrollRafRef.current !== null) return;

    scrollRafRef.current = window.requestAnimationFrame(() => {
      scrollRafRef.current = null;
      updateActiveFromScroll();
    });
  }, [updateActiveFromScroll]);

  const handleWheel = useCallback(
    (event: WheelEvent<HTMLDivElement>) => {
      const scroller = scrollRef.current;
      if (!scroller) return;

      const dominantDelta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

      if (Math.abs(dominantDelta) < 1) return;

      event.preventDefault();
      setFocusedIndex(null);

      const { atStart, atEnd } = getScrollEdge();
      const edgeIndex = updateActiveFromScroll();
      const atFirstFrame = edgeIndex === 0;
      const atLastFrame = edgeIndex === frames.length - 1;

      if (
        (dominantDelta < 0 && (atStart || atFirstFrame)) ||
        (dominantDelta > 0 && (atEnd || atLastFrame))
      ) {
        focusFrame(edgeIndex + (dominantDelta > 0 ? 1 : -1), "transition");
        return;
      }

      scroller.scrollBy({ left: dominantDelta, behavior: "auto" });
      scheduleSettle(260);
    },
    [focusFrame, frames.length, getScrollEdge, scheduleSettle, updateActiveFromScroll],
  );

  const handleFieldClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (clickSuppressRef.current) return;

      const target = event.target as HTMLElement | null;
      const pointTarget = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
      const article =
        target?.closest<HTMLElement>("[data-evidence-index]") ??
        pointTarget?.closest<HTMLElement>("[data-evidence-index]");

      if (!article || !event.currentTarget.contains(article)) return;

      const nextIndex = Number(article.dataset.evidenceIndex);
      if (!Number.isFinite(nextIndex)) return;

      if (activeIndex === nextIndex || focusedIndex === nextIndex) {
        openFocusedFrame(nextIndex);
        return;
      }

      focusFrame(nextIndex, "transition");
    },
    [activeIndex, focusFrame, focusedIndex, openFocusedFrame],
  );

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const scroller = scrollRef.current;
    if (!scroller) return;

    dragRef.current = {
      x: event.clientX,
      scrollLeft: scroller.scrollLeft,
      moved: false,
      lastDelta: 0,
    };
    clickSuppressRef.current = false;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const scroller = scrollRef.current;
    if (!drag || !scroller) return;

    const delta = event.clientX - drag.x;
    drag.lastDelta = delta;
    if (Math.abs(delta) > 5) {
      drag.moved = true;
      clickSuppressRef.current = true;
      setFocusedIndex(null);
      event.preventDefault();
    }

    scroller.scrollLeft = drag.scrollLeft - delta;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) {
      setIsDragging(false);
      return;
    }
    dragRef.current = null;
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (drag.moved) {
      const { atStart, atEnd } = getScrollEdge();
      const nextIndex = updateActiveFromScroll();
      const atFirstFrame = nextIndex === 0;
      const atLastFrame = nextIndex === frames.length - 1;

      if ((atEnd || atLastFrame) && drag.lastDelta < -5) {
        focusFrame(nextIndex + 1, "transition");
      } else if ((atStart || atFirstFrame) && drag.lastDelta > 5) {
        focusFrame(nextIndex - 1, "transition");
      } else {
        centerFrame(nextIndex);
      }
    }

    window.setTimeout(() => {
      clickSuppressRef.current = false;
    }, 120);
  };

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, frames.length);
  }, [frames.length]);

  useEffect(() => {
    const timer = window.setTimeout(() => centerFrame(0, "auto"), 80);
    return () => window.clearTimeout(timer);
  }, [centerFrame, frames.length]);

  useEffect(() => {
    return () => {
      if (scrollRafRef.current !== null) window.cancelAnimationFrame(scrollRafRef.current);
      if (settleTimerRef.current !== null) window.clearTimeout(settleTimerRef.current);
    };
  }, []);

  if (!frames.length) return null;

  const focusedFrame = focusedIndex !== null ? frames[focusedIndex] : null;
  const activeFrame = frames[activeIndex] ?? frames[0];
  const activeTrueIndex = startIndex + activeIndex;
  const selectEvidenceFrame = (index: number, feedback: "select" | "transition" = "select") => {
    const safeIndex = wrapIndex(index);
    sound.playRole(feedback);
    setFocusedIndex(null);
    setActiveIndex(safeIndex);
  };
  const circularEvidenceOffset = (index: number) => {
    let offset = index - activeIndex;
    const half = frames.length / 2;
    if (offset > half) offset -= frames.length;
    if (offset < -half) offset += frames.length;
    return offset;
  };

  return (
    <section
      id="whisper-evidence"
      data-header-scene="whisper-evidence"
      className="relative left-1/2 mt-16 w-screen -translate-x-1/2 scroll-mt-[5.5rem] overflow-hidden bg-[#060706] pb-20 pt-[7.5rem] text-white shadow-[0_-1px_0_rgba(0,0,0,0.28),0_1px_0_rgba(0,0,0,0.28)] md:py-22 md:scroll-mt-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_48%_44%,rgba(240,233,214,0.16),transparent_24%),radial-gradient(circle_at_78%_32%,rgba(64,92,75,0.16),transparent_28%),linear-gradient(90deg,rgba(0,0,0,0.78),rgba(0,0,0,0.18)_50%,rgba(0,0,0,0.82))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.075] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:92px_92px]" />
      <div className="pointer-events-none absolute left-[12%] top-[16%] h-[38rem] w-[38rem] rounded-full border border-white/10" />
      <div className="pointer-events-none absolute left-[7vw] top-[55%] h-px w-[86vw] rotate-[7deg] bg-gradient-to-r from-transparent via-white/18 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(180deg,transparent,rgba(7,8,7,0.78)_58%,#070807)]" />

      <div className="relative z-10 mx-auto grid w-full gap-8 px-7 md:w-[min(92vw,1640px)] md:px-8 lg:grid-cols-[0.36fr_0.64fr] lg:items-end">
        <div>
          <SectionLabel index="03.1" label="Spatial evidence field" dark />
          <h3 className="mt-6 max-w-[9ch] text-[40px] font-semibold leading-[0.94] tracking-normal text-white sm:text-[62px] xl:text-[78px]">
            Screens become a proof field.
          </h3>
        </div>
        <div className="grid gap-4 lg:justify-items-end">
          <p className="max-w-[48rem] text-[15px] leading-8 text-white/58">
            Each desktop frame stays inspectable as spatial evidence between the live website and the Quest room.
          </p>
          {focusedFrame ? (
            <div className="w-full max-w-[48rem] border-y border-white/12 py-4 md:grid md:grid-cols-[0.28fr_1fr] md:gap-6">
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/34">
                Active proof / {formatIndex(startIndex + (focusedIndex ?? 0) + 1)}
              </div>
              <p className="mt-2 text-sm leading-7 text-white/64 md:mt-0">
                {focusedFrame.caption}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="relative z-10 mt-9 px-7 md:hidden">
        <div className="relative border-y border-white/12 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[9px] uppercase tracking-[0.18em] text-white/30">Proof orbit</div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/68">
                Signal {formatIndex(activeTrueIndex + 1)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => selectEvidenceFrame(activeIndex - 1, "transition")}
                className="grid h-9 w-9 place-items-center border border-white/14 bg-white/[0.04] text-[14px] text-white/58 transition hover:border-white/36 hover:text-white"
                aria-label="Previous evidence frame"
              >
                &larr;
              </button>
              <button
                type="button"
                onClick={() => selectEvidenceFrame(activeIndex + 1, "transition")}
                className="grid h-9 w-9 place-items-center border border-white/14 bg-white/[0.04] text-[14px] text-white/58 transition hover:border-white/36 hover:text-white"
                aria-label="Next evidence frame"
              >
                &rarr;
              </button>
            </div>
          </div>

          <motion.div
            className="relative mt-5 h-[24.5rem] cursor-grab touch-pan-y select-none overflow-visible active:cursor-grabbing"
            drag={!reduceMotion ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            dragMomentum={false}
            onDragStart={(_, info) => {
              mobileDragStartRef.current = info.point.x;
            }}
            onDragEnd={(_, info) => {
              const start = mobileDragStartRef.current ?? info.point.x;
              const delta = info.point.x - start;
              mobileDragStartRef.current = null;
              if (Math.abs(delta) < 44) return;
              selectEvidenceFrame(activeIndex + (delta < 0 ? 1 : -1), "transition");
            }}
            style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
          >
            {frames.map((frame, index) => {
              const offset = circularEvidenceOffset(index);
              const active = offset === 0;
              const depth = Math.abs(offset);
              const visible = depth <= 1.35;
              const trueIndex = startIndex + index;

              return (
                <motion.button
                  key={`${frame.src}-mobile-evidence`}
                  type="button"
                  onClick={() => {
                    if (active) {
                      openFocusedFrame(index);
                    } else {
                      selectEvidenceFrame(index, "transition");
                    }
                  }}
                  onMouseEnter={() => sound.playRole("hover")}
                  className="absolute left-1/2 top-8 w-[104%] text-left outline-none focus-visible:ring-2 focus-visible:ring-[#f4efe4]/80"
                  style={{
                    pointerEvents: visible ? "auto" : "none",
                    zIndex: active ? 80 : 10 - depth,
                    transformStyle: "preserve-3d",
                  }}
                  initial={false}
                  animate={{
                    opacity: visible ? (active ? 1 : 0.24) : 0,
                    x: `calc(-50% + ${offset * 82}%)`,
                    y: active ? 0 : 26,
                    rotateZ: active ? 0 : offset * -4,
                    rotateY: active ? 0 : offset * 10,
                    scale: active ? 1 : 0.78,
                  }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.58, ease }}
                  aria-label={active ? `Open ${frame.label}` : `Focus ${frame.label}`}
                  aria-pressed={active}
                >
                  <span className={cx("block border bg-black shadow-[0_36px_130px_rgba(0,0,0,0.52)]", active ? "border-[#f4efe4]/68" : "border-white/12")}>
                    <span className="relative grid aspect-[16/10] place-items-center overflow-hidden bg-black">
                      <img
                        src={frame.src}
                        alt={frame.alt ?? ""}
                        className="h-full w-full object-contain"
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),transparent_42%,rgba(0,0,0,0.34))]" />
                      <span className="pointer-events-none absolute left-3 top-3 border border-white/18 bg-black/50 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.15em] text-white/70 backdrop-blur">
                        Signal {formatIndex(trueIndex + 1)}
                      </span>
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          <div className="-mt-1 flex items-center justify-between gap-4">
            <div className="text-[9px] uppercase tracking-[0.18em] text-white/32">
              {formatIndex(activeTrueIndex + 1)} / {activeFrame.label}
            </div>
            <div className="flex items-center gap-1.5">
              {frames.map((frame, index) => (
                <button
                  key={`${frame.src}-mobile-evidence-dot`}
                  type="button"
                  onClick={() => selectEvidenceFrame(index, "transition")}
                  className={cx(
                    "h-1.5 transition",
                    index === activeIndex ? "w-8 bg-[#f4efe4]" : "w-2 bg-white/22 hover:bg-white/48",
                  )}
                  aria-label={`Focus evidence frame ${formatIndex(startIndex + index + 1)}`}
                  aria-pressed={index === activeIndex}
                />
              ))}
            </div>
          </div>
          <div className="mt-4 text-[22px] font-semibold leading-tight tracking-normal text-white">{activeFrame.label}</div>
          <p className="mt-3 text-[14px] leading-7 text-white/56">{activeFrame.caption}</p>
        </div>
      </div>

      <div className="relative z-10 mt-10">
        <div
          ref={scrollRef}
          className="hidden cursor-grab select-none gap-8 overflow-x-auto overscroll-x-contain px-[max(1.5rem,21vw,calc(50vw-410px))] py-12 active:cursor-grabbing md:flex md:gap-12 md:py-18 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: isDragging ? "none" : "x mandatory", perspective: "1400px" }}
          onScroll={handleScroll}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClick={handleFieldClick}
        >
          {frames.map((frame, index) => {
            const offset = index - activeIndex;
            const distance = Math.abs(offset);
            const focused = focusedIndex === index;
            const active = focused || activeIndex === index;
            const trueIndex = startIndex + index;

            return (
              <motion.article
                key={frame.src}
                data-evidence-index={index}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                onMouseEnter={() => sound.playRole("hover")}
                className="group relative min-h-[22rem] w-[82vw] shrink-0 origin-center touch-pan-y text-left outline-none md:min-h-[28rem] md:w-[min(58vw,820px)]"
                style={{
                  scrollSnapAlign: "center",
                  zIndex: focused ? 90 : Math.max(20, 70 - distance * 8),
                }}
                animate={
                  reduceMotion
                    ? { opacity: active ? 1 : 0.56 }
                    : {
                        y: focused ? -18 : Math.sin(index * 1.2) * 18 + distance * 10,
                        rotateY: focused ? 0 : offset * -6.5,
                        rotateZ: focused ? 0 : offset * -1.8,
                        scale: focused ? 1.08 : active ? 1.01 : Math.max(0.78, 0.93 - distance * 0.055),
                        opacity: focused ? 1 : Math.max(0.32, 1 - distance * 0.17),
                      }
                }
                transition={{ duration: focused ? 0.82 : 0.58, ease }}
              >
                <button
                  type="button"
                  className={cx(
                    "relative block w-full overflow-hidden border bg-black text-left shadow-[0_42px_160px_rgba(0,0,0,0.44)] transition",
                    focused ? "border-[#f4efe4]/80" : active ? "border-white/36" : "border-white/12 group-hover:border-white/30",
                  )}
                >
                  <span className="relative grid aspect-[16/10] place-items-center overflow-hidden">
                    <img
                      src={frame.src}
                      alt={frame.alt ?? ""}
                      className="h-full w-full object-contain"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                    <span
                      className={cx(
                        "pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.38))] transition-opacity duration-300",
                        active ? "opacity-0" : "opacity-80",
                      )}
                    />
                    <span className="pointer-events-none absolute left-4 top-4 border border-white/18 bg-black/42 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white/70 backdrop-blur">
                      Signal {formatIndex(trueIndex + 1)}
                    </span>
                  </span>

                  <span className="grid gap-3 border-t border-white/12 bg-black/62 px-4 py-4 backdrop-blur sm:gap-4 md:grid-cols-[0.18fr_0.46fr_1fr] md:px-5">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/28">
                      {formatIndex(trueIndex + 1)}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-white/72">
                      {frame.label}
                    </span>
                    <span className="text-[13px] leading-6 text-white/54 sm:text-sm">
                      {frame.caption}
                    </span>
                  </span>
                </button>
              </motion.article>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-[18vw] bg-gradient-to-r from-[#060706] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[18vw] bg-gradient-to-l from-[#060706] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto mt-4 hidden w-full flex-wrap items-center justify-between gap-4 px-7 md:flex md:w-[min(92vw,1640px)] md:px-8">
        <div className="flex items-center gap-2">
          {frames.map((frame, index) => (
            <button
              key={`${frame.src}-field-dot`}
              type="button"
              onClick={() => focusFrame(index, "transition")}
              className={cx(
                "h-1.5 transition",
                index === activeIndex ? "w-8 bg-[#f4efe4]" : "w-2 bg-white/24 hover:bg-white/48",
              )}
              aria-label={`Focus evidence frame ${formatIndex(startIndex + index + 1)}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => focusFrame(activeIndex - 1, "transition")}
            className="grid h-10 w-10 place-items-center border border-white/14 bg-white/[0.04] text-white/64 transition hover:border-white/36 hover:text-white"
            aria-label="Previous evidence frame"
          >
            &larr;
          </button>
          <button
            type="button"
            onClick={() => focusFrame(activeIndex + 1, "transition")}
            className="grid h-10 w-10 place-items-center border border-white/14 bg-white/[0.04] text-white/64 transition hover:border-white/36 hover:text-white"
            aria-label="Next evidence frame"
          >
            &rarr;
          </button>
        </div>
      </div>
    </section>
  );
}

function QuestProofOrbit({
  frames,
  onOpenFrame,
}: {
  frames: ImmersiveMedia[];
  onOpenFrame: (src: string) => void;
}) {
  const sound = useSound();
  const reduceMotion = useReducedMotion();
  const dragStartRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const wrapIndex = useCallback(
    (index: number) => {
      if (!frames.length) return 0;
      return ((index % frames.length) + frames.length) % frames.length;
    },
    [frames.length],
  );

  const selectFrame = (index: number, feedback: "select" | "transition" = "select") => {
    const safeIndex = wrapIndex(index);
    sound.playRole(feedback);
    setActiveIndex(safeIndex);
  };

  const circularOffset = (index: number) => {
    let offset = index - activeIndex;
    const half = frames.length / 2;
    if (offset > half) offset -= frames.length;
    if (offset < -half) offset += frames.length;
    return offset;
  };

  if (!frames.length) return null;

  const activeFrame = frames[activeIndex] ?? frames[0];

  return (
    <div className="relative ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] w-screen px-7 md:hidden">
      <div className="relative overflow-visible border-y border-white/12 py-5">
        <div className="pointer-events-none absolute left-[12%] top-[18%] h-[22rem] w-[22rem] rounded-full border border-white/[0.08]" />
        <div className="pointer-events-none absolute left-[-8%] top-[46%] h-px w-[116%] -rotate-[8deg] bg-gradient-to-r from-transparent via-white/16 to-transparent" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <div className="text-[9px] uppercase tracking-[0.18em] text-white/30">Quest proof orbit</div>
            <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/68">
              Spatial capture {formatIndex(activeIndex + 1)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => selectFrame(activeIndex - 1, "transition")}
              className="grid h-9 w-9 place-items-center border border-white/14 bg-white/[0.04] text-[14px] text-white/58 transition hover:border-white/36 hover:text-white"
              aria-label="Previous Quest proof"
            >
              &larr;
            </button>
            <button
              type="button"
              onClick={() => selectFrame(activeIndex + 1, "transition")}
              className="grid h-9 w-9 place-items-center border border-white/14 bg-white/[0.04] text-[14px] text-white/58 transition hover:border-white/36 hover:text-white"
              aria-label="Next Quest proof"
            >
              &rarr;
            </button>
          </div>
        </div>

        <motion.div
          className="relative z-10 mt-5 h-[24.5rem] cursor-grab touch-pan-y select-none overflow-visible active:cursor-grabbing"
          drag={!reduceMotion ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.16}
          dragMomentum={false}
          onDragStart={(_, info) => {
            dragStartRef.current = info.point.x;
          }}
          onDragEnd={(_, info) => {
            const start = dragStartRef.current ?? info.point.x;
            const delta = info.point.x - start;
            dragStartRef.current = null;
            if (Math.abs(delta) < 44) return;
            selectFrame(activeIndex + (delta < 0 ? 1 : -1), "transition");
          }}
        >
          {frames.map((frame, index) => {
            const offset = circularOffset(index);
            const active = offset === 0;
            const depth = Math.abs(offset);
            const visible = depth <= 1.35;

            return (
              <motion.button
                key={`${frame.src}-quest-orbit`}
                type="button"
                onClick={() => {
                  if (active) {
                    sound.playRole("select");
                    onOpenFrame(frame.src);
                  } else {
                    selectFrame(index, "transition");
                  }
                }}
                onMouseEnter={() => sound.playRole("hover")}
                className="absolute left-1/2 top-8 w-[108%] text-left outline-none focus-visible:ring-2 focus-visible:ring-[#f4efe4]/80"
                style={{
                  pointerEvents: visible ? "auto" : "none",
                  zIndex: active ? 80 : 10 - depth,
                }}
                initial={false}
                animate={{
                  opacity: visible ? (active ? 1 : 0.24) : 0,
                  x: `calc(-50% + ${offset * 84}%)`,
                  y: active ? 0 : 26,
                  rotateZ: active ? 0 : offset * -3,
                  scale: active ? 1 : 0.78,
                }}
                transition={{ duration: reduceMotion ? 0.01 : 0.58, ease }}
                aria-label={active ? `Open ${frame.label}` : `Focus ${frame.label}`}
                aria-pressed={active}
              >
                <span className={cx("block border bg-black shadow-[0_36px_130px_rgba(0,0,0,0.55)]", active ? "border-[#f4efe4]/58" : "border-white/12")}>
                  <span className="relative grid aspect-[16/10] place-items-center overflow-hidden bg-black">
                    <img
                      src={frame.src}
                      alt={frame.alt ?? ""}
                      className="h-full w-full object-contain"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                    <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),transparent_42%,rgba(0,0,0,0.36))]" />
                    <span className="pointer-events-none absolute left-3 top-3 border border-white/18 bg-black/50 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.15em] text-white/70 backdrop-blur">
                      Quest {formatIndex(index + 1)}
                    </span>
                  </span>
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        <div className="-mt-1 flex items-center justify-between gap-4">
          <div className="text-[9px] uppercase tracking-[0.18em] text-white/32">
            {formatIndex(activeIndex + 1)} / {activeFrame.label}
          </div>
          <div className="flex items-center gap-1.5">
            {frames.map((frame, index) => (
              <button
                key={`${frame.src}-quest-orbit-dot`}
                type="button"
                onClick={() => selectFrame(index, "transition")}
                className={cx(
                  "h-1.5 transition",
                  index === activeIndex ? "w-8 bg-[#f4efe4]" : "w-2 bg-white/22 hover:bg-white/48",
                )}
                aria-label={`Focus Quest proof ${formatIndex(index + 1)}`}
                aria-pressed={index === activeIndex}
              />
            ))}
          </div>
        </div>
        <div className="mt-4 text-[22px] font-semibold leading-tight tracking-normal text-white">{activeFrame.label}</div>
        <p className="mt-3 text-[14px] leading-7 text-white/56">{activeFrame.caption}</p>
      </div>
    </div>
  );
}

function SpatialAtlasMap({
  activeLayer,
  onSelectLayer,
  previewFrames,
  layers = proofLayers,
}: {
  activeLayer: LayerId;
  onSelectLayer: (id: LayerId) => void;
  previewFrames: Record<LayerId, ImmersiveMedia | null>;
  layers?: typeof proofLayers;
}) {
  const sound = useSound();
  const reduceMotion = useReducedMotion();
  const dragStartRef = useRef<number | null>(null);
  const activeProof = layers.find((layer) => layer.id === activeLayer) ?? layers[0];
  const activePreview = previewFrames[activeLayer];
  const activeLayerIndex = Math.max(0, layers.findIndex((layer) => layer.id === activeLayer));
  const selectLayer = (id: LayerId, role: "select" | "transition" = "select") => {
    sound.playRole(role);
    onSelectLayer(id);
  };
  const selectLayerByOffset = (offset: number) => {
    const nextIndex = (activeLayerIndex + offset + layers.length) % layers.length;
    const nextLayer = layers[nextIndex];
    if (nextLayer) selectLayer(nextLayer.id, "transition");
  };
  const circularOffset = (index: number) => {
    let offset = index - activeLayerIndex;
    const half = layers.length / 2;
    if (offset > half) offset -= layers.length;
    if (offset < -half) offset += layers.length;
    return offset;
  };
  const positions: Record<LayerId, { left: string; top: string; width: string; rotate: number }> = {
    web: { left: "7%", top: "15%", width: "47%", rotate: -5 },
    xr: { left: "min(48%, calc(100% - 250px))", top: "8%", width: "39%", rotate: 4 },
    collector: { left: "28%", top: "46%", width: "43%", rotate: 2 },
    mobile: { left: "min(67%, calc(100% - 150px))", top: "38%", width: "20%", rotate: -4 },
  };

  return (
    <div className="relative text-neutral-950">
      <div className="lg:hidden">
        <div className="relative overflow-visible border-y border-neutral-950/12 py-5">
          <div className="pointer-events-none absolute left-[10%] top-[11%] h-[24rem] w-[24rem] rounded-full border border-neutral-950/[0.055]" />
          <div className="pointer-events-none absolute left-[-10%] top-[43%] h-px w-[120%] -rotate-[10deg] bg-gradient-to-r from-transparent via-neutral-950/14 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,transparent,rgba(242,238,228,0.9))]" />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <div>
              <div className="text-[9px] uppercase tracking-[0.18em] text-neutral-400">Swipe atlas</div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-neutral-700">{activeProof.signal}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => selectLayerByOffset(-1)}
                className="grid h-9 w-9 place-items-center border border-neutral-950/12 bg-white/42 text-[14px] text-neutral-500 backdrop-blur-sm transition hover:border-neutral-950/28 hover:text-neutral-950"
                aria-label="Previous atlas surface"
              >
                &larr;
              </button>
              <button
                type="button"
                onClick={() => selectLayerByOffset(1)}
                className="grid h-9 w-9 place-items-center border border-neutral-950/12 bg-white/42 text-[14px] text-neutral-500 backdrop-blur-sm transition hover:border-neutral-950/28 hover:text-neutral-950"
                aria-label="Next atlas surface"
              >
                &rarr;
              </button>
            </div>
          </div>

          <motion.div
            className="relative z-10 mt-5 h-[27rem] cursor-grab touch-pan-y select-none overflow-visible active:cursor-grabbing"
            drag={!reduceMotion ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            dragMomentum={false}
            onDragStart={(_, info) => {
              dragStartRef.current = info.point.x;
            }}
            onDragEnd={(_, info) => {
              const start = dragStartRef.current ?? info.point.x;
              const delta = info.point.x - start;
              dragStartRef.current = null;
              if (Math.abs(delta) < 44) return;
              selectLayerByOffset(delta < 0 ? 1 : -1);
            }}
            style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
          >
            {layers.map((layer, index) => {
              const offset = circularOffset(index);
              const active = offset === 0;
              const depth = Math.abs(offset);
              const visible = depth <= 1.6;
              const frame = previewFrames[layer.id];
              const phone = layer.id === "mobile";

              return (
                <motion.button
                  key={`${layer.id}-atlas-card`}
                  type="button"
                  onClick={() => {
                    if (!active) selectLayer(layer.id, "transition");
                  }}
                  onMouseEnter={() => sound.playRole("hover")}
                  className={cx(
                    "absolute left-1/2 text-left outline-none focus-visible:ring-2 focus-visible:ring-neutral-300",
                    phone ? "top-8 w-[56%]" : "top-16 w-[104%]",
                  )}
                  style={{
                    pointerEvents: visible ? "auto" : "none",
                    zIndex: active ? 80 : 10 - depth,
                    transformStyle: "preserve-3d",
                  }}
                  initial={false}
                  animate={{
                    opacity: visible ? (active ? 1 : 0.34) : 0,
                    x: `calc(-50% + ${offset * 82}%)`,
                    y: active ? 0 : 28,
                    rotateZ: active ? 0 : offset * -5,
                    rotateY: active ? 0 : offset * 12,
                    scale: active ? 1 : 0.78,
                  }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.62, ease }}
                  aria-label={active ? `${layer.title} active` : `Focus ${layer.title}`}
                  aria-pressed={active}
                >
                  <span
                    className={cx(
                      "block border bg-[#f8f5ee]/72 p-1.5 shadow-[0_28px_92px_rgba(22,19,14,0.14)] backdrop-blur-sm transition",
                      active ? "border-neutral-950/28" : "border-neutral-950/12",
                    )}
                  >
                    <span className={cx("relative grid place-items-center overflow-hidden bg-black", phone ? "aspect-[9/16]" : "aspect-[16/10]")}>
                      {frame ? (
                        <img src={frame.src} alt={frame.alt ?? ""} className="h-full w-full object-contain" loading="lazy" decoding="async" draggable={false} />
                      ) : (
                        <span className="px-4 text-[10px] uppercase tracking-[0.16em] text-neutral-400">Pending media</span>
                      )}
                      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),transparent_48%,rgba(0,0,0,0.32))]" />
                      <span className="pointer-events-none absolute left-3 top-3 border border-white/18 bg-black/50 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.15em] text-white/70 backdrop-blur">
                        {layer.index} / {surfaceShortLabels[layer.id]}
                      </span>
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          <div className="relative z-10 -mt-2 border-y border-neutral-950/12 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="text-[9px] uppercase tracking-[0.18em] text-neutral-400">
                {activeProof.index} / {surfaceShortLabels[activeProof.id]}
              </div>
              <div className="flex items-center gap-1.5">
                {layers.map((layer) => (
                  <button
                    key={`${layer.id}-atlas-dot`}
                    type="button"
                    onClick={() => selectLayer(layer.id, "transition")}
                    className={cx(
                      "h-1.5 transition",
                      layer.id === activeLayer ? "w-8 bg-neutral-950" : "w-2 bg-neutral-950/20 hover:bg-neutral-950/42",
                    )}
                    aria-label={`Open ${layer.title}`}
                    aria-pressed={layer.id === activeLayer}
                  />
                ))}
              </div>
            </div>
            <div className="mt-4 text-[22px] font-semibold leading-tight tracking-normal text-neutral-950">{activeProof.title}</div>
            <p className="mt-3 text-[13px] leading-6 text-neutral-600">{activeProof.text}</p>
          </div>
        </div>
      </div>

      <div className="relative hidden min-h-[660px] overflow-visible lg:block">
        <div className="pointer-events-none absolute left-[14%] top-[12%] h-[34rem] w-[34rem] rounded-full border border-neutral-950/[0.06]" />
        <div className="pointer-events-none absolute left-[3%] right-[4%] top-[13%] h-px bg-gradient-to-r from-transparent via-neutral-950/18 to-transparent" />
        <div className="pointer-events-none absolute bottom-[17%] left-[7%] right-[11%] h-px bg-gradient-to-r from-transparent via-neutral-950/12 to-transparent" />
        <div className="pointer-events-none absolute left-[7%] top-[52%] h-px w-[82%] rotate-[10deg] bg-gradient-to-r from-transparent via-neutral-950/18 to-transparent" />
        <div className="pointer-events-none absolute left-[14%] top-[22%] h-px w-[70%] -rotate-[14deg] bg-gradient-to-r from-transparent via-neutral-950/10 to-transparent" />
        <div className="pointer-events-none absolute right-[8%] top-[20%] h-2 w-2 rounded-full bg-neutral-950 shadow-[0_0_28px_rgba(17,17,17,0.16)]" />

        <div className="relative z-10 flex items-start justify-between gap-4 px-3 pt-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Spatial map / live system</div>
            <div className="mt-2 text-[12px] uppercase tracking-[0.18em] text-neutral-700">{activeProof.signal}</div>
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
            Surface orbit
          </div>
        </div>

        <div className="relative z-10 min-h-[560px]">
          {layers.map((layer) => {
            const active = activeLayer === layer.id;
            const frame = previewFrames[layer.id];
            const position = positions[layer.id];

            return (
              <motion.button
                key={layer.id}
                type="button"
                onClick={() => {
                  sound.playRole("select");
                  onSelectLayer(layer.id);
                }}
                onMouseEnter={() => sound.playRole("hover")}
                className={cx(
                  "absolute text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300",
                  active ? "z-20" : "z-10 hover:z-20",
                  layer.id === "mobile" ? "min-w-[130px]" : "min-w-[230px]",
                )}
                style={{ left: position.left, top: position.top, width: position.width }}
                animate={{ rotate: active ? 0 : position.rotate, scale: active ? 1.06 : 1, opacity: active ? 1 : 0.82 }}
                transition={{ duration: 0.54, ease }}
              >
                <span
                  className={cx(
                    "grid place-items-center overflow-hidden border bg-white/54 p-1.5 shadow-[0_28px_90px_rgba(17,17,17,0.11)] backdrop-blur-sm transition",
                    active ? "border-neutral-950/34 shadow-[0_34px_120px_rgba(17,17,17,0.16)]" : "border-neutral-950/12 hover:border-neutral-950/26",
                    layer.id === "mobile" ? "aspect-[9/16]" : "aspect-[16/10]",
                  )}
                >
                  {frame ? (
                    <img src={frame.src} alt={frame.alt ?? ""} className="h-full w-full object-contain" loading="lazy" decoding="async" />
                  ) : (
                    <span className="px-4 text-[10px] uppercase tracking-[0.16em] text-neutral-400">Pending media</span>
                  )}
                </span>
                <span
                  className={cx(
                    "mt-3 grid grid-cols-[2rem_1fr] gap-3 transition",
                    active ? "opacity-100" : "pointer-events-none opacity-0",
                  )}
                >
                  <span className={cx("text-[10px] uppercase tracking-[0.18em]", active ? "text-neutral-950" : "text-neutral-300")}>{layer.index}</span>
                  <span>
                    <span className={cx("block text-[11px] font-semibold uppercase tracking-[0.14em]", active ? "text-neutral-950" : "text-neutral-500")}>{layer.title}</span>
                    <span className="mt-1 block text-[10px] uppercase tracking-[0.16em] text-neutral-400">{layer.signal}</span>
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>

        <div className="relative z-10 grid gap-5 border-y border-neutral-950/12 px-3 py-5 md:grid-cols-[0.16fr_0.42fr_1fr]">
          <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-300">{activeProof.index}</div>
          <div>
            <div className="text-[20px] font-semibold leading-tight tracking-normal text-neutral-950 md:text-[28px]">{activeProof.title}</div>
            <div className="mt-3 text-[10px] uppercase tracking-[0.18em] text-neutral-400">{activePreview?.label ?? activeProof.signal}</div>
          </div>
          <p className="text-sm leading-7 text-neutral-600 md:text-[15px]">{activeProof.text}</p>
        </div>
      </div>
    </div>
  );
}

function CollectorChamber({
  frames,
  onOpenFrame,
}: {
  frames: ImmersiveMedia[];
  onOpenFrame: (src: string) => void;
}) {
  const sound = useSound();
  const [activeId, setActiveId] = useState("print");
  const chamberItems = [
    {
      id: "print",
      eyebrow: "01 / edition object",
      label: "Edition detail",
      chip: "Edition",
      signal: "material proof",
      text: "Edition info, material notes, and purchase intent anchor the artwork as an object.",
      frame: frames[0] ?? null,
    },
    {
      id: "ar",
      eyebrow: "02 / AR chamber",
      label: "AR preview",
      chip: "AR preview",
      signal: "room preview",
      text: "The framed work becomes a placed preview, ready for collector context.",
      frame: frames[1] ?? null,
    },
    {
      id: "notes",
      eyebrow: "03 / notes layer",
      label: "Handoff notes",
      chip: "Notes",
      signal: "context layer",
      text: "Authorship and ownership context stay attached after XR.",
      frame: frames[2] ?? null,
    },
  ];
  const primary = chamberItems[0];
  const secondary = chamberItems[1];
  const activeItem = chamberItems.find((item) => item.id === activeId) ?? primary;

  if (!primary?.frame) return null;

  return (
    <div className="relative mt-10 overflow-visible border-y border-neutral-950/12 py-7 text-neutral-950 md:mt-14 md:py-10">
      <div className="pointer-events-none absolute left-[3%] top-[4%] h-[28rem] w-[28rem] rounded-full border border-neutral-950/[0.055]" />
      <div className="pointer-events-none absolute right-[-10%] top-[26%] h-[22rem] w-[22rem] rounded-full border border-neutral-950/[0.045]" />
      <div className="pointer-events-none absolute left-[-8%] right-[-8%] top-[48%] h-px -rotate-[8deg] bg-gradient-to-r from-transparent via-neutral-950/13 to-transparent" />

      <div className="relative z-10 grid gap-8 lg:grid-cols-[0.58fr_0.42fr] lg:items-center">
        <div className="relative min-h-[430px] sm:min-h-[520px] lg:min-h-[500px]">
          <button
            type="button"
            onClick={() => onOpenFrame(primary.frame!.src)}
            onMouseEnter={() => {
              sound.playRole("hover");
              setActiveId(primary.id);
            }}
            onFocus={() => setActiveId(primary.id)}
            className="group relative w-[104%] -translate-x-[2%] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 lg:absolute lg:left-0 lg:top-4 lg:w-[78%] lg:translate-x-0"
          >
            <span className="block border border-neutral-950/16 bg-[#f8f5ee]/56 p-2 shadow-[0_34px_120px_rgba(26,23,18,0.14)] backdrop-blur-sm transition group-hover:border-neutral-950/34">
              <span className="grid aspect-[16/11] place-items-center overflow-hidden bg-[#f4f0e7]">
                <img src={primary.frame.src} alt={primary.frame.alt ?? ""} className="h-full w-full object-contain" loading="lazy" decoding="async" />
              </span>
            </span>
          </button>

          {secondary?.frame ? (
            <motion.button
              type="button"
              onClick={() => onOpenFrame(secondary.frame!.src)}
              onMouseEnter={() => {
                sound.playRole("hover");
                setActiveId(secondary.id);
              }}
              onFocus={() => setActiveId(secondary.id)}
              className="group absolute bottom-0 right-[-4%] w-[86%] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 sm:w-[78%] lg:bottom-3 lg:right-0 lg:w-[48%]"
              animate={{ rotate: activeId === secondary.id ? 0 : -3, scale: activeId === secondary.id ? 1.02 : 1 }}
              transition={{ duration: 0.48, ease }}
            >
              <span
                className={cx(
                  "block border bg-[#f8f5ee]/66 p-2 shadow-[0_30px_100px_rgba(26,23,18,0.13)] backdrop-blur-sm transition",
                  activeId === secondary.id ? "border-neutral-950/32" : "border-neutral-950/13 group-hover:border-neutral-950/28",
                )}
              >
                <span className="grid aspect-[16/10] place-items-center overflow-hidden bg-[#f4f0e7]">
                  <img src={secondary.frame.src} alt={secondary.frame.alt ?? ""} className="h-full w-full object-contain" loading="lazy" decoding="async" />
                </span>
              </span>
              <span className="mt-3 grid grid-cols-[2rem_1fr] gap-3">
                <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">02</span>
                <span>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-950">{secondary.label}</span>
                  <span className="mt-1 block text-[10px] uppercase tracking-[0.16em] text-neutral-400">{secondary.signal}</span>
                </span>
              </span>
            </motion.button>
          ) : null}
        </div>

        <div className="relative">
          <div className="flex items-center justify-between gap-4 border-y border-neutral-950/12 py-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Collector handoff field</div>
              <div className="mt-2 text-[12px] uppercase tracking-[0.18em] text-neutral-700">{activeItem.signal}</div>
            </div>
            <div className="h-2 w-2 rounded-full bg-neutral-950 shadow-[0_0_26px_rgba(17,17,17,0.16)]" />
          </div>

          <p className="mt-6 max-w-[34rem] text-[22px] font-semibold leading-tight tracking-normal text-neutral-950 md:text-[28px]">
            Edition, preview, and notes stay attached to the artwork.
          </p>
          <p className="mt-4 max-w-[36rem] text-sm leading-7 text-neutral-600">
            After XR, the case lands in collector action: object detail, placed AR preview, and context for handoff.
          </p>

          <div className="mt-7 flex flex-nowrap gap-1.5">
            {chamberItems.map((item) =>
              item.frame || item.id === "notes" ? (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    sound.playRole("select");
                    setActiveId(item.id);
                  }}
                  className={cx(
                    "whitespace-nowrap border px-2.5 py-2 text-[9px] font-semibold uppercase tracking-[0.14em] transition min-[420px]:px-3 min-[420px]:text-[10px]",
                    activeId === item.id
                      ? "border-neutral-950 bg-neutral-950 text-[#f4efe4]"
                      : "border-neutral-950/14 bg-[#f8f5ee]/44 text-neutral-500 hover:border-neutral-950/32 hover:text-neutral-950",
                  )}
                >
                  {item.chip}
                </button>
              ) : null,
            )}
          </div>

          <p className="mt-5 max-w-[34rem] text-[13px] leading-6 text-neutral-500">{activeItem.text}</p>
        </div>
      </div>
    </div>
  );
}

function CinematicMobileField({
  frames,
  onOpenFrame,
}: {
  frames: ImmersiveMedia[];
  onOpenFrame: (src: string) => void;
}) {
  const sound = useSound();
  const reduceMotion = useReducedMotion();
  const dragStartRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFrame = frames[activeIndex] ?? frames[0];

  const wrapIndex = useCallback(
    (index: number) => {
      if (!frames.length) return 0;
      return ((index % frames.length) + frames.length) % frames.length;
    },
    [frames.length],
  );

  const selectFrame = (index: number, feedback: "select" | "transition" = "select") => {
    const safeIndex = wrapIndex(index);
    sound.playRole(feedback);
    setActiveIndex(safeIndex);
  };

  const circularOffset = (index: number) => {
    let offset = index - activeIndex;
    const half = frames.length / 2;
    if (offset > half) offset -= frames.length;
    if (offset < -half) offset += frames.length;
    return offset;
  };

  if (!frames.length || !activeFrame) return null;

  return (
    <div className="relative ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] mt-10 w-screen overflow-hidden md:mx-0 md:mt-14 md:w-auto">
      <div className="relative overflow-hidden border-y border-white/12 bg-[#070806] py-5 text-white shadow-[0_46px_180px_rgba(0,0,0,0.25)] md:border md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_48%_28%,rgba(242,234,214,0.14),transparent_24%),radial-gradient(circle_at_74%_54%,rgba(61,88,74,0.24),transparent_30%),linear-gradient(115deg,rgba(0,0,0,0.9),rgba(0,0,0,0.34)_50%,rgba(0,0,0,0.92))]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:78px_78px]" />
        <div className="pointer-events-none absolute left-[16%] top-[18%] h-[30rem] w-[30rem] rounded-full border border-white/[0.07]" />
        <div className="pointer-events-none absolute left-[-18%] top-[52%] h-px w-[136%] -rotate-[7deg] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="relative z-10 flex items-center justify-between gap-4 px-7 md:px-0">
          <div>
            <div className="text-[9px] uppercase tracking-[0.18em] text-white/32">Mobile route orbit</div>
            <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/70">
              Frame {formatIndex(activeIndex + 1)} / {formatIndex(frames.length)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => selectFrame(activeIndex - 1, "transition")}
              className="grid h-9 w-9 place-items-center border border-white/14 bg-white/[0.04] text-[14px] text-white/58 transition hover:border-white/36 hover:text-white"
              aria-label="Previous mobile frame"
            >
              &larr;
            </button>
            <button
              type="button"
              onClick={() => selectFrame(activeIndex + 1, "transition")}
              className="grid h-9 w-9 place-items-center border border-white/14 bg-white/[0.04] text-[14px] text-white/58 transition hover:border-white/36 hover:text-white"
              aria-label="Next mobile frame"
            >
              &rarr;
            </button>
          </div>
        </div>

        <div className="relative z-10 mt-4 overflow-hidden border-y border-white/[0.08] bg-black/18">
          <motion.div
            className="relative h-[41rem] cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing max-[390px]:h-[38.5rem] md:h-[43rem]"
            drag={!reduceMotion ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            dragMomentum={false}
            onDragStart={(_, info) => {
              dragStartRef.current = info.point.x;
            }}
            onDragEnd={(_, info) => {
              const start = dragStartRef.current ?? info.point.x;
              const delta = info.point.x - start;
              dragStartRef.current = null;
              if (Math.abs(delta) < 42) return;
              selectFrame(activeIndex + (delta < 0 ? 1 : -1), "transition");
            }}
          >
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[90] h-28 bg-[linear-gradient(180deg,transparent,#070806_78%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 z-[90] h-12 bg-[linear-gradient(180deg,#070806,transparent)]" />
            {frames.map((frame, index) => {
              const offset = circularOffset(index);
              const active = offset === 0;
              const depth = Math.abs(offset);
              const visible = depth <= 1.45;

              return (
                <motion.button
                  key={`${frame.src}-mobile-orbit`}
                  type="button"
                  onClick={() => {
                    if (active) {
                      sound.playRole("select");
                      onOpenFrame(frame.src);
                    } else {
                      selectFrame(index, "transition");
                    }
                  }}
                  onMouseEnter={() => sound.playRole("hover")}
                  className="group absolute left-1/2 top-6 w-[min(68vw,17.5rem)] text-left outline-none focus-visible:ring-2 focus-visible:ring-[#f4efe4]/80 md:w-[min(30vw,19rem)]"
                  style={{
                    pointerEvents: visible ? "auto" : "none",
                    zIndex: active ? 80 : 12 - depth,
                  }}
                  initial={false}
                  animate={{
                    opacity: visible ? (active ? 1 : 0.22) : 0,
                    x: `calc(-50% + ${offset * 78}%)`,
                    y: active ? 0 : 34,
                    rotateZ: active ? 0 : offset * -4,
                    scale: active ? 1 : 0.82,
                  }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.58, ease }}
                  aria-label={active ? `Open ${frame.label}` : `Focus ${frame.label}`}
                  aria-pressed={active}
                >
                  <WhisperPhoneFrame frame={frame} active={active} />
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <div className="relative z-10 mx-7 mt-4 border border-white/12 bg-black/34 p-4 shadow-[0_26px_90px_rgba(0,0,0,0.28)] md:mx-0 md:grid md:grid-cols-[1fr_auto] md:items-end md:gap-6 md:p-5">
          <div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-[9px] uppercase tracking-[0.18em] text-white/34">
                {formatIndex(activeIndex + 1)} / {activeFrame.label}
              </div>
              <div className="flex items-center gap-1.5">
                {frames.map((frame, index) => (
                  <button
                    key={`${frame.src}-mobile-orbit-dot`}
                    type="button"
                    onClick={() => selectFrame(index, "transition")}
                    className={cx(
                      "h-1.5 transition",
                      index === activeIndex ? "w-8 bg-[#f4efe4]" : "w-2 bg-white/22 hover:bg-white/48",
                    )}
                    aria-label={`Focus mobile frame ${formatIndex(index + 1)}`}
                    aria-pressed={index === activeIndex}
                  />
                ))}
              </div>
            </div>
            <h3 className="mt-4 text-[24px] font-semibold leading-tight tracking-normal text-white md:text-[30px]">
              {activeFrame.label}
            </h3>
            <p className="mt-3 max-w-[42rem] text-[14px] leading-7 text-white/58">{activeFrame.caption}</p>
          </div>
          <button
            type="button"
            onClick={() => onOpenFrame(activeFrame.src)}
            className="mt-5 flex w-full items-center justify-between gap-5 border border-[#f4efe4]/72 bg-[#f4efe4] px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-950 shadow-[0_18px_70px_rgba(244,239,228,0.11)] transition hover:bg-white md:mt-0 md:w-auto md:min-w-[12rem]"
          >
            <span>Inspect frame</span>
            <span className="text-neutral-950/42">{formatIndex(activeIndex + 1)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function VideoModal({ video, onClose }: { video: VideoProof | null; onClose: () => void }) {
  const sound = useSound();
  const reduceMotion = useReducedMotion();

  const close = useCallback(() => {
    sound.playRole("close");
    onClose();
  }, [onClose, sound]);

  useEffect(() => {
    if (!video) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [close, video]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {video ? (
        <motion.div
          data-video-terminal="true"
          className="fixed inset-0 z-[999] overflow-hidden bg-[#030303] text-[#f7f1e8]"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.012, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.992, filter: "blur(5px)" }}
          transition={{ duration: 0.54, ease }}
        >
          <button
            type="button"
            aria-label="Close video proof"
            className="absolute inset-0 cursor-default"
            onClick={close}
          />

          {video.poster ? (
            <motion.img
              src={video.poster}
              alt=""
              className="pointer-events-none absolute inset-[-8%] h-[116%] w-[116%] object-cover opacity-18 blur-2xl saturate-[0.86]"
              initial={reduceMotion ? { opacity: 0.16 } : { opacity: 0, scale: 1.08, filter: "blur(34px)" }}
              animate={{ opacity: 0.18, scale: 1, filter: "blur(28px)" }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(36px)" }}
              transition={{ duration: 0.82, ease }}
            />
          ) : null}

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(246,239,225,0.15),transparent_34%),linear-gradient(180deg,rgba(12,16,16,0.2),rgba(0,0,0,0.95)_68%)]" />
          <div className="pointer-events-none absolute left-[8vw] top-[67vh] h-px w-[84vw] rotate-[5deg] bg-gradient-to-r from-transparent via-white/18 to-transparent" />
          <div className="pointer-events-none absolute left-1/2 top-[12%] h-[62vw] max-h-[48rem] w-[62vw] max-w-[48rem] -translate-x-1/2 rounded-full border border-white/[0.075]" />

          <div className="relative z-[1000] grid h-dvh grid-rows-[auto_minmax(0,1fr)_auto] px-4 py-4 sm:px-6 sm:py-6">
            <header className="pointer-events-none mx-auto flex w-full max-w-[1760px] items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.22em] text-white/38">WHISPER video terminal</div>
                <h2 className="mt-2 truncate text-2xl font-semibold tracking-normal text-white md:text-4xl">{video.title}</h2>
              </div>
              <button
                type="button"
                onClick={close}
                onMouseEnter={() => sound.playRole("hover")}
                className="pointer-events-auto shrink-0 border border-white/16 bg-white/8 px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-white/72 backdrop-blur transition hover:bg-[#f7f1e8] hover:text-neutral-950"
              >
                Close x
              </button>
            </header>

            <main className="grid min-h-0 place-items-center py-4 md:py-6">
              <motion.div
                className="relative w-full max-w-[min(92vw,1720px)]"
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 26, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 14, scale: 0.99 }}
                transition={{ duration: 0.62, ease }}
              >
                <video
                  key={video.src}
                  className="block max-h-[78dvh] min-h-[320px] w-full bg-black object-contain shadow-[0_34px_180px_rgba(0,0,0,0.76)]"
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  poster={video.poster}
                >
                  <source src={video.src} type="video/mp4" />
                </video>

                <div className="pointer-events-none absolute left-4 top-12 md:left-6 md:top-16">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/36">signal source</div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.16em] text-white/78">{video.label}</div>
                </div>
              </motion.div>
            </main>

            <footer className="pointer-events-none mx-auto flex w-full max-w-[1760px] flex-wrap items-end justify-between gap-4">
              <TypedSignalText
                text={video.caption ?? "Cinematic playback environment is active."}
                dark
                className="max-w-[46rem] text-[10px] uppercase leading-5 tracking-[0.16em] text-white/52"
              />
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/36">source active / esc to close</span>
            </footer>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

export default function WhisperCaseLayout({ item, onOpenProject, copy = whisperCaseI18n.en }: WhisperCaseLayoutProps) {
  const navigate = useNavigate();
  const sound = useSound();
  const reduceMotion = useReducedMotion();
  const isSpanish = copy === whisperCaseI18n.es;
  const atlasCopy = {
    eyebrow: isSpanish ? "Atlas espacial" : "Spatial atlas",
    title: isSpanish ? "Cuatro superficies, un sistema de prueba." : "Four surfaces, one proof system.",
    description: isSpanish
      ? "WHISPER conecta sitio web, Quest, coleccionista y mobile en un patrón de referencia inspeccionable para futuros casos inmersivos."
      : "WHISPER connects website, Quest, collector, and mobile into one inspectable reference pattern for future Immersive cases.",
  };
  const webCopy = {
    eyebrow: isSpanish ? "Exhibición web" : "Web exhibition",
    title: isSpanish ? "Sitio en vivo, primera sala." : "Live site, first room.",
    description: isSpanish
      ? "Una ruta desktop en vivo sostiene hero, series, lógica de impresión, AR preview y notas antes de XR."
      : "A live desktop route carries hero, series, print logic, AR preview, and notes before XR.",
  };
  const xrCopy = {
    eyebrow: isSpanish ? "Prueba XR" : "XR proof",
    title: isSpanish ? "La prueba Quest se convierte en sala." : "Quest proof becomes a room.",
    description: isSpanish
      ? "La captura real en headset prueba que el sistema funciona a escala de sala: planos de imagen, navegación con manos y pacing espacial silencioso."
      : "Real headset capture proves the system works at room scale: image planes, hand navigation, and quiet spatial pacing.",
  };
  const milestoneCopy = {
    eyebrow: isSpanish ? "Hito actual" : "Current milestone",
    title: isSpanish
      ? "La V1 avanzada está en vivo en sitio, Quest, mobile, print y AR."
      : "Advanced V1 is live across site, Quest, mobile, print, and AR.",
    tags: isSpanish ? ["Sitio público", "Prueba XR", "Mobile", "Print / AR"] : ["Public site", "XR proof", "Mobile", "Print / AR"],
    openLive: isSpanish ? "Abrir sitio" : "Open live site",
    restart: isSpanish ? "Reiniciar" : "Restart",
    rulesEyebrow: isSpanish ? "Reglas operativas" : "Operating rules",
    rulesSummary: isSpanish
      ? "Controles silenciosos, una gramática visual común e inspección cinematográfica mantienen el caso reutilizable sin convertirlo en plantilla."
      : "Quiet controls, one visual grammar, and cinematic inspect keep the case reusable without turning it into a template.",
  };
  const resolvedInteractionRules = isSpanish
    ? [
        {
          title: "Presencia antes que interfaz",
          text:
            "Navegación, hover states y controles de prueba se mantienen silenciosos para que la obra tenga prioridad sobre la UI.",
        },
        {
          title: "Un sistema entre superficies",
          text:
            "Sitio, headset, mobile, print detail y AR preview usan la misma gramática visual en lugar de fragmentos separados.",
        },
        {
          title: "Inspeccionar como modo espacial",
          text:
            "Los screenshots se abren con un reveal cinematográfico, convirtiendo la revisión de evidencia en parte del lenguaje inmersivo.",
        },
      ]
    : interactionRules;
  const resolvedProofLayers = isSpanish
    ? [
        {
          id: "web" as const,
          index: "01",
          title: "Exhibición web cinematográfica",
          signal: "superficie pública",
          text:
            "El sitio web es la primera sala: pacing editorial, navegación por series, lógica de impresión e intención de coleccionista antes de entrar en XR.",
        },
        {
          id: "xr" as const,
          index: "02",
          title: "Prueba espacial en Quest",
          signal: "capa room-scale",
          text:
            "La captura en headset prueba que el sistema puede salir de la página y mantener el mismo ritmo museístico silencioso.",
        },
        {
          id: "collector" as const,
          index: "03",
          title: "Print, AR y continuación de edición",
          signal: "handoff de objeto",
          text:
            "La exhibición digital vuelve a la obra mediante detalle de edición, AR preview, notas y continuación orientada al coleccionista.",
        },
        {
          id: "mobile" as const,
          index: "04",
          title: "Ruta expositiva mobile",
          signal: "prueba small-screen",
          text:
            "Mobile conserva la atmósfera mientras comprime navegación, páginas de serie, detalle de print y entrada AR en un recorrido directo.",
        },
      ]
    : proofLayers;
  const rawFrames = useMemo(() => item.frames ?? [], [item.frames]);
  const rawVideos = useMemo(() => item.videos ?? [], [item.videos]);

  const webFrames = useMemo(
    () =>
      rawFrames
        .filter((frame) => frame.device === "desktop")
        .map((frame, index) => enrichFrame(frame, copy.frames.web[index])),
    [copy.frames.web, rawFrames],
  );

  const vrFrames = useMemo(
    () =>
      rawFrames
        .filter((frame) => frame.device === "vr")
        .map((frame, index) => enrichFrame(frame, copy.frames.vr[index])),
    [copy.frames.vr, rawFrames],
  );

  const mobileFrames = useMemo(
    () =>
      rawFrames
        .filter((frame) => frame.device === "mobile")
        .map((frame, index) => enrichFrame(frame, copy.frames.mobile[index])),
    [copy.frames.mobile, rawFrames],
  );

  const openingFrame = webFrames[0] ?? null;
  const desktopVideoData = rawVideos.find((video) => video.device === "desktop");
  const questVideoData = rawVideos.find((video) => video.device === "vr");

  const desktopVideo: VideoProof = {
    title: isSpanish ? "Ruta de captura en vivo" : "Live capture route",
    label: isSpanish ? "Navegación del sitio" : "Website navigation",
    src: desktopVideoData?.src ?? WHISPER_DESKTOP_VIDEO,
    poster: desktopVideoData?.poster ?? webFrames[8]?.src ?? openingFrame?.src,
    caption: isSpanish ? "Hero / series / print / AR / notas." : "Hero / series / print / AR / notes.",
  };

  const questVideo: VideoProof = {
    title: isSpanish ? "Captura a escala de sala" : "Room-scale capture",
    label: isSpanish ? "Prueba Meta Quest 3" : "Meta Quest 3 proof",
    src: questVideoData?.src ?? WHISPER_VR_VIDEO,
    poster: questVideoData?.poster ?? vrFrames[0]?.src,
    caption: isSpanish
      ? "Planos de imagen, navegación con manos y ritmo de sala se mantienen legibles dentro del headset."
      : "Image planes, hand navigation, and room rhythm stay readable inside the headset.",
  };

  const inspectFrames = useMemo<CaseStoryMedia[]>(
    () => [
      ...webFrames.map((frame, index) => toInspectFrame(frame, index, index === 0 ? "hero" : index >= 7 ? "detail" : "flow")),
      ...vrFrames.map((frame, index) => toInspectFrame(frame, index, "proof")),
      ...mobileFrames.map((frame, index) => toInspectFrame(frame, index, "mobile")),
    ],
    [mobileFrames, vrFrames, webFrames],
  );

  const chamberEngines = useMemo(() => getChamberEngines("whisper"), []);
  const stackItems = useMemo(
    () => item.stack.split(",").map((entry) => entry.trim()).filter(Boolean),
    [item.stack],
  );

  const activeSection = useSectionRailActive(railItems, "whisper-threshold");
  const [activeLayer, setActiveLayer] = useState<LayerId>("web");
  const [inspectIndex, setInspectIndex] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoProof | null>(null);

  const openInspectBySrc = useCallback(
    (src: string) => {
      const nextIndex = inspectFrames.findIndex((frame) => frame.src === src);
      if (nextIndex < 0) return;
      sound.playRole("select");
      setInspectIndex(nextIndex);
    },
    [inspectFrames, setInspectIndex, sound],
  );

  const openVideo = useCallback(
    (video: VideoProof) => {
      sound.playRole("select");
      setActiveVideo(video);
    },
    [setActiveVideo, sound],
  );

  const scrollToSection = useCallback(
    (id: string) => {
      sound.playRole("transition");
      const section = document.getElementById(id);
      if (!section) return;

      const top = Math.max(0, section.getBoundingClientRect().top + window.scrollY - 76);
      window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
    },
    [reduceMotion, sound],
  );

  const openImmersiveIndex = useCallback(() => {
    sound.playRole("close");
    startSpaPageTransition(navigate, "/immersive");
  }, [navigate, sound]);

  useEffect(() => {
    sound.setScene("immersive", "whisper-case");
    sound.setAmbientSceneLevel("whisper-case");
    void sound.startSceneAmbient("immersive", "whisper-case");

    return () => {
      sound.setScene("portfolio", null);
    };
  }, [sound]);

  return (
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden overflow-x-hidden bg-[#050505] text-[#f4efe4]">
      <SectionRail
        items={railItems}
        activeId={activeSection}
        onSelect={scrollToSection}
        label="WHISPER sections"
        tone={darkRailSections.has(activeSection) ? "dark" : "light"}
      />

      <Chapter id="threshold" soundSafeArea className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-72 saturate-[1.04] contrast-[1.05]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={openingFrame?.src}
        >
          <source src={WHISPER_HERO_VIDEO} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_40%,rgba(255,255,255,0.12),transparent_28%),linear-gradient(90deg,rgba(0,0,0,0.92),rgba(0,0,0,0.42)_50%,rgba(0,0,0,0.82))]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:84px_84px]" />
        <div className="pointer-events-none absolute left-[45%] top-[13%] h-[66vw] max-h-[760px] w-[66vw] max-w-[760px] -translate-x-1/2 rounded-full border border-white/12" />
        <div className="pointer-events-none absolute left-[8%] top-[64%] h-px w-[86%] rotate-[7deg] bg-gradient-to-r from-transparent via-white/22 to-transparent" />

        <div className="absolute left-4 right-4 top-28 z-20 mx-auto hidden w-[min(92vw,1680px)] flex-wrap items-center justify-between gap-3 md:left-8 md:right-8 md:top-7 md:flex">
          <button
            type="button"
            onClick={openImmersiveIndex}
            className="border border-white/16 bg-black/24 px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] text-white/64 backdrop-blur transition hover:border-white/34 hover:text-white"
          >
            {copy.top.backToImmersive}
          </button>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <span className="border border-white/14 bg-black/20 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white/46 backdrop-blur">
              {item.year}
            </span>
            <span className="border border-[#f4efe4]/24 bg-[#f4efe4]/10 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[#f4efe4]/72 backdrop-blur">
              {item.status}
            </span>
          </div>
        </div>

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] w-[min(92vw,1680px)] gap-10 px-4 pb-14 pt-24 max-[640px]:w-full max-[640px]:gap-6 max-[640px]:px-7 max-[640px]:pb-12 max-[640px]:pt-12 md:px-8 lg:grid-cols-[0.45fr_0.55fr] lg:items-end lg:pt-28">
          <div className="max-w-[46rem] pb-2 max-[640px]:max-w-full">
            <div className="mb-7 flex flex-wrap gap-2 max-[640px]:mb-5">
              {[item.supportLabel ?? "Flagship immersive", item.status].map((label) => (
                <span key={label} className="hidden border border-white/16 bg-white/8 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white/58 backdrop-blur md:inline-flex">
                  {label}
                </span>
              ))}
              <span className="border border-white/16 bg-white/8 px-3 py-2 text-[9px] uppercase tracking-[0.15em] text-white/58 backdrop-blur md:hidden">
                {copy.top.status}
              </span>
            </div>

            <h1 className="max-w-[8ch] text-[76px] font-semibold leading-[0.86] tracking-normal text-white max-[420px]:text-[58px] sm:text-[104px] xl:text-[144px]">
              WHISPER
            </h1>
            <p className="mt-8 max-w-[42rem] text-[21px] leading-[1.55] text-white/78 max-[640px]:mt-5 max-[640px]:max-w-[20rem] max-[420px]:text-[19px] md:text-[28px]">
              {item.tagline}
            </p>
            <p className="mt-6 max-w-[40rem] text-base leading-8 text-white/56 max-[640px]:hidden">
              {item.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3 max-[640px]:mt-6 max-[640px]:grid max-[640px]:max-w-[21rem] max-[640px]:grid-cols-2 max-[640px]:gap-0">
              <a
                href={WHISPER_LIVE_URL}
                target="_blank"
                rel="noreferrer"
                className="border border-[#f4efe4] bg-[#f4efe4] px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-950 transition hover:bg-white max-[640px]:min-h-12 max-[640px]:px-3 max-[640px]:text-[10px]"
              >
                {copy.links.live}
              </a>
              <a
                href={WHISPER_REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="border border-white/18 bg-white/8 px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white/72 transition hover:border-white/42 hover:text-white max-[640px]:min-h-12 max-[640px]:px-3 max-[640px]:text-[10px]"
              >
                {copy.links.repo}
              </a>
              {openingFrame ? (
                <button
                  type="button"
                  onClick={() => openInspectBySrc(openingFrame.src)}
                  className="hidden border border-white/18 bg-black/16 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/72 transition hover:border-white/42 hover:text-white md:inline-flex"
                >
                  {isSpanish ? "Inspeccionar hero" : "Inspect hero"}
                </button>
              ) : null}
            </div>
          </div>

          <div className="relative min-h-[520px] max-[640px]:-mx-7 max-[640px]:mt-0 max-[640px]:min-h-[590px] lg:min-h-[660px]">
            <div className="pointer-events-none absolute inset-[7%] border border-white/8" />
            <div className="pointer-events-none absolute left-[16%] top-[18%] h-[31rem] w-[31rem] rounded-full border border-white/8" />

            <div className="absolute left-[11%] right-[9%] top-[18%] -rotate-[1.2deg] border border-white/16 bg-white/[0.035] p-2 shadow-[0_46px_180px_rgba(0,0,0,0.5)] max-[640px]:left-[4%] max-[640px]:right-[4%] max-[640px]:top-[7%] max-[640px]:p-1.5">
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                <video
                  className="h-full w-full object-contain"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={desktopVideo.poster}
                >
                  <source src={WHISPER_HOME_VIDEO} type="video/mp4" />
                </video>
                <div className="absolute left-4 top-4 border border-white/18 bg-black/42 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white/64 backdrop-blur max-[640px]:left-3 max-[640px]:top-3 max-[640px]:px-2.5 max-[640px]:py-1.5 max-[640px]:text-[9px]">
                  {isSpanish ? "Señal 01 / website" : "Signal 01 / website"}
                </div>
              </div>
            </div>

            {vrFrames[0] ? (
              <button
                type="button"
                onClick={() => openInspectBySrc(vrFrames[0].src)}
                className="absolute right-[5%] top-[8%] w-[29%] max-w-[340px] rotate-[2deg] border border-white/14 bg-black/48 p-2 opacity-[0.92] shadow-[0_36px_120px_rgba(0,0,0,0.52)] backdrop-blur transition hover:border-white/36 hover:opacity-100 max-[640px]:right-[4%] max-[640px]:top-[0%] max-[640px]:w-[31%] max-[640px]:p-1.5"
              >
                <div className="aspect-[4/3] overflow-hidden bg-black">
                  <img src={vrFrames[0].src} alt={vrFrames[0].alt ?? ""} className="h-full w-full object-contain" />
                </div>
                <div className="mt-2 text-left text-[9px] uppercase tracking-[0.16em] text-white/48 max-[640px]:mt-1.5 max-[640px]:text-[8px]">
                  {isSpanish ? "Prueba Quest" : "Quest proof"}
                </div>
              </button>
            ) : null}

            {mobileFrames[0] ? (
              <button
                type="button"
                onClick={() => openInspectBySrc(mobileFrames[0].src)}
                className="absolute bottom-[8%] left-[8%] w-[18%] min-w-[112px] -rotate-[2deg] border border-white/14 bg-black/50 p-2 shadow-[0_36px_120px_rgba(0,0,0,0.48)] backdrop-blur transition hover:border-white/36 max-[640px]:bottom-[6%] max-[640px]:left-[11%] max-[640px]:w-[30%] max-[640px]:min-w-[128px] max-[640px]:p-1.5"
              >
                <div className="aspect-[9/16] overflow-hidden bg-black">
                  <img src={mobileFrames[0].src} alt={mobileFrames[0].alt ?? ""} className="h-full w-full object-contain" />
                </div>
                <div className="mt-2 text-left text-[9px] uppercase tracking-[0.16em] text-white/48 max-[640px]:mt-1.5 max-[640px]:text-[8px]">
                  {isSpanish ? "Ruta mobile" : "Mobile route"}
                </div>
              </button>
            ) : null}

            <div className="absolute bottom-[6%] left-[31%] right-[8%] hidden grid-cols-5 border border-white/12 bg-black/46 text-white shadow-[0_22px_90px_rgba(0,0,0,0.3)] backdrop-blur 2xl:grid">
              {flagshipSignals.map((signal) => (
                <div key={signal} className="border-r border-white/10 px-3 py-3 text-[10px] uppercase tracking-[0.15em] text-white/52 last:border-r-0">
                  {signal}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Chapter>

      <Chapter id="atlas" soundSafeArea className="bg-[#f2eee4] px-7 pb-20 pt-28 text-neutral-950 md:px-8 md:py-24 lg:py-32">
        <div className="mx-auto grid w-full gap-14 md:w-[min(92vw,1640px)] lg:grid-cols-[0.42fr_0.58fr] lg:gap-16">
          <div>
            <SectionLabel index="02" label={atlasCopy.eyebrow} />
            <KineticTitle
              text={atlasCopy.title}
              className="mt-8 max-w-[10ch] text-[44px] font-semibold leading-[0.92] tracking-normal sm:text-[78px] xl:text-[104px]"
            />
            <p className="mt-7 max-w-[42rem] text-[16px] leading-8 text-neutral-600 sm:mt-8 sm:text-[17px]">
              {atlasCopy.description}
            </p>
            <div className="mt-9 hidden flex-wrap gap-2 md:flex">
              {resolvedProofLayers.map((layer) => (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => {
                    sound.playRole("select");
                    setActiveLayer(layer.id);
                  }}
                  className={cx(
                    "border px-3 py-2 text-[10px] uppercase tracking-[0.15em] transition",
                    activeLayer === layer.id
                      ? "border-neutral-950 bg-neutral-950 text-[#f2eee4]"
                      : "border-neutral-950/12 bg-white/42 text-neutral-500 hover:border-neutral-950/28 hover:text-neutral-950",
                  )}
                >
                  {layer.signal}
                </button>
              ))}
            </div>
          </div>

          <SpatialAtlasMap
            activeLayer={activeLayer}
            onSelectLayer={setActiveLayer}
            layers={resolvedProofLayers}
            previewFrames={{
              web: openingFrame ?? webFrames[1] ?? null,
              xr: vrFrames[0] ?? null,
              collector: webFrames[8] ?? webFrames[7] ?? null,
              mobile: mobileFrames[0] ?? null,
            }}
          />
        </div>
      </Chapter>

      <Chapter id="web" soundSafeArea className="bg-[#f2eee4] px-7 pb-0 pt-24 text-neutral-950 md:px-8 md:pt-0">
        <div className="mx-auto w-full md:w-[min(92vw,1640px)] xl:pr-36">
          <div className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-end">
            <div>
              <SectionLabel index="03" label={webCopy.eyebrow} />
              <KineticTitle
                text={webCopy.title}
                className="mt-8 max-w-[9ch] text-[44px] font-semibold leading-[0.92] tracking-normal sm:text-[78px] xl:text-[104px]"
              />
            </div>
            <p className="max-w-[48rem] text-[16px] leading-8 text-neutral-600 sm:text-[17px]">
              {webCopy.description}
            </p>
          </div>

          <div className="mt-10 md:mt-14">
            <VideoSurface video={desktopVideo} tone="paper" mobileBleed onOpen={() => openVideo(desktopVideo)} />
          </div>

          <SpatialEvidenceField
            frames={webFrames.slice(1)}
            startIndex={1}
            onOpenFrame={openInspectBySrc}
          />
        </div>
      </Chapter>

      <Chapter id="xr" soundSafeArea className="relative overflow-hidden bg-[#070807] px-7 pb-20 pt-28 text-white md:px-8 md:py-24 lg:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_64%_28%,rgba(105,127,98,0.24),transparent_28%),linear-gradient(180deg,rgba(6,7,6,0.94),transparent_20%,rgba(255,255,255,0.04)_34%,transparent_52%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:86px_86px]" />

        <div className="relative mx-auto grid w-full gap-12 md:w-[min(92vw,1640px)] lg:grid-cols-[0.38fr_0.62fr] lg:gap-14 xl:pr-36">
          <div>
            <SectionLabel index="04" label={xrCopy.eyebrow} dark />
            <KineticTitle
              text={xrCopy.title}
              className="mt-8 max-w-[10ch] text-[44px] font-semibold leading-[0.94] tracking-normal text-white sm:text-[74px] xl:text-[96px]"
            />
            <p className="mt-8 max-w-[40rem] text-[16px] leading-8 text-white/60">
              {xrCopy.description}
            </p>
          </div>

          <div className="grid gap-10">
            <VideoSurface video={questVideo} tone="dark" mobileBleed onOpen={() => openVideo(questVideo)} />

            <QuestProofOrbit frames={vrFrames} onOpenFrame={openInspectBySrc} />

            <div className="hidden gap-8 md:grid md:grid-cols-3">
              {vrFrames.map((frame, index) => (
                <FramePlate
                  key={frame.src}
                  frame={frame}
                  index={index}
                  tone="dark"
                  variant="compact"
                  onOpen={() => openInspectBySrc(frame.src)}
                />
              ))}
            </div>
          </div>
        </div>
      </Chapter>

      <Chapter id="collector" soundSafeArea className="bg-[#ebe6dc] px-7 pb-20 pt-24 text-neutral-950 md:px-8 md:py-24 lg:py-32">
        <div className="mx-auto w-full md:w-[min(92vw,1640px)]">
          <div className="grid gap-10 lg:grid-cols-[0.48fr_0.52fr] lg:items-end">
            <div>
              <SectionLabel index="05" label="Collector handoff" />
              <KineticTitle
                text="From room to object."
                className="mt-8 max-w-[9ch] text-[44px] font-semibold leading-[0.92] tracking-normal sm:text-[78px] xl:text-[104px]"
              />
            </div>
            <div className="max-w-[48rem]">
              <p className="text-[16px] leading-8 text-neutral-600 sm:text-[17px]">
                After XR, WHISPER lands in edition detail, framed preview, and purchase intent.
              </p>
            </div>
          </div>

          <CollectorChamber frames={webFrames.slice(7, 10)} onOpenFrame={openInspectBySrc} />
        </div>
      </Chapter>

      <Chapter id="mobile" soundSafeArea className="relative overflow-hidden bg-[#070806] px-7 pb-20 pt-28 text-white md:px-8 md:py-24 lg:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(235,230,220,0.08),transparent_24%),radial-gradient(circle_at_22%_24%,rgba(241,234,214,0.12),transparent_28%)]" />
        <div className="relative mx-auto w-full md:w-[min(92vw,1500px)]">
          <div className="grid gap-10 lg:grid-cols-[0.45fr_0.55fr] lg:items-end">
            <div>
              <SectionLabel index="06" label="Mobile proof" dark />
              <KineticTitle
                text="The phone carries the room."
                className="mt-8 max-w-[10ch] text-[44px] font-semibold leading-[0.92] tracking-normal text-white sm:text-[78px] xl:text-[104px]"
              />
            </div>
            <p className="max-w-[46rem] text-[16px] leading-8 text-white/58 sm:text-[17px]">
              Six mobile states keep WHISPER cinematic across landing, series, menu, work detail, and print / AR continuation.
            </p>
          </div>

          <CinematicMobileField frames={mobileFrames} onOpenFrame={openInspectBySrc} />
        </div>
      </Chapter>

      <Chapter id="engine" soundSafeArea footerRailState="closing" className="relative overflow-hidden bg-[#050505] px-7 pb-16 pt-24 text-white md:px-8 md:py-24 lg:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_22%,rgba(222,210,179,0.14),transparent_26%),radial-gradient(circle_at_78%_42%,rgba(77,104,94,0.2),transparent_26%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.065] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:86px_86px]" />
        <div className="pointer-events-none absolute left-[12%] top-[15%] h-[26rem] w-[26rem] rounded-full border border-white/[0.055]" />
        <div className="relative mx-auto grid w-full gap-9 md:w-[min(92vw,1640px)] lg:grid-cols-[0.38fr_0.62fr] lg:gap-16">
          <div>
            <SectionLabel index="07" label="Engine ledger" dark />
            <KineticTitle
              text="WHISPER becomes the canon."
              className="mt-8 max-w-[10ch] text-[42px] font-semibold leading-[0.94] tracking-normal text-white sm:text-[74px] xl:text-[96px]"
            />
            <p className="mt-7 max-w-[38rem] text-[16px] leading-8 text-white/58">
              Future Immersive cases inherit one route: threshold, atlas, proof media, surface chapters, inspect reveal, and handoff.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {stackItems.slice(0, 5).map((entry) => (
                <span key={entry} className="border border-white/12 bg-white/[0.04] px-2.5 py-2 text-[9px] uppercase tracking-[0.14em] text-white/52 sm:px-3 sm:text-[10px]">
                  {entry}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="border-y border-white/12 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[9px] uppercase tracking-[0.18em] text-white/32">Canon pattern</div>
                  <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/68">System primitives</div>
                </div>
                <div className="h-2 w-2 rounded-full bg-[#f4efe4] shadow-[0_0_28px_rgba(244,239,228,0.2)]" />
              </div>
            </div>

            <div className="grid gap-0 border border-white/12 bg-white/[0.025] md:hidden">
              {chamberEngines.map((engine, index) => (
                <article key={`${engine.id}-mobile`} className="grid gap-2 border-b border-white/10 p-4 last:border-b-0">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[9px] uppercase tracking-[0.18em] text-white/32">{formatIndex(index + 1)}</span>
                    <span className="text-[9px] uppercase tracking-[0.16em] text-white/34">{engine.signal}</span>
                  </div>
                  <h3 className="text-[19px] font-semibold leading-tight tracking-normal text-white">{engine.title}</h3>
                  <p className="text-[12px] leading-5 text-white/50">{engine.summary}</p>
                </article>
              ))}
            </div>

            <div className="hidden gap-2 md:grid md:grid-cols-2">
              {chamberEngines.map((engine, index) => (
                <article key={engine.id} className="border border-white/12 bg-white/[0.035] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[9px] uppercase tracking-[0.18em] text-white/34">{formatIndex(index + 1)}</span>
                    <span className="text-[9px] uppercase tracking-[0.16em] text-white/36">{engine.signal}</span>
                  </div>
                  <h3 className="mt-5 text-[21px] font-semibold leading-tight tracking-normal text-white md:text-[24px]">{engine.title}</h3>
                  <p className="mt-3 text-[13px] leading-6 text-white/52">{engine.summary}</p>
                </article>
              ))}
            </div>

            <div className="border-y border-white/12 py-4 md:hidden">
              <div className="text-[9px] uppercase tracking-[0.18em] text-white/32">{milestoneCopy.rulesEyebrow}</div>
              <div className="mt-3 grid gap-0">
                {resolvedInteractionRules.map((rule, index) => (
                  <div key={`${rule.title}-mobile`} className="flex items-center justify-between gap-4 border-b border-white/10 py-3 last:border-b-0">
                    <span className="text-[9px] uppercase tracking-[0.18em] text-white/30">{formatIndex(index + 1)}</span>
                    <span className="max-w-[16rem] text-right text-[16px] font-semibold leading-tight tracking-normal text-white">{rule.title}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[12px] leading-5 text-white/50">
                {milestoneCopy.rulesSummary}
              </p>
            </div>

            <div className="hidden gap-0 border-y border-white/12 md:grid">
              {resolvedInteractionRules.map((rule, index) => (
                <article key={rule.title} className="grid gap-2 border-b border-white/10 py-3.5 last:border-b-0 md:grid-cols-[3rem_0.44fr_1fr] md:items-start md:gap-3 md:py-4">
                  <div className="text-[9px] uppercase tracking-[0.18em] text-white/30">{formatIndex(index + 1)}</div>
                  <h3 className="text-[18px] font-semibold leading-tight tracking-normal text-white md:text-[20px]">{rule.title}</h3>
                  <p className="text-[12px] leading-5 text-white/52 md:text-sm md:leading-7">{rule.text}</p>
                </article>
              ))}
            </div>

            <div className="relative overflow-hidden border border-white/14 bg-white/[0.035] p-4 md:grid md:grid-cols-[0.62fr_0.38fr] md:items-end md:gap-8 md:p-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_34%,rgba(244,239,228,0.12),transparent_28%),linear-gradient(90deg,rgba(244,239,228,0.05),transparent_52%)]" />
              <div className="relative">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#f4efe4]/42">{milestoneCopy.eyebrow}</div>
                <p className="mt-4 text-[22px] font-semibold leading-tight tracking-normal text-white md:text-[32px]">
                  {milestoneCopy.title}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {milestoneCopy.tags.map((item) => (
                    <span key={item} className="border border-white/10 bg-black/22 px-2.5 py-2 text-[9px] uppercase tracking-[0.14em] text-white/42 sm:px-3 sm:text-[10px]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative mt-6 grid gap-3 sm:grid-cols-2 md:mt-0 md:flex md:flex-wrap md:justify-end">
                <a
                  href={WHISPER_LIVE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-[#f4efe4] bg-[#f4efe4] px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-950 transition hover:bg-white"
                >
                  {milestoneCopy.openLive}
                </a>
                <button
                  type="button"
                  onClick={() => scrollToSection("whisper-threshold")}
                  className="border border-white/16 bg-black/22 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/66 transition hover:border-white/40 hover:text-white"
                >
                  {milestoneCopy.restart}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Chapter>

      <SiteFooterV2 onOpenProject={onOpenProject} variant="immersiveCase" />

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      <CinematicInspectReveal
        frames={inspectFrames}
        index={inspectIndex}
        onClose={() => setInspectIndex(null)}
        onSelect={setInspectIndex}
      />
    </div>
  );
}
