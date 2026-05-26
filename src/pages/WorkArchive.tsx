import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Header from "../ui/Header";
import Container from "../ui/Container";
import MobileMotionSection from "../ui/mobile-motion/MobileMotionSection";
import PageSurface from "../ui/PageSurface";
import CaseStatusPill from "../ui/status/CaseStatusPill";
import CaseCover from "../ui/work/CaseCover";
import { startSpaPageTransition } from "../ui/pageTransition";
import { useLocale } from "../store/useLocale";
import { cases, type ArchiveCategoryKey, type Case } from "../data/cases";
import { fluidCaseI18n } from "../data/fluidCaseI18n";
import { formIndexCaseI18n } from "../data/formIndexCaseI18n";
import { arcwaveCaseI18n } from "../data/arcwaveCaseI18n";
import { casaNubeCaseI18n } from "../data/casaNubeCaseI18n";
import { printBorderStudioCaseI18n } from "../data/printBorderStudioCaseI18n";
import { houseOfLuneCaseI18n } from "../data/houseOfLuneCaseI18n";
import { creatorOpsCaseI18n } from "../data/creatorOpsCaseI18n";
import { barcelonaAdvisoryCaseI18n } from "../data/barcelonaAdvisoryCaseI18n";

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
};

type FilterKey = "all" | ArchiveCategoryKey;
type SortKey = "new" | "old";

function getCompletenessLabel(
  value: Case["completeness"],
  labels: {
    full: string;
    inProgress: string;
    preview: string;
  }
) {
  if (value === "full") return labels.full;
  if (value === "in-progress") return labels.inProgress;
  if (value === "preview") return labels.preview;
  return "";
}

function getTitleClass(title: string) {
  if (title.length > 26) {
    return "text-[20px] leading-[0.98] tracking-[-0.035em] text-neutral-900 sm:text-[22px] md:text-[27px] xl:text-[29px]";
  }

  return "text-[22px] leading-[0.98] tracking-[-0.035em] text-neutral-900 sm:text-[24px] md:text-[29px] xl:text-[32px]";
}

const archiveEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
const archiveListVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const archiveItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      ease: archiveEase,
    },
  },
};

const filterOrder: ArchiveCategoryKey[] = [
  "software-product",
  "creators-culture",
  "advisory-property",
  "brands",
  "hospitality",
];

const FORM_INDEX_SLUG = "form-index" as const;

