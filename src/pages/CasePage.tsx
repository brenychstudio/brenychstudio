import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { startSpaPageTransition } from "../ui/pageTransition";
import Header from "../ui/Header";
import Container from "../ui/Container";
import PageSurface from "../ui/PageSurface";
import { cases, type Case, type CaseContent, type CaseFrame } from "../data/cases";
import { fluidCaseI18n } from "../data/fluidCaseI18n";
import type { CaseCoverTone } from "../ui/work/caseCover.types";
import { AnimatePresence, motion } from "framer-motion";
import ActionPill from "../ui/ActionPill";
import CaseStatusPill from "../ui/status/CaseStatusPill";
import CaseMotionProof from "../ui/work/CaseMotionProof";
import CaseMobileShowcase from "../ui/work/CaseMobileShowcase";
import { useLocale } from "../store/useLocale";

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
};

const PLACEHOLDER_VALUES = new Set([
  "",
  "-",
  "--",
  "---",
  "...",
  "�",
  "n/a",
  "na",
  "tbd",
  "todo",
  "coming soon",
  "add links later",
]);

function safeLabel(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function cleanText(value?: string | null) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim();
}

function hasMeaningfulText(value?: string | null) {
  const normalized = cleanText(value).toLowerCase();
  if (!normalized) return false;
  if (PLACEHOLDER_VALUES.has(normalized)) return false;
  if (/^[._\-/|\\]+$/.test(normalized)) return false;
  return true;
}

function normalizeFrame(frame?: CaseFrame | null): CaseFrame | null {
  if (!frame || !hasMeaningfulText(frame.src)) return null;

  const normalized: CaseFrame = {
    ...frame,
    src: cleanText(frame.src),
  };

  if (hasMeaningfulText(frame.alt)) normalized.alt = cleanText(frame.alt);
  else delete normalized.alt;

  if (hasMeaningfulText(frame.caption)) normalized.caption = cleanText(frame.caption);
  else delete normalized.caption;

  return normalized;
}

function isValidExternalLink(href: string) {
  try {
    const u = new URL(href);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function getCompletenessLabel(value?: string) {
  if (value === "full") return "Full case";
  if (value === "in-progress") return "In progress";
  if (value === "preview") return "Preview";
  return "";
}

function CaseImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt?: string;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden bg-neutral-50">
      <div
        className={[
          "absolute inset-0 transition-opacity duration-500",
          loaded ? "opacity-0" : "opacity-100",
        ].join(" ")}
      >
        <div className="h-full w-full bg-neutral-100" />
      </div>

      <img
        src={src}
        alt={alt ?? ""}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={[
          "block h-auto w-full transition duration-700",
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.01]",
        ].join(" ")}
      />
    </div>
  );
}

function CaseVideo({
  src,
  poster,
  autoplay = false,
  muted = false,
  loop = false,
  controls = true,
}: {
  src: string;
  poster?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}) {
  return (
    <div className="relative overflow-hidden bg-neutral-50">
      <video
        src={src}
        poster={poster}
        className="block h-auto w-full"
        playsInline
        preload="metadata"
        autoPlay={autoplay}
        muted={autoplay ? true : muted}
        loop={loop}
        controls={controls}
      />
    </div>
  );
}

function CaseMedia({
  frame,
  priority = false,
  tone,
}: {
  frame: CaseFrame;
  priority?: boolean;
  tone?: CaseCoverTone;
}) {
  const kind = frame.kind ?? "image";

  if (kind === "video") {
    return (
      <CaseVideo
        src={frame.src}
        poster={frame.poster}
        autoplay={frame.autoplay}
        muted={frame.muted}
        loop={frame.loop}
        controls={frame.controls}
      />
    );
  }

  const image = <CaseImage src={frame.src} alt={frame.alt ?? ""} priority={priority} />;

  if (!tone) return image;

  return <CaseMediaShell tone={tone}>{image}</CaseMediaShell>;
}

const caseToneShellMap: Record<
  CaseCoverTone,
  {
    shell: string;
    frame: string;
    halo?: string;
  }
> = {
  light: {
    shell:
      "rounded-[20px] border border-black/[0.045] bg-[#f6f6f7] p-1.5 shadow-[0_10px_22px_rgba(15,23,42,0.028)] sm:rounded-[24px] sm:p-2",
    frame: "overflow-hidden rounded-[16px] border border-black/[0.045] bg-[#ffffff] sm:rounded-[20px]",
    halo: "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.52)]",
  },
  dark: {
    shell:
      "rounded-[20px] border border-black/[0.04] bg-white p-1.5 shadow-[0_12px_28px_rgba(15,23,42,0.03)] sm:rounded-[24px] sm:p-2",
    frame: "overflow-hidden rounded-[16px] border border-black/[0.04] bg-neutral-50 sm:rounded-[20px]",
  },
  mixed: {
    shell:
      "rounded-[20px] border border-black/[0.045] bg-[#f5f5f6] p-1.5 shadow-[0_10px_22px_rgba(15,23,42,0.026)] sm:rounded-[24px] sm:p-2",
    frame: "overflow-hidden rounded-[16px] border border-black/[0.045] bg-white/96 sm:rounded-[20px]",
    halo: "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.36)]",
  },
};

