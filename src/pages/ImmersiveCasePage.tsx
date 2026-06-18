import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Header from "../ui/Header";
import Container from "../ui/Container";
import ActionPill from "../ui/ActionPill";
import PageSurface from "../ui/PageSurface";
import CaseStatusPill from "../ui/status/CaseStatusPill";
import WhisperCaseLayout from "../ui/immersive/WhisperCaseLayout";
import KoolBerkWebGLBackdrop from "../ui/immersive/KoolBerkWebGLBackdrop";
import WebHeroMembraneBackdrop from "../ui/immersive/WebHeroMembraneBackdrop";
import { startSpaPageTransition } from "../ui/pageTransition";
import { immersiveItems, type ImmersiveItem, type ImmersiveTone } from "../data/immersive";
import { localizeImmersiveItem } from "../data/localization";
import { whisperCaseI18n } from "../data/whisperCaseI18n";
import type { CaseStoryMedia } from "../data/caseStories";
import { getLocalizedPath, isSpanishPublicImmersiveSlug, useI18n, type LocaleCode } from "../i18n";
import { getSeoAlternates } from "../seo/alternates";
import SeoMeta from "../ui/SeoMeta";
import StructuredData from "../ui/StructuredData";
import CinematicInspectReveal from "../ui/work/CinematicInspectReveal";
import SiteFooterV2 from "../ui/SiteFooterV2";
import SectionRail, { type SectionRailItem } from "../ui/SectionRail";
import { useSectionRailActive } from "../ui/useSectionRailActive";
import { SITE_NAME, toAbsoluteSiteUrl } from "../config/site";

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
  noIndex?: boolean;
};

type CinematicImmersiveTone = "webhero" | "kool-berk" | "presence-os" | "orbit-lens";

const cinematicToneTokens: Record<
  CinematicImmersiveTone,
  { rail: string; scan: string; accent: string; label: string }
> = {
  webhero: {
    rail: "rgba(120,244,226,0.62)",
    scan: "rgba(184,124,255,0.18)",
    accent: "rgba(120,244,226,0.3)",
    label: "living visual field",
  },
  "kool-berk": {
    rail: "rgba(255,74,90,0.58)",
    scan: "rgba(89,144,226,0.18)",
    accent: "rgba(255,74,90,0.26)",
    label: "sonic object field",
  },
  "presence-os": {
    rail: "rgba(119,207,184,0.58)",
    scan: "rgba(246,219,165,0.16)",
    accent: "rgba(119,207,184,0.24)",
    label: "memory field",
  },
  "orbit-lens": {
    rail: "rgba(125,233,255,0.62)",
    scan: "rgba(110,128,255,0.18)",
    accent: "rgba(125,233,255,0.28)",
    label: "product os field",
  },
};

function CinematicImmersiveCaseShell({
  tone,
  children,
}: {
  tone: CinematicImmersiveTone;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const tokens = cinematicToneTokens[tone];
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });
  const progressScale = useTransform(scrollYProgress, [0, 1], [0.04, 1]);
  const scanY = useTransform(scrollYProgress, [0, 1], ["0vh", "58vh"]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const sections = Array.from(root.querySelectorAll<HTMLElement>("section[data-header-scene]"));
    sections.forEach((section) => {
      section.dataset.cinematicSection = "true";
      section.style.setProperty("--cinematic-delay", "0ms");

      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.18) section.dataset.cinematicVisible = "true";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target as HTMLElement;
          const rect = section.getBoundingClientRect();
          const closeToViewport = rect.top < window.innerHeight * 1.16 && rect.bottom > -window.innerHeight * 0.16;
          section.dataset.cinematicVisible = entry.isIntersecting || closeToViewport ? "true" : "false";
        });
      },
      {
        rootMargin: "12% 0px 22% 0px",
        threshold: [0.01, 0.08, 0.18],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      data-immersive-cinematic-case={tone}
      className="relative"
      style={{
        "--cinematic-rail": tokens.rail,
        "--cinematic-scan": tokens.scan,
        "--cinematic-accent": tokens.accent,
      } as CSSProperties}
    >
      <style>
        {`
          [data-immersive-cinematic-case] section[data-cinematic-section="true"] {
            opacity: 0.7;
            transform: translate3d(0, 34px, 0) scale(0.992);
            filter: blur(4px);
            transform-origin: 50% 16%;
            transition:
              opacity 520ms cubic-bezier(0.22, 1, 0.36, 1) var(--cinematic-delay, 0ms),
              transform 620ms cubic-bezier(0.22, 1, 0.36, 1) var(--cinematic-delay, 0ms),
              filter 560ms cubic-bezier(0.22, 1, 0.36, 1) var(--cinematic-delay, 0ms);
            will-change: opacity, transform, filter;
          }

          [data-immersive-cinematic-case] section[data-cinematic-section="true"][data-cinematic-visible="true"] {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
            filter: blur(0);
          }

          [data-immersive-cinematic-case] section[data-cinematic-section="true"] img,
          [data-immersive-cinematic-case] section[data-cinematic-section="true"] video {
            transition:
              transform 620ms cubic-bezier(0.22, 1, 0.36, 1),
              opacity 520ms cubic-bezier(0.22, 1, 0.36, 1),
              filter 520ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          [data-immersive-cinematic-case] section[data-cinematic-section="true"][data-cinematic-visible="true"] img,
          [data-immersive-cinematic-case] section[data-cinematic-section="true"][data-cinematic-visible="true"] video {
            transform: scale(1.006);
          }

          @media (prefers-reduced-motion: reduce) {
            [data-immersive-cinematic-case] section[data-cinematic-section="true"] {
              opacity: 1;
              transform: none;
              filter: none;
              transition: none;
            }

            [data-immersive-cinematic-case] section[data-cinematic-section="true"] img,
            [data-immersive-cinematic-case] section[data-cinematic-section="true"] video {
              transform: none;
              transition: none;
            }
          }
        `}
      </style>

      <div className="pointer-events-none fixed inset-y-0 left-0 z-[58] hidden w-14 mix-blend-screen xl:block">
        <div className="absolute left-7 top-[12vh] h-[76vh] w-px bg-white/10" />
        <motion.div
          className="absolute left-7 top-[12vh] h-[76vh] w-px origin-top"
          style={{
            scaleY: progressScale,
            background: "var(--cinematic-rail)",
          }}
        />
        <motion.div
          className="absolute left-3 h-24 w-8 border-y border-white/12"
          style={{
            top: scanY,
            background:
              "linear-gradient(180deg, transparent, var(--cinematic-scan), transparent)",
          }}
        />
        <div className="absolute bottom-[12vh] left-4 rotate-[-90deg] whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.22em] text-white/28">
          {tokens.label}
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 top-[72px] z-[12] hidden h-px bg-[linear-gradient(90deg,transparent,var(--cinematic-accent),transparent)] opacity-70 xl:block" />

      {children}
    </div>
  );
}

function getImmersiveMetaTitle(item: ImmersiveItem, locale: LocaleCode = "en") {
  const category = locale === "es" ? "Sistema inmersivo" : item.searchContent?.category ?? "Immersive System";
  return `${item.title} - ${category} | Brenych Studio`;
}

function getImmersiveMetaDescription(item: ImmersiveItem) {
  return item.searchContent?.shortDescription ?? item.tagline;
}

function ImmersiveSeoMeta({
  item,
  imageAlt,
  noIndex = false,
  locale = "en",
}: {
  item: ImmersiveItem;
  imageAlt?: string;
  noIndex?: boolean;
  locale?: LocaleCode;
}) {
  const title = getImmersiveMetaTitle(item, locale);
  const description = getImmersiveMetaDescription(item);
  const path = getLocalizedPath(`/immersive/${item.slug}`, locale);
  const image = item.previewPoster;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: item.title,
    headline: title,
    description,
    url: toAbsoluteSiteUrl(path),
    image: toAbsoluteSiteUrl(image ?? "/og-default.png"),
    dateCreated: item.year,
    creator: {
      "@type": "Organization",
      name: SITE_NAME,
      url: toAbsoluteSiteUrl("/"),
    },
    keywords: item.searchContent?.tags.join(", ") ?? item.highlights?.join(", "),
    genre: item.searchContent?.category ?? item.medium,
    workExample: item.links?.find((link) => link.label.toLowerCase().includes("live"))?.href,
  };

  return (
    <>
      <SeoMeta
        title={title}
        description={description}
        path={path}
        image={image}
        imageAlt={imageAlt ?? `${item.title} immersive case`}
        type="article"
        noIndex={noIndex}
        alternates={getSeoAlternates(path)}
      />
      <StructuredData id={`structured-data-immersive-${item.slug}`} data={structuredData} />
    </>
  );
}

const toneSurface: Record<ImmersiveTone, string> = {
  horizon:
    "bg-[radial-gradient(132%_120%_at_18%_16%,rgba(255,255,255,0.22),transparent_56%),linear-gradient(150deg,#101826_0%,#162236_34%,#07101c_100%)]",
  signal:
    "bg-[radial-gradient(122%_120%_at_78%_8%,rgba(167,243,208,0.16),transparent_58%),linear-gradient(148deg,#031618_0%,#07383b_42%,#0b1728_100%)]",
  nocturne:
    "bg-[radial-gradient(126%_120%_at_50%_-8%,rgba(148,163,184,0.14),transparent_56%),linear-gradient(152deg,#0d1016_0%,#141821_38%,#09111d_100%)]",
};

type ImmersiveVariant = "ar" | "interface" | "xr" | "memory";

const immersiveVariantBySlug: Record<string, ImmersiveVariant> = {
  whisper: "xr",
  "signal-room-ar": "ar",
  "nocturne-interface": "interface",
  "echo-drift-xr": "xr",
  "threshold-memory": "memory",
  "atlas-arc": "xr",
};

const immersiveVariantUi: Record<
  ImmersiveVariant,
  {
    heroMinClass: string;
    titleMaxClass: string;
    titleSizeClass: string;
    directionMaxClass: string;
    heroGhostClass: string;
    mediaGhostClass: string;
    mediaCaption: string;
  }
> = {
  ar: {
    heroMinClass: "md:min-h-[580px]",
    titleMaxClass: "max-w-[8ch]",
    titleSizeClass: "md:text-[78px]",
    directionMaxClass: "max-w-[11ch]",
    heroGhostClass:
      "absolute right-[14%] top-[20%] hidden h-[38%] w-[30%] rounded-[28px] border border-white/8 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[1px] md:block",
    mediaGhostClass:
      "absolute right-[16%] top-[20%] hidden h-[40%] w-[34%] rounded-[24px] border border-white/8 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[1px] md:block",
    mediaCaption: "Framing field",
  },
  interface: {
    heroMinClass: "md:min-h-[610px]",
    titleMaxClass: "max-w-[8ch]",
    titleSizeClass: "md:text-[84px]",
    directionMaxClass: "max-w-[10ch]",
    heroGhostClass: "",
    mediaGhostClass: "",
    mediaCaption: "Interface rhythm study",
  },
  xr: {
    heroMinClass: "md:min-h-[620px]",
    titleMaxClass: "max-w-[9ch]",
    titleSizeClass: "md:text-[80px]",
    directionMaxClass: "max-w-[9ch]",
    heroGhostClass: "",
    mediaGhostClass: "",
    mediaCaption: "XR pacing sequence",
  },
  memory: {
    heroMinClass: "md:min-h-[600px]",
    titleMaxClass: "max-w-[8ch]",
    titleSizeClass: "md:text-[82px]",
    directionMaxClass: "max-w-[10ch]",
    heroGhostClass:
      "absolute left-[18%] bottom-[16%] hidden h-[40%] w-[52%] rounded-[30px] border border-white/[0.05] bg-white/[0.018] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] md:block",
    mediaGhostClass:
      "absolute left-[20%] top-[18%] hidden h-[46%] w-[56%] rounded-[24px] border border-white/[0.05] bg-white/[0.018] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] md:block",
    mediaCaption: "Layered narrative surface",
  },
};

type ImmersiveDetailCopy = {
  intro: string;
  directionHeading: string;
  direction: string;
  interaction: string;
  build: string;
  outcome: string;
  principles: string[];
  mediaLabel: string;
  mediaSummary: string;
  mediaModules: string[];
};

const immersiveDetailCopy: Record<string, ImmersiveDetailCopy> = {
  whisper: {
    intro:
      "WHISPER is a premium interactive Web / XR exhibition built around two conceptual photo-film series: Whisper of the Sea and Whisper of the Forest. The project connects an editorial website, browser-based WebXR, Quest VR hand-navigation, print discovery, collector continuation, and AR preview for framed editions.",
    directionHeading:
      "A quiet immersive system for art, presence, prints, VR, and AR.",
    direction:
      "The direction avoids the feeling of a generic gallery, a game-like VR scene, or a technical demo. WHISPER behaves like a restrained contemporary installation: cinematic, museum-like, atmospheric, and collector-facing.",
    interaction:
      "Interaction is designed around comfort and presence. The XR layer uses real Quest hand tracking, ghost-like hand visuals, ray and marker feedback, and hand-based teleport navigation so the user can move through the exhibition without breaking the atmosphere.",
    build:
      "The project combines React, Vite, Three.js, WebXR, Quest Browser testing, static GLB/USDZ AR assets, Cloudflare Pages deployment, and an emerging XRCore helper baseline for future immersive exhibitions.",
    outcome:
      "The current version is an advanced working V1: the public website is deployed, the WebXR experience works, Quest hand navigation is functional, the print catalog is connected to AR preview, and the project is strong enough to present as an in-progress flagship.",
    principles: [
      "WebXR exhibition",
      "Quest hand navigation",
      "AR print preview",
      "Collector flow",
    ],
    mediaLabel: "Flagship media proof",
    mediaSummary:
      "The case uses real project media: homepage motion, desktop navigation, Quest VR headset capture, desktop stills, VR stills, and mobile screenshots.",
    mediaModules: [
      "Hero motion · real WHISPER atmospheric loop",
      "Desktop walkthrough · editorial website and collector flow",
      "Quest capture · spatial exhibition and hand navigation",
      "Still frames · website, VR, AR preview, and mobile proof",
    ],
  },
  "atlas-arc": {
    intro:
      "Atlas Arc is treated as a flagship immersive direction surface where spatial pacing, authored transitions, and premium narrative framing work as one sales-facing environment.",
    directionHeading:
      "Spatial narrative direction with a stronger authored sequence and clearer production path.",
    direction:
      "The case is designed less as a loose immersive experiment and more as a structured flagship direction: one that can hold spatial narrative, premium mood, and product-ready interaction logic at the same time.",
    interaction:
      "Interaction stays restrained and sequence-led. Focus points, guided transitions, and depth cues are used to shape attention without turning the experience into interface noise.",
    build:
      "The technical path assumes modular scene systems, reusable motion grammar, and a production-aware structure that can scale from concept stage into a more real deployment surface.",
    outcome:
      "This positions Atlas Arc as a reusable flagship pattern for future immersive commissions where atmosphere, premium storytelling, and implementation discipline need to coexist.",
    principles: [
      "Directed pacing over generic interaction",
      "Spatial depth with editorial control",
      "Production-aware immersive architecture",
    ],
    mediaLabel: "Flagship sequence",
    mediaSummary:
      "The media structure is built around a strong opening loop, a curated sequence of transitions, and selected still frames that clarify composition and interaction rhythm.",
    mediaModules: [
      "Hero loop · arrival and depth cue",
      "Sequence clips · guided spatial transitions",
      "Still frames · composition, hierarchy, focal logic",
    ],
  },

  "signal-room-ar": {
    intro:
      "Signal Room AR explores AR not as a technical utility layer, but as a premium framing surface for launches where mood, context, and reveal directly affect perceived value.",
    directionHeading:
      "AR framing as a premium launch layer with calmer reveal logic.",
    direction:
      "The direction focuses on how product context can be staged through camera framing, ambient pacing, and restrained interaction rather than feature-heavy overlays.",
    interaction:
      "Interaction remains minimal and legible, with emphasis on framing states, calm transitions, and deliberate reveal moments that support product perception.",
    build:
      "The build path assumes a modular AR layer that can sit on top of an existing launch or campaign surface without requiring a full rebuild of the main site architecture.",
    outcome:
      "The study shows how AR can function as a high-end perception layer for launches where premium framing matters more than utility-first interface depth.",
    principles: [
      "AR as premium framing layer",
      "Calm interaction over interface noise",
      "Reveal-driven presentation logic",
    ],
    mediaLabel: "AR reveal fragments",
    mediaSummary:
      "This case should be documented through a short hero loop, a few controlled reveal clips, and still frames that show how framing changes product perception across states.",
    mediaModules: [
      "Hero loop · atmosphere and object context",
      "Sequence clips · reveal and framing states",
      "Still frames · cue points, overlays, viewing logic",
    ],
  },

  "nocturne-interface": {
    intro:
      "Nocturne Interface treats immersive UI as a directed environment: calm, atmospheric, and structurally precise rather than dense or dashboard-like.",
    directionHeading:
      "Cinematic spatial interface with calmer navigation and stronger rhythm.",
    direction:
      "The design goal is to create a future-facing interface surface where navigation, hierarchy, and scene atmosphere feel authored together rather than layered independently.",
    interaction:
      "Interaction grammar is centered on slower pacing, clean hierarchy, and transition continuity so the interface feels premium and readable at the same time.",
    build:
      "The system assumes reusable interaction tokens, modular surface components, and a front-end structure that can evolve into product-facing interface work rather than remain purely conceptual.",
    outcome:
      "It demonstrates how immersive interface work can stay cinematic and distinctive while still feeling launch-aware, clear, and implementation-minded.",
    principles: [
      "Interface as directed environment",
      "Mood without sacrificing clarity",
      "Reusable navigation structure",
    ],
    mediaLabel: "Interface rhythm study",
    mediaSummary:
      "The strongest presentation format here is a hero loop for atmosphere, a few navigation sequence clips, and still frames that isolate hierarchy, state changes, and interface rhythm.",
    mediaModules: [
      "Hero loop · atmosphere and motion field",
      "Sequence clips · navigation rhythm and state changes",
      "Still frames · hierarchy, labels, spatial layout",
    ],
  },

  "echo-drift-xr": {
    intro:
      "Echo Drift XR studies how gaze, scene pacing, and transition logic can create a stronger authored XR experience before explicit interface layers even become dominant.",
    directionHeading:
      "XR scene pacing built around gaze, drift, and authored spatial transitions.",
    direction:
      "The case is less about visual spectacle and more about how arrival, orientation, and movement through space can feel deliberate, readable, and premium.",
    interaction:
      "Interaction stays sparse. Gaze direction, transition cadence, and scene shifts do most of the work, allowing the experience to feel cinematic rather than reactive.",
    build:
      "The technical approach assumes modular XR scene logic and reusable interaction rules that can migrate from study prototype into broader immersive builds.",
    outcome:
      "This makes the study useful as a foundation for future XR commissions where the main value lies in scene authorship, pacing, and controlled experiential logic.",
    principles: [
      "Gaze-led scene control",
      "Atmosphere with navigation clarity",
      "Prototype systems built to scale",
    ],
    mediaLabel: "XR pacing sequence",
    mediaSummary:
      "The ideal case format combines a strong entry loop, a few drift and transition clips, and still frames that clarify orientation, anchor states, and scene hierarchy.",
    mediaModules: [
      "Hero loop · scene arrival and atmosphere",
      "Sequence clips · gaze, drift, transition timing",
      "Still frames · anchors, depth cues, orientation states",
    ],
  },

  "threshold-memory": {
    intro:
      "Threshold Memory explores darker spatial interface language where media layering, slower pacing, and controlled reveal work together as a future-facing narrative surface.",
    directionHeading:
      "Immersive direction with a clearer pacing and build logic.",
    direction:
      "The study is less about feature density and more about how atmosphere can remain readable, premium, and structurally clear even when the visual language becomes darker and more cinematic.",
    interaction:
      "Motion and transitions are treated as memory cues: slow, controlled, and sequence-aware rather than reactive or decorative.",
    build:
      "Underneath the atmosphere sits a modular implementation path with reusable visual systems, interaction states, and production-friendly constraints.",
    outcome:
      "It positions immersive work as a serious design and implementation layer, not just a visual experiment.",
    principles: [
      "Slow-cinema pacing",
      "Layered media with structure",
      "Immersive direction as system",
    ],
    mediaLabel: "Layered narrative surface",
    mediaSummary:
      "This case works best with one strong nocturne loop, a few short reveal fragments, and selected still frames that show media layering, timing, and frame composition.",
    mediaModules: [
      "Hero loop · nocturne surface and reveal",
      "Sequence clips · memory cues and timing shifts",
      "Still frames · layered media frames and emphasis points",
    ],
  },
};

