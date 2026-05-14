import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useNavigate } from "react-router-dom";

import { cases } from "../data/cases";
import { immersiveItems } from "../data/immersive";
import AtmosphericSiteShell from "../ui/atmosphere/AtmosphericSiteShell";
import Header from "../ui/Header";
import LiveBuildSignal from "../ui/studio-index/LiveBuildSignal";
import PageSurface from "../ui/PageSurface";
import SectionRail, { type SectionRailItem } from "../ui/SectionRail";
import SiteFooterV2 from "../ui/SiteFooterV2";
import StudioHeroField from "../ui/StudioHeroField";
import FormulaSignalStrand from "../ui/StudioSystemStrand";
import { startSpaPageTransition } from "../ui/pageTransition";

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
  noIndex?: boolean;
};

type SystemItem = {
  index: string;
  title: string;
  label: string;
  text: string;
  proof: string;
  src: string;
};

type StoryMediaAsset = {
  kind: "image" | "video";
  src: string;
  poster?: string;
  label: string;
  className: string;
  shape: string;
};

type StoryFrame = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  route?: string;
  media: StoryMediaAsset[];
};

const ease = [0.22, 1, 0.36, 1] as const;

const findCase = (slug: string) => cases.find((item) => item.slug === slug);
const casePoster = (slug: string, fallback: string) => findCase(slug)?.poster.src ?? fallback;

const whisper = immersiveItems.find((item) => item.slug === "whisper");

const media = {
  whisperPoster: whisper?.previewPoster ?? "/immersive/Whisper/desktop/whisper-hero.jpg",
  whisperVideo: "/immersive/Whisper/Video/hero-home-video.mp4",
  whisperDesktopVideo: "/immersive/Whisper/Video/whisper-desktop-video.mp4",
  whisperVrVideo: "/immersive/Whisper/Video/whisper-vr-video.mp4",
  whisperVrPoster: "/immersive/Whisper/desktop/whisper-vr-1.jpg",
  whisperDetail: "/immersive/Whisper/desktop/whisper-8.jpg",
  whisperMobile: "/immersive/Whisper/mobile/whisper-mb-3.jpg",

  house: casePoster("house-of-lune", "/cases/house-of-lune/desktop/house-of-lune-hero.webp"),
  houseVideo: "/cases/house-of-lune/video/house-of-lune-video.mp4",
  houseDetail: "/cases/house-of-lune/desktop/house-of-lune-3.webp",

  advisory: casePoster("bcn-advisory", "/cases/bcn-advisory/desktop/bcn-advisory-hero.webp"),
  advisoryVideo: "/cases/bcn-advisory/video/bcn-advisory-video.mp4",
  advisoryDetail: "/cases/bcn-advisory/desktop/bcn-advisory-3.webp",

  creatorops: casePoster("creatorops", "/cases/creatorops/desktop/creatorops-hero.webp"),
  creatoropsVideo: "/cases/creatorops/video/creatorops-video.mp4",
  creatoropsDetail: "/cases/creatorops/desktop/creatorops-6.webp",

  print: casePoster("print-border-studio", "/cases/print-border-studio/desktop/psb-hero.webp"),
  printVideo: "/cases/print-border-studio/video/psb-video.mp4",
  printDetail: "/cases/print-border-studio/desktop/psb-3.webp",

  casa: casePoster("casa-nube", "/cases/casa-nube/desktop/casa-hero.webp"),
  casaVideo: "/cases/casa-nube/video/casa-video.mp4",

  fluid: casePoster("fluid-exhibition", "/cases/fluid-exhibition/desktop/fluid-hero.webp"),
  fluidVideo: "/cases/fluid-exhibition/video/fluid-video.mp4",

  form: casePoster("form-index", "/cases/form-index/desktop/fr-hero.webp"),
  formVideo: "/cases/form-index/video/fr-video.mp4",

  arcwave: casePoster("arcwave-integrations", "/cases/arcwave-integrations/desktop/arc-hero.webp"),
  arcwaveVideo: "/cases/arcwave-integrations/video/arc-video.mp4",
};

const systems: SystemItem[] = [
  {
    index: "01",
    title: "WebGL Stage System",
    label: "directed web scenes",
    text: "Reusable cinematic stage modules for atmospheric hero scenes, object reveals, product worlds, archive fields, and scroll-driven visual states.",
    proof: "Scenes behave as directed environments, not decorative backgrounds.",
    src: media.arcwave,
  },
  {
    index: "02",
    title: "WHISPER XR",
    label: "spatial proof layer",
    text: "A cinematic Web / XR exhibition system connecting photography, print logic, mobile presentation, AR preview, and Quest-tested spatial experience.",
    proof: "A photographic archive becomes website, collector surface, and spatial room.",
    src: media.whisperPoster,
  },
  {
    index: "03",
    title: "Atmospheric Backdrop System",
    label: "global atmosphere",
    text: "A visual field behind the interface: subtle signal, motion, depth, and atmosphere without compromising readability.",
    proof: "The site gains presence while content stays readable and calm.",
    src: media.fluid,
  },
];

const studioRailItems: SectionRailItem[] = [
  { index: "01", label: "Opening", id: "opening" },
  { index: "02", label: "Systems", id: "systems" },
  { index: "03", label: "WHISPER", id: "whisper" },
  { index: "04", label: "Atlas", id: "atlas" },
  { index: "05", label: "Grammar", id: "grammar" },
  { index: "06", label: "Practice", id: "practice" },
];