function CaseMediaShell({
  tone,
  children,
}: {
  tone: CaseCoverTone;
  children: React.ReactNode;
}) {
  const shell = caseToneShellMap[tone];

  return (
    <div className={`relative ${shell.shell}`}>
      {shell.halo ? (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 rounded-[20px] sm:rounded-[24px] ${shell.halo}`}
        />
      ) : null}

      <div className={`relative ${shell.frame}`}>{children}</div>
    </div>
  );
}

function buildDesktopRows(frames: CaseFrame[]) {
  const rows: Array<
    | { type: "full"; frames: [CaseFrame] }
    | { type: "window"; frames: [CaseFrame] }
    | { type: "two-up"; frames: [CaseFrame, CaseFrame] }
  > = [];

  let i = 0;

  while (i < frames.length) {
    const current = frames[i];
    const next = frames[i + 1];

    if (current.width === "full") {
      rows.push({ type: "full", frames: [current] });
      i += 1;
      continue;
    }

    if (next && next.width !== "full") {
      rows.push({ type: "two-up", frames: [current, next] });
      i += 2;
      continue;
    }

    rows.push({ type: "window", frames: [current] });
    i += 1;
  }

  return rows;
}

function MobileFrameCard({
  frame,
  label,
  onOpen,
  maxWidthClass = "max-w-none",
  tone,
}: {
  frame: CaseFrame;
  label: string;
  onOpen: (src: string) => void;
  maxWidthClass?: string;
  tone?: CaseCoverTone;
}) {
  return (
    <figure className={`w-full ${maxWidthClass}`}>
      <button
        type="button"
        onClick={() => onOpen(frame.src)}
        className="block w-full text-left"
      >
        <div className="transition">
          <CaseMedia frame={frame} tone={tone} />
        </div>
      </button>

      {frame.caption ? (
        <figcaption className="mt-3 grid gap-2.5 text-neutral-500">
          <div className="h-px w-12 bg-neutral-200" />
          <div className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">
            {label}
          </div>
          <div className="text-[14px] leading-[1.75] text-neutral-700 md:text-[15px]">
            {frame.caption}
          </div>
        </figcaption>
      ) : null}
    </figure>
  );
}

const lightboxEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const lightboxOverlayTransition = {
  duration: 0.28,
  ease: lightboxEase,
};

const lightboxPanelTransition = {
  duration: 0.26,
  ease: lightboxEase,
};

const lightboxImageTransition = {
  duration: 0.24,
  ease: lightboxEase,
};

const FLUID_SLUG = "fluid-exhibition" as const;

const fluidStatusLabels = {
  en: "Shipped",
  es: "Publicado",
  ua: "Запущено",
  ru: "Запущено",
} as const;

const fluidCreditLabels = {
  en: { role: "Role", stack: "Stack", status: "Status" },
  es: { role: "Rol", stack: "Stack", status: "Estado" },
  ua: { role: "Роль", stack: "Стек", status: "Статус" },
  ru: { role: "Роль", stack: "Стек", status: "Статус" },
} as const;

const fluidLinkLabels = {
  en: "Live site",
  es: "Sitio online",
  ua: "Сайт",
  ru: "Сайт",
} as const;

function getLocalizedCase(data: Case, locale: keyof typeof fluidCaseI18n): Case {
  if (data.slug !== FLUID_SLUG) return data;

  const copy = fluidCaseI18n[locale] ?? fluidCaseI18n.en;
  const creditLabels = fluidCreditLabels[locale] ?? fluidCreditLabels.en;
  const statusLabel = fluidStatusLabels[locale] ?? fluidStatusLabels.en;
  const liveSiteLabel = fluidLinkLabels[locale] ?? fluidLinkLabels.en;

  let imageFrameIndex = 0;

  return {
    ...data,
    statusLabel,
    tagline: copy.tagline,
    statusNote: copy.statusNote,
    poster: {
      ...data.poster,
      alt: copy.posterAlt,
    },
    content: data.content
      ? {
          ...data.content,
          summary: copy.summary,
          problem: copy.problem,
          approach: copy.approach,
          outcome: copy.outcome,
          clarity: copy.clarity,
          motion: copy.motion,
          build: copy.build,
          notes: copy.notes,
          hero: data.content.hero
            ? {
                ...data.content.hero,
                alt:
                  (data.content.hero.kind ?? "image") === "video"
                    ? copy.videoAlt
                    : copy.posterAlt,
                caption: copy.heroCaption,
              }
            : data.content.hero,
          frames: (data.content.frames ?? []).map((frame) => {
            if ((frame.kind ?? "image") === "video") {
              return {
                ...frame,
                alt: copy.videoAlt,
                caption: copy.heroCaption,
              };
            }

            const translated = copy.frames[imageFrameIndex];
            imageFrameIndex += 1;

            return translated
              ? {
                  ...frame,
                  alt: translated.alt,
                  caption: translated.caption,
                }
              : frame;
          }),
          credits: [
            { label: creditLabels.role, value: data.roleLabel },
            { label: creditLabels.stack, value: data.stackLabel },
            { label: creditLabels.status, value: statusLabel },
          ],
          links: (data.content.links ?? []).map((link, index) =>
            index === 0 ? { ...link, label: liveSiteLabel } : link
          ),
        }
      : data.content,
  };
}

export default function CasePage({
  drawerOpen = false,
  onOpenProject,
  onCloseProject,
}: PageProps) {
  const { t, locale } = useLocale();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [notesOpen, setNotesOpen] = useState(false);

  const baseData = useMemo(() => cases.find((c) => c.slug === slug) ?? null, [slug]);
  const data = useMemo(
    () => (baseData ? getLocalizedCase(baseData, locale) : null),
    [baseData, locale]
  );

  const idx = baseData ? cases.findIndex((c) => c.slug === baseData.slug) : -1;
  const prev = idx > 0 ? cases[idx - 1] : null;
  const next = idx >= 0 && idx < cases.length - 1 ? cases[idx + 1] : null;
  const caseTone: CaseCoverTone = data?.coverTone ?? "mixed";

  const content = useMemo<CaseContent>(() => {
    if (!data) return {};

    const raw = data.content ?? {};

    const hero =
      normalizeFrame(raw.hero) ??
      normalizeFrame({ src: data.poster.src, alt: data.poster.alt }) ??
      undefined;

    const frames = (raw.frames ?? [])
      .map((frame) => normalizeFrame(frame))
      .filter((frame): frame is CaseFrame => Boolean(frame));

    const creditsFromContent = (raw.credits ?? [])
      .map((credit) => ({
        label: cleanText(credit.label),
        value: cleanText(credit.value),
      }))
      .filter((credit) => hasMeaningfulText(credit.label) && hasMeaningfulText(credit.value));

    const fallbackCredits = [
      { label: "Role", value: safeLabel(data.roleLabel) },
      { label: "Stack", value: safeLabel(data.stackLabel) },
      { label: "Status", value: safeLabel(data.statusLabel) },
    ].filter((credit) => hasMeaningfulText(credit.value));

    const links = (raw.links ?? [])
      .map((link) => ({
        label: cleanText(link.label),
        href: cleanText(link.href),
      }))
      .filter((link) => hasMeaningfulText(link.label) && isValidExternalLink(link.href));

    return {
      hero,
      frames,
      summary: hasMeaningfulText(raw.summary) ? cleanText(raw.summary) : undefined,
      problem: hasMeaningfulText(raw.problem) ? cleanText(raw.problem) : undefined,
      approach: hasMeaningfulText(raw.approach) ? cleanText(raw.approach) : undefined,
      outcome: hasMeaningfulText(raw.outcome) ? cleanText(raw.outcome) : undefined,
      clarity: hasMeaningfulText(raw.clarity) ? cleanText(raw.clarity) : undefined,
      motion: hasMeaningfulText(raw.motion) ? cleanText(raw.motion) : undefined,
      build: hasMeaningfulText(raw.build) ? cleanText(raw.build) : undefined,
      notes: hasMeaningfulText(raw.notes) ? raw.notes?.trim() : undefined,
      credits: creditsFromContent.length ? creditsFromContent : fallbackCredits,
      links,
    };
  }, [data]);

  const summary = cleanText(content.summary);
  const statusNote = data?.statusNote?.trim() ?? "";
  const notesText = content.notes?.trim() ?? "";
  const hasNotes = hasMeaningfulText(notesText);
  const isBarcelonaCase = data?.slug === "bcn-advisory";

  const desktopFrames = (content.frames ?? []).filter(
    (f) => (f.kind ?? "image") !== "video" && (f.device ?? "desktop") !== "mobile"
  );

  const mobileFrames = (content.frames ?? []).filter(
    (f) => (f.kind ?? "image") !== "video" && (f.device ?? "desktop") === "mobile"
  );

  const videoFrames = (content.frames ?? []).filter(
    (f) => (f.kind ?? "image") === "video"
  );
  const barcelonaMotionCaption =
    cleanText(videoFrames[0]?.caption) ||
    "Motion walkthrough of shortlist, lightbox, and intake navigation flow.";

  const desktopRows = buildDesktopRows(desktopFrames);

  const lightboxFrames = (content.frames ?? []).filter(
    (f) => (f.kind ?? "image") !== "video"
  );

  const shouldUseFullMediaLayout =
    desktopRows.length > 0 || mobileFrames.length > 0 || videoFrames.length > 0;

  const proofItems = [
    { label: "Problem", value: content.problem },
    { label: "Approach", value: content.approach },
    { label: "Outcome", value: content.outcome },
    { label: "Clarity", value: content.clarity },
    { label: "Motion", value: content.motion },
    { label: "Build", value: content.build },
  ].filter((item) => hasMeaningfulText(item.value));

  const hasProofSurface = hasMeaningfulText(summary) || proofItems.length > 0;
  const hasLinks = (content.links?.length ?? 0) > 0;
  const completenessLabel = getCompletenessLabel(data?.completeness);
  const defaultCoverMarkers = [
    data ? safeLabel(data.roleLabel) : "",
    data ? safeLabel(data.stackLabel) : "",
  ].filter((marker) => hasMeaningfulText(marker));
  const barcelonaCoverMarkers = ["EN / ES", "Advisory product", "Shortlist-first"];
  const coverMarkers = isBarcelonaCase ? barcelonaCoverMarkers : defaultCoverMarkers;
  const barcelonaClosingThesis =
    "A premium advisory surface built to reduce noise and support better property decisions.";
  const barcelonaClosingPoints = [
    "Advisory instead of catalog: curated shortlist logic over volume-heavy browsing.",
    "Shortlist-first decision support with district-aware discovery and comparison flow.",
    "Bilingual EN/ES product structure ready to scale toward CMS, CRM, and live inventory.",
  ];
  const barcelonaProductionFacts = [
    { label: "Role", value: data ? safeLabel(data.roleLabel) : "" },
    { label: "Stack", value: data ? safeLabel(data.stackLabel) : "" },
    { label: "Status", value: data ? safeLabel(data.statusLabel) : "" },
    { label: "Languages", value: "EN / ES" },
  ].filter((item) => hasMeaningfulText(item.value));
  const productionFacts = isBarcelonaCase
    ? barcelonaProductionFacts
    : (content.credits ?? []).filter(
        (item) => hasMeaningfulText(item.label) && hasMeaningfulText(item.value)
      );
  const hasClosingNarrative = isBarcelonaCase || hasProofSurface || hasLinks;
  const primaryExternalLink = hasLinks ? (content.links ?? [])[0] ?? null : null;
  const extraLinks = primaryExternalLink ? (content.links ?? []).slice(1) : [];

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback(
    (src: string) => {
      const idx = lightboxFrames.findIndex((f) => f.src === src);
      if (idx >= 0) setLightboxIndex(idx);
    },
    [lightboxFrames]
  );

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((prevValue) => {
      if (prevValue === null) return prevValue;
      return prevValue === 0 ? lightboxFrames.length - 1 : prevValue - 1;
    });
  }, [lightboxFrames.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((prevValue) => {
      if (prevValue === null) return prevValue;
      return prevValue === lightboxFrames.length - 1 ? 0 : prevValue + 1;
    });
  }, [lightboxFrames.length]);

  const currentLightboxFrame =
    lightboxIndex !== null ? lightboxFrames[lightboxIndex] : null;

  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex, closeLightbox, goPrev, goNext]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxIndex]);

  useEffect(() => {
    if (!notesOpen || !hasNotes) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNotesOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [notesOpen, hasNotes]);


  if (!data) {
    return (
      <div className="min-h-screen overflow-x-clip bg-white text-neutral-900">
        <Header
          drawerOpen={drawerOpen}
          onOpenProject={onOpenProject}
          onCloseProject={onCloseProject}
        />
        <main className="pb-20 pt-24 md:pt-28">
          <PageSurface>
            <Container>
            <div className="text-sm text-neutral-600">Case not found.</div>
            <button
              className="mt-6 text-sm border border-neutral-200 rounded-full px-4 py-2 hover:border-neutral-400 transition"
              onClick={() => {
                startSpaPageTransition(navigate, "/work", onCloseProject);
              }}
            >
              {t.work.archive.backToSelected}
            </button>
            </Container>
          </PageSurface>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-white text-neutral-900">
      <Header
        drawerOpen={drawerOpen}
        onOpenProject={onOpenProject}
        onCloseProject={onCloseProject}
      />

      <main className="pt-24 md:pt-28 pb-20">
        <PageSurface>
          <Container>
          <section className="pb-6 md:pb-10">
            <div className="overflow-hidden rounded-[22px] border border-neutral-100 bg-white md:rounded-[28px]">
              <div className="p-4 sm:p-5 md:p-7 xl:p-9">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="text-[11px] tracking-[0.14em] uppercase text-neutral-500">
                      {data.code} / {data.year}
                      {completenessLabel ? ` / ${completenessLabel}` : ""}
                    </div>
                    <CaseStatusPill kind={data.statusKind} label={data.statusLabel} />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      startSpaPageTransition(navigate, "/work", onCloseProject);
                    }}
                    className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] tracking-[0.14em] uppercase text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900"
                  >
                    {t.work.archive.backToSelected} <span className="text-neutral-400">&rarr;</span>
                  </button>
                </div>

                <h1 className="mt-5 max-w-[12ch] text-[24px] leading-[1.02] tracking-[-0.04em] text-neutral-900 sm:max-w-[14ch] sm:text-[34px] md:max-w-[18ch] md:text-[50px] xl:text-[56px]">
                  {data.title}
                </h1>

                <p className="mt-4 max-w-[64ch] text-[14px] leading-[1.75] text-neutral-600 md:text-[15px] md:leading-8">
                  {data.tagline}
                </p>

                {!isBarcelonaCase && hasMeaningfulText(summary) ? (
                  <p className="mt-3 max-w-[72ch] text-[14px] leading-[1.75] text-neutral-600 md:text-[15px] md:leading-8">
                    {summary}
                  </p>
                ) : null}

                {coverMarkers.length ? (
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {coverMarkers.map((marker) => (
                      <span
                        key={marker}
                        className="inline-flex items-center whitespace-nowrap rounded-full border border-neutral-200/90 bg-white/72 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-neutral-500 backdrop-blur-[2px] transition duration-300"
                      >
                        {marker}
                      </span>
                    ))}
                  </div>
                ) : null}

                {statusNote ? (
                  <p className="mt-4 max-w-[72ch] text-[13px] leading-[1.8] text-neutral-500 md:text-[14px]">
                    {statusNote}
                  </p>
                ) : null}

                <div className="mt-5 flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5">
                  <ActionPill
                    onClick={() => onOpenProject?.()}
                    className="min-h-[38px] w-full justify-center px-3 py-1.5 text-[10px] tracking-[0.14em] sm:min-h-[40px] sm:w-auto sm:px-3.5 sm:text-[11px]"
                    aria-haspopup="dialog"
                  >
                    {t.nav.start}
                  </ActionPill>

                  {primaryExternalLink ? (
                    <a
                      href={primaryExternalLink.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-[38px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-neutral-200/90 bg-white/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-neutral-600 transition duration-300 hover:border-neutral-300 hover:bg-white hover:text-neutral-900 sm:min-h-[40px] sm:w-auto sm:px-3.5"
                    >
                      <span>{primaryExternalLink.label}</span>
                      <span aria-hidden="true" className="text-neutral-400">↗</span>
                    </a>
                  ) : null}

                  {hasNotes ? (
                    <ActionPill
                      onClick={() => setNotesOpen(true)}
                      suffix="->"
                      className="min-h-[38px] w-full justify-center border-neutral-200/90 bg-white/70 px-3 py-1.5 text-[11px] tracking-[0.14em] text-neutral-600 hover:border-neutral-300 hover:bg-white hover:text-neutral-900 sm:min-h-[40px] sm:w-auto sm:px-3.5"
                      aria-haspopup="dialog"
                    >
                      Notes
                    </ActionPill>
                  ) : null}
                </div>
              </div>

              {content.hero ? (
                <figure className="px-2 pb-2 sm:px-3 sm:pb-3 md:px-4 md:pb-4">
                  <CaseMedia frame={content.hero} priority tone={caseTone} />

                  {content.hero.caption ? (
                    <figcaption className="mt-4 px-3 pb-2 max-w-[820px] grid gap-3 text-neutral-500">
                      <div className="h-px w-12 bg-neutral-200" />
                      <div className="text-sm leading-7 text-neutral-600">{content.hero.caption}</div>
                    </figcaption>
                  ) : null}
                </figure>
              ) : null}
            </div>
          </section>

          <section className="border-t border-neutral-100 pt-6 md:pt-10">
            <div className="grid gap-8 md:gap-10">

              {shouldUseFullMediaLayout ? (
                <div className="grid gap-10">
                  {desktopRows.length ? (
                    <>
                      <section className="grid gap-8 lg:hidden">
                        <div className="max-w-[760px]">
                          <div className="text-[11px] tracking-[0.14em] uppercase text-neutral-400">
                            Desktop showcase
                          </div>
                          <div className="mt-3 text-[14px] leading-[1.75] text-neutral-600">
                            Core desktop views, decision surfaces, and editorial sequencing across the main case surface.
                          </div>
                        </div>

                        <div className="grid gap-8">
                          {desktopFrames.map((frame, index) => (
                            <MobileFrameCard
                              key={`${frame.src}-${index}`}
                              frame={frame}
                              label={`Frame ${String(index + 1).padStart(2, "0")}`}
                              onOpen={openLightbox}
                              tone={caseTone}
                            />
                          ))}
                        </div>
                      </section>

                      <section className="hidden gap-12 md:gap-16 lg:grid">
                        <div className="max-w-[760px]">
                          <div className="text-[11px] tracking-[0.14em] uppercase text-neutral-400">
                            Desktop showcase
                          </div>
                          <div className="mt-4 text-sm leading-7 text-neutral-600 md:leading-8">
                            Core desktop views, decision surfaces, and editorial sequencing across the main case surface.
                          </div>
                        </div>

                        <div className="grid gap-14 md:gap-18">
                          {desktopRows.map((row, rowIndex) => {
                            const frameBaseIndex =
                              desktopRows
                                .slice(0, rowIndex)
                                .reduce((sum, prevRow) => sum + prevRow.frames.length, 0) + 1;

                            if (row.type === "full") {
                              const f = row.frames[0];

                              return (
                                <figure key={`${f.src}-${rowIndex}`} className="w-full">
                                  <button
                                    type="button"
                                    onClick={() => openLightbox(f.src)}
                                    className="block w-full text-left"
                                  >
                                    <div className="transition">
                                      <CaseMedia frame={f} tone={caseTone} />
                                    </div>
                                  </button>

                                  {f.caption ? (
                                    <figcaption className="mt-4 max-w-[820px] grid gap-3 text-neutral-500">
                                      <div className="h-px w-12 bg-neutral-200" />
                                      <div className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                                        Frame {String(frameBaseIndex).padStart(2, "0")}
                                      </div>
                                      <div className="text-[15px] leading-[1.75] text-neutral-700">{f.caption}</div>
                                    </figcaption>
                                  ) : null}
                                </figure>
                              );
                            }

                            if (row.type === "two-up") {
                              return (
                                <div key={`row-${rowIndex}`} className="grid gap-6 md:grid-cols-2">
                                  {row.frames.map((f, colIndex) => (
                                    <figure key={`${f.src}-${colIndex}`} className="w-full">
                                      <button
                                        type="button"
                                        onClick={() => openLightbox(f.src)}
                                        className="block w-full text-left"
                                      >
                                        <div className="transition">
                                          <CaseMedia frame={f} tone={caseTone} />
                                        </div>
                                      </button>

                                      {f.caption ? (
                                        <figcaption className="mt-4 max-w-[560px] grid gap-3 text-neutral-500">
                                          <div className="h-px w-12 bg-neutral-200" />
                                          <div className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                                            Frame {String(frameBaseIndex + colIndex).padStart(2, "0")}
                                          </div>
                                          <div className="text-[15px] leading-[1.75] text-neutral-700">{f.caption}</div>
                                        </figcaption>
                                      ) : null}
                                    </figure>
                                  ))}
                                </div>
                              );
                            }

                            const f = row.frames[0];

                            return (
                              <figure
                                key={`${f.src}-${rowIndex}`}
                                className="mx-auto w-[min(100%,980px)]"
                              >
                                <button
                                  type="button"
                                  onClick={() => openLightbox(f.src)}
                                  className="block w-full text-left"
                                >
                                  <div className="transition">
                                    <CaseMedia frame={f} tone={caseTone} />
                                  </div>
                                </button>

                                {f.caption ? (
                                  <figcaption className="mt-4 max-w-[760px] grid gap-3 text-neutral-500">
                                    <div className="h-px w-12 bg-neutral-200" />
                                    <div className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                                      Frame {String(frameBaseIndex).padStart(2, "0")}
                                    </div>
                                    <div className="text-[15px] leading-[1.75] text-neutral-700">{f.caption}</div>
                                  </figcaption>
                                ) : null}
                              </figure>
                            );
                          })}
                        </div>
                      </section>
                    </>
                  ) : null}

                  {videoFrames.length ? (
                    <>
                      <section className="grid gap-8 lg:hidden">
                        <div className="max-w-[760px]">
                          <div className="text-[10px] tracking-[0.14em] uppercase text-neutral-400">
                            Motion proof
                          </div>
                          <div className="mt-2 text-[14px] leading-[1.75] text-neutral-700">
                            {isBarcelonaCase
                              ? barcelonaMotionCaption
                              : cleanText(videoFrames[0]?.caption) ||
                                "Calm motion walkthrough of core interaction flow."}
                          </div>
                        </div>

                        <div className="grid gap-8">
                          {videoFrames.map((f, i) => (
                            <figure key={`${f.src}-${i}`} className="w-full">
                              <div className="overflow-hidden rounded-[20px] border border-neutral-100 bg-neutral-50 sm:rounded-[24px]">
                                <CaseMedia frame={f} />
                              </div>

                              {f.caption && !isBarcelonaCase ? (
                                <figcaption className="mt-3 grid gap-2.5 text-neutral-500">
                                  <div className="h-px w-12 bg-neutral-200" />
                                  <div className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                                    Motion proof
                                  </div>
                                  <div className="text-[14px] leading-[1.75] text-neutral-700 md:text-[15px]">{f.caption}</div>
                                </figcaption>
                              ) : null}
                            </figure>
                          ))}
                        </div>
                      </section>

                      <section className="hidden gap-12 md:gap-16 lg:grid">
                        <div className="max-w-[760px]">
                          <div className="text-[10px] tracking-[0.14em] uppercase text-neutral-400">
                            Motion proof
                          </div>
                          <div className="mt-2.5 text-[15px] leading-[1.75] text-neutral-700">
                            {isBarcelonaCase
                              ? barcelonaMotionCaption
                              : cleanText(videoFrames[0]?.caption) ||
                                "Calm motion walkthrough of core interaction flow."}
                          </div>
                        </div>

                        <div className="grid gap-12">
                          {videoFrames.map((f, i) => (
                            <CaseMotionProof
                              key={`${f.src}-${i}`}
                              src={f.src}
                              poster={f.poster}
                              alt={f.alt ?? ""}
                              label="Motion proof"
                              caption={isBarcelonaCase ? undefined : f.caption}
                              autoplayInView
                            />
                          ))}
                        </div>
                      </section>
                    </>
                  ) : null}

                  {mobileFrames.length > 1 ? (
                    <>
                      <section className="grid gap-8 lg:hidden">
                        <div className="max-w-[760px]">
                          <div className="text-[10px] tracking-[0.14em] uppercase text-neutral-400">
                            Mobile showcase
                          </div>
                          <div className="mt-2 text-[14px] leading-[1.75] text-neutral-700">
                            Handheld views and mobile support surfaces documented as part of the shipped case.
                          </div>
                        </div>

                        <div className="grid justify-items-center gap-8">
                          {mobileFrames.map((frame, index) => (
                            <MobileFrameCard
                              key={`${frame.src}-${index}`}
                              frame={frame}
                              label={`Mobile frame ${String(index + 1).padStart(2, "0")}`}
                              onOpen={openLightbox}
                              maxWidthClass="max-w-[280px] sm:max-w-[320px]"
                            />
                          ))}
                        </div>
                      </section>

                      <div className="hidden lg:block">
                        <CaseMobileShowcase frames={mobileFrames} onOpenFrame={openLightbox} />
                      </div>
                    </>
                  ) : null}

                  {mobileFrames.length === 1 ? (
                    <section className="grid gap-8 md:gap-12">
                      <div className="max-w-[760px]">
                        <div className="text-[10px] tracking-[0.14em] uppercase text-neutral-400">
                          Mobile showcase
                        </div>
                        <div className="mt-2.5 text-[15px] leading-[1.75] text-neutral-700">
                          Single mobile surface presented as documented support for this case.
                        </div>
                      </div>

                      <figure className="w-full max-w-[280px] sm:max-w-[320px]">
                        <button
                          type="button"
                          onClick={() => openLightbox(mobileFrames[0].src)}
                          className="block w-full text-left"
                        >
                          <div className="rounded-[22px] border border-neutral-100 overflow-hidden bg-neutral-50 transition hover:border-neutral-200 sm:rounded-[28px]">
                            <CaseMedia frame={mobileFrames[0]} />
                          </div>
                        </button>

                        {mobileFrames[0].caption ? (
                          <figcaption className="mt-4 grid gap-3 text-neutral-500">
                            <div className="h-px w-12 bg-neutral-200" />
                            <div className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                              Mobile frame 01
                            </div>
                            <div className="text-[15px] leading-[1.75] text-neutral-700">{mobileFrames[0].caption}</div>
                          </figcaption>
                        ) : null}
                      </figure>
                    </section>
                  ) : null}
                </div>
              ) : null}

              {hasClosingNarrative || productionFacts.length ? (
                <div className="grid min-w-0 gap-6 overflow-x-clip">
                  <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)] xl:items-start">
                    {hasClosingNarrative ? (
                      <article className="min-w-0 overflow-hidden rounded-[24px] border border-neutral-100 bg-white px-5 py-5 shadow-[0_10px_30px_rgba(17,17,17,0.02)] sm:rounded-[30px] sm:px-7 sm:py-7 md:px-8 md:py-8">
                        <div className="text-[11px] tracking-[0.14em] uppercase text-neutral-500">
                          Closing proof
                        </div>

                        {isBarcelonaCase ? (
                          <>
                            <h2 className="mt-3 max-w-[18ch] text-[28px] leading-[0.98] tracking-[-0.03em] text-neutral-950 sm:text-[32px] md:text-[36px]">
                              {barcelonaClosingThesis}
                            </h2>

                            <div className="mt-5 grid gap-3">
                              {barcelonaClosingPoints.map((point, index) => (
                                <div key={point}>
                                  {index > 0 ? <div className="my-5 h-px bg-neutral-100" /> : null}
                                  <p className="break-words text-[14px] leading-7 text-neutral-700 md:text-[15px]">{point}</p>
                                </div>
                              ))}
                            </div>

                            <p className="mt-5 max-w-[76ch] break-words text-[14px] leading-7 text-neutral-700 md:text-[15px]">
                              Near-production delivery across home, search, property, district, and intake surfaces with deployment-ready front-end structure.
                            </p>
                          </>
                        ) : (
                          <>
                            {hasMeaningfulText(summary) ? (
                              <p className="mt-3 max-w-[76ch] break-words text-[14px] leading-7 text-neutral-700 md:text-[15px]">{summary}</p>
                            ) : (
                              <p className="mt-3 max-w-[76ch] break-words text-[14px] leading-7 text-neutral-700 md:text-[15px]">
                                {data.tagline}
                              </p>
                            )}

                            {proofItems.length ? (
                              <div className="mt-5 grid gap-3">
                                {proofItems.map((item, index) => (
                                  <div key={item.label}>
                                    {index > 0 ? <div className="my-5 h-px bg-neutral-100" /> : null}
                                    <div className="text-[11px] tracking-[0.14em] uppercase text-neutral-500">
                                      {item.label}
                                    </div>
                                    <p className="mt-2 break-words text-[14px] leading-7 text-neutral-700 md:text-[15px]">{item.value}</p>
                                  </div>
                                ))}
                              </div>
                            ) : null}

                            {extraLinks.length ? (
                              <div className="mt-5 grid gap-2.5">
                                {extraLinks.map((l) => (
                                  <a
                                    key={`${l.label}-${l.href}`}
                                    href={l.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-between gap-6 rounded-xl border border-neutral-100 px-4 py-3 transition hover:border-neutral-200"
                                  >
                                    <div>
                                      <div className="text-sm text-neutral-800">{l.label}</div>
                                      <div className="mt-1 text-xs text-neutral-500 break-all">{l.href}</div>
                                    </div>
                                    <div className="text-sm text-neutral-400">&rarr;</div>
                                  </a>
                                ))}
                              </div>
                            ) : null}
                          </>
                        )}
                      </article>
                    ) : null}

                    {productionFacts.length ? (
                      <aside className="min-w-0 overflow-hidden rounded-[24px] border border-neutral-100 bg-white px-5 py-5 shadow-[0_10px_30px_rgba(17,17,17,0.02)] sm:rounded-[30px] sm:px-7 sm:py-7 md:px-8 md:py-8">
                        <div className="text-[11px] tracking-[0.14em] uppercase text-neutral-500">
                          Production facts
                        </div>

                        <div className="mt-3">
                          {productionFacts.map((item) => (
                            <div
                              key={`${item.label}-${item.value}`}
                              className="grid grid-cols-[72px_1fr] gap-3 border-b border-neutral-100 py-3 last:border-b-0 sm:grid-cols-[92px_1fr] sm:py-3.5"
                            >
                              <div className="text-[10px] tracking-[0.14em] uppercase text-neutral-400">
                                {item.label}
                              </div>
                              <div className="text-[14px] leading-6 text-neutral-800 md:text-[15px]">{item.value}</div>
                            </div>
                          ))}
                        </div>

                        {primaryExternalLink ? (
                          <div className="mt-6 border-t border-neutral-100 pt-5">
                            <a
                              href={primaryExternalLink.href}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-neutral-800 transition duration-300 hover:border-neutral-400 hover:bg-neutral-50"
                            >
                              <span>Visit live site</span>
                              <span aria-hidden="true" className="text-neutral-400">↗</span>
                            </a>
                          </div>
                        ) : null}
                      </aside>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          <section className="mt-10 border-t border-neutral-100 pt-8 sm:mt-12 sm:pt-10">
            <div className={`grid gap-6 ${prev && next ? "md:grid-cols-2 md:gap-10" : "md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10"}`}>
              {prev ? (
                <button
                  type="button"
                  onClick={() => {
                    startSpaPageTransition(navigate, `/work/${prev.slug}`, onCloseProject);
                  }}
                  className="group rounded-[22px] border border-neutral-100 bg-white px-4 py-4 text-left transition duration-300 hover:border-neutral-200 hover:shadow-[0_12px_30px_rgba(17,17,17,0.03)] sm:rounded-[28px] sm:px-6 sm:py-6"
                >
                  <div className="text-[10px] uppercase tracking-[0.14em] text-neutral-400 transition group-hover:text-neutral-700">
                    Prev
                  </div>
                  <div className="mt-3 text-[22px] leading-[1.04] tracking-[-0.028em] text-neutral-950 sm:text-[30px]">{prev.title}</div>
                  <div className="mt-2 max-w-[52ch] text-[14px] leading-[1.7] text-neutral-600">{prev.tagline}</div>
                  <div className="mt-5 inline-flex items-center gap-2 whitespace-nowrap text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition duration-300 group-hover:text-neutral-950">
                    Open <span className="text-neutral-400">&rarr;</span>
                  </div>
                </button>
              ) : (
                <div />
              )}

              {next ? (
                <button
                  type="button"
                  onClick={() => {
                    startSpaPageTransition(navigate, `/work/${next.slug}`, onCloseProject);
                  }}
                  className="group rounded-[22px] border border-neutral-100 bg-white px-4 py-4 text-left transition duration-300 hover:border-neutral-200 hover:shadow-[0_12px_30px_rgba(17,17,17,0.03)] sm:rounded-[28px] sm:px-6 sm:py-6 md:text-right"
                >
                  <div className="text-[10px] uppercase tracking-[0.14em] text-neutral-400 transition group-hover:text-neutral-700">
                    Next
                  </div>
                  <div className="mt-3 text-[22px] leading-[1.04] tracking-[-0.028em] text-neutral-950 sm:text-[30px]">{next.title}</div>
                  <div className="mt-2 max-w-[52ch] text-[14px] leading-[1.7] text-neutral-600 md:ml-auto">{next.tagline}</div>
                  <div className="mt-5 inline-flex items-center gap-2 whitespace-nowrap text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition duration-300 group-hover:text-neutral-950 md:justify-end">
                    Open <span className="text-neutral-400">&rarr;</span>
                  </div>
                </button>
              ) : (
                <div className="flex items-center justify-start md:justify-end md:pt-2">
                  {primaryExternalLink ? (
                    <a
                      href={primaryExternalLink.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-neutral-800 transition duration-300 hover:border-neutral-400 hover:bg-neutral-50"
                    >
                      <span>Open live site</span>
                      <span aria-hidden="true" className="text-neutral-400">↗</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        startSpaPageTransition(navigate, "/work", onCloseProject);
                      }}
                      className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-neutral-800 transition duration-300 hover:border-neutral-400 hover:bg-neutral-50"
                    >
                      <span>{t.work.archive.backToSelected}</span>
                      <span aria-hidden="true" className="text-neutral-400">→</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>
          </Container>
        </PageSurface>
      </main>

      <AnimatePresence>
        {lightboxIndex !== null && currentLightboxFrame ? (
          <motion.div
            className="fixed inset-0 z-[80]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={lightboxOverlayTransition}
          >
            <motion.div
              className="absolute inset-0 bg-white/90 backdrop-blur-md"
              onClick={closeLightbox}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={lightboxOverlayTransition}
            />

            <motion.div
              className="relative z-[81] flex h-full flex-col"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={lightboxPanelTransition}
            >
              <div className="flex items-center justify-between px-6 py-5 md:px-10">
                <div className="text-[11px] tracking-[0.14em] uppercase text-neutral-500">
                  Image viewer / {String(lightboxIndex + 1).padStart(2, "0")} / {String(lightboxFrames.length).padStart(2, "0")}
                </div>

                <motion.button
                  type="button"
                  onClick={closeLightbox}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] tracking-[0.14em] uppercase text-neutral-700 transition hover:border-neutral-400"
                  whileTap={{ scale: 0.98 }}
                >
                  Close <span className="text-neutral-400">&times;</span>
                </motion.button>
              </div>

              <div className="flex flex-1 items-center justify-center px-4 pb-6 sm:px-6 md:px-10">
                <div
                  className="relative w-full max-w-[1400px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentLightboxFrame.src}
                      initial={{ opacity: 0, scale: 0.988, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.992, y: -6 }}
                      transition={lightboxImageTransition}
                      className="w-full"
                    >
                      <img
                        src={currentLightboxFrame.src}
                        alt={currentLightboxFrame.alt ?? ""}
                        className="mx-auto max-h-[72vh] w-auto max-w-full rounded-[18px] border border-neutral-200 bg-white object-contain shadow-[0_24px_80px_rgba(0,0,0,0.05)] sm:max-h-[78vh] sm:rounded-[24px]"
                      />
                    </motion.div>
                  </AnimatePresence>

                  <motion.button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 hidden md:inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white/92 px-4 py-4 text-neutral-700 transition hover:border-neutral-400"
                    whileTap={{ scale: 0.98 }}
                  >
                    &larr;
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={goNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 hidden md:inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white/92 px-4 py-4 text-neutral-700 transition hover:border-neutral-400"
                    whileTap={{ scale: 0.98 }}
                  >
                    &rarr;
                  </motion.button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {currentLightboxFrame.caption ? (
                  <motion.div
                    key={`${currentLightboxFrame.src}-caption`}
                    className="px-6 pb-8 md:px-10"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={lightboxImageTransition}
                  >
                    <div className="mx-auto max-w-[960px] grid gap-3 text-neutral-500">
                      <div className="h-px w-12 bg-neutral-200" />
                      <div className="text-sm leading-7 text-neutral-600">
                        {currentLightboxFrame.caption}
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {notesOpen && hasNotes ? (
          <div className="fixed inset-0 z-[70]">
            <motion.div
              className="absolute inset-0 bg-white/18 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setNotesOpen(false)}
              aria-hidden
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Notes"
              className="absolute right-0 top-0 h-full w-[min(92vw,520px)] overflow-hidden rounded-l-2xl bg-white/58 backdrop-blur-xl border-l border-neutral-200/70 shadow-[0_24px_60px_rgba(0,0,0,0.08)]"
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 520, damping: 46, mass: 0.7 }}
            >
              <div className="h-full overflow-auto">
                <div className="p-7">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <div className="text-[11px] tracking-[0.14em] uppercase text-neutral-500">Notes</div>
                      <div className="mt-3 text-lg tracking-tight text-neutral-900">{data.title}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setNotesOpen(false)}
                      className="shrink-0 whitespace-nowrap text-[11px] tracking-[0.14em] uppercase rounded-full border border-neutral-200/80 bg-white/50 px-4 py-2.5 hover:border-neutral-400 transition"
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-6 text-sm text-neutral-800 leading-relaxed whitespace-pre-line">
                    {notesText}
                  </div>

                  <div className="mt-10 h-[1px] w-full bg-neutral-200/60" />
                  <div className="mt-6 text-xs text-neutral-500">Tip: press ESC to close.</div>
                </div>
              </div>
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