function openPath(
  navigate: ReturnType<typeof useNavigate>,
  path: string,
  onCloseProject?: () => void
) {
  startSpaPageTransition(navigate, path, onCloseProject);
}

const webHeroVideoChapters = [
  {
    eyebrow: "Module 01 / Field",
    title: "The field establishes the operating language.",
    text:
      "The opening route shows WEBHERO as a living interface field: threshold, stage vocabulary, system overview and proof matrix appear as one controlled environment instead of separate portfolio screens.",
    signals: ["Threshold gate", "Stage vocabulary", "System overview", "R&D proof route"],
  },
  {
    eyebrow: "Module 02 / Backdrops",
    title: "Cinematic Backdrops",
    text:
      "Backdrops are treated as visual infrastructure. They support mood, section transitions and branded atmosphere while staying behind the content rather than becoming decorative noise.",
    signals: ["Atmospheric runtime", "Signal objects", "Reusable visual families", "Transition support"],
  },
  {
    eyebrow: "Module 03 / Living Images",
    title: "Images become spatial surfaces.",
    text:
      "Living Images Classic keeps source fidelity while adding depth, motion and controlled presentation. Living Splat / Pro Mode extends selected images into SHARP / 3DGS-based spatial works for deeper inspection.",
    signals: ["Classic image mode", "Splat / Pro candidates", "Poster-first loading", "Controlled viewer safety"],
  },
  {
    eyebrow: "Module 04 / Art Room",
    title: "Art Room",
    text:
      "Art Room is the exhibition layer. It lets works expose available modes, separate public presentation from heavy viewer routes, and prepare a path toward future XR adapters without making XR the unstable core.",
    signals: ["Curated work modes", "Presentation layer", "Viewer separation", "Future WebXR adapter path"],
  },
];

const webHeroTechnicalReadouts = [
  "Vite / React / TypeScript",
  "WebGL / GLSL / Canvas",
  "Three-dimensional stage composition",
  "SHARP / 3DGS / Gaussian Splat proof vertical",
  "Controlled splat viewer routes",
  "WebXR adapter architecture",
  "Art Room mode-aware presentation layer",
  "Manifest-driven scene runtime",
  "Poster-first lightweight listing strategy",
  "Living Art Mixer active R&D compiler path",
  "Reduced-motion and camera-safety guardrails",
  "Desktop proof package / mobile not packaged yet",
];

const webHeroFieldFrameClasses = [
  "lg:left-[0%] lg:top-[2rem] lg:w-[42%] lg:rotate-[-1.4deg]",
  "lg:left-[38%] lg:top-[6rem] lg:w-[54%] lg:rotate-[1.2deg]",
  "lg:left-[8%] lg:top-[29rem] lg:w-[34%] lg:rotate-[1.8deg]",
  "lg:left-[50%] lg:top-[34rem] lg:w-[42%] lg:rotate-[-1deg]",
  "lg:left-[3%] lg:top-[55rem] lg:w-[48%] lg:rotate-[-0.8deg]",
  "lg:left-[55%] lg:top-[64rem] lg:w-[35%] lg:rotate-[1.4deg]",
  "lg:left-[22%] lg:top-[84rem] lg:w-[38%] lg:rotate-[0.7deg]",
  "lg:left-[62%] lg:top-[92rem] lg:w-[30%] lg:rotate-[-1.7deg]",
  "lg:left-[5%] lg:top-[111rem] lg:w-[36%] lg:rotate-[1.1deg]",
  "lg:left-[43%] lg:top-[119rem] lg:w-[50%] lg:rotate-[-0.6deg]",
  "lg:left-[2%] lg:top-[143rem] lg:w-[47%] lg:rotate-[-1.2deg]",
  "lg:left-[54%] lg:top-[151rem] lg:w-[38%] lg:rotate-[1.5deg]",
];

type WebHeroProofMode = "index" | "field";
const webHeroInitialProofCount = 12;
const webHeroExtendedFieldClasses = [
  "lg:left-[2%] lg:top-[3rem] lg:w-[42%] lg:rotate-[-1.1deg]",
  "lg:left-[47%] lg:top-[8rem] lg:w-[32%] lg:rotate-[1.6deg]",
  "lg:left-[18%] lg:top-[31rem] lg:w-[36%] lg:rotate-[0.9deg]",
  "lg:left-[56%] lg:top-[38rem] lg:w-[36%] lg:rotate-[-1.4deg]",
  "lg:left-[4%] lg:top-[60rem] lg:w-[44%] lg:rotate-[1.3deg]",
  "lg:left-[50%] lg:top-[69rem] lg:w-[42%] lg:rotate-[-0.8deg]",
  "lg:left-[23%] lg:top-[95rem] lg:w-[38%] lg:rotate-[1.2deg]",
  "lg:left-[61%] lg:top-[102rem] lg:w-[28%] lg:rotate-[-1.7deg]",
  "lg:left-[6%] lg:top-[122rem] lg:w-[46%] lg:rotate-[0.8deg]",
];

const webHeroRailItems: SectionRailItem[] = [
  { id: "webhero-threshold", index: "01", label: "Threshold" },
  { id: "webhero-modules", index: "02", label: "Modules" },
  { id: "webhero-proof", index: "03", label: "Proof" },
  { id: "webhero-technical", index: "04", label: "Technical" },
];

const koolBerkRailItems: SectionRailItem[] = [
  { id: "kool-berk-threshold", index: "01", label: "Object" },
  { id: "kool-berk-walkthrough", index: "02", label: "Walkthrough" },
  { id: "kool-berk-depth", index: "03", label: "Depth" },
  { id: "kool-berk-room", index: "04", label: "Room" },
  { id: "kool-berk-technical", index: "05", label: "Technical" },
];

const koolBerkDepthLayers = [
  {
    index: "01",
    title: "Sonic Object Stage",
    text:
      "The entry surface is organized around a central cube. It works as identity, navigation object, release archive and sonic artifact instead of a standard artist homepage.",
    signal: "Cube-led navigation / release archive / identity surface",
  },
  {
    index: "02",
    title: "Object Inspect",
    text:
      "ReleaseUnfold opens albums as compact objects: cover, release note, local preview state, tracklist, platform links and a deeper dossier path stay in one surface.",
    signal: "Release object / quick inspect / platform handoff",
  },
  {
    index: "03",
    title: "Album Dossier",
    text:
      "The dossier behaves like a dark museum terminal for concept, tracks, visuals, credits, platforms, notes and immersive entry points.",
    signal: "Terminal mode / track map / visual archive",
  },
  {
    index: "04",
    title: "Signal Tracks",
    text:
      "Tracks are not playlist rows. Each one stores mood, duration, energy, visual tag, local preview source and Sonic Room readiness.",
    signal: "Tanec Monaha / local audio / room prepared",
  },
];

const koolBerkTechnicalReadouts = [
  "Vite / React / React Router",
  "Three.js / React Three Fiber / Drei",
  "CSS Modules in the source project",
  "Web Audio API / AudioContext / AnalyserNode",
  "Custom GLSL shader atmosphere",
  "Audio-reactive cube material response",
  "Local preview audio for true analysis",
  "Sonic Room fullscreen WebGL overlay",
  "EPK / Press Dossier deep-link layer",
  "Lazy-loaded Home / Dossier / Room / EPK",
  "Manual Vite chunks for React, Three and R3F",
  "Mobile and tablet survival pass completed",
];

const presenceOsRailItems: SectionRailItem[] = [
  { id: "presence-os-threshold", index: "01", label: "Archive" },
  { id: "presence-os-walkthrough", index: "02", label: "Walkthrough" },
  { id: "presence-os-presence", index: "03", label: "Presence" },
  { id: "presence-os-xr", index: "04", label: "XR room" },
  { id: "presence-os-artifacts", index: "05", label: "Artifacts" },
  { id: "presence-os-technical", index: "06", label: "Technical" },
];

const presenceOsRules = [
  {
    index: "01",
    title: "Stillness = clarity",
    text:
      "The interface rewards calm attention. When the user slows down, the memory field becomes more readable instead of adding more controls.",
    signal: "Presence before click pressure",
  },
  {
    index: "02",
    title: "Return = depth",
    text:
      "Repeated attention can make a fragment feel more present, turning return behavior into an interface signal.",
    signal: "Memory gains context through return",
  },
  {
    index: "03",
    title: "Speed = vanishing UI",
    text:
      "Fast movement strips the interface back. The system avoids dashboard noise by letting labels and controls appear only when they are earned.",
    signal: "Quiet archive / reduced interface",
  },
  {
    index: "04",
    title: "Attention = stabilization",
    text:
      "Fragments, climate and inspect states stabilize around attention, creating a field that feels sensitive without pretending to understand the memories.",
    signal: "Algorithmic reconstruction, not AI memory claims",
  },
];

const presenceOsTechnicalReadouts = [
  "Vite / React / TypeScript",
  "Three.js / React Three Fiber / Drei",
  "WebXR / Quest-oriented room path",
  "Local object URLs / sessionStorage",
  "Canvas rendering / phone-style Reel preview",
  "MediaRecorder / local WebM export",
  "WebAudio ambient sound layer",
  "JSZip local artifact package",
  "Synthetic Weather memory climate",
  "VR session trace logger",
  "Replay timeline builder",
  "Mobile and tablet pass still in development",
];