const storyFrames: StoryFrame[] = [
  {
    id: "spatial-archive",
    eyebrow: "Scene 01 / spatial archive",
    title: "A photographic archive opens as web, mobile, and VR space.",
    text:
      "WHISPER is not a single case cover. It is a connected spatial proof: public website, mobile presentation, cinematic archive, and Quest-tested room.",
    route: "/immersive",
    media: [
      {
        kind: "video",
        src: media.whisperDesktopVideo,
        poster: media.whisperDetail,
        label: "web exhibition walkthrough",
        className: "left-[0%] top-[3%] h-[64%] w-[66%]",
        shape: "polygon(0 7%, 100% 0, 94% 91%, 8% 100%)",
      },
      {
        kind: "video",
        src: media.whisperVrVideo,
        poster: media.whisperVrPoster,
        label: "quest spatial capture",
        className: "right-[0%] top-[15%] h-[52%] w-[41%]",
        shape: "polygon(7% 0, 100% 8%, 92% 100%, 0 88%)",
      },
      {
        kind: "image",
        src: media.whisperDetail,
        label: "archive detail",
        className: "left-[35%] bottom-[2%] h-[29%] w-[45%]",
        shape: "polygon(5% 0, 100% 8%, 94% 100%, 0 88%)",
      },
    ],
  },
  {
    id: "product-theatre",
    eyebrow: "Scene 02 / commercial atmosphere",
    title: "Product and advisory sites become staged decision surfaces.",
    text:
      "The commercial work uses the same cinematic grammar: controlled reveal, media proof, inquiry paths, and multilingual structure.",
    route: "/work",
    media: [
      {
        kind: "video",
        src: media.houseVideo,
        poster: media.house,
        label: "luxury product theatre",
        className: "left-[3%] top-[5%] h-[64%] w-[60%]",
        shape: "polygon(0 0, 94% 6%, 100% 84%, 8% 100%)",
      },
      {
        kind: "video",
        src: media.advisoryVideo,
        poster: media.advisory,
        label: "advisory buyer journey",
        className: "right-[0%] top-[4%] h-[47%] w-[43%]",
        shape: "polygon(9% 0, 100% 0, 90% 93%, 0 100%)",
      },
      {
        kind: "image",
        src: media.houseDetail,
        label: "object detail",
        className: "right-[14%] bottom-[4%] h-[39%] w-[34%]",
        shape: "polygon(0 10%, 100% 0, 92% 100%, 8% 92%)",
      },
    ],
  },
  {
    id: "workflow-machine",
    eyebrow: "Scene 03 / product mechanics",
    title: "Tools expose the system behind production.",
    text:
      "CreatorOps and Print Border Studio shift the portfolio from visual showcase into real product logic: publishing, export, preparation, review, and collector-facing presentation.",
    route: "/work",
    media: [
      {
        kind: "video",
        src: media.creatoropsVideo,
        poster: media.creatorops,
        label: "creator workflow system",
        className: "right-[0%] top-[5%] h-[64%] w-[60%]",
        shape: "polygon(6% 0, 100% 7%, 93% 100%, 0 91%)",
      },
      {
        kind: "video",
        src: media.printVideo,
        poster: media.print,
        label: "museum print preparation",
        className: "left-[0%] top-[14%] h-[52%] w-[46%]",
        shape: "polygon(0 8%, 92% 0, 100% 86%, 7% 100%)",
      },
      {
        kind: "image",
        src: media.creatoropsDetail,
        label: "pipeline detail",
        className: "left-[22%] bottom-[2%] h-[38%] w-[34%]",
        shape: "polygon(8% 0, 100% 8%, 90% 100%, 0 88%)",
      },
    ],
  },
  {
    id: "field-language",
    eyebrow: "Scene 04 / interface field",
    title: "The visual language becomes repeatable across contexts.",
    text:
      "FLUID, ARCWAVE, FORM INDEX, Casa Nube, and the immersive work prove that the practice is not one style. It is a reusable grammar for atmosphere, language, motion, and structure.",
    route: "/work",
    media: [
      {
        kind: "video",
        src: media.fluidVideo,
        poster: media.fluid,
        label: "fluid exhibition field",
        className: "left-[0%] top-[3%] h-[58%] w-[58%]",
        shape: "polygon(0 0, 100% 8%, 92% 92%, 7% 100%)",
      },
      {
        kind: "video",
        src: media.arcwaveVideo,
        poster: media.arcwave,
        label: "arcwave signal surface",
        className: "right-[0%] top-[10%] h-[50%] w-[46%]",
        shape: "polygon(8% 0, 100% 0, 92% 100%, 0 90%)",
      },
      {
        kind: "video",
        src: media.casaVideo,
        poster: media.casa,
        label: "hospitality rhythm",
        className: "left-[25%] bottom-[2%] h-[40%] w-[38%]",
        shape: "polygon(0 10%, 100% 0, 94% 100%, 10% 90%)",
      },
    ],
  },
];

const grammar = [
  ["signal", "attention appears before interaction"],
  ["state", "the interface knows what is active"],
  ["atmosphere", "the page carries mood and depth"],
  ["reveal", "motion exposes structure"],
  ["memory", "media leaves a trace"],
];

const practiceRows = [
  ["Premium Websites", "Editorial, high-trust websites for brands, studios, products, hospitality, advisory, culture, and creative professionals."],
  ["Interactive Product Surfaces", "Interfaces that explain products through staged proof, media, motion, and guided decision flows."],
  ["Multilingual Front-end Systems", "Structured EN / ES / UA / RU layers for international websites, case systems, and product surfaces."],
  ["Immersive / XR Prototypes", "WebGL, WebXR, Quest-tested spatial demos, AR preview flows, and future-facing presentation systems."],
  ["Creative Technology Direction", "Concept, interface architecture, motion grammar, prototype systems, and production-ready delivery."],
];

function StudioNoIndexMeta() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Studio Index — Rostyslav Brenych";

    const existing = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousContent = existing?.getAttribute("content") ?? null;
    const meta = existing ?? document.createElement("meta");

    meta.setAttribute("name", "robots");
    meta.setAttribute("content", "noindex, nofollow");

    if (!existing) document.head.appendChild(meta);

    return () => {
      document.title = previousTitle;

      if (existing && previousContent !== null) {
        existing.setAttribute("content", previousContent);
        return;
      }

      if (!existing) meta.remove();
    };
  }, []);

  return null;
}