function getLocalizedFormIndexCase(
  item: Case,
  locale: keyof typeof formIndexCaseI18n
): Case {
  if (item.slug === FLUID_SLUG) {
    return getLocalizedCase(item, locale);
  }

  if (item.slug !== FORM_INDEX_SLUG) return item;

  const copy = formIndexCaseI18n[locale] ?? formIndexCaseI18n.en;

  let imageFrameIndex = 0;

  return {
    ...item,
    statusLabel: copy.statusLabel,
    tagline: copy.tagline,
    statusNote: copy.statusNote,
    poster: {
      ...item.poster,
      alt: copy.posterAlt,
    },
    content: item.content
      ? {
          ...item.content,
          summary: copy.summary,
          problem: copy.problem,
          approach: copy.approach,
          outcome: copy.outcome,
          clarity: copy.clarity,
          motion: copy.motion,
          build: copy.build,
          notes: copy.notes,
          hero: item.content.hero
            ? {
                ...item.content.hero,
                alt:
                  (item.content.hero.kind ?? "image") === "video"
                    ? copy.videoAlt
                    : copy.posterAlt,
                caption: copy.heroCaption,
              }
            : item.content.hero,
          frames: (item.content.frames ?? []).map((frame) => {
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
            { label: copy.creditLabels.role, value: item.roleLabel },
            { label: copy.creditLabels.stack, value: item.stackLabel },
            { label: copy.creditLabels.status, value: copy.statusLabel },
          ],
          links: (item.content.links ?? []).map((link, index) => {
            if (index === 0) return { ...link, label: copy.linkLabels.live };
            if (index === 1) return { ...link, label: copy.linkLabels.repo };
            return link;
          }),
        }
      : item.content,
  };
}

const ARCWAVE_SLUG = "arcwave-integrations" as const;

function getLocalizedArcwaveCase(
  item: Case,
  locale: keyof typeof arcwaveCaseI18n
): Case {
  if (item.slug !== ARCWAVE_SLUG) return item;

  const copy = arcwaveCaseI18n[locale] ?? arcwaveCaseI18n.en;

  let imageFrameIndex = 0;

  return {
    ...item,
    statusLabel: copy.statusLabel,
    tagline: copy.tagline,
    statusNote: copy.statusNote,
    poster: {
      ...item.poster,
      alt: copy.posterAlt,
    },
    content: item.content
      ? {
          ...item.content,
          summary: copy.summary,
          problem: copy.problem,
          approach: copy.approach,
          outcome: copy.outcome,
          clarity: copy.clarity,
          motion: copy.motion,
          build: copy.build,
          notes: copy.notes,
          hero: item.content.hero
            ? {
                ...item.content.hero,
                alt:
                  (item.content.hero.kind ?? "image") === "video"
                    ? copy.videoAlt
                    : copy.posterAlt,
                caption: copy.heroCaption,
              }
            : item.content.hero,
          frames: (item.content.frames ?? []).map((frame) => {
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
            { label: copy.creditLabels.role, value: item.roleLabel },
            { label: copy.creditLabels.stack, value: item.stackLabel },
            { label: copy.creditLabels.status, value: copy.statusLabel },
          ],
          links: (item.content.links ?? []).map((link, index) => {
            if (index === 0) return { ...link, label: copy.linkLabels.live };
            if (index === 1) return { ...link, label: copy.linkLabels.repo };
            return link;
          }),
        }
      : item.content,
  };
}

const CASA_NUBE_SLUG = "casa-nube" as const;

function getLocalizedCasaNubeCase(
  item: Case,
  locale: keyof typeof casaNubeCaseI18n
): Case {
  if (item.slug !== CASA_NUBE_SLUG) return item;

  const copy = casaNubeCaseI18n[locale] ?? casaNubeCaseI18n.en;

  let imageFrameIndex = 0;

  return {
    ...item,
    statusLabel: copy.statusLabel,
    tagline: copy.tagline,
    statusNote: copy.statusNote,
    poster: {
      ...item.poster,
      alt: copy.posterAlt,
    },
    content: item.content
      ? {
          ...item.content,
          summary: copy.summary,
          problem: copy.problem,
          approach: copy.approach,
          outcome: copy.outcome,
          clarity: copy.clarity,
          motion: copy.motion,
          build: copy.build,
          notes: copy.notes,
          hero: item.content.hero
            ? {
                ...item.content.hero,
                alt:
                  (item.content.hero.kind ?? "image") === "video"
                    ? copy.videoAlt
                    : copy.posterAlt,
                caption: copy.heroCaption,
              }
            : item.content.hero,
          frames: (item.content.frames ?? []).map((frame) => {
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
            { label: copy.creditLabels.role, value: item.roleLabel },
            { label: copy.creditLabels.stack, value: item.stackLabel },
            { label: copy.creditLabels.status, value: copy.statusLabel },
          ],
          links: (item.content.links ?? []).map((link, index) => {
            if (index === 0) return { ...link, label: copy.linkLabels.live };
            if (index === 1) return { ...link, label: copy.linkLabels.repo };
            return link;
          }),
        }
      : item.content,
  };
}

const PRINT_BORDER_STUDIO_SLUG = "print-border-studio" as const;

function getLocalizedPrintBorderStudioCase(
  item: Case,
  locale: keyof typeof printBorderStudioCaseI18n
): Case {
  if (item.slug !== PRINT_BORDER_STUDIO_SLUG) return item;

  const copy = printBorderStudioCaseI18n[locale] ?? printBorderStudioCaseI18n.en;

  let imageFrameIndex = 0;

  return {
    ...item,
    statusLabel: copy.statusLabel,
    tagline: copy.tagline,
    statusNote: copy.statusNote,
    poster: {
      ...item.poster,
      alt: copy.posterAlt,
    },
    content: item.content
      ? {
          ...item.content,
          summary: copy.summary,
          problem: copy.problem,
          approach: copy.approach,
          outcome: copy.outcome,
          clarity: copy.clarity,
          motion: copy.motion,
          build: copy.build,
          notes: copy.notes,
          hero: item.content.hero
            ? {
                ...item.content.hero,
                alt:
                  (item.content.hero.kind ?? "image") === "video"
                    ? copy.videoAlt
                    : copy.posterAlt,
                caption: copy.heroCaption,
              }
            : item.content.hero,
          frames: (item.content.frames ?? []).map((frame) => {
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
            { label: copy.creditLabels.role, value: item.roleLabel },
            { label: copy.creditLabels.stack, value: item.stackLabel },
            { label: copy.creditLabels.status, value: copy.statusLabel },
          ],
          links: (item.content.links ?? []).map((link, index) => {
            if (index === 0) return { ...link, label: copy.linkLabels.live };
            if (index === 1) return { ...link, label: copy.linkLabels.repo };
            return link;
          }),
        }
      : item.content,
  };
}

const HOUSE_OF_LUNE_SLUG = "house-of-lune" as const;

function getLocalizedHouseOfLuneCase(
  item: Case,
  locale: keyof typeof houseOfLuneCaseI18n
): Case {
  if (item.slug !== HOUSE_OF_LUNE_SLUG) return item;

  const copy = houseOfLuneCaseI18n[locale] ?? houseOfLuneCaseI18n.en;

  let imageFrameIndex = 0;

  return {
    ...item,
    statusLabel: copy.statusLabel,
    tagline: copy.tagline,
    statusNote: copy.statusNote,
    poster: {
      ...item.poster,
      alt: copy.posterAlt,
    },
    content: item.content
      ? {
          ...item.content,
          summary: copy.summary,
          problem: copy.problem,
          approach: copy.approach,
          outcome: copy.outcome,
          clarity: copy.clarity,
          motion: copy.motion,
          build: copy.build,
          notes: copy.notes,
          hero: item.content.hero
            ? {
                ...item.content.hero,
                alt:
                  (item.content.hero.kind ?? "image") === "video"
                    ? copy.videoAlt
                    : copy.posterAlt,
                caption: copy.heroCaption,
              }
            : item.content.hero,
          frames: (item.content.frames ?? []).map((frame) => {
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
            { label: copy.creditLabels.role, value: item.roleLabel },
            { label: copy.creditLabels.stack, value: item.stackLabel },
            { label: copy.creditLabels.status, value: copy.statusLabel },
          ],
          links: (item.content.links ?? []).map((link, index) => {
            if (index === 0) return { ...link, label: copy.linkLabels.live };
            if (index === 1) return { ...link, label: copy.linkLabels.repo };
            return link;
          }),
        }
      : item.content,
  };
}

const CREATOROPS_SLUG = "creatorops" as const;

function getLocalizedCreatorOpsCase(
  item: Case,
  locale: keyof typeof creatorOpsCaseI18n
): Case {
  if (item.slug !== CREATOROPS_SLUG) return item;

  const copy = creatorOpsCaseI18n[locale] ?? creatorOpsCaseI18n.en;

  let imageFrameIndex = 0;

  return {
    ...item,
    statusLabel: copy.statusLabel,
    tagline: copy.tagline,
    statusNote: copy.statusNote,
    poster: {
      ...item.poster,
      alt: copy.posterAlt,
    },
    content: item.content
      ? {
          ...item.content,
          summary: copy.summary,
          problem: copy.problem,
          approach: copy.approach,
          outcome: copy.outcome,
          clarity: copy.clarity,
          motion: copy.motion,
          build: copy.build,
          notes: copy.notes,
          hero: item.content.hero
            ? {
                ...item.content.hero,
                alt:
                  (item.content.hero.kind ?? "image") === "video"
                    ? copy.videoAlt
                    : copy.posterAlt,
                caption: copy.heroCaption,
              }
            : item.content.hero,
          frames: (item.content.frames ?? []).map((frame) => {
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
            { label: copy.creditLabels.role, value: item.roleLabel },
            { label: copy.creditLabels.stack, value: item.stackLabel },
            { label: copy.creditLabels.status, value: copy.statusLabel },
          ],
          links: (item.content.links ?? []).map((link, index) => {
            if (index === 0) return { ...link, label: copy.linkLabels.live };
            if (index === 1) return { ...link, label: copy.linkLabels.repo };
            return link;
          }),
        }
      : item.content,
  };
}

const BARCELONA_ADVISORY_SLUG = "bcn-advisory" as const;

function getLocalizedBarcelonaAdvisoryCase(
  item: Case,
  locale: keyof typeof barcelonaAdvisoryCaseI18n
): Case {
  if (item.slug !== BARCELONA_ADVISORY_SLUG) return item;

  const copy =
    barcelonaAdvisoryCaseI18n[locale] ?? barcelonaAdvisoryCaseI18n.en;

  let imageFrameIndex = 0;

  return {
    ...item,
    statusLabel: copy.statusLabel,
    tagline: copy.tagline,
    statusNote: copy.statusNote,
    poster: {
      ...item.poster,
      alt: copy.posterAlt,
    },
    content: item.content
      ? {
          ...item.content,
          summary: copy.summary,
          problem: copy.problem,
          approach: copy.approach,
          outcome: copy.outcome,
          clarity: copy.clarity,
          motion: copy.motion,
          build: copy.build,
          notes: copy.notes,
          hero: item.content.hero
            ? {
                ...item.content.hero,
                alt:
                  (item.content.hero.kind ?? "image") === "video"
                    ? copy.videoAlt
                    : copy.posterAlt,
                caption: copy.heroCaption,
              }
            : item.content.hero,
          frames: (item.content.frames ?? []).map((frame) => {
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
            { label: copy.creditLabels.role, value: item.roleLabel },
            { label: copy.creditLabels.stack, value: item.stackLabel },
            { label: copy.creditLabels.status, value: copy.statusLabel },
            { label: copy.creditLabels.languages, value: "EN / ES" },
          ],
          links: (item.content.links ?? []).map((link, index) => {
            if (index === 0) return { ...link, label: copy.linkLabels.live };
            if (index === 1) return { ...link, label: copy.linkLabels.repo };
            return link;
          }),
        }
      : item.content,
  };
}

function applyLocalizedSpecialCases(
  item: Case,
  locale: keyof typeof barcelonaAdvisoryCaseI18n
): Case {
  const withFluid = getLocalizedCase(
    item,
    locale as keyof typeof fluidCaseI18n
  );
  const withFormIndex = getLocalizedFormIndexCase(
    withFluid,
    locale as keyof typeof formIndexCaseI18n
  );
  const withArcwave = getLocalizedArcwaveCase(
    withFormIndex,
    locale as keyof typeof arcwaveCaseI18n
  );
  const withCasaNube = getLocalizedCasaNubeCase(
    withArcwave,
    locale as keyof typeof casaNubeCaseI18n
  );
  const withPrintBorderStudio = getLocalizedPrintBorderStudioCase(
    withCasaNube,
    locale as keyof typeof printBorderStudioCaseI18n
  );

  const withHouseOfLune = getLocalizedHouseOfLuneCase(
    withPrintBorderStudio,
    locale as keyof typeof houseOfLuneCaseI18n
  );

  const withCreatorOps = getLocalizedCreatorOpsCase(
    withHouseOfLune,
    locale as keyof typeof creatorOpsCaseI18n
  );

  return getLocalizedBarcelonaAdvisoryCase(
    withCreatorOps,
    locale as keyof typeof barcelonaAdvisoryCaseI18n
  );
}

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

function getLocalizedCase(item: Case, locale: keyof typeof fluidCaseI18n): Case {
  if (item.slug !== FLUID_SLUG) return item;

  const copy = fluidCaseI18n[locale] ?? fluidCaseI18n.en;
  const creditLabels = fluidCreditLabels[locale] ?? fluidCreditLabels.en;
  const statusLabel = fluidStatusLabels[locale] ?? fluidStatusLabels.en;
  const liveSiteLabel = fluidLinkLabels[locale] ?? fluidLinkLabels.en;

  let imageFrameIndex = 0;

  return {
    ...item,
    statusLabel,
    tagline: copy.tagline,
    statusNote: copy.statusNote,
    poster: {
      ...item.poster,
      alt: copy.posterAlt,
    },
    content: item.content
      ? {
          ...item.content,
          summary: copy.summary,
          problem: copy.problem,
          approach: copy.approach,
          outcome: copy.outcome,
          clarity: copy.clarity,
          motion: copy.motion,
          build: copy.build,
          notes: copy.notes,
          hero: item.content.hero
            ? {
                ...item.content.hero,
                alt:
                  (item.content.hero.kind ?? "image") === "video"
                    ? copy.videoAlt
                    : copy.posterAlt,
                caption: copy.heroCaption,
              }
            : item.content.hero,
          frames: (item.content.frames ?? []).map((frame) => {
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
            { label: creditLabels.role, value: item.roleLabel },
            { label: creditLabels.stack, value: item.stackLabel },
            { label: creditLabels.status, value: statusLabel },
          ],
          links: (item.content.links ?? []).map((link, index) =>
            index === 0 ? { ...link, label: liveSiteLabel } : link
          ),
        }
      : item.content,
  };
}

function ArchiveMetaRow({
  item,
  order,
  completenessLabels,
}: {
  item: Case;
  order: number;
  completenessLabels: {
    full: string;
    inProgress: string;
    preview: string;
  };
}) {
  const completeness = getCompletenessLabel(item.completeness, completenessLabels);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] tracking-[0.14em] uppercase text-neutral-500">
      <span>
        {String(order).padStart(2, "0")} &middot; {item.code}
      </span>
      <span className="text-neutral-300">&mdash;</span>
      <span>{item.year}</span>
      {completeness ? (
        <>
          <span className="text-neutral-300">&mdash;</span>
          <span className="text-neutral-400">{completeness}</span>
        </>
      ) : null}
    </div>
  );
}

function ArchiveBottomMeta({
  item,
  labels,
}: {
  item: Case;
  labels: {
    role: string;
    stack: string;
    status: string;
  };
}) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
      <div>
        <div className="text-[10px] tracking-[0.14em] uppercase text-neutral-400">{labels.role}</div>
        <div className="mt-1 text-[14px] leading-[1.5] text-neutral-800">{item.roleLabel}</div>
      </div>

      <div>
        <div className="text-[10px] tracking-[0.14em] uppercase text-neutral-400">{labels.stack}</div>
        <div className="mt-1 text-[14px] leading-[1.5] text-neutral-800">{item.stackLabel}</div>
      </div>

      <div className="sm:col-auto">
        <div className="text-[10px] tracking-[0.14em] uppercase text-neutral-400">{labels.status}</div>
        <div className="mt-1">
          <CaseStatusPill kind={item.statusKind} label={item.statusLabel} />
        </div>
      </div>
    </div>
  );
}

export default function WorkArchive({
  drawerOpen = false,
  onOpenProject,
  onCloseProject,
}: PageProps) {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const { t, locale } = useLocale();

  const [view, setView] = useState<"cards" | "list">("cards");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<SortKey>("new");
  const [activeId, setActiveId] = useState<string | null>(null);

  const archiveCategoryLabels = {
    all: t.work.archive.categories.all,
    "software-product": t.work.archive.categories.softwareProduct,
    "creators-culture": t.work.archive.categories.creatorsCulture,
    "advisory-property": t.work.archive.categories.advisoryProperty,
    brands: t.work.archive.categories.brands,
    hospitality: t.work.archive.categories.hospitality,
  } as const;

  const visibleFilters = useMemo(() => {
    const present = new Set(cases.map((item) => item.archiveCategory));
    return ["all", ...filterOrder.filter((key) => present.has(key))] as FilterKey[];
  }, []);

  const filteredCases = useMemo(() => {
    const base = filter === "all" ? cases : cases.filter((item) => item.archiveCategory === filter);

    return [...base].sort((a, b) => {
      const yearDelta =
        sort === "new" ? Number(b.year) - Number(a.year) : Number(a.year) - Number(b.year);

      if (yearDelta !== 0) return yearDelta;
      return sort === "new"
        ? Number(a.index) - Number(b.index)
        : Number(b.index) - Number(a.index);
    });
  }, [filter, sort]);

  const localizedFilteredCases = useMemo(
    () =>
      filteredCases.map((item) =>
        applyLocalizedSpecialCases(
          item,
          locale as keyof typeof barcelonaAdvisoryCaseI18n
        )
      ),
    [filteredCases, locale]
  );

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
            <MobileMotionSection as="section" variant="threshold" className="pb-8 md:pb-10">
              <div className="max-w-[780px]">
                <div className="text-[11px] tracking-[0.14em] uppercase text-neutral-500">
                  {t.work.hero.label} &middot; {t.work.archive.label}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    startSpaPageTransition(navigate, "/", onCloseProject);
                  }}
                  className="mt-5 inline-flex items-center whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] tracking-[0.14em] uppercase text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900"
                >
                  {t.work.archive.backToSelected} <span className="text-neutral-400">&rarr;</span>
                </button>

                <h1 className="mt-7 max-w-[38rem] text-[28px] leading-[1.02] tracking-[-0.035em] text-neutral-900 sm:text-[34px] md:text-[44px] xl:text-[52px]">
                  {t.work.hero.title}
                </h1>

                <p className="mt-8 max-w-[38rem] text-[15px] leading-[1.7] text-black/60">
                  {t.work.hero.description}
                </p>
              </div>

              <div className="mt-8 border-t border-neutral-100 pt-5">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {visibleFilters.map((key) => {
                      const active = filter === key;
                      const label = archiveCategoryLabels[key];

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFilter(key)}
                          className={[
                            "inline-flex items-center whitespace-nowrap rounded-full border px-3 py-2 text-[11px] tracking-[0.14em] uppercase transition sm:px-4 sm:py-2.5",
                            active
                              ? "border-neutral-900 bg-neutral-900 text-white shadow-[0_8px_18px_rgba(17,17,17,0.08)]"
                              : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900",
                          ].join(" ")}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                    <div className="text-[11px] tracking-[0.14em] uppercase text-neutral-400">
                      {filteredCases.length}{" "}
                      {filteredCases.length === 1
                        ? t.work.case.countSingular
                        : t.work.case.countPlural}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <div className="inline-flex items-center rounded-full border border-neutral-200 p-1">
                        <button
                          type="button"
                          onClick={() => setView("cards")}
                          className={[
                            "inline-flex items-center whitespace-nowrap rounded-full px-3 py-2 text-[11px] tracking-[0.14em] uppercase transition sm:px-4 sm:py-2.5",
                            view === "cards"
                              ? "bg-neutral-900 text-white"
                              : "text-neutral-600 hover:text-neutral-900",
                          ].join(" ")}
                        >
                          {t.work.controls.cards}
                        </button>

                        <button
                          type="button"
                          onClick={() => setView("list")}
                          className={[
                            "inline-flex items-center whitespace-nowrap rounded-full px-3 py-2 text-[11px] tracking-[0.14em] uppercase transition sm:px-4 sm:py-2.5",
                            view === "list"
                              ? "bg-neutral-900 text-white"
                              : "text-neutral-600 hover:text-neutral-900",
                          ].join(" ")}
                        >
                          {t.work.controls.list}
                        </button>
                      </div>

                      <label className="inline-flex items-center gap-3 whitespace-nowrap rounded-full border border-neutral-200 bg-white px-3 py-2 text-[11px] tracking-[0.14em] uppercase text-neutral-500 sm:px-4 sm:py-2.5">
                        <span className="text-neutral-400">{t.work.controls.sort}</span>
                        <select
                          value={sort}
                          onChange={(e) => setSort(e.target.value as SortKey)}
                          className="bg-transparent text-neutral-900 outline-none"
                        >
                          <option value="new">{t.work.controls.newest}</option>
                          <option value="old">{t.work.controls.oldest}</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </MobileMotionSection>

            {view === "cards" ? (
              <MobileMotionSection as="section" variant="media" delay="soft" className="mt-2 border-t border-neutral-100 pt-6">
<motion.div
  className="grid gap-4 lg:grid-cols-2"
  initial={prefersReducedMotion ? undefined : "hidden"}
  animate={prefersReducedMotion ? undefined : "visible"}
  variants={prefersReducedMotion ? undefined : archiveListVariants}
>
                  {localizedFilteredCases.map((item, index) => (
                    <motion.button
                      key={item.slug}
                      type="button"
                      onClick={() => {
                        startSpaPageTransition(navigate, `/work/${item.slug}`, onCloseProject);
                      }}
                      variants={prefersReducedMotion ? undefined : archiveItemVariants}
                      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.997 }}
                      onHoverStart={() => setActiveId(item.slug)}
                      onHoverEnd={() =>
                        setActiveId((current) => (current === item.slug ? null : current))
                      }
                      onFocus={() => setActiveId(item.slug)}
                      onBlur={() => setActiveId((current) => (current === item.slug ? null : current))}
                      className="group block w-full text-left"
                    >
                      <motion.article
                        animate={
                          prefersReducedMotion
                            ? undefined
                            : {
                                opacity: 1,
                                scale: activeId === item.slug ? 1.006 : 1,
                              }
                        }
                        transition={{ duration: 0.3, ease: archiveEase }}
                        className="flex h-full flex-col overflow-hidden rounded-[24px] border border-neutral-100 bg-white p-3 transition-[border-color,box-shadow,transform] duration-300 group-hover:border-neutral-200 group-hover:shadow-[0_18px_42px_rgba(17,17,17,0.045)] sm:p-3.5 md:p-4"
                      >
                        <motion.div
                          animate={
                            prefersReducedMotion
                              ? undefined
                              : {
                                  y: activeId === item.slug ? -2 : 0,
                                  scale: activeId === item.slug ? 1.004 : 1,
                                }
                          }
                          transition={{ duration: 0.32, ease: archiveEase }}
                          className="overflow-hidden rounded-[20px] border border-neutral-200/90 bg-[linear-gradient(180deg,#fbfbfb_0%,#f5f5f4_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
                        >
                          <div className="aspect-[16/10]">
                            <CaseCover
                              src={item.poster.src}
                              alt={item.poster.alt ?? item.title}
                              tone={item.coverTone}
                              focus={item.coverFocus}
                              priority={index < 2}
                              variant="cards"
                            />
                          </div>
                        </motion.div>

                        <div className="mt-3.5 flex flex-1 flex-col">
                          <ArchiveMetaRow
                            item={item}
                            order={index + 1}
                            completenessLabels={t.work.case.completeness}
                          />

                          <div className="mt-2.5 flex items-start justify-between gap-4 sm:min-h-[7.8rem] md:min-h-[8.8rem]">
                            <div className="min-w-0">
                              <motion.h2
                                animate={
                                  prefersReducedMotion
                                    ? undefined
                                    : {
                                        y: activeId === item.slug ? -1 : 0,
                                      }
                                }
                                transition={{ duration: 0.28, ease: archiveEase }}
                                className={getTitleClass(item.title)}
                              >
                                {item.title}
                              </motion.h2>

                              <motion.p
                                animate={
                                  prefersReducedMotion
                                    ? undefined
                                    : {
                                        y: activeId === item.slug ? 1 : 0,
                                      }
                                }
                                transition={{ duration: 0.28, ease: archiveEase }}
                                className="mt-2 max-w-[34ch] text-[14px] leading-[1.68] text-neutral-700 md:text-[15px] md:leading-[1.8]"
                              >
                                {item.tagline}
                              </motion.p>
                            </div>

                            <div className="hidden shrink-0 items-center gap-2 whitespace-nowrap pt-1 text-[11px] tracking-[0.14em] uppercase text-neutral-500 transition duration-300 group-hover:text-neutral-900 md:inline-flex">
                              <span className="opacity-80 transition-opacity duration-300 group-hover:opacity-100">
                                {t.work.case.view}
                              </span>
                              <span className="text-neutral-400 transition-transform duration-300 group-hover:translate-x-[2px]">
                                &rarr;
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 rounded-[18px] border border-neutral-100 bg-neutral-50/65 p-3.5">
                            <ArchiveBottomMeta item={item} labels={t.work.case} />

                            <div className="mt-3 inline-flex items-center gap-2 whitespace-nowrap text-[11px] tracking-[0.14em] uppercase text-neutral-600 transition duration-300 md:hidden">
                              {t.work.case.view} <span className="text-neutral-400">&rarr;</span>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    </motion.button>
                  ))}
                </motion.div>
              </MobileMotionSection>
            ) : (
              <MobileMotionSection as="section" variant="media" delay="soft" className="mt-2 border-t border-neutral-100 pt-6">
<motion.div
  className="space-y-4"
  initial={prefersReducedMotion ? undefined : "hidden"}
  animate={prefersReducedMotion ? undefined : "visible"}
  variants={prefersReducedMotion ? undefined : archiveListVariants}
>
                  {localizedFilteredCases.map((item, index) => (
                    <motion.button
                      key={item.slug}
                      type="button"
                      onClick={() => {
                        startSpaPageTransition(navigate, `/work/${item.slug}`, onCloseProject);
                      }}
                      variants={prefersReducedMotion ? undefined : archiveItemVariants}
                      whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.997 }}
                      onHoverStart={() => setActiveId(item.slug)}
                      onHoverEnd={() =>
                        setActiveId((current) => (current === item.slug ? null : current))
                      }
                      onFocus={() => setActiveId(item.slug)}
                      onBlur={() => setActiveId((current) => (current === item.slug ? null : current))}
                      className="group block w-full text-left"
                    >
                      <motion.article
                        animate={
                          prefersReducedMotion
                            ? undefined
                            : {
                                opacity: 1,
                                scale: activeId === item.slug ? 1.01 : 1,
                              }
                        }
                        transition={{ duration: 0.3, ease: archiveEase }}
                        className="overflow-hidden rounded-[24px] border border-neutral-100 bg-white p-3.5 transition-[border-color,box-shadow,transform] duration-300 group-hover:border-neutral-200 group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.035)] md:p-4"
                      >
<div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-center">
<div className="w-full lg:max-w-[320px]">
                            <div className="aspect-[16/10]">
                              <CaseCover
                                src={item.poster.src}
                                alt={item.poster.alt ?? item.title}
                                tone={item.coverTone}
                                focus={item.coverFocus}
                                priority={index === 0}
                                variant="list"
                              />
                            </div>
                          </div>

<div className="min-w-0 lg:pl-2">
                            <ArchiveMetaRow
                              item={item}
                              order={index + 1}
                              completenessLabels={t.work.case.completeness}
                            />

                            <div className="mt-3 flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <h2 className={getTitleClass(item.title)}>{item.title}</h2>

                                <p className="mt-2 max-w-[40ch] text-sm leading-6 text-neutral-600 md:text-[15px] md:leading-7">
                                  {item.tagline}
                                </p>
                              </div>

                              <div className="hidden shrink-0 items-center gap-2 whitespace-nowrap pt-1 text-[11px] tracking-[0.14em] uppercase text-neutral-500 transition duration-300 group-hover:text-neutral-900 md:inline-flex">
                                {t.work.case.view}
                                <span className="text-neutral-400 transition-transform duration-300 group-hover:translate-x-1">
                                  &rarr;
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 rounded-[18px] border border-neutral-100 bg-neutral-50/65 p-3.5">
                              <ArchiveBottomMeta item={item} labels={t.work.case} />

                              <div className="mt-3 inline-flex items-center gap-2 whitespace-nowrap text-[11px] tracking-[0.14em] uppercase text-neutral-600 transition duration-300 md:hidden">
                                {t.work.case.view} <span className="text-neutral-400">&rarr;</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    </motion.button>
                  ))}
                </motion.div>
              </MobileMotionSection>
            )}

            <MobileMotionSection as="section" variant="closing" delay="soft" className="mt-12 border-t border-neutral-100 pt-5 md:mt-14">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-[11px] tracking-[0.14em] uppercase text-neutral-400">
                    {t.work.archive.closeLabel}
                  </div>
                  <div className="mt-2 text-sm leading-7 text-neutral-600">
                    {t.work.archive.closeDescription}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    startSpaPageTransition(navigate, "/", onCloseProject);
                  }}
                  className="inline-flex items-center whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] tracking-[0.14em] uppercase text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900"
                >
                  {t.work.archive.backToHome} <span className="text-neutral-400">&rarr;</span>
                </button>
              </div>
            </MobileMotionSection>
          </Container>
        </PageSurface>
      </main>
    </div>
  );
}
