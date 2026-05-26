import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { useNavigate } from "react-router-dom";

import { cases } from "../data/cases";
import { immersiveItems } from "../data/immersive";
import AtmosphericSiteShell from "../ui/atmosphere/AtmosphericSiteShell";
import Header from "../ui/Header";
import LiveBuildSignal from "../ui/studio-index/LiveBuildSignal";
import MobileChapter from "../ui/MobileChapter";
import MobileMotionSection from "../ui/mobile-motion/MobileMotionSection";
import PageSurface from "../ui/PageSurface";
import SectionRail, { type SectionRailItem } from "../ui/SectionRail";
import SiteFooterV2 from "../ui/SiteFooterV2";
import StudioHeroField from "../ui/StudioHeroField";
import FormulaSignalStrand from "../ui/StudioSystemStrand";
import { startSpaPageTransition } from "../ui/pageTransition";
import { useSound } from "../stage/audio/useSound";
import { useDeferredRouteContent } from "../hooks/useDeferredRouteContent";

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
  tags: string[];
  src: string;
};

type StoryMediaAsset = {
  kind: "image" | "video";
  src: string;
  poster?: string;
  label: string;
  route?: string;
  objectPosition?: string;
};

type StoryPlaneLayout = {
  className: string;
  shape: string;
  shadow: string;
  label: string;
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
  whisperVrWide: "/immersive/Whisper/desktop/whisper-vr-2.jpg",
  whisperHeroImage: "/immersive/Whisper/desktop/whisper-hero.jpg",
  whisperGallery: "/immersive/Whisper/desktop/whisper-3.jpg",
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
  creatoropsMechanics: "/cases/creatorops/desktop/creatorops-7.webp",

  sprintcrmHero: "/cases/sprintcrm/desktop/sprintcrm-hero.webp",

  print: casePoster("print-border-studio", "/cases/print-border-studio/desktop/psb-hero.webp"),
  printVideo: "/cases/print-border-studio/video/psb-video.mp4",
  printPrepCover: "/cases/print-border-studio/desktop/psb-4.webp",
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
    tags: ["WebGL scenes", "Motion logic", "Stage states"],
    src: media.arcwave,
  },
  {
    index: "02",
    title: "WHISPER XR",
    label: "spatial proof layer",
    text: "A cinematic Web / XR exhibition system connecting photography, print logic, mobile presentation, AR preview, and Quest-tested spatial experience.",
    proof: "A photographic archive becomes website, collector surface, and spatial room.",
    tags: ["Spatial proof", "Collector logic", "XR layer"],
    src: media.whisperPoster,
  },
  {
    index: "03",
    title: "Living Interface OS",
    label: "Presence OS / signal state layer",
    text: "A signal-state layer where route context, attention, motion, sound, media depth, and interaction states shape how the interface behaves.",
    proof: "The site stops acting like linked pages and starts behaving like one responsive environment.",
    tags: ["Signal state", "Presence logic", "Memory layer", "Adaptive interface"],
    src: media.creatorops,
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
    id: "product-theatre",
    eyebrow: "Scene 01 / commercial atmosphere",
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
        route: "/work/house-of-lune",
      },
      {
        kind: "video",
        src: media.advisoryVideo,
        poster: media.advisory,
        label: "advisory buyer journey",
        route: "/work/barcelona-private-advisory",
      },
      {
        kind: "image",
        src: media.houseDetail,
        label: "object detail",
        route: "/work/house-of-lune",
      },
    ],
  },
  {
    id: "workflow-machine",
    eyebrow: "Scene 02 / product mechanics",
    title: "Tools expose the system behind production.",
    text:
      "CreatorOps, Sprint CRM, and Print Border Studio move the portfolio from visual showcase into product logic: publishing, operator workflow, export, preparation, and collector-facing presentation.",
    route: "/work",
    media: [
      {
        kind: "video",
        src: media.creatoropsVideo,
        poster: media.creatoropsMechanics,
        label: "creator workflow system",
        route: "/work/creatorops",
      },
      {
        kind: "video",
        src: media.printVideo,
        poster: media.printPrepCover,
        label: "museum print preparation",
        route: "/work/print-border-studio",
      },
      {
        kind: "image",
        src: media.sprintcrmHero,
        label: "operator CRM surface",
        route: "/work/sprintcrm",
      },
    ],
  },
  {
    id: "field-language",
    eyebrow: "Scene 03 / interface field",
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
        route: "/work/fluid-exhibition",
      },
      {
        kind: "video",
        src: media.arcwaveVideo,
        poster: media.arcwave,
        label: "arcwave signal surface",
        route: "/work/arcwave-integrations",
      },
      {
        kind: "video",
        src: media.casaVideo,
        poster: media.casa,
        label: "hospitality rhythm",
        route: "/work/casa-nube",
      },
    ],
  },
];

const immersiveAtlasMedia = immersiveItems
  .map((item): StoryMediaAsset | null => {
    const cover =
      item.previewPoster ??
      item.frames?.find((frame) => frame.device === "desktop")?.src ??
      item.frames?.[0]?.src;

    if (!cover) return null;

    return {
      kind: "image",
      src: cover,
      label: item.supportLabel ?? item.title,
      route: `/immersive/${item.slug}`,
    };
  })
  .filter((asset): asset is StoryMediaAsset => asset !== null)
  .slice(0, 4);