function PresenceOsVideoProof({
  video,
  index,
  title,
  description,
  signals,
}: {
  video: NonNullable<(typeof immersiveItems)[number]["videos"]>[number];
  index: number;
  title: string;
  description: string;
  signals: string[];
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    let playbackLocked = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        const visibleEnough = entry.isIntersecting && entry.intersectionRatio >= 0.72;
        const mostlyGone = !entry.isIntersecting || entry.intersectionRatio <= 0.36;

        if (visibleEnough && !playbackLocked) {
          playbackLocked = true;
          window.requestAnimationFrame(() => {
            void element.play().catch(() => {
              playbackLocked = false;
            });
          });
        }

        if (mostlyGone) {
          playbackLocked = false;
          element.pause();
        }
      },
      {
        threshold: [0, 0.2, 0.36, 0.55, 0.72, 0.9],
        rootMargin: "-8% 0px -12% 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      element.pause();
    };
  }, []);

  return (
    <motion.article
      className="overflow-hidden border border-white/10 bg-white/[0.035] text-white shadow-[0_34px_120px_rgba(0,0,0,0.32)]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-contain"
          muted
          loop
          controls
          playsInline
          preload="metadata"
          poster={video.poster}
        >
          <source src={video.src} type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute left-4 top-4 border-y border-white/16 bg-black/30 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/58 backdrop-blur">
          {String(index + 1).padStart(2, "0")} / {video.label}
        </div>
      </div>
      <div className="grid gap-5 border-t border-white/10 p-5 md:p-7 lg:grid-cols-[0.36fr_0.42fr_0.22fr] lg:items-end">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/36">Directed proof</div>
          <h3 className="mt-4 max-w-[10ch] text-[clamp(2.5rem,4.8vw,5.2rem)] font-normal leading-[0.9] text-white">
            {title}
          </h3>
        </div>
        <p className="max-w-[40rem] text-[14px] leading-7 text-white/62 md:text-[15px] md:leading-8">
          {description}
        </p>
        <div className="grid gap-2 border-t border-white/10 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          {signals.map((signal) => (
            <span key={signal} className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/34">
              {signal}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function OrbitLensNarrativeVideoCard({
  video,
  index,
  eyebrow,
  title,
  description,
  signals,
  reverse = false,
}: {
  video: NonNullable<(typeof immersiveItems)[number]["videos"]>[number];
  index: number;
  eyebrow: string;
  title: string;
  description: string;
  signals: string[];
  reverse?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    let playbackLocked = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        const visibleEnough = entry.isIntersecting && entry.intersectionRatio >= 0.7;
        const mostlyGone = !entry.isIntersecting || entry.intersectionRatio <= 0.32;

        if (visibleEnough && !playbackLocked) {
          playbackLocked = true;
          window.requestAnimationFrame(() => {
            void element.play().catch(() => {
              playbackLocked = false;
            });
          });
        }

        if (mostlyGone) {
          playbackLocked = false;
          element.pause();
        }
      },
      {
        threshold: [0, 0.18, 0.32, 0.5, 0.7, 0.88],
        rootMargin: "-8% 0px -12% 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      element.pause();
    };
  }, []);

  return (
    <motion.article
      className="overflow-hidden border border-white/10 bg-white/[0.03] text-white shadow-[0_34px_120px_rgba(0,0,0,0.32)]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="grid gap-0 lg:grid-cols-[0.58fr_0.42fr]">
        <div className={["relative bg-black", reverse ? "lg:order-2" : ""].join(" ")}>
          <div className="relative aspect-video overflow-hidden">
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-contain"
              muted
              loop
              controls
              playsInline
              preload="metadata"
              poster={video.poster}
            >
              <source src={video.src} type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute left-4 top-4 border-y border-white/16 bg-black/30 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/58 backdrop-blur">
              {String(index + 1).padStart(2, "0")} / {video.label}
            </div>
          </div>
        </div>

        <div
          className={[
            "flex min-h-full flex-col justify-between gap-6 border-t border-white/10 p-5 md:p-7 lg:border-l lg:border-t-0",
            reverse ? "lg:order-1 lg:border-l-0 lg:border-r lg:border-white/10" : "",
          ].join(" ")}
        >
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/36">{eyebrow}</div>
            <h3 className="mt-4 max-w-[11ch] text-[clamp(2.2rem,4vw,4.3rem)] font-normal leading-[0.92] text-white">
              {title}
            </h3>
            <p className="mt-5 max-w-[38rem] text-[14px] leading-7 text-white/62 md:text-[15px] md:leading-8">
              {description}
            </p>
          </div>

          <div className="grid gap-2 border-t border-white/10 pt-4 font-mono text-[8px] uppercase tracking-[0.16em] text-white/34">
            {signals.map((signal) => (
              <span key={signal}>{signal}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function OrbitLensSpatialVideoCard({
  video,
  index,
  eyebrow,
  title,
  description,
  signals,
}: {
  video: NonNullable<(typeof immersiveItems)[number]["videos"]>[number];
  index: number;
  eyebrow: string;
  title: string;
  description: string;
  signals: string[];
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    let playbackLocked = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        const visibleEnough = entry.isIntersecting && entry.intersectionRatio >= 0.68;
        const mostlyGone = !entry.isIntersecting || entry.intersectionRatio <= 0.3;

        if (visibleEnough && !playbackLocked) {
          playbackLocked = true;
          window.requestAnimationFrame(() => {
            void element.play().catch(() => {
              playbackLocked = false;
            });
          });
        }

        if (mostlyGone) {
          playbackLocked = false;
          element.pause();
        }
      },
      {
        threshold: [0, 0.18, 0.3, 0.5, 0.68, 0.9],
        rootMargin: "-8% 0px -12% 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      element.pause();
    };
  }, []);

  return (
    <motion.article
      className="overflow-hidden border border-white/10 bg-white/[0.03] text-white shadow-[0_34px_120px_rgba(0,0,0,0.34)]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative bg-black">
        <div className="relative aspect-[16/10] overflow-hidden md:aspect-[16/8.6]">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
            muted
            loop
            controls
            playsInline
            preload="metadata"
            poster={video.poster}
          >
            <source src={video.src} type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute left-4 top-4 border-y border-white/16 bg-black/30 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/58 backdrop-blur">
            {String(index + 1).padStart(2, "0")} / {video.label}
          </div>
        </div>
      </div>

      <div className="grid gap-5 border-t border-white/10 p-5 md:p-6 lg:grid-cols-[0.36fr_0.64fr] lg:items-center">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/36">{eyebrow}</div>
          <h3 className="mt-4 max-w-[10ch] text-[clamp(2rem,3.8vw,3.8rem)] font-normal leading-[0.92] text-white">
            {title}
          </h3>
        </div>
        <p className="max-w-[44rem] text-[14px] leading-7 text-white/62 md:text-[15px] md:leading-8">{description}</p>
      </div>

      <div className="grid gap-px border-t border-white/10 bg-white/10 sm:grid-cols-3">
        {signals.map((signal) => (
          <div
            key={signal}
            className="bg-[#03070a] px-4 py-4 font-mono text-[8px] uppercase tracking-[0.16em] text-white/34"
          >
            {signal}
          </div>
        ))}
      </div>
    </motion.article>
  );
}

function PresenceOsFrameCard({
  frame,
  index,
  onOpen,
  className = "",
  imageClassName = "aspect-[16/10]",
}: {
  frame: NonNullable<(typeof immersiveItems)[number]["frames"]>[number];
  index: number;
  onOpen: (index: number) => void;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(index)}
      className={[
        "group overflow-hidden border border-white/10 bg-white/[0.032] text-left shadow-[0_30px_110px_rgba(0,0,0,0.28)]",
        className,
      ].join(" ")}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.62, delay: (index % 4) * 0.035, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={["relative overflow-hidden bg-black", imageClassName].join(" ")}>
        <img
          src={frame.src}
          alt={frame.alt}
          className="h-full w-full object-cover opacity-92 transition duration-700 group-hover:scale-[1.02]"
          loading="lazy"
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),transparent_55%,rgba(0,0,0,0.34))]" />
        <div className="pointer-events-none absolute right-3 top-3 border border-white/14 bg-black/34 px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-white/46 opacity-0 backdrop-blur transition group-hover:opacity-100">
          Inspect
        </div>
      </div>
      <div className="border-t border-white/10 p-4 md:p-5">
        <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/36">
          {String(index + 1).padStart(2, "0")} / {frame.label}
        </div>
        <p className="mt-3 text-[13px] leading-6 text-white/56">{frame.caption}</p>
      </div>
    </motion.button>
  );
}

