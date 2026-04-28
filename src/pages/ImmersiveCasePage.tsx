import { motion } from "framer-motion";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Header from "../ui/Header";
import Container from "../ui/Container";
import ActionPill from "../ui/ActionPill";
import PageSurface from "../ui/PageSurface";
import CaseStatusPill from "../ui/status/CaseStatusPill";
import WhisperCaseLayout from "../ui/immersive/WhisperCaseLayout";
import { startSpaPageTransition } from "../ui/pageTransition";
import { immersiveItems, type ImmersiveTone } from "../data/immersive";
import { whisperCaseI18n } from "../data/whisperCaseI18n";
import { useLocale } from "../store/useLocale";

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
};

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

export default function ImmersiveCasePage({
  drawerOpen = false,
  onOpenProject,
  onCloseProject,
}: PageProps) {
  const { t, locale } = useLocale();
  const { slug } = useParams();
  const navigate = useNavigate();

  const data = immersiveItems.find((item) => item.slug === slug) ?? null;

  if (!data) {
    return <Navigate to="/immersive" replace />;
  }

  const isWhisperCase = data.slug === "whisper";
  const whisperCopy =
    whisperCaseI18n[locale as keyof typeof whisperCaseI18n] ??
    whisperCaseI18n.en;

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

  const variant = immersiveVariantBySlug[data.slug] ?? "ar";
  const variantUi = immersiveVariantUi[variant];

  const index = immersiveItems.findIndex((item) => item.slug === data.slug);
  const prev = index > 0 ? immersiveItems[index - 1] : null;
  const next = index >= 0 && index < immersiveItems.length - 1 ? immersiveItems[index + 1] : null;
  const externalLinks = data.links ?? [];

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Header
        drawerOpen={drawerOpen}
        onOpenProject={onOpenProject}
        onCloseProject={onCloseProject}
      />

      <main className="pb-20 pt-24 md:pb-24 md:pt-28">
        <PageSurface>
          <Container>
          <section className="border-b border-neutral-100 pb-10 md:pb-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => openPath(navigate, "/immersive", onCloseProject)}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-1px] hover:border-neutral-400 hover:text-neutral-900"
              >
                <span className="text-neutral-400">←</span>{" "}
                {isWhisperCase ? whisperCopy.top.backToImmersive : "Back to immersive"}
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-neutral-500">
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
                          {t.nav.start}
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
                <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">Direction</div>
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
                  <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">Interaction grammar</div>
                  <p className="mt-3 text-sm leading-7 text-neutral-600">{detail.interaction}</p>
                </div>

                <div className="rounded-[20px] border border-neutral-100 bg-white/72 p-4 backdrop-blur-[2px] md:p-[18px]">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">Build path</div>
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
              <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">Interface rhythm</div>

              <h3 className="mt-3 text-2xl tracking-tight md:text-3xl">
                Sequence-driven presentation structure.
              </h3>

              <p className="mt-3 max-w-[56ch] text-sm text-neutral-600">
                A minimal sequence of states replaces dense navigation, allowing atmosphere, hierarchy, and
                clarity to unfold progressively.
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
                      <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">Entry state</div>
                      <p className="mt-2 text-sm text-neutral-700">
                        Calm introduction frame that establishes tone without UI noise.
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
                      <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">Hierarchy frame</div>
                      <p className="mt-2 text-sm text-neutral-700">
                        Key information surfaces with controlled emphasis and spatial layering.
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
                      <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">State transition</div>
                      <p className="mt-2 text-sm text-neutral-700">
                        Transitions maintain continuity while shifting context and meaning.
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
                  <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">Media structure</div>
                  <p className="mt-2 text-sm text-neutral-700">
                    A loop-based hero establishes atmosphere, while still frames isolate hierarchy and key
                    interface states.
                  </p>
                </div>

                <div className="rounded-[20px] border border-neutral-100 bg-white/72 p-4 backdrop-blur-[2px] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:border-neutral-200 hover:bg-white/88 hover:shadow-[0_12px_24px_rgba(17,17,17,0.045)]">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">Interaction logic</div>
                  <p className="mt-2 text-sm text-neutral-700">
                    Navigation is embedded into pacing rather than exposed as explicit UI layers.
                  </p>
                </div>

                <div className="rounded-[20px] border border-neutral-100 bg-white/72 p-4 backdrop-blur-[2px] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:border-neutral-200 hover:bg-white/88 hover:shadow-[0_12px_24px_rgba(17,17,17,0.045)]">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">System potential</div>
                  <p className="mt-2 text-sm text-neutral-700">
                    The same structure can scale into product-facing surfaces without losing clarity.
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
              <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">Production relevance</div>

              <h3 className="mt-3 text-2xl tracking-[-0.03em] md:text-3xl">
                Concept that translates into build-ready systems.
              </h3>

              <div className="mt-12 grid gap-5 md:grid-cols-[1fr_1fr_1fr]">
                <motion.div
                  className="rounded-[20px] border border-neutral-100/80 bg-white/68 p-4 backdrop-blur-[2px] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:border-neutral-200 hover:bg-white/82 hover:shadow-[0_10px_22px_rgba(17,17,17,0.04)]"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.68, delay: 0.02, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">Reusable logic</div>
                  <p className="mt-2 text-sm text-neutral-700">
                    Interaction patterns can be reused across multiple surfaces and flows.
                  </p>
                </motion.div>

                <motion.div
                  className="rounded-[20px] border border-neutral-100/80 bg-white/68 p-4 backdrop-blur-[2px] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:border-neutral-200 hover:bg-white/82 hover:shadow-[0_10px_22px_rgba(17,17,17,0.04)]"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.68, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">Modular structure</div>
                  <p className="mt-2 text-sm text-neutral-700">
                    Designed as composable components rather than one-off visual scenes.
                  </p>
                </motion.div>

                <motion.div
                  className="rounded-[20px] border border-neutral-100/80 bg-white/68 p-4 backdrop-blur-[2px] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:border-neutral-200 hover:bg-white/82 hover:shadow-[0_10px_22px_rgba(17,17,17,0.04)]"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.68, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">Launch-aware</div>
                  <p className="mt-2 text-sm text-neutral-700">
                    Balances visual atmosphere with clarity, performance, and usability.
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
              <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">Next step</div>
              <h3 className="mt-4 max-w-[22ch] text-xl leading-[1.12] tracking-[-0.025em] text-neutral-900 md:text-2xl">
                If this direction aligns, the next step is defining scope, motion grammar, and production depth.
              </h3>

              <div className="mt-6">
                <ActionPill
                  onClick={() => onOpenProject?.()}
                  aria-haspopup="dialog"
                  className="hover:shadow-[0_10px_24px_rgba(17,17,17,0.10)]"
                >
                  {t.nav.start}
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
                  onClick={() => openPath(navigate, `/immersive/${prev.slug}`, onCloseProject)}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-1px] hover:border-neutral-300 hover:text-neutral-900"
                >
                  <span className="text-neutral-400">←</span> Prev study
                </button>
              ) : null}

              {next ? (
                <button
                  type="button"
                  onClick={() => openPath(navigate, `/immersive/${next.slug}`, onCloseProject)}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-1px] hover:border-neutral-300 hover:text-neutral-900"
                >
                  Next study <span className="text-neutral-400">→</span>
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
