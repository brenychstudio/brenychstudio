import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type WheelEvent,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

import {
  defaultImmersiveChamberId,
  getChamberEngines,
  getImmersiveChamber,
  immersiveApplicationLayer,
  immersiveChambers,
  immersiveEngineStack,
  type ImmersiveChamberId,
  type ImmersiveSystemItem,
} from "../data/immersiveSystems";
import AtmosphericSiteShell from "../ui/atmosphere/AtmosphericSiteShell";
import Header from "../ui/Header";
import MobileMotionSection from "../ui/mobile-motion/MobileMotionSection";
import PageSurface from "../ui/PageSurface";
import SectionRail, { type SectionRailItem } from "../ui/SectionRail";
import SiteFooterV2 from "../ui/SiteFooterV2";
import { startSpaPageTransition } from "../ui/pageTransition";
import { useSound } from "../stage/audio/useSound";
import { useImmersiveProofChromeActive } from "../hooks/useImmersiveProofChromeActive";
import { useDeferredRouteContent } from "../hooks/useDeferredRouteContent";

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
  noIndex?: boolean;
};

type SectionId = "threshold" | "map" | "proof" | "engines" | "future" | "applications";

const ease = [0.22, 1, 0.36, 1] as const;

const sectionItems: Array<SectionRailItem & { id: SectionId }> = [
  { index: "01", label: "Threshold", id: "threshold" },
  { index: "02", label: "Map", id: "map" },
  { index: "03", label: "Proof", id: "proof" },
  { index: "04", label: "Engines", id: "engines" },
  { index: "05", label: "Future", id: "future" },
  { index: "06", label: "Layer", id: "applications" },
];

const immersiveHeaderScenes: Record<SectionId, string> = {
  threshold: "immersive-threshold",
  map: "immersive-map",
  proof: "immersive-proof",
  engines: "immersive-engines",
  future: "immersive-future",
  applications: "immersive-layer",
};

type FutureChamberId = "product-world" | "presence-archive" | "collector-continuation";

const futureChamberIds: FutureChamberId[] = [
  "product-world",
  "presence-archive",
  "collector-continuation",
];

const immersiveHubChamberIds: ImmersiveChamberId[] = ["whisper", ...futureChamberIds];

const immersiveHubChambers = immersiveChambers.filter((chamber) =>
  immersiveHubChamberIds.includes(chamber.id),
);

const futureChambers = immersiveChambers.filter((chamber): chamber is ImmersiveSystemItem & { id: FutureChamberId } =>
  futureChamberIds.includes(chamber.id as FutureChamberId),
);

const futureChamberDetails: Record<FutureChamberId, {
  role: string;
  proof: string;
  state: string;
  application: string;
  tags: string[];
  readout: string[];
  traces: Array<{
    src: string;
    label: string;
    caption: string;
  }>;
}> = {
  "product-world": {
    role: "Products or services become navigable decision environments.",
    proof: "Products stop behaving like catalogue entries and start behaving like staged worlds.",
    state: "Prototype direction",
    application: "Premium product launches / service demos / founder presentations",
    tags: ["product surface", "guided proof", "interactive launch"],
    readout: ["Stage logic", "Guided proof", "Interactive launch"],
    traces: [
      {
        src: "/cases/house-of-lune/desktop/house-of-lune-hero.webp",
        label: "Prototype still",
        caption: "Staged launch surface.",
      },
      {
        src: "/cases/house-of-lune/desktop/house-of-lune-3.webp",
        label: "Working trace",
        caption: "Decision surface study.",
      },
      {
        src: "/cases/creatorops/desktop/creatorops-hero.webp",
        label: "Motion note",
        caption: "Guided proof material.",
      },
    ],
  },
  "presence-archive": {
    role: "Archives become living fields shaped by attention, memory, return, and media fragments.",
    proof: "An archive can respond to presence without becoming noisy or gamified.",
    state: "Research chamber",
    application: "Artist archives / cultural collections / memory-based interfaces",
    tags: ["archive field", "memory layer", "editorial presence"],
    readout: ["Attention field", "Memory return", "Media fragments"],
    traces: [
      {
        src: "/immersive/Whisper/desktop/whisper-8.jpg",
        label: "Research frame",
        caption: "Archive atmosphere study.",
      },
      {
        src: "/immersive/Whisper/desktop/whisper-5.jpg",
        label: "Presence note",
        caption: "Attention-led fragment.",
      },
      {
        src: "/immersive/Whisper/mobile/whisper-mb-6.jpg",
        label: "Working trace",
        caption: "Mobile memory surface.",
      },
    ],
  },
  "collector-continuation": {
    role: "Print, edition, AR preview, and collector logic extend the digital surface into object space.",
    proof: "A web experience can continue into physical presentation and collector workflows.",
    state: "Continuation layer",
    application: "Print editions / collector catalogues / AR previews / private viewing rooms",
    tags: ["print logic", "AR preview", "edition system"],
    readout: ["Edition logic", "Object preview", "Private room"],
    traces: [
      {
        src: "/cases/print-border-studio/desktop/psb-hero.webp",
        label: "Prototype still",
        caption: "Print and edition surface.",
      },
      {
        src: "/immersive/Whisper/desktop/whisper-9.jpg",
        label: "AR note",
        caption: "Object-scale preview.",
      },
      {
        src: "/cases/print-border-studio/desktop/psb-3.webp",
        label: "Working trace",
        caption: "Private viewing trace.",
      },
    ],
  },
};

type WhisperProofId = "web" | "mobile" | "print" | "ar" | "quest";

type WhisperProofState = {
  id: WhisperProofId;
  index: string;
  label: string;
  railLabel: string;
  signal: string;
  readout: string;
  media: {
    type: "image" | "video";
    src: string;
    poster?: string;
  };
  traces: string[];
};

const whisperProofStates: WhisperProofState[] = [
  {
    id: "web",
    index: "01",
    label: "Web exhibition",
    railLabel: "Web",
    signal: "public cinematic surface",
    readout: "The public website becomes the first threshold: image, motion, text, and navigation behave as one exhibition field.",
    media: {
      type: "video",
      src: "/immersive/Whisper/Video/whisper-desktop-video.mp4",
      poster: "/immersive/Whisper/desktop/whisper-hero.jpg",
    },
    traces: [
      "/immersive/Whisper/desktop/whisper-8.jpg",
      "/immersive/Whisper/desktop/whisper-5.jpg",
      "/immersive/Whisper/mobile/whisper-mb-3.jpg",
    ],
  },
  {
    id: "mobile",
    index: "02",
    label: "Mobile presentation",
    railLabel: "Mobile",
    signal: "handheld threshold",
    readout: "The handheld surface keeps the archive present without flattening the atmosphere.",
    media: {
      type: "image",
      src: "/immersive/Whisper/mobile/whisper-mb-3.jpg",
    },
    traces: [
      "/immersive/Whisper/desktop/whisper-hero.jpg",
      "/immersive/Whisper/mobile/whisper-mb-6.jpg",
      "/immersive/Whisper/desktop/whisper-8.jpg",
    ],
  },
  {
    id: "print",
    index: "03",
    label: "Print edition",
    railLabel: "Print",
    signal: "edition surface",
    readout: "Edition logic extends the digital work into collectible object form.",
    media: {
      type: "image",
      src: "/immersive/Whisper/desktop/whisper-7.jpg",
    },
    traces: [
      "/immersive/Whisper/desktop/whisper-9.jpg",
      "/immersive/Whisper/mobile/whisper-mb-6.jpg",
      "/immersive/Whisper/desktop/whisper-5.jpg",
    ],
  },
  {
    id: "ar",
    index: "04",
    label: "AR preview",
    railLabel: "AR",
    signal: "screen to object",
    readout: "Preview logic connects the screen surface to physical placement and scale.",
    media: {
      type: "image",
      src: "/immersive/Whisper/desktop/whisper-9.jpg",
    },
    traces: [
      "/immersive/Whisper/mobile/whisper-mb-6.jpg",
      "/immersive/Whisper/desktop/whisper-7.jpg",
      "/immersive/Whisper/desktop/whisper-vr-1.jpg",
    ],
  },
  {
    id: "quest",
    index: "05",
    label: "Quest-tested spatial room",
    railLabel: "Room",
    signal: "room-scale proof",
    readout: "The archive becomes a spatial room with photographic memory around the viewer.",
    media: {
      type: "video",
      src: "/immersive/Whisper/Video/whisper-vr-video.mp4",
      poster: "/immersive/Whisper/desktop/whisper-vr-1.jpg",
    },
    traces: [
      "/immersive/Whisper/desktop/whisper-vr-2.jpg",
      "/immersive/Whisper/desktop/whisper-vr-3.jpg",
      "/immersive/Whisper/desktop/whisper-10.jpg",
    ],
  },
];

const mobileSurfaceReadouts: Record<WhisperProofId, string> = {
  web: "The public website becomes the first threshold: image, motion, text, and navigation behave as one exhibition field.",
  mobile: "The handheld surface keeps the archive present without flattening the atmosphere.",
  print: "Edition logic extends the digital work into collectible object form.",
  ar: "The work can continue as a screen-to-object preview.",
  quest: "The archive becomes a spatial room with photographic memory around the viewer.",
};

const mobileApplicationPaths = [
  "Exhibition microsites",
  "Premium product worlds",
  "Collector / print / AR systems",
  "Interactive archives",
  "Spatial pitch pages",
  "Installation-ready web layers",
  "WebXR prototypes",
];

type MobileChamberFieldId = "whisper" | FutureChamberId;
type MobileChamberFieldMode = "field" | "index";

type MobileChamberFieldEntry = {
  id: MobileChamberFieldId;
  index: string;
  title: string;
  status: string;
  role: string;
  cta: string;
  mediaSrc: string;
  preparedId?: FutureChamberId;
};

const mobileChamberFieldEntries: MobileChamberFieldEntry[] = [
  {
    id: "whisper",
    index: "01",
    title: "WHISPER",
    status: "Completed spatial proof",
    role: "Photographic archive -> web / mobile / print / AR / room-scale proof",
    cta: "Open WHISPER",
    mediaSrc: "/immersive/Whisper/desktop/whisper-hero.jpg",
  },
  {
    id: "product-world",
    index: "02",
    title: "Product World",
    status: "Prepared direction",
    role: "Product or service becomes a navigable world",
    cta: "View direction",
    mediaSrc: "/cases/house-of-lune/desktop/house-of-lune-hero.webp",
    preparedId: "product-world",
  },
  {
    id: "presence-archive",
    index: "03",
    title: "Presence Archive",
    status: "Research chamber",
    role: "Archive reacts to attention, memory, return, and media fragments",
    cta: "View traces",
    mediaSrc: "/immersive/Whisper/desktop/whisper-8.jpg",
    preparedId: "presence-archive",
  },
  {
    id: "collector-continuation",
    index: "04",
    title: "Collector Continuation",
    status: "Prepared continuation",
    role: "Print, edition, AR preview, and collector logic extend the digital surface",
    cta: "View traces",
    mediaSrc: "/immersive/Whisper/desktop/whisper-7.jpg",
    preparedId: "collector-continuation",
  },
];

function WhisperProofMedia({
  proof,
  className,
  fit = "cover",
}: {
  proof: WhisperProofState;
  className?: string;
  fit?: "cover" | "contain";
}) {
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";

  if (proof.media.type === "video") {
    return (
      <video
        className={`${fitClass} ${className ?? ""}`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={proof.media.poster}
      >
        <source src={proof.media.src} type="video/mp4" />
      </video>
    );
  }

  return <img src={proof.media.src} alt="" className={`${fitClass} ${className ?? ""}`} />;
}

function WhisperProofTrace({
  src,
  className,
}: {
  src?: string;
  className?: string;
}) {
  if (!src) return null;

  return <img src={src} alt="" className={`object-cover ${className ?? ""}`} />;
}

function SurfaceProofStage({
  proof,
  reduceMotion,
  onNext,
}: {
  proof: WhisperProofState;
  reduceMotion: boolean | null;
  onNext: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onNext}
      aria-label={`Show next WHISPER proof surface after ${proof.railLabel}`}
      className="group relative block min-h-[24rem] w-full overflow-hidden border border-neutral-950/[0.075] bg-zinc-50/[0.24] text-left shadow-[0_36px_110px_rgba(24,24,22,0.075)] outline-none transition focus-visible:ring-2 focus-visible:ring-neutral-950 sm:min-h-[32rem] lg:min-h-[58vh]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_42%,rgba(255,255,255,0.34),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.14),rgba(242,242,239,0.1))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.28] [background-image:linear-gradient(to_right,rgba(10,10,10,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,10,10,0.034)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="pointer-events-none absolute inset-x-[5%] top-[8%] h-px bg-neutral-950/10" />
      <div className="pointer-events-none absolute inset-x-[5%] bottom-[8%] h-px bg-neutral-950/8" />

      <AnimatePresence mode="wait">
        <motion.div
          key={proof.id}
          className="absolute inset-0"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.992 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 1.006 }}
          transition={{ duration: 0.52, ease }}
        >
          {renderWhisperSurface(proof)}
        </motion.div>
      </AnimatePresence>

      <span className="pointer-events-none absolute left-4 top-4 z-20 font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-950/48 sm:left-5 sm:top-5 sm:text-[9px]">
        WHISPER / Surface {proof.index}
      </span>
      <span className="pointer-events-none absolute bottom-4 right-4 z-20 hidden border-t border-neutral-950/22 pt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-950/48 transition group-hover:text-neutral-950 sm:block">
        Next surface -&gt;
      </span>
    </button>
  );
}

function renderWhisperSurface(proof: WhisperProofState) {
  switch (proof.id) {
    case "mobile":
      return (
        <div className="absolute inset-0">
          <WhisperProofTrace
            src={proof.traces[1]}
            className="absolute left-[16%] top-[20%] h-[55%] w-[20%] -rotate-[10deg] opacity-[0.16] grayscale blur-[0.2px]"
          />
          <WhisperProofTrace
            src={proof.traces[0]}
            className="absolute right-[14%] top-[17%] h-[60%] w-[24%] rotate-[8deg] opacity-[0.1] grayscale blur-[0.3px]"
          />
          <div className="pointer-events-none absolute left-[13%] top-[17%] h-[62%] w-[28%] border border-neutral-950/10" />
          <div className="pointer-events-none absolute right-[13%] top-[21%] h-[54%] w-[25%] border border-neutral-950/8" />
          <div className="absolute inset-0 flex items-center justify-center px-8 py-12 sm:px-12 sm:py-14">
            <div className="relative h-[82%] max-h-[38rem] min-h-[18rem] aspect-[9/19] overflow-hidden rounded-[1.6rem] border-[7px] border-neutral-950 bg-neutral-950 shadow-[0_30px_110px_rgba(0,0,0,0.28)] sm:border-[10px]">
              <WhisperProofMedia proof={proof} className="absolute inset-0 h-full w-full saturate-[1.05] contrast-[1.05]" />
              <span className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-white/16" />
              <span className="absolute inset-0 ring-1 ring-inset ring-white/12" />
            </div>
          </div>
          <div className="pointer-events-none absolute left-[28%] top-[72%] h-px w-[44%] bg-neutral-950/18" />
          <div className="pointer-events-none absolute left-[48%] top-[16%] h-[70%] w-px bg-neutral-950/8" />
        </div>
      );

    case "print":
      return (
        <div className="absolute inset-0">
          <div className="pointer-events-none absolute left-[14%] top-[18%] h-[58%] w-[54%] -rotate-[4deg] border border-neutral-950/10 bg-white/[0.18] shadow-[0_28px_95px_rgba(28,28,24,0.1)]" />
          <div className="pointer-events-none absolute right-[11%] top-[23%] h-[48%] w-[38%] rotate-[5deg] border border-neutral-950/8 bg-white/[0.12]" />
          <div className="absolute inset-0 flex items-center justify-center px-7 py-12 sm:px-12">
            <div className="relative w-[min(82%,48rem)] rotate-[1.2deg] border border-neutral-950/22 bg-[#f8f8f5] p-4 shadow-[0_38px_130px_rgba(28,28,24,0.2)] sm:p-6">
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1.15fr)_0.85fr] sm:gap-5">
                <div className="relative min-h-[12rem] overflow-hidden bg-neutral-950 sm:min-h-[18rem]">
                  <WhisperProofMedia proof={proof} className="absolute inset-0 h-full w-full saturate-[1.08] contrast-[1.14] brightness-[1.03]" />
                  <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.025))]" />
                </div>
                <div className="flex min-h-[12rem] flex-col justify-between border-l border-neutral-950/18 pl-4 font-mono uppercase tracking-[0.16em] text-neutral-950 sm:min-h-[18rem] sm:pl-5">
                  <div>
                    <div className="text-[9px] text-neutral-500">Whisper / Edition Archive</div>
                    <div className="mt-5 text-[18px] leading-none tracking-normal sm:text-[24px]">Limited Edition</div>
                    <div className="mt-3 h-px w-full bg-neutral-950/24" />
                  </div>
                  <div className="text-[9px] leading-5 text-neutral-500">
                    Object proof / collector surface
                    <br />
                    Archive continuity / 03
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-neutral-950/18 pt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500">
                <span>Printed atmosphere</span>
                <span>Edition 01 / 30</span>
              </div>
            </div>
          </div>
        </div>
      );

    case "ar":
      return (
        <div className="absolute inset-0">
          <div className="pointer-events-none absolute inset-[10%] border border-neutral-950/8 opacity-[0.72] [background-image:linear-gradient(to_right,rgba(10,10,10,0.042)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,10,10,0.038)_1px,transparent_1px)] [background-size:38px_38px]" />
          <div className="pointer-events-none absolute left-[15%] top-[18%] h-[56%] w-[70%] border border-neutral-950/10" />
          <div className="pointer-events-none absolute left-[24%] top-[28%] h-[40%] w-[52%] rotate-[-9deg] border border-neutral-950/8" />
          <div className="absolute inset-0 flex items-center justify-center px-8 py-12">
            <div className="relative w-[min(78%,48rem)]">
              <div className="relative aspect-[1.58/1] overflow-hidden border border-neutral-950/18 bg-white/[0.18] shadow-[0_34px_118px_rgba(24,24,22,0.14)]">
                <WhisperProofMedia proof={proof} className="absolute inset-0 h-full w-full saturate-[1.08] contrast-[1.12] brightness-[1.02]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_46%,transparent_0,transparent_48%,rgba(246,246,243,0.18)_84%)]" />
                <span className="absolute left-4 top-4 h-7 w-7 border-l border-t border-white/74" />
                <span className="absolute right-4 top-4 h-7 w-7 border-r border-t border-white/74" />
                <span className="absolute bottom-4 left-4 h-7 w-7 border-b border-l border-white/74" />
                <span className="absolute bottom-4 right-4 h-7 w-7 border-b border-r border-white/74" />
              </div>
              <div className="mt-4 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500">
                <span className="h-2 w-2 rounded-full border border-neutral-950/40 bg-white/40" />
                <span>Placement plane / scale preview</span>
                <span className="h-px flex-1 bg-neutral-950/16" />
              </div>
            </div>
          </div>
          <WhisperProofTrace
            src={proof.traces[0]}
            className="absolute bottom-[14%] right-[13%] h-[30%] w-[12%] opacity-[0.14] grayscale"
          />
        </div>
      );

    case "quest":
      return (
        <div className="absolute inset-0 bg-white/[0.22]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_54%_44%,rgba(255,255,255,0.36),transparent_35%),radial-gradient(circle_at_50%_78%,rgba(0,0,0,0.04),transparent_48%)]" />
          <div className="absolute inset-x-[6%] top-[13%] bottom-[16%] overflow-hidden bg-neutral-950 shadow-[0_42px_138px_rgba(0,0,0,0.3)]">
            <WhisperProofMedia proof={proof} className="absolute inset-0 h-full w-full saturate-[1.1] contrast-[1.1] brightness-[1.12]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.055),transparent_28%,transparent_72%,rgba(0,0,0,0.05)),radial-gradient(circle_at_50%_42%,transparent_0,rgba(0,0,0,0.02)_54%,rgba(0,0,0,0.065)_100%)]" />
            <div className="absolute inset-x-[6%] bottom-[9%] h-[28%] opacity-[0.35] [background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:46px_28px]" />
            <div className="absolute bottom-[11%] left-[8%] right-[8%] h-px bg-white/28" />
          </div>
          <div className="pointer-events-none absolute left-[8%] top-[11%] h-[72%] w-[24%] border-l border-neutral-950/12" />
          <div className="pointer-events-none absolute right-[8%] top-[11%] h-[72%] w-[24%] border-r border-neutral-950/12" />
        </div>
      );

    case "web":
    default:
      return (
        <div className="absolute inset-0">
          <WhisperProofTrace
            src={proof.traces[0]}
            className="absolute bottom-[12%] left-[9%] h-[18%] w-[28%] opacity-[0.12] grayscale"
          />
          <WhisperProofTrace
            src={proof.traces[1]}
            className="absolute right-[8%] top-[16%] h-[20%] w-[24%] opacity-[0.1] grayscale"
          />
          <div className="absolute inset-0 flex items-center justify-center px-6 py-12 sm:px-10">
            <div className="relative w-[min(94%,58rem)] overflow-hidden bg-neutral-950 shadow-[0_40px_130px_rgba(0,0,0,0.26)]">
              <div className="aspect-[16/9]">
                <WhisperProofMedia proof={proof} className="absolute inset-0 h-full w-full saturate-[1.1] contrast-[1.1] brightness-[1.04]" />
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.045))]" />
              </div>
              <div className="absolute left-0 right-0 top-0 flex items-center justify-between border-b border-white/12 bg-black/22 px-4 py-3 font-mono text-[8px] uppercase tracking-[0.18em] text-white/58 sm:text-[9px]">
                <span>Whisper / Web exhibition</span>
                <span>Public threshold</span>
              </div>
            </div>
          </div>
        </div>
      );
  }
}