function PresenceOsCaseLayout({
  item,
  onBack,
  onOpenProject,
}: {
  item: (typeof immersiveItems)[number];
  onBack: () => void;
  onOpenProject?: () => void;
}) {
  const activeSection = useSectionRailActive(presenceOsRailItems, "presence-os-threshold");
  const [inspectIndex, setInspectIndex] = useState<number | null>(null);
  const videos = item.videos ?? [];
  const frames = item.frames ?? [];
  const desktopFrames = frames.filter((frame) => frame.device !== "vr");
  const vrFrames = frames.filter((frame) => frame.device === "vr");
  const liveLink = item.links?.find((link) => link.label.toLowerCase().includes("live"));
  const inspectFrames: CaseStoryMedia[] = frames.map((frame, index) => ({
    id: `presence-os-frame-${String(index + 1).padStart(2, "0")}`,
    kind: "image",
    src: frame.src,
    alt: frame.alt,
    label: frame.label ?? `Frame ${index + 1}`,
    caption: frame.caption,
    role: frame.device === "vr" ? "detail" : index < 2 ? "hero" : "proof",
    fit: "contain",
  }));

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    const top = Math.max(0, section.getBoundingClientRect().top + window.scrollY - 76);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <CinematicImmersiveCaseShell tone="presence-os">
    <div className="min-h-screen bg-[#030706] text-white">
      <ImmersiveSeoMeta item={item} imageAlt="Presence OS Memory Atlas immersive case" />
      <SectionRail
        items={presenceOsRailItems}
        activeId={activeSection}
        onSelect={scrollToSection}
        label="Presence OS Memory Atlas sections"
        tone="dark"
      />

      <section
        id="presence-os-threshold"
        data-header-scene="presence-os-threshold"
        className="relative min-h-[100svh] scroll-mt-[5.5rem] overflow-hidden bg-[#030706] pt-[72px] md:scroll-mt-28"
      >
        <img
          src="/immersive/presence-os-memory-atlas/desktop/presence-os-hero.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-48"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_28%,rgba(119,207,184,0.16),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(246,219,165,0.08),transparent_24%),linear-gradient(90deg,#030706_0%,rgba(3,7,6,0.92)_25%,rgba(3,7,6,0.54)_56%,rgba(3,7,6,0.74)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,6,0.18),rgba(3,7,6,0.24)_40%,rgba(3,7,6,0.72)_84%,#030706)]" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:74px_74px]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-72px)] w-[min(94vw,1640px)] flex-col justify-between py-8 md:py-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBack}
              className="border-y border-white/16 bg-black/24 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/62 transition hover:border-white/36 hover:text-white"
            >
              &lt;- Back to immersive
            </button>
            <CaseStatusPill kind={item.statusKind} label={item.status} />
          </div>

          <div className="grid gap-8 py-10 lg:grid-cols-[0.58fr_0.42fr] lg:items-end">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/48">
                Private spatial memory / WebXR prototype MVP
              </div>
              <h1 className="mt-6 max-w-[10ch] text-[clamp(3.8rem,10vw,9.8rem)] font-normal leading-[0.82] tracking-[-0.07em] text-white">
                Presence OS / Memory Atlas
              </h1>
              <p className="mt-7 max-w-[43rem] text-[18px] leading-8 text-white/76 md:text-[21px] md:leading-9">
                A private archive that responds to presence: stillness, return, attention and synthetic weather.
              </p>
            </div>

            <div className="border-y border-white/14 bg-black/28 p-5 backdrop-blur md:p-6">
              <p className="text-[15px] leading-8 text-white/72">{item.description}</p>
              <div className="mt-5 grid gap-2 border-t border-white/12 pt-4 font-mono text-[9px] uppercase tracking-[0.15em] text-white/46">
                <span>Advanced prototype / in active development</span>
                <span>Fully functional MVP path documented</span>
                <span>Processed locally / nothing uploaded by default</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {liveLink ? (
                  <a
                    href={liveLink.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/18 bg-white px-5 text-[11px] uppercase tracking-[0.14em] text-[#030706] transition hover:-translate-y-0.5 hover:bg-white/90"
                  >
                    Open live site -&gt;
                  </a>
                ) : null}
                <ActionPill onClick={() => onOpenProject?.()} aria-haspopup="dialog">
                  Start a project -&gt;
                </ActionPill>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-white/12 pt-5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/42 md:grid-cols-4">
            <span>Local-first archive intake</span>
            <span>Cinematic inspect layer</span>
            <span>XR Memory Room</span>
            <span>Memory Reel artifact export</span>
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto w-[min(94vw,1640px)] py-14 md:py-20">
        <section
          id="presence-os-walkthrough"
          data-header-scene="presence-os-walkthrough"
          className="grid scroll-mt-[5.5rem] gap-8 md:scroll-mt-28"
        >
          {videos[0] ? (
            <PresenceOsVideoProof
              video={videos[0]}
              index={0}
              title="Drop an archive. Let it become a field."
              description="The first walkthrough reads as one product story: local intake, presence field, cinematic inspect, human result, Memory Reel and exportable artifact path. The project stays local-first and does not claim cloud understanding or finished production status."
              signals={["Local-first preview", "Memory field", "Reel + export path"]}
            />
          ) : null}
        </section>

        <section
          id="presence-os-presence"
          data-header-scene="presence-os-walkthrough"
          className="mt-20 scroll-mt-[5.5rem] border-t border-white/10 pt-12 md:scroll-mt-28"
        >
          <div className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr]">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/42">Presence logic</div>
              <h2 className="mt-5 max-w-[9ch] text-[clamp(3rem,6.4vw,6.5rem)] font-normal leading-[0.86] text-white">
                Interface as attention field.
              </h2>
              <p className="mt-6 max-w-[36rem] text-[15px] leading-8 text-white/58">
                Presence OS explores interfaces that respond to presence, not only clicks. Memory Atlas is the first use
                case: a private archive becomes a living field shaped by stillness, return, attention, speed and
                hesitation.
              </p>
            </div>
            <div className="grid gap-px bg-white/10 md:grid-cols-2">
              {presenceOsRules.map((rule) => (
                <div key={rule.title} className="bg-[#030706] p-5 md:p-6">
                  <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">{rule.index}</div>
                  <h3 className="mt-6 text-[clamp(1.8rem,2.8vw,3rem)] font-normal leading-[0.94] text-white">{rule.title}</h3>
                  <p className="mt-5 text-[14px] leading-7 text-white/58">{rule.text}</p>
                  <div className="mt-6 border-t border-white/10 pt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/34">
                    {rule.signal}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 flex flex-wrap items-end justify-between gap-6 border-t border-white/10 pt-10">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/42">Visual proof field</div>
              <h2 className="mt-4 max-w-[11ch] text-[clamp(3.2rem,6.2vw,6.5rem)] font-normal leading-[0.84] text-white">
                Private fragments become readable weather.
              </h2>
            </div>
            <p className="max-w-[32rem] text-[14px] leading-7 text-white/54">
              The desktop frames are arranged as an editorial system rather than a dense grid: entry, intake, field,
              inspect, result, fragments, room and artifact output.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-12">
            {desktopFrames.map((frame, index) => (
              <PresenceOsFrameCard
                key={frame.src}
                frame={frame}
                index={index}
                onOpen={setInspectIndex}
                className={[
                  index === 0 ? "lg:col-span-7" : "",
                  index === 1 ? "lg:col-span-5" : "",
                  index === 2 ? "lg:col-span-8" : "",
                  index === 3 ? "lg:col-span-4" : "",
                  index === 4 ? "lg:col-span-5" : "",
                  index === 5 ? "lg:col-span-7" : "",
                  index >= 6 && index <= 8 ? "lg:col-span-4" : "",
                  index === 9 ? "lg:col-span-8 lg:col-start-3" : "",
                ].join(" ")}
                imageClassName={index === 9 ? "aspect-[18/11]" : "aspect-[16/10]"}
              />
            ))}
          </div>
        </section>

        <section
          id="presence-os-xr"
          data-header-scene="presence-os-xr"
          className="mt-20 scroll-mt-[5.5rem] border-t border-white/10 pt-12 md:scroll-mt-28"
        >
          <div className="grid gap-8 lg:grid-cols-[0.45fr_0.55fr] lg:items-end">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/42">XR Memory Room</div>
              <h2 className="mt-5 max-w-[10ch] text-[clamp(3rem,6.3vw,6.4rem)] font-normal leading-[0.86] text-white">
                A room, not a gimmick.
              </h2>
              <p className="mt-6 max-w-[36rem] text-[15px] leading-8 text-white/58">
                The XR layer is a deeper mode of the same memory system. It uses a fixed comfort-first chamber, readable
                distance bands, gaze focus before hand complexity and a simple command rail for return, reset and exit.
              </p>
            </div>
            {videos[1] ? (
              <PresenceOsVideoProof
                video={videos[1]}
                index={1}
                title="Memory gains spatial distance."
                description="The VR capture documents the current working direction: memory fragments are staged around the viewer with hand presence, gaze focus and calm room behavior. It remains an advanced prototype, with Quest interaction stabilization still underway."
                signals={["Quest-oriented proof", "Hand presence", "No forced locomotion"]}
              />
            ) : null}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {vrFrames.map((frame) => {
              const frameIndex = frames.findIndex((item) => item.src === frame.src);

              return (
                <PresenceOsFrameCard
                  key={frame.src}
                  frame={frame}
                  index={frameIndex}
                  onOpen={setInspectIndex}
                  className="xl:col-span-1"
                  imageClassName="aspect-video"
                />
              );
            })}
          </div>
        </section>

        <section
          id="presence-os-artifacts"
          data-header-scene="presence-os-artifact"
          className="mt-20 grid scroll-mt-[5.5rem] gap-8 border-t border-white/10 pt-12 md:scroll-mt-28 lg:grid-cols-[0.52fr_0.48fr]"
        >
          <div className="border-y border-white/10 bg-white/[0.025] p-5 md:p-7">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/42">Local-first trust</div>
            <h2 className="mt-5 max-w-[10ch] text-[clamp(3rem,6vw,6.1rem)] font-normal leading-[0.86] text-white">
              Nothing uploaded. Nothing stored.
            </h2>
            <p className="mt-6 text-[15px] leading-8 text-white/62">
              The prototype is designed around private archive trust. Files are processed locally in the browser by
              default, then converted into preview artifacts: Memory Reel, replay timeline, WebM export and a local ZIP
              handoff pack.
            </p>
          </div>
          <div className="grid gap-px bg-white/10 sm:grid-cols-2">
            {[
              "Memory Reel preview",
              "Local WebM export",
              "Replay timeline builder",
              "VR session trace",
              "Artifact ZIP pack",
              "Future PDF booklet output",
            ].map((item, index) => (
              <div key={item} className="bg-[#030706] p-5 font-mono text-[10px] uppercase leading-5 tracking-[0.16em] text-white/58">
                <span className="mr-4 text-white/24">{String(index + 1).padStart(2, "0")}</span>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section
          id="presence-os-technical"
          data-header-scene="presence-os-technical"
          className="mt-20 grid scroll-mt-[5.5rem] gap-8 border-t border-white/10 pt-12 md:scroll-mt-28 lg:grid-cols-[0.46fr_0.54fr]"
        >
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/42">Technical dossier</div>
            <h2 className="mt-5 max-w-[10ch] text-[clamp(3rem,6vw,6.2rem)] font-normal leading-[0.86] text-white">
              Local-first memory engine.
            </h2>
            <p className="mt-6 max-w-[36rem] text-[15px] leading-8 text-white/58">
              The stack supports a working MVP without overstating the product: browser-local intake, WebGL spatial
              presentation, XR room research, canvas artifact generation and export tooling stay in one experimental
              system.
            </p>
          </div>

          <div className="grid gap-px bg-white/10 sm:grid-cols-2">
            {presenceOsTechnicalReadouts.map((item, index) => (
              <div key={item} className="bg-[#030706] p-5 font-mono text-[10px] uppercase leading-5 tracking-[0.16em] text-white/58">
                <span className="mr-4 text-white/24">{String(index + 1).padStart(2, "0")}</span>
                {item}
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooterV2
        onOpenProject={onOpenProject}
        variant="immersiveCase"
        immersiveCaseContent={{
          headline: "Build a private spatial memory interface.",
          description:
            "Presence OS closes as an MVP proof: local archive intake, presence-based behavior, cinematic inspect, XR room research and artifact export stay inside one quiet memory system.",
          signal: "presence-based memory systems",
          intake: "available",
          nextStep: "start a spatial memory prototype",
          bottomLine: "Built as a local-first immersive interface system.",
          ctaLabel: "Start a project",
        }}
      />

      <CinematicInspectReveal
        frames={inspectFrames}
        index={inspectIndex}
        onClose={() => setInspectIndex(null)}
        onSelect={setInspectIndex}
      />
    </div>
    </CinematicImmersiveCaseShell>
  );
}

const orbitLensRailItems: SectionRailItem[] = [
  { id: "orbit-lens-threshold", index: "01", label: "Product OS" },
  { id: "orbit-lens-walkthrough", index: "02", label: "Walkthrough" },
  { id: "orbit-lens-fields", index: "03", label: "Fields" },
  { id: "orbit-lens-orbit", index: "04", label: "Orbit" },
  { id: "orbit-lens-xr", index: "05", label: "WebXR" },
  { id: "orbit-lens-technical", index: "06", label: "Technical" },
];

const orbitLensHeroBackdropConfig = {
  palette: {
    bg: "#02070d",
    deep: "#081426",
    accent: "#7de9ff",
  },
  atmosphere: {
    intensity: 0.98,
    haze: 0.9,
    beam: 1,
    tint: 0.74,
    drift: 0.16,
  },
} as const;

const orbitLensFields = [
  {
    index: "01",
    title: "Vision / Spatial Clarity",
    text:
      "The product appears as a premium AI eyewear object: quiet optical depth, restrained controls and less interface noise.",
    signal: "Spatial clarity without the noise",
  },
  {
    index: "02",
    title: "Transparent Language",
    text:
      "Translation behaves as a contextual layer over the world, with source and translated hierarchy resolving inside the same optical surface.",
    signal: "Language becomes transparent",
  },
  {
    index: "03",
    title: "Recall",
    text:
      "Memory is framed as user-led recall, not passive recording. The system only begins when the user asks.",
    signal: "Memory begins only when you ask",
  },
  {
    index: "04",
    title: "Focus Quieting",
    text:
      "The interface removes excess layers and keeps only the priority signal, making attention feel calmer and more expensive.",
    signal: "Less interface / more attention",
  },
  {
    index: "05",
    title: "Trust Boundary",
    text:
      "Privacy is shown as visible product behavior: consent, public/private boundary and manual memory access are part of the interface.",
    signal: "Trust is part of the interface",
  },
  {
    index: "06",
    title: "Access Terminal",
    text:
      "The final field becomes a controlled product terminal for live preview, repository proof and studio handoff.",
    signal: "Product / studio access",
  },
];

const orbitLensTechnicalReadouts = [
  "Next.js / App Router",
  "React / TypeScript",
  "Tailwind CSS material system",
  "Motion / motion architecture",
  "Three.js / WebXR scene route",
  "GLSL / WebGL canvas atmosphere",
  "Cinematic Inspect Reveal system",
  "Scroll-Driven Spatial Reference Orbit",
  "Persistent Field Copy Transition",
  "De-HUD premium material pass",
  "Metadata / OG / favicon / manifest",
  "Mobile and tablet polish deferred",
];

function OrbitLensCaseLayout({
  item,
  onBack,
  onOpenProject,
}: {
  item: (typeof immersiveItems)[number];
  onBack: () => void;
  onOpenProject?: () => void;
}) {
  const activeSection = useSectionRailActive(orbitLensRailItems, "orbit-lens-threshold");
  const [inspectIndex, setInspectIndex] = useState<number | null>(null);
  const videos = item.videos ?? [];
  const frames = item.frames ?? [];
  const liveLink = item.links?.find((link) => link.label.toLowerCase().includes("live"));
  const repoLink = item.links?.find((link) => link.label.toLowerCase().includes("repo"));
  const inspectFrames: CaseStoryMedia[] = frames.map((frame, index) => ({
    id: `orbit-lens-frame-${String(index + 1).padStart(2, "0")}`,
    kind: "image",
    src: frame.src,
    alt: frame.alt,
    label: frame.label ?? `Frame ${index + 1}`,
    caption: frame.caption,
    role: index < 1 ? "hero" : index >= 7 ? "detail" : "proof",
    fit: "contain",
  }));

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    const top = Math.max(0, section.getBoundingClientRect().top + window.scrollY - 76);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <CinematicImmersiveCaseShell tone="orbit-lens">
    <div className="min-h-screen bg-[#03070a] text-white">
      <ImmersiveSeoMeta item={item} imageAlt="Orbit Lens immersive product interface case" />
      <SectionRail
        items={orbitLensRailItems}
        activeId={activeSection}
        onSelect={scrollToSection}
        label="Orbit Lens sections"
        tone="dark"
      />

      <section
        id="orbit-lens-threshold"
        data-header-scene="orbit-lens-threshold"
        className="relative min-h-[100svh] scroll-mt-[5.5rem] overflow-hidden bg-[#03070a] pt-[72px] md:scroll-mt-28"
      >
        <KoolBerkWebGLBackdrop
          preset={orbitLensHeroBackdropConfig}
          scriptId="orbit-lens-webgl-background-script"
          scriptSrc="/immersive/orbit-lens/orbit-lens-background.js"
          className="absolute inset-0 opacity-[0.98] mix-blend-screen"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(124,236,255,0.32),transparent_20%),radial-gradient(circle_at_81%_34%,rgba(110,128,255,0.24),transparent_24%),radial-gradient(circle_at_20%_66%,rgba(80,164,255,0.18),transparent_28%),radial-gradient(circle_at_56%_72%,rgba(67,107,196,0.18),transparent_26%),linear-gradient(90deg,rgba(2,7,13,0.94)_0%,rgba(2,7,13,0.82)_34%,rgba(2,7,13,0.2)_62%,rgba(2,7,13,0.78)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,7,13,0.02),rgba(2,7,13,0.14)_24%,rgba(2,7,13,0.58)_72%,#02070d)]" />
        <div className="absolute inset-0 opacity-[0.065] [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
        <motion.div
          className="pointer-events-none absolute left-[-8%] top-[6%] h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(115,226,255,0.22)_0%,rgba(74,118,218,0.12)_34%,transparent_72%)] blur-[96px]"
          animate={{ opacity: [0.5, 0.86, 0.5], x: [0, 14, 0], y: [0, -8, 0] }}
          transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, repeatType: "mirror", ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute right-[7%] top-[8%] h-[42rem] w-[42rem] rounded-full border border-cyan-100/12 bg-[radial-gradient(circle_at_center,rgba(123,232,255,0.08)_0%,rgba(75,120,219,0.04)_42%,transparent_72%)] shadow-[0_0_180px_rgba(122,231,255,0.12)]"
          animate={{ rotate: [0, 7, 0], scale: [1, 1.025, 1], opacity: [0.58, 0.88, 0.58] }}
          transition={{ duration: 24, repeat: Number.POSITIVE_INFINITY, repeatType: "mirror", ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute right-[14%] top-[17%] h-[20rem] w-[46rem] rounded-full bg-[linear-gradient(90deg,transparent,rgba(126,233,255,0.12),rgba(117,118,255,0.16),rgba(126,233,255,0.12),transparent)] blur-[28px] mix-blend-screen"
          animate={{ opacity: [0.24, 0.7, 0.24], x: [0, 16, 0] }}
          transition={{ duration: 11, repeat: Number.POSITIVE_INFINITY, repeatType: "mirror", ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute left-[22%] top-[22%] h-[28rem] w-[28rem] rounded-full border border-white/10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,rgba(123,232,255,0.04)_36%,transparent_74%)]"
          animate={{ rotate: [0, -10, 0], opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, repeatType: "mirror", ease: "easeInOut" }}
        />
        <div className="pointer-events-none absolute inset-x-[11%] top-[28%] h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),rgba(126,233,255,0.24),rgba(255,255,255,0.08),transparent)]" />
        <motion.div
          className="pointer-events-none absolute inset-x-[36%] top-[34%] h-24 bg-[radial-gradient(circle_at_center,rgba(125,233,255,0.36)_0%,rgba(97,125,255,0.2)_34%,transparent_70%)] blur-[24px]"
          animate={{ opacity: [0.18, 0.64, 0.18], scaleX: [0.94, 1.02, 0.94], x: [0, 10, 0] }}
          transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, repeatType: "mirror", ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute left-[-12%] bottom-[8%] h-[20rem] w-[56rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(76,145,255,0.24)_0%,rgba(74,110,210,0.12)_30%,transparent_74%)] blur-[80px]"
          animate={{ opacity: [0.28, 0.7, 0.28], x: [0, -10, 0] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "mirror", ease: "easeInOut" }}
        />
        <div className="absolute inset-y-[12%] right-[14%] w-px bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.08),rgba(126,233,255,0.2),rgba(255,255,255,0.08),transparent)] opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_26%,transparent_0%,rgba(2,7,13,0.06)_40%,rgba(2,7,13,0.4)_70%,rgba(2,7,13,0.82)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-72px)] w-[min(94vw,1640px)] flex-col justify-between py-8 md:py-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBack}
              className="border-y border-white/16 bg-black/24 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/62 transition hover:border-white/36 hover:text-white"
            >
              &lt;- Back to immersive
            </button>
            <CaseStatusPill kind={item.statusKind} label={item.status} />
          </div>

          <div className="grid gap-8 py-10 lg:grid-cols-[0.56fr_0.44fr] lg:items-end">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/48">
                Fictional AI eyewear / premium product interface
              </div>
              <h1 className="mt-6 max-w-[8ch] text-[clamp(4.5rem,12vw,11rem)] font-normal leading-[0.8] tracking-[-0.075em] text-white">
                Orbit Lens
              </h1>
              <p className="mt-7 max-w-[43rem] text-[18px] leading-8 text-white/76 md:text-[21px] md:leading-9">
                A cinematic web interface for fictional AI spatial glasses, where the website behaves like the product OS.
              </p>
            </div>

            <div className="border-y border-white/14 bg-black/10 p-5 backdrop-blur-2xl md:p-6">
              <p className="text-[15px] leading-8 text-white/72">{item.description}</p>
              <div className="mt-5 grid gap-2 border-t border-white/12 pt-4 font-mono text-[9px] uppercase tracking-[0.15em] text-white/46">
                <span>Fictional product concept / no commercial hardware claim</span>
                <span>Web-first prototype / Spatial Mode as WebXR proof</span>
                <span>AI processing conceptual / hand navigation experimental</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {liveLink ? (
                  <a
                    href={liveLink.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/18 bg-white px-5 text-[11px] uppercase tracking-[0.14em] text-[#03070a] transition hover:-translate-y-0.5 hover:bg-white/90"
                  >
                    Open live site -&gt;
                  </a>
                ) : null}
                {repoLink ? (
                  <a
                    href={repoLink.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/16 bg-white/[0.04] px-5 text-[11px] uppercase tracking-[0.14em] text-white/74 transition hover:-translate-y-0.5 hover:border-white/34 hover:bg-white/8 hover:text-white"
                  >
                    Open GitHub -&gt;
                  </a>
                ) : null}
                <ActionPill onClick={() => onOpenProject?.()} aria-haspopup="dialog">
                  Start a project -&gt;
                </ActionPill>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-white/12 pt-5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/42 md:grid-cols-4">
            <span>Seven contextual intelligence fields</span>
            <span>Cinematic Inspect Reveal</span>
            <span>Scroll-driven Reference Orbit</span>
            <span>Optional WebXR proof mode</span>
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto w-[min(94vw,1640px)] py-14 md:py-20">
        <section
          id="orbit-lens-walkthrough"
          data-header-scene="orbit-lens-fields"
          className="grid scroll-mt-[5.5rem] gap-8 md:scroll-mt-28"
        >
          {videos[0] ? (
            <OrbitLensNarrativeVideoCard
              video={videos[0]}
              index={0}
              eyebrow="Directed module / product OS"
              title="The site behaves like the device."
              description="The first walkthrough reads as one product operating field: optical clarity sets the tone, then language, recall, creator capture, focus, privacy and access resolve as contextual layers of the same imagined AI eyewear system."
              signals={["Field-driven product narrative", "Persistent copy transition", "De-HUD material pass"]}
            />
          ) : null}
        </section>

        <section
          id="orbit-lens-fields"
          data-header-scene="orbit-lens-fields"
          className="mt-20 scroll-mt-[5.5rem] border-t border-white/10 pt-12 md:scroll-mt-28"
        >
          <div className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr]">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/42">Product fields</div>
              <h2 className="mt-5 max-w-[9ch] text-[clamp(3rem,6.4vw,6.5rem)] font-normal leading-[0.86] text-white">
                Seven modes, one product OS.
              </h2>
              <p className="mt-6 max-w-[36rem] text-[15px] leading-8 text-white/58">
                Orbit Lens replaces the expected hero/features/benefits pattern with contextual intelligence fields.
                Each field demonstrates how fictional AI glasses could layer useful context over the world without becoming
                cyberpunk HUD clutter.
              </p>
            </div>
            <div className="grid gap-px bg-white/10 md:grid-cols-2">
              {orbitLensFields.map((field) => (
                <div key={field.title} className="bg-[#03070a] p-5 md:p-6">
                  <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">{field.index}</div>
                  <h3 className="mt-6 text-[clamp(1.8rem,2.8vw,3rem)] font-normal leading-[0.94] text-white">{field.title}</h3>
                  <p className="mt-5 text-[14px] leading-7 text-white/58">{field.text}</p>
                  <div className="mt-6 border-t border-white/10 pt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/34">
                    {field.signal}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 flex flex-wrap items-end justify-between gap-6 border-t border-white/10 pt-10">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/42">Visual proof field</div>
              <h2 className="mt-4 max-w-[11ch] text-[clamp(3.2rem,6.2vw,6.5rem)] font-normal leading-[0.84] text-white">
                Quiet futuristic luxury, not a gamer HUD.
              </h2>
            </div>
            <p className="max-w-[32rem] text-[14px] leading-7 text-white/54">
              The frames are sequenced as an authored product story: optical hero, transparent language, user-led recall,
              creator orbit, quiet focus, trust boundary, access terminal and product inspection.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-12">
            {frames.map((frame, index) => (
              <PresenceOsFrameCard
                key={frame.src}
                frame={frame}
                index={index}
                onOpen={setInspectIndex}
                className={[
                  index === 0 ? "lg:col-span-7" : "",
                  index === 1 ? "lg:col-span-5" : "",
                  index === 2 ? "lg:col-span-5" : "",
                  index === 3 ? "lg:col-span-7" : "",
                  index === 4 ? "lg:col-span-6" : "",
                  index === 5 ? "lg:col-span-6" : "",
                  index === 6 ? "lg:col-span-8" : "",
                  index >= 7 ? "lg:col-span-4" : "",
                ].join(" ")}
                imageClassName={index === 6 ? "aspect-[18/11]" : "aspect-[16/10]"}
              />
            ))}
          </div>
        </section>

        <section
          id="orbit-lens-orbit"
          data-header-scene="orbit-lens-orbit"
          className="mt-20 grid scroll-mt-[5.5rem] gap-8 border-t border-white/10 pt-12 md:scroll-mt-28 lg:grid-cols-[0.52fr_0.48fr]"
        >
          <button
            type="button"
            onClick={() => setInspectIndex(3)}
            className="group overflow-hidden border border-cyan-100/12 bg-black text-left shadow-[0_34px_120px_rgba(0,0,0,0.36)]"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src="/immersive/orbit-lens/desktop/orbit-lens-reference-orbit.webp"
                alt="Orbit Lens Scroll-Driven Spatial Reference Orbit"
                className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.018]"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_44%,transparent,rgba(0,0,0,0.38)_74%)]" />
            </div>
          </button>

          <div className="border-y border-cyan-100/12 bg-cyan-950/[0.06] p-5 md:p-7">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-100/42">Signature interaction</div>
            <h2 className="mt-5 max-w-[10ch] text-[clamp(3rem,6vw,6rem)] font-normal leading-[0.86] text-white">
              References move like objects.
            </h2>
            <p className="mt-6 text-[15px] leading-8 text-white/62">
              Field 04 implements a Scroll-Driven Spatial Reference Orbit: a pseudo-3D carousel where visual notes float,
              recede and resolve around the active capture layer. The important part is not novelty; it is making creator
              capture feel like a spatial interface layer.
            </p>
            <div className="mt-6 grid gap-2 border-t border-cyan-100/10 pt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-100/38">
              <span>Wheel-driven active state</span>
              <span>Scale / opacity / z-depth</span>
              <span>Inspect Optics as persistent layer</span>
              <span>Reduced HUD / optical material pass</span>
            </div>
          </div>
        </section>

        <section
          id="orbit-lens-xr"
          data-header-scene="orbit-lens-xr"
          className="mt-20 scroll-mt-[5.5rem] border-t border-white/10 pt-12 md:scroll-mt-28"
        >
          <div className="grid gap-8 lg:grid-cols-[0.32fr_0.68fr] lg:items-start">
            <div className="flex h-full flex-col justify-between gap-8">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/42">WebXR proof layer</div>
                <h2 className="mt-5 max-w-[10ch] text-[clamp(2.8rem,5.4vw,5.6rem)] font-normal leading-[0.88] text-white">
                  Spatial Mode is a proof, not a final VR claim.
                </h2>
                <p className="mt-6 max-w-[28rem] text-[15px] leading-8 text-white/58">
                  Orbit Lens includes an optional `/spatial` route with Enter VR capability, Quest-tested session
                  capture, spatial panels, Inspect Optics in XR mode and experimental hand presence. It is positioned
                  as a WebXR proof layer while the core product remains web-first.
                </p>
              </div>
              <div className="grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-3 lg:grid-cols-1">
                <div className="border border-white/10 bg-white/[0.03] p-4">
                  <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/34">Capture</div>
                  <p className="mt-3 text-[14px] leading-7 text-white/66">Quest-tested spatial recording.</p>
                </div>
                <div className="border border-white/10 bg-white/[0.03] p-4">
                  <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/34">Mode</div>
                  <p className="mt-3 text-[14px] leading-7 text-white/66">WebXR proof layer, not final control room.</p>
                </div>
                <div className="border border-white/10 bg-white/[0.03] p-4">
                  <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/34">Presence</div>
                  <p className="mt-3 text-[14px] leading-7 text-white/66">Hand navigation stays experimental.</p>
                </div>
              </div>
            </div>
            {videos[1] ? (
              <OrbitLensSpatialVideoCard
                video={videos[1]}
                index={1}
                eyebrow="WebXR proof / spatial mode"
                title="The interface can leave the page."
                description="The VR capture demonstrates that the same fictional product system can become a spatial presentation layer. Hand navigation is experimental, so the case stays honest: WebXR proof, not a finished production VR control system."
                signals={["Quest-tested capture", "Inspect Optics in XR", "Experimental hand presence"]}
              />
            ) : null}
          </div>
        </section>

        <section
          id="orbit-lens-technical"
          data-header-scene="orbit-lens-technical"
          className="mt-20 grid scroll-mt-[5.5rem] gap-8 border-t border-white/10 pt-12 md:scroll-mt-28 lg:grid-cols-[0.46fr_0.54fr]"
        >
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/42">Technical dossier</div>
            <h2 className="mt-5 max-w-[10ch] text-[clamp(3rem,6vw,6.2rem)] font-normal leading-[0.86] text-white">
              Optical product interface stack.
            </h2>
            <p className="mt-6 max-w-[36rem] text-[15px] leading-8 text-white/58">
              The implementation is built as a mode-based product interface: persistent overlays, field-driven narrative,
              a lightweight GLSL atmospheric layer, WebXR route and production-like metadata/repo hygiene.
            </p>
          </div>

          <div className="grid gap-px bg-white/10 sm:grid-cols-2">
            {orbitLensTechnicalReadouts.map((item, index) => (
              <div key={item} className="bg-[#03070a] p-5 font-mono text-[10px] uppercase leading-5 tracking-[0.16em] text-white/58">
                <span className="mr-4 text-white/24">{String(index + 1).padStart(2, "0")}</span>
                {item}
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooterV2
        onOpenProject={onOpenProject}
        variant="immersiveCase"
        immersiveCaseContent={{
          headline: "Build the next product OS surface.",
          description:
            "Orbit Lens closes as a fictional AI eyewear proof: field-driven product narrative, optical interface materials, cinematic inspection, reference orbit and WebXR proof mode stay inside one premium web-first system.",
          signal: "premium spatial product systems",
          intake: "available",
          nextStep: "start a product-interface prototype",
          bottomLine: "Built as a fictional AI spatial glasses interface concept.",
          ctaLabel: "Start a project",
        }}
      />

      <CinematicInspectReveal
        frames={inspectFrames}
        index={inspectIndex}
        onClose={() => setInspectIndex(null)}
        onSelect={setInspectIndex}
      />
    </div>
    </CinematicImmersiveCaseShell>
  );
}

function KoolBerkVideoProof({
  video,
}: {
  video: NonNullable<(typeof immersiveItems)[number]["videos"]>[number];
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    let playbackLocked = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        const visibleEnough = entry.isIntersecting && entry.intersectionRatio >= 0.72;
        const mostlyGone = !entry.isIntersecting || entry.intersectionRatio <= 0.38;

        if (visibleEnough && !playbackLocked) {
          playbackLocked = true;
          const startPlayback = () => {
            void element.play().catch(() => {
              playbackLocked = false;
            });
          };
          window.requestAnimationFrame(startPlayback);
        }

        if (mostlyGone) {
          playbackLocked = false;
          element.pause();
        }
      },
      {
        threshold: [0, 0.2, 0.38, 0.55, 0.72, 0.9],
        rootMargin: "-8% 0px -10% 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      element.pause();
    };
  }, []);

  return (
    <motion.article
      className="overflow-hidden border border-white/10 bg-white/[0.035] text-white shadow-[0_30px_110px_rgba(0,0,0,0.28)]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-contain"
          muted
          loop
          controls
          playsInline
          preload="metadata"
          poster={video.poster}
        >
          <source src={video.src} type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute left-4 top-4 border-y border-white/16 bg-black/28 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/58 backdrop-blur">
          01 / Walkthrough
        </div>
      </div>
      <div className="grid gap-5 border-t border-white/10 p-5 md:p-7 lg:grid-cols-[0.26fr_0.4fr_0.34fr] lg:items-end">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/36">{video.label}</div>
          <h2 className="mt-4 max-w-[9ch] text-[clamp(2.2rem,4.4vw,4.4rem)] font-normal leading-[0.92] text-white">
            One route. Multiple depths.
          </h2>
        </div>
        <p className="max-w-[38rem] text-[14px] leading-7 text-white/62 md:text-[15px] md:leading-8">
          {video.caption} The recording is intentionally kept as a single product story: the cube opens the artist
          identity, releases unfold as inspectable objects, MONAH enters dossier mode, and the Sonic Room becomes the
          first immersive listening state.
        </p>
        <div className="border border-white/10 bg-black/18 p-4 md:p-5">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/34">
            Demo build / active development presentation
          </div>
          <p className="mt-4 text-[13px] leading-6 text-white/56 md:text-[14px] md:leading-7">
            This case is shown as a public development proof: the core interaction system is already legible, while the
            final launch polish, platform handoff details, and future animation passes are still being completed.
          </p>
          <div className="mt-4 grid gap-2 border-t border-white/10 pt-3 font-mono text-[8px] uppercase tracking-[0.16em] text-white/36">
            <span>Cube-led identity surface</span>
            <span>Release inspect + dossier path</span>
            <span>Audio-reactive room prototype</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function KoolBerkEditorialFrame({
  frame,
  index,
  onOpen,
  className = "",
  imageClassName = "aspect-[16/10]",
}: {
  frame: NonNullable<(typeof immersiveItems)[number]["frames"]>[number];
  index: number;
  onOpen: (index: number) => void;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(index)}
      className={[
        "group overflow-hidden border border-white/10 bg-white/[0.035] text-left shadow-[0_30px_110px_rgba(0,0,0,0.28)]",
        className,
      ].join(" ")}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={["relative overflow-hidden bg-black", imageClassName].join(" ")}>
        <img
          src={frame.src}
          alt={frame.alt}
          className="h-full w-full object-cover opacity-92 transition duration-700 group-hover:scale-[1.02]"
          loading="lazy"
          decoding="async"
        />
        <div className="pointer-events-none absolute right-3 top-3 border border-white/14 bg-black/34 px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-white/46 opacity-0 backdrop-blur transition group-hover:opacity-100">
          Inspect
        </div>
      </div>
      <div className="border-t border-white/10 p-4 md:p-5">
        <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/36">
          {String(index + 1).padStart(2, "0")} / {frame.label}
        </div>
        <p className="mt-3 text-[13px] leading-6 text-white/56">{frame.caption}</p>
      </div>
    </motion.button>
  );
}

function KoolBerkEditorialNote({
  eyebrow,
  title,
  body,
  signals,
  className = "",
}: {
  eyebrow: string;
  title: string;
  body: string;
  signals: string[];
  className?: string;
}) {
  return (
    <motion.div
      className={[
        "border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))] p-5 text-white shadow-[0_30px_110px_rgba(0,0,0,0.22)] md:p-6",
        className,
      ].join(" ")}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/34">{eyebrow}</div>
      <h3 className="mt-4 max-w-[10ch] text-[clamp(2rem,4vw,3.6rem)] font-normal leading-[0.92] text-white">
        {title}
      </h3>
      <p className="mt-5 text-[14px] leading-7 text-white/58">{body}</p>
      <div className="mt-5 grid gap-2 border-t border-white/10 pt-3 font-mono text-[8px] uppercase tracking-[0.16em] text-white/34">
        {signals.map((signal) => (
          <span key={signal}>{signal}</span>
        ))}
      </div>
    </motion.div>
  );
}

function KoolBerkCaseLayout({
  item,
  onBack,
  onOpenProject,
}: {
  item: (typeof immersiveItems)[number];
  onBack: () => void;
  onOpenProject?: () => void;
}) {
  const video = item.videos?.[0];
  const frames = item.frames ?? [];
  const activeSection = useSectionRailActive(koolBerkRailItems, "kool-berk-threshold");
  const [inspectIndex, setInspectIndex] = useState<number | null>(null);
  const inspectFrames: CaseStoryMedia[] = frames.map((frame, index) => ({
    id: `kool-berk-frame-${String(index + 1).padStart(2, "0")}`,
    kind: "image",
    src: frame.src,
    alt: frame.alt,
    label: frame.label ?? `Frame ${index + 1}`,
    caption: frame.caption,
    role: index === 0 ? "hero" : index === 5 ? "detail" : "proof",
    fit: "contain",
  }));
  const stageFrame = frames[0];
  const inspectFrame = frames[1];
  const trackFrame = frames[2];
  const monahInspectFrame = frames[3];
  const releaseObjectFrame = frames[4];
  const roomFrame = frames[5];
  const contactFrame = frames[6];

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    const top = Math.max(0, section.getBoundingClientRect().top + window.scrollY - 76);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <CinematicImmersiveCaseShell tone="kool-berk">
    <div className="min-h-screen bg-[#04070d] text-white">
      <ImmersiveSeoMeta item={item} imageAlt="Kool Berk Sonic Object OS immersive case" />
      <SectionRail
        items={koolBerkRailItems}
        activeId={activeSection}
        onSelect={scrollToSection}
        label="Kool Berk sections"
        tone="dark"
      />

      <section
        id="kool-berk-threshold"
        data-header-scene="kool-berk-threshold"
        className="relative min-h-[100svh] scroll-mt-[5.5rem] overflow-hidden bg-[#04070d] pt-[72px] md:scroll-mt-28"
      >
        <KoolBerkWebGLBackdrop className="absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_26%,rgba(94,151,232,0.16),transparent_24%),radial-gradient(circle_at_24%_76%,rgba(158,36,44,0.12),transparent_28%),linear-gradient(180deg,rgba(4,7,13,0.02),rgba(4,7,13,0.26)_40%,rgba(4,7,13,0.62)_74%,#04070d)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#04070d_0%,rgba(4,7,13,0.94)_24%,rgba(4,7,13,0.42)_52%,rgba(4,7,13,0.16)_74%,rgba(4,7,13,0.28)_100%)]" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:76px_76px]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,13,0.22),transparent_18%,transparent_82%,rgba(4,7,13,0.48))]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-72px)] w-[min(94vw,1640px)] flex-col justify-between py-8 md:py-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBack}
              className="border-y border-white/16 bg-black/24 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/62 transition hover:border-white/36 hover:text-white"
            >
              &lt;- Back to immersive
            </button>
            <CaseStatusPill kind={item.statusKind} label={item.status} />
          </div>

          <div className="grid gap-8 py-10 lg:grid-cols-[0.56fr_0.44fr] lg:items-end">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/48">
                Audio-visual artist interface / immersive music environment
              </div>
              <h1 className="mt-6 max-w-[8ch] text-[clamp(4.4rem,12vw,11rem)] font-normal leading-[0.82] text-white">
                Kool Berk
              </h1>
              <p className="mt-7 max-w-[42rem] text-[18px] leading-8 text-white/76 md:text-[21px] md:leading-9">
                A Sonic Object OS where releases become digital artifacts, tracks become signal studies, and listening
                becomes an audio-reactive WebGL room.
              </p>
            </div>

            <div className="border-y border-white/14 bg-black/26 p-5 backdrop-blur md:p-6">
              <p className="text-[15px] leading-8 text-white/72">{item.description}</p>
              <div className="mt-5 grid gap-2 border-t border-white/12 pt-4 font-mono text-[9px] uppercase tracking-[0.15em] text-white/46">
                <span>Experimental electronic / ritual techno / dark minimal sound design</span>
                <span>One interface / multiple depths</span>
                <span>Advanced prototype / public launch polish pending</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://kool-berk.pages.dev/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/18 bg-transparent px-5 text-[11px] uppercase tracking-[0.14em] text-white/78 transition hover:-translate-y-0.5 hover:border-white/34 hover:bg-white/5 hover:text-white"
                >
                  Open live site -&gt;
                </a>
                <ActionPill onClick={() => onOpenProject?.()} aria-haspopup="dialog">
                  Start a project -&gt;
                </ActionPill>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-white/12 pt-5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/42 md:grid-cols-4">
            <span>Sonic Object Stage</span>
            <span>Album Dossier</span>
            <span>Web Audio analysis</span>
            <span>Future WebXR room path</span>
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto w-[min(94vw,1640px)] py-14 md:py-20">
        {video ? (
          <section
            id="kool-berk-walkthrough"
            data-header-scene="kool-berk-object"
            className="scroll-mt-[5.5rem] md:scroll-mt-28"
          >
            <KoolBerkVideoProof video={video} />
          </section>
        ) : null}

        <section
          id="kool-berk-depth"
          data-header-scene="kool-berk-object"
          className="mt-20 scroll-mt-[5.5rem] border-t border-white/10 pt-12 md:scroll-mt-28"
        >
          <div className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr]">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/42">System architecture</div>
              <h2 className="mt-5 max-w-[9ch] text-[clamp(3rem,6.2vw,6.2rem)] font-normal leading-[0.88] text-white">
                From artist page to sonic object system.
              </h2>
              <p className="mt-6 max-w-[36rem] text-[15px] leading-8 text-white/58">
                The project avoids a DJ template, streaming clone, standard press kit, or neon visualizer. It behaves as a
                dark artist research environment: part release archive, part EPK, part audio-reactive installation.
              </p>
              <div className="mt-7 border-y border-white/10 py-4">
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/34">
                  Presentation note / demo build in active development
                </div>
                <p className="mt-3 max-w-[34rem] text-[14px] leading-7 text-white/54">
                  The current public case is intentionally framed as a development presentation. It already shows the core
                  product logic clearly enough to evaluate the direction, while launch polish and future animation passes
                  are still in progress.
                </p>
              </div>
            </div>

            <div className="grid gap-px bg-white/10 md:grid-cols-2">
              {koolBerkDepthLayers.map((layer) => (
                <div key={layer.title} className="bg-[#04070d] p-5 md:p-6">
                  <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">{layer.index}</div>
                  <h3 className="mt-6 text-[clamp(1.8rem,2.8vw,3rem)] font-normal leading-[0.94] text-white">{layer.title}</h3>
                  <p className="mt-5 text-[14px] leading-7 text-white/58">{layer.text}</p>
                  <div className="mt-6 border-t border-white/10 pt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/34">
                    {layer.signal}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 flex flex-wrap items-end justify-between gap-6 border-t border-white/10 pt-10">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/42">Visual proof field</div>
              <h2 className="mt-4 max-w-[11ch] text-[clamp(3.2rem,6.2vw,6.4rem)] font-normal leading-[0.86] text-white">
                The demo unfolds as a release story.
              </h2>
            </div>
            <p className="max-w-[32rem] text-[14px] leading-7 text-white/54">
              The media pack is compact, so the strongest presentation move is not a dense archive. We stage the same
              working frames as a directed editorial sequence: object, inspect, dossier, signal track, room path, booking.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-12">
            {stageFrame ? (
              <KoolBerkEditorialFrame
                frame={stageFrame}
                index={0}
                onOpen={setInspectIndex}
                className="lg:col-span-8"
                imageClassName="aspect-[16/10]"
              />
            ) : null}
            <KoolBerkEditorialNote
              eyebrow="Reading mode / release object logic"
              title="A dark artist system, not a link page."
              body="The first frame establishes the main premise immediately: identity, navigation, release archive and visual center are fused into one cube-led surface. That gives the case a stronger authored entry than a standard artist homepage or a loose music landing page."
              signals={[
                "Demo presentation / active build",
                "Identity surface before archive depth",
                "Future animation pass planned for threshold",
              ]}
              className="lg:col-span-4"
            />

            {inspectFrame ? (
              <KoolBerkEditorialFrame
                frame={inspectFrame}
                index={1}
                onOpen={setInspectIndex}
                className="lg:col-span-5"
              />
            ) : null}
            {trackFrame ? (
              <KoolBerkEditorialFrame
                frame={trackFrame}
                index={2}
                onOpen={setInspectIndex}
                className="lg:col-span-7"
              />
            ) : null}

            {monahInspectFrame ? (
              <KoolBerkEditorialFrame
                frame={monahInspectFrame}
                index={3}
                onOpen={setInspectIndex}
                className="lg:col-span-7"
              />
            ) : null}
            {releaseObjectFrame ? (
              <KoolBerkEditorialFrame
                frame={releaseObjectFrame}
                index={4}
                onOpen={setInspectIndex}
                className="lg:col-span-5"
              />
            ) : null}

            <KoolBerkEditorialNote
              eyebrow="Public case framing / why this layout"
              title="Enough proof to judge the direction already."
              body="This presentation is intentionally not overloaded with secondary states. It shows the strongest working layers clearly enough to evaluate the artistic system now, while keeping room for the next pass: threshold animation, room refinement, and final launch polish."
              signals={[
                "Public demo before final polish",
                "Release archive + EPK logic already visible",
                "Room path remains separate and stronger below",
              ]}
              className="lg:col-span-4"
            />
            {contactFrame ? (
              <KoolBerkEditorialFrame
                frame={contactFrame}
                index={6}
                onOpen={setInspectIndex}
                className="lg:col-span-8"
              />
            ) : null}
          </div>
        </section>

        <section
          id="kool-berk-room"
          data-header-scene="kool-berk-room"
          className="mt-20 scroll-mt-[5.5rem] border-t border-white/10 pt-12 md:scroll-mt-28"
        >
          <div className="grid gap-7 lg:grid-cols-[0.56fr_0.44fr] lg:items-end">
            <button
              type="button"
              onClick={() => {
                const roomIndex = frames.findIndex((frame) => frame.label === "Sonic Room");
                setInspectIndex(roomIndex >= 0 ? roomIndex : null);
              }}
              className="group overflow-hidden border border-red-300/18 bg-black text-left shadow-[0_34px_120px_rgba(0,0,0,0.36)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={roomFrame?.src ?? "/immersive/kool-berk/desktop/kool-berk-sonic-room.webp"}
                  alt={roomFrame?.alt ?? "Kool Berk MONAH Sonic Room"}
                  className="h-full w-full object-cover opacity-88 transition duration-700 group-hover:scale-[1.018]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent,rgba(0,0,0,0.42)_72%)]" />
              </div>
            </button>

            <div className="border-y border-red-200/14 bg-red-950/[0.08] p-5 md:p-7">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-red-100/42">Sonic Room</div>
              <h2 className="mt-5 max-w-[10ch] text-[clamp(3rem,6vw,6rem)] font-normal leading-[0.86] text-white">
                A track becomes a state.
              </h2>
              <p className="mt-6 text-[15px] leading-8 text-white/62">
                MONAH Room is the first immersive mode of the project: a red-black WebGL chamber with minimal HUD,
                Play / Pause / Seek, Escape-close behavior, audio-reactive fog, edge pulse, shimmer and structural drift.
                It is not WebXR yet, but it forms the foundation for a future room.
              </p>
              <div className="mt-6 grid gap-2 border-t border-red-100/10 pt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-red-100/38">
                <span>{"Bass -> fog pressure / depth"}</span>
                <span>{"Beat -> rim and edge pulse"}</span>
                <span>{"Highs -> glass shimmer"}</span>
                <span>{"Progress -> structural drift"}</span>
              </div>
            </div>
          </div>
        </section>

        <section
          id="kool-berk-technical"
          data-header-scene="kool-berk-technical"
          className="mt-20 grid scroll-mt-[5.5rem] gap-8 border-t border-white/10 pt-12 md:scroll-mt-28 lg:grid-cols-[0.46fr_0.54fr]"
        >
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/42">Technical dossier</div>
            <h2 className="mt-5 max-w-[11ch] text-[clamp(3rem,6vw,6.2rem)] font-normal leading-[0.86] text-white">
              Audio-reactive without becoming a visualizer.
            </h2>
            <p className="mt-6 max-w-[36rem] text-[15px] leading-8 text-white/58">
              The implementation uses local audio analysis for real reactivity while keeping the atmosphere restrained.
              SoundCloud, Spotify and Apple embeds are intentionally not analyzed because of browser security and CORS
              restrictions.
            </p>
          </div>

          <div className="grid gap-px bg-white/10 sm:grid-cols-2">
            {koolBerkTechnicalReadouts.map((item, index) => (
              <div key={item} className="bg-[#04070d] p-5 font-mono text-[10px] uppercase leading-5 tracking-[0.16em] text-white/58">
                <span className="mr-4 text-white/24">{String(index + 1).padStart(2, "0")}</span>
                {item}
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooterV2
        onOpenProject={onOpenProject}
        variant="immersiveCase"
        immersiveCaseContent={{
          headline: "Build the next artist environment.",
          description:
            "Kool Berk closes as a sonic proof: release objects, signal tracks, Web Audio analysis, audio-reactive WebGL and EPK layers stay inside one artist OS.",
          signal: "sonic object systems",
          intake: "available",
          nextStep: "start an audiovisual system",
          bottomLine: "Built as a sonic interface system.",
          ctaLabel: "Start a project",
        }}
      />

      <CinematicInspectReveal
        frames={inspectFrames}
        index={inspectIndex}
        onClose={() => setInspectIndex(null)}
        onSelect={setInspectIndex}
      />
    </div>
    </CinematicImmersiveCaseShell>
  );
}

function WebHeroVideoCard({
  video,
  index,
  chapter,
  lead = false,
}: {
  video: NonNullable<(typeof immersiveItems)[number]["videos"]>[number];
  index: number;
  chapter: (typeof webHeroVideoChapters)[number];
  lead?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!lead) return;
    const element = videoRef.current;
    if (!element) return;

    let playbackLocked = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        const visibleEnough = entry.isIntersecting && entry.intersectionRatio >= 0.72;
        const mostlyGone = !entry.isIntersecting || entry.intersectionRatio <= 0.38;

        if (visibleEnough && !playbackLocked) {
          playbackLocked = true;
          const startPlayback = () => {
            void element.play().catch(() => {
              playbackLocked = false;
            });
          };
          window.requestAnimationFrame(startPlayback);
        }

        if (mostlyGone) {
          playbackLocked = false;
          element.pause();
        }
      },
      {
        threshold: [0, 0.2, 0.38, 0.55, 0.72, 0.9],
        rootMargin: "-8% 0px -10% 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      element.pause();
    };
  }, [lead]);

  if (lead) {
    return (
      <motion.article
        className="group overflow-hidden border border-white/10 bg-white/[0.035] text-white shadow-[0_26px_90px_rgba(0,0,0,0.24)]"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.74, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-contain opacity-95"
            muted
            loop
            playsInline
            controls
            preload="metadata"
            poster={video.poster}
          >
            <source src={video.src} type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute left-4 top-4 border-y border-white/18 bg-black/20 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/62 backdrop-blur">
            Module {String(index + 1).padStart(2, "0")}
          </div>
        </div>
        <div className="grid gap-5 border-t border-white/10 p-5 md:grid-cols-[0.42fr_0.58fr] md:p-7">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/42">{chapter.eyebrow}</div>
            <h3 className="mt-4 max-w-[14ch] text-[clamp(2.4rem,4.8vw,5rem)] font-normal leading-[0.9] tracking-[-0.04em] text-white">
              {chapter.title}
            </h3>
          </div>
          <div className="grid content-end gap-4">
            <p className="max-w-[44rem] text-[14px] leading-7 text-white/62 md:text-[15px] md:leading-8">{chapter.text}</p>
            <div className="grid gap-2 border-t border-white/10 pt-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/34">{video.label}</div>
              <p className="text-[13px] leading-6 text-white/52">{video.caption}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {chapter.signals.map((signal) => (
                  <span key={signal} className="border border-white/10 bg-black/22 px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-white/38">
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      className={[
        "group grid overflow-hidden border border-white/10 bg-white/[0.035] text-white shadow-[0_26px_90px_rgba(0,0,0,0.24)]",
        "lg:grid-cols-2",
        !lead && index % 2 === 0 ? "lg:[&_.webhero-video-copy]:order-first" : "",
      ].join(" ")}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.74, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-contain opacity-95 transition duration-700 group-hover:scale-[1.005]"
          muted
          loop
          playsInline
          controls
          preload="metadata"
          poster={video.poster}
        >
          <source src={video.src} type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.24)_72%,rgba(0,0,0,0.54))]" />
        <div className="pointer-events-none absolute left-4 top-4 border-y border-white/18 bg-black/20 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/62 backdrop-blur">
          Module {String(index + 1).padStart(2, "0")}
        </div>
      </div>
      <div className="webhero-video-copy flex flex-col justify-between gap-10 border-t border-white/10 p-5 md:p-7 lg:border-l lg:border-t-0">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/42">{chapter.eyebrow}</div>
          <h3 className={["mt-5 font-normal leading-[0.92] tracking-[-0.04em] text-white", lead ? "text-[clamp(2.6rem,5vw,5.8rem)]" : "text-[clamp(2.2rem,4vw,4.6rem)]"].join(" ")}>
            {chapter.title}
          </h3>
          <p className="mt-6 max-w-[36rem] text-[14px] leading-7 text-white/62 md:text-[15px] md:leading-8">{chapter.text}</p>
        </div>
        <div className="grid gap-2 border-t border-white/10 pt-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/34">{video.label}</div>
          <p className="text-[13px] leading-6 text-white/52">{video.caption}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {chapter.signals.map((signal) => (
              <span key={signal} className="border border-white/10 bg-black/22 px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-white/38">
                {signal}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function WebHeroCaseLayout({
  item,
  onBack,
  onOpenProject,
}: {
  item: (typeof immersiveItems)[number];
  onBack: () => void;
  onOpenProject?: () => void;
}) {
  const videos = item.videos ?? [];
  const frames = item.frames ?? [];
  const activeSection = useSectionRailActive(webHeroRailItems, "webhero-threshold");
  const [proofMode, setProofMode] = useState<WebHeroProofMode>("index");
  const [proofExpanded, setProofExpanded] = useState(false);
  const [inspectIndex, setInspectIndex] = useState<number | null>(null);
  const liveLink = item.links?.find((link) => link.label.toLowerCase().includes("live"));
  const inspectFrames: CaseStoryMedia[] = frames.map((frame, index) => ({
    id: `webhero-frame-${String(index + 1).padStart(2, "0")}`,
    kind: "image",
    src: frame.src,
    alt: frame.alt,
    label: frame.label ?? `Frame ${index + 1}`,
    caption: frame.caption,
    role: index < 2 ? "hero" : index >= 9 ? "detail" : "proof",
    fit: "contain",
  }));
  const visibleFrames = frames.slice(0, webHeroInitialProofCount);
  const extendedFrames = frames.slice(webHeroInitialProofCount);
  const showExtendedFieldToggle = extendedFrames.length > 0;
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    const top = Math.max(0, section.getBoundingClientRect().top + window.scrollY - 76);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <CinematicImmersiveCaseShell tone="webhero">
    <div className="min-h-screen bg-[#05070b] text-white">
      <ImmersiveSeoMeta item={item} imageAlt="WEBHERO Living Visual Systems immersive case" />
      <SectionRail
        items={webHeroRailItems}
        activeId={activeSection}
        onSelect={scrollToSection}
        label="WEBHERO sections"
        tone="dark"
      />

      <section
        id="webhero-threshold"
        data-header-scene="webhero-threshold"
        className="relative min-h-[100svh] scroll-mt-[5.5rem] overflow-hidden bg-[#03050a] pt-[72px] md:scroll-mt-28"
      >
        <WebHeroMembraneBackdrop className="absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_54%_30%,rgba(122,244,227,0.12),transparent_26%),radial-gradient(circle_at_78%_16%,rgba(182,124,255,0.14),transparent_24%),linear-gradient(180deg,rgba(3,5,10,0.06),rgba(3,5,10,0.34)_42%,rgba(3,5,10,0.74)_78%,#05070b)]" />
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-72px)] w-[min(94vw,1640px)] flex-col justify-between py-8 md:py-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBack}
              className="border-y border-white/16 bg-black/18 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/62 transition hover:border-white/36 hover:text-white"
            >
              &lt;- Back to immersive
            </button>
            <CaseStatusPill kind={item.statusKind} label={item.status} />
          </div>

          <div className="grid gap-8 py-10 lg:grid-cols-[0.58fr_0.42fr] lg:items-end">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/48">
                {item.supportLabel} / desktop proof
              </div>
              <h1 className="mt-6 max-w-[7.6ch] text-[clamp(4.8rem,13vw,12rem)] font-normal leading-[0.78] tracking-[-0.075em] text-white">
                WEBHERO
              </h1>
              <p className="mt-7 max-w-[40rem] text-[18px] leading-8 text-white/76 md:text-[21px] md:leading-9">
                Living Visual Systems for cinematic WebGL stages, spatial images, Gaussian Splat works, Art Room
                presentation and future XR adapters.
              </p>
            </div>

            <div className="border-y border-white/14 bg-black/18 p-5 backdrop-blur md:p-6">
              <p className="text-[15px] leading-8 text-white/72">{item.description}</p>
              <div className="mt-5 grid gap-2 border-t border-white/12 pt-4 font-mono text-[9px] uppercase tracking-[0.15em] text-white/48">
                <span>Internal Brenych Studio R&D platform</span>
                <span>Advanced prototype / active development</span>
                <span>Mobile version not packaged yet</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {liveLink ? (
                  <a
                    href={liveLink.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center rounded-full border border-white/16 bg-white/8 px-5 text-[11px] uppercase tracking-[0.14em] text-white/74 transition hover:border-white/40 hover:bg-white/12 hover:text-white"
                  >
                    Open live site -&gt;
                  </a>
                ) : null}
                <ActionPill onClick={() => onOpenProject?.()} aria-haspopup="dialog">
                  Start a project -&gt;
                </ActionPill>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-white/12 pt-5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/42 md:grid-cols-4">
            <span>Stage language + spatial image engines</span>
            <span>Art Room presentation layer</span>
            <span>Living Art Mixer in R&D</span>
            <span>XR adapters after web proof</span>
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto w-[min(94vw,1640px)] py-14 md:py-20">
        <section
          id="webhero-modules"
          data-header-scene="webhero-field"
          className="grid scroll-mt-[5.5rem] gap-8 md:scroll-mt-28"
        >
          {videos.map((video, index) => {
            const chapter = webHeroVideoChapters[index] ?? webHeroVideoChapters[0];

            return (
              <WebHeroVideoCard
                key={video.src}
                video={video}
                index={index}
                chapter={chapter}
                lead={index === 0}
              />
            );
          })}
        </section>

        <section
          id="webhero-proof"
          data-header-scene="webhero-proof"
          className="mt-20 scroll-mt-[5.5rem] md:scroll-mt-28"
        >
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/42">Visual proof field</div>
              <h2 className="mt-4 max-w-[12ch] text-[clamp(3.5rem,7vw,7.2rem)] font-normal leading-[0.84] tracking-[-0.06em] text-white">
                Modules shown as working surfaces.
              </h2>
            </div>
            <p className="max-w-[31rem] text-[14px] leading-7 text-white/54">
              The current media pack is desktop-only. The case therefore presents the strongest real proof: stage
              screens, living image pages, splat candidates, Art Room states and system readouts.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-white/10 py-3">
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/34">
              Click any proof frame to inspect / {String(frames.length).padStart(2, "0")} desktop surfaces
            </div>
            <div className="flex rounded-full border border-white/12 bg-white/[0.035] p-1">
              {(["index", "field"] as WebHeroProofMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setProofMode(mode)}
                  className={[
                    "rounded-full px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] transition",
                    proofMode === mode ? "bg-white text-[#05070b]" : "text-white/44 hover:text-white/78",
                  ].join(" ")}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {proofMode === "index" ? (
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleFrames.map((frame, index) => (
                <motion.button
                  key={frame.src}
                  type="button"
                  onClick={() => setInspectIndex(index)}
                  className="group overflow-hidden border border-white/10 bg-white/[0.035] text-left"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.16 }}
                  transition={{ duration: 0.62, delay: (index % 6) * 0.03, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-black">
                    <img
                      src={frame.src}
                      alt={frame.alt}
                      className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.025]"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="pointer-events-none absolute right-3 top-3 border border-white/14 bg-black/34 px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-white/46 opacity-0 backdrop-blur transition group-hover:opacity-100">
                      Inspect
                    </div>
                  </div>
                  <div className="border-t border-white/10 p-4">
                    <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/36">
                      {String(index + 1).padStart(2, "0")} / {frame.label}
                    </div>
                    <p className="mt-3 text-[13px] leading-6 text-white/56">{frame.caption}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="relative mt-10 overflow-hidden border border-white/10 bg-white/[0.025] px-4 py-7 md:px-7 lg:min-h-[178rem]">
              <div className="pointer-events-none absolute inset-0 opacity-[0.1] [background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:68px_68px]" />
              <div className="pointer-events-none absolute left-[16%] top-[10%] h-[44rem] w-[44rem] rounded-full border border-white/[0.055]" />
              <div className="pointer-events-none absolute right-[8%] top-[48%] h-[32rem] w-[32rem] rounded-full border border-cyan-200/[0.055]" />

              <div className="relative z-10 mb-8 max-w-[40rem] lg:absolute lg:left-[6%] lg:top-[8%]">
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/34">Field mode / editorial spread</div>
                <p className="mt-4 text-[15px] leading-8 text-white/58">
                  The same proof set opens into a spatial reading field: stage surfaces, backdrops, splat studies and
                  Art Room materials become a directed editorial map instead of a compact archive.
                </p>
              </div>

              <div className="relative z-10 grid gap-5 lg:block">
                {visibleFrames.map((frame, index) => (
                  <motion.button
                    key={`${frame.src}-field`}
                    type="button"
                    onClick={() => setInspectIndex(index)}
                    className={[
                      "group overflow-hidden border border-white/12 bg-black/68 text-left shadow-[0_30px_120px_rgba(0,0,0,0.34)] backdrop-blur lg:absolute",
                      webHeroFieldFrameClasses[index % webHeroFieldFrameClasses.length],
                    ].join(" ")}
                    initial={{ opacity: 0, y: 22, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.16 }}
                    transition={{ duration: 0.7, delay: (index % 5) * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-black">
                      <img
                        src={frame.src}
                        alt={frame.alt}
                        className="h-full w-full object-cover opacity-92 transition duration-700 group-hover:scale-[1.025]"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="border-t border-white/10 p-4">
                      <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/36">
                        {String(index + 1).padStart(2, "0")} / {frame.label}
                      </div>
                      <p className="mt-3 text-[12px] leading-6 text-white/52">{frame.caption}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {showExtendedFieldToggle ? (
            <div className="relative mx-auto grid w-full gap-4 border-t border-white/10 px-0 py-6 sm:py-8 lg:grid-cols-2 lg:py-10">
              <div className="hidden lg:block" />
              <div className="max-w-[28rem] lg:justify-self-end">
                <div className="font-mono text-[9px] uppercase leading-5 tracking-[0.16em] text-white/34">
                  <span className="xl:hidden">More proof / {String(extendedFrames.length).padStart(2, "0")} extra surfaces</span>
                  <span className="hidden xl:inline">Extended field / {String(extendedFrames.length).padStart(2, "0")} more proof surfaces</span>
                </div>
                <p className="mt-3 hidden text-[14px] leading-7 text-white/56 xl:block">
                  The first twelve frames establish the main reading field. The extended set opens more backdrop variants,
                  atlas states, splat proofs, and secondary system evidence without overloading the first pass.
                </p>
                <button
                  type="button"
                  onClick={() => setProofExpanded((value) => !value)}
                  className="mt-4 inline-flex min-h-10 items-center rounded-full border border-white bg-white px-5 text-[11px] uppercase tracking-[0.14em] text-[#05070b] transition hover:-translate-y-0.5 hover:bg-white/90 xl:mt-5"
                >
                  {proofExpanded ? (
                    <>
                      <span className="xl:hidden">Close -&gt;</span>
                      <span className="hidden xl:inline">Close field -&gt;</span>
                    </>
                  ) : (
                    <>
                      <span className="xl:hidden">More proof -&gt;</span>
                      <span className="hidden xl:inline">Open extended field -&gt;</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : null}

          <AnimatePresence initial={false}>
            {proofExpanded ? (
              <motion.div
                id="webhero-extended-field"
                className="relative mt-2 overflow-hidden border-t border-white/10 bg-white/[0.02] px-0 py-10"
                initial={{ opacity: 0, height: 0, y: 28 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: 18 }}
                transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mx-auto mb-8 grid w-[min(94vw,1640px)] gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/34">
                    Expanded proof field / additional WEBHERO surfaces
                  </div>
                </div>
                {proofMode === "field" ? (
                  <div className="relative mx-auto overflow-hidden border border-white/10 bg-white/[0.018] px-4 py-7 md:px-7 lg:min-h-[148rem]">
                    <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:68px_68px]" />
                    <div className="pointer-events-none absolute left-[10%] top-[10%] h-[34rem] w-[34rem] rounded-full border border-white/[0.05]" />
                    <div className="pointer-events-none absolute right-[8%] top-[56%] h-[28rem] w-[28rem] rounded-full border border-cyan-200/[0.05]" />

                    <div className="relative z-10 grid gap-5 lg:block">
                      {extendedFrames.map((frame, extraIndex) => {
                        const absoluteIndex = frames.findIndex((item) => item.src === frame.src);

                        return (
                          <motion.button
                            key={`${frame.src}-extended-field`}
                            type="button"
                            onClick={() => setInspectIndex(absoluteIndex)}
                            className={[
                              "group overflow-hidden border border-white/12 bg-black/68 text-left shadow-[0_30px_120px_rgba(0,0,0,0.34)] backdrop-blur lg:absolute",
                              webHeroExtendedFieldClasses[extraIndex % webHeroExtendedFieldClasses.length],
                            ].join(" ")}
                            initial={{ opacity: 0, y: 18, scale: 0.985 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, amount: 0.16 }}
                            transition={{ duration: 0.66, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <div className="aspect-[16/10] overflow-hidden bg-black">
                              <img
                                src={frame.src}
                                alt={frame.alt}
                                className="h-full w-full object-cover opacity-92 transition duration-700 group-hover:scale-[1.025]"
                                loading="lazy"
                                decoding="async"
                              />
                            </div>
                            <div className="border-t border-white/10 p-4">
                              <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/36">
                                {String(absoluteIndex + 1).padStart(2, "0")} / {frame.label}
                              </div>
                              <p className="mt-3 text-[12px] leading-6 text-white/52">{frame.caption}</p>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="mx-auto grid w-[min(94vw,1640px)] gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {extendedFrames.map((frame) => {
                      const absoluteIndex = frames.findIndex((item) => item.src === frame.src);

                      return (
                        <motion.button
                          key={`${frame.src}-extended`}
                          type="button"
                          onClick={() => setInspectIndex(absoluteIndex)}
                          className="group overflow-hidden border border-white/10 bg-white/[0.035] text-left"
                          initial={{ opacity: 0, y: 18 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.16 }}
                          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="relative aspect-[16/10] overflow-hidden bg-black">
                            <img
                              src={frame.src}
                              alt={frame.alt}
                              className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.025]"
                              loading="lazy"
                              decoding="async"
                            />
                            <div className="pointer-events-none absolute right-3 top-3 border border-white/14 bg-black/34 px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-white/46 opacity-0 backdrop-blur transition group-hover:opacity-100">
                              Inspect
                            </div>
                          </div>
                          <div className="border-t border-white/10 p-4">
                            <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/36">
                              {String(absoluteIndex + 1).padStart(2, "0")} / {frame.label}
                            </div>
                            <p className="mt-3 text-[13px] leading-6 text-white/56">{frame.caption}</p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>

        <section
          id="webhero-technical"
          data-header-scene="webhero-field"
          className="mt-20 grid scroll-mt-[5.5rem] gap-8 border-t border-white/10 pt-12 md:scroll-mt-28 lg:grid-cols-[0.48fr_0.52fr]"
        >
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/42">Technical details</div>
            <h2 className="mt-5 max-w-[10ch] text-[clamp(3.2rem,6vw,6.4rem)] font-normal leading-[0.84] tracking-[-0.055em] text-white">
              Web-first before XR-first.
            </h2>
            <p className="mt-6 max-w-[35rem] text-[15px] leading-8 text-white/58">
              Heavy spatial assets stay behind dedicated viewer routes, listing pages use poster previews, and XR remains
              an adapter direction rather than the unstable core of the platform.
            </p>
          </div>

          <div className="grid gap-px bg-white/10 sm:grid-cols-2">
              {webHeroTechnicalReadouts.map((item, index) => (
                <div key={item} className="bg-[#05070b] p-5 font-mono text-[10px] uppercase leading-5 tracking-[0.16em] text-white/58">
                  <span className="mr-4 text-white/24">{String(index + 1).padStart(2, "0")}</span>
                  {item}
                </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooterV2
        onOpenProject={onOpenProject}
        variant="immersiveCase"
        immersiveCaseContent={{
          headline: "Build the next living visual system.",
          description:
            "WEBHERO closes as a flagship R&D proof: stage language, backdrop systems, living images, splat routes, and Art Room presentation stay inside one web-first visual platform.",
          signal: "living visual systems",
          intake: "available",
          nextStep: "start a webgl-stage project",
          bottomLine: "Built as a web-first spatial interface system.",
          ctaLabel: "Start a project",
        }}
      />
      <CinematicInspectReveal
        frames={inspectFrames}
        index={inspectIndex}
        onClose={() => setInspectIndex(null)}
        onSelect={setInspectIndex}
      />
    </div>
    </CinematicImmersiveCaseShell>
  );
}

export default function ImmersiveCasePage({
  drawerOpen = false,
  onOpenProject,
  onCloseProject,
  noIndex = false,
}: PageProps) {
  const { t, locale } = useI18n();
  const { slug } = useParams();
  const navigate = useNavigate();

  const sourceData = immersiveItems.find((item) => item.slug === slug) ?? null;
  const data = sourceData ? localizeImmersiveItem(sourceData, locale) : null;

  if (locale === "es" && !isSpanishPublicImmersiveSlug(slug)) {
    return <Navigate to={getLocalizedPath("/immersive", locale)} replace />;
  }

  if (!data) {
    return <Navigate to={getLocalizedPath("/immersive", locale)} replace />;
  }

  const isWhisperCase = data.slug === "whisper";
  const whisperLocale = locale === "uk" ? "ua" : locale;
  const whisperCopy =
    whisperCaseI18n[whisperLocale as keyof typeof whisperCaseI18n] ??
    whisperCaseI18n.en;

  if (isWhisperCase) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <ImmersiveSeoMeta
          item={data}
          imageAlt="WHISPER immersive exhibition case"
          locale={locale}
          noIndex={noIndex}
        />
        <Header
          drawerOpen={drawerOpen}
          onOpenProject={onOpenProject}
          onCloseProject={onCloseProject}
        />

        <main className="pt-[60px]">
          <PageSurface>
            <WhisperCaseLayout item={data} copy={whisperCopy} onOpenProject={onOpenProject} />
          </PageSurface>
        </main>
      </div>
    );
  }

  if (locale !== "es" && data.slug === "webhero") {
    return (
      <div className="min-h-screen bg-[#05070b] text-white">
        <Header
          drawerOpen={drawerOpen}
          onOpenProject={onOpenProject}
          onCloseProject={onCloseProject}
        />
        <WebHeroCaseLayout
          item={data}
          onOpenProject={onOpenProject}
          onBack={() => openPath(navigate, getLocalizedPath("/immersive", locale), onCloseProject)}
        />
      </div>
    );
  }

  if (locale !== "es" && data.slug === "kool-berk") {
    return (
      <div className="min-h-screen bg-[#04070d] text-white">
        <Header
          drawerOpen={drawerOpen}
          onOpenProject={onOpenProject}
          onCloseProject={onCloseProject}
        />
        <KoolBerkCaseLayout
          item={data}
          onOpenProject={onOpenProject}
          onBack={() => openPath(navigate, getLocalizedPath("/immersive", locale), onCloseProject)}
        />
      </div>
    );
  }

  if (locale !== "es" && data.slug === "presence-os-memory-atlas") {
    return (
      <div className="min-h-screen bg-[#030706] text-white">
        <Header
          drawerOpen={drawerOpen}
          onOpenProject={onOpenProject}
          onCloseProject={onCloseProject}
        />
        <PresenceOsCaseLayout
          item={data}
          onOpenProject={onOpenProject}
          onBack={() => openPath(navigate, getLocalizedPath("/immersive", locale), onCloseProject)}
        />
      </div>
    );
  }

  if (locale !== "es" && data.slug === "orbit-lens") {
    return (
      <div className="min-h-screen bg-[#03070a] text-white">
        <Header
          drawerOpen={drawerOpen}
          onOpenProject={onOpenProject}
          onCloseProject={onCloseProject}
        />
        <OrbitLensCaseLayout
          item={data}
          onOpenProject={onOpenProject}
          onBack={() => openPath(navigate, getLocalizedPath("/immersive", locale), onCloseProject)}
        />
      </div>
    );
  }

  const detail =
    immersiveDetailCopy[data.slug] ??
    ({
      intro: data.description,
      directionHeading: data.title,
      direction: data.description,
      interaction: data.tagline,
      build: data.stack,
      outcome: data.description,
      principles: [data.mode, data.medium, data.status],
      mediaLabel: "Media structure",
      mediaSummary: data.description,
      mediaModules: [data.mode, data.medium, data.status],
    } satisfies ImmersiveDetailCopy);
  const genericLabels =
    locale === "es"
      ? {
          back: "Volver a immersive",
          direction: "Direccion",
          interaction: "Gramatica de interaccion",
          build: "Ruta de desarrollo",
          rhythm: "Ritmo de interfaz",
          rhythmTitle: "Estructura de presentacion por secuencia.",
          rhythmBody:
            "Una secuencia minima de estados reemplaza navegacion densa y permite que atmosfera, jerarquia y claridad avancen progresivamente.",
          entry: "Estado de entrada",
          entryBody: "Frame de introduccion calmado que establece tono sin ruido de UI.",
          hierarchy: "Frame de jerarquia",
          hierarchyBody: "La informacion clave aparece con enfasis controlado y capas espaciales.",
          transition: "Transicion de estado",
          transitionBody: "Las transiciones mantienen continuidad mientras cambian contexto y significado.",
          media: "Estructura de medios",
          mediaBody:
            "Un hero en loop establece atmosfera, mientras los frames fijos aislan jerarquia y estados clave de interfaz.",
          logic: "Logica de interaccion",
          logicBody: "La navegacion se integra en el ritmo en lugar de exponerse como capas de UI.",
          potential: "Potencial del sistema",
          potentialBody: "La misma estructura puede escalar hacia superficies de producto sin perder claridad.",
          relevance: "Relevancia de produccion",
          relevanceTitle: "Concepto que se traduce en sistemas listos para produccion.",
          reusable: "Logica reusable",
          reusableBody: "Los patrones de interaccion pueden reutilizarse en varias superficies y flujos.",
          modular: "Estructura modular",
          modularBody: "Disenado como componentes componibles, no como escenas visuales aisladas.",
          launch: "Preparado para lanzamiento",
          launchBody: "Equilibra atmosfera visual con claridad, rendimiento y usabilidad.",
          next: "Siguiente paso",
          nextTitle:
            "Si esta direccion encaja, el siguiente paso es definir scope, gramatica de motion y profundidad de produccion.",
          prevStudy: "Caso anterior",
          nextStudy: "Caso siguiente",
        }
      : {
          back: "Back to immersive",
          direction: "Direction",
          interaction: "Interaction grammar",
          build: "Build path",
          rhythm: "Interface rhythm",
          rhythmTitle: "Sequence-driven presentation structure.",
          rhythmBody:
            "A minimal sequence of states replaces dense navigation, allowing atmosphere, hierarchy, and clarity to unfold progressively.",
          entry: "Entry state",
          entryBody: "Calm introduction frame that establishes tone without UI noise.",
          hierarchy: "Hierarchy frame",
          hierarchyBody: "Key information surfaces with controlled emphasis and spatial layering.",
          transition: "State transition",
          transitionBody: "Transitions maintain continuity while shifting context and meaning.",
          media: "Media structure",
          mediaBody:
            "A loop-based hero establishes atmosphere, while still frames isolate hierarchy and key interface states.",
          logic: "Interaction logic",
          logicBody: "Navigation is embedded into pacing rather than exposed as explicit UI layers.",
          potential: "System potential",
          potentialBody: "The same structure can scale into product-facing surfaces without losing clarity.",
          relevance: "Production relevance",
          relevanceTitle: "Concept that translates into build-ready systems.",
          reusable: "Reusable logic",
          reusableBody: "Interaction patterns can be reused across multiple surfaces and flows.",
          modular: "Modular structure",
          modularBody: "Designed as composable components rather than one-off visual scenes.",
          launch: "Launch-aware",
          launchBody: "Balances visual atmosphere with clarity, performance, and usability.",
          next: "Next step",
          nextTitle:
            "If this direction aligns, the next step is defining scope, motion grammar, and production depth.",
          prevStudy: "Prev study",
          nextStudy: "Next study",
        };

  const variant = immersiveVariantBySlug[data.slug] ?? "ar";
  const variantUi = immersiveVariantUi[variant];

  const index = immersiveItems.findIndex((item) => item.slug === data.slug);
  const prev = index > 0 ? immersiveItems[index - 1] : null;
  const next = index >= 0 && index < immersiveItems.length - 1 ? immersiveItems[index + 1] : null;
  const externalLinks = data.links ?? [];

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <ImmersiveSeoMeta
        item={data}
        imageAlt={data.title}
        locale={locale}
        noIndex={noIndex}
      />
      <Header
        drawerOpen={drawerOpen}
        onOpenProject={onOpenProject}
        onCloseProject={onCloseProject}
      />

      <main className="pb-20 pt-24 md:pb-24 md:pt-28">
        <PageSurface>
          <Container>
          <section className="border-b border-neutral-100 pb-8 pt-10 md:pb-12 md:pt-0">
            <div className="grid gap-4 md:flex md:flex-wrap md:items-center md:justify-between">
              <button
                type="button"
                onClick={() => openPath(navigate, getLocalizedPath("/immersive", locale), onCloseProject)}
                className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-1px] hover:border-neutral-400 hover:text-neutral-900"
              >
                <span className="text-neutral-400">←</span>{" "}
                {isWhisperCase ? whisperCopy.top.backToImmersive : genericLabels.back}
              </button>

              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                <div className="inline-flex w-fit items-center whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                  {data.year}
                </div>
                <CaseStatusPill
                  kind={data.statusKind}
                  label={isWhisperCase ? whisperCopy.top.status : data.status}
                />
              </div>

              <div className="hidden">
                <span>{data.year}</span>
                <span className="text-neutral-300">•</span>
                <span>{data.status}</span>
              </div>
            </div>
          </section>

          {!isWhisperCase ? (
            <section className="border-b border-neutral-100 py-12 md:py-14 xl:py-16">
              <article className="rounded-[30px] border border-neutral-100 bg-white p-3 shadow-[0_24px_64px_rgba(17,17,17,0.06)] md:p-4">
                <motion.div
                  className={[
                    "relative overflow-hidden rounded-[24px] border border-white/10",
                    "shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
                    toneSurface[data.tone],
                  ].join(" ")}
                  initial={{ scale: 1.02, y: 8 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  {data.previewVideo ? (
                    <video
                      key={data.previewVideo}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    >
                      <source src={data.previewVideo} type="video/mp4" />
                    </video>
                  ) : data.previewPoster ? (
                    <img
                      src={data.previewPoster}
                      alt={data.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,22,0.16)_0%,rgba(8,12,22,0.12)_24%,rgba(8,12,22,0.42)_62%,rgba(8,12,22,0.72)_100%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,rgba(255,255,255,0.12),transparent_52%)]" />
                  {variantUi.heroGhostClass ? <div className={variantUi.heroGhostClass} /> : null}

                  <div
                    className={`relative flex min-h-[360px] flex-col justify-between p-5 text-white sm:min-h-[420px] sm:p-6 ${variantUi.heroMinClass} md:p-8 xl:p-10`}
                  >
                    <div className="flex items-start justify-between gap-4 md:gap-6">
                      <div className="inline-flex items-center whitespace-nowrap rounded-full border border-white/14 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/72">
                        {data.supportLabel ?? "Immersive study"}
                      </div>

                      <div className="inline-flex items-center whitespace-nowrap rounded-full border border-white/14 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/72">
                        {data.medium}
                      </div>
                    </div>

                    <div className="max-w-[60ch]">
                      <div className="text-[10px] uppercase tracking-[0.14em] text-white/68">{data.mode}</div>

                      <h1
                        className={`mt-5 ${variantUi.titleMaxClass} text-[36px] leading-[0.94] tracking-[-0.04em] sm:text-[48px] md:text-[66px] ${variantUi.titleSizeClass}`}
                        style={{ wordBreak: "keep-all", overflowWrap: "normal" }}
                      >
                        {data.title}
                      </h1>

                      <p className="mt-5 max-w-[34ch] text-sm leading-7 text-white/82 md:text-[16px]">
                        {data.tagline}
                      </p>

                      {data.statusNote ? (
                        <p className="mt-3 max-w-[38ch] text-[13px] leading-7 text-white/62 md:text-[14px]">
                          {data.statusNote}
                        </p>
                      ) : null}

                      <div className="mt-6 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.14em] text-white/70">
                        {detail.principles.map((item) => (
                          <span key={item} className="inline-flex items-center whitespace-nowrap rounded-full border border-white/16 px-3 py-1">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 border-t border-white/10 pt-5 lg:grid-cols-[1fr_auto] lg:items-end">
                      <div>
                        <p className="max-w-[56ch] text-sm leading-7 text-white/82 md:text-[15px]">
                          {detail.intro}
                        </p>
                        <div className="mt-3 text-[11px] uppercase tracking-[0.14em] text-white/62">{data.stack}</div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {externalLinks.map((link) => (
                          <a
                            key={`${link.label}-${link.href}`}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center whitespace-nowrap rounded-full border border-white/18 bg-white/10 px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-1px] hover:bg-white/20"
                          >
                            {link.label} <span className="ml-2 text-white/55">{"\u2197"}</span>
                          </a>
                        ))}

                        <ActionPill
                          onClick={() => onOpenProject?.()}
                          aria-haspopup="dialog"
                          className="hover:shadow-[0_10px_24px_rgba(17,17,17,0.10)]"
                        >
                          {t.nav.startProject}
                        </ActionPill>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </article>
            </section>
          ) : null}

          {!isWhisperCase ? (
            <motion.section
              className="grid gap-10 border-b border-neutral-100 py-12 md:grid-cols-[0.64fr_0.36fr] md:gap-12 md:py-14 xl:grid-cols-[0.62fr_0.38fr]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.8, delay: 0.02, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.28 }}
                transition={{ duration: 0.78, delay: 0.02, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{genericLabels.direction}</div>
                <h2
                  className="mt-3 max-w-[11ch] text-[52px] leading-[0.96] tracking-[-0.04em] md:text-[56px] xl:max-w-[12ch] xl:text-[62px]"
                >
                  {detail.directionHeading}
                </h2>
                <p className="mt-5 max-w-[46ch] text-[15px] leading-7 text-neutral-600">{detail.direction}</p>
              </motion.div>

              <motion.div
                className="grid gap-3.5 self-start"
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.28 }}
                transition={{ duration: 0.78, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="rounded-[20px] border border-neutral-100 bg-white/72 p-4 backdrop-blur-[2px] md:p-[18px]">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{genericLabels.interaction}</div>
                  <p className="mt-3 text-sm leading-7 text-neutral-600">{detail.interaction}</p>
                </div>

                <div className="rounded-[20px] border border-neutral-100 bg-white/72 p-4 backdrop-blur-[2px] md:p-[18px]">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{genericLabels.build}</div>
                  <p className="mt-3 text-sm leading-7 text-neutral-600">{detail.build}</p>
                </div>
              </motion.div>
            </motion.section>
          ) : null}

          {isWhisperCase ? <WhisperCaseLayout item={data} /> : null}

          {/* SEQUENCE PROOF SECTION */}
          {/* ========================= */}
          {!isWhisperCase ? (
          <motion.section
            className="mt-24 border-t border-neutral-100 pt-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.8, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="max-w-[1100px]">
              <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{genericLabels.rhythm}</div>

              <h3 className="mt-3 text-2xl tracking-tight md:text-3xl">
                {genericLabels.rhythmTitle}
              </h3>

              <p className="mt-3 max-w-[56ch] text-sm text-neutral-600">
                {genericLabels.rhythmBody}
              </p>

              <div className="mt-10 grid gap-6 md:grid-cols-[0.95fr_1.12fr_0.95fr]">
                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 0.92, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.72, delay: 0.02, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="overflow-hidden rounded-[20px] border border-neutral-100/80 bg-white/70 backdrop-blur-[2px] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:border-neutral-200 hover:bg-white/88 hover:shadow-[0_18px_38px_rgba(17,17,17,0.06)]">
                    <div className="aspect-[4/3] bg-[linear-gradient(180deg,#f3f3f2_0%,#ececeb_100%)]" />
                    <div className="p-4">
                      <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{genericLabels.entry}</div>
                      <p className="mt-2 text-sm text-neutral-700">
                        {genericLabels.entryBody}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 28, scale: 0.985 }}
                  whileInView={{ opacity: 1, y: -2, scale: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.82, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="overflow-hidden rounded-[20px] border border-neutral-100/80 bg-white/70 backdrop-blur-[2px] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:border-neutral-200 hover:bg-white/88 hover:shadow-[0_18px_38px_rgba(17,17,17,0.06)]">
                    <div className="aspect-[4/3] bg-[linear-gradient(180deg,#f3f3f2_0%,#ececeb_100%)]" />
                    <div className="p-4">
                      <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{genericLabels.hierarchy}</div>
                      <p className="mt-2 text-sm text-neutral-700">
                        {genericLabels.hierarchyBody}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 0.92, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.72, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="overflow-hidden rounded-[20px] border border-neutral-100/80 bg-white/70 backdrop-blur-[2px] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:border-neutral-200 hover:bg-white/88 hover:shadow-[0_18px_38px_rgba(17,17,17,0.06)]">
                    <div className="aspect-[4/3] bg-[linear-gradient(180deg,#f3f3f2_0%,#ececeb_100%)]" />
                    <div className="p-4">
                      <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{genericLabels.transition}</div>
                      <p className="mt-2 text-sm text-neutral-700">
                        {genericLabels.transitionBody}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>
          ) : null}

          {/* ========================= */}
          {/* MEDIA STRUCTURE */}
          {/* ========================= */}
          {!isWhisperCase ? (
          <motion.section
            className="mt-16 grid gap-6 border-b border-neutral-100 py-12 xl:grid-cols-[0.66fr_0.34fr] xl:gap-8 md:py-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.8, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* ========================= */}
            {/* MEDIA STRUCTURE */}
            {/* ========================= */}
            <div className="grid gap-10 md:grid-cols-[0.6fr_0.4fr] xl:col-span-2">
              <motion.div
                className="overflow-hidden rounded-[24px] border border-neutral-100 bg-black shadow-[0_22px_56px_rgba(0,0,0,0.08)]"
                initial={{ opacity: 0, y: 24, scale: 0.992 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{ duration: 0.9, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative aspect-[16/10] bg-black">
                  {data.previewVideo ? (
                    <video
                      key={`${data.previewVideo}-secondary`}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    >
                      <source src={data.previewVideo} type="video/mp4" />
                    </video>
                  ) : data.previewPoster ? (
                    <img
                      src={data.previewPoster}
                      alt={data.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,22,0.08)_0%,rgba(8,12,22,0.22)_100%)]" />
                  {variantUi.mediaGhostClass ? <div className={variantUi.mediaGhostClass} /> : null}
                </div>
              </motion.div>

              <motion.div
                className="grid gap-4"
                initial={{ opacity: 0, x: 14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="rounded-[20px] border border-neutral-100 bg-white/72 p-4 backdrop-blur-[2px] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:border-neutral-200 hover:bg-white/88 hover:shadow-[0_12px_24px_rgba(17,17,17,0.045)]">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{genericLabels.media}</div>
                  <p className="mt-2 text-sm text-neutral-700">
                    {genericLabels.mediaBody}
                  </p>
                </div>

                <div className="rounded-[20px] border border-neutral-100 bg-white/72 p-4 backdrop-blur-[2px] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:border-neutral-200 hover:bg-white/88 hover:shadow-[0_12px_24px_rgba(17,17,17,0.045)]">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{genericLabels.logic}</div>
                  <p className="mt-2 text-sm text-neutral-700">
                    {genericLabels.logicBody}
                  </p>
                </div>

                <div className="rounded-[20px] border border-neutral-100 bg-white/72 p-4 backdrop-blur-[2px] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:border-neutral-200 hover:bg-white/88 hover:shadow-[0_12px_24px_rgba(17,17,17,0.045)]">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{genericLabels.potential}</div>
                  <p className="mt-2 text-sm text-neutral-700">
                    {genericLabels.potentialBody}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.section>
          ) : null}

          {/* ========================= */}
          {/* PRODUCTION RELEVANCE */}
          {/* ========================= */}
          {!isWhisperCase ? (
          <motion.section
            className="mt-24 border-t border-neutral-100 pt-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="max-w-[900px]">
              <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{genericLabels.relevance}</div>

              <h3 className="mt-3 text-2xl tracking-[-0.03em] md:text-3xl">
                {genericLabels.relevanceTitle}
              </h3>

              <div className="mt-12 grid gap-5 md:grid-cols-[1fr_1fr_1fr]">
                <motion.div
                  className="rounded-[20px] border border-neutral-100/80 bg-white/68 p-4 backdrop-blur-[2px] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:border-neutral-200 hover:bg-white/82 hover:shadow-[0_10px_22px_rgba(17,17,17,0.04)]"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.68, delay: 0.02, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{genericLabels.reusable}</div>
                  <p className="mt-2 text-sm text-neutral-700">
                    {genericLabels.reusableBody}
                  </p>
                </motion.div>

                <motion.div
                  className="rounded-[20px] border border-neutral-100/80 bg-white/68 p-4 backdrop-blur-[2px] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:border-neutral-200 hover:bg-white/82 hover:shadow-[0_10px_22px_rgba(17,17,17,0.04)]"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.68, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{genericLabels.modular}</div>
                  <p className="mt-2 text-sm text-neutral-700">
                    {genericLabels.modularBody}
                  </p>
                </motion.div>

                <motion.div
                  className="rounded-[20px] border border-neutral-100/80 bg-white/68 p-4 backdrop-blur-[2px] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:border-neutral-200 hover:bg-white/82 hover:shadow-[0_10px_22px_rgba(17,17,17,0.04)]"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.68, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{genericLabels.launch}</div>
                  <p className="mt-2 text-sm text-neutral-700">
                    {genericLabels.launchBody}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.section>
          ) : null}

          {!isWhisperCase ? (
          <motion.section
            className="mt-20 grid gap-6 py-12 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end md:py-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="rounded-[24px] border border-neutral-100 bg-white/78 p-6 shadow-[0_16px_34px_rgba(17,17,17,0.035)] md:p-7"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.82, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{genericLabels.next}</div>
              <h3 className="mt-4 max-w-[22ch] text-xl leading-[1.12] tracking-[-0.025em] text-neutral-900 md:text-2xl">
                {genericLabels.nextTitle}
              </h3>

              <div className="mt-6">
                <ActionPill
                  onClick={() => onOpenProject?.()}
                  aria-haspopup="dialog"
                  className="hover:shadow-[0_10px_24px_rgba(17,17,17,0.10)]"
                >
                  {t.nav.startProject}
                </ActionPill>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-3 xl:justify-end"
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.74, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {prev ? (
                <button
                  type="button"
                  onClick={() => openPath(navigate, getLocalizedPath(`/immersive/${prev.slug}`, locale), onCloseProject)}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-1px] hover:border-neutral-300 hover:text-neutral-900"
                >
                  <span className="text-neutral-400">←</span> {genericLabels.prevStudy}
                </button>
              ) : null}

              {next ? (
                <button
                  type="button"
                  onClick={() => openPath(navigate, getLocalizedPath(`/immersive/${next.slug}`, locale), onCloseProject)}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-1px] hover:border-neutral-300 hover:text-neutral-900"
                >
                  {genericLabels.nextStudy} <span className="text-neutral-400">→</span>
                </button>
              ) : null}
            </motion.div>
          </motion.section>
          ) : null}

          </Container>
        </PageSurface>
      </main>
    </div>
  );
}
