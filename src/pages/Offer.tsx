import { motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Header from "../ui/Header";
import Container from "../ui/Container";
import PageSurface from "../ui/PageSurface";
import OfferArtifact from "../ui/OfferArtifact";
import StickySignalStage from "../ui/StickySignalStage";
import RightCircuitStage from "../ui/RightCircuitStage";
import { useLocale } from "../store/useLocale";

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
};

type DeferredMountProps = {
  children: ReactNode;
  minHeight?: number | string;
  className?: string;
  rootMargin?: string;
  eager?: boolean;
};

function DeferredMount({
  children,
  minHeight,
  className,
  rootMargin = "360px 0px",
  eager = false,
}: DeferredMountProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(eager);

  useEffect(() => {
    if (mounted) return;

    let rafA = 0;
    let rafB = 0;

    if (eager) {
      rafA = requestAnimationFrame(() => {
        rafB = requestAnimationFrame(() => {
          setMounted(true);
        });
      });

      return () => {
        cancelAnimationFrame(rafA);
        cancelAnimationFrame(rafB);
      };
    }

    const node = ref.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      rafA = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(rafA);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [mounted, eager, rootMargin]);

  return (
    <div
      ref={ref}
      className={className}
      style={minHeight ? { minHeight } : undefined}
    >
      {mounted ? children : null}
    </div>
  );
}

const pillClass =
  "inline-flex min-h-[40px] items-center justify-center whitespace-nowrap rounded-full border border-neutral-200 bg-white px-3.5 py-2.5 text-center text-[11px] tracking-[0.14em] uppercase text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900 sm:min-h-[42px] sm:px-4";

const sectionLabel = "text-[11px] tracking-[0.14em] uppercase text-neutral-500";

type PracticeId = "brandCommercial" | "conceptInteractive" | "editableOperational";
type PlanId = "base" | "pro" | "studio" | "signature";
type ManagementId = "managed" | "editable" | "custom";

type PracticeSpectrumItem = {
  id: PracticeId;
  index: string;
  label: string;
  name: string;
  description: string;
  details: {
    title: string;
    description: string;
    provenInLabel: string;
    provenIn: string[];
    summary: string;
    focusLabel: string;
    focus: string[];
    stackLabel: string;
    stack: string[];
  };
};

type PackageItem = {
  id: PlanId;
  name: string;
  strap: string;
  price: string;
  description: string;
  bestForLabel: string;
  bestFor: string;
  fitLabel: string;
  fit: string;
  includes: string[];
  cta: string;
};

type ManagementItem = {
  id: ManagementId;
  tabLabel: string;
  title: string;
  subtitle: string;
  price: string;
  description: string;
  tags: string[];
  bestForLabel: string;
  bestFor: string;
  modelLabel: string;
  model: string;
  note: string;
  cta: string;
};

const packageItems: PackageItem[] = [
  {
    id: "base",
    name: "Base",
    strap: "Focused entry",
    price: "\u20AC1,290-\u20AC1,600",
    description:
      "Lean brochure-style websites for smaller businesses, service-led sites, or early premium positioning where speed and clarity matter more than complexity.",
    bestForLabel: "Best for",
    bestFor: "Compact service sites and premium entry-level presence.",
    fitLabel: "Fit",
    includes: [
      "clean premium homepage",
      "core pages and structure",
      "mobile-ready delivery",
    ],
    fit: "For smaller businesses that need a clear and elevated starting point.",
    cta: "Open full pricing PDF",
  },
  {
    id: "pro",
    name: "Pro",
    strap: "Main commercial entry",
    price: "\u20AC2,490",
    description:
      "The main selling package: stronger homepage, more intentional IA, premium visual framing, inquiry / consult logic, and cleaner mobile polish.",
    bestForLabel: "Best for",
    bestFor: "Serious commercial websites with premium presentation needs.",
    fitLabel: "Fit",
    includes: [
      "stronger homepage and IA",
      "consult / inquiry flow",
      "premium visual system",
    ],
    fit: "Best fit for most premium service, advisory, and brand-facing sites.",
    cta: "Open full pricing PDF",
  },
  {
    id: "studio",
    name: "Studio",
    strap: "Broader system build",
    price: "\u20AC4,490",
    description:
      "Premium commercial framing with multilingual structure, stronger SEO layer, selected motion, deeper consultation logic, and more robust deploy readiness.",
    bestForLabel: "Best for",
    bestFor: "Multi-section premium sites and stronger business-facing systems.",
    fitLabel: "Fit",
    includes: [
      "multilingual structure",
      "stronger SEO + content depth",
      "selected motion and polish",
    ],
    fit: "For brands that need more structure, more surface area, and stronger delivery confidence.",
    cta: "Open full pricing PDF",
  },
  {
    id: "signature",
    name: "Signature",
    strap: "Bespoke concept build",
    price: "from \u20AC6,900",
    description:
      "Bespoke concept-led builds for presentation-heavy, art-direction-sensitive, or interactive premium surfaces where atmosphere, motion, and authored interface become part of the value.",
    bestForLabel: "Best for",
    bestFor: "Brand statement pieces, premium digital proof, and interactive showcases.",
    fitLabel: "Fit",
    includes: [
      "bespoke concept framing",
      "authored motion + atmosphere",
      "interactive showcase logic",
    ],
    fit: "For projects where distinction, presentation power, and authored feel matter more than standard brochure structure.",
    cta: "Open full pricing PDF",
  },
];

export default function Offer({
  drawerOpen = false,
  onOpenProject,
  onCloseProject,
}: PageProps) {
  const { t, locale } = useLocale();
  const isWideCyrillic = locale === "ua" || locale === "ru";
  const [activePracticeId, setActivePracticeId] = useState<PracticeId>("brandCommercial");
  const [activeEngagementId, setActiveEngagementId] = useState<PlanId>("pro");
  const [activeManagement, setActiveManagement] = useState<ManagementId>("editable");
  const [isCompactOfferDevice, setIsCompactOfferDevice] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(max-width: 1279px), (hover: none) and (pointer: coarse)");

    const update = () => setIsCompactOfferDevice(media.matches);

    update();
    media.addEventListener?.("change", update);

    return () => media.removeEventListener?.("change", update);
  }, []);

  const practiceSpectrum: PracticeSpectrumItem[] = [
    {
      id: "brandCommercial",
      index: t.offer.spectrum.cards[0].index,
      label: t.offer.spectrum.cards[0].label,
      name: t.offer.spectrum.cards[0].title,
      description: t.offer.spectrum.cards[0].description,
      details: t.offer.selectedDirection.brandCommercial,
    },
    {
      id: "conceptInteractive",
      index: t.offer.spectrum.cards[1].index,
      label: t.offer.spectrum.cards[1].label,
      name: t.offer.spectrum.cards[1].title,
      description: t.offer.spectrum.cards[1].description,
      details: t.offer.selectedDirection.conceptInteractive,
    },
    {
      id: "editableOperational",
      index: t.offer.spectrum.cards[2].index,
      label: t.offer.spectrum.cards[2].label,
      name: t.offer.spectrum.cards[2].title,
      description: t.offer.spectrum.cards[2].description,
      details: t.offer.selectedDirection.editableOperational,
    },
  ];

  const currentPractice =
    practiceSpectrum.find((item) => item.id === activePracticeId) ?? practiceSpectrum[0];

  const engagementPackages = t.offer.engagementModel.plans.map((item) => ({
    id: item.key as PlanId,
    name: item.name,
    strap: item.subtitle,
    price: item.price,
  }));

  const packageDetailsById: Record<PlanId, PackageItem> = {
    base: packageItems[0],
    pro: {
      id: "pro",
      name: t.offer.engagementModel.active.name,
      strap: t.offer.engagementModel.active.subtitle,
      price: t.offer.engagementModel.active.price,
      description: t.offer.engagementModel.active.description,
      bestForLabel: t.offer.engagementModel.active.bestForLabel,
      bestFor: t.offer.engagementModel.active.bestFor,
      fitLabel: t.offer.engagementModel.active.fitLabel,
      fit: t.offer.engagementModel.active.fit,
      includes: t.offer.engagementModel.active.tags,
      cta: t.offer.engagementModel.active.cta,
    },
    studio: packageItems[2],
    signature: packageItems[3],
  };

  const currentPackage = packageDetailsById[activeEngagementId] ?? packageDetailsById.pro;

  const managementItems: ManagementItem[] = [
    {
      id: "managed",
      tabLabel: t.offer.websiteManagement.tabs.managed,
      ...t.offer.websiteManagement.managed,
    },
    {
      id: "editable",
      tabLabel: t.offer.websiteManagement.tabs.editable,
      ...t.offer.websiteManagement.editable,
    },
    {
      id: "custom",
      tabLabel: t.offer.websiteManagement.tabs.custom,
      ...t.offer.websiteManagement.custom,
    },
  ];

  const currentManagement =
    managementItems.find((item) => item.id === activeManagement) ?? managementItems[1];

  const compactPracticeSummary = (text: string) =>
    text.length > 110 ? `${text.slice(0, 110).trim()}...` : text;

  return (
    <div className="min-h-screen overflow-x-clip bg-white text-neutral-900">
      <Header
        drawerOpen={drawerOpen}
        onOpenProject={onOpenProject}
        onCloseProject={onCloseProject}
      />

      <main className="pt-28 md:pt-32 pb-24">
        <PageSurface>
          <Container>
          {/* HERO */}
          <section className="border-b border-neutral-100 pb-16 md:pb-20">
            <div
              className={[
                "grid items-start gap-8 md:gap-10 lg:gap-12",
                "lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]",
                locale === "ua" || locale === "ru"
                  ? "lg:grid-cols-[minmax(0,1.16fr)_minmax(300px,0.84fr)] xl:grid-cols-[minmax(0,1.18fr)_minmax(340px,0.82fr)]"
                  : "",
              ].join(" ")}
            >
              <div
                className={[
                  isWideCyrillic
                    ? "max-w-[42rem] md:max-w-[48rem] xl:max-w-[54rem]"
                    : "max-w-[34rem] md:max-w-[38rem] xl:max-w-[42rem]",
                ].join(" ")}
              >
                <div className={sectionLabel}>{t.offer.hero.label}</div>

                <h1
                  className={[
                    "mt-5 font-normal tracking-[-0.045em] leading-[0.92]",
                    isWideCyrillic
                      ? "text-[34px] leading-[0.94] sm:text-[46px] lg:text-[72px] xl:text-[82px]"
                      : "text-[34px] leading-[0.94] sm:text-[46px] lg:text-[72px] xl:text-[80px]",
                  ].join(" ")}
                >
                  {t.offer.hero.title}
                </h1>

                <p
                  className={[
                    "mt-6 text-[14px] leading-[1.75] text-black/60 sm:mt-8 sm:text-[15px]",
                    isWideCyrillic ? "max-w-[42rem]" : "max-w-[38rem]",
                  ].join(" ")}
                >
                  {t.offer.hero.description}
                </p>
              </div>

              <div className="md:pl-1">
                {isCompactOfferDevice ? (
                  <div className="mx-auto w-full max-w-[520px] overflow-hidden rounded-[28px] border border-black/6 bg-[radial-gradient(120%_100%_at_72%_24%,rgba(130,160,255,0.22)_0%,rgba(130,160,255,0.08)_26%,rgba(255,255,255,0.92)_58%,rgba(255,255,255,0.98)_100%)] p-3 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                    <div className="relative overflow-hidden rounded-[22px] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(250,250,250,0.92)_100%)] px-5 py-6 sm:px-6 sm:py-7">
                      <div className="pointer-events-none absolute inset-y-0 right-[-10%] w-[58%] bg-[radial-gradient(circle_at_40%_35%,rgba(88,128,255,0.16),rgba(88,128,255,0.06)_34%,rgba(88,128,255,0)_72%)]" />
                      <div className="pointer-events-none absolute inset-x-[22%] top-[26%] h-px bg-[linear-gradient(90deg,rgba(17,17,17,0)_0%,rgba(17,17,17,0.10)_36%,rgba(17,17,17,0)_100%)]" />
                      <div className="relative">
                        <div className="text-[10px] tracking-[0.18em] uppercase text-neutral-500">
                          Signal / Surface
                        </div>
                        <div className="mt-3 max-w-[18ch] text-[24px] leading-[0.96] tracking-[-0.05em] text-neutral-950 sm:text-[28px]">
                          Premium visual systems with stable mobile delivery.
                        </div>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {["Premium UI", "Product framing", "Interactive delivery"].map((item) => (
                            <span
                              key={item}
                              className="inline-flex items-center rounded-full border border-neutral-200 bg-white/84 px-3 py-1.5 text-[10px] tracking-[0.14em] uppercase text-neutral-700"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  >
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <DeferredMount
                        eager
                        minHeight={220}
                        className="relative mx-auto w-full overflow-hidden"
                      >
                        <div className="mx-auto w-full max-w-[434px] sm:max-w-[470px] md:max-w-[520px] xl:w-full xl:max-w-none">
                          <OfferArtifact className="mx-auto block h-auto w-full max-w-none md:scale-[0.98] xl:translate-x-8 xl:scale-[1.08] 2xl:translate-x-10 2xl:scale-[1.14]" />
                        </div>
                      </DeferredMount>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
          </section>

          <section className="border-b border-neutral-100 py-4 md:py-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-[11px] tracking-[0.14em] uppercase text-neutral-500">
                {t.offer.materials.label}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                <a
                  href="/docs/price-pack-2026.pdf"
                  download
                  className={pillClass}
                >
                  {t.offer.materials.pricePack}
                </a>

                <a
                  href="/docs/website-management-2026.pdf"
                  download
                  className={pillClass}
                >
                  {t.offer.materials.management}
                </a>
              </div>
            </div>
          </section>

          {/* CAPABILITIES */}
          <section className="border-t border-neutral-100 py-10 md:py-12 xl:py-14">
            <div className="grid gap-5 xl:grid-cols-[150px_minmax(0,1fr)] xl:items-start">
              <div className="pt-4 md:pt-5">
                <div className="text-[11px] tracking-[0.14em] uppercase text-neutral-500 whitespace-nowrap">
                  {t.offer.spectrum.label}
                </div>
              </div>

              <div className="grid gap-4 pt-4 md:pt-5">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {practiceSpectrum.map((item) => {
                    const active = item.id === activePracticeId;

                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        onClick={() => setActivePracticeId(item.id)}
                        whileHover={{ y: -4 }}
                        transition={{ type: "tween", duration: 0.25 }}
                        className={[
                          "group w-full rounded-[22px] border px-4 py-4 text-left transition sm:min-h-[220px]",
                          active
                            ? "border-neutral-300 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                            : "border-neutral-100 bg-white hover:border-neutral-200",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="text-[10px] tracking-[0.14em] uppercase text-neutral-500">
                            {item.index}
                          </div>

                          <div
                            className={[
                              "mt-0.5 h-2.5 w-2.5 rounded-full border transition",
                              active
                                ? "border-neutral-900 bg-neutral-900"
                                : "border-neutral-300 bg-transparent group-hover:border-neutral-400",
                            ].join(" ")}
                          />
                        </div>

                        <div className="mt-3">
                          <div className="text-[10px] tracking-[0.14em] uppercase text-neutral-500">
                            {item.label}
                          </div>

                          <div className="mt-2 text-[18px] md:text-[20px] leading-[0.98] tracking-[-0.04em] text-neutral-900">
                            {item.name}
                          </div>

                          <p className="mt-3 min-h-0 max-w-[30ch] text-[14px] leading-[1.7] text-neutral-600 sm:min-h-[78px] md:text-[16px]">
                            {compactPracticeSummary(item.description)}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="hidden rounded-[20px] border border-neutral-200 bg-white p-8 shadow-[0_10px_28px_rgba(0,0,0,0.035)] xl:block">
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_320px] xl:items-start">
                    <div>
                      <div className="min-h-[1em] text-[10px] tracking-[0.14em] uppercase text-neutral-500">
                        {t.offer.selectedDirection.label}
                      </div>

                      <h3 className="mt-3 min-h-[1em] text-[28px] leading-[0.96] tracking-[-0.03em] text-neutral-950 sm:text-[32px] md:text-[36px] xl:text-[40px]">
                        {currentPractice.details.title}
                      </h3>

                      <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.65] text-neutral-600 md:text-[16px]">
                        {currentPractice.details.description}
                      </p>
                    </div>

                    <div className="rounded-[22px] border border-neutral-100 p-4">
                      <div className="text-[10px] tracking-[0.14em] uppercase text-neutral-500">
                        {currentPractice.details.provenInLabel}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {currentPractice.details.provenIn.map((proof) => (
                          <span
                            key={proof}
                            className="inline-flex items-center whitespace-nowrap rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[12px] tracking-wide text-neutral-700"
                          >
                            {proof}
                          </span>
                        ))}
                      </div>

                      {currentPractice.details.summary ? (
                        <p className="mt-4 text-[15px] leading-[1.65] text-neutral-600 md:text-[16px]">
                          {currentPractice.details.summary}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 border-t border-neutral-100 pt-4 lg:grid-cols-2">
                    <div>
                      <div className="text-[10px] tracking-[0.14em] uppercase text-neutral-500">
                        {currentPractice.details.focusLabel}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {currentPractice.details.focus.map((item) => (
                          <span
                            key={item}
                            className="inline-flex items-center whitespace-nowrap rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[12px] tracking-wide text-neutral-700"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] tracking-[0.14em] uppercase text-neutral-500">
                        {currentPractice.details.stackLabel}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {currentPractice.details.stack.map((item) => (
                          <span
                            key={item}
                            className="inline-flex items-center whitespace-nowrap rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[12px] tracking-wide text-neutral-700"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PACKAGES */}
          <section className="border-t border-neutral-100 py-10 md:py-12 xl:py-14">
            <div className="grid gap-5 xl:grid-cols-[150px_minmax(0,1fr)] xl:items-start">
              <div className="pt-4 md:pt-5">
                <div className={`${sectionLabel} whitespace-nowrap`}>
                  {t.offer.engagementModel.label}
                </div>
              </div>

              <div className="grid gap-4 pt-4 md:pt-5">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
                  <div className="xl:hidden mb-4 overflow-hidden rounded-[28px] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(251,251,251,0.94)_100%)] p-3 shadow-[0_14px_32px_rgba(15,23,42,0.04)]">
                    <div className="relative overflow-hidden rounded-[22px] border border-black/6 bg-white/80 px-5 py-6 sm:px-6 sm:py-7">
                      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.055),rgba(0,0,0,0.012)_42%,rgba(0,0,0,0)_78%)] blur-[22px]" />
                      <div className="pointer-events-none absolute inset-x-[16%] top-[32%] h-px bg-[linear-gradient(90deg,rgba(17,17,17,0)_0%,rgba(17,17,17,0.12)_24%,rgba(17,17,17,0.12)_76%,rgba(17,17,17,0)_100%)]" />
                      <div className="pointer-events-none absolute inset-x-[20%] top-[48%] h-px bg-[linear-gradient(90deg,rgba(17,17,17,0)_0%,rgba(17,17,17,0.08)_26%,rgba(17,17,17,0.08)_74%,rgba(17,17,17,0)_100%)]" />
                      <div className="relative">
                        <div className="text-[10px] tracking-[0.18em] uppercase text-neutral-500">
                          Delivery logic
                        </div>
                        <div className="mt-3 max-w-[18ch] text-[24px] leading-[0.96] tracking-[-0.05em] text-neutral-950 sm:text-[28px]">
                          Structured delivery, stronger clarity, stable mobile presentation.
                        </div>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {["Base", "Pro", "Studio", "Signature"].map((item) => (
                            <span
                              key={item}
                              className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[10px] tracking-[0.14em] uppercase text-neutral-700"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden xl:block xl:-ml-6 2xl:-ml-43">
                    <div className="relative min-h-[320px] sm:min-h-[420px] xl:min-h-[760px] overflow-hidden">
                      <div className="absolute inset-x-0 -top-10 md:-top-14 bottom-0">
                        <DeferredMount
                          minHeight={760}
                          rootMargin="420px 0px"
                          className="mt-2 xl:mt-0 2xl:-mt-1"
                        >
                          <StickySignalStage
                            sticky={false}
                            height={880}
                            zoom={1.48}
                            shiftX={2}
                            shiftY={34}
                            className="xl:w-[156%] 2xl:w-[164%]"
                            stageClassName="overflow-visible"
                          />
                        </DeferredMount>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative z-20 rounded-[28px] border border-neutral-100 bg-white p-4 shadow-[0_10px_26px_rgba(0,0,0,0.02)] md:p-5 xl:flex xl:h-full xl:flex-col"
                  >
                    <div className="grid gap-2">
                      {engagementPackages.map((item) => {
                        const active = item.id === activeEngagementId;

                        return (
                          <motion.button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveEngagementId(item.id)}
                            whileHover={{ y: -4 }}
                            className={[
                              "relative z-20 w-full rounded-[22px] border px-4 py-3.5 text-left transition cursor-pointer sm:px-4",
                              active
                                ? "border-neutral-300 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.05)]"
                                : "border-neutral-100 hover:border-neutral-200",
                            ].join(" ")}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div
                                  className={[
                                    "text-[11px] tracking-[0.14em] uppercase",
                                    active ? "text-neutral-900" : "text-neutral-500",
                                  ].join(" ")}
                                >
                                  {item.name}
                                </div>

                                <div className="mt-2 min-h-[1em] text-[11px] tracking-[0.14em] uppercase text-neutral-500">
                                  {item.strap}
                                </div>
                              </div>

                              <div
                                className={[
                                  "text-right text-[28px] font-medium leading-none tracking-tight",
                                  active ? "text-neutral-900" : "text-neutral-500",
                                ].join(" ")}
                              >
                                {item.price}
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="relative z-10 mt-4 rounded-[22px] border border-neutral-200 bg-white p-5 shadow-[0_8px_24px_rgba(17,17,17,0.035)]">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="min-h-[1em] text-[11px] tracking-[0.14em] uppercase text-neutral-500">
                            {currentPackage.name}
                          </div>
                          <div className="mt-2 min-h-[1em] text-[11px] tracking-[0.14em] uppercase text-neutral-500">
                            {currentPackage.strap}
                          </div>
                        </div>

                        <div className="min-h-[1em] text-right text-[28px] font-medium leading-none tracking-tight text-neutral-900">
                          {currentPackage.price}
                        </div>
                      </div>

                      <p className="mt-4 max-w-[38ch] text-[14px] leading-[1.75] text-neutral-600 md:text-[16px]">
                        {currentPackage.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {currentPackage.includes.slice(0, 3).map((include) => (
                          <span
                            key={include}
                            className="inline-flex items-center whitespace-nowrap rounded-full border border-neutral-200 px-3 py-1.5 text-[10px] tracking-[0.16em] uppercase text-neutral-700"
                          >
                            {include}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 grid gap-3 border-t border-neutral-100 pt-4">
                        <div className="grid gap-1 sm:grid-cols-[72px_1fr]">
                          <div className="text-[10px] tracking-[0.14em] uppercase text-neutral-500">
                            {currentPackage.bestForLabel}
                          </div>
                          <div className="text-[15px] leading-[1.65] text-neutral-600 md:text-[16px]">
                            {currentPackage.bestFor}
                          </div>
                        </div>

                        <div className="grid gap-1 sm:grid-cols-[72px_1fr]">
                          <div className="text-[10px] tracking-[0.14em] uppercase text-neutral-500">
                            {currentPackage.fitLabel}
                          </div>
                          <div className="text-[15px] leading-[1.65] text-neutral-600 md:text-[16px]">
                            {currentPackage.fit}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-neutral-100 pt-4">
                        <a href="/docs/price-pack-2026.pdf" download className={pillClass}>
                          {currentPackage.cta} <span className="text-neutral-400">&nearr;</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
          {/* WEBSITE MANAGEMENT */}
          <section className="border-t border-neutral-100 py-10 md:py-12 xl:py-14">
            <div className="grid gap-6 xl:grid-cols-[132px_1fr]">
              <div className="xl:-mt-2">
                <div className={`${sectionLabel} whitespace-nowrap`}>{t.offer.websiteManagement.label}</div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[420px_minmax(0,1fr)] xl:items-start xl:min-h-[640px] 2xl:min-h-[720px] xl:pt-5 2xl:pt-8">
                <div className="relative z-20 min-w-0 xl:w-[420px] xl:-ml-[88px] 2xl:w-[456px] 2xl:-ml-[132px]">
                  <div className="grid gap-2.5 sm:grid-cols-3">
                    {managementItems.map((item) => {
                      const active = item.id === currentManagement.id;

                      return (
                        <motion.button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveManagement(item.id)}
                          layout
                          transition={{ type: "spring", stiffness: 200, damping: 25 }}
                          className={[
                            "rounded-[22px] border bg-white px-3.5 py-3 text-left transition cursor-pointer",
                            active
                              ? "border-neutral-900 bg-white shadow-[0_8px_18px_rgba(0,0,0,0.028)]"
                              : "border-neutral-100 hover:border-neutral-200",
                          ].join(" ")}
                        >
                          <div className="text-[11px] tracking-[0.14em] uppercase text-neutral-500">
                            {item.tabLabel}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="mt-3 rounded-[20px] border border-neutral-200 bg-white p-6 shadow-[0_8px_24px_rgba(17,17,17,0.03)]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="min-h-[1em] text-[11px] tracking-[0.14em] uppercase text-neutral-500">
                          {currentManagement.title}
                        </div>
                        <div className="mt-2 min-h-[1em] text-[11px] tracking-[0.14em] uppercase text-neutral-500">
                          {currentManagement.subtitle}
                        </div>
                      </div>

                      <div className="min-h-[1em] text-right text-[26px] md:text-[32px] tracking-[-0.05em] leading-none text-neutral-900">
                        {currentManagement.price}
                      </div>
                    </div>

                    <p className="mt-5 max-w-[48ch] text-[14px] leading-[1.75] text-neutral-600">
                      {currentManagement.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {currentManagement.tags.map((item) => (
                        <span
                          key={item}
                            className="inline-flex items-center whitespace-nowrap rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[10px] tracking-[0.16em] uppercase text-neutral-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 grid gap-5 border-t border-neutral-100 pt-5 lg:grid-cols-2">
                      <div>
                        <div className="text-[11px] tracking-[0.14em] uppercase text-neutral-500">
                          {currentManagement.bestForLabel}
                        </div>
                        <div className="mt-3 text-[14px] leading-[1.6] text-neutral-600">
                          {currentManagement.bestFor}
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] tracking-[0.14em] uppercase text-neutral-500">
                          {currentManagement.modelLabel}
                        </div>
                        <div className="mt-3 text-[14px] leading-[1.6] text-neutral-600">
                          {currentManagement.model}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-4 border-t border-neutral-100 pt-5">
                      <div className="max-w-[46ch] text-[14px] leading-[1.6] text-neutral-600">
                        {currentManagement.note}
                      </div>

                      <div>
                        <a href="/docs/website-management-2026.pdf" download className={pillClass}>
                          {currentManagement.cta} <span className="text-neutral-400">&nearr;</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative hidden xl:block xl:min-h-[820px]">
                  <DeferredMount minHeight={820} rootMargin="420px 0px">
                    <RightCircuitStage
                      height={820}
                      className="xl:w-[138%] xl:-ml-[18%] 2xl:w-[146%] 2xl:-ml-[24%]"
                    />
                  </DeferredMount>
                </div>
              </div>
            </div>
          </section>
          {/* FINAL STRIP */}
          <section className="py-14 md:py-16">
            <div className="grid gap-8 xl:grid-cols-[220px_1fr] xl:items-end xl:gap-10">
              <div>
                <div className={sectionLabel}>{t.offer.finalCta.label}</div>
              </div>

              <div className="border-t border-neutral-100 pt-8">
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px] xl:items-end">
                  <div>
                    <p className="max-w-[48ch] text-[15px] leading-[1.65] text-neutral-600 md:text-[16px]">
                      {t.offer.finalCta.text}
                    </p>
                  </div>

                  <div className="mt-10 rounded-[20px] border border-neutral-200 bg-white p-6 shadow-[0_10px_28px_rgba(0,0,0,0.035)] sm:mt-12 sm:p-8">
                    <div className="text-[11px] tracking-[0.14em] uppercase text-neutral-500">
                      {t.offer.finalCta.label}
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                      <a
                        href="/docs/cv-2026.pdf"
                        download
                        className="group inline-flex h-[42px] items-center justify-between gap-3 whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 text-[11px] tracking-[0.14em] uppercase text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900 sm:h-[44px] sm:px-5"
                      >
                        <span>{t.offer.finalCta.profile}</span>
                        <span className="text-neutral-400 transition group-hover:text-neutral-700">&nearr;</span>
                      </a>

                      <motion.button
                        type="button"
                        onClick={() => onOpenProject?.()}
                        whileHover={{ y: -2 }}
                        className="inline-flex min-w-[11rem] items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm tracking-wide text-white transition hover:opacity-90"
                      >
                        <span>{t.offer.finalCta.primary}</span>
                        <span className="text-white/70 transition">→</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          </Container>
        </PageSurface>
      </main>
    </div>
  );
}
