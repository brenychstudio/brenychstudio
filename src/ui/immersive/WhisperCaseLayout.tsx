import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import type { CaseFrame } from "../../data/cases";
import type { CaseStoryMedia } from "../../data/caseStories";
import type { ImmersiveItem, ImmersiveMedia } from "../../data/immersive";
import { getChamberEngines } from "../../data/immersiveSystems";
import { whisperCaseI18n } from "../../data/whisperCaseI18n";
import { useSound } from "../../stage/audio/useSound";
import { startSpaPageTransition } from "../pageTransition";
import CaseMobileShowcase from "../work/CaseMobileShowcase";
import CinematicInspectReveal from "../work/CinematicInspectReveal";

type WhisperCaseLayoutProps = {
  item: ImmersiveItem;
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

const railItems: Array<{ id: SectionId; index: string; label: string }> = [
  { id: "threshold", index: "01", label: "Threshold" },
  { id: "atlas", index: "02", label: "Atlas" },
  { id: "web", index: "03", label: "Web" },
  { id: "xr", index: "04", label: "Quest" },
  { id: "collector", index: "05", label: "Collector" },
  { id: "mobile", index: "06", label: "Mobile" },
  { id: "engine", index: "07", label: "Engine" },
];

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

function toMobileShowcaseFrames(frames: ImmersiveMedia[]): CaseFrame[] {
  return frames.map((frame) => ({
    kind: "image",
    device: "mobile",
    aspect: "phone",
    src: frame.src,
    alt: frame.alt,
    caption: frame.caption,
  }));
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
    <div className={cx("flex items-center gap-3 text-[10px] uppercase tracking-[0.22em]", dark ? "text-white/44" : "text-neutral-500")}>
      <span className={cx("h-px w-10", dark ? "bg-white/24" : "bg-neutral-950/18")} />
      <span>{index}</span>
      <span>{label}</span>
    </div>
  );
}