const atlasIntroMedia: StoryMediaAsset[] = immersiveAtlasMedia.length
  ? immersiveAtlasMedia
  : [
      {
        kind: "image",
        src: media.whisperPoster,
        label: "Spatial proof",
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

const proofSurfaceAssets: StoryMediaAsset[] = [
  {
    kind: "video",
    src: media.houseVideo,
    poster: media.house,
    label: "Product theatre",
    route: "/work/house-of-lune",
    objectPosition: "center 32%",
  },
  {
    kind: "video",
    src: media.advisoryVideo,
    poster: media.advisory,
    label: "Advisory journey",
    route: "/work/barcelona-private-advisory",
    objectPosition: "center 40%",
  },
  {
    kind: "video",
    src: media.creatoropsVideo,
    poster: media.creatoropsMechanics,
    label: "Workflow surface",
    route: "/work/creatorops",
    objectPosition: "center 28%",
  },
];

const proofSurfaceModes = [
  ["01", "Product theatre", "Object, atmosphere, and desire staged as proof."],
  ["02", "Advisory journey", "Trust, selection, and inquiry shaped as a calm path."],
  ["03", "Workflow surface", "Operational logic made visible before conversion."],
];

const visualLanguageAssets: StoryMediaAsset[] = [
  {
    kind: "image",
    src: media.fluid,
    label: "FLUID Exhibition Field",
    route: "/work/fluid-exhibition",
    objectPosition: "center 38%",
  },
  {
    kind: "image",
    src: media.arcwave,
    label: "ARCWAVE Signal Surface",
    route: "/work/arcwave-integrations",
    objectPosition: "center 34%",
  },
  {
    kind: "image",
    src: media.casa,
    label: "Hospitality Rhythm",
    route: "/work/casa-nube",
    objectPosition: "center 42%",
  },
];

const mobileCoreSystems = [
  ["01", "WebGL Stage System", "Directed scene logic for atmosphere, reveal, and scroll states.", "stage logic"],
  ["02", "Living Interface OS", "Route context, motion, media depth, and attention states.", "presence state"],
  ["03", "Case System Story Engine", "Case pages structured as proof, method, media, and conversion path.", "case path"],
];

const mobileSupportingLayers = [
  ["04", "Available Systems", "Reusable modules for premium sites, products, archives, and offers."],
];

const whisperProofAssets: StoryMediaAsset[] = [
  {
    kind: "image",
    src: media.whisperPoster,
    label: "Web exhibition",
    route: "/immersive/whisper",
  },
  {
    kind: "image",
    src: media.whisperMobile,
    label: "Mobile proof",
    route: "/immersive/whisper",
  },
  {
    kind: "image",
    src: media.whisperVrWide,
    label: "Quest capture",
    route: "/immersive/whisper",
  },
  {
    kind: "image",
    src: media.whisperDetail,
    label: "Print logic",
    route: "/immersive/whisper",
  },
];

const mobilePracticeBridgeRows = [
  ["01", "Premium website", "A high-trust interface with editorial direction, proof, and conversion clarity."],
  ["02", "Product surface", "A product, offer, or advisory flow staged as guided evidence."],
  ["03", "Immersive prototype", "A spatial or cinematic prototype for archive, exhibition, or future-facing proof."],
];

const mobilePrimaryCta =
  "inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-950 bg-neutral-950 px-5 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_18px_48px_rgba(17,17,17,0.14)] transition active:translate-y-px";

const mobileSecondaryCta =
  "inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-950/12 bg-white/66 px-5 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-800 shadow-[0_12px_34px_rgba(17,17,17,0.06)] backdrop-blur transition active:translate-y-px";

const storyPlaneLayouts = [
  {
    className: "left-[4%] top-[8%] h-[54%] w-[58%] z-20",
    shape: "polygon(0 5%, 100% 0, 95% 92%, 7% 100%)",
    shadow: "shadow-[0_42px_130px_rgba(18,18,18,0.16)]",
    label: "left-[7%] top-[calc(100%+0.75rem)]",
  },
  {
    className: "right-[3%] top-[17%] h-[43%] w-[41%] z-30",
    shape: "polygon(7% 0, 100% 6%, 92% 100%, 0 90%)",
    shadow: "shadow-[0_34px_110px_rgba(18,18,18,0.14)]",
    label: "right-[7%] top-[calc(100%+0.75rem)]",
  },
  {
    className: "left-[34%] bottom-[8%] h-[31%] w-[40%] z-40",
    shape: "polygon(5% 0, 100% 8%, 93% 100%, 0 90%)",
    shadow: "shadow-[0_28px_90px_rgba(18,18,18,0.12)]",
    label: "left-[8%] top-[calc(100%+0.7rem)]",
  },
] satisfies readonly StoryPlaneLayout[];

const atlasIntroPlaneLayouts = [
  {
    className: "left-[3%] top-[8%] h-[54%] w-[57%] z-30",
    shape: "polygon(0 5%, 100% 0, 95% 92%, 7% 100%)",
    shadow: "shadow-[0_44px_136px_rgba(18,18,18,0.16)]",
    label: "left-[7%] top-[calc(100%+0.75rem)]",
  },
  {
    className: "right-[2%] top-[16%] h-[40%] w-[42%] z-40",
    shape: "polygon(7% 0, 100% 6%, 92% 100%, 0 90%)",
    shadow: "shadow-[0_34px_106px_rgba(18,18,18,0.13)]",
    label: "right-[7%] top-[calc(100%+0.75rem)]",
  },
  {
    className: "left-[30%] bottom-[7%] h-[32%] w-[39%] z-50",
    shape: "polygon(5% 0, 100% 8%, 93% 100%, 0 90%)",
    shadow: "shadow-[0_28px_88px_rgba(18,18,18,0.115)]",
    label: "left-[8%] top-[calc(100%+0.7rem)]",
  },
  {
    className: "right-[8%] bottom-[1%] h-[28%] w-[34%] z-20",
    shape: "polygon(4% 8%, 100% 0, 94% 92%, 0 100%)",
    shadow: "shadow-[0_24px_74px_rgba(18,18,18,0.1)]",
    label: "right-[7%] bottom-[calc(100%+0.7rem)]",
  },
] satisfies readonly StoryPlaneLayout[];

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

function useStudioWhisperChromeActive() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let frame = 0;

    const updateActive = () => {
      frame = 0;

      const videoSurface = document.querySelector<HTMLElement>("[data-studio-whisper-media]");
      if (!videoSurface) {
        setActive(false);
        return;
      }

      const rect = videoSurface.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const headerOffset = 76;
      const dockProbe = Math.max(headerOffset, viewportHeight - 150);

      setActive(rect.top <= headerOffset && rect.bottom >= dockProbe);
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActive);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return active;
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

function MobileAssetMedia({
  asset,
  className = "",
  objectPosition = "center",
}: {
  asset: StoryMediaAsset;
  className?: string;
  objectPosition?: string;
}) {
  const classes = `h-full w-full object-cover ${className}`;

  if (asset.kind === "video") {
    return (
      <video
        className={classes}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={asset.poster}
        style={{ objectPosition }}
      >
        <source src={asset.src} type="video/mp4" />
      </video>
    );
  }

  return <img src={asset.src} alt="" className={classes} style={{ objectPosition }} />;
}

function MobileSpatialStage({
  assets,
  onOpen,
  className = "",
  dark = false,
  objectPosition = "center",
  showSelectors = true,
  activeIndex: controlledActiveIndex,
  onActiveIndexChange,
  variant = "proof",
}: {
  assets: StoryMediaAsset[];
  onOpen: (path: string) => void;
  className?: string;
  dark?: boolean;
  objectPosition?: string;
  showSelectors?: boolean;
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  variant?: "proof" | "grammar" | "cinematic";
}) {
  const [internalActiveIndex, setInternalActiveIndex] = useState(0);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const suppressOpenRef = useRef(false);
  const activeIndex = controlledActiveIndex ?? internalActiveIndex;
  const active = assets[activeIndex] ?? assets[0];
  const ghostA = assets[(activeIndex + 1) % assets.length] ?? active;
  const ghostB = assets[(activeIndex + 2) % assets.length] ?? active;
  const activeObjectPosition = active?.objectPosition ?? objectPosition;
  const ghostAObjectPosition = ghostA?.objectPosition ?? objectPosition;
  const ghostBObjectPosition = ghostB?.objectPosition ?? objectPosition;
  const stageHeight =
    variant === "grammar"
      ? "min-h-[21rem] sm:min-h-[25rem] md:min-h-[29rem]"
      : variant === "cinematic"
        ? "min-h-[24rem] sm:min-h-[29rem] md:min-h-[33rem]"
        : "min-h-[28.5rem] sm:min-h-[34rem] md:min-h-[38rem]";
  const activePlane =
    variant === "grammar"
      ? "left-[1%] top-[3.5rem] h-[61%] w-[94%] -rotate-[2.5deg]"
      : variant === "cinematic"
        ? "left-[0%] top-[4.6rem] h-[68%] w-[96%] -rotate-[3deg]"
        : "left-[-2%] top-[5.1rem] h-[64%] w-[101%] -rotate-[4deg]";
  const ghostAPlane =
    variant === "grammar"
      ? "right-[-5%] top-12 h-[50%] w-[50%] rotate-[4deg] opacity-40"
      : variant === "cinematic"
        ? "right-[-8%] top-[4.95rem] h-[58%] w-[58%] rotate-[5deg] opacity-42"
        : "right-[-14%] top-[4.55rem] h-[54%] w-[58%] rotate-[6deg] opacity-45";
  const ghostBPlane =
    variant === "grammar"
      ? "bottom-8 left-[12%] h-[34%] w-[52%] -rotate-[5deg] opacity-42"
      : variant === "cinematic"
        ? "bottom-6 left-[5%] h-[38%] w-[54%] -rotate-[5deg] opacity-45"
        : "bottom-8 left-[-2%] h-[38%] w-[58%] -rotate-[7deg] opacity-46";

  const setStageIndex = (nextIndex: number) => {
    setInternalActiveIndex(nextIndex);
    onActiveIndexChange?.(nextIndex);
  };

  const stepStageIndex = (direction: 1 | -1) => {
    if (assets.length < 2) return;
    setStageIndex((activeIndex + direction + assets.length) % assets.length);
  };

  const openActive = () => {
    if (suppressOpenRef.current) {
      suppressOpenRef.current = false;
      return;
    }
    if (active?.route) onOpen(active.route);
  };

  const handleStagePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    swipeStartRef.current = { x: event.clientX, y: event.clientY };
  };

  const handleStagePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const isHorizontalSwipe = Math.abs(deltaX) > 44 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15;

    if (!isHorizontalSwipe) return;

    suppressOpenRef.current = true;
    stepStageIndex(deltaX < 0 ? 1 : -1);
    window.setTimeout(() => {
      suppressOpenRef.current = false;
    }, 360);
  };

  const handleDeckDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipePower = Math.abs(info.offset.x) + Math.abs(info.velocity.x) * 0.18;
    if (swipePower < 72) return;

    suppressOpenRef.current = true;
    stepStageIndex(info.offset.x < 0 ? 1 : -1);
    window.setTimeout(() => {
      suppressOpenRef.current = false;
    }, 360);
  };

  if (variant === "proof") {
    return (
      <div className={["grid gap-4", className].filter(Boolean).join(" ")} data-sound-safe-area>
        <div
          className="relative mx-[-1rem] min-h-[30rem] touch-pan-y overflow-hidden px-4 sm:min-h-[35rem] md:min-h-[39rem]"
          style={{ perspective: "1400px", transformStyle: "preserve-3d" }}
        >
          <div className="pointer-events-none absolute left-[5%] top-[12%] h-[76%] w-[90%] rounded-[50%] border border-neutral-950/[0.06]" />
          <div className="pointer-events-none absolute left-[-8%] top-[54%] h-px w-[118%] rotate-[-9deg] bg-gradient-to-r from-transparent via-neutral-950/16 to-transparent" />
          <div className="pointer-events-none absolute right-[3%] top-2 z-40 border-y border-neutral-950/12 bg-white/62 px-3 py-1.5 font-mono text-[7px] uppercase tracking-[0.18em] text-neutral-500 shadow-[0_10px_28px_rgba(0,0,0,0.05)] backdrop-blur">
            Swipe proof
          </div>

          <motion.div
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            dragMomentum={false}
            onDragEnd={handleDeckDragEnd}
            style={{ touchAction: "pan-y", transformStyle: "preserve-3d" }}
          >
            {assets.map((asset, index) => {
              let offset = index - activeIndex;
              while (offset > assets.length / 2) offset -= assets.length;
              while (offset < -assets.length / 2) offset += assets.length;

              if (Math.abs(offset) > 1.8) return null;

              const activePlane = offset === 0;
              const x = offset * 66;
              const y = activePlane ? 0 : offset < 0 ? 31 : 20;
              const rotateZ = activePlane ? -4 : offset < 0 ? -11 : 9;
              const rotateY = activePlane ? 0 : offset < 0 ? 18 : -18;
              const scale = activePlane ? 1 : 0.76;
              const opacity = activePlane ? 1 : 0.42;
              const shape = activePlane
                ? "polygon(0 5%, 100% 0, 95% 91%, 7% 100%)"
                : offset < 0
                  ? "polygon(7% 0, 100% 6%, 92% 100%, 0 90%)"
                  : "polygon(0 8%, 100% 0, 94% 92%, 6% 100%)";

              return (
                <motion.button
                  key={asset.label}
                  type="button"
                  aria-label={`Open ${asset.label}`}
                  aria-pressed={activePlane}
                  disabled={activePlane && !asset.route}
                  onClick={() => {
                    if (!activePlane) {
                      setStageIndex(index);
                      return;
                    }

                    openActive();
                  }}
                  className={[
                    "group absolute left-1/2 top-[53%] h-[21.5rem] w-[96%] max-w-[32rem] overflow-hidden border border-white/80 text-left shadow-[0_36px_118px_rgba(17,17,17,0.18)] outline-none focus-visible:ring-2 focus-visible:ring-neutral-950/40 sm:h-[25rem] md:h-[28rem]",
                    activePlane ? "bg-neutral-950" : "bg-white/22",
                    asset.route ? "cursor-pointer" : "cursor-default",
                  ].join(" ")}
                  style={{
                    clipPath: shape,
                    zIndex: 30 - Math.abs(offset) * 5,
                    transformStyle: "preserve-3d",
                  }}
                  initial={false}
                  animate={{
                    opacity,
                    x: `calc(-50% + ${x}%)`,
                    y: `calc(-50% + ${y}px)`,
                    rotateZ,
                    rotateY,
                    scale,
                    filter: `blur(${activePlane ? 0 : 0.7}px)`,
                  }}
                  transition={{ duration: 0.64, ease }}
                >
                  <MobileAssetMedia
                    asset={asset}
                    className={`saturate-[1.03] contrast-[1.04] transition duration-700 group-active:scale-[1.018] ${
                      activePlane ? "opacity-100" : "opacity-76 grayscale-[0.08]"
                    }`}
                    objectPosition={asset.objectPosition ?? objectPosition}
                  />
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_52%_28%,rgba(255,255,255,0.06),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.04)_52%,rgba(0,0,0,0.58))]" />
                  <span className="pointer-events-none absolute left-4 top-4 border-y border-white/16 bg-black/10 px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/62 backdrop-blur-sm">
                    {String(index + 1).padStart(2, "0")} / {asset.label}
                  </span>
                  <span className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 font-semibold uppercase tracking-[0.16em] text-white/80">
                    <span className="max-w-[13ch] text-[14px] leading-[1.05]">{asset.label}</span>
                    {asset.route ? <span className="text-[9px]">Open</span> : null}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <div className="grid gap-4 border-t border-neutral-950/10 pt-4">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => stepStageIndex(-1)}
              className="border-y border-neutral-950/16 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 transition hover:border-neutral-950/44 hover:text-neutral-950"
            >
              Prev
            </button>
            <div className="flex items-center gap-2">
              {assets.map((asset, index) => (
                <button
                  key={asset.label}
                  type="button"
                  aria-label={`Show ${asset.label}`}
                  aria-pressed={index === activeIndex}
                  onClick={() => setStageIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeIndex ? "w-8 bg-neutral-950" : "w-1.5 bg-neutral-950/20"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => stepStageIndex(1)}
              className="border-y border-neutral-950/16 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 transition hover:border-neutral-950/44 hover:text-neutral-950"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "cinematic") {
    return (
      <div className={["grid gap-4", className].filter(Boolean).join(" ")} data-sound-safe-area>
        <div
          className="relative mx-[-1rem] min-h-[32rem] touch-pan-y overflow-hidden px-4 sm:min-h-[38rem] md:min-h-[42rem]"
          style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
        >
          <div className="pointer-events-none absolute inset-x-4 top-[13%] h-[76%] rounded-[50%] border border-neutral-950/[0.07]" />
          <div className="pointer-events-none absolute left-[-8%] top-[54%] h-px w-[118%] rotate-[7deg] bg-gradient-to-r from-transparent via-neutral-950/18 to-transparent" />
          <div className="pointer-events-none absolute right-[4%] top-[6.5%] border-y border-neutral-950/12 bg-white/34 px-3 py-1.5 font-mono text-[7px] uppercase tracking-[0.18em] text-neutral-500 backdrop-blur">
            Swipe spatial proof
          </div>

          <motion.div
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            dragMomentum={false}
            onDragEnd={handleDeckDragEnd}
            style={{ touchAction: "pan-y", transformStyle: "preserve-3d" }}
          >
            {assets.map((asset, index) => {
              let offset = index - activeIndex;
              while (offset > assets.length / 2) offset -= assets.length;
              while (offset < -assets.length / 2) offset += assets.length;

              if (Math.abs(offset) > 1.8) return null;

              const activePlane = offset === 0;
              const x = offset * 63;
              const y = activePlane ? 0 : offset < 0 ? 30 : 22;
              const rotateZ = activePlane ? -3.5 : offset < 0 ? -10 : 8;
              const rotateY = activePlane ? 0 : offset < 0 ? 18 : -18;
              const scale = activePlane ? 1 : 0.74;
              const opacity = activePlane ? 1 : 0.43;
              const shape = activePlane
                ? "polygon(3% 0, 100% 5%, 94% 94%, 0 100%)"
                : offset < 0
                  ? "polygon(8% 0, 100% 9%, 90% 100%, 0 88%)"
                  : "polygon(0 9%, 95% 0, 100% 88%, 8% 100%)";

              return (
                <motion.button
                  key={asset.label}
                  type="button"
                  aria-label={`Open ${asset.label}`}
                  aria-pressed={activePlane}
                  disabled={activePlane && !asset.route}
                  onClick={() => {
                    if (!activePlane) {
                      setStageIndex(index);
                      return;
                    }

                    openActive();
                  }}
                  className={[
                    "group absolute left-1/2 top-[50%] h-[23rem] w-[92%] max-w-[31rem] overflow-hidden border text-left shadow-[0_42px_132px_rgba(10,10,10,0.24)] outline-none focus-visible:ring-2 focus-visible:ring-neutral-950/40 sm:h-[27rem] md:h-[30rem]",
                    activePlane ? "border-white/74 bg-neutral-950" : "border-white/28 bg-neutral-950/80",
                    asset.route ? "cursor-pointer" : "cursor-default",
                  ].join(" ")}
                  style={{
                    clipPath: shape,
                    zIndex: 30 - Math.abs(offset) * 5,
                    transformStyle: "preserve-3d",
                  }}
                  initial={false}
                  animate={{
                    opacity,
                    x: `calc(-50% + ${x}%)`,
                    y: `calc(-50% + ${y}px)`,
                    rotateZ,
                    rotateY,
                    scale,
                    filter: `blur(${activePlane ? 0 : 0.7}px)`,
                  }}
                  transition={{ duration: 0.66, ease }}
                >
                  <MobileAssetMedia
                    asset={asset}
                    className={`saturate-[1.08] contrast-[1.08] brightness-[1.03] transition duration-700 group-active:scale-[1.018] ${
                      activePlane ? "opacity-100" : "opacity-74 grayscale-[0.1]"
                    }`}
                    objectPosition={asset.objectPosition ?? objectPosition}
                  />
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_48%_30%,rgba(255,255,255,0.09),transparent_33%),linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.14)_52%,rgba(0,0,0,0.72))]" />
                  <span className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between border-y border-white/15 py-2 font-mono text-[8px] uppercase tracking-[0.17em] text-white/58">
                    <span>WHISPER surface</span>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </span>
                  <span className="pointer-events-none absolute bottom-5 left-5 right-5">
                    <span className="block max-w-[13ch] text-[42px] leading-[0.86] tracking-[-0.055em] text-white drop-shadow-[0_4px_22px_rgba(0,0,0,0.5)]">
                      {asset.label}
                    </span>
                    {asset.route ? (
                      <span className="mt-4 inline-flex border-y border-white/18 px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/62">
                        Open spatial case
                      </span>
                    ) : null}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <div className="grid gap-4 border-t border-neutral-950/10 pt-4">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => stepStageIndex(-1)}
              className="border-y border-neutral-950/16 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 transition hover:border-neutral-950/44 hover:text-neutral-950"
            >
              Prev
            </button>
            <div className="flex items-center gap-2">
              {assets.map((asset, index) => (
                <button
                  key={asset.label}
                  type="button"
                  aria-label={`Show ${asset.label}`}
                  aria-pressed={index === activeIndex}
                  onClick={() => setStageIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeIndex ? "w-8 bg-neutral-950" : "w-1.5 bg-neutral-950/20"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => stepStageIndex(1)}
              className="border-y border-neutral-950/16 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 transition hover:border-neutral-950/44 hover:text-neutral-950"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "grammar") {
    return (
      <div className={["grid gap-4", className].filter(Boolean).join(" ")} data-sound-safe-area>
        <div
          className="relative mx-[-1rem] min-h-[29rem] touch-pan-y overflow-hidden px-4 sm:min-h-[34rem] md:min-h-[38rem]"
          style={{ perspective: "1420px", transformStyle: "preserve-3d" }}
        >
          <div className="pointer-events-none absolute left-[6%] top-[12%] h-[74%] w-[88%] rounded-[50%] border border-neutral-950/[0.06]" />
          <div className="pointer-events-none absolute left-[-8%] top-[54%] h-px w-[118%] rotate-[-8deg] bg-gradient-to-r from-transparent via-neutral-950/16 to-transparent" />
          <div className="pointer-events-none absolute right-[4%] top-2 z-40 border-y border-neutral-950/12 bg-white/62 px-3 py-1.5 font-mono text-[7px] uppercase tracking-[0.18em] text-neutral-500 shadow-[0_10px_28px_rgba(0,0,0,0.05)] backdrop-blur">
            Swipe grammar
          </div>

          <motion.div
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            dragMomentum={false}
            onDragEnd={handleDeckDragEnd}
            style={{ touchAction: "pan-y", transformStyle: "preserve-3d" }}
          >
            {assets.map((asset, index) => {
              let offset = index - activeIndex;
              while (offset > assets.length / 2) offset -= assets.length;
              while (offset < -assets.length / 2) offset += assets.length;

              if (Math.abs(offset) > 1.8) return null;

              const activePlane = offset === 0;
              const x = offset * 66;
              const y = activePlane ? 0 : offset < 0 ? 30 : 20;
              const rotateZ = activePlane ? -4 : offset < 0 ? -11 : 9;
              const rotateY = activePlane ? 0 : offset < 0 ? 18 : -18;
              const scale = activePlane ? 1 : 0.76;
              const opacity = activePlane ? 1 : 0.42;
              const shape = activePlane
                ? "polygon(0 5%, 100% 0, 95% 91%, 7% 100%)"
                : offset < 0
                  ? "polygon(7% 0, 100% 6%, 92% 100%, 0 90%)"
                  : "polygon(0 8%, 100% 0, 94% 92%, 6% 100%)";

              return (
                <motion.button
                  key={asset.label}
                  type="button"
                  aria-label={`Open ${asset.label}`}
                  aria-pressed={activePlane}
                  disabled={activePlane && !asset.route}
                  onClick={() => {
                    if (!activePlane) {
                      setStageIndex(index);
                      return;
                    }

                    openActive();
                  }}
                  className={[
                    "group absolute left-1/2 top-[53%] h-[21rem] w-[96%] max-w-[32rem] overflow-hidden border border-white/80 bg-white/24 text-left shadow-[0_36px_112px_rgba(17,17,17,0.16)] outline-none focus-visible:ring-2 focus-visible:ring-neutral-950/40 sm:h-[25rem] md:h-[28rem]",
                    asset.route ? "cursor-pointer" : "cursor-default",
                  ].join(" ")}
                  style={{
                    clipPath: shape,
                    zIndex: 30 - Math.abs(offset) * 5,
                    transformStyle: "preserve-3d",
                  }}
                  initial={false}
                  animate={{
                    opacity,
                    x: `calc(-50% + ${x}%)`,
                    y: `calc(-50% + ${y}px)`,
                    rotateZ,
                    rotateY,
                    scale,
                    filter: `blur(${activePlane ? 0 : 0.7}px)`,
                  }}
                  transition={{ duration: 0.64, ease }}
                >
                  <MobileAssetMedia
                    asset={asset}
                    className={`saturate-[1.02] contrast-[1.03] transition duration-700 group-active:scale-[1.018] ${
                      activePlane ? "opacity-100" : "opacity-74 grayscale-[0.08]"
                    }`}
                    objectPosition={asset.objectPosition ?? objectPosition}
                  />
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.12),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.03)_52%,rgba(0,0,0,0.48))]" />
                  <span className="pointer-events-none absolute left-4 top-4 border-y border-white/18 bg-black/10 px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/68 backdrop-blur-sm">
                    {String(index + 1).padStart(2, "0")} / visual field
                  </span>
                  <span className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 font-semibold uppercase tracking-[0.16em] text-white/80">
                    <span className="max-w-[13ch] text-[14px] leading-[1.05]">{asset.label}</span>
                    {asset.route ? <span className="text-[9px]">Open</span> : null}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <div className="grid gap-4 border-t border-neutral-950/10 pt-4">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => stepStageIndex(-1)}
              className="border-y border-neutral-950/16 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 transition hover:border-neutral-950/44 hover:text-neutral-950"
            >
              Prev
            </button>
            <div className="flex items-center gap-2">
              {assets.map((asset, index) => (
                <button
                  key={asset.label}
                  type="button"
                  aria-label={`Show ${asset.label}`}
                  aria-pressed={index === activeIndex}
                  onClick={() => setStageIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeIndex ? "w-8 bg-neutral-950" : "w-1.5 bg-neutral-950/20"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => stepStageIndex(1)}
              className="border-y border-neutral-950/16 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 transition hover:border-neutral-950/44 hover:text-neutral-950"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={["grid gap-3", className].filter(Boolean).join(" ")} data-sound-safe-area>
      <div
        className={["relative overflow-visible [touch-action:pan-y]", stageHeight].join(" ")}
        onPointerDown={handleStagePointerDown}
        onPointerUp={handleStagePointerUp}
        onPointerCancel={() => {
          swipeStartRef.current = null;
        }}
      >
        <div className="absolute left-0 top-0 z-40 flex items-center gap-2 border-y border-neutral-950/10 bg-white/30 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-neutral-500 backdrop-blur-[2px]">
          <span className="font-mono text-neutral-400">{String(activeIndex + 1).padStart(2, "0")}</span>
          <span>{active?.label}</span>
        </div>

        <div
          aria-hidden="true"
          className={[
            "absolute overflow-hidden border border-white/68 bg-white/24 shadow-[0_22px_70px_rgba(17,17,17,0.08)]",
            ghostAPlane,
          ].join(" ")}
          style={{ clipPath: "polygon(7% 0, 100% 6%, 92% 100%, 0 90%)" }}
        >
          <MobileAssetMedia asset={ghostA} className="saturate-[0.88] contrast-[0.95] opacity-80" objectPosition={ghostAObjectPosition} />
          <div className="absolute inset-0 bg-white/30" />
        </div>

        <div
          aria-hidden="true"
          className={[
            "absolute overflow-hidden border border-white/70 bg-white/22 shadow-[0_18px_58px_rgba(17,17,17,0.075)]",
            ghostBPlane,
          ].join(" ")}
          style={{ clipPath: "polygon(0 8%, 100% 0, 94% 92%, 6% 100%)" }}
        >
          <MobileAssetMedia asset={ghostB} className="saturate-[0.9] contrast-[0.96] opacity-78" objectPosition={ghostBObjectPosition} />
          <div className="absolute inset-0 bg-white/34" />
        </div>

        <button
          type="button"
          onClick={openActive}
          disabled={!active?.route}
          className={[
            "group absolute overflow-hidden border border-white/80 text-left shadow-[0_34px_104px_rgba(17,17,17,0.16)] transition active:translate-y-px",
            activePlane,
            active?.route ? "cursor-pointer" : "cursor-default",
            dark ? "bg-neutral-950" : "bg-white/24",
          ].join(" ")}
          style={{ clipPath: "polygon(0 5%, 100% 0, 95% 91%, 7% 100%)" }}
        >
          <MobileAssetMedia
            asset={active}
            className="saturate-[1.02] contrast-[1.04] transition duration-500 group-active:scale-[1.015]"
            objectPosition={activeObjectPosition}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.00),rgba(0,0,0,0.03)_54%,rgba(0,0,0,0.45))]" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/78">
            <span>{active?.label}</span>
            {active?.route ? <span>Open</span> : null}
          </div>
        </button>
      </div>

      {showSelectors ? (
        <div className="grid gap-2">
          {assets.map((asset, index) => {
            const activeRow = index === activeIndex;

            return (
              <button
                key={asset.label}
                type="button"
                onClick={() => setStageIndex(index)}
                className={[
                  "flex min-h-11 items-center gap-3 border px-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] transition active:translate-y-px",
                  activeRow
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-neutral-950/10 bg-white/64 text-neutral-500 backdrop-blur",
                ].join(" ")}
              >
                <span className={activeRow ? "text-white/58" : "text-neutral-400"}>{String(index + 1).padStart(2, "0")}</span>
                <span className="truncate">{asset.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function MobileFormulaPanel({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative overflow-hidden border-y border-neutral-950/16 bg-white/[0.12] py-3.5 backdrop-blur-[2px]">
      <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-neutral-950/[0.045]" />
      <div className="relative flex items-center justify-between gap-4 px-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
        <span>Core formula</span>
        <span className="flex items-center gap-2">
          <span className="font-mono text-[8px] tracking-[0.12em] text-neutral-300">{compact ? "03" : "05"}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-950/80" />
        </span>
      </div>
      <div
        className={[
          "relative mt-3 overflow-hidden border-t border-neutral-950/10 px-1 pt-3 font-mono font-semibold uppercase text-neutral-950",
          "whitespace-nowrap tracking-[0.08em]",
          compact ? "text-[8px] leading-none" : "text-[8px] leading-none",
        ].join(" ")}
      >
        SIGNAL / STATE / ATMOS / REVEAL / MEMORY
      </div>
    </div>
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
  const sound = useSound();

  return (
    <Chapter
      id="opening"
      headerScene="living-threshold"
      className="relative overflow-hidden px-4 pb-12 pt-20 sm:px-6 lg:min-h-screen lg:px-8 lg:pb-16 lg:pt-24"
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

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-7rem)] w-full content-center gap-8 py-10 lg:hidden">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-neutral-300/70 bg-white/62 px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] text-neutral-500 backdrop-blur">
            Studio Index
          </span>
          <span className="rounded-full border border-neutral-300/70 bg-white/42 px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] text-neutral-500 backdrop-blur">
            Living systems
          </span>
        </div>

        <div>
          <h1 className="max-w-[9ch] text-[clamp(4.25rem,18vw,6.9rem)] font-normal leading-[0.78] tracking-[-0.085em] text-neutral-950">
            Living interface systems.
          </h1>
          <p className="mt-7 max-w-[36rem] text-[15px] leading-7 text-neutral-600">
            Premium websites, cinematic web environments, multilingual product surfaces,
            and spatial digital experiences built as one coherent interface system.
          </p>
        </div>

        <div className="grid gap-3" data-sound-safe-area>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onMouseEnter={() => sound.playRole("hover")}
              onClick={onSystems}
              className={mobilePrimaryCta}
            >
              Explore systems -&gt;
            </button>
            <button
              type="button"
              onMouseEnter={() => sound.playRole("hover")}
              onClick={onWork}
              className={mobileSecondaryCta}
            >
              View work -&gt;
            </button>
          </div>
          <button
            type="button"
            onMouseEnter={() => sound.playRole("hover")}
            onClick={onImmersive}
            className={mobileSecondaryCta}
          >
            Enter immersive -&gt;
          </button>
        </div>

        <div className="max-w-[24rem]">
          <LiveBuildSignal readiness={78} compact />
        </div>
      </div>

      <div className="relative z-10 mx-auto hidden min-h-[calc(100vh-7rem)] w-[min(94vw,1640px)] items-center lg:flex">
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
              onMouseEnter={() => sound.playRole("hover")}
              onClick={onSystems}
              className="rounded-full border border-neutral-950 bg-neutral-950 px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
            >
              Explore systems -&gt;
            </button>
            <button
              type="button"
              onMouseEnter={() => sound.playRole("hover")}
              onClick={onWork}
              className="rounded-full border border-neutral-300 bg-white/60 px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-neutral-700 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
            >
              View work -&gt;
            </button>
            <button
              type="button"
              onMouseEnter={() => sound.playRole("hover")}
              onClick={onImmersive}
              className="rounded-full border border-neutral-300 bg-white/36 px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-neutral-700 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
            >
              Enter immersive -&gt;
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

function SystemsChapter({ goTo }: { goTo: (path: string) => void }) {
  const [proofModeIndex, setProofModeIndex] = useState(0);

  return (
    <Chapter
      id="systems"
      headerScene="living-systems"
      className="relative overflow-x-clip overflow-y-visible lg:px-8 lg:py-24"
    >
      <MobileChapter
        label="02 / Proof Surfaces"
        heading="Proof surfaces, not portfolio tiles."
        summary="The work opens through three proof modes: product atmosphere, advisory trust, and workflow logic."
        className="relative z-10 pt-8 lg:hidden"
      >
        <div className="grid gap-4">
          <div className="border-y border-neutral-950/12 py-3">
            {proofSurfaceModes.map(([index, title, text], modeIndex) => {
              const active = modeIndex === proofModeIndex;

              return (
              <button
                key={title}
                type="button"
                onClick={() => setProofModeIndex(modeIndex)}
                aria-pressed={active}
                className={[
                  "grid w-full grid-cols-[2.4rem_1fr] gap-3 border-b py-3 text-left transition last:border-b-0 active:translate-y-px",
                  active ? "border-neutral-950/18 text-neutral-950" : "border-neutral-950/10 text-neutral-500",
                ].join(" ")}
              >
                <div className={active ? "font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-950" : "font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400"}>{index}</div>
                <div>
                  <div className={active ? "text-[13px] font-semibold uppercase tracking-[0.13em] text-neutral-950" : "text-[13px] font-semibold uppercase tracking-[0.13em] text-neutral-500"}>{title}</div>
                  <p className={active ? "mt-1 text-[12px] leading-5 text-neutral-600" : "mt-1 text-[12px] leading-5 text-neutral-500"}>{text}</p>
                </div>
              </button>
              );
            })}
          </div>
          <MobileSpatialStage
            assets={proofSurfaceAssets}
            onOpen={goTo}
            className="mt-2"
            activeIndex={proofModeIndex}
            onActiveIndexChange={setProofModeIndex}
            showSelectors={false}
          />
        </div>
      </MobileChapter>

      <MobileChapter
        label="03 / Systems Index"
        heading="Systems, not cards."
        summary="The work is organized as reusable interface systems. WHISPER is proof; the spine below is the operating language behind the site."
        className="relative z-10 lg:hidden"
      >
        <div className="grid gap-5">
          <div className="relative overflow-hidden border-y border-neutral-950/14 py-3" data-sound-safe-area>
            <div className="mb-3 flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.15em] text-neutral-400">
              <span>Operating ledger</span>
              <span className="font-mono">03 core / 01 layer</span>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute left-[2.15rem] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-neutral-950/8 via-neutral-950/34 to-neutral-950/8" />

              {mobileCoreSystems.map(([index, title, text, axis]) => (
                <div
                  key={title}
                  className="relative grid grid-cols-[3.25rem_1fr] gap-3 border-t border-neutral-950/10 py-3.5 first:border-t-0"
                >
                  <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-neutral-950/14 bg-[#f4f1eb] font-mono text-[9px] uppercase tracking-[0.1em] text-neutral-500">
                    {index}
                  </div>
                  <div className="min-w-0">
                    <div className="mb-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                      {axis}
                    </div>
                    <h3 className="!text-[18px] !leading-[1.02] tracking-[-0.025em] text-neutral-950">{title}</h3>
                    <p className="mt-1.5 text-[11px] leading-5 text-neutral-600">{text}</p>
                  </div>
                </div>
              ))}
            </div>

            {mobileSupportingLayers.map(([index, title, text]) => (
              <div
                key={title}
                className="mt-3 grid grid-cols-[3.25rem_1fr] gap-3 border-t border-neutral-950/12 pt-3 text-neutral-500"
              >
                <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-300">{index}</div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.13em] text-neutral-600">{title}</div>
                  <p className="mt-1 text-[11px] leading-5 text-neutral-500">{text}</p>
                </div>
              </div>
            ))}

            <div className="mt-4 border-t border-neutral-950/10 pt-3 font-mono text-[9px] uppercase tracking-[0.13em] text-neutral-400">
              Next proof reference: WHISPER / spatial exhibition.
            </div>
          </div>
        </div>
      </MobileChapter>

      <div className="relative z-10 mx-auto hidden w-[min(94vw,1640px)] lg:block">
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
                signal -&gt; state -&gt; atmosphere -&gt; reveal -&gt; memory
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
                    <div className="mt-5 flex flex-wrap gap-2">
                      {system.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-neutral-950/12 bg-white/34 px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-neutral-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
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
  const [whisperProofIndex, setWhisperProofIndex] = useState(0);
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
  const railShadeOpacity = useTransform(progress, [0.08, 0.2, 0.84, 0.98], [0, 1, 1, 0]);

  return (
    <section ref={target} id="whisper" data-header-scene="living-whisper" className="relative lg:min-h-[148vh]">
      <MobileChapter
        label="04 / WHISPER Preview"
        heading="First spatial proof."
        summary="A cinematic Web / XR exhibition where photography becomes a collector experience across web, mobile, print, AR, and spatial interface."
        className="relative z-10 lg:hidden"
      >
        <div className="grid gap-4">
          <MobileSpatialStage
            assets={whisperProofAssets}
            onOpen={onOpen}
            className="mt-2"
            dark
            objectPosition="center"
            showSelectors={false}
            variant="cinematic"
            activeIndex={whisperProofIndex}
            onActiveIndexChange={setWhisperProofIndex}
          />

          <button type="button" onClick={onOpen} className={mobilePrimaryCta} data-sound-safe-area>
            Open immersive case -&gt;
          </button>
        </div>
      </MobileChapter>

      <div className="sticky top-0 hidden h-screen overflow-hidden lg:block">
        <motion.div
          data-studio-whisper-media
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
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-20 hidden w-[36rem] bg-gradient-to-l from-black/64 via-black/28 to-transparent xl:block"
          style={{ opacity: railShadeOpacity }}
        />

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
              Open immersive case -&gt;
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

function StoryMedia({
  asset,
  index,
  layouts = storyPlaneLayouts,
  onOpen,
}: {
  asset: StoryMediaAsset;
  index: number;
  layouts?: readonly StoryPlaneLayout[];
  onOpen?: (path: string) => void;
}) {
  const reduceMotion = useReducedMotion();
  const layout = layouts[index % layouts.length];
  const filterId = `story-fluid-${index}-${asset.label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
  const captionIndex = String(index + 1).padStart(2, "0");

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const cursorX = useMotionValue(50);
  const cursorY = useMotionValue(50);
  const distortion = useMotionValue(0);
  const smoothX = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.28 });
  const smoothY = useSpring(my, { stiffness: 120, damping: 20, mass: 0.28 });
  const fluid = useSpring(distortion, { stiffness: 170, damping: 22, mass: 0.22 });

  const rotateY = useTransform(smoothX, [-1, 1], [-3.5, 3.5]);
  const rotateX = useTransform(smoothY, [-1, 1], [3, -3]);
  const mediaX = useTransform(smoothX, [-1, 1], ["-2.2%", "2.2%"]);
  const mediaY = useTransform(smoothY, [-1, 1], ["-2.2%", "2.2%"]);
  const mediaScale = useTransform(fluid, [0, 1], [1, 1.024]);
  const displacementScale = useTransform(fluid, [0, 1], [0, 14]);
  const turbulenceFrequency = useTransform(fluid, [0, 1], ["0.006 0.014", "0.018 0.04"]);
  const chromaOpacity = useTransform(fluid, [0, 1], [0, 0.14]);
  const warpOpacity = useTransform(fluid, [0, 1], [0, 0.52]);
  const chromaRedX = useTransform(smoothX, [-1, 1], ["-1%", "1%"]);
  const chromaRedY = useTransform(smoothY, [-1, 1], ["-0.7%", "0.7%"]);
  const chromaBlueX = useTransform(smoothX, [-1, 1], ["0.9%", "-0.9%"]);
  const chromaBlueY = useTransform(smoothY, [-1, 1], ["0.7%", "-0.7%"]);
  const sheenX = useTransform(smoothX, [-1, 1], ["-3%", "3%"]);
  const sheenY = useTransform(smoothY, [-1, 1], ["-2%", "2%"]);
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

  const openRoute = () => {
    if (!asset.route) return;
    onOpen?.(asset.route);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!asset.route) return;
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    openRoute();
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
      className={`group absolute overflow-visible will-change-transform ${asset.route ? "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950/28" : ""} ${layout.className}`}
      role={asset.route ? "button" : undefined}
      tabIndex={asset.route ? 0 : undefined}
      aria-label={asset.route ? `Open ${asset.label} case` : undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={openRoute}
      onKeyDown={handleKeyDown}
      initial={reduceMotion ? undefined : { opacity: 0, y: 46, scale: 0.985 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      whileHover={reduceMotion ? undefined : { scale: 1.026, zIndex: 60 }}
      viewport={{ once: false, amount: 0.35 }}
      transition={{ duration: 0.95, delay: index * 0.08, ease }}
    >
      <motion.div
        className={`relative h-full w-full overflow-hidden border border-white/70 bg-[#f7f5ef]/18 ${layout.shadow} backdrop-blur-[2px] will-change-transform`}
        style={{
          clipPath: layout.shape,
          rotateX: reduceMotion ? 0 : rotateX,
          rotateY: reduceMotion ? 0 : rotateY,
          transformPerspective: 1100,
          transformStyle: "preserve-3d",
        }}
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

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(242,239,232,0),rgba(242,239,232,0.01)_58%,rgba(242,239,232,0.18))]" />
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
      </motion.div>

      <figcaption className={`pointer-events-none absolute z-[80] hidden min-w-[14rem] max-w-[18rem] sm:block ${layout.label}`}>
        <div className="mb-1.5 h-px w-16 bg-gradient-to-r from-neutral-950/34 via-neutral-950/18 to-transparent" />
        <div className="inline-flex max-w-full items-center gap-2 border border-neutral-950/12 bg-white/72 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-neutral-700/82 shadow-[0_14px_38px_rgba(20,20,20,0.08)] backdrop-blur-md">
          <span className="text-neutral-400">{captionIndex}</span>
          <span className="truncate">{asset.label}</span>
        </div>
      </figcaption>
    </motion.figure>
  );
}

function SurfaceCaptionLegend({
  assets,
  onOpen,
}: {
  assets: StoryMediaAsset[];
  onOpen: (path: string) => void;
}) {
  return (
    <div className="absolute inset-x-0 bottom-3 z-[90] grid gap-1.5 px-2 sm:hidden">
      {assets.map((asset, index) => {
        const captionIndex = String(index + 1).padStart(2, "0");
        const content = (
          <>
            <span className="text-neutral-400">{captionIndex}</span>
            <span className="truncate">{asset.label}</span>
          </>
        );
        const className =
          "flex min-h-9 w-full items-center gap-2 border border-neutral-950/10 bg-white/76 px-3 text-left text-[10px] uppercase tracking-[0.14em] text-neutral-700/84 shadow-[0_12px_30px_rgba(20,20,20,0.07)] backdrop-blur-md";

        if (!asset.route) {
          return (
            <div key={asset.label} className={className}>
              {content}
            </div>
          );
        }

        return (
          <button
            key={asset.label}
            type="button"
            onClick={() => onOpen(asset.route as string)}
            className={`${className} transition active:translate-y-px`}
          >
            {content}
          </button>
        );
      })}
    </div>
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
      className="relative pb-4 lg:px-8 lg:pb-24 lg:pt-8"
    >
      <div className="relative mx-auto mb-0 hidden min-h-[68vh] w-[min(94vw,1640px)] items-center gap-12 overflow-hidden border-t border-neutral-950/12 py-10 lg:grid xl:grid-cols-[0.45fr_0.55fr]">
        <motion.div style={{ y: handoffY, opacity: handoffOpacity }}>
          <div className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Cinematic atlas</div>
          <h2 className="mt-5 max-w-[10ch] text-[64px] font-normal leading-[0.82] tracking-[-0.08em] text-neutral-950 sm:text-[96px] xl:text-[132px]">
            Immersive cases become connected proof.
          </h2>
          <p className="mt-8 max-w-[43rem] text-[17px] leading-[1.85] text-neutral-600">
            This atlas gathers spatial studies, cinematic web environments, XR captures, archive surfaces,
            and future immersive case covers into one visual field before the wider practice continues below.
          </p>
        </motion.div>

        <motion.div
          className="relative min-h-[34rem] xl:min-h-[43rem]"
          style={{ x: fragmentX, rotate: fragmentRotate }}
        >
          <div className="pointer-events-none absolute left-[4%] top-[13%] h-px w-[88%] rotate-[-12deg] bg-gradient-to-r from-transparent via-neutral-950/18 to-transparent" />
          <div className="pointer-events-none absolute left-[18%] top-[5%] h-[36rem] w-[36rem] rounded-full border border-neutral-950/[0.055]" />
          <div className="pointer-events-none absolute bottom-[8%] right-[3%] h-px w-[78%] rotate-[8deg] bg-gradient-to-r from-transparent via-neutral-950/14 to-transparent" />

          {atlasIntroMedia.map((asset, assetIndex) => (
            <StoryMedia
              key={`atlas-intro-${asset.label}`}
              asset={asset}
              index={assetIndex}
              layouts={atlasIntroPlaneLayouts}
              onOpen={goTo}
            />
          ))}
          <SurfaceCaptionLegend assets={atlasIntroMedia} onOpen={goTo} />

          <div className="absolute left-[3%] bottom-[13%] rounded-full border border-neutral-950/10 bg-white/58 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-neutral-500 backdrop-blur">
            immersive covers become atlas
          </div>
          <div className="absolute right-[9%] bottom-[10%] rounded-full border border-neutral-950/10 bg-white/48 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-neutral-500 backdrop-blur">
            spatial proof index
          </div>
        </motion.div>
      </div>

      <div className="relative mx-auto hidden w-[min(94vw,1640px)] lg:block">
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

        {storyFrames.map((frame) => (
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
                    Open related proof -&gt;
                  </button>
                )}
              </motion.div>

              <div className="relative min-h-[660px] xl:min-h-[820px] xl:origin-center xl:translate-x-[3vw] xl:scale-[1.06]">
                {frame.media.map((asset, assetIndex) => (
                  <StoryMedia
                    key={`${frame.id}-${asset.label}`}
                    asset={asset}
                    index={assetIndex}
                    layouts={storyPlaneLayouts}
                    onOpen={goTo}
                  />
                ))}
                <SurfaceCaptionLegend assets={frame.media} onOpen={goTo} />

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

function GrammarChapter({ goTo }: { goTo: (path: string) => void }) {
  const { targetRef, activeIndex } = useScrollActiveIndex(grammar.length);

  return (
    <Chapter
      id="grammar"
      headerScene="living-grammar"
      className="relative lg:min-h-screen lg:px-8 lg:py-24"
    >
      <MobileChapter
        label="05 / Core Formula"
        heading="The interface is treated as a living field."
        summary="Motion is grammar: it marks state, attention, distance, memory, and transition."
        className="relative z-10 lg:hidden"
      >
        <div className="grid gap-5">
          <MobileFormulaPanel />

          <div className="relative border-y border-neutral-950/14 bg-white/[0.08] py-1" data-sound-safe-area>
            <div className="pointer-events-none absolute left-[2.1rem] top-3 h-[calc(100%-1.5rem)] w-px bg-gradient-to-b from-neutral-950/8 via-neutral-950/32 to-neutral-950/8" />
            {grammar.map(([word, note], index) => (
              <div
                key={word}
                className="relative grid grid-cols-[2.55rem_minmax(5.9rem,0.48fr)_1fr] items-center gap-2 border-b border-neutral-950/10 py-3 last:border-b-0"
              >
                <div className="relative z-10 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-neutral-400">
                  <span className="h-1.5 w-1.5 rounded-full border border-neutral-950/18 bg-[#f4f1eb]" />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="font-mono text-[11px] font-semibold uppercase leading-none tracking-[0.1em] text-neutral-950">{word}</div>
                <p className="text-[11px] leading-5 text-neutral-600">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </MobileChapter>

      <MobileChapter
        label="06 / Reusable Grammar"
        heading="Reusable visual grammar."
        summary="FLUID, ARCWAVE, FORM INDEX, Casa Nube, and immersive work prove one grammar for atmosphere, language, motion, and structure."
        className="relative z-10 lg:hidden"
      >
        <div className="grid gap-4">
          <MobileSpatialStage assets={visualLanguageAssets} onOpen={goTo} objectPosition="center top" variant="grammar" />
          <button
            type="button"
            onClick={() => goTo("/work")}
            className={mobileSecondaryCta}
            data-sound-safe-area
          >
            Open related proof -&gt;
          </button>
        </div>
      </MobileChapter>

      <div className="mx-auto hidden min-h-[calc(100vh-12rem)] w-[min(94vw,1640px)] items-center gap-14 lg:grid xl:grid-cols-[0.48fr_0.52fr]">
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
              signal -&gt; state -&gt; atmosphere -&gt; reveal -&gt; memory
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

function PracticeChapter({
  onOpenProject,
  goTo,
}: {
  onOpenProject?: () => void;
  goTo: (path: string) => void;
}) {
  const { targetRef, activeIndex } = useScrollActiveIndex(practiceRows.length);

  return (
    <Chapter
      id="practice"
      headerScene="living-practice"
      className="relative lg:min-h-screen lg:px-8 lg:py-24"
    >
      <MobileChapter
        label="07 / Practice Model"
        heading="Between delivery and research."
        summary="The research becomes commercial work through three entry points. The full format list lives in Offer."
        className="relative z-10 lg:hidden"
      >
        <div className="grid gap-4" data-sound-safe-area>
          <div className="border-y border-neutral-950/14 py-2">
            {mobilePracticeBridgeRows.map(([index, title, text]) => (
              <div key={title} className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-neutral-950/10 py-4 last:border-b-0">
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">{index}</div>
                <div>
                  <h3 className="!text-[21px] !leading-[1.02] tracking-[-0.035em] text-neutral-950">{title}</h3>
                  <p className="mt-2 text-[12px] leading-5 text-neutral-600">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => goTo("/offer")} className={mobileSecondaryCta}>
              Open Offer -&gt;
            </button>
            <button type="button" onClick={onOpenProject} className={mobilePrimaryCta}>
              Start -&gt;
            </button>
          </div>

          <div className="border-t border-neutral-950/10 pt-3 text-[10px] uppercase tracking-[0.14em] text-neutral-400">
            More formats continue on the Offer page.
          </div>
        </div>
      </MobileChapter>

      <div className="mx-auto hidden min-h-[calc(100vh-10rem)] w-[min(94vw,1640px)] gap-12 lg:grid xl:grid-cols-[0.42fr_0.58fr] xl:items-center">
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
            Start a project -&gt;
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
  const whisperChromeActive = useStudioWhisperChromeActive();
  const routeContentReady = useDeferredRouteContent();
  const { playRole, setScene, stopAmbient } = useSound();

  useEffect(() => {
    setScene("portfolio");
    stopAmbient();
  }, [setScene, stopAmbient]);

  useEffect(() => {
    document.documentElement.dataset.studioWhisperChrome = whisperChromeActive ? "active" : "inactive";

    return () => {
      delete document.documentElement.dataset.studioWhisperChrome;
    };
  }, [whisperChromeActive]);

  const goTo = (path: string) => {
    playRole(path === "/immersive" ? "open" : "select");
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
    playRole("select");
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
          tone={whisperChromeActive ? "dark" : "light"}
        />

        <main className="relative z-10">
          <MobileMotionSection variant="threshold" signature="hero-lock">
            <OpeningChapter
              onSystems={() => scrollTo("systems")}
              onWork={() => goTo("/work")}
              onImmersive={() => goTo("/immersive")}
            />
          </MobileMotionSection>

          {routeContentReady ? (
            <>
              <MobileMotionSection variant="ledger" delay="soft" signature="ledger-scan">
                <SystemsChapter goTo={goTo} />
              </MobileMotionSection>

              <MobileMotionSection variant="media" delay="soft" signature="media-orbit">
                <WhisperChapter onOpen={() => goTo("/immersive")} />
              </MobileMotionSection>

              <MobileMotionSection variant="media" delay="soft" signature="media-orbit">
                <AtlasChapter goTo={goTo} />
              </MobileMotionSection>

              <MobileMotionSection variant="ledger" delay="soft" signature="ledger-scan">
                <GrammarChapter goTo={goTo} />
              </MobileMotionSection>

              <MobileMotionSection variant="closing" delay="soft" signature="closing-signal">
                <PracticeChapter onOpenProject={onOpenProject} goTo={goTo} />
              </MobileMotionSection>
            </>
          ) : (
            <div aria-hidden="true" className="min-h-[420vh]" />
          )}
        </main>

        {routeContentReady ? <SiteFooterV2 onOpenProject={onOpenProject} variant="living" /> : null}
      </PageSurface>
    </>
  );
}