function Chapter({
  id,
  children,
  className = "",
  headerScene,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  headerScene?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <section id={id} data-header-scene={headerScene} className={className}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      data-header-scene={headerScene}
      className={className}
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.22 }}
      transition={{ duration: 0.95, ease }}
    >
      {children}
    </motion.section>
  );
}

function useScrollActiveIndex(total: number) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start center", "end center"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const nextIndex = Math.min(
      total - 1,
      Math.max(0, Math.floor(latest * total)),
    );
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  });

  return { targetRef, activeIndex };
}

function useActiveStudioSection() {
  const [activeId, setActiveId] = useState("opening");

  useEffect(() => {
    const ids = studioRailItems.map((item) => item.id);

    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;

      const viewportAnchor = window.innerHeight * 0.44;
      let nextId = "opening";
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const id of ids) {
        const section = document.getElementById(id);
        if (!section) continue;

        const rect = section.getBoundingClientRect();

        if (rect.top <= viewportAnchor && rect.bottom >= viewportAnchor) {
          nextId = id;
          break;
        }

        const distance = Math.min(Math.abs(rect.top - viewportAnchor), Math.abs(rect.bottom - viewportAnchor));

        if (distance < closestDistance) {
          closestDistance = distance;
          nextId = id;
        }
      }

      setActiveId((currentId) => (currentId === nextId ? currentId : nextId));
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return activeId;
}

function FloatingImage({
  src,
  label,
  title,
  className = "",
  imageClassName = "",
}: {
  src: string;
  label?: string;
  title?: string;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <figure className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover saturate-[0.94] ${imageClassName}`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(242,239,232,0),rgba(242,239,232,0.02)_56%,rgba(242,239,232,0.22))]" />
      {(label || title) && (
        <figcaption className="absolute bottom-4 left-4 right-4">
          {label && <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-700/62">{label}</div>}
          {title && (
            <div className="mt-1 max-w-[12ch] text-[28px] leading-[0.9] tracking-[-0.06em] text-neutral-950 sm:text-[40px]">
              {title}
            </div>
          )}
        </figcaption>
      )}
    </figure>
  );
}

function OpeningChapter({
  onSystems,
  onWork,
  onImmersive,
}: {
  onSystems: () => void;
  onWork: () => void;
  onImmersive: () => void;
}) {
  return (
    <Chapter
      id="opening"
      headerScene="living-threshold"
      className="relative min-h-screen overflow-hidden px-4 pb-16 pt-24 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 z-0">
        <StudioHeroField
          assets={[
            { src: media.whisperPoster, label: "WHISPER XR" },
            { src: media.house, label: "House of Lune" },
            { src: media.advisory, label: "Barcelona Advisory" },
            { src: media.creatorops, label: "CreatorOps" },
          ]}
        />
      </div>

      <div className="absolute right-[clamp(5.5rem,7vw,10rem)] top-[43%] z-10 hidden w-[19rem] xl:block 2xl:right-[11vw] 2xl:w-[21rem]">
        <LiveBuildSignal readiness={78} />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-7rem)] w-[min(94vw,1640px)] items-center">
        <div className="max-w-[56rem]">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-neutral-300/70 bg-white/56 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-neutral-500 backdrop-blur">
              Studio Index
            </span>
            <span className="rounded-full border border-neutral-300/70 bg-white/38 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-neutral-500 backdrop-blur">
              Living systems
            </span>
          </div>

          <h1 className="mt-8 max-w-[10ch] text-[78px] font-normal leading-[0.78] tracking-[-0.09em] text-neutral-950 sm:text-[112px] md:text-[150px] xl:text-[176px] 2xl:text-[206px]">
            Living interface systems.
          </h1>

          <p className="mt-9 max-w-[45rem] text-[17px] leading-[1.85] text-neutral-600 sm:text-[19px]">
            I build premium websites, cinematic web environments, multilingual product surfaces,
            and spatial digital experiences where motion, media, language, and technical structure
            work as one environment.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onSystems}
              className="rounded-full border border-neutral-950 bg-neutral-950 px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
            >
              Explore systems →
            </button>
            <button
              type="button"
              onClick={onWork}
              className="rounded-full border border-neutral-300 bg-white/60 px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-neutral-700 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
            >
              View work →
            </button>
            <button
              type="button"
              onClick={onImmersive}
              className="rounded-full border border-neutral-300 bg-white/36 px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-neutral-700 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
            >
              Enter immersive →
            </button>
          </div>

          <div className="mt-6 xl:hidden">
            <LiveBuildSignal readiness={78} compact />
          </div>
        </div>
      </div>
    </Chapter>
  );
}

function SystemsChapter() {
  return (
    <Chapter
      id="systems"
      headerScene="living-systems"
      className="relative overflow-x-clip overflow-y-visible px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="relative z-10 mx-auto w-[min(94vw,1640px)]">
        <div className="grid gap-14 xl:grid-cols-[0.34fr_0.66fr] xl:items-start">
          <div className="xl:sticky xl:top-28">
            <div className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Interface systems</div>
            <h2 className="mt-5 max-w-[9.5ch] text-[58px] font-normal leading-[0.84] tracking-[-0.075em] sm:text-[90px] xl:text-[122px]">
              Systems, not cards.
            </h2>
            <p className="mt-8 max-w-[35rem] text-[17px] leading-[1.85] text-neutral-600">
              The work is organized as reusable interface systems: stage logic, presence fields,
              spatial rooms, archive structures, multilingual layers, and commercial product surfaces.
            </p>

            <div className="mt-10 max-w-[30rem] border-y border-neutral-950/14 py-5">
              <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Core formula</div>
              <div className="mt-4 text-[25px] leading-tight tracking-[-0.05em] text-neutral-950">
                signal → state → atmosphere → reveal → memory
              </div>
              <FormulaSignalStrand className="mt-6 hidden h-[28rem] w-full xl:block 2xl:h-[34rem]" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-[18%] top-0 h-full w-px bg-gradient-to-b from-transparent via-neutral-950/14 to-transparent" />

            <div className="grid gap-24">
              {systems.map((system, index) => (
                <motion.article
                  key={system.title}
                  className="relative grid gap-8 border-t border-neutral-950/12 pt-9 md:grid-cols-[0.34fr_0.66fr] md:items-center"
                  initial={{ opacity: 0, x: 34 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.28 }}
                  transition={{ duration: 0.85, delay: index * 0.05, ease }}
                >
                  <div className="relative min-h-[330px] md:min-h-[450px]">
                    <FloatingImage
                      src={system.src}
                      label={system.label}
                      className="absolute inset-0 rounded-[5rem_2.4rem_5.4rem_2.8rem] border border-white/70 shadow-[0_34px_110px_rgba(0,0,0,0.105)]"
                    />
                    <div className="absolute -left-4 top-4 text-[96px] leading-none tracking-[-0.085em] text-neutral-950/16 md:text-[132px]">
                      {system.index}
                    </div>
                  </div>

                  <div>
                    <h3 className="max-w-[10ch] text-[54px] font-normal leading-[0.86] tracking-[-0.07em] text-neutral-950 sm:text-[80px] xl:text-[104px]">
                      {system.title}
                    </h3>
                    <p className="mt-7 max-w-[45rem] text-[16px] leading-[1.9] text-neutral-600">
                      {system.text}
                    </p>
                    <p className="mt-5 max-w-[38rem] border-t border-neutral-950/12 pt-5 text-[12px] uppercase tracking-[0.16em] text-neutral-400">
                      {system.proof}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Chapter>
  );
}

function WhisperChapter({ onOpen }: { onOpen: () => void }) {
  const target = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 230, damping: 32, mass: 0.18 });

  const mediaHeight = useTransform(progress, [0, 0.045, 0.18, 0.34], ["2px", "7vh", "72vh", "100vh"]);
  const mediaOpacity = useTransform(progress, [0, 0.045], [0.9, 1]);
  const mediaScale = useTransform(progress, [0.04, 0.24, 0.6], [1, 1.01, 1]);
  const scanScale = useTransform(progress, [0, 0.09, 0.28], [0.04, 1, 0.12]);
  const scanColor = useTransform(progress, [0.04, 0.2], ["rgba(23,23,23,0.46)", "rgba(255,255,255,0.72)"]);
  const textY = useTransform(progress, [0.04, 0.2, 0.58], ["4vh", "0vh", "10vh"]);
  const textOpacity = useTransform(progress, [0.035, 0.12, 0.82], [0, 1, 0.96]);
  const textClip = useTransform(progress, [0.055, 0.19], ["inset(0 0 100% 0)", "inset(0 0 0% 0)"]);
  const textColor = useTransform(progress, [0.16, 0.34], ["rgb(23,23,23)", "rgb(255,255,255)"]);
  const eyebrowColor = useTransform(progress, [0.16, 0.34], ["rgba(82,82,82,0.64)", "rgba(255,255,255,0.6)"]);
  const bodyColor = useTransform(progress, [0.16, 0.34], ["rgba(82,82,82,0.9)", "rgba(255,255,255,0.74)"]);
  const detailOpacity = useTransform(progress, [0.2, 0.34], [0, 1]);
  const detailY = useTransform(progress, [0.2, 0.36], ["0.8rem", "0rem"]);
  const titleScale = useTransform(progress, [0.04, 0.22, 0.62], [1.04, 1, 0.96]);
  const titleOrigin = useTransform(progress, [0.04, 0.22], ["0% 50%", "0% 0%"]);

  return (
    <section ref={target} id="whisper" data-header-scene="living-whisper" className="relative min-h-[148vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-1/2 z-10 w-screen -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-neutral-950"
          style={{
            height: mediaHeight,
            opacity: mediaOpacity,
            scale: mediaScale,
          }}
        >
          <motion.video
            className="absolute inset-0 h-full w-full object-cover saturate-[1.04] contrast-[1.04]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={media.whisperPoster}
          >
            <source src={media.whisperVideo} type="video/mp4" />
          </motion.video>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute left-0 top-1/2 z-20 h-px w-screen origin-left"
          style={{ scaleX: scanScale, backgroundColor: scanColor }}
        />

        <div className="relative z-30 mx-auto flex h-full w-[min(94vw,1640px)] items-center justify-end px-4 sm:px-6 lg:px-8">
          <motion.div
            className="w-full max-w-[43rem]"
            style={{ y: textY, opacity: textOpacity, clipPath: textClip, color: textColor }}
          >
            <motion.div
              className="mb-6 h-px w-full origin-left bg-current/26"
              style={{ scaleX: scanScale }}
            />

            <motion.div className="text-[10px] uppercase tracking-[0.28em]" style={{ color: eyebrowColor }}>
              WHISPER
            </motion.div>

            <motion.div style={{ scale: titleScale, transformOrigin: titleOrigin }}>
              <h2 className="mt-7 max-w-[8ch] text-[72px] font-normal leading-[0.8] tracking-[-0.082em] sm:text-[104px] xl:text-[132px]">
                First spatial proof.
              </h2>
            </motion.div>

            <motion.p className="mt-8 max-w-[37rem] text-[18px] leading-[1.82]" style={{ color: bodyColor }}>
              A cinematic Web / XR exhibition where photography becomes an immersive collector experience
              across website, mobile, print, AR, and spatial interface.
            </motion.p>

            <motion.div className="mt-8 grid grid-cols-2 gap-2" style={{ opacity: detailOpacity, y: detailY }}>
              {["Web exhibition", "Mobile proof", "Quest capture", "Print logic"].map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-current/24 bg-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.14em] backdrop-blur"
                >
                  {item}
                </div>
              ))}
            </motion.div>

            <motion.button
              type="button"
              onClick={onOpen}
              className="mt-8 rounded-full border border-current bg-neutral-950 px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
              style={{ opacity: detailOpacity, y: detailY }}
            >
              Open immersive case →
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
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
  const Tag = motion[as];

  if (reduceMotion) {
    const StaticTag = as;
    return <StaticTag className={className}>{text}</StaticTag>;
  }

  return (
    <Tag className={className}>
      {text.split(" ").map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block pr-[0.16em]"
          initial={{ opacity: 0, y: 26, rotateX: -36 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: false, amount: 0.45 }}
          transition={{ duration: 0.72, delay: index * 0.035, ease }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}

function StoryMedia({ asset, index }: { asset: StoryMediaAsset; index: number }) {
  const reduceMotion = useReducedMotion();
  const filterId = `story-fluid-${index}-${asset.label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const cursorX = useMotionValue(50);
  const cursorY = useMotionValue(50);
  const distortion = useMotionValue(0);
  const smoothX = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.28 });
  const smoothY = useSpring(my, { stiffness: 120, damping: 20, mass: 0.28 });
  const fluid = useSpring(distortion, { stiffness: 170, damping: 22, mass: 0.22 });

  const rotateY = useTransform(smoothX, [-1, 1], [-7, 7]);
  const rotateX = useTransform(smoothY, [-1, 1], [6, -6]);
  const mediaX = useTransform(smoothX, [-1, 1], ["-4.4%", "4.4%"]);
  const mediaY = useTransform(smoothY, [-1, 1], ["-4.4%", "4.4%"]);
  const mediaScale = useTransform(fluid, [0, 1], [1, 1.045]);
  const displacementScale = useTransform(fluid, [0, 1], [0, 28]);
  const turbulenceFrequency = useTransform(fluid, [0, 1], ["0.006 0.014", "0.018 0.04"]);
  const chromaOpacity = useTransform(fluid, [0, 1], [0, 0.22]);
  const warpOpacity = useTransform(fluid, [0, 1], [0, 0.88]);
  const chromaRedX = useTransform(smoothX, [-1, 1], ["-1.8%", "1.8%"]);
  const chromaRedY = useTransform(smoothY, [-1, 1], ["-1.2%", "1.2%"]);
  const chromaBlueX = useTransform(smoothX, [-1, 1], ["1.6%", "-1.6%"]);
  const chromaBlueY = useTransform(smoothY, [-1, 1], ["1.2%", "-1.2%"]);
  const sheenX = useTransform(smoothX, [-1, 1], ["-5%", "5%"]);
  const sheenY = useTransform(smoothY, [-1, 1], ["-3%", "3%"]);
  const localWarpMask = useMotionTemplate`radial-gradient(circle at ${cursorX}% ${cursorY}%, #000 0%, #000 4.5%, rgba(0,0,0,0.78) 9%, rgba(0,0,0,0.34) 16%, transparent 28%)`;

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const nextX = (px - 0.5) * 2;
    const nextY = (py - 0.5) * 2;

    mx.set(nextX);
    my.set(nextY);
    cursorX.set(px * 100);
    cursorY.set(py * 100);
    distortion.set(1);
  };

  const handlePointerLeave = () => {
    mx.set(0);
    my.set(0);
    cursorX.set(50);
    cursorY.set(50);
    distortion.set(0);
  };

  const renderMedia = (className = "h-full w-full opacity-100 saturate-[1.04] contrast-[1.04]") =>
    asset.kind === "video" ? (
      <video
        className={`h-full w-full object-cover ${className}`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={asset.poster}
      >
        <source src={asset.src} type="video/mp4" />
      </video>
    ) : (
      <img src={asset.src} alt="" className={`h-full w-full object-cover ${className}`} />
    );

  return (
    <motion.figure
      className={`group absolute overflow-hidden border border-white/70 bg-white/10 shadow-[0_46px_150px_rgba(0,0,0,0.17)] backdrop-blur-[2px] will-change-transform ${asset.className}`}
      style={{
        clipPath: asset.shape,
        rotateX: reduceMotion ? 0 : rotateX,
        rotateY: reduceMotion ? 0 : rotateY,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      initial={reduceMotion ? undefined : { opacity: 0, y: 62, scale: 0.98 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1.04 }}
      whileHover={reduceMotion ? undefined : { scale: 1.075, zIndex: 20 }}
      viewport={{ once: false, amount: 0.35 }}
      transition={{ duration: 0.95, delay: index * 0.08, ease }}
    >
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true" focusable="false">
        <filter id={filterId} x="-14%" y="-14%" width="128%" height="128%" colorInterpolationFilters="sRGB">
          <motion.feTurbulence
            type="fractalNoise"
            baseFrequency={turbulenceFrequency}
            numOctaves="2"
            seed={index + 7}
            result="noise"
          />
          <motion.feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={displacementScale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <motion.div
        className="absolute inset-[-5%] h-[110%] w-[110%] will-change-transform"
        style={{
          x: reduceMotion ? 0 : mediaX,
          y: reduceMotion ? 0 : mediaY,
          scale: reduceMotion ? 1 : mediaScale,
        }}
      >
        {renderMedia()}
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-8%] h-[116%] w-[116%] will-change-transform"
        style={{
          x: reduceMotion ? 0 : mediaX,
          y: reduceMotion ? 0 : mediaY,
          scale: reduceMotion ? 1 : mediaScale,
          opacity: reduceMotion ? 0 : warpOpacity,
          filter: reduceMotion ? undefined : `url(#${filterId})`,
          WebkitMaskImage: reduceMotion ? "none" : localWarpMask,
          maskImage: reduceMotion ? "none" : localWarpMask,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      >
        {renderMedia("h-full w-full opacity-100 saturate-[1.08] contrast-[1.08] brightness-[1.02]")}
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-5%] h-[110%] w-[110%] mix-blend-screen will-change-transform"
        style={{
          x: reduceMotion ? 0 : chromaRedX,
          y: reduceMotion ? 0 : chromaRedY,
          opacity: reduceMotion ? 0 : chromaOpacity,
          WebkitMaskImage: reduceMotion ? "none" : localWarpMask,
          maskImage: reduceMotion ? "none" : localWarpMask,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      >
        {renderMedia("h-full w-full opacity-70 saturate-[1.22] contrast-[1.12] [filter:sepia(1)_hue-rotate(305deg)_saturate(2.4)]")}
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-5%] h-[110%] w-[110%] mix-blend-screen will-change-transform"
        style={{
          x: reduceMotion ? 0 : chromaBlueX,
          y: reduceMotion ? 0 : chromaBlueY,
          opacity: reduceMotion ? 0 : chromaOpacity,
          WebkitMaskImage: reduceMotion ? "none" : localWarpMask,
          maskImage: reduceMotion ? "none" : localWarpMask,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      >
        {renderMedia("h-full w-full opacity-54 saturate-[1.25] contrast-[1.1] [filter:sepia(1)_hue-rotate(170deg)_saturate(2.1)]")}
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(242,239,232,0),rgba(242,239,232,0.015)_58%,rgba(242,239,232,0.24))]" />
      <motion.div
        className="pointer-events-none absolute inset-[-12%] mix-blend-screen"
        style={{
          x: reduceMotion ? 0 : sheenX,
          y: reduceMotion ? 0 : sheenY,
          opacity: reduceMotion ? 0 : chromaOpacity,
          WebkitMaskImage: reduceMotion ? "none" : localWarpMask,
          maskImage: reduceMotion ? "none" : localWarpMask,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          background:
            "linear-gradient(112deg, transparent 0%, rgba(255,255,255,0.16) 36%, rgba(255,255,255,0.05) 48%, transparent 62%)",
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.12) 42%, transparent 57%)",
        }}
      />

      <figcaption className="absolute bottom-5 left-5 right-5">
        <div className="inline-flex rounded-full border border-white/55 bg-white/28 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-neutral-800/72 shadow-[0_10px_34px_rgba(0,0,0,0.08)] backdrop-blur-md">
          {asset.label}
        </div>
      </figcaption>
    </motion.figure>
  );
}

function AtlasChapter({ goTo }: { goTo: (path: string) => void }) {
  const target = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 25, mass: 0.45 });

  const driftA = useTransform(progress, [0, 1], ["-6vw", "7vw"]);
  const driftB = useTransform(progress, [0, 1], ["10vh", "-14vh"]);
  const driftC = useTransform(progress, [0, 1], ["0deg", "18deg"]);
  const handoffY = useTransform(progress, [0, 0.24], ["5vh", "-3vh"]);
  const handoffOpacity = useTransform(progress, [0, 0.08, 0.28], [0.72, 1, 0.82]);
  const fragmentX = useTransform(progress, [0, 0.28], ["5vw", "-2vw"]);
  const fragmentRotate = useTransform(progress, [0, 0.28], ["-5deg", "1deg"]);
  const connectorScale = useTransform(progress, [0.13, 0.38, 0.88], [0, 1, 0.78]);
  const connectorOpacity = useTransform(progress, [0.1, 0.26, 0.9], [0, 1, 0.44]);

  return (
    <section
      ref={target}
      id="atlas"
      data-header-scene="living-atlas"
      className="relative px-4 pb-24 pt-8 sm:px-6 lg:px-8"
    >
      <div className="relative mx-auto mb-0 grid min-h-[68vh] w-[min(94vw,1640px)] items-center gap-12 overflow-hidden border-t border-neutral-950/12 py-10 xl:grid-cols-[0.45fr_0.55fr]">
        <motion.div style={{ y: handoffY, opacity: handoffOpacity }}>
          <div className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Cinematic atlas</div>
          <h2 className="mt-5 max-w-[10ch] text-[64px] font-normal leading-[0.82] tracking-[-0.08em] text-neutral-950 sm:text-[96px] xl:text-[132px]">
            The work opens as a living canvas.
          </h2>
          <p className="mt-8 max-w-[43rem] text-[17px] leading-[1.85] text-neutral-600">
            Instead of presenting projects as cards, this section treats them as fragments of one practice:
            web walkthroughs, VR captures, product details, workflow tools, mobile surfaces, and atmospheric fields.
          </p>
        </motion.div>

        <motion.div
          className="relative min-h-[31rem] xl:min-h-[40rem]"
          style={{ x: fragmentX, rotate: fragmentRotate }}
        >
          <div className="pointer-events-none absolute left-[4%] top-[13%] h-px w-[88%] rotate-[-12deg] bg-gradient-to-r from-transparent via-neutral-950/18 to-transparent" />
          <div className="pointer-events-none absolute left-[18%] top-[5%] h-[36rem] w-[36rem] rounded-full border border-neutral-950/[0.055]" />
          <div className="pointer-events-none absolute bottom-[8%] right-[3%] h-px w-[78%] rotate-[8deg] bg-gradient-to-r from-transparent via-neutral-950/14 to-transparent" />

          <motion.div
            className="absolute left-[2%] top-[6%] h-[52%] w-[58%] overflow-hidden border border-white/70 bg-neutral-950 shadow-[0_44px_130px_rgba(0,0,0,0.16)]"
            style={{ clipPath: "polygon(0 8%, 100% 0, 92% 92%, 8% 100%)" }}
            initial={{ opacity: 0, y: 54, rotate: -4 }}
            whileInView={{ opacity: 1, y: 0, rotate: -2 }}
            viewport={{ once: false, amount: 0.34 }}
            transition={{ duration: 0.95, ease }}
          >
            <video
              className="h-full w-full object-cover saturate-[1.05] contrast-[1.04]"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={media.whisperDetail}
            >
              <source src={media.whisperDesktopVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.22))]" />
          </motion.div>

          <motion.div
            className="absolute right-[2%] top-[20%] h-[43%] w-[39%] overflow-hidden border border-white/60 bg-neutral-950 shadow-[0_34px_110px_rgba(0,0,0,0.14)]"
            style={{ clipPath: "polygon(8% 0, 100% 7%, 91% 100%, 0 88%)" }}
            initial={{ opacity: 0, y: 70, rotate: 5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 3 }}
            viewport={{ once: false, amount: 0.34 }}
            transition={{ duration: 1, delay: 0.08, ease }}
          >
            <video
              className="h-full w-full object-cover saturate-[1.03] contrast-[1.06]"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={media.whisperVrPoster}
            >
              <source src={media.whisperVrVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/18" />
          </motion.div>

          <motion.div
            className="absolute bottom-[4%] left-[28%] h-[28%] w-[45%] overflow-hidden border border-white/70 bg-white/20 shadow-[0_28px_90px_rgba(0,0,0,0.12)]"
            style={{ clipPath: "polygon(5% 0, 100% 9%, 94% 100%, 0 89%)" }}
            initial={{ opacity: 0, y: 58, rotate: -1 }}
            whileInView={{ opacity: 1, y: 0, rotate: 2 }}
            viewport={{ once: false, amount: 0.34 }}
            transition={{ duration: 0.95, delay: 0.14, ease }}
          >
            <img src={media.whisperMobile} alt="" className="h-full w-full object-cover saturate-[0.98] contrast-[1.03]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(242,239,232,0),rgba(242,239,232,0.18))]" />
          </motion.div>

          <div className="absolute left-[3%] bottom-[13%] rounded-full border border-neutral-950/10 bg-white/58 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-neutral-500 backdrop-blur">
            spatial proof turns into atlas
          </div>
          <div className="absolute right-[9%] bottom-[10%] rounded-full border border-neutral-950/10 bg-white/48 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-neutral-500 backdrop-blur">
            scene 04 / atlas
          </div>
        </motion.div>
      </div>

      <div className="relative mx-auto w-[min(94vw,1640px)]">
        <motion.div
          className="pointer-events-none absolute left-[7%] right-[7%] top-0 z-10 hidden h-px origin-left bg-gradient-to-r from-transparent via-neutral-950/32 to-transparent xl:block"
          style={{ scaleX: connectorScale, opacity: connectorOpacity }}
        />
        <motion.div
          className="pointer-events-none absolute left-[34%] top-0 z-10 hidden h-[10rem] w-px origin-top bg-gradient-to-b from-neutral-950/24 to-transparent xl:block"
          style={{ scaleY: connectorScale, opacity: connectorOpacity }}
        />
        <motion.div
          className="pointer-events-none absolute left-[8%] top-[10%] h-[76rem] w-[76rem] rounded-full border border-neutral-950/[0.045]"
          style={{ x: driftA, y: driftB, rotate: driftC }}
        />

        {storyFrames.map((frame, frameIndex) => (
          <article
            key={frame.id}
            className="relative min-h-[calc(100vh-5rem)] border-t border-neutral-950/12 py-14 last:border-b"
          >
            <div className="grid min-h-[calc(100vh-12rem)] gap-8 xl:grid-cols-[0.32fr_0.68fr] xl:items-center">
              <motion.div
                className="relative z-20"
                initial={{ opacity: 0, x: -34 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.85, ease }}
              >
                <div className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">{frame.eyebrow}</div>
                <KineticTitle
                  as="h3"
                  text={frame.title}
                  className="mt-5 max-w-[9.5ch] text-[56px] font-normal leading-[0.84] tracking-[-0.076em] text-neutral-950 sm:text-[82px] xl:text-[104px]"
                />
                <p className="mt-7 max-w-[35rem] text-[16px] leading-[1.85] text-neutral-600">{frame.text}</p>

                {frame.route && (
                  <button
                    type="button"
                    onClick={() => goTo(frame.route as string)}
                    className="mt-8 rounded-full border border-neutral-950 bg-neutral-950 px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
                  >
                    Open related proof →
                  </button>
                )}
              </motion.div>

              <div className="relative min-h-[660px] xl:min-h-[820px] xl:origin-center xl:translate-x-[3vw] xl:scale-[1.06]">
                {frame.media.map((asset, assetIndex) => (
                  <StoryMedia
                    key={`${frame.id}-${asset.label}`}
                    asset={asset}
                    index={assetIndex + frameIndex}
                  />
                ))}

                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-950/8" />
                <div className="pointer-events-none absolute left-[9%] top-[33%] h-px w-[84%] rotate-[-12deg] bg-gradient-to-r from-transparent via-neutral-950/14 to-transparent" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function GrammarChapter() {
  const { targetRef, activeIndex } = useScrollActiveIndex(grammar.length);

  return (
    <Chapter
      id="grammar"
      headerScene="living-grammar"
      className="relative min-h-screen px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid min-h-[calc(100vh-12rem)] w-[min(94vw,1640px)] items-center gap-14 xl:grid-cols-[0.48fr_0.52fr]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Interface grammar</div>
          <h2 className="mt-7 max-w-[9.5ch] text-[62px] font-normal leading-[0.82] tracking-[-0.078em] text-neutral-950 sm:text-[94px] xl:text-[126px]">
            The interface is treated as a living field.
          </h2>
          <p className="mt-8 max-w-[38rem] text-[17px] leading-[1.85] text-neutral-600">
            I treat interface as a habitat, not a layout. Motion is not decoration. It marks
            state, attention, distance, memory, and transition.
          </p>
        </div>

        <div className="relative">
          <div className="mb-10 border-y border-neutral-950/14 py-8">
            <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Core formula</div>
            <div className="mt-5 text-[42px] leading-tight tracking-[-0.07em] text-neutral-950 sm:text-[70px]">
              signal → state → atmosphere → reveal → memory
            </div>
          </div>

          <div ref={targetRef} className="grid">
            {grammar.map(([word, note], index) => {
              const active = activeIndex === index;

              return (
              <motion.div
                key={word}
                className={[
                  "relative grid gap-4 overflow-hidden border-t py-5 transition duration-300 md:grid-cols-[0.2fr_0.32fr_0.48fr]",
                  active
                    ? "border-neutral-950/34"
                    : "border-neutral-950/12",
                ].join(" ")}
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.28 }}
                transition={{ duration: 0.72, delay: index * 0.05, ease }}
              >
                {active ? (
                  <motion.div
                    layoutId="grammar-active-line"
                    className="absolute bottom-4 left-0 top-4 w-px bg-neutral-950"
                    transition={{ duration: 0.42, ease }}
                  />
                ) : null}
                <div className={active ? "text-[11px] uppercase tracking-[0.18em] text-neutral-950" : "text-[11px] uppercase tracking-[0.18em] text-neutral-300"}>0{index + 1}</div>
                <div className={active ? "text-[34px] leading-none tracking-[-0.06em] text-neutral-950" : "text-[34px] leading-none tracking-[-0.06em] text-neutral-950/72"}>{word}</div>
                <p className={active ? "text-[15px] leading-7 text-neutral-800" : "text-[15px] leading-7 text-neutral-600"}>{note}</p>
              </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Chapter>
  );
}

function PracticeChapter({ onOpenProject }: { onOpenProject?: () => void }) {
  const { targetRef, activeIndex } = useScrollActiveIndex(practiceRows.length);

  return (
    <Chapter
      id="practice"
      headerScene="living-practice"
      className="relative min-h-screen px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid min-h-[calc(100vh-10rem)] w-[min(94vw,1640px)] gap-12 xl:grid-cols-[0.42fr_0.58fr] xl:items-center">
        <div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Practice model</div>
          <h2 className="mt-5 max-w-[10ch] text-[58px] font-normal leading-[0.84] tracking-[-0.075em] text-neutral-950 sm:text-[90px] xl:text-[126px]">
            Between delivery and research.
          </h2>
          <p className="mt-8 max-w-[40rem] text-[17px] leading-[1.85] text-neutral-600">
            The same research that shapes immersive environments also improves product clarity,
            storytelling, conversion flow, multilingual structure, and long-term interface quality.
          </p>
        </div>

        <div ref={targetRef} className="border-y border-neutral-950/14">
          {practiceRows.map(([title, text], index) => {
            const active = activeIndex === index;

            return (
            <motion.div
              key={title}
              className={[
                "relative grid gap-5 overflow-hidden border-b py-7 transition duration-300 last:border-b-0 md:grid-cols-[0.16fr_0.34fr_0.5fr] md:items-start",
                active ? "border-neutral-950/32" : "border-neutral-950/12",
              ].join(" ")}
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.24 }}
              transition={{ duration: 0.72, delay: index * 0.04, ease }}
            >
              {active ? (
                <motion.div
                  layoutId="practice-active-line"
                  className="absolute bottom-5 left-0 top-5 w-px bg-neutral-950"
                  transition={{ duration: 0.42, ease }}
                />
              ) : null}
              <div className={active ? "text-[11px] uppercase tracking-[0.18em] text-neutral-950" : "text-[11px] uppercase tracking-[0.18em] text-neutral-300"}>0{index + 1}</div>
              <h3 className={active ? "text-[32px] font-normal leading-none tracking-[-0.06em] text-neutral-950 md:text-[42px]" : "text-[32px] font-normal leading-none tracking-[-0.06em] text-neutral-950/76 md:text-[42px]"}>
                {title}
              </h3>
              <p className={active ? "text-[15px] leading-7 text-neutral-800" : "text-[15px] leading-7 text-neutral-600"}>{text}</p>
            </motion.div>
            );
          })}
        </div>
      </div>

      <div
        data-header-scene="living-closing"
        className="hidden"
      >
        <div className="grid gap-8 xl:grid-cols-[0.66fr_0.34fr] xl:items-end">
          <div className="relative">
            <motion.div
              className="pointer-events-none absolute -top-12 left-0 h-px w-full origin-left bg-gradient-to-r from-neutral-950/0 via-neutral-950/36 to-neutral-950/0"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: false, amount: 0.36 }}
              transition={{ duration: 0.9, ease }}
            />
            <div className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Closing signal</div>
            <h2 className="mt-5 max-w-[14ch] text-[54px] font-normal leading-[0.84] tracking-[-0.075em] text-neutral-950 sm:text-[88px] xl:text-[120px]">
              If your project needs more than a website, start with the system.
            </h2>
            <p className="mt-7 max-w-[46rem] text-[17px] leading-[1.85] text-neutral-600">
              I work on projects where visual direction, technical architecture, interaction,
              content, and atmosphere need to become one coherent digital environment.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenProject}
            className="group relative overflow-hidden rounded-full border border-neutral-950 bg-neutral-950 px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-white shadow-[0_22px_64px_rgba(17,17,17,0.18)] transition hover:-translate-y-0.5 hover:bg-neutral-800"
          >
            Start a project →
          </button>
        </div>
      </div>
    </Chapter>
  );
}

export default function StudioIndex({
  drawerOpen = false,
  onOpenProject,
  onCloseProject,
  noIndex = false,
}: PageProps) {
  const navigate = useNavigate();
  const activeId = useActiveStudioSection();

  const goTo = (path: string) => {
    startSpaPageTransition(navigate, path, () => {
      onCloseProject?.();
    });
  };

  const scrollTo = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;

    const headerOffset = 76;
    const targetTop = Math.max(
      0,
      section.getBoundingClientRect().top + window.scrollY - headerOffset,
    );

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });
  };

  return (
    <>
      {noIndex ? <StudioNoIndexMeta /> : null}
      <Header drawerOpen={drawerOpen} onOpenProject={onOpenProject} onCloseProject={onCloseProject} />

      <PageSurface className="relative min-h-screen overflow-x-hidden bg-transparent text-neutral-950">
        <AtmosphericSiteShell preset="living" />
        <SectionRail
          items={studioRailItems}
          activeId={activeId}
          onSelect={scrollTo}
          label="Studio Index sections"
        />

        <main className="relative z-10">
          <OpeningChapter
            onSystems={() => scrollTo("systems")}
            onWork={() => goTo("/work")}
            onImmersive={() => goTo("/immersive")}
          />

          <SystemsChapter />

          <WhisperChapter onOpen={() => goTo("/immersive")} />

          <AtlasChapter goTo={goTo} />

          <GrammarChapter />

          <PracticeChapter onOpenProject={onOpenProject} />
        </main>

        <SiteFooterV2 onOpenProject={onOpenProject} variant="living" />
      </PageSurface>
    </>
  );
}