type ChamberSelectionState = {
  activeChamberId: ImmersiveChamberId;
  activeChamber: ImmersiveSystemItem;
  activeChamberEngines: ReturnType<typeof getChamberEngines>;
  selectChamber: (id: ImmersiveChamberId, feedback?: "transition" | "select" | "none") => void;
  resetChamber: () => void;
};

type AtlasMode = "orbit" | "assemble";

function useImmersiveChamberSelection(): ChamberSelectionState {
  const [activeChamberId, setActiveChamberId] = useState<ImmersiveChamberId>(defaultImmersiveChamberId);
  const sound = useSound();

  const activeChamber = getImmersiveChamber(activeChamberId);
  const activeChamberEngines = getChamberEngines(activeChamberId);

  const selectChamber = useCallback((id: ImmersiveChamberId, feedback: "transition" | "select" | "none" = "transition") => {
    if (id !== activeChamberId && feedback !== "none") sound.playRole(feedback);
    setActiveChamberId(id);
  }, [activeChamberId, sound]);

  const resetChamber = useCallback(() => {
    setActiveChamberId(defaultImmersiveChamberId);
  }, []);

  return {
    activeChamberId,
    activeChamber,
    activeChamberEngines,
    selectChamber,
    resetChamber,
  };
}

function circularOrbitOffset(index: number, progress: number, total: number) {
  let offset = index - progress;

  while (offset > total / 2) offset -= total;
  while (offset < -total / 2) offset += total;

  return offset;
}