function Chapter({
  id,
  children,
  className = "",
}: {
  id: SectionId;
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <section id={`whisper-${id}`} className={className}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={`whisper-${id}`}
      className={className}
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

function WhisperRail({
  activeId,
  onSelect,
}: {
  activeId: SectionId;
  onSelect: (id: SectionId) => void;
}) {
  return (
    <nav className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 items-end gap-4 2xl:flex">
      <div className="h-[22rem] w-px overflow-hidden bg-white/16">
        <motion.div
          className="h-full w-full origin-top bg-[#f3efe4]"
          animate={{ scaleY: Math.max(0.08, (railItems.findIndex((item) => item.id === activeId) + 1) / railItems.length) }}
          transition={{ duration: 0.42, ease }}
        />
      </div>

      <div className="flex flex-col gap-2">
        {railItems.map((item) => {
          const active = activeId === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={cx(
                "grid grid-cols-[2rem_1fr] items-center gap-2 border px-3 py-2 text-left text-[10px] uppercase tracking-[0.14em] backdrop-blur-xl transition",
                active
                  ? "border-[#f3efe4] bg-[#f3efe4] text-neutral-950"
                  : "border-white/12 bg-black/18 text-white/42 hover:border-white/34 hover:text-white",
              )}
            >
              <span className={active ? "text-neutral-500" : "text-white/24"}>{item.index}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function VideoSurface({
  video,
  tone = "dark",
  onOpen,
}: {
  video: VideoProof;
  tone?: "dark" | "paper";
  onOpen: () => void;
}) {
  const sound = useSound();

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => sound.playRole("hover")}
      className={cx(
        "group block w-full overflow-hidden border p-2 text-left transition",
        tone === "dark"
          ? "border-white/14 bg-white/[0.035] hover:border-white/38"
          : "border-neutral-950/12 bg-white/68 hover:border-neutral-950/28",
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-black">
        <video
          className="h-full w-full object-contain"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={video.poster}
        >
          <source src={video.src} type="video/mp4" />
        </video>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.32))]" />
        <div className="absolute left-4 top-4 border border-white/20 bg-black/42 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white/72 backdrop-blur">
          {video.label}
        </div>
        <div className="absolute bottom-4 right-4 border border-white/24 bg-white/12 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white/82 backdrop-blur transition group-hover:bg-white group-hover:text-neutral-950">
          View capture
        </div>
      </div>

      <div className={cx("grid gap-2 px-2 py-4 md:grid-cols-[0.34fr_1fr]", tone === "dark" ? "text-white" : "text-neutral-950")}>
        <div className={cx("text-[10px] uppercase tracking-[0.18em]", tone === "dark" ? "text-white/42" : "text-neutral-500")}>
          {video.title}
        </div>
        <p className={cx("text-sm leading-6", tone === "dark" ? "text-white/62" : "text-neutral-600")}>
          {video.caption}
        </p>
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

function VideoModal({ video, onClose }: { video: VideoProof | null; onClose: () => void }) {
  useEffect(() => {
    if (!video) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, video]);

  return (
    <AnimatePresence>
      {video ? (
        <motion.div
          className="fixed inset-0 z-[90] bg-[#030303] text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease }}
        >
          <button
            type="button"
            aria-label="Close video proof"
            className="absolute inset-0 cursor-default bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.12),transparent_32%),linear-gradient(180deg,rgba(12,16,16,0.3),rgba(0,0,0,0.96))]"
            onClick={onClose}
          />

          <div className="relative z-[91] grid h-dvh grid-rows-[auto_minmax(0,1fr)_auto]">
            <header className="flex items-center justify-between gap-4 border-b border-white/12 px-4 py-4 md:px-8">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/38">WHISPER video proof</div>
                <h2 className="mt-2 truncate text-2xl font-semibold tracking-normal text-white md:text-4xl">{video.title}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="border border-white/16 bg-white/8 px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-white/72 transition hover:bg-white hover:text-neutral-950"
              >
                Close x
              </button>
            </header>

            <main className="grid min-h-0 place-items-center px-4 py-6 md:px-8">
              <motion.video
                key={video.src}
                className="max-h-full w-full max-w-[1600px] border border-white/14 bg-black object-contain shadow-[0_34px_160px_rgba(0,0,0,0.64)]"
                controls
                autoPlay
                playsInline
                poster={video.poster}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.99 }}
                transition={{ duration: 0.5, ease }}
              >
                <source src={video.src} type="video/mp4" />
              </motion.video>
            </main>

            <footer className="border-t border-white/12 px-4 py-4 text-sm leading-6 text-white/58 md:px-8">
              {video.caption}
            </footer>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function WhisperCaseLayout({ item }: WhisperCaseLayoutProps) {
  const navigate = useNavigate();
  const sound = useSound();
  const reduceMotion = useReducedMotion();
  const copy = whisperCaseI18n.en;
  const rawFrames = item.frames ?? [];
  const rawVideos = item.videos ?? [];

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
    title: "Desktop walkthrough",
    label: "Website navigation",
    src: desktopVideoData?.src ?? WHISPER_DESKTOP_VIDEO,
    poster: desktopVideoData?.poster ?? webFrames[8]?.src ?? openingFrame?.src,
    caption:
      "Desktop navigation through the editorial website, series pages, print catalog, AR preview, notes layer, and collector-facing continuation.",
  };

  const questVideo: VideoProof = {
    title: "Quest VR capture",
    label: "Meta Quest 3 proof",
    src: questVideoData?.src ?? WHISPER_VR_VIDEO,
    poster: questVideoData?.poster ?? vrFrames[0]?.src,
    caption:
      "Headset capture showing the spatial exhibition, calm room-scale pacing, and hand-navigation proof.",
  };

  const inspectFrames = useMemo<CaseStoryMedia[]>(
    () => [
      ...webFrames.map((frame, index) => toInspectFrame(frame, index, index === 0 ? "hero" : index >= 7 ? "detail" : "flow")),
      ...vrFrames.map((frame, index) => toInspectFrame(frame, index, "proof")),
      ...mobileFrames.map((frame, index) => toInspectFrame(frame, index, "mobile")),
    ],
    [mobileFrames, vrFrames, webFrames],
  );

  const mobileShowcaseFrames = useMemo(() => toMobileShowcaseFrames(mobileFrames), [mobileFrames]);
  const chamberEngines = useMemo(() => getChamberEngines("whisper"), []);
  const stackItems = useMemo(
    () => item.stack.split(",").map((entry) => entry.trim()).filter(Boolean),
    [item.stack],
  );

  const [activeSection, setActiveSection] = useState<SectionId>("threshold");
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
    [inspectFrames, sound],
  );

  const openVideo = useCallback(
    (video: VideoProof) => {
      sound.playRole("select");
      setActiveVideo(video);
    },
    [sound],
  );

  const scrollToSection = useCallback(
    (id: SectionId) => {
      sound.playRole("transition");
      document.getElementById(`whisper-${id}`)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        const nextId = visible?.target.id.replace("whisper-", "") as SectionId | undefined;
        if (nextId) setActiveSection(nextId);
      },
      { rootMargin: "-26% 0px -54% 0px", threshold: [0.18, 0.34, 0.5] },
    );

    railItems.forEach((item) => {
      const node = document.getElementById(`whisper-${item.id}`);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden overflow-x-hidden bg-[#050505] text-[#f4efe4]">
      <WhisperRail activeId={activeSection} onSelect={scrollToSection} />

      <Chapter id="threshold" className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
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

        <div className="absolute left-4 right-4 top-5 z-20 mx-auto flex w-[min(92vw,1680px)] flex-wrap items-center justify-between gap-3 md:left-8 md:right-8 md:top-7">
          <button
            type="button"
            onClick={openImmersiveIndex}
            className="border border-white/16 bg-black/24 px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] text-white/64 backdrop-blur transition hover:border-white/34 hover:text-white"
          >
            Back to immersive
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

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] w-[min(92vw,1680px)] gap-12 px-4 pb-14 pt-24 max-[640px]:w-full max-[640px]:px-7 max-[640px]:pt-28 md:px-8 lg:grid-cols-[0.45fr_0.55fr] lg:items-end lg:pt-28">
          <div className="max-w-[46rem] pb-2 max-[640px]:max-w-full">
            <div className="mb-8 flex flex-wrap gap-2">
              {["Flagship immersive", "Completed proof", "Web / XR / AR"].map((label) => (
                <span key={label} className="border border-white/16 bg-white/8 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white/58 backdrop-blur">
                  {label}
                </span>
              ))}
            </div>

            <h1 className="max-w-[8ch] text-[76px] font-semibold leading-[0.86] tracking-normal text-white max-[420px]:text-[58px] sm:text-[104px] xl:text-[144px]">
              WHISPER
            </h1>
            <p className="mt-8 max-w-[42rem] text-[21px] leading-[1.55] text-white/78 max-[640px]:max-w-[19rem] max-[420px]:text-[19px] md:text-[28px]">
              Cinematic Web / XR exhibition where photography becomes a public surface, a collector system, and a room-scale proof.
            </p>
            <p className="mt-7 max-w-[40rem] text-base leading-8 text-white/56 max-[640px]:max-w-[19rem]">
              This case is treated as the Immersive canon: one continuous story across website, mobile, Quest VR, print detail, AR preview, and the engine logic that holds them together.
            </p>

            <div className="mt-9 flex flex-wrap gap-3 max-[640px]:max-w-[19rem] max-[420px]:grid max-[420px]:grid-cols-2">
              <a
                href={WHISPER_LIVE_URL}
                target="_blank"
                rel="noreferrer"
                className="border border-[#f4efe4] bg-[#f4efe4] px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-950 transition hover:bg-white max-[420px]:px-4 max-[420px]:text-[10px]"
              >
                Live site
              </a>
              <a
                href={WHISPER_REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="border border-white/18 bg-white/8 px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white/72 transition hover:border-white/42 hover:text-white max-[420px]:px-4 max-[420px]:text-[10px]"
              >
                Repository
              </a>
              {openingFrame ? (
                <button
                  type="button"
                  onClick={() => openInspectBySrc(openingFrame.src)}
                  className="border border-white/18 bg-black/16 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/72 transition hover:border-white/42 hover:text-white max-[420px]:hidden"
                >
                  Inspect hero
                </button>
              ) : null}
            </div>
          </div>

          <div className="relative min-h-[520px] lg:min-h-[650px]">
            <div className="absolute left-[5%] right-[5%] top-[12%] border border-white/12 bg-white/[0.035] p-2 shadow-[0_46px_180px_rgba(0,0,0,0.5)]">
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
                <div className="absolute left-4 top-4 border border-white/18 bg-black/42 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white/64 backdrop-blur">
                  Signal 01 / website
                </div>
              </div>
            </div>

            {vrFrames[0] ? (
              <button
                type="button"
                onClick={() => openInspectBySrc(vrFrames[0].src)}
                className="absolute right-[2%] top-[3%] w-[34%] border border-white/14 bg-black/44 p-2 shadow-[0_36px_120px_rgba(0,0,0,0.52)] backdrop-blur transition hover:border-white/36"
              >
                <div className="aspect-[4/3] overflow-hidden bg-black">
                  <img src={vrFrames[0].src} alt={vrFrames[0].alt ?? ""} className="h-full w-full object-contain" />
                </div>
                <div className="mt-2 text-left text-[9px] uppercase tracking-[0.16em] text-white/48">Quest proof</div>
              </button>
            ) : null}

            {mobileFrames[0] ? (
              <button
                type="button"
                onClick={() => openInspectBySrc(mobileFrames[0].src)}
                className="absolute bottom-[2%] left-[2%] w-[23%] min-w-[128px] border border-white/14 bg-black/46 p-2 shadow-[0_36px_120px_rgba(0,0,0,0.48)] backdrop-blur transition hover:border-white/36"
              >
                <div className="aspect-[9/16] overflow-hidden bg-black">
                  <img src={mobileFrames[0].src} alt={mobileFrames[0].alt ?? ""} className="h-full w-full object-contain" />
                </div>
                <div className="mt-2 text-left text-[9px] uppercase tracking-[0.16em] text-white/48">Mobile route</div>
              </button>
            ) : null}

            <div className="absolute bottom-[10%] right-[5%] grid max-w-[330px] grid-cols-2 border border-white/12 bg-[#f4efe4]/92 text-neutral-950 shadow-[0_22px_90px_rgba(0,0,0,0.3)] backdrop-blur">
              {flagshipSignals.map((signal) => (
                <div key={signal} className="border-b border-r border-neutral-950/10 px-3 py-3 text-[10px] uppercase tracking-[0.15em] text-neutral-600 last:border-r-0">
                  {signal}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Chapter>

      <Chapter id="atlas" className="bg-[#f2eee4] px-4 py-24 text-neutral-950 md:px-8 lg:py-32">
        <div className="mx-auto grid w-[min(92vw,1640px)] gap-16 lg:grid-cols-[0.42fr_0.58fr]">
          <div>
            <SectionLabel index="02" label="Spatial atlas" />
            <KineticTitle
              text="One flagship case, four connected surfaces."
              className="mt-8 max-w-[10ch] text-[54px] font-semibold leading-[0.9] tracking-normal sm:text-[78px] xl:text-[104px]"
            />
            <p className="mt-8 max-w-[42rem] text-[17px] leading-8 text-neutral-600">
              The strongest existing portfolio ideas are merged here: V2 evidence logic, immersive orbit language, spatial proof, and the cinematic inspect reveal. WHISPER becomes the reference pattern for future Immersive cases.
            </p>
          </div>

          <div className="grid gap-3">
            {proofLayers.map((layer) => {
              const active = activeLayer === layer.id;

              return (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => {
                    sound.playRole("select");
                    setActiveLayer(layer.id);
                  }}
                  className={cx(
                    "grid gap-5 border p-5 text-left transition md:grid-cols-[4rem_0.72fr_1fr]",
                    active
                      ? "border-neutral-950 bg-neutral-950 text-[#f2eee4]"
                      : "border-neutral-950/10 bg-white/54 text-neutral-950 hover:border-neutral-950/26",
                  )}
                >
                  <div className={cx("text-[10px] uppercase tracking-[0.2em]", active ? "text-white/42" : "text-neutral-400")}>{layer.index}</div>
                  <div>
                    <div className="text-[20px] font-semibold leading-tight tracking-normal md:text-[28px]">{layer.title}</div>
                    <div className={cx("mt-3 text-[10px] uppercase tracking-[0.18em]", active ? "text-white/42" : "text-neutral-500")}>{layer.signal}</div>
                  </div>
                  <p className={cx("text-sm leading-7 md:text-[15px]", active ? "text-white/62" : "text-neutral-600")}>{layer.text}</p>
                </button>
              );
            })}
          </div>
        </div>
      </Chapter>

      <Chapter id="web" className="bg-[#f2eee4] px-4 pb-24 text-neutral-950 md:px-8 lg:pb-32">
        <div className="mx-auto w-[min(92vw,1640px)]">
          <div className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-end">
            <div>
              <SectionLabel index="03" label="Web exhibition" />
              <KineticTitle
                text="The website is the first room."
                className="mt-8 max-w-[9ch] text-[54px] font-semibold leading-[0.9] tracking-normal sm:text-[78px] xl:text-[104px]"
              />
            </div>
            <p className="max-w-[48rem] text-[17px] leading-8 text-neutral-600">
              The desktop sequence keeps every essential screenshot from the original case flow: hero, series system, gallery rhythm, Sea / Forest pages, print detail, AR preview, and notes. No screenshot is cropped inside the proof cards.
            </p>
          </div>

          <div className="mt-14">
            <VideoSurface video={desktopVideo} tone="paper" onOpen={() => openVideo(desktopVideo)} />
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {webFrames.slice(1).map((frame, index) => (
              <FramePlate
                key={frame.src}
                frame={frame}
                index={index + 1}
                tone="paper"
                variant={index > 6 ? "compact" : "wide"}
                onOpen={() => openInspectBySrc(frame.src)}
              />
            ))}
          </div>
        </div>
      </Chapter>

      <Chapter id="xr" className="relative overflow-hidden bg-[#070807] px-4 py-24 text-white md:px-8 lg:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_64%_28%,rgba(105,127,98,0.24),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_28%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:86px_86px]" />

        <div className="relative mx-auto grid w-[min(92vw,1640px)] gap-14 lg:grid-cols-[0.38fr_0.62fr]">
          <div>
            <SectionLabel index="04" label="XR proof" dark />
            <KineticTitle
              text="Quest capture turns the case into a room."
              className="mt-8 max-w-[10ch] text-[52px] font-semibold leading-[0.92] tracking-normal text-white sm:text-[74px] xl:text-[96px]"
            />
            <p className="mt-8 max-w-[40rem] text-[16px] leading-8 text-white/60">
              This is the difference between a polished website case and a flagship immersive case: WHISPER has real headset proof and a visual system that survives the move into spatial presentation.
            </p>
          </div>

          <div className="grid gap-10">
            <VideoSurface video={questVideo} tone="dark" onOpen={() => openVideo(questVideo)} />

            <div className="grid gap-8 md:grid-cols-3">
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

      <Chapter id="collector" className="bg-[#ebe6dc] px-4 py-24 text-neutral-950 md:px-8 lg:py-32">
        <div className="mx-auto w-[min(92vw,1640px)]">
          <div className="grid gap-10 lg:grid-cols-[0.48fr_0.52fr] lg:items-end">
            <div>
              <SectionLabel index="05" label="Collector continuation" />
              <KineticTitle
                text="The screen returns to the artwork."
                className="mt-8 max-w-[9ch] text-[54px] font-semibold leading-[0.9] tracking-normal sm:text-[78px] xl:text-[104px]"
              />
            </div>
            <div className="max-w-[48rem]">
              <p className="text-[17px] leading-8 text-neutral-600">
                After the XR proof, the case lands in practical collector logic: edition detail, print presentation, AR preview, notes, and handoff. This keeps the immersive layer commercially grounded.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {["Edition detail", "AR preview", "Notes layer"].map((item, index) => (
                  <div key={item} className="border border-neutral-950/12 bg-white/48 p-4">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">{formatIndex(index + 1)}</div>
                    <div className="mt-4 text-[15px] font-semibold tracking-normal text-neutral-950">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_0.72fr]">
            {webFrames.slice(7, 10).map((frame, index) => (
              <FramePlate
                key={frame.src}
                frame={frame}
                index={index + 7}
                tone="paper"
                variant={index === 0 ? "wide" : "compact"}
                onOpen={() => openInspectBySrc(frame.src)}
              />
            ))}
          </div>
        </div>
      </Chapter>

      <Chapter id="mobile" className="bg-[#f5f1e8] px-4 py-24 text-neutral-950 md:px-8 lg:py-32">
        <div className="mx-auto w-[min(92vw,1500px)]">
          <div className="grid gap-10 lg:grid-cols-[0.45fr_0.55fr] lg:items-end">
            <div>
              <SectionLabel index="06" label="Mobile proof" />
              <KineticTitle
                text="The handheld route stays cinematic."
                className="mt-8 max-w-[10ch] text-[54px] font-semibold leading-[0.9] tracking-normal sm:text-[78px] xl:text-[104px]"
              />
            </div>
            <p className="max-w-[46rem] text-[17px] leading-8 text-neutral-600">
              The six mobile frames remain as a complete sequence: landing, series entry, index, drawer, work detail, and print / AR continuation.
            </p>
          </div>

          <div className="mt-14">
            <CaseMobileShowcase
              frames={mobileShowcaseFrames}
              eyebrow="Mobile exhibition sequence"
              description="Guided handheld sequence across exhibition entry, series navigation, mobile drawer, work detail, and print / AR continuation."
              onOpenFrame={openInspectBySrc}
            />
          </div>
        </div>
      </Chapter>

      <Chapter id="engine" className="relative overflow-hidden bg-[#050505] px-4 py-24 text-white md:px-8 lg:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_22%,rgba(222,210,179,0.14),transparent_26%),radial-gradient(circle_at_78%_42%,rgba(77,104,94,0.2),transparent_26%)]" />
        <div className="relative mx-auto grid w-[min(92vw,1640px)] gap-16 lg:grid-cols-[0.38fr_0.62fr]">
          <div>
            <SectionLabel index="07" label="Engine ledger" dark />
            <KineticTitle
              text="This becomes the Immersive canon."
              className="mt-8 max-w-[10ch] text-[52px] font-semibold leading-[0.92] tracking-normal text-white sm:text-[74px] xl:text-[96px]"
            />
            <p className="mt-8 max-w-[40rem] text-[16px] leading-8 text-white/58">
              Future Immersive cases can now inherit a clear pattern: spatial threshold, atlas, media proof, surface-specific chapters, inspect mode, and engine ledger.
            </p>
            <div className="mt-9 flex flex-wrap gap-2">
              {stackItems.map((entry) => (
                <span key={entry} className="border border-white/12 bg-white/[0.04] px-3 py-2 text-[10px] uppercase tracking-[0.15em] text-white/52">
                  {entry}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-10">
            <div className="grid gap-3 md:grid-cols-2">
              {chamberEngines.map((engine, index) => (
                <article key={engine.id} className="border border-white/12 bg-white/[0.035] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/34">{formatIndex(index + 1)}</span>
                    <span className="text-[10px] uppercase tracking-[0.16em] text-white/36">{engine.signal}</span>
                  </div>
                  <h3 className="mt-6 text-[26px] font-semibold leading-tight tracking-normal text-white">{engine.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/54">{engine.summary}</p>
                </article>
              ))}
            </div>

            <div className="grid gap-3">
              {interactionRules.map((rule, index) => (
                <article key={rule.title} className="grid gap-4 border-y border-white/12 py-5 md:grid-cols-[4rem_0.45fr_1fr]">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/30">{formatIndex(index + 1)}</div>
                  <h3 className="text-[20px] font-semibold leading-tight tracking-normal text-white">{rule.title}</h3>
                  <p className="text-sm leading-7 text-white/54">{rule.text}</p>
                </article>
              ))}
            </div>

            <div className="border border-[#f4efe4]/24 bg-[#f4efe4] p-6 text-neutral-950 md:grid md:grid-cols-[0.6fr_0.4fr] md:items-center md:gap-8">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Current milestone</div>
                <p className="mt-4 text-[24px] font-semibold leading-tight tracking-normal md:text-[36px]">
                  Advanced working V1 with public site, XR proof, mobile path, print logic, and AR continuation.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 md:mt-0 md:justify-end">
                <a
                  href={WHISPER_LIVE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-neutral-950 bg-neutral-950 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-neutral-800"
                >
                  Open live site
                </a>
                <button
                  type="button"
                  onClick={() => scrollToSection("threshold")}
                  className="border border-neutral-950/18 bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-950 transition hover:border-neutral-950"
                >
                  Back to threshold
                </button>
              </div>
            </div>
          </div>
        </div>
      </Chapter>

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