function SpatialChamberOrbit({
  activeChamber,
  activeChamberId,
  activeChamberEngines,
  selectChamber,
  openChamber,
}: {
  activeChamber: ImmersiveSystemItem;
  activeChamberId: ImmersiveChamberId;
  activeChamberEngines: ReturnType<typeof getChamberEngines>;
  selectChamber: (id: ImmersiveChamberId, feedback?: "transition" | "select" | "none") => void;
  openChamber: (id: ImmersiveChamberId) => void;
}) {
  const orbitSlots: Record<string, {
    width: string;
    height: string;
    x: number;
    y: number;
    rotateZ: number;
    rotateY: number;
    scale: number;
    opacity: number;
    clipPath: string;
    titleClass: string;
  }> = {
    active: {
      width: "w-[70%]",
      height: "h-[49%]",
      x: 0,
      y: -12,
      rotateZ: -3.5,
      rotateY: 0,
      scale: 1,
      opacity: 1,
      clipPath: "polygon(2% 0, 100% 6%, 94% 92%, 0 100%)",
      titleClass: "text-[60px]",
    },
    prev: {
      width: "w-[39%]",
      height: "h-[26%]",
      x: -74,
      y: -48,
      rotateZ: -11,
      rotateY: 12,
      scale: 0.86,
      opacity: 0.68,
      clipPath: "polygon(8% 0, 100% 6%, 91% 94%, 0 100%)",
      titleClass: "text-[28px]",
    },
    next: {
      width: "w-[38%]",
      height: "h-[26%]",
      x: 90,
      y: -8,
      rotateZ: 10,
      rotateY: -14,
      scale: 0.82,
      opacity: 0.6,
      clipPath: "polygon(5% 0, 100% 8%, 88% 100%, 0 90%)",
      titleClass: "text-[28px]",
    },
    farPrev: {
      width: "w-[31%]",
      height: "h-[22%]",
      x: -94,
      y: 64,
      rotateZ: 10,
      rotateY: 18,
      scale: 0.72,
      opacity: 0.34,
      clipPath: "polygon(0 8%, 95% 0, 100% 86%, 7% 100%)",
      titleClass: "text-[24px]",
    },
    farNext: {
      width: "w-[31%]",
      height: "h-[22%]",
      x: 101,
      y: 61,
      rotateZ: -9,
      rotateY: -18,
      scale: 0.72,
      opacity: 0.34,
      clipPath: "polygon(10% 0, 100% 10%, 86% 100%, 0 90%)",
      titleClass: "text-[24px]",
    },
  };
  const reduceMotion = useReducedMotion();
  const sound = useSound();
  const initialIndex = Math.max(0, immersiveHubChambers.findIndex((item) => item.id === activeChamberId));
  const orbitRef = useRef<HTMLDivElement | null>(null);
  const lastWheelRef = useRef(0);
  const [activeOrbitIndex, setActiveOrbitIndex] = useState(initialIndex);
  const [hoveredId, setHoveredId] = useState<ImmersiveChamberId | null>(null);
  const activeIndex = Math.max(0, immersiveHubChambers.findIndex((item) => item.id === activeChamberId));

  useEffect(() => {
    if (activeIndex < 0) return;
    const timer = window.setTimeout(() => {
      setActiveOrbitIndex((current) => (current === activeIndex ? current : activeIndex));
    }, 0);

    return () => window.clearTimeout(timer);
  }, [activeIndex]);

  const moveOrbit = useCallback((direction: 1 | -1, feedback: "transition" | "select" | "none" = "transition") => {
    setActiveOrbitIndex((current) => {
      const nextIndex = (current + direction + immersiveHubChambers.length) % immersiveHubChambers.length;
      const nextChamber = immersiveHubChambers[nextIndex];

      if (nextChamber) selectChamber(nextChamber.id, feedback);

      return nextIndex;
    });

    if (feedback !== "none") sound.playRole(feedback);
  }, [selectChamber, sound]);

  const focusChamber = (id: ImmersiveChamberId, index: number) => {
    setActiveOrbitIndex(index);
    selectChamber(id, "select");
  };

  useEffect(() => {
    const element = orbitRef.current;
    if (!element) return;

    const handleNativeWheel = (event: globalThis.WheelEvent) => {
      if (reduceMotion || Math.abs(event.deltaY) < 8) return;

      event.preventDefault();

      const now = window.performance.now();
      if (now - lastWheelRef.current < 430) return;

      lastWheelRef.current = now;
      moveOrbit(event.deltaY > 0 ? 1 : -1, "transition");
    };

    element.addEventListener("wheel", handleNativeWheel, { passive: false });

    return () => element.removeEventListener("wheel", handleNativeWheel);
  }, [moveOrbit, reduceMotion]);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveOrbit(1, "transition");
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveOrbit(-1, "transition");
    }

    if (event.key === "Enter") {
      event.preventDefault();
      openChamber(activeChamberId);
    }
  };

  const activePoster = activeChamber.media?.poster ?? activeChamber.media?.stills?.[0] ?? "";

  return (
    <div className="relative min-h-[720px] overflow-visible md:min-h-[820px] xl:w-full">
      <div className="pointer-events-none absolute left-[8%] top-[4%] h-[80%] w-[86%] border-l border-t border-neutral-950/12" />
      <div className="pointer-events-none absolute bottom-[10%] right-[0%] h-[58%] w-[68%] border-b border-r border-neutral-950/10" />
      <div className="pointer-events-none absolute left-[9%] top-[12%] h-[74%] w-[82%] rounded-[50%] border border-neutral-950/[0.07]" />
      <div className="pointer-events-none absolute left-[12%] top-[52%] h-px w-[82%] -rotate-[11deg] bg-gradient-to-r from-transparent via-neutral-950/16 to-transparent" />
      <div className="pointer-events-none absolute right-[4%] top-[18%] border-y border-neutral-950/12 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-neutral-400">
        Presence gives depth
      </div>

      <div
        role="listbox"
        aria-label="Immersive chamber orbit"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        ref={orbitRef}
        className="relative hidden min-h-[720px] translate-x-[1%] cursor-ns-resize outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 md:block md:min-h-[820px] xl:translate-x-[2%]"
        style={{ perspective: "1800px", transformStyle: "preserve-3d", touchAction: "none" }}
      >
        <div className="pointer-events-none absolute left-[8%] top-[10%] h-[74%] w-[82%] rounded-[50%] border border-neutral-950/[0.055]" />

        {immersiveHubChambers.map((chamber, index) => {
          const poster = chamber.media?.poster ?? chamber.media?.stills?.[0] ?? activePoster;
          const offset = circularOrbitOffset(index, activeOrbitIndex, immersiveHubChambers.length);
          const abs = Math.abs(offset);
          const visible = abs <= 2.05;
          const active = index === activeOrbitIndex;
          const hovered = hoveredId === chamber.id;
          const slotKey = active ? "active" : offset < -1 ? "farPrev" : offset < 0 ? "prev" : offset > 1 ? "farNext" : "next";
          const slot = orbitSlots[slotKey];
          const depthScale = slot.scale + (hovered ? 0.035 : 0);
          const opacity = hovered ? Math.min(slot.opacity + 0.12, 1) : slot.opacity;
          const depthBlur = active ? 0 : abs > 1 ? 1.1 : 0.45;
          const zIndex = Math.round(100 - abs * 10 + (hovered ? 8 : 0));
          const activeVideo = active ? chamber.media?.video : undefined;

          return (
            <motion.button
              key={chamber.id}
              type="button"
              role="option"
              aria-selected={active}
              onMouseEnter={() => {
                setHoveredId(chamber.id);
                sound.playRole("surface");
              }}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => {
                if (active) {
                  openChamber(chamber.id);
                  return;
                }

                focusChamber(chamber.id, index);
              }}
              className={[
                "group absolute left-1/2 top-1/2 overflow-hidden border bg-neutral-950 text-left transition-[border-color,opacity] duration-300",
                "shadow-[0_34px_120px_rgba(0,0,0,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300",
                slot.width,
                slot.height,
                active ? "border-white/70" : "border-white/34",
                visible ? "pointer-events-auto" : "pointer-events-none",
              ].join(" ")}
              animate={{
                opacity: visible ? opacity : 0,
                x: `calc(-50% + ${slot.x}%)`,
                y: `calc(-50% + ${slot.y}%)`,
                rotateY: slot.rotateY,
                rotateZ: slot.rotateZ,
                scale: depthScale,
                filter: `blur(${depthBlur}px)`,
              }}
              style={{ zIndex, transformStyle: "preserve-3d", clipPath: slot.clipPath }}
              transition={{ duration: reduceMotion ? 0 : 0.72, ease }}
            >
              {activeVideo ? (
                <video
                  className={`absolute inset-[-3%] h-[106%] w-[106%] object-cover contrast-[1.04] ${
                    active ? "opacity-100 saturate-[1.04] brightness-[1.04]" : "opacity-[0.97] saturate-[1.03] brightness-[1.02]"
                  }`}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={poster}
                >
                  <source src={activeVideo} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={poster}
                  alt=""
                  className={`absolute inset-[-3%] h-[106%] w-[106%] object-cover contrast-[1.04] transition duration-500 group-hover:scale-[1.035] ${
                    active ? "opacity-100 saturate-[1.04] brightness-[1.04]" : "opacity-[0.97] saturate-[1.03] brightness-[1.02]"
                  }`}
                />
              )}

              <div
                className={`absolute inset-0 ${
                  active
                    ? "bg-[linear-gradient(180deg,rgba(4,7,10,0.01),rgba(4,7,10,0.1)_62%,rgba(4,7,10,0.22))]"
                    : "bg-[linear-gradient(180deg,rgba(4,7,10,0.01),rgba(4,7,10,0.09)_58%,rgba(4,7,10,0.18))]"
                }`}
              />
              <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-4 border-y border-white/14 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/54">
                <span>{chamber.statusLabel}</span>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className={`max-w-[10ch] font-normal leading-[0.86] tracking-[-0.065em] text-white drop-shadow-[0_4px_22px_rgba(0,0,0,0.45)] ${slot.titleClass}`}>
                  {chamber.shortTitle}
                </div>
                {active ? (
                  <p className="mt-4 max-w-[30rem] text-[13px] leading-6 text-white/62">{chamber.proofLine}</p>
                ) : null}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="grid gap-4 md:hidden">
        <div className="relative min-h-[25rem] overflow-hidden border border-white/70 bg-neutral-950 text-white shadow-[0_30px_100px_rgba(0,0,0,0.12)]">
          <img src={activePoster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-88" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.04),rgba(5,5,5,0.68))]" />
          <div className="absolute bottom-5 left-5 right-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.17em] text-white/56">{activeChamber.statusLabel}</div>
            <div className="mt-3 text-[46px] leading-[0.86] tracking-[-0.065em]">{activeChamber.shortTitle}</div>
            <p className="mt-4 text-[14px] leading-6 text-white/66">{activeChamber.proofLine}</p>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {immersiveHubChambers.map((chamber, index) => (
            <button
              key={chamber.id}
              type="button"
              onClick={() => focusChamber(chamber.id, index)}
              className={`min-w-[10rem] border px-3 py-2 text-left text-[10px] uppercase tracking-[0.14em] ${
                chamber.id === activeChamberId
                  ? "border-neutral-950 bg-neutral-950 text-white"
                  : "border-neutral-300 bg-white/54 text-neutral-500"
              }`}
            >
              <span className="font-mono">{String(index + 1).padStart(2, "0")}</span>
              <span className="ml-3">{chamber.shortTitle}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-[2%] right-[8%] hidden max-w-[26rem] border-l border-neutral-950/18 pl-5 xl:block">
        <div className="text-[10px] uppercase tracking-[0.22em] text-neutral-400">Active chamber</div>

        <p className="mt-4 text-[14px] leading-7 text-neutral-600">{activeChamber.proofLine}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {activeChamberEngines.slice(0, 3).map((engine) => (
            <span
              key={engine.id}
              className="border-y border-neutral-950/14 px-2.5 py-1 text-[9px] uppercase tracking-[0.13em] text-neutral-500"
            >
              {engine.signal}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChamberEntryField({
  activeChamber,
  activeChamberId,
  activeChamberEngines,
  selectChamber,
  openChamber,
  onExplore,
  onOpenProject,
}: {
  activeChamber: ImmersiveSystemItem;
  activeChamberId: ImmersiveChamberId;
  activeChamberEngines: ReturnType<typeof getChamberEngines>;
  selectChamber: (id: ImmersiveChamberId, feedback?: "transition" | "select" | "none") => void;
  openChamber: (id: ImmersiveChamberId) => void;
  onExplore: () => void;
  onOpenProject?: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const sound = useSound();

  return (
    <section
      id="threshold"
      data-header-scene={immersiveHeaderScenes.threshold}
      data-sound-safe-area
      className="relative min-h-screen overflow-hidden px-4 pb-16 pt-24 sm:px-6 lg:px-8"
      data-entry-chamber={activeChamberId}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8vw] top-[17vh] h-[45rem] w-[45rem] rounded-full border border-neutral-950/[0.055]" />
        <div className="absolute right-[9vw] top-[20vh] h-[34rem] w-[34rem] rounded-full border border-neutral-950/[0.06]" />
        <div className="absolute left-[4vw] top-[43vh] h-px w-[93vw] rotate-[-12deg] bg-gradient-to-r from-transparent via-neutral-950/15 to-transparent" />
        <div className="absolute left-[18vw] top-[71vh] h-px w-[68vw] rotate-[18deg] bg-gradient-to-r from-transparent via-neutral-950/9 to-transparent" />
      </div>

      <motion.div
        className="pointer-events-none absolute right-[11vw] top-[21vh] hidden h-px w-[22vw] origin-left bg-neutral-950/20 xl:block"
        animate={reduceMotion ? undefined : { scaleX: [0.35, 1, 0.35], opacity: [0.18, 0.48, 0.18] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="pointer-events-none absolute right-[10vw] top-[18vh] hidden border-y border-neutral-950/12 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-neutral-400 xl:block">
        {activeChamber.chamberSignal}
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-7rem)] w-[min(94vw,1640px)] items-center gap-12 xl:grid-cols-[0.47fr_0.53fr]">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-neutral-300/70 bg-white/56 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-neutral-500 backdrop-blur">
              Immersive interface systems hub
            </span>
            <span className="rounded-full border border-neutral-300/70 bg-white/38 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-neutral-500 backdrop-blur">
              Chamber map
            </span>
          </div>

          <h1 className="mt-8 max-w-[10ch] text-[76px] font-normal leading-[0.78] tracking-[-0.09em] text-neutral-950 sm:text-[112px] md:text-[150px] xl:text-[176px]">
            Immersive interface systems.
          </h1>

          <p className="mt-9 max-w-[46rem] text-[17px] leading-[1.85] text-neutral-600 sm:text-[19px]">
            Cinematic web environments, spatial archives, product worlds, AR continuations, presence-based interfaces,
            and WebXR-ready prototypes.
          </p>

          <p className="mt-5 max-w-[42rem] text-[14px] leading-7 text-neutral-500">
            Websites as scenes, archives as rooms, products as worlds, interfaces as living fields.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onMouseEnter={() => sound.playRole("hover")}
              onClick={() => {
                sound.playRole("select");
                onExplore();
              }}
              className="rounded-full border border-neutral-950 bg-neutral-950 px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
            >
              Explore chambers →
            </button>

            <button
              type="button"
              onMouseEnter={() => sound.playRole("hover")}
              onClick={() => openChamber("whisper")}
              className="rounded-full border border-neutral-300 bg-white/60 px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-neutral-700 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
            >
              Open WHISPER →
            </button>

            <button
              type="button"
              onMouseEnter={() => sound.playRole("hover")}
              onClick={() => {
                sound.playRole("open");
                onOpenProject?.();
              }}
              className="rounded-full border border-neutral-300 bg-white/36 px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-neutral-700 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
            >
              Start immersive prototype →
            </button>
          </div>

          <div className="mt-6">
          </div>
        </div>

        <SpatialChamberOrbit
          activeChamber={activeChamber}
          activeChamberId={activeChamberId}
          activeChamberEngines={activeChamberEngines}
          selectChamber={selectChamber}
          openChamber={openChamber}
        />
      </div>
    </section>
  );
}

function ImmersiveV2Meta() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Immersive Interface Systems Hub — Rostyslav Brenych";

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

function useActiveSection() {
  const [activeId, setActiveId] = useState<SectionId>("threshold");
  const activeRef = useRef<SectionId>("threshold");

  useEffect(() => {
    activeRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;

      const viewportAnchor = window.innerHeight * 0.46;
      let nextId: SectionId = sectionItems[0].id;
      let bestScore = Number.NEGATIVE_INFINITY;

      sectionItems.forEach((item, order) => {
        const section = document.getElementById(item.id);
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const containsAnchor = rect.top <= viewportAnchor && rect.bottom >= viewportAnchor;
        const distance = Math.min(
          Math.abs(rect.top - viewportAnchor),
          Math.abs(rect.bottom - viewportAnchor),
        );
        const score = containsAnchor
          ? 10000 - rect.height / 34 - Math.abs(rect.top - viewportAnchor) / 46 + order / 1000
          : -distance + order / 1000;

        if (score > bestScore) {
          bestScore = score;
          nextId = item.id;
        }
      });

      if (activeRef.current !== nextId) {
        activeRef.current = nextId;
        setActiveId(nextId);
      }
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveSection);
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

  return activeId;
}

function Chapter({ id, children, className = "" }: { id: SectionId; children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <section id={id} data-header-scene={immersiveHeaderScenes[id]} className={className}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      data-header-scene={immersiveHeaderScenes[id]}
      className={className}
      initial={{ opacity: 0, y: 46 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.88, ease }}
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
          transition={{ duration: 0.68, delay: index * 0.028, ease }}
        >
          {word}
          {index < words.length - 1 ? "\u00a0" : ""}
        </motion.span>
      ))}
    </MotionTag>
  );
}

function TerminalAtlasSignal({
  inspectedChamber,
  mode,
}: {
  inspectedChamber: ImmersiveSystemItem | null;
  mode: AtlasMode;
}) {
  const signal =
    mode === "assemble"
      ? "ASSEMBLY MODE / Spatial material is reorganized into a long inspection field. Scroll to read each chamber as proof, signal, and engine."
      : inspectedChamber
        ? `${inspectedChamber.room.toUpperCase()} / ${inspectedChamber.statusLabel}. ${inspectedChamber.summary}`
        : "ATLAS READY / Chambers are suspended as spatial material. Click a plane to pull it forward; wheel or route selects the next chamber.";

  return (
    <motion.div
      key={`${mode}-${inspectedChamber?.id ?? "atlas-ready"}`}
      className="mt-7 max-w-[31rem] border-l border-white/18 pl-4 font-mono"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease }}
    >
      <div className="text-[9px] uppercase tracking-[0.2em] text-white/28">
        {mode === "assemble" ? "Assembly signal" : inspectedChamber ? "Project signal" : "Atlas signal"}
      </div>
      <motion.p
        className="mt-3 text-[11px] uppercase leading-6 tracking-[0.12em] text-white/56"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: Math.min(2.5, 0.75 + signal.length * 0.011), ease: "linear" }}
      >
        {signal}
        <motion.span
          className="ml-1 inline-block text-white/80"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
        >
          _
        </motion.span>
      </motion.p>
    </motion.div>
  );
}

function PracticeMapScene({
  chamberState,
  openChamber,
}: {
  chamberState: ChamberSelectionState;
  openChamber: (id: ImmersiveChamberId) => void;
}) {
  const sound = useSound();
  const activeChamber = chamberState.activeChamber;
  const activePoster = activeChamber.media?.poster ?? activeChamber.media?.stills?.[0] ?? "";
  const activeTrace = activeChamber.media?.stills?.[1] ?? activeChamber.media?.stills?.[0] ?? activePoster;
  const activeMemoryTraces = Array.from(new Set([activeTrace, ...(activeChamber.media?.stills ?? [])])).filter(Boolean).slice(0, 3);
  const activeEngines = chamberState.activeChamberEngines.slice(0, 4);
  const [atlasOpen, setAtlasOpen] = useState(false);
  const [atlasMode, setAtlasMode] = useState<AtlasMode>("orbit");
  const [inspectedChamberId, setInspectedChamberId] = useState<ImmersiveChamberId | null>(null);
  const [atlasPlaneOffsets, setAtlasPlaneOffsets] = useState<Partial<Record<ImmersiveChamberId, { x: number; y: number }>>>({});
  const reduceMotion = useReducedMotion();
  const inspectedChamber = inspectedChamberId ? getImmersiveChamber(inspectedChamberId) : null;
  const atlasSignalChamber = inspectedChamber ?? activeChamber;
  const atlasEngines = getChamberEngines(inspectedChamberId ?? chamberState.activeChamberId).slice(0, 3);
  const modeTransitionLabel = atlasMode === "assemble" ? "Assembling field" : "Returning orbit";
  const wheelLockRef = useRef(0);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const suppressPlaneClickRef = useRef(false);
  const atlasFieldRef = useRef<HTMLDivElement | null>(null);
  const atlasShellRef = useRef<HTMLDivElement | null>(null);
  const atlasActiveChamberId = chamberState.activeChamberId;
  const selectAtlasChamber = chamberState.selectChamber;
  const chamberSlots: Record<ImmersiveChamberId, { x: number; y: number; rotate: number; size: "large" | "medium" | "small" }> = {
    whisper: { x: 48, y: 34, rotate: -5, size: "large" },
    "product-world": { x: 24, y: 62, rotate: 6, size: "medium" },
    "presence-archive": { x: 71, y: 61, rotate: -7, size: "medium" },
    "collector-continuation": { x: 78, y: 27, rotate: 8, size: "small" },
    "installation-field": { x: 39, y: 78, rotate: -4, size: "small" },
  };
  const inspectSlots: Record<ImmersiveChamberId, { x: number; y: number; rotate: number; size: "large" | "medium" | "small" }> = {
    whisper: { x: 28, y: 30, rotate: -5, size: "large" },
    "product-world": { x: 21, y: 61, rotate: 5, size: "large" },
    "presence-archive": { x: 78, y: 60, rotate: -6, size: "large" },
    "collector-continuation": { x: 78, y: 31, rotate: 6, size: "medium" },
    "installation-field": { x: 43, y: 80, rotate: -3, size: "medium" },
  };

  const selectChamberByOffset = useCallback((offset: number) => {
    const currentIndex = immersiveHubChambers.findIndex((chamber) => chamber.id === atlasActiveChamberId);
    const nextIndex = (currentIndex + offset + immersiveHubChambers.length) % immersiveHubChambers.length;
    const nextId = immersiveHubChambers[nextIndex].id;
    selectAtlasChamber(nextId);
    if (atlasOpen) setInspectedChamberId(nextId);
  }, [atlasActiveChamberId, atlasOpen, selectAtlasChamber]);

  const clampPlaneOffsetX = (value: number) => Math.max(-240, Math.min(240, value));
  const clampPlaneOffsetY = (value: number) => Math.max(-160, Math.min(220, value));

  const handleAtlasPlaneDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, id: ImmersiveChamberId) => {
    const moved = Math.abs(info.offset.x) > 6 || Math.abs(info.offset.y) > 6;
    if (moved) suppressPlaneClickRef.current = true;

    setAtlasPlaneOffsets((current) => {
      const origin = current[id] ?? { x: 0, y: 0 };

      return {
        ...current,
        [id]: {
          x: clampPlaneOffsetX(origin.x + info.offset.x),
          y: clampPlaneOffsetY(origin.y + info.offset.y),
        },
      };
    });
  };

  const inspectAtlasChamber = (id: ImmersiveChamberId) => {
    if (id !== inspectedChamberId) sound.playRole("select");
    chamberState.selectChamber(id);
    setInspectedChamberId(id);
  };

  const resetAtlasViewport = useCallback(() => {
    const shell = atlasShellRef.current;
    if (!shell) return;

    shell.scrollTop = 0;
    shell.scrollLeft = 0;
    window.requestAnimationFrame(() => {
      shell.scrollTop = 0;
      shell.scrollLeft = 0;
    });
  }, []);

  const returnAtlasToOrbit = useCallback(() => {
    resetAtlasViewport();
    setAtlasMode("orbit");
  }, [resetAtlasViewport]);

  const handleAtlasWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (atlasMode === "assemble") return;
    if (Math.abs(event.deltaY) < 18 && Math.abs(event.deltaX) < 18) return;

    const now = Date.now();
    if (now - wheelLockRef.current < 520) return;

    wheelLockRef.current = now;
    selectChamberByOffset(event.deltaY + event.deltaX > 0 ? 1 : -1);
  };

  const isAtlasControlTarget = (target: EventTarget | null) => {
    return target instanceof HTMLElement && Boolean(target.closest("button,a,input,textarea,select,[data-atlas-control='true']"));
  };

  const handleAtlasPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isAtlasControlTarget(event.target)) return;
    dragStartRef.current = { x: event.clientX, y: event.clientY };
  };

  const handleAtlasPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (isAtlasControlTarget(event.target)) {
      dragStartRef.current = null;
      return;
    }

    const start = dragStartRef.current;
    dragStartRef.current = null;
    if (!start) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const primaryDelta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;

    if (Math.abs(primaryDelta) < 64) {
      if (inspectedChamberId) setInspectedChamberId(null);
      return;
    }

    selectChamberByOffset(primaryDelta < 0 ? 1 : -1);
  };

  useEffect(() => {
    if (!atlasOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (atlasMode === "assemble") {
          returnAtlasToOrbit();
          return;
        }

        if (inspectedChamberId) {
          sound.playRole("close");
          setInspectedChamberId(null);
          return;
        }

        sound.playRole("close");
        setAtlasOpen(false);
      }
      if (atlasMode === "orbit" && (event.key === "ArrowDown" || event.key === "ArrowRight")) selectChamberByOffset(1);
      if (atlasMode === "orbit" && (event.key === "ArrowUp" || event.key === "ArrowLeft")) selectChamberByOffset(-1);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [atlasOpen, chamberState.activeChamberId, inspectedChamberId, atlasMode, selectChamberByOffset, sound, returnAtlasToOrbit]);

  useEffect(() => {
    if (!atlasOpen || atlasMode !== "orbit") return;
    resetAtlasViewport();
  }, [atlasOpen, atlasMode, resetAtlasViewport]);

  return (
    <Chapter id="map" className="relative min-h-screen overflow-hidden px-4 pb-12 pt-16 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[4vw] top-[22vh] h-px w-[92vw] rotate-[-9deg] bg-gradient-to-r from-transparent via-neutral-950/10 to-transparent" />
        <div className="absolute right-[12vw] top-[9vh] h-[36rem] w-[36rem] rounded-full border border-neutral-950/[0.045]" />
      </div>

      <div className="relative z-10 mx-auto min-h-[calc(100vh-8rem)] w-[min(96vw,1740px)]">
        <div className="mb-6 grid gap-6 xl:grid-cols-[0.42fr_0.58fr] xl:items-end">
          <div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Spatial practice map</div>
            <h2 className="mt-4 max-w-[9ch] text-[64px] font-normal leading-[0.82] tracking-[-0.08em] text-neutral-950 sm:text-[88px] xl:text-[112px]">
              Chamber atlas.
            </h2>
          </div>

          <p className="max-w-[44rem] text-[16px] leading-[1.85] text-neutral-600 xl:justify-self-end">
            One completed proof anchors the system. The next rooms are not roadmap rows; they are prepared spatial
            coordinates for product, archive, collector, and installation work.
          </p>
        </div>

        <div className="relative min-h-[720px] overflow-hidden border-y border-neutral-950 bg-neutral-950 text-white shadow-[0_48px_160px_rgba(0,0,0,0.18)]">
          <img
            key={`${activeChamber.id}-backdrop`}
            src={activePoster}
            alt=""
            className="pointer-events-none absolute inset-[-6%] h-[112%] w-[112%] object-cover opacity-20 blur-xl saturate-[1.15] contrast-[1.08]"
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_46%_42%,rgba(255,255,255,0.1),transparent_31%),linear-gradient(90deg,rgba(5,5,4,0.94),rgba(12,12,11,0.76)_45%,rgba(5,5,4,0.94))]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:86px_86px]" />
          <div className="pointer-events-none absolute left-[5%] top-[9%] h-[82%] w-[62%] rounded-[50%] border border-white/10" />
          <div className="pointer-events-none absolute left-[20%] top-[17%] h-[62%] w-[55%] rotate-[-14deg] rounded-[50%] border border-white/12" />
          <div className="pointer-events-none absolute left-[9%] top-[50%] h-px w-[82%] rotate-[8deg] bg-gradient-to-r from-transparent via-white/18 to-transparent" />
          <div className="pointer-events-none absolute left-[48%] top-[8%] h-[84%] w-px bg-white/10" />

          <div className="absolute left-8 top-8 z-10 max-w-[30rem] md:left-12 md:top-12">
            <div className="text-[10px] uppercase tracking-[0.24em] text-white/42">Active chamber system</div>
            <div className="mt-4 text-[48px] font-normal leading-[0.84] tracking-[-0.07em] text-white md:text-[72px]">
              {activeChamber.shortTitle}
            </div>
            <p className="mt-5 max-w-[27rem] text-[14px] leading-7 text-white/58">{activeChamber.proofLine}</p>
            <button
              type="button"
              onClick={() => {
                sound.playRole("atlasOpen");
                setAtlasMode("orbit");
                setInspectedChamberId(null);
                setAtlasPlaneOffsets({});
                setAtlasOpen(true);
                window.requestAnimationFrame(resetAtlasViewport);
              }}
              className="mt-6 rounded-full border border-white bg-white px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] text-neutral-950 transition hover:-translate-y-0.5 hover:bg-white/82"
            >
              Open cinematic atlas -&gt;
            </button>
          </div>

          <motion.figure
            key={activeChamber.id}
            className="absolute left-[32%] top-[34%] h-[42%] w-[42%] overflow-hidden border border-white/20 bg-white/5 shadow-[0_42px_150px_rgba(0,0,0,0.42)]"
            style={{ clipPath: "polygon(2% 0, 100% 6%, 94% 94%, 0 100%)" }}
            initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <img src={activePoster} alt="" className="absolute inset-[-4%] h-[108%] w-[108%] object-cover saturate-[1.04] contrast-[1.04]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_34%,rgba(255,255,255,0),rgba(0,0,0,0.14)_58%,rgba(0,0,0,0.46)),linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.28))]" />

            <figcaption className="absolute bottom-6 left-6 right-6">
              <div className="inline-flex border-y border-white/38 bg-black/12 px-3 py-1.5 text-[10px] uppercase tracking-[0.17em] text-white/78 backdrop-blur-sm">
                {activeChamber.statusLabel}
              </div>
              <div className="mt-3 max-w-[12ch] text-[46px] font-normal leading-[0.84] tracking-[-0.065em] text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.45)]">
                {activeChamber.shortTitle}
              </div>
            </figcaption>
          </motion.figure>

          <div className="pointer-events-none absolute bottom-[12%] left-[12%] h-[20%] w-[19%] overflow-hidden border border-white/18 opacity-80 shadow-[0_24px_90px_rgba(0,0,0,0.28)] [clip-path:polygon(8%_0,100%_12%,88%_100%,0_92%)]">
            <img src={activeTrace} alt="" className="h-full w-full object-cover saturate-[1.04] contrast-[1.02]" />
            <div className="absolute inset-0 bg-black/16" />
          </div>

          {immersiveHubChambers.map((chamber) => {
            const active = chamberState.activeChamberId === chamber.id;
            const slot = chamberSlots[chamber.id];
            const poster = chamber.media?.poster ?? chamber.media?.stills?.[0] ?? activePoster;
            const sizeClass =
              slot.size === "large"
                ? "h-52 w-72 md:h-64 md:w-[25rem]"
                : slot.size === "medium"
                  ? "h-40 w-56 md:h-48 md:w-72"
                  : "h-32 w-48 md:h-40 md:w-60";

            return (
              <button
                key={chamber.id}
                type="button"
                onMouseEnter={() => chamberState.selectChamber(chamber.id)}
                onFocus={() => chamberState.selectChamber(chamber.id)}
                onClick={() => openChamber(chamber.id)}
                className="group absolute z-20 text-left outline-none"
                style={{
                  left: `${slot.x}%`,
                  top: `${slot.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                data-active-chamber={active ? "true" : "false"}
              >
                <span
                  className={`block transition duration-300 ${
                    active ? "scale-100 opacity-100" : "scale-95 opacity-58 group-hover:scale-100 group-hover:opacity-95"
                  }`}
                  style={{
                    transform: `rotate(${slot.rotate}deg)`,
                  }}
                >
                  <span
                    className={`relative block overflow-hidden border transition duration-300 ${sizeClass} ${
                      active
                        ? "border-white/38 bg-white/10 text-white shadow-[0_36px_130px_rgba(0,0,0,0.45)]"
                        : "border-white/16 bg-white/5 text-white group-hover:border-white/34"
                    }`}
                    style={{
                      clipPath: active ? "polygon(5% 0, 100% 8%, 93% 100%, 0 90%)" : "polygon(0 10%, 94% 0, 100% 86%, 8% 100%)",
                    }}
                  >
                    <img src={poster} alt="" className="absolute inset-[-4%] h-[108%] w-[108%] object-cover opacity-80 saturate-[1.05] contrast-[1.04] transition duration-500 group-hover:scale-[1.045]" />
                    <span className={`absolute inset-0 ${active ? "bg-black/28" : "bg-black/52 group-hover:bg-black/34"}`} />
                    <span className="absolute left-4 top-4 text-[10px] uppercase tracking-[0.18em] text-white/60">
                      {chamber.room.replace("Room ", "")}
                    </span>
                    <span className="absolute bottom-4 left-4 right-4">
                      <span className="block text-[10px] uppercase tracking-[0.16em] text-white/54">{chamber.statusLabel}</span>
                      <span className="mt-1 block max-w-[10ch] text-[26px] leading-[0.88] tracking-[-0.055em] text-white md:text-[34px]">
                        {chamber.shortTitle}
                      </span>
                    </span>
                  </span>

                  <span className={`mt-3 block border-l pl-3 transition duration-300 ${active ? "border-white/42 text-white" : "border-white/12 text-white/38 group-hover:border-white/28 group-hover:text-white/72"}`}>
                    <span className="block text-[10px] uppercase tracking-[0.18em]">{chamber.chamberSignal}</span>
                  </span>
                </span>
              </button>
            );
          })}

          <div className="hidden">
            <div className="flex flex-wrap gap-2">
              {activeChamber.tags.slice(0, 5).map((tag) => (
                <span key={tag} className="border-y border-white/16 px-2.5 py-1 text-[9px] uppercase tracking-[0.13em] text-white/52">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-5 text-[10px] uppercase tracking-[0.22em] text-white/36">Engine signal</div>
            <div className="mt-3 grid gap-2">
              {activeEngines.map((engine) => (
                <div key={engine.id} className="grid grid-cols-[1fr_auto] gap-4 border-t border-white/12 py-2">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-white/52">{engine.title}</span>
                  <span className="text-[9px] uppercase tracking-[0.14em] text-white/34">{engine.signal}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => openChamber(activeChamber.id)}
              className="mt-5 rounded-full border border-white bg-white px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] text-neutral-950 transition hover:-translate-y-0.5 hover:bg-white/82 md:mt-0"
            >
              {activeChamber.ctaLabel ?? "View chamber"} →
            </button>
          </div>
        </div>
      </div>

      {createPortal((
        <AnimatePresence>
          {atlasOpen && (
            <motion.div
              ref={atlasShellRef}
              className={`fixed inset-0 z-[999] bg-[#050504] text-white ${
                atlasMode === "assemble" ? "overflow-y-auto overflow-x-hidden" : "cursor-grab overflow-hidden active:cursor-grabbing"
              }`}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.018, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.99, filter: "blur(4px)" }}
              transition={{ duration: 0.62, ease }}
              role="dialog"
              aria-modal="true"
              aria-label="Cinematic chamber atlas"
              onWheel={handleAtlasWheel}
              onPointerDown={handleAtlasPointerDown}
              onPointerUp={handleAtlasPointerUp}
              onPointerCancel={() => {
                dragStartRef.current = null;
              }}
            >
          <img
            key={`${activeChamber.id}-inspect-backdrop`}
            src={activePoster}
            alt=""
            className="pointer-events-none absolute inset-[-8%] h-[116%] w-[116%] object-cover opacity-30 blur-md saturate-[1.18] contrast-[1.06] brightness-[1.08]"
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_42%,rgba(255,255,255,0.18),transparent_30%),linear-gradient(90deg,rgba(4,4,4,0.9),rgba(12,12,10,0.58)_48%,rgba(4,4,4,0.9))]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.09] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:94px_94px]" />
          <div className="pointer-events-none absolute left-[8vw] top-[14vh] h-[76vh] w-[62vw] rounded-[50%] border border-white/12" />
          <div className="pointer-events-none absolute left-[24vw] top-[23vh] h-[54vh] w-[44vw] rotate-[-14deg] rounded-[50%] border border-white/14" />
          <div className="pointer-events-none absolute left-[6vw] top-[54vh] h-px w-[88vw] rotate-[8deg] bg-gradient-to-r from-transparent via-white/18 to-transparent" />
          <AnimatePresence mode="wait">
            <motion.div
              key={`${atlasMode}-mode-signal`}
              className="pointer-events-none fixed inset-0 z-[2]"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.16, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(255,255,255,0.22),transparent_34%)]" />
              <div className="absolute left-1/2 top-1/2 h-px w-[42vw] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/42 to-transparent" />
              <div className="absolute left-1/2 top-[52%] -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.24em] text-white/48">
                {modeTransitionLabel}
              </div>
            </motion.div>
          </AnimatePresence>

          <div
            className={`relative z-10 p-5 sm:p-7 lg:p-9 ${
              atlasMode === "assemble" ? "min-h-full pb-24" : "grid h-full grid-rows-[auto_1fr_auto]"
            }`}
          >
            <header className="flex items-start justify-between gap-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-white/42">Cinematic inspect atlas</div>
                <h3 className="mt-3 text-[52px] font-normal leading-[0.82] tracking-[-0.075em] text-white sm:text-[74px] lg:text-[96px]">
                  {inspectedChamber?.shortTitle ?? "Chamber atlas"}
                </h3>
                <TerminalAtlasSignal inspectedChamber={inspectedChamber} mode={atlasMode} />
              </div>

              <div className="relative z-50 flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setInspectedChamberId(null);
                    setAtlasMode((current) => {
                      if (current === "orbit") return "assemble";
                      resetAtlasViewport();
                      return "orbit";
                    });
                  }}
                  onPointerDown={(event) => event.stopPropagation()}
                  data-atlas-control="true"
                  className="border-y border-white/22 bg-white/8 px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] text-white/70 transition hover:border-white/50 hover:bg-white hover:text-neutral-950"
                >
                  {atlasMode === "orbit" ? "Assemble" : "Orbit"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playRole("close");
                    setAtlasOpen(false);
                  }}
                  onPointerDown={(event) => event.stopPropagation()}
                  data-atlas-control="true"
                  className="border-y border-white/22 bg-white/8 px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] text-white/70 transition hover:border-white/50 hover:bg-white hover:text-neutral-950"
                >
                  Close
                </button>
              </div>
            </header>

            <AnimatePresence mode="wait" initial={false}>
              {atlasMode === "orbit" ? (
            <motion.div
              key="atlas-orbit"
              ref={atlasFieldRef}
              className="relative min-h-0 overflow-visible"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -42, scale: 0.965, filter: "blur(5px)" }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 42, scale: 1.035, filter: "blur(5px)" }}
              transition={{ duration: 0.72, ease }}
            >
              {activeMemoryTraces.map((trace, index) => {
                const traceSlots = [
                  "left-[43%] top-[13%] h-[15%] w-[18%]",
                  "left-[63%] top-[55%] h-[17%] w-[19%]",
                  "left-[25%] top-[54%] h-[16%] w-[18%]",
                ];

                return (
                  <motion.div
                    key={`${activeChamber.id}-memory-${trace}-${index}`}
                    className={`pointer-events-none absolute z-10 overflow-hidden border border-white/18 bg-white/6 shadow-[0_28px_120px_rgba(0,0,0,0.42)] ${traceSlots[index] ?? traceSlots[0]}`}
                    style={{
                      clipPath: index % 2 === 0 ? "polygon(7% 0, 100% 9%, 91% 100%, 0 88%)" : "polygon(0 12%, 96% 0, 100% 86%, 8% 100%)",
                    }}
                    initial={reduceMotion ? undefined : { opacity: 0, scale: 0.9, y: 14, filter: "blur(2px)" }}
                    animate={
                      reduceMotion
                        ? undefined
                        : {
                            opacity: [0.3, 0.52, 0.3],
                            scale: [0.96, 1.01, 0.96],
                            y: [0, index % 2 === 0 ? -10 : 10, 0],
                            rotate: [index === 0 ? -4 : index === 1 ? 5 : -7, index === 0 ? -2 : index === 1 ? 7 : -5, index === 0 ? -4 : index === 1 ? 5 : -7],
                            filter: "blur(0px)",
                          }
                    }
                    transition={{ duration: 7 + index * 1.2, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
                  >
                    <img src={trace} alt="" className="h-full w-full object-cover opacity-100 saturate-[1.12] contrast-[1.05] brightness-[1.08]" />
                    <div className="absolute inset-0 bg-black/16" />
                  </motion.div>
                );
              })}

              {immersiveHubChambers.map((chamber, index) => {
                const slot = inspectSlots[chamber.id];
                const poster = chamber.media?.poster ?? chamber.media?.stills?.[0] ?? activePoster;
                const trace = chamber.media?.stills?.[0] ?? poster;
                const planeOffset = atlasPlaneOffsets[chamber.id] ?? { x: 0, y: 0 };
                const selected = inspectedChamberId === chamber.id;
                const floatDistance = index % 2 === 0 ? -9 : 9;
                const sizeClass =
                  selected
                    ? "h-[42vh] w-[48vw]"
                    : slot.size === "large"
                      ? "h-52 w-72 lg:h-64 lg:w-[31rem]"
                      : slot.size === "medium"
                        ? "h-44 w-64 lg:h-52 lg:w-[25rem]"
                        : "h-36 w-56 lg:h-44 lg:w-[21rem]";

                return (
                  <motion.button
                    key={chamber.id}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();

                      if (suppressPlaneClickRef.current) {
                        suppressPlaneClickRef.current = false;
                        return;
                      }

                      inspectAtlasChamber(chamber.id);
                    }}
                    onDoubleClick={(event) => {
                      event.stopPropagation();
                      openChamber(chamber.id);
                    }}
                    onFocus={() => inspectAtlasChamber(chamber.id)}
                    onPointerDown={(event) => event.stopPropagation()}
                    data-atlas-control="true"
                    className={`group absolute text-left outline-none ${selected ? "z-40 cursor-grab" : "z-20 cursor-grab"}`}
                    style={{
                      left: selected ? "50%" : `${slot.x}%`,
                      top: selected ? "47%" : `${slot.y}%`,
                      translateX: "-50%",
                      translateY: "-50%",
                    }}
                    initial={reduceMotion ? undefined : { opacity: 0, scale: 0.9, x: planeOffset.x, y: planeOffset.y + 18, rotate: slot.rotate - 2 }}
                    animate={
                      reduceMotion
                        ? undefined
                        : {
                            opacity: selected ? 1 : [0.74, 0.93, 0.74],
                            scale: selected ? 1 : [0.96, 1.01, 0.96],
                            x: planeOffset.x,
                            y: selected ? planeOffset.y : [planeOffset.y, planeOffset.y + floatDistance, planeOffset.y],
                            rotate: selected ? 0 : [slot.rotate, slot.rotate + (index % 2 === 0 ? 1.2 : -1.2), slot.rotate],
                          }
                    }
                    whileHover={reduceMotion ? undefined : { opacity: 1, scale: 1.06, zIndex: 45, y: -8, rotate: 0 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    drag
                    dragConstraints={{ left: -240, right: 240, top: -160, bottom: 220 }}
                    dragElastic={0.06}
                    dragMomentum={false}
                    onDragEnd={(event, info) => handleAtlasPlaneDragEnd(event, info, chamber.id)}
                    transition={
                      selected
                        ? { duration: 0.92, ease }
                        : { duration: 6.2 + index * 0.7, repeat: Infinity, ease: "easeInOut", delay: index * 0.12 }
                    }
                  >
                    <span
                      className={`relative block overflow-hidden border bg-white/8 transition duration-500 group-hover:border-white/50 ${
                        selected
                          ? "border-white/34 shadow-[0_64px_190px_rgba(0,0,0,0.62)]"
                          : "border-white/22 shadow-[0_34px_140px_rgba(0,0,0,0.46)]"
                      } ${sizeClass}`}
                      style={{ clipPath: selected ? "polygon(2% 0, 100% 5%, 94% 94%, 0 100%)" : index % 2 === 0 ? "polygon(4% 0, 100% 7%, 94% 100%, 0 90%)" : "polygon(0 10%, 94% 0, 100% 86%, 8% 100%)" }}
                    >
                      <img src={poster} alt="" className={`absolute inset-[-4%] h-[108%] w-[108%] object-cover opacity-100 saturate-[1.08] contrast-[1.03] brightness-[1.04] transition duration-700 group-hover:scale-[1.055] group-hover:brightness-[1.07] ${selected ? "scale-[1.015]" : ""}`} />
                      <span className={`absolute inset-0 transition duration-500 ${selected ? "bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.22)_70%,rgba(0,0,0,0.44))]" : "bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.22)_72%,rgba(0,0,0,0.42))] group-hover:bg-black/10"}`} />
                      <span className={`absolute right-4 top-4 overflow-hidden border border-white/22 opacity-68 [clip-path:polygon(6%_0,100%_10%,88%_100%,0_86%)] ${selected ? "h-[18%] w-[22%]" : "h-[22%] w-[28%]"}`}>
                        <img src={trace} alt="" className="h-full w-full object-cover saturate-[1.1] brightness-[1.1]" />
                      </span>
                      <span className="absolute left-4 top-4 text-[10px] uppercase tracking-[0.18em] text-white/58">
                        {chamber.room.replace("Room ", "")}
                      </span>
                      <span className="absolute bottom-4 left-4 right-4">
                        <span className="block text-[10px] uppercase tracking-[0.16em] text-white/54">{chamber.statusLabel}</span>
                        <span className={`mt-2 block max-w-[11ch] leading-[0.88] tracking-[-0.055em] text-white ${selected ? "text-[40px] lg:text-[64px]" : "text-[28px] lg:text-[38px]"}`}>
                          {chamber.shortTitle}
                        </span>
                      </span>
                    </span>
                    {selected && (
                      <motion.span
                        key={`${chamber.id}-inspect-signal`}
                        className="pointer-events-none mt-4 block max-w-[42rem] border-l border-white/20 pl-4 font-mono"
                        initial={{ opacity: 0, y: 14, clipPath: "inset(0 100% 0 0)" }}
                        animate={{ opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" }}
                        transition={{ duration: 0.78, delay: 0.38, ease }}
                      >
                        <span className="block text-[9px] uppercase tracking-[0.2em] text-white/30">Inspect signal</span>
                        <span className="mt-2 block max-w-[34rem] text-[14px] normal-case leading-7 tracking-normal text-white/70">
                          {chamber.proofLine}
                        </span>
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}

              <AnimatePresence>
                  {inspectedChamber ? (
                    <motion.div
                      key={`${inspectedChamber.id}-terminal-focus`}
                    className="absolute bottom-6 left-1/2 z-50 w-[min(25rem,calc(100%-2rem))] -translate-x-1/2 border-y border-white/18 bg-black/38 px-3 py-3 font-mono backdrop-blur-md lg:left-[61%] lg:-translate-x-0 xl:left-[58%]"
                    initial={{ opacity: 0, y: 22, clipPath: "inset(0 100% 0 0)" }}
                    animate={{ opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" }}
                    exit={{ opacity: 0, y: 16, clipPath: "inset(0 100% 0 0)" }}
                    transition={{ duration: 0.76, ease }}
                    data-atlas-control="true"
                    onPointerDown={(event) => event.stopPropagation()}
                    onPointerUp={(event) => event.stopPropagation()}
                  >
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => openChamber(inspectedChamber.id)}
                        className="rounded-full border border-white bg-white px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-neutral-950 transition hover:-translate-y-0.5 hover:bg-white/82"
                      >
                        Enter chamber -&gt;
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          sound.playRole("close");
                          setInspectedChamberId(null);
                        }}
                        className="border-y border-white/18 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white/54 transition hover:border-white/48 hover:text-white"
                      >
                        Release
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <aside className="absolute right-0 top-[8%] z-50 hidden w-[23rem] border-l border-white/14 pl-5 xl:block">
                <motion.div
                  className="text-[10px] uppercase tracking-[0.22em] text-white/36"
                  initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
                  animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.22, ease }}
                >
                  Chamber route / wheel + drag
                </motion.div>

                <div className="mt-5 grid">
                  {immersiveHubChambers.map((chamber, index) => {
                    const selected = inspectedChamberId === chamber.id;

                    return (
                      <motion.button
                        key={chamber.id}
                        type="button"
                        onClick={() => inspectAtlasChamber(chamber.id)}
                        onPointerDown={(event) => event.stopPropagation()}
                        onPointerUp={(event) => event.stopPropagation()}
                        data-atlas-control="true"
                        className={`group relative grid grid-cols-[3.2rem_1fr_auto] items-center gap-3 border-t py-4 text-left transition ${
                          selected ? "border-white/46 text-white" : "border-white/12 text-white/32 hover:text-white/76"
                        }`}
                        initial={{ opacity: 0, x: 18, clipPath: "inset(0 100% 0 0)" }}
                        animate={{ opacity: 1, x: 0, clipPath: "inset(0 0% 0 0)" }}
                        transition={{ duration: 0.62, delay: 0.28 + index * 0.055, ease }}
                      >
                        <span className={`h-px w-8 transition ${selected ? "bg-white" : "bg-white/18 group-hover:bg-white/46"}`} />
                        <span>
                          <span className="block text-[9px] uppercase tracking-[0.16em] text-white/34">
                            {chamber.room}
                          </span>
                          <span className="mt-1 block text-[12px] uppercase tracking-[0.15em]">{chamber.shortTitle}</span>
                        </span>
                        <span className={`h-2 w-2 border transition ${selected ? "border-white bg-white" : "border-white/18 group-hover:border-white/46"}`} />
                      </motion.button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setInspectedChamberId(null);
                    setAtlasMode("assemble");
                  }}
                  onPointerDown={(event) => event.stopPropagation()}
                  data-atlas-control="true"
                  className="mt-7 w-full border-y border-white/28 px-3 py-3 text-left text-[10px] uppercase tracking-[0.16em] text-white/64 transition hover:border-white hover:text-white"
                >
                  Assemble field -&gt;
                </button>
              </aside>
            </motion.div>
            ) : (
              <motion.section
                key="atlas-assembly"
                className="mx-auto mt-16 w-[min(94vw,1680px)] pb-28"
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 90, scale: 0.98, filter: "blur(6px)" }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -72, scale: 0.975, filter: "blur(6px)" }}
                transition={{ duration: 0.78, ease }}
              >
                <div className="grid gap-10 xl:grid-cols-[0.32fr_0.68fr]">
                  <div className="xl:sticky xl:top-10 xl:self-start">
                    <div className="text-[10px] uppercase tracking-[0.24em] text-white/34">Assembly mode</div>
                    <h4 className="mt-5 max-w-[8ch] text-[54px] font-normal leading-[0.84] tracking-[-0.075em] text-white md:text-[76px]">
                      Constructed inspection field.
                    </h4>
                    <p className="mt-6 max-w-[30rem] text-[14px] leading-7 text-white/54">
                      The spatial atlas resolves into a scrollable proof system: each chamber becomes media, role,
                      signal, engine, and possible application path.
                    </p>
                    <button
                      type="button"
                      onClick={returnAtlasToOrbit}
                      data-atlas-control="true"
                      className="mt-8 border-y border-white/28 px-3 py-3 text-[10px] uppercase tracking-[0.16em] text-white/68 transition hover:border-white hover:text-white"
                    >
                      Return to orbit -&gt;
                    </button>
                  </div>

                  <div className="grid gap-8 lg:grid-cols-2">
                    {immersiveHubChambers.map((chamber, index) => {
                      const poster = chamber.media?.poster ?? chamber.media?.stills?.[0] ?? activePoster;
                      const trace = chamber.media?.stills?.[0] ?? poster;
                      const engines = getChamberEngines(chamber.id).slice(0, 3);
                      const featured = index === 0 || index === 3;

                      return (
                        <motion.article
                          key={`${chamber.id}-assembly`}
                          className={`group relative overflow-hidden border-y border-white/18 bg-white/[0.035] p-4 text-left shadow-[0_34px_130px_rgba(0,0,0,0.32)] ${
                            featured ? "lg:col-span-2" : ""
                          }`}
                          initial={reduceMotion ? undefined : { opacity: 0, y: 64, rotate: index % 2 === 0 ? -2 : 2 }}
                          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, rotate: 0 }}
                          viewport={{ once: false, amount: 0.28 }}
                          transition={{ duration: 0.78, delay: index * 0.045, ease }}
                        >
                          <div className={`grid gap-5 ${featured ? "lg:grid-cols-[0.58fr_0.42fr]" : ""}`}>
                            <button
                              type="button"
                              onMouseEnter={() => sound.playRole("hover")}
                              onClick={() => {
                                sound.playRole("select");
                                returnAtlasToOrbit();
                                inspectAtlasChamber(chamber.id);
                              }}
                              data-atlas-control="true"
                              className={`relative min-h-[22rem] overflow-hidden border border-white/18 text-left transition duration-500 group-hover:border-white/42 ${
                                featured ? "lg:min-h-[34rem]" : ""
                              }`}
                              style={{
                                clipPath:
                                  index % 2 === 0
                                    ? "polygon(3% 0, 100% 5%, 94% 96%, 0 100%)"
                                    : "polygon(0 7%, 96% 0, 100% 92%, 5% 100%)",
                              }}
                            >
                              <img
                                src={poster}
                                alt=""
                                className="absolute inset-[-3%] h-[106%] w-[106%] object-cover saturate-[1.08] contrast-[1.03] brightness-[1.04] transition duration-700 group-hover:scale-[1.045] group-hover:brightness-[1.07]"
                              />
                              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.25)_66%,rgba(0,0,0,0.58))]" />
                              <div className="absolute right-5 top-5 h-[22%] w-[24%] overflow-hidden border border-white/20 opacity-70 [clip-path:polygon(8%_0,100%_10%,88%_100%,0_88%)]">
                                <img src={trace} alt="" className="h-full w-full object-cover saturate-[1.12] brightness-[1.1]" />
                              </div>
                              <div className="absolute bottom-5 left-5 right-5">
                                <div className="text-[10px] uppercase tracking-[0.18em] text-white/54">{chamber.room}</div>
                                <div className="mt-2 max-w-[10ch] text-[44px] font-normal leading-[0.86] tracking-[-0.065em] text-white md:text-[58px]">
                                  {chamber.shortTitle}
                                </div>
                              </div>
                            </button>

                            <div className="flex min-h-full flex-col justify-between border-l border-white/12 pl-5">
                              <div>
                                <div className="text-[10px] uppercase tracking-[0.22em] text-white/32">
                                  {chamber.statusLabel}
                                </div>
                                <p className="mt-5 max-w-[34rem] text-[16px] leading-8 text-white/68">{chamber.proofLine}</p>
                                <p className="mt-5 max-w-[34rem] text-[13px] leading-7 text-white/46">{chamber.summary}</p>
                              </div>

                              <div className="mt-8 grid gap-5">
                                <div className="flex flex-wrap gap-2">
                                  {chamber.tags.slice(0, 4).map((tag) => (
                                    <span key={tag} className="border-y border-white/16 px-2.5 py-1 text-[9px] uppercase tracking-[0.13em] text-white/48">
                                      {tag}
                                    </span>
                                  ))}
                                </div>

                                <div>
                                  <div className="text-[9px] uppercase tracking-[0.2em] text-white/28">Engine binding</div>
                                  <div className="mt-3 grid gap-2">
                                    {engines.map((engine) => (
                                      <div key={engine.id} className="grid grid-cols-[1fr_auto] gap-4 border-t border-white/12 py-2">
                                        <span className="text-[10px] uppercase tracking-[0.14em] text-white/52">{engine.title}</span>
                                        <span className="text-[9px] uppercase tracking-[0.14em] text-white/34">{engine.signal}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (chamber.route) {
                                      openChamber(chamber.id);
                                      return;
                                    }

                                    sound.playRole("select");
                                    returnAtlasToOrbit();
                                    inspectAtlasChamber(chamber.id);
                                  }}
                                  data-atlas-control="true"
                                  className="justify-self-start border-y border-white/28 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white/68 transition hover:border-white hover:text-white"
                                >
                                  {chamber.ctaLabel ?? "Inspect chamber"} -&gt;
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                </div>
              </motion.section>
            )}
            </AnimatePresence>

            <footer className="relative z-40 grid gap-4 border-t border-white/10 pt-4 md:grid-cols-[0.3fr_minmax(18rem,0.38fr)_auto] md:items-end">
              <div>
                <motion.div
                  className="mb-2 text-[9px] uppercase tracking-[0.2em] text-white/28"
                  initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
                  animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.38, ease }}
                >
                  Chamber signals
                </motion.div>
                <div className="flex flex-wrap gap-2">
                  {atlasSignalChamber.tags.slice(0, 5).map((tag) => (
                    <span key={tag} className="border-y border-white/16 px-2.5 py-1 text-[9px] uppercase tracking-[0.13em] text-white/52">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <motion.div
                  className="text-[9px] uppercase tracking-[0.2em] text-white/28"
                  initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
                  animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.45, ease }}
                >
                  Engine signal
                </motion.div>
                {atlasEngines.map((engine) => (
                  <motion.div
                    key={engine.id}
                    className="grid grid-cols-[1fr_auto] gap-4 border-t border-white/12 py-2"
                    initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
                    animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
                    transition={{ duration: 0.6, delay: 0.5, ease }}
                  >
                    <span className="text-[10px] uppercase tracking-[0.14em] text-white/52">{engine.title}</span>
                    <span className="text-[9px] uppercase tracking-[0.14em] text-white/34">{engine.signal}</span>
                  </motion.div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (inspectedChamber) {
                    openChamber(inspectedChamber.id);
                    return;
                  }

                  sound.playRole("select");
                  inspectAtlasChamber(chamberState.activeChamberId);
                }}
                onPointerDown={(event) => event.stopPropagation()}
                onPointerUp={(event) => event.stopPropagation()}
                data-atlas-control="true"
                className="justify-self-start border-y border-white/32 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white/72 transition hover:border-white hover:text-white md:justify-self-end"
              >
                {inspectedChamber ? inspectedChamber.ctaLabel ?? "View chamber" : "Select chamber"} -&gt;
              </button>
            </footer>
          </div>
            </motion.div>
          )}
        </AnimatePresence>
      ), document.body)}
    </Chapter>
  );
}

function CompletedProofScene({ onOpenWhisper }: { onOpenWhisper: () => void }) {
  const sound = useSound();
  const [activeProofIndex, setActiveProofIndex] = useState(0);
  const [proofPhase, setProofPhase] = useState(0);
  const [proofExitBlend, setProofExitBlend] = useState(0);
  const proofRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const activeProof = whisperProofStates[activeProofIndex] ?? whisperProofStates[0];
  const reduceMotion = useReducedMotion();
  const proofCount = whisperProofStates.length;

  const selectProofIndex = (index: number) => {
    const nextIndex = (index + proofCount) % proofCount;
    if (nextIndex !== activeProofIndex) sound.playRole("transition");
    setActiveProofIndex(nextIndex);
    setProofPhase(nextIndex);
  };

  useEffect(() => {
    const updateActiveProof = () => {
      const node = proofRef.current;
      if (!node) return;

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const rect = node.getBoundingClientRect();
      const progressStart = viewportHeight * 0.05;
      const progressEnd = -viewportHeight * 0.52;
      const progress = Math.min(1, Math.max(0, (progressStart - rect.top) / Math.max(progressStart - progressEnd, 1)));
      const nextPhase = progress * (whisperProofStates.length - 1);
      const nextIndex = Math.min(whisperProofStates.length - 1, Math.round(nextPhase));
      const exitStart = Math.min(viewportHeight * 0.34, 380);
      const exitEnd = Math.min(viewportHeight * 0.22, 250);
      const exitRaw = Math.min(1, Math.max(0, (exitStart - rect.bottom) / Math.max(exitStart - exitEnd, 1)));
      const nextExitBlend = exitRaw * exitRaw * (3 - 2 * exitRaw);

      setProofPhase(nextPhase);
      setActiveProofIndex(nextIndex);
      setProofExitBlend(nextExitBlend);
    };

    updateActiveProof();
    window.addEventListener("scroll", updateActiveProof, { passive: true });
    window.addEventListener("resize", updateActiveProof);

    return () => {
      window.removeEventListener("scroll", updateActiveProof);
      window.removeEventListener("resize", updateActiveProof);
    };
  }, []);

  const handleProofPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragRef.current = { x: event.clientX, y: event.clientY };
  };

  const handleProofPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = dragRef.current;
    dragRef.current = null;
    if (!start) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < 54 || Math.abs(deltaX) < Math.abs(deltaY)) return;

    selectProofIndex(activeProofIndex + (deltaX < 0 ? 1 : -1));
  };

  const relayProgress = proofCount > 1 ? Math.min(100, Math.max(0, (proofPhase / (proofCount - 1)) * 100)) : 0;

  return (
    <Chapter id="proof" className="relative px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div ref={proofRef} className="relative mx-auto min-h-[calc(100vh-3.75rem)] w-[min(94vw,1680px)]">
        <div
          className="sticky top-[4.75rem] min-h-[calc(100vh-6rem)] overflow-hidden border-y border-neutral-950/[0.085] bg-zinc-50/[0.12] text-neutral-950 backdrop-blur-[1px]"
          style={{ opacity: 1 - proofExitBlend, pointerEvents: proofExitBlend > 0.82 ? "none" : undefined }}
          onPointerDown={handleProofPointerDown}
          onPointerUp={handleProofPointerUp}
          onPointerCancel={() => {
            dragRef.current = null;
          }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-[0.3] [background-image:linear-gradient(to_right,rgba(10,10,10,0.058)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,10,10,0.046)_1px,transparent_1px)] [background-size:92px_92px]" />
          <div className="pointer-events-none absolute left-[18%] top-[9%] h-[72%] w-[62%] rounded-[50%] border border-neutral-950/7" />
          <div className="pointer-events-none absolute left-[44%] top-[18%] h-[48%] w-[34%] rotate-[-12deg] rounded-[50%] border border-neutral-950/8" />
          <div className="pointer-events-none absolute left-[6%] top-[55%] h-px w-[88%] rotate-[-8deg] bg-gradient-to-r from-transparent via-neutral-950/12 to-transparent" />

          <div className="relative z-10 min-h-[calc(100vh-6rem)] p-6 sm:p-8 lg:p-12 xl:p-14">
            <div className="pointer-events-none absolute inset-x-[4%] top-[14%] h-px bg-gradient-to-r from-transparent via-neutral-950/14 to-transparent" />
            <div className="pointer-events-none absolute inset-x-[4%] bottom-[14%] h-px bg-gradient-to-r from-transparent via-neutral-950/12 to-transparent" />

            <div className="relative z-30 grid min-h-[calc(100vh-13rem)] items-center gap-9 xl:grid-cols-[minmax(20rem,0.36fr)_minmax(0,0.64fr)] xl:gap-12 2xl:gap-14">
              <div className="max-w-[36rem]">
                <div className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Completed proof / WHISPER</div>
                <KineticTitle
                  text="The first completed spatial proof."
                  className="mt-6 max-w-[8.5ch] text-[54px] font-normal leading-[0.84] tracking-normal text-neutral-950 sm:text-[82px] xl:text-[102px]"
                />
                <p className="mt-8 max-w-[34rem] text-[15px] leading-7 text-neutral-600">
                  WHISPER proves that one photographic archive can move across web, mobile, print, AR, and room-scale
                  presence without losing atmosphere.
                </p>

                <div className="mt-8 max-w-[34rem]">
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">Proof formula</div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[12px] uppercase tracking-[0.16em] text-neutral-950 sm:text-[13px]">
                    <span>ONE ARCHIVE</span>
                    <span aria-hidden="true" className="text-neutral-400">
                      →
                    </span>
                    <span>FIVE SURFACES</span>
                  </div>
                  <div className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 sm:text-[10px]">
                    WEB → MOBILE → PRINT → AR → ROOM
                  </div>
                </div>

                <button
                  type="button"
                  onMouseEnter={() => sound.playRole("hover")}
                  onClick={() => {
                    sound.playRole("open");
                    onOpenWhisper();
                  }}
                  className="mt-8 hidden border-y border-neutral-950/30 px-3 py-2.5 text-[10px] uppercase tracking-[0.16em] text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950/60 xl:inline-flex"
                >
                  Enter Whisper
                </button>
              </div>

              <div className="relative z-20 w-full">
                <SurfaceProofStage
                  proof={activeProof}
                  reduceMotion={reduceMotion}
                  onNext={() => selectProofIndex(activeProofIndex + 1)}
                />

                <div className="mt-5 border-y border-neutral-950/10 py-4">
                  <div className="flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.18em] text-neutral-500 sm:text-[9px]">
                    <span>One archive</span>
                    <span className="relative h-px flex-1 bg-neutral-950/12">
                      <motion.span
                        className="absolute inset-y-0 left-0 bg-neutral-950"
                        initial={false}
                        animate={{ width: `${relayProgress}%` }}
                        transition={{ duration: reduceMotion ? 0 : 0.42, ease }}
                      />
                    </span>
                    <span>Five surfaces</span>
                  </div>

                  <div className="mt-4 grid grid-cols-5 gap-0 font-mono text-[8px] uppercase tracking-[0.12em] text-neutral-500 sm:text-[9px]">
                    {whisperProofStates.map((proof, index) => {
                      const active = activeProof.id === proof.id;
                      return (
                        <button
                          key={proof.id}
                          type="button"
                          aria-pressed={active}
                          onMouseEnter={() => sound.playRole("hover")}
                          onFocus={() => selectProofIndex(index)}
                          onClick={() => selectProofIndex(index)}
                          className={`group min-w-0 px-1 py-1.5 text-left transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950/60 sm:px-2 ${
                            active ? "text-neutral-950" : "text-neutral-400 hover:text-neutral-700"
                          }`}
                        >
                          <span className="flex items-center gap-1 sm:gap-2">
                            <span
                              className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[8px] transition ${
                                active
                                  ? "border-neutral-950 bg-neutral-950 text-white"
                                  : "border-neutral-950/18 bg-white/30 text-neutral-400 group-hover:border-neutral-950/32"
                              }`}
                            >
                              {proof.index}
                            </span>
                            <span className="min-w-0 truncate">{proof.railLabel}</span>
                          </span>
                          <span
                            className={`mt-2 block h-px w-full transition ${
                              active ? "bg-neutral-950" : "bg-neutral-950/12 group-hover:bg-neutral-950/24"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeProof.id}
                      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease }}
                    >
                      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
                        Surface {activeProof.index} / {activeProof.signal}
                      </div>
                      <h3 className="mt-2 text-[25px] leading-none tracking-normal text-neutral-950 sm:text-[32px]">{activeProof.label}</h3>
                      <p className="mt-3 max-w-[52rem] text-[14px] leading-7 text-neutral-600">{activeProof.readout}</p>
                    </motion.div>
                  </AnimatePresence>

                  <button
                    type="button"
                    onMouseEnter={() => sound.playRole("hover")}
                    onClick={() => {
                      sound.playRole("open");
                      onOpenWhisper();
                    }}
                    className="w-max border-y border-neutral-950/30 px-3 py-2.5 text-[10px] uppercase tracking-[0.16em] text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950/60 xl:hidden"
                  >
                    Enter Whisper
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Chapter>
  );
}

function EngineStackScene() {
  const prefersReducedMotion = useReducedMotion();
  const sound = useSound();
  const [activeEngineIndex, setActiveEngineIndex] = useState<number | null>(null);
  const activeSignalTop =
    activeEngineIndex == null ? "8%" : `${((activeEngineIndex + 0.5) / immersiveEngineStack.length) * 100}%`;
  const focusEngine = (index: number, feedback: "hover" | "select" = "hover") => {
    if (feedback === "select" || activeEngineIndex !== index) sound.playRole(feedback);
    setActiveEngineIndex(index);
  };

  return (
    <Chapter id="engines" className="relative z-20 px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pt-24">
      <div
        data-header-scene={immersiveHeaderScenes.engines}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-44 z-0 h-44"
      />
      <div className="relative z-10 mx-auto grid w-[min(92vw,1600px)] items-start gap-14 xl:grid-cols-[0.44fr_0.56fr]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Interface engines</div>
          <KineticTitle
            text="Systems beneath the spatial surface."
            className="mt-6 max-w-[10ch] text-[58px] font-normal leading-[0.86] tracking-normal text-neutral-950 sm:text-[88px] xl:text-[112px]"
          />
          <p className="mt-8 max-w-[36rem] text-[16px] leading-[1.85] text-neutral-600">
            The immersive direction is built from reusable engines: atmosphere, reveal, inspection, orbit, presence,
            and collector continuation.
          </p>
        </div>

        <div
          className="relative overflow-hidden border-y border-neutral-950/12 py-2"
          onPointerLeave={() => setActiveEngineIndex(null)}
        >
          <div className="pointer-events-none absolute left-[9%] top-0 h-full w-px bg-neutral-950/10" />
          <div className="pointer-events-none absolute left-[12%] top-[8%] h-[78%] w-[70%] rounded-[48%] border border-neutral-950/7" />
          <motion.div
            className="pointer-events-none absolute left-[6%] h-px w-[84%] origin-left bg-gradient-to-r from-neutral-950/38 via-neutral-950/14 to-transparent"
            animate={{
              opacity: activeEngineIndex == null ? 0 : 1,
              top: activeSignalTop,
              scaleX: activeEngineIndex == null ? 0.28 : 1,
            }}
            transition={{ duration: 0.34, ease }}
          />
          <motion.div
            className="pointer-events-none absolute left-[9%] h-7 w-7 rounded-full border border-neutral-950/18 bg-white/70 backdrop-blur-md"
            animate={{
              opacity: activeEngineIndex == null ? 0 : 1,
              top: `calc(${activeSignalTop} - 0.875rem)`,
              scale: activeEngineIndex == null ? 0.65 : 1,
            }}
            transition={{ duration: 0.34, ease }}
          />

          {immersiveEngineStack.map((engine, index) => {
            const active = activeEngineIndex === index;

            return (
              <motion.article
                key={engine.id}
                tabIndex={0}
                aria-expanded={active}
                className="group relative min-h-[8rem] border-b border-neutral-950/12 px-2 py-4 outline-none transition last:border-b-0 hover:bg-white/[0.16] focus-visible:bg-white/[0.22] md:min-h-[5.75rem] md:px-0 md:py-3"
                onPointerEnter={() => focusEngine(index)}
                onFocus={() => focusEngine(index)}
                onClick={() => focusEngine(index, "select")}
                initial={{ opacity: 0, x: 26 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.22 }}
                transition={{ duration: 0.64, delay: index * 0.035, ease }}
              >
                <motion.div
                  className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-start gap-4 md:grid-cols-[5rem_minmax(0,1fr)_8rem] md:gap-5"
                  animate={{
                    x: active && !prefersReducedMotion ? 10 : 0,
                  }}
                  transition={{ duration: 0.42, ease }}
                >
                  <motion.span
                    className="pt-1 text-[11px] uppercase tracking-[0.2em] text-neutral-300"
                    animate={{ color: active ? "rgba(10,10,10,0.72)" : "rgba(10,10,10,0.22)" }}
                    transition={{ duration: 0.32, ease }}
                  >
                    0{index + 1}
                  </motion.span>

                  <div className="min-w-0">
                    <motion.h3
                      className="block text-[28px] leading-none tracking-normal text-neutral-950 md:text-[40px]"
                      animate={{
                        color: active ? "rgba(10,10,10,1)" : "rgba(10,10,10,0.9)",
                        x: active && !prefersReducedMotion ? 6 : 0,
                      }}
                      transition={{ duration: 0.38, ease }}
                    >
                      {engine.title}
                    </motion.h3>

                    <motion.p
                      className="pointer-events-none mt-2 h-12 max-w-[42rem] overflow-hidden text-[12px] leading-6 text-neutral-500 md:h-6 md:pr-6"
                      aria-hidden={!active}
                      initial={false}
                      animate={{
                        opacity: active ? 1 : 0,
                        y: active || prefersReducedMotion ? 0 : -5,
                      }}
                      transition={{ duration: 0.34, ease }}
                    >
                      {engine.summary}
                    </motion.p>
                  </div>

                  <motion.span
                    className="hidden rounded-full border border-neutral-950/12 bg-white/34 px-3 py-1.5 text-center text-[9px] uppercase tracking-[0.16em] text-neutral-400 backdrop-blur md:mt-1 md:inline-block"
                    animate={{
                      x: active && !prefersReducedMotion ? -12 : 0,
                      borderColor: active ? "rgba(10,10,10,0.34)" : "rgba(10,10,10,0.12)",
                      color: active ? "rgba(10,10,10,0.58)" : "rgba(10,10,10,0.36)",
                    }}
                    transition={{ duration: 0.38, ease }}
                  >
                    {engine.signal}
                  </motion.span>
                </motion.div>

                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px origin-left bg-neutral-950/26"
                  animate={{ scaleX: active ? 1 : 0.08, opacity: active ? 0.62 : 0.14 }}
                  transition={{ duration: 0.38, ease }}
                />
              </motion.article>
            );
          })}
        </div>
      </div>
    </Chapter>
  );
}

function FutureChambersScene() {
  const chambers = futureChambers;
  const sound = useSound();
  const [inspectedTraceId, setInspectedTraceId] = useState<FutureChamberId | null>(null);
  const [previewTrace, setPreviewTrace] = useState<{
    chamberTitle: string;
    trace: (typeof futureChamberDetails)[FutureChamberId]["traces"][number];
  } | null>(null);
  const toggleTracePanel = (id: FutureChamberId, isInspecting: boolean) => {
    sound.playRole(isInspecting ? "close" : "select");
    setInspectedTraceId(isInspecting ? null : id);
  };

  useEffect(() => {
    if (!previewTrace) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        sound.playRole("close");
        setPreviewTrace(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewTrace, sound]);

  return (
    <>
    <Chapter id="future" className="relative min-h-screen scroll-mt-24 px-4 pb-16 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-7rem)] w-[min(92vw,1600px)] content-start gap-10 xl:grid-cols-[minmax(360px,0.55fr)_minmax(720px,1fr)] xl:items-start xl:pt-[16vh]">
        <div className="relative z-10">
          <div className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Prepared chambers / systems in development</div>
          <KineticTitle
            text="Three chambers prepared for the next proofs."
            className="mt-6 max-w-[10.5ch] text-[58px] font-normal leading-[0.86] tracking-normal text-neutral-950 sm:text-[88px] xl:text-[108px]"
          />
          <p className="mt-8 max-w-[32rem] text-[15px] leading-8 text-neutral-600">
            These are not public cases yet. They are prepared directions for future product, archive, and collector
            continuation systems.
          </p>
        </div>

        <motion.div
          className="relative isolate overflow-hidden border-y border-neutral-950/14 bg-white/[0.12] backdrop-blur-[1px]"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.24 }}
          transition={{ duration: 0.72, ease }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] [background-size:56px_56px]" />
          <div className="pointer-events-none absolute left-[12%] top-[10%] h-[36rem] w-[36rem] rounded-full border border-neutral-950/[0.03]" />
          <div className="relative z-10">
            <div className="grid gap-4 border-b border-neutral-950/12 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-end sm:px-7">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-400">Future Direction Register</div>
                <p className="mt-2 max-w-[31rem] text-[13px] leading-6 text-neutral-500">
                  Prepared directions, not public case studies. Each chamber defines a role, proof claim, material trace, and possible application path.
                </p>
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-300">03 directions</div>
            </div>

            <div className="divide-y divide-neutral-950/12">
              {chambers.map((item, index) => {
                const details = futureChamberDetails[item.id];
                const isInspecting = inspectedTraceId === item.id;
                const tracePanelId = `future-traces-${item.id}`;

                return (
                  <article
                    key={item.id}
                    className="group relative grid gap-5 px-5 py-5 transition hover:bg-white/[0.2] focus-within:bg-white/[0.2] sm:px-7 lg:grid-cols-[3.5rem_minmax(13rem,0.36fr)_minmax(0,1fr)] lg:items-start"
                  >
                    <div className="flex items-center gap-3 lg:block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-300">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="block h-2 w-2 rounded-full border border-neutral-950/20 bg-white/80 transition group-hover:bg-neutral-950 lg:mt-5" />
                    </div>

                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">{details.state}</div>
                      <h3 className="mt-3 text-[30px] leading-none tracking-normal text-neutral-950 sm:text-[36px]">
                        {item.title}
                      </h3>
                    </div>

                    <div className="grid gap-4">
                      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,20rem)]">
                        <div className="grid content-start gap-4">
                          <div>
                            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">Role</div>
                            <p className="mt-1.5 text-[13px] leading-6 text-neutral-600">{details.role}</p>
                          </div>

                          <div>
                            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">Will prove</div>
                            <p className="mt-1.5 text-[13px] leading-6 text-neutral-600">{details.proof}</p>
                          </div>

                          <div className="flex flex-nowrap gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {details.tags.map((tag) => (
                              <span key={tag} className="shrink-0 border border-neutral-950/12 bg-white/30 px-2 py-1.5 font-mono text-[7px] uppercase tracking-[0.1em] text-neutral-500">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="grid content-start gap-3 border-t border-neutral-950/10 pt-3 xl:border-t-0 xl:pt-0">
                          <button
                            type="button"
                            className="group/cover block w-full text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-neutral-950"
                            aria-expanded={isInspecting}
                            aria-controls={tracePanelId}
                            onMouseEnter={() => sound.playRole("hover")}
                            onClick={() => toggleTracePanel(item.id, isInspecting)}
                          >
                            <span className="relative block aspect-[16/10] overflow-hidden border border-neutral-950/12 bg-white/35">
                              <img
                                src={details.traces[0].src}
                                alt={`${item.title} trace cover`}
                                className="h-full w-full object-cover opacity-88 grayscale-[0.18] contrast-[0.98] transition duration-300 group-hover/cover:scale-[1.025] group-hover/cover:opacity-100 group-focus-visible/cover:opacity-100"
                                loading="lazy"
                              />
                              <span className="absolute bottom-2 left-2 border border-white/25 bg-black/42 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.14em] text-white/78">
                                Trace 01
                              </span>
                            </span>
                          </button>

                          <button
                            type="button"
                            className="w-fit border-b border-neutral-950/30 pb-1 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-neutral-950"
                            aria-expanded={isInspecting}
                            aria-controls={tracePanelId}
                            onMouseEnter={() => sound.playRole("hover")}
                            onClick={() => toggleTracePanel(item.id, isInspecting)}
                          >
                            {isInspecting ? "Close traces" : "View traces"}
                          </button>
                        </div>
                      </div>

                      <AnimatePresence initial={false}>
                        {isInspecting && (
                          <motion.div
                            id={tracePanelId}
                            className="overflow-hidden border-y border-neutral-950/12 bg-white/35"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.32, ease }}
                          >
                            <div className="grid gap-3 p-3">
                              <div className="border-b border-neutral-950/10 pb-2">
                                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
                                  Working material / not public case
                                </div>
                              </div>

                              <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] sm:grid sm:grid-cols-[repeat(3,minmax(0,12.5rem))] sm:justify-end sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
                                {details.traces.map((trace, traceIndex) => (
                                  <figure key={trace.src} className="w-[15rem] shrink-0 border-t border-neutral-950/10 pt-2 sm:w-auto sm:min-w-0">
                                    <button
                                      type="button"
                                      className="group/trace block aspect-[16/10] w-full overflow-hidden border border-neutral-950/12 bg-neutral-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-neutral-950"
                                      onMouseEnter={() => sound.playRole("hover")}
                                      onClick={() => {
                                        sound.playRole("open");
                                        setPreviewTrace({ chamberTitle: item.title, trace });
                                      }}
                                    >
                                      <img
                                        src={trace.src}
                                        alt={`${item.title} ${trace.label.toLowerCase()} expanded ${traceIndex + 1}`}
                                        className="h-full w-full object-cover opacity-82 grayscale-[0.32] contrast-[0.96] transition duration-300 group-hover/trace:scale-[1.025] group-hover/trace:opacity-100 group-focus-visible/trace:opacity-100"
                                        loading="lazy"
                                      />
                                    </button>
                                    <figcaption className="mt-1.5">
                                      <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-neutral-400">{trace.label}</div>
                                      <p className="mt-1 text-[11px] leading-4 text-neutral-500">{trace.caption}</p>
                                    </figcaption>
                                  </figure>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <span className="absolute bottom-[-1px] left-0 h-px w-0 bg-neutral-950/42 transition-all duration-300 group-hover:w-full group-focus-within:w-full" />
                  </article>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </Chapter>
    <AnimatePresence>
      {previewTrace && (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center bg-neutral-950/24 px-4 py-8 backdrop-blur-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease }}
          role="dialog"
          aria-modal="true"
          aria-label={`${previewTrace.chamberTitle} trace preview`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              sound.playRole("close");
              setPreviewTrace(null);
            }
          }}
        >
          <motion.div
            className="w-[min(92vw,900px)] border border-neutral-950/16 bg-[#f5f4ef]/95 p-4 shadow-[0_32px_120px_rgba(0,0,0,0.18)]"
            initial={{ y: 18, scale: 0.985 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 10, scale: 0.985 }}
            transition={{ duration: 0.24, ease }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-950/12 pb-3">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">
                  Working material / not public case
                </div>
                <div className="mt-1 text-[15px] leading-5 text-neutral-700">
                  {previewTrace.chamberTitle} / {previewTrace.trace.label}
                </div>
              </div>
              <button
                type="button"
                className="border-b border-neutral-950/32 pb-1 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-neutral-950"
                onMouseEnter={() => sound.playRole("hover")}
                onClick={() => {
                  sound.playRole("close");
                  setPreviewTrace(null);
                }}
              >
                Close
              </button>
            </div>

            <div className="mt-4 overflow-hidden border border-neutral-950/12 bg-neutral-100">
              <img
                src={previewTrace.trace.src}
                alt={`${previewTrace.chamberTitle} ${previewTrace.trace.label.toLowerCase()} preview`}
                className="max-h-[68vh] w-full object-contain opacity-95"
              />
            </div>

            <p className="mt-3 max-w-[36rem] text-[13px] leading-6 text-neutral-600">{previewTrace.trace.caption}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

function ApplicationLayerScene() {
  return (
    <Chapter id="applications" className="relative min-h-screen px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-7rem)] w-[min(92vw,1600px)] items-center gap-14 xl:grid-cols-[0.46fr_0.54fr]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Application layer</div>
          <KineticTitle
            text="Where the chamber logic becomes practical."
            className="mt-6 max-w-[10.5ch] text-[58px] font-normal leading-[0.86] tracking-normal text-neutral-950 sm:text-[88px] xl:text-[116px]"
          />
        </div>

        <div className="border-y border-neutral-950/14">
          {immersiveApplicationLayer.map((layer, index) => (
            <motion.div
              key={layer}
              className="grid gap-5 border-b border-neutral-950/12 py-7 last:border-b-0 md:grid-cols-[0.16fr_0.84fr]"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.26 }}
              transition={{ duration: 0.64, delay: index * 0.035, ease }}
            >
              <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-300">0{index + 1}</span>
              <span className="text-[34px] font-normal leading-none tracking-normal text-neutral-950 md:text-[48px]">{layer}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </Chapter>
  );
}

function useDesktopImmersiveLayout() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 1024px)").matches;
  });

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

function MobileSectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-neutral-500">
      {children}
    </div>
  );
}

function MobileAction({
  children,
  onClick,
  variant = "light",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "dark" | "light" | "line";
  className?: string;
}) {
  const sound = useSound();
  const classes =
    variant === "dark"
      ? "border-neutral-950 bg-neutral-950 text-white shadow-none"
      : variant === "line"
        ? "border-transparent border-b-neutral-950/28 bg-transparent text-neutral-700 rounded-none px-0"
        : "border-neutral-300 bg-white/54 text-neutral-700 backdrop-blur";

  return (
    <button
      type="button"
      onMouseEnter={() => sound.playRole("hover")}
      onClick={() => {
        sound.playRole(variant === "dark" ? "open" : "select");
        onClick?.();
      }}
      className={[
        "inline-flex min-h-11 items-center justify-center rounded-full border px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] transition active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950/50",
        classes,
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function MobileImmersiveHero({
  onExploreChambers,
  onOpenWhisper,
  onOpenProject,
}: {
  onExploreChambers: () => void;
  onOpenWhisper: () => void;
  onOpenProject?: () => void;
}) {
  return (
    <section
      id="threshold"
      data-header-scene={immersiveHeaderScenes.threshold}
      className="relative overflow-hidden px-5 pb-14 pt-24 sm:px-8"
    >
      <div className="pointer-events-none absolute left-[9%] top-[11%] h-[31rem] w-[31rem] rounded-full border border-neutral-950/[0.045]" />
      <div className="pointer-events-none absolute right-[-22%] top-[27%] h-[24rem] w-[24rem] rotate-[-14deg] rounded-[50%] border border-neutral-950/[0.05]" />
      <div className="pointer-events-none absolute left-[-10%] top-[52%] h-px w-[125%] -rotate-[13deg] bg-gradient-to-r from-transparent via-neutral-950/12 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[42rem]">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-neutral-300/70 bg-white/56 px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-neutral-500 backdrop-blur">
            Immersive interface systems hub
          </span>
          <span className="rounded-full border border-neutral-300/70 bg-white/38 px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-neutral-500 backdrop-blur">
            Chamber map
          </span>
        </div>

        <h1 className="mt-9 max-w-[8.6ch] text-[clamp(4.7rem,17.4vw,8.7rem)] font-normal leading-[0.8] tracking-[-0.08em] text-neutral-950">
          Immersive interface systems.
        </h1>

        <p className="mt-8 max-w-[36rem] text-[18px] leading-[1.7] text-neutral-600 sm:text-[20px]">
          Cinematic web environments, spatial archives, product worlds, AR continuations, presence-based interfaces,
          and WebXR-ready prototypes.
        </p>

        <p className="mt-5 max-w-[34rem] text-[15px] leading-7 text-neutral-500">
          Websites as scenes, archives as rooms, products as worlds, interfaces as living fields.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <MobileAction variant="dark" onClick={onExploreChambers}>
            Explore chambers -&gt;
          </MobileAction>
          <MobileAction onClick={onOpenWhisper}>Open WHISPER -&gt;</MobileAction>
          <MobileAction onClick={onOpenProject} className="min-w-[16rem]">
            Start immersive prototype -&gt;
          </MobileAction>
        </div>
      </div>
    </section>
  );
}

function MobileChamberField({
  onOpenWhisper,
  onShowPreparedChamber,
}: {
  onOpenWhisper: () => void;
  onShowPreparedChamber: (id: FutureChamberId) => void;
}) {
  const sound = useSound();
  const [mode, setMode] = useState<MobileChamberFieldMode>("field");
  const [activeId, setActiveId] = useState<MobileChamberFieldId>("whisper");
  const activeEntry =
    mobileChamberFieldEntries.find((entry) => entry.id === activeId) ?? mobileChamberFieldEntries[0];
  const activeIndex = Math.max(0, mobileChamberFieldEntries.findIndex((entry) => entry.id === activeId));
  const fieldCount = mobileChamberFieldEntries.length;

  const selectEntry = (entry: MobileChamberFieldEntry, nextMode: MobileChamberFieldMode = "field") => {
    if (entry.id !== activeId) sound.playRole("select");
    setActiveId(entry.id);
    setMode(nextMode);
  };

  const selectEntryByOffset = (offset: number) => {
    const nextIndex = (activeIndex + offset + fieldCount) % fieldCount;
    const nextEntry = mobileChamberFieldEntries[nextIndex];
    if (!nextEntry) return;
    selectEntry(nextEntry, "field");
  };

  const handleFieldDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipePower = Math.abs(info.offset.x) + Math.abs(info.velocity.x) * 0.18;
    if (swipePower < 72) return;
    selectEntryByOffset(info.offset.x < 0 ? 1 : -1);
  };

  const runActiveAction = () => {
    if (activeEntry.preparedId) {
      onShowPreparedChamber(activeEntry.preparedId);
      return;
    }

    onOpenWhisper();
  };

  return (
    <section
      id="map"
      data-header-scene={immersiveHeaderScenes.map}
      data-sound-safe-area
      className="relative px-5 py-12 sm:px-8"
    >
      <div className="pointer-events-none absolute left-[-18%] top-[8%] h-[31rem] w-[31rem] rounded-[50%] border border-neutral-950/[0.045]" />
      <div className="pointer-events-none absolute right-[-24%] top-[26%] h-[24rem] w-[24rem] rotate-[16deg] rounded-[50%] border border-neutral-950/[0.05]" />

      <div className="relative z-10 mx-auto max-w-[42rem]">
        <div className="flex items-center justify-between gap-4">
          <MobileSectionLabel>02 / Chamber field</MobileSectionLabel>
          <div className="grid grid-cols-2 overflow-hidden rounded-full border border-neutral-950/12 bg-white/42 p-1 text-[8px] uppercase tracking-[0.14em] text-neutral-500 backdrop-blur">
            {(["field", "index"] as const).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={mode === item}
                onMouseEnter={() => sound.playRole("hover")}
                onClick={() => {
                  if (mode !== item) sound.playRole("select");
                  setMode(item);
                }}
                className={`rounded-full px-3 py-1.5 transition ${
                  mode === item ? "bg-neutral-950 text-white" : "text-neutral-500"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <h2 className="mt-6 max-w-[8.8ch] text-[clamp(4.05rem,13.8vw,7rem)] font-normal leading-[0.86] tracking-[-0.055em] text-neutral-950">
          Immersive project atlas.
        </h2>
        <p className="mt-7 max-w-[35rem] text-[16px] leading-[1.75] text-neutral-600">
          One completed chamber anchors the system. The next directions are prepared as product, archive, and collector
          interfaces rather than generic case cards.
        </p>

        <AnimatePresence mode="wait" initial={false}>
          {mode === "field" ? (
            <motion.div
              key="field"
              initial={{ opacity: 0, y: 18, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.99 }}
              transition={{ duration: 0.34, ease }}
              className="mt-8 overflow-visible py-1"
            >
              <div
                className="relative mx-[-1rem] min-h-[27.5rem] touch-pan-y overflow-visible px-4"
                style={{ perspective: "1400px", transformStyle: "preserve-3d" }}
              >
                <div className="pointer-events-none absolute left-[7%] top-[12%] h-[76%] w-[86%] rounded-[50%] border border-neutral-950/[0.07]" />
                <div className="pointer-events-none absolute left-[-4%] top-[50%] h-px w-[108%] rotate-[-10deg] bg-gradient-to-r from-transparent via-neutral-950/18 to-transparent" />
                <div className="pointer-events-none absolute right-[6%] top-2 z-40 border-y border-neutral-950/12 bg-white/62 px-3 py-1.5 font-mono text-[7px] uppercase tracking-[0.18em] text-neutral-500 shadow-[0_10px_28px_rgba(0,0,0,0.05)] backdrop-blur">
                  Swipe orbit
                </div>

                <motion.div
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  dragMomentum={false}
                  onDragEnd={handleFieldDragEnd}
                  style={{ touchAction: "pan-y", transformStyle: "preserve-3d" }}
                >
                  {mobileChamberFieldEntries.map((entry, index) => {
                    let offset = index - activeIndex;
                    while (offset > fieldCount / 2) offset -= fieldCount;
                    while (offset < -fieldCount / 2) offset += fieldCount;

                    const active = offset === 0;
                    const hidden = Math.abs(offset) > 1.8;
                    const x = offset * 62;
                    const y = active ? 0 : offset < 0 ? 28 : 18;
                    const rotateZ = active ? -2.5 : offset < 0 ? -10 : 9;
                    const rotateY = active ? 0 : offset < 0 ? 17 : -17;
                    const scale = active ? 1 : 0.76;
                    const opacity = hidden ? 0 : active ? 1 : 0.42;
                    const posterOffset = active ? "inset-[-3%]" : "inset-[-7%]";

                    return (
                      <motion.button
                        key={entry.id}
                        type="button"
                        aria-label={`${entry.index} ${entry.title}`}
                        aria-pressed={active}
                        onClick={() => {
                          if (!active) {
                            selectEntry(entry, "field");
                            return;
                          }

                          runActiveAction();
                        }}
                        onMouseEnter={() => sound.playRole("hover")}
                        className={`absolute left-1/2 top-[51%] h-[22rem] w-[86%] max-w-[28rem] overflow-hidden border bg-neutral-950 text-left text-white outline-none focus-visible:ring-2 focus-visible:ring-neutral-950/40 ${
                          active ? "border-white/70 shadow-[0_12px_34px_rgba(0,0,0,0.14)]" : "border-white/24 shadow-[0_10px_28px_rgba(0,0,0,0.08)]"
                        }`}
                        style={{
                          clipPath: active
                            ? "polygon(3% 0, 100% 6%, 94% 94%, 0 100%)"
                            : offset < 0
                              ? "polygon(7% 0, 100% 9%, 90% 100%, 0 88%)"
                              : "polygon(0 9%, 95% 0, 100% 88%, 8% 100%)",
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
                          filter: `blur(${active ? 0 : 0.75}px)`,
                        }}
                        transition={{ duration: 0.64, ease }}
                      >
                        <img
                          src={entry.mediaSrc}
                          alt=""
                          className={`absolute ${posterOffset} h-[110%] w-[110%] object-cover saturate-[1.08] contrast-[1.06] brightness-[1.03] transition duration-700 ${
                            active ? "opacity-95" : "opacity-72 grayscale-[0.12]"
                          }`}
                          loading="lazy"
                          draggable={false}
                        />
                        <span className="absolute inset-0 bg-[radial-gradient(circle_at_52%_32%,rgba(255,255,255,0.06),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.18)_52%,rgba(0,0,0,0.72))]" />
                        <span className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between border-y border-white/15 py-2 font-mono text-[8px] uppercase tracking-[0.17em] text-white/58">
                          <span>{active ? "Active chamber" : "Prepared plane"}</span>
                          <span>{entry.index}</span>
                        </span>
                        <span className="pointer-events-none absolute bottom-5 left-5 right-5">
                          <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-white/54">
                            {entry.status}
                          </span>
                          <span className="mt-2 block max-w-[9ch] text-[42px] leading-[0.86] tracking-[-0.055em] text-white drop-shadow-[0_4px_22px_rgba(0,0,0,0.48)]">
                            {entry.title}
                          </span>
                          {active ? (
                            <span className="mt-4 block max-w-[21rem] text-[13px] leading-6 text-white/66">
                              {entry.role}
                            </span>
                          ) : null}
                        </span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>

              <div className="mt-5 grid gap-5 border-t border-neutral-950/10 pt-5">
                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onMouseEnter={() => sound.playRole("hover")}
                    onClick={() => selectEntryByOffset(-1)}
                    className="border-y border-neutral-950/16 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 transition hover:border-neutral-950/44 hover:text-neutral-950"
                  >
                    Prev
                  </button>
                  <div className="flex items-center gap-2">
                    {mobileChamberFieldEntries.map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        aria-label={`Show ${entry.title}`}
                        aria-pressed={entry.id === activeId}
                        onClick={() => selectEntry(entry, "field")}
                        className={`h-1.5 rounded-full transition-all ${
                          entry.id === activeId ? "w-8 bg-neutral-950" : "w-1.5 bg-neutral-950/20"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onMouseEnter={() => sound.playRole("hover")}
                    onClick={() => selectEntryByOffset(1)}
                    className="border-y border-neutral-950/16 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 transition hover:border-neutral-950/44 hover:text-neutral-950"
                  >
                    Next
                  </button>
                </div>

                <div className="grid gap-3">
                  <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
                    {activeEntry.index} / {activeEntry.status}
                  </div>
                  <p className="text-[16px] leading-7 text-neutral-600">{activeEntry.role}</p>
                  <div className="flex flex-wrap gap-2">
                    {mobileChamberFieldEntries.map((entry) => {
                      const active = entry.id === activeId;
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          aria-pressed={active}
                          onMouseEnter={() => sound.playRole("hover")}
                          onClick={() => selectEntry(entry, "field")}
                          className={`border px-2.5 py-1.5 font-mono text-[7px] uppercase tracking-[0.14em] transition ${
                            active
                              ? "border-neutral-950 bg-neutral-950 text-white"
                              : "border-neutral-950/12 bg-white/24 text-neutral-500"
                          }`}
                        >
                          {entry.index} {entry.title}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <MobileAction variant={activeEntry.id === "whisper" ? "dark" : "line"} onClick={runActiveAction}>
                  {activeEntry.cta} -&gt;
                </MobileAction>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="index"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.26, ease }}
              className="mt-8 border-y border-neutral-950/12"
            >
              {mobileChamberFieldEntries.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onMouseEnter={() => sound.playRole("hover")}
                  onClick={() => selectEntry(entry)}
                  className="grid w-full grid-cols-[3.2rem_minmax(0,1fr)] gap-3 border-b border-neutral-950/10 py-4 text-left last:border-b-0"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-300">{entry.index}</span>
                  <span>
                    <span className="block text-[24px] leading-none tracking-[-0.02em] text-neutral-950">
                      {entry.title}
                    </span>
                    <span className="mt-2 block font-mono text-[8px] uppercase tracking-[0.16em] text-neutral-400">
                      {entry.status}
                    </span>
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function MobileSurfaceRelay({ onOpenWhisper }: { onOpenWhisper: () => void }) {
  const sound = useSound();
  const [activeId, setActiveId] = useState<WhisperProofId>("web");
  const activeSurface = whisperProofStates.find((surface) => surface.id === activeId) ?? whisperProofStates[0];
  const activeIndex = Math.max(0, whisperProofStates.findIndex((surface) => surface.id === activeSurface.id));
  const surfaceCount = whisperProofStates.length;

  const selectSurface = (surface: WhisperProofState) => {
    if (surface.id !== activeSurface.id) sound.playRole("transition");
    setActiveId(surface.id);
  };

  const selectSurfaceByOffset = (offset: number) => {
    const nextIndex = (activeIndex + offset + surfaceCount) % surfaceCount;
    const nextSurface = whisperProofStates[nextIndex];
    if (!nextSurface) return;
    selectSurface(nextSurface);
  };

  const handleSurfaceDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipePower = Math.abs(info.offset.x) + Math.abs(info.velocity.x) * 0.18;
    if (swipePower < 66) return;
    selectSurfaceByOffset(info.offset.x < 0 ? 1 : -1);
  };

  return (
    <section
      id="proof"
      data-header-scene={immersiveHeaderScenes.proof}
      data-sound-safe-area
      className="relative px-5 pb-16 pt-12 sm:px-8"
    >
      <div className="pointer-events-none absolute left-[7%] top-[8%] h-[26rem] w-[26rem] rotate-[-11deg] rounded-[50%] border border-neutral-950/[0.05]" />
      <div className="relative z-10 mx-auto max-w-[42rem]">
        <MobileSectionLabel>03 / Featured proof / WHISPER</MobileSectionLabel>
        <h2 className="mt-6 max-w-[8.5ch] text-[clamp(4.2rem,14vw,7.2rem)] font-normal leading-[0.86] tracking-[-0.055em] text-neutral-950">
          The first completed spatial proof.
        </h2>
        <p className="mt-7 max-w-[35rem] text-[17px] leading-[1.75] text-neutral-600">
          WHISPER proves that one photographic archive can move across web, mobile, print, AR, and room-scale presence
          without losing atmosphere.
        </p>

        <div className="mt-8 overflow-visible py-1">
          <div
            className="relative mx-[-1.05rem] min-h-[21.5rem] touch-pan-y overflow-visible px-4"
            style={{ perspective: "1350px", transformStyle: "preserve-3d" }}
          >
            <div className="pointer-events-none absolute left-[6%] top-[12%] h-[72%] w-[88%] rounded-[50%] border border-neutral-950/[0.055]" />
            <div className="pointer-events-none absolute left-[-5%] top-[50%] h-px w-[112%] rotate-[-8deg] bg-gradient-to-r from-transparent via-neutral-950/14 to-transparent" />
            <div className="pointer-events-none absolute right-5 top-0 border-y border-neutral-950/12 bg-white/44 px-3 py-1.5 font-mono text-[7px] uppercase tracking-[0.18em] text-neutral-500 backdrop-blur">
              Surface viewer
            </div>

            <motion.div
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              dragMomentum={false}
              onDragEnd={handleSurfaceDragEnd}
              style={{ touchAction: "pan-y", transformStyle: "preserve-3d" }}
            >
              {whisperProofStates.map((surface) => {
                let offset = whisperProofStates.findIndex((item) => item.id === surface.id) - activeIndex;
                while (offset > surfaceCount / 2) offset -= surfaceCount;
                while (offset < -surfaceCount / 2) offset += surfaceCount;

                const active = offset === 0;
                const hidden = Math.abs(offset) > 1.7;
                const x = offset * 74;
                const y = active ? 0 : offset < 0 ? 18 : 12;
                const rotateZ = active ? -1.5 : offset < 0 ? -8 : 8;
                const rotateY = active ? 0 : offset < 0 ? 15 : -15;
                const scale = active ? 1 : 0.78;
                const opacity = hidden ? 0 : active ? 1 : 0.38;

                return (
                  <motion.button
                    key={surface.id}
                    type="button"
                    aria-label={`${surface.index} ${surface.railLabel}`}
                    aria-pressed={active}
                    onMouseEnter={() => sound.playRole("hover")}
                    onClick={() => {
                      if (!active) selectSurface(surface);
                    }}
                    className={`absolute left-1/2 top-[48%] h-[16.75rem] w-[88%] max-w-[34rem] overflow-hidden border bg-neutral-950 text-left text-white outline-none focus-visible:ring-2 focus-visible:ring-neutral-950/40 ${
                      hidden ? "pointer-events-none" : ""
                    } ${
                      active ? "border-white/70 shadow-[0_12px_32px_rgba(0,0,0,0.13)]" : "border-white/24 shadow-[0_10px_26px_rgba(0,0,0,0.08)]"
                    }`}
                    style={{
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
                      filter: `blur(${active ? 0 : 0.7}px)`,
                    }}
                    transition={{ duration: 0.58, ease }}
                  >
                    <WhisperProofMedia
                      proof={surface}
                      fit="contain"
                      className={`absolute inset-0 h-full w-full transition duration-500 ${
                        active ? "opacity-100 saturate-[1.08] contrast-[1.05]" : "opacity-74 saturate-[0.9] contrast-[0.95]"
                      }`}
                    />
                    <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(255,255,255,0.05),transparent_32%),linear-gradient(180deg,rgba(0,0,0,0.03),rgba(0,0,0,0.18)_78%,rgba(0,0,0,0.38))]" />
                    <span className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                      <span>
                        <span className="block font-mono text-[8px] uppercase tracking-[0.18em] text-white/54">
                          Surface {surface.index}
                        </span>
                        <span className="mt-1 block text-[26px] leading-none tracking-[-0.03em] text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.45)]">
                          {surface.railLabel}
                        </span>
                      </span>
                      <span className="border border-white/20 bg-black/22 px-2.5 py-1.5 font-mono text-[7px] uppercase tracking-[0.14em] text-white/60">
                        {active ? "Active" : "Preview"}
                      </span>
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          <div className="px-4 pb-2 pt-1">
            <div className="flex items-center justify-between gap-4 border-y border-neutral-950/10 py-4">
              <button
                type="button"
                onMouseEnter={() => sound.playRole("hover")}
                onClick={() => selectSurfaceByOffset(-1)}
                className="border-y border-neutral-950/16 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 transition hover:border-neutral-950/44 hover:text-neutral-950"
              >
                Prev
              </button>
              <div className="flex items-center gap-2">
                {whisperProofStates.map((surface) => (
                  <button
                    key={surface.id}
                    type="button"
                    aria-label={`Show ${surface.railLabel}`}
                    aria-pressed={surface.id === activeSurface.id}
                    onMouseEnter={() => sound.playRole("hover")}
                    onClick={() => selectSurface(surface)}
                    className={`h-1.5 rounded-full transition-all ${
                      surface.id === activeSurface.id ? "w-8 bg-neutral-950" : "w-1.5 bg-neutral-950/20"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onMouseEnter={() => sound.playRole("hover")}
                onClick={() => selectSurfaceByOffset(1)}
                className="border-y border-neutral-950/16 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 transition hover:border-neutral-950/44 hover:text-neutral-950"
              >
                Next
              </button>
            </div>

            <div className="mt-5">
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
                Surface {activeSurface.index} / {activeSurface.signal}
              </div>
              <h3 className="mt-2 text-[32px] leading-none tracking-[-0.02em] text-neutral-950">{activeSurface.label}</h3>
              <p className="mt-3 text-[14px] leading-7 text-neutral-600">
                {mobileSurfaceReadouts[activeSurface.id]}
              </p>
            </div>

            <MobileAction variant="line" onClick={onOpenWhisper} className="mt-6">
              Open WHISPER -&gt;
            </MobileAction>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileChamberAtlas({
  activeId,
  onActiveChange,
}: {
  activeId: FutureChamberId;
  onActiveChange: (id: FutureChamberId) => void;
}) {
  const sound = useSound();
  const [activeTraceIndex, setActiveTraceIndex] = useState(0);
  const activeChamber = futureChambers.find((chamber) => chamber.id === activeId) ?? futureChambers[0];
  const activeChamberIndex = Math.max(0, futureChambers.findIndex((chamber) => chamber.id === activeChamber.id));
  const activeDetails = futureChamberDetails[activeChamber.id];
  const activeTraces = activeDetails.traces;
  const safeTraceIndex = activeTraceIndex % activeTraces.length;
  const activeTrace = activeTraces[safeTraceIndex] ?? activeTraces[0];

  const selectChamber = (id: FutureChamberId) => {
    if (id !== activeId) sound.playRole("select");
    setActiveTraceIndex(0);
    onActiveChange(id);
  };

  const selectChamberByOffset = (offset: number) => {
    const nextIndex = (activeChamberIndex + offset + futureChambers.length) % futureChambers.length;
    const nextChamber = futureChambers[nextIndex];
    if (!nextChamber) return;
    selectChamber(nextChamber.id);
  };

  const selectTraceByOffset = (offset: number) => {
    sound.playRole("transition");
    setActiveTraceIndex((index) => (index + offset + activeTraces.length) % activeTraces.length);
  };

  const handleTraceDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipePower = Math.abs(info.offset.x) + Math.abs(info.velocity.x) * 0.18;
    if (swipePower < 64) return;
    selectTraceByOffset(info.offset.x < 0 ? 1 : -1);
  };

  return (
    <section
      id="future"
      data-header-scene={immersiveHeaderScenes.future}
      data-sound-safe-area
      className="relative px-5 py-12 sm:px-8"
    >
      <div className="mx-auto max-w-[42rem]">
        <MobileSectionLabel>04 / Chamber atlas</MobileSectionLabel>
        <h2 className="mt-6 text-[clamp(4.15rem,14vw,7.2rem)] font-normal leading-[0.86] tracking-[-0.06em] text-neutral-950">
          Next rooms in development.
        </h2>
        <p className="mt-7 max-w-[35rem] text-[17px] leading-[1.75] text-neutral-600">
          These are not public cases yet. They are prepared spatial directions for product, archive, collector, and
          installation systems.
        </p>

        <div className="mt-8 overflow-visible py-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={activeChamber.id}
              initial={{ opacity: 0, y: 18, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.99 }}
              transition={{ duration: 0.32, ease }}
              className="pt-3"
            >
              <div className="px-1">
                <div>
                  <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-400">
                    {String(activeChamberIndex + 1).padStart(2, "0")} /{" "}
                    {activeDetails.state}
                  </div>
                  <h3 className="mt-2 text-[34px] leading-none tracking-[-0.03em] text-neutral-950">
                    {activeChamber.title}
                  </h3>
                </div>
              </div>

              <p className="mt-5 px-1 text-[15px] leading-7 text-neutral-600">
                {activeDetails.role}
              </p>

              <div className="mt-6 grid gap-4 border-y border-neutral-950/10 px-1 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="flex items-center gap-2">
                  {futureChambers.map((chamber, index) => (
                    <button
                      key={chamber.id}
                      type="button"
                      aria-label={`Show ${chamber.title}`}
                      aria-pressed={chamber.id === activeId}
                      onMouseEnter={() => sound.playRole("hover")}
                      onClick={() => selectChamber(chamber.id)}
                      className={`h-1.5 rounded-full transition-all ${
                        chamber.id === activeId ? "w-9 bg-neutral-950" : "w-1.5 bg-neutral-950/20"
                      }`}
                    >
                      <span className="sr-only">{String(index + 1).padStart(2, "0")}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-neutral-400">
                    {activeChamberIndex + 1} / {futureChambers.length} chamber
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      type="button"
                      aria-label="Previous chamber"
                      onMouseEnter={() => sound.playRole("hover")}
                      onClick={() => selectChamberByOffset(-1)}
                      className="grid h-9 w-9 place-items-center rounded-full border border-neutral-950/12 bg-white/44 text-[13px] text-neutral-500 transition hover:border-neutral-950/40 hover:text-neutral-950"
                    >
                      {"<"}
                    </button>
                    <button
                      type="button"
                      aria-label="Next chamber"
                      onMouseEnter={() => sound.playRole("hover")}
                      onClick={() => selectChamberByOffset(1)}
                      className="grid h-9 w-9 place-items-center rounded-full border border-neutral-950/12 bg-white/44 text-[13px] text-neutral-500 transition hover:border-neutral-950/40 hover:text-neutral-950"
                    >
                      {">"}
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="relative mx-[-1.05rem] mt-7 min-h-[25rem] touch-pan-y overflow-visible px-4 sm:min-h-[29rem]"
                style={{ perspective: "1300px", transformStyle: "preserve-3d" }}
              >
                <div className="pointer-events-none absolute left-[7%] top-[13%] h-[70%] w-[86%] rounded-[50%] border border-neutral-950/[0.055]" />
                <div className="pointer-events-none absolute right-5 top-0 border-y border-neutral-950/12 bg-white/44 px-3 py-1.5 font-mono text-[7px] uppercase tracking-[0.18em] text-neutral-500 backdrop-blur">
                  Tap / swipe material
                </div>

                <motion.div
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  dragMomentum={false}
                  onDragEnd={handleTraceDragEnd}
                  style={{ touchAction: "pan-y", transformStyle: "preserve-3d" }}
                >
                  {activeTraces.map((trace, index) => {
                    const offset = index - safeTraceIndex;
                    const active = offset === 0;
                    const hidden = Math.abs(offset) > 1;
                    const x = offset * 76;
                    const rotateZ = active ? -1 : offset < 0 ? -7 : 7;
                    const rotateY = active ? 0 : offset < 0 ? 14 : -14;
                    const scale = active ? 1 : 0.78;
                    const opacity = hidden ? 0 : active ? 1 : 0.34;

                    return (
                      <motion.button
                        key={trace.src}
                        type="button"
                        aria-label={trace.label}
                        aria-pressed={active}
                        onMouseEnter={() => sound.playRole("hover")}
                        onClick={() => {
                          if (active) {
                            selectTraceByOffset(1);
                            return;
                          }

                          sound.playRole("transition");
                          setActiveTraceIndex(index);
                        }}
                        className={`absolute left-1/2 top-[50%] aspect-[4/3] w-[74%] max-w-[30rem] overflow-hidden border bg-neutral-950 text-left text-white outline-none focus-visible:ring-2 focus-visible:ring-neutral-950/40 sm:w-[68%] ${
                          hidden ? "pointer-events-none" : ""
                        } ${
                          active ? "border-white/70 shadow-[0_12px_34px_rgba(0,0,0,0.14)]" : "border-white/22 shadow-[0_10px_26px_rgba(0,0,0,0.08)]"
                        }`}
                        style={{
                          zIndex: 20 - Math.abs(offset) * 4,
                          transformStyle: "preserve-3d",
                        }}
                        initial={false}
                        animate={{
                          opacity,
                          x: `calc(-50% + ${x}%)`,
                          y: "calc(-50%)",
                          rotateZ,
                          rotateY,
                          scale,
                          filter: `blur(${active ? 0 : 0.7}px)`,
                        }}
                        transition={{ duration: 0.5, ease }}
                      >
                        <img
                          src={trace.src}
                          alt=""
                          className={`absolute inset-0 h-full w-full object-cover transition duration-500 ${
                            active ? "opacity-95 saturate-[1.04] contrast-[1.04]" : "opacity-70 saturate-[0.9]"
                          }`}
                          loading="lazy"
                          draggable={false}
                        />
                        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.1)_62%,rgba(0,0,0,0.46))]" />
                        <span className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                          <span>
                            <span className="block font-mono text-[8px] uppercase tracking-[0.18em] text-white/56">
                              Material {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="mt-1 block max-w-[15rem] text-[18px] leading-tight text-white/88">
                              {trace.label}
                            </span>
                          </span>
                          <span className="border border-white/20 bg-black/24 px-2.5 py-1.5 font-mono text-[7px] uppercase tracking-[0.14em] text-white/62">
                            {active ? "Open" : "Next"}
                          </span>
                        </span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>

              <div className="px-1">
                <div className="flex items-center justify-between gap-4 border-y border-neutral-950/10 py-4">
                  <button
                    type="button"
                    onMouseEnter={() => sound.playRole("hover")}
                    onClick={() => selectTraceByOffset(-1)}
                    className="border-y border-neutral-950/16 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 transition hover:border-neutral-950/44 hover:text-neutral-950"
                  >
                    Prev
                  </button>
                  <div className="flex items-center gap-2">
                    {activeTraces.map((trace, index) => (
                      <button
                        key={trace.src}
                        type="button"
                        aria-label={`Show ${trace.label}`}
                        aria-pressed={index === safeTraceIndex}
                        onMouseEnter={() => sound.playRole("hover")}
                        onClick={() => {
                          sound.playRole("transition");
                          setActiveTraceIndex(index);
                        }}
                        className={`h-1.5 rounded-full transition-all ${
                          index === safeTraceIndex ? "w-8 bg-neutral-950" : "w-1.5 bg-neutral-950/20"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onMouseEnter={() => sound.playRole("hover")}
                    onClick={() => selectTraceByOffset(1)}
                    className="border-y border-neutral-950/16 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 transition hover:border-neutral-950/44 hover:text-neutral-950"
                  >
                    Next
                  </button>
                </div>

                <div className="mt-4">
                  <div>
                    <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-neutral-400">
                      Working material / not public case
                    </div>
                    <p className="mt-2 text-[13px] leading-6 text-neutral-500">{activeTrace.caption}</p>
                  </div>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function MobileInterfaceEngines() {
  const engineOrder = [
    "webgl-stage",
    "living-atmosphere",
    "cinematic-frame-field",
    "cinematic-inspect",
    "presence-os",
    "ar-collector",
  ];
  const engines = engineOrder
    .map((id) => immersiveEngineStack.find((engine) => engine.id === id))
    .filter((engine): engine is (typeof immersiveEngineStack)[number] => Boolean(engine));

  return (
    <section
      id="engines"
      data-header-scene={immersiveHeaderScenes.engines}
      data-sound-safe-area
      className="relative px-5 py-12 sm:px-8"
    >
      <div className="mx-auto max-w-[42rem]">
        <MobileSectionLabel>05 / Interface engines</MobileSectionLabel>
        <h2 className="mt-6 max-w-[9.2ch] text-[clamp(4.05rem,13.5vw,7rem)] font-normal leading-[0.86] tracking-[-0.055em] text-neutral-950">
          Systems beneath the spatial surface.
        </h2>
        <p className="mt-7 max-w-[35rem] text-[16px] leading-[1.75] text-neutral-600">
          The immersive direction is built from reusable engines: atmosphere, reveal, inspection, orbit, presence, and
          collector continuation.
        </p>

        <div className="mt-8 border-y border-neutral-950/12">
          {engines.map((engine, index) => (
            <div key={engine.id} className="grid grid-cols-[3.6rem_minmax(0,1fr)] gap-3 border-b border-neutral-950/10 py-4 last:border-b-0">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-300">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[27px] leading-none tracking-[-0.015em] text-neutral-950">{engine.title}</h3>
                <p className="mt-2 text-[13px] leading-6 text-neutral-500">{engine.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MobileApplicationPaths() {
  return (
    <section
      id="applications"
      data-header-scene={immersiveHeaderScenes.applications}
      data-sound-safe-area
      className="relative px-5 py-12 sm:px-8"
    >
      <div className="mx-auto max-w-[42rem]">
        <MobileSectionLabel>06 / Application layer</MobileSectionLabel>
        <h2 className="mt-6 max-w-[8.5ch] text-[clamp(4.1rem,13.8vw,7rem)] font-normal leading-[0.86] tracking-[-0.055em] text-neutral-950">
          Where chamber logic becomes practical.
        </h2>
        <div className="mt-8 border-y border-neutral-950/12">
          {mobileApplicationPaths.map((path, index) => (
            <div key={path} className="grid grid-cols-[3.6rem_minmax(0,1fr)] gap-3 border-b border-neutral-950/10 py-4 last:border-b-0">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-300">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-[29px] leading-[1.03] tracking-[-0.02em] text-neutral-950">{path}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MobileImmersiveClosing({
  onOpenProject,
  onOpenWhisper,
}: {
  onOpenProject?: () => void;
  onOpenWhisper: () => void;
}) {
  return (
    <section
      data-header-scene={immersiveHeaderScenes.applications}
      data-sound-safe-area
      className="relative px-5 pb-12 pt-10 sm:px-8"
    >
      <div className="pointer-events-none absolute right-[-18%] top-[10%] h-[25rem] w-[25rem] rounded-full border border-neutral-950/[0.05]" />
      <div className="relative z-10 mx-auto max-w-[42rem]">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">
          <span>07 / Closing signal</span>
          <span className="h-2 w-2 rounded-full bg-neutral-950" />
        </div>
        <h2 className="mt-6 max-w-[8.7ch] text-[clamp(4.25rem,14.4vw,7.4rem)] font-normal leading-[0.86] tracking-[-0.055em] text-neutral-950">
          Build the next room as an interface.
        </h2>
        <p className="mt-6 max-w-[34rem] text-[16px] leading-7 text-neutral-600">
          Start with a focused chamber, proof layer, or spatial prototype. The system can stay small, but it should
          behave with clarity.
        </p>

        <div className="mt-8 border-y border-neutral-950/12">
          {[
            ["Studio signal", "Spatial systems"],
            ["Project intake", "Available"],
            ["Next step", "Start a project"],
          ].map(([label, value]) => (
            <div key={label} className="grid grid-cols-[1fr_auto] gap-4 border-b border-neutral-950/12 py-3 last:border-b-0">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">{label}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-950">{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-7 grid gap-3">
          <MobileAction variant="dark" onClick={onOpenProject} className="w-full justify-between px-6">
            Start a project <span aria-hidden="true">-&gt;</span>
          </MobileAction>
          <MobileAction onClick={onOpenWhisper} className="w-full">
            Open WHISPER -&gt;
          </MobileAction>
        </div>
      </div>
    </section>
  );
}

function MobileImmersiveHub({
  onOpenProject,
  onOpenWhisper,
  onExploreChambers,
}: {
  onOpenProject?: () => void;
  onOpenWhisper: () => void;
  onExploreChambers: () => void;
}) {
  const [preparedFocus, setPreparedFocus] = useState<FutureChamberId>("product-world");

  const showPreparedChamber = (id: FutureChamberId) => {
    setPreparedFocus(id);
    window.requestAnimationFrame(() => {
      document.getElementById("future")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <main className="relative z-10 lg:hidden" data-mobile-immersive-hub>
      <MobileMotionSection variant="threshold">
        <MobileImmersiveHero
          onExploreChambers={onExploreChambers}
          onOpenWhisper={onOpenWhisper}
          onOpenProject={onOpenProject}
        />
      </MobileMotionSection>
      <MobileMotionSection variant="media" delay="soft">
        <MobileChamberField onOpenWhisper={onOpenWhisper} onShowPreparedChamber={showPreparedChamber} />
      </MobileMotionSection>
      <MobileMotionSection variant="media" delay="soft">
        <MobileSurfaceRelay onOpenWhisper={onOpenWhisper} />
      </MobileMotionSection>
      <MobileMotionSection variant="media" delay="soft">
        <MobileChamberAtlas key={preparedFocus} activeId={preparedFocus} onActiveChange={setPreparedFocus} />
      </MobileMotionSection>
      <MobileMotionSection variant="ledger" delay="soft">
        <MobileInterfaceEngines />
      </MobileMotionSection>
      <MobileMotionSection variant="ledger" delay="soft">
        <MobileApplicationPaths />
      </MobileMotionSection>
      <MobileMotionSection variant="closing" delay="soft">
        <MobileImmersiveClosing onOpenProject={onOpenProject} onOpenWhisper={onOpenWhisper} />
      </MobileMotionSection>
    </main>
  );
}

export default function ImmersiveV2({
  drawerOpen = false,
  onOpenProject,
  onCloseProject,
  noIndex = false,
}: PageProps) {
  const navigate = useNavigate();
  const chamberState = useImmersiveChamberSelection();
  const routeContentReady = useDeferredRouteContent();
  const activeId = useActiveSection();
  const proofChromeActive = useImmersiveProofChromeActive();
  const railActiveId = proofChromeActive ? "proof" : activeId;
  const { playRole, setScene, setAmbientSceneLevel, startSceneAmbient, stopAmbient } = useSound();
  const isDesktopLayout = useDesktopImmersiveLayout();

  useEffect(() => {
    setScene("immersive", immersiveHeaderScenes[activeId]);
    setAmbientSceneLevel(immersiveHeaderScenes[activeId]);
  }, [activeId, setAmbientSceneLevel, setScene]);

  useEffect(() => {
    void startSceneAmbient("immersive", immersiveHeaderScenes[activeId]);
  }, [activeId, startSceneAmbient]);

  useEffect(() => {
    return () => {
      stopAmbient();
    };
  }, [stopAmbient]);

  const goTo = (path: string) => {
    startSpaPageTransition(navigate, path, () => {
      onCloseProject?.();
    });
  };

  const openChamber = (id: ImmersiveChamberId) => {
    const chamber = getImmersiveChamber(id);
    playRole("open");

    if (chamber.route) {
      goTo(chamber.route);
      return;
    }

    document.getElementById("future")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollTo = (id: SectionId) => {
    const section = document.getElementById(id);
    if (!section) return;

    const top = section.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <>
      {noIndex ? <ImmersiveV2Meta /> : null}
      <Header drawerOpen={drawerOpen} onOpenProject={onOpenProject} onCloseProject={onCloseProject} />

      <PageSurface className="relative min-h-screen overflow-x-hidden bg-transparent text-neutral-950">
        <AtmosphericSiteShell preset="immersive" />
        {isDesktopLayout ? (
          <SectionRail
            items={sectionItems}
            activeId={railActiveId}
            onSelect={(id) => scrollTo(id as SectionId)}
            label="Immersive sections"
            tone="light"
          />
        ) : null}

        {isDesktopLayout ? (
          <main
            className="relative z-10"
            data-active-chamber={chamberState.activeChamberId}
            data-active-mood={chamberState.activeChamber.mood}
          >
            <ChamberEntryField
              activeChamber={chamberState.activeChamber}
              activeChamberId={chamberState.activeChamberId}
              activeChamberEngines={chamberState.activeChamberEngines}
              selectChamber={chamberState.selectChamber}
              openChamber={openChamber}
              onExplore={() => scrollTo("map")}
              onOpenProject={onOpenProject}
            />
            {routeContentReady ? (
              <>
                <PracticeMapScene chamberState={chamberState} openChamber={openChamber} />
                <CompletedProofScene onOpenWhisper={() => goTo("/immersive/whisper")} />
                <EngineStackScene />
                <FutureChambersScene />
                <ApplicationLayerScene />
              </>
            ) : (
              <div aria-hidden="true" className="min-h-[500vh]" />
            )}
          </main>
        ) : routeContentReady ? (
          <MobileImmersiveHub
            onOpenProject={onOpenProject}
            onOpenWhisper={() => goTo("/immersive/whisper")}
            onExploreChambers={() => scrollTo("map")}
          />
        ) : (
          <main className="relative z-10 lg:hidden">
            <div aria-hidden="true" className="min-h-[160vh]" />
          </main>
        )}

        {routeContentReady ? (
          <SiteFooterV2
            onOpenProject={onOpenProject}
            variant="immersive"
            hideClosingSignal={!isDesktopLayout}
          />
        ) : null}
      </PageSurface>
    </>
  );
}
