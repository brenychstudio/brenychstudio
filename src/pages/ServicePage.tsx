import {
  useEffect,
  useMemo,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import AtmosphericSiteShell from "../ui/atmosphere/AtmosphericSiteShell";
import Header from "../ui/Header";
import PageSurface from "../ui/PageSurface";
import SiteFooterV2 from "../ui/SiteFooterV2";
import SeoMeta from "../ui/SeoMeta";
import StructuredData from "../ui/StructuredData";
import { SITE_NAME, toAbsoluteSiteUrl } from "../config/site";
import { cases, getCaseBySlug, getCasePath } from "../data/cases";
import { immersiveItems } from "../data/immersive";
import { getServicePage, type ServicePageData, type ServiceProofRef } from "../data/servicePages";

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
};

type ProofCardData = {
  title: string;
  claim: string;
  image: string;
  alt: string;
  type: string;
  href: string;
  label: string;
  role: string;
};

function SectionSignal({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
      <span>{index}</span>
      <span className="h-px w-8 bg-neutral-950/18" />
      <span>{label}</span>
    </div>
  );
}

function resolveProof(ref: ServiceProofRef): ProofCardData | null {
  if (ref.source === "immersive") {
    const item = immersiveItems.find((candidate) => candidate.slug === ref.slug);
    if (!item) return null;

    return {
      title: item.title,
      claim: ref.claim,
      image: item.previewPoster ?? item.frames?.[0]?.src ?? "/og-default.png",
      alt: item.frames?.[0]?.alt ?? `${item.title} immersive case preview`,
      type: item.searchContent?.category ?? item.medium,
      href: `/immersive/${item.slug}`,
      label: ref.label,
      role: ref.role,
    };
  }

  const item = getCaseBySlug(ref.slug);
  if (!item) return null;

  return {
    title: item.title,
    claim: ref.claim,
    image: item.previewImage,
    alt: item.alt,
    type: item.category,
    href: getCasePath(item.slug),
    label: ref.label,
    role: ref.role,
  };
}

function getResolvedProof(page: ServicePageData) {
  return page.proof.map(resolveProof).filter((item): item is ProofCardData => Boolean(item));
}

function shortenText(text: string, maxLength = 150) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function ServiceMeta({ page, proofCards }: { page: ServicePageData; proofCards: ProofCardData[] }) {
  const heroProof = proofCards[0];
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.schemaName,
    description: page.metaDescription,
    url: toAbsoluteSiteUrl(page.path),
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: toAbsoluteSiteUrl("/"),
    },
    areaServed: "International",
    serviceType: page.schemaName,
  };

  return (
    <>
      <SeoMeta
        title={page.seoTitle}
        description={page.metaDescription}
        path={page.path}
        image={heroProof?.image ?? "/og-default.png"}
        imageAlt={heroProof?.alt ?? `${page.schemaName} by Brenych Studio`}
        type="website"
      />
      <StructuredData id={`structured-data-service-${page.slug}`} data={serviceSchema} />
    </>
  );
}

function getToneClasses(tone: ServicePageData["visualTone"]) {
  if (tone === "product") {
    return {
      shell: "border-neutral-950/25 bg-neutral-950 text-white shadow-[0_34px_120px_rgba(0,0,0,0.22)]",
      grid: "opacity-[0.08] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]",
      muted: "text-white/56",
      label: "text-white/68",
      line: "bg-white/18",
      card: "border-white/16 bg-white/[0.06]",
      image: "opacity-100",
    };
  }

  if (tone === "immersive") {
    return {
      shell: "border-neutral-950/35 bg-[#030504] text-white shadow-[0_42px_140px_rgba(0,0,0,0.28)]",
      grid: "opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]",
      muted: "text-white/54",
      label: "text-white/70",
      line: "bg-cyan-200/18",
      card: "border-white/16 bg-white/[0.055]",
      image: "opacity-100 saturate-[1.08]",
    };
  }

  return {
    shell: "border-neutral-950/14 bg-[#f8f5ee]/72 text-neutral-950 shadow-[0_28px_100px_rgba(15,15,15,0.09)]",
    grid: "opacity-[0.055] [background-image:linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)]",
    muted: "text-neutral-500",
    label: "text-neutral-600",
    line: "bg-neutral-950/14",
    card: "border-neutral-950/14 bg-white/68",
    image: "opacity-100",
  };
}

function getProofLayerClass(layout: ServicePageData["heroProofLayout"], index: number) {
  if (layout === "product-stack") {
    return [
      "col-span-9 col-start-1 row-start-2 z-30 -rotate-1",
      "col-span-6 col-start-6 row-start-1 z-20 rotate-2",
      "col-span-5 col-start-3 row-start-4 z-10 rotate-1",
    ][index];
  }

  if (layout === "spatial-stack") {
    return [
      "col-span-7 col-start-1 row-start-2 z-30 -rotate-2",
      "col-span-6 col-start-6 row-start-1 z-20 rotate-1",
      "col-span-5 col-start-4 row-start-4 z-10 -rotate-1",
    ][index];
  }

  return [
    "col-span-7 col-start-1 row-start-2 z-30 -rotate-2",
    "col-span-6 col-start-6 row-start-1 z-20 rotate-2",
    "col-span-5 col-start-3 row-start-4 z-10 rotate-1",
  ][index];
}

function HeroProofComposition({
  page,
  cards,
  compact = false,
}: {
  page: ServicePageData;
  cards: ProofCardData[];
  compact?: boolean;
}) {
  const tone = getToneClasses(page.visualTone);
  const visibleCards = cards.slice(0, 3);

  return (
    <div
      className={`relative min-h-[26rem] overflow-hidden border p-4 backdrop-blur-sm md:min-h-[34rem] md:p-5 ${tone.shell}`}
      aria-label={`${page.schemaName} proof composition`}
    >
      <div className={`pointer-events-none absolute inset-0 [background-size:56px_56px] ${tone.grid}`} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_34%,rgba(255,255,255,0.18),transparent_36%),radial-gradient(circle_at_24%_74%,rgba(0,0,0,0.16),transparent_32%)]" />
      {page.visualTone === "immersive" ? (
        <div className="pointer-events-none absolute left-[12%] top-[16%] h-[62%] w-[76%] rounded-[999px] border border-cyan-100/14" />
      ) : null}

      <div className="relative flex items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.18em]">
        <span className={tone.label}>Featured proof system</span>
        <span className={tone.muted}>{page.heroProofLayout.replace("-stack", " stack")}</span>
      </div>

      <div className={`relative mt-6 grid ${compact ? "min-h-[20rem]" : "min-h-[24rem] md:min-h-[29rem]"} grid-cols-10 grid-rows-5 gap-2`}>
        {visibleCards.map((card, index) => (
          <Link
            key={card.href}
            to={card.href}
            className={`group relative block overflow-hidden border transition duration-500 hover:-translate-y-1 hover:scale-[1.015] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${tone.card} ${getProofLayerClass(
              page.heroProofLayout,
              index,
            )}`}
          >
            <span className="relative block aspect-[16/10] overflow-hidden bg-neutral-950">
              <img
                src={card.image}
                alt={card.alt}
                className={`h-full w-full object-cover transition duration-700 group-hover:scale-[1.04] ${tone.image}`}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
              <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.18))]" />
              <span className="absolute left-3 top-3 font-mono text-[8px] uppercase tracking-[0.18em] text-white/60">
                0{index + 1}
              </span>
              <span className="absolute bottom-3 left-3 max-w-[80%] font-mono text-[8px] uppercase tracking-[0.16em] text-white/72">
                {card.label}
              </span>
            </span>
            <span className="grid gap-1 p-3">
              <span className="text-[18px] leading-none">{card.title}</span>
              <span className={`font-mono text-[8px] uppercase tracking-[0.16em] ${tone.muted}`}>{card.role}</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="relative mt-4 grid gap-3 border-t border-current/10 pt-4 md:grid-cols-[0.32fr_0.68fr]">
        <div className={`font-mono text-[9px] uppercase tracking-[0.18em] ${tone.muted}`}>Proof before pitch</div>
        <p className={`text-[13px] leading-6 ${tone.muted}`}>{page.proofStatement}</p>
      </div>
    </div>
  );
}

function ServiceHero({
  page,
  proofCards,
  onOpenProject,
}: {
  page: ServicePageData;
  proofCards: ProofCardData[];
  onOpenProject?: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="service-threshold"
      data-header-scene="practice-threshold"
      data-sound-safe-area
      className="relative mx-auto grid min-h-[calc(100svh-5rem)] w-[min(94vw,1720px)] gap-8 border-y border-neutral-950/14 py-10 pt-24 md:min-h-[calc(100svh-5.5rem)] md:py-12 md:pt-28 xl:grid-cols-[0.48fr_0.52fr] xl:items-center"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
        className="min-w-0"
      >
        <SectionSignal index="01" label="Service threshold" />
        <h1 className="mt-7 max-w-full text-[clamp(2.55rem,8.2vw,8.8rem)] font-normal leading-[0.88] tracking-normal text-neutral-950 sm:max-w-[11ch]">
          {page.heroTitle}
        </h1>
        <p className="mt-7 max-w-full text-[17px] leading-8 text-neutral-600 md:max-w-[44rem] md:text-[20px] md:leading-9">
          {page.heroBody}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onOpenProject}
            className="inline-flex min-h-11 w-full max-w-[22rem] items-center justify-center rounded-full border border-neutral-950 bg-neutral-950 px-5 text-center text-[11px] uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 sm:w-auto"
          >
            {page.primaryCta} -&gt;
          </button>
          <Link
            to={page.secondaryHref}
            className="inline-flex min-h-11 w-full max-w-[22rem] items-center justify-center rounded-full border border-neutral-300 bg-white/60 px-5 text-center text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 sm:w-auto sm:tracking-[0.16em]"
          >
            {page.secondaryCta} -&gt;
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        <HeroProofComposition page={page} cards={proofCards} />
      </motion.div>
    </section>
  );
}

function RouteLedger({ page }: { page: ServicePageData }) {
  return (
    <section className="relative mx-auto w-[min(94vw,1500px)] border-b border-neutral-950/12 py-10">
      <div className="grid gap-3 md:grid-cols-3">
        {page.routeLedger.map((item, index) => (
          <article key={item.title} className="group border-y border-neutral-950/12 bg-white/16 px-4 py-5 backdrop-blur-sm transition hover:bg-white/42">
            <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
              <span>0{index + 1}</span>
              <span className="h-px flex-1 bg-neutral-950/12 transition group-hover:bg-neutral-950/24" />
            </div>
            <h2 className="mt-4 text-[20px] uppercase tracking-[0.08em] text-neutral-950">{item.title}</h2>
            <p className="mt-3 text-[13px] leading-6 text-neutral-500">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FeaturedProof({
  page,
  proofCards,
}: {
  page: ServicePageData;
  proofCards: ProofCardData[];
}) {
  return (
    <section className="relative mx-auto grid w-[min(94vw,1500px)] gap-8 border-b border-neutral-950/12 py-12 md:grid-cols-[0.34fr_0.66fr] md:py-16">
      <div>
        <SectionSignal index="02" label="Proof composition" />
        <h2 className="mt-5 max-w-[10ch] text-[clamp(2.9rem,5.8vw,5.6rem)] font-normal leading-[0.9] tracking-normal text-neutral-950">
          Proof enters before the pitch.
        </h2>
        <p className="mt-6 max-w-[23rem] text-[14px] leading-7 text-neutral-500">{page.proofStatement}</p>
      </div>
      <HeroProofComposition page={page} cards={proofCards} compact />
    </section>
  );
}

function ServiceRouteDefinition({ page }: { page: ServicePageData }) {
  return (
    <section className="relative mx-auto grid w-[min(94vw,1500px)] gap-8 border-b border-neutral-950/12 py-12 md:grid-cols-[0.36fr_0.64fr] md:py-16">
      <div>
        <SectionSignal index="03" label="What this route is" />
        <h2 className="mt-5 max-w-[10ch] text-[clamp(2.8rem,6vw,5.2rem)] font-normal leading-[0.9] tracking-normal text-neutral-950">
          {page.routeTitle}
        </h2>
      </div>
      <p className="max-w-[48rem] text-[22px] leading-[1.18] text-neutral-800 md:text-[32px]">
        {page.routeDefinition}
      </p>
    </section>
  );
}

function BestFor({ items }: { items: string[] }) {
  return (
    <section className="relative mx-auto w-[min(94vw,1500px)] border-b border-neutral-950/12 py-12 md:py-16">
      <div className="grid gap-8 md:grid-cols-[0.36fr_0.64fr]">
        <div>
          <SectionSignal index="04" label="Best for" />
        </div>
        <div className="grid border-y border-neutral-950/12 bg-white/10 backdrop-blur-sm">
          {items.map((item, index) => (
            <div
              key={item}
              className="group grid gap-3 border-b border-neutral-950/10 px-3 py-4 transition hover:bg-white/34 last:border-b-0 sm:grid-cols-[4rem_1fr] sm:items-baseline"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-300 transition group-hover:text-neutral-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-[18px] leading-7 text-neutral-800 md:text-[22px]">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Method({ page }: { page: ServicePageData }) {
  return (
    <section className="relative mx-auto w-[min(94vw,1500px)] border-b border-neutral-950/12 py-12 md:py-16">
      <div className="grid gap-8 md:grid-cols-[0.36fr_0.64fr]">
        <div>
          <SectionSignal index="05" label="Method" />
          <h2 className="mt-5 max-w-[9ch] text-[clamp(2.8rem,6vw,5.2rem)] font-normal leading-[0.9] tracking-normal text-neutral-950">
            {page.methodTitle}
          </h2>
        </div>
        <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
          {page.method.map((step, index) => (
            <article key={step.title} className="group border-t border-neutral-950/14 bg-white/[0.08] px-1 py-4 transition hover:bg-white/24 sm:px-4">
              <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span className="h-px flex-1 bg-neutral-950/10 transition group-hover:bg-neutral-950/22" />
              </div>
              <h3 className="mt-4 text-[23px] leading-none text-neutral-950 md:text-[26px]">{step.title}</h3>
              <p className="mt-3 text-[13px] leading-6 text-neutral-600">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProofStrip({ proofCards }: { proofCards: ProofCardData[] }) {
  return (
    <section className="relative mx-auto w-[min(94vw,1500px)] border-b border-neutral-950/12 py-12 md:py-16">
      <div className="grid gap-8 md:grid-cols-[0.36fr_0.64fr]">
        <div>
          <SectionSignal index="06" label="Relevant proof" />
          <p className="mt-5 max-w-[22rem] text-[14px] leading-7 text-neutral-500">
            Short proof references only. Full case stories stay inside Work and Immersive.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {proofCards.map((card) => (
            <Link
              key={card.href}
              to={card.href}
              className="group grid overflow-hidden border border-neutral-950/12 bg-white/24 text-left shadow-[0_18px_54px_rgba(15,15,15,0.05)] transition duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_28px_74px_rgba(15,15,15,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
            >
              <span className="relative block aspect-[16/11] overflow-hidden bg-neutral-950">
                <img
                  src={card.image}
                  alt={card.alt}
                  className="h-full w-full object-cover opacity-92 transition duration-700 group-hover:scale-[1.04]"
                  loading="lazy"
                  decoding="async"
                />
                <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.38))]" />
                <span className="absolute left-3 top-3 font-mono text-[8px] uppercase tracking-[0.17em] text-white/62">
                  {card.label}
                </span>
                <span className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/72">
                  {card.type}
                </span>
              </span>
              <span className="grid gap-3 p-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">{card.role}</span>
                <span className="text-[22px] leading-none text-neutral-950">{card.title}</span>
                <span className="text-[13px] leading-6 text-neutral-600">{card.claim}</span>
                <span className="mt-1 text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                  View case -&gt;
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Deliverables({ items }: { items: string[] }) {
  return (
    <section className="relative mx-auto w-[min(94vw,1500px)] border-b border-neutral-950/12 py-12 md:py-16">
      <div className="grid gap-8 md:grid-cols-[0.36fr_0.64fr]">
        <div>
          <SectionSignal index="07" label="What you receive" />
        </div>
        <div className="grid gap-x-5 gap-y-2 sm:grid-cols-2">
          {items.map((item, index) => (
            <div key={item} className="group grid grid-cols-[2.8rem_1fr] gap-3 border-t border-neutral-950/10 px-1 py-4 transition hover:bg-white/24 sm:px-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-300 transition group-hover:text-neutral-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-[14px] leading-6 text-neutral-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StartRoute({ page, onOpenProject }: { page: ServicePageData; onOpenProject?: () => void }) {
  return (
    <section className="relative mx-auto w-[min(94vw,1500px)] py-12 md:py-16" data-sound-safe-area>
      <div className="relative overflow-hidden border-y border-neutral-950/12 bg-white/20 px-4 py-9 backdrop-blur-sm md:px-7 md:py-12">
        <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] [background-size:68px_68px]" />
        <div className="relative grid gap-7 md:grid-cols-[0.58fr_0.42fr] md:items-end">
          <div>
            <SectionSignal index="08" label="Start route" />
            <h2 className="mt-5 max-w-[11ch] text-[clamp(3.2rem,7vw,6.4rem)] font-normal leading-[0.9] tracking-normal text-neutral-950">
              {page.closingTitle}
            </h2>
            <p className="mt-6 max-w-[37rem] text-[15px] leading-7 text-neutral-600">
              {page.closingBody}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenProject}
            className="inline-flex min-h-12 w-full max-w-full items-center justify-center rounded-full border border-neutral-950 bg-neutral-950 px-5 text-center text-[11px] uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 md:w-auto"
          >
            {page.primaryCta} -&gt;
          </button>
        </div>
      </div>
    </section>
  );
}

function getProjectGalleryCards(): ProofCardData[] {
  const workCards = cases.map((item) => ({
    title: item.title,
    claim: shortenText(item.shortDescription, 150),
    image: item.previewImage,
    alt: item.alt,
    type: item.category,
    href: getCasePath(item.slug),
    label: item.proofType,
    role: item.clientType ?? item.status,
  }));

  const immersiveCards = immersiveItems.map((item) => ({
    title: item.title,
    claim: shortenText(item.searchContent?.shortDescription ?? item.description, 150),
    image: item.previewPoster ?? item.frames?.[0]?.src ?? "/og-default.png",
    alt: item.frames?.[0]?.alt ?? `${item.title} immersive case preview`,
    type: item.searchContent?.category ?? "Immersive System",
    href: `/immersive/${item.slug}`,
    label: item.searchContent?.proofType ?? "Immersive Proof",
    role: item.medium,
  }));

  return [...workCards, ...immersiveCards];
}

function PremiumCoverCard({
  card,
  index,
  size = "default",
}: {
  card: ProofCardData;
  index: number;
  size?: "hero" | "default" | "gallery";
}) {
  const imageHeight = size === "hero" ? "aspect-[16/10]" : size === "gallery" ? "aspect-[16/11]" : "aspect-[16/10]";
  const titleClass =
    size === "hero"
      ? "text-[clamp(1.8rem,3vw,2.65rem)] leading-none text-neutral-950"
      : size === "gallery"
        ? "text-[20px] leading-none text-neutral-950"
        : "text-[22px] leading-none text-neutral-950";

  return (
    <Link
      to={card.href}
      draggable={false}
      className="group flex h-full flex-col overflow-hidden border border-neutral-950/12 bg-white/76 text-left shadow-[0_24px_90px_rgba(20,20,20,0.08)] backdrop-blur-md transition duration-500 hover:-translate-y-1 hover:shadow-[0_32px_120px_rgba(20,20,20,0.13)] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
    >
      <span className={`relative block overflow-hidden bg-neutral-950 ${imageHeight}`}>
        <img
          src={card.image}
          alt={card.alt}
          draggable={false}
          className="h-full w-full object-cover opacity-95 transition duration-700 group-hover:scale-[1.035]"
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
        />
        <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.2))]" />
        <span className="absolute left-3 top-3 font-mono text-[8px] uppercase tracking-[0.18em] text-white/68">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="absolute bottom-3 left-3 max-w-[78%] font-mono text-[8px] uppercase tracking-[0.16em] text-white/72">
          {card.label}
        </span>
      </span>
      <span className={`${size === "hero" ? "p-5 md:p-6" : "p-4"} flex flex-1 flex-col gap-2`}>
        <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-neutral-400">{card.role}</span>
        <span className={titleClass}>{card.title}</span>
        {size !== "hero" ? (
          <span className="overflow-hidden text-[13px] leading-6 text-neutral-600 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
            {card.claim}
          </span>
        ) : null}
        <span className="mt-auto pt-2 text-[10px] uppercase tracking-[0.16em] text-neutral-500">View case -&gt;</span>
      </span>
    </Link>
  );
}

function PremiumLandingHero({
  page,
  proofCards,
  onOpenProject,
}: {
  page: ServicePageData;
  proofCards: ProofCardData[];
  onOpenProject?: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const coverY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const coverRotate = useTransform(scrollYProgress, [0, 1], ["-1.4deg", "1.2deg"]);
  const coverScale = useTransform(scrollYProgress, [0, 0.72, 1], [1, 1.055, 1.035]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-2%"]);
  const primaryCard = proofCards[0];

  return (
    <section
      ref={ref}
      id="service-threshold"
      data-header-scene="practice-threshold"
      data-sound-safe-area
      className="relative mx-auto grid w-[min(94vw,1640px)] gap-8 border-y border-neutral-950/12 py-9 pt-24 md:py-10 md:pt-28 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:items-center xl:gap-12"
    >
      <motion.div
        style={reduceMotion ? undefined : { y: copyY }}
        className="relative z-10 min-w-0"
      >
        <SectionSignal index="01" label="Service threshold" />
        <h1 className="mt-7 max-w-[10.5ch] text-[clamp(3.15rem,6.2vw,7rem)] font-normal leading-[0.88] tracking-normal text-neutral-950">
          {page.heroTitle}
        </h1>
        <p className="mt-7 max-w-[42rem] text-[17px] leading-8 text-neutral-600 md:text-[20px] md:leading-9">
          {page.heroBody}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onOpenProject}
            className="inline-flex min-h-11 w-full max-w-[22rem] items-center justify-center rounded-full border border-neutral-950 bg-neutral-950 px-5 text-center text-[11px] uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 sm:w-auto"
          >
            {page.primaryCta} -&gt;
          </button>
          <Link
            to={page.secondaryHref}
            className="inline-flex min-h-11 w-full max-w-[22rem] items-center justify-center rounded-full border border-neutral-300 bg-white/70 px-5 text-center text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 sm:w-auto sm:tracking-[0.16em]"
          >
            {page.secondaryCta} -&gt;
          </Link>
        </div>

        <div className="mt-8 grid max-w-[44rem] gap-2 sm:grid-cols-3">
          {page.routeLedger.map((item, index) => (
            <div key={item.title} className="border-t border-neutral-950/12 pt-3">
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">0{index + 1}</div>
              <div className="mt-2 text-[12px] uppercase tracking-[0.12em] text-neutral-950">{item.title}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="relative min-h-[24rem] overflow-visible md:min-h-[34rem] lg:min-h-[40rem]">
        <div className="pointer-events-none absolute inset-0 border border-neutral-950/10 bg-white/16 backdrop-blur-[2px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] [background-size:64px_64px]" />
        <motion.div
          style={reduceMotion ? undefined : { y: coverY, rotate: coverRotate, scale: coverScale }}
          className="relative z-10 mx-auto w-full max-w-[50rem] pt-5 md:pt-8 lg:ml-auto lg:mr-0"
        >
          {primaryCard ? <PremiumCoverCard card={primaryCard} index={0} size="hero" /> : null}
        </motion.div>
      </div>
    </section>
  );
}

function PremiumSequenceScene({
  card,
  index,
  title,
  text,
  reverse = false,
}: {
  card: ProofCardData;
  index: number;
  title: string;
  text: string;
  reverse?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 82%", "end 18%"] });
  const coverY = useTransform(scrollYProgress, [0, 1], ["10%", "-8%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["4%", "-3%"]);
  const coverRotate = useTransform(scrollYProgress, [0, 1], [reverse ? "-2deg" : "2deg", reverse ? "1deg" : "-1deg"]);
  const coverScale = useTransform(scrollYProgress, [0, 0.48, 1], [0.98, 1.055, 1.01]);
  const gridClass = reverse ? "md:grid-cols-[0.58fr_0.42fr]" : "md:grid-cols-[0.42fr_0.58fr]";

  return (
    <section
      ref={ref}
      className={`grid min-h-[28rem] gap-8 border-b border-neutral-950/10 py-10 md:min-h-[32rem] md:items-center md:py-11 ${gridClass}`}
    >
      <motion.div
        style={reduceMotion ? undefined : { y: copyY }}
        className={`max-w-[28rem] ${reverse ? "md:order-2 md:justify-self-end" : ""}`}
      >
        <SectionSignal index={`0${index + 2}`} label={card.label} />
        <h2 className="mt-5 text-[clamp(2.4rem,4.8vw,4.8rem)] font-normal leading-[0.9] tracking-normal text-neutral-950">
          {title}
        </h2>
        <p className="mt-5 text-[15px] leading-7 text-neutral-600">{text}</p>
        <Link
          to={card.href}
          className="mt-6 inline-flex min-h-10 items-center justify-center rounded-full border border-neutral-950/14 bg-white/60 px-5 text-[10px] uppercase tracking-[0.16em] text-neutral-700 transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
        >
          View case -&gt;
        </Link>
      </motion.div>
      <motion.div
        style={reduceMotion ? undefined : { y: coverY, rotate: coverRotate, scale: coverScale }}
        className={`w-full max-w-[48rem] ${reverse ? "md:order-1" : "md:justify-self-end"}`}
      >
        <PremiumCoverCard card={card} index={index + 1} />
      </motion.div>
    </section>
  );
}

function PremiumDirectedProof({ proofCards }: { proofCards: ProofCardData[] }) {
  const secondary = proofCards[1];
  const tertiary = proofCards[2];

  return (
    <section className="relative mx-auto w-[min(94vw,1640px)] border-b border-neutral-950/12">
      {secondary ? (
        <PremiumSequenceScene
          card={secondary}
          index={0}
          title="Trust becomes a route."
          text="A premium page is not a pile of sections. It guides attention through proof, context, visual hierarchy and one clear inquiry path."
        />
      ) : null}
      {tertiary ? (
        <PremiumSequenceScene
          card={tertiary}
          index={1}
          title="A launch needs motion, not noise."
          text="The surface can move with the offer: product modules, proof screens, campaign logic and a focused handoff without becoming a heavy website."
          reverse
        />
      ) : null}
    </section>
  );
}

function PremiumServiceModel({ page }: { page: ServicePageData }) {
  const methodLine = page.method.map((step) => step.title).join(" -> ");

  return (
    <section className="relative mx-auto w-[min(94vw,1640px)] border-b border-neutral-950/12 py-10 md:py-14">
      <div className="grid gap-10 lg:grid-cols-[0.38fr_0.62fr] lg:items-start">
        <div>
          <SectionSignal index="04" label="Route model" />
          <h2 className="mt-5 max-w-[10ch] text-[clamp(2.8rem,5.8vw,5.4rem)] font-normal leading-[0.9] tracking-normal text-neutral-950">
            {page.routeTitle}
          </h2>
          <p className="mt-6 max-w-[31rem] text-[16px] leading-8 text-neutral-600">{page.routeDefinition}</p>
        </div>

        <div className="grid gap-8 pt-1">
          <div className="grid gap-0 border-y border-neutral-950/12">
            {page.routeLedger.map((item, index) => (
              <article
                key={item.title}
                className="grid gap-3 border-b border-neutral-950/10 py-5 last:border-b-0 md:grid-cols-[4.5rem_minmax(0,1fr)] md:gap-5"
              >
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-300">
                  {String(index + 1).padStart(2, "0")} / route
                </span>
                <div className="min-w-0">
                  <h3 className="text-[clamp(1.95rem,2.65vw,3.15rem)] leading-[0.94] text-neutral-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[46rem] text-[14px] leading-7 text-neutral-500">{item.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-[minmax(0,0.44fr)_minmax(0,0.56fr)] md:items-start">
            <div className="border-t border-neutral-950/12 pt-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">Built through</div>
              <p className="mt-3 text-[20px] leading-7 text-neutral-800">{methodLine}</p>
            </div>

            <div className="border-t border-neutral-950/12 pt-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">Best when</div>
              <p className="mt-3 text-[17px] leading-8 text-neutral-700">
                {page.bestFor.slice(0, 5).join(" / ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PremiumProjectGallery({ cards }: { cards: ProofCardData[] }) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const loopResetRef = useRef<number | null>(null);
  const wheelFrameRef = useRef<number | null>(null);
  const wheelVelocityRef = useRef(0);
  const dragState = useRef({
    active: false,
    moved: false,
    pointerId: -1,
    startX: 0,
    scrollLeft: 0,
  });
  const loopCards = useMemo(() => [...cards, ...cards, ...cards], [cards]);

  const getLoopSegment = () => {
    const rail = railRef.current;
    if (!rail) return 0;
    return rail.scrollWidth / 3;
  };

  const normalizeLoopPosition = () => {
    const rail = railRef.current;
    const segment = getLoopSegment();
    if (!rail || segment <= 0) return;

    if (rail.scrollLeft < segment * 0.5) {
      rail.scrollLeft += segment;
      return;
    }

    if (rail.scrollLeft > segment * 1.5) {
      rail.scrollLeft -= segment;
    }
  };

  const animateWheelScroll = () => {
    const rail = railRef.current;
    if (!rail) {
      wheelFrameRef.current = null;
      return;
    }

    rail.scrollLeft += wheelVelocityRef.current;
    wheelVelocityRef.current *= 0.82;
    normalizeLoopPosition();

    if (Math.abs(wheelVelocityRef.current) < 0.35) {
      wheelVelocityRef.current = 0;
      wheelFrameRef.current = null;
      return;
    }

    wheelFrameRef.current = window.requestAnimationFrame(animateWheelScroll);
  };

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const setMiddleLoop = () => {
      const segment = getLoopSegment();
      if (segment > 0) rail.scrollLeft = segment;
    };

    const frame = window.requestAnimationFrame(setMiddleLoop);
    window.addEventListener("resize", setMiddleLoop);

    return () => {
      window.cancelAnimationFrame(frame);
      if (wheelFrameRef.current !== null) window.cancelAnimationFrame(wheelFrameRef.current);
      if (loopResetRef.current !== null) window.clearTimeout(loopResetRef.current);
      window.removeEventListener("resize", setMiddleLoop);
    };
  }, [cards.length]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    const rail = railRef.current;
    if (!rail) return;

    dragState.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: rail.scrollLeft,
    };
    rail.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    const state = dragState.current;
    if (!rail || !state.active || state.pointerId !== event.pointerId) return;

    const distance = event.clientX - state.startX;
    if (Math.abs(distance) > 4) {
      state.moved = true;
      event.preventDefault();
    }
    rail.scrollLeft = state.scrollLeft - distance;
    normalizeLoopPosition();
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    const state = dragState.current;
    if (!state.active || state.pointerId !== event.pointerId) return;

    state.active = false;
    if (rail?.hasPointerCapture(event.pointerId)) {
      rail.releasePointerCapture(event.pointerId);
    }
    normalizeLoopPosition();
  };

  const onWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail) return;

    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (delta === 0) return;

    event.preventDefault();
    wheelVelocityRef.current += delta * 0.32;
    wheelVelocityRef.current = Math.max(-58, Math.min(58, wheelVelocityRef.current));

    if (wheelFrameRef.current === null) {
      wheelFrameRef.current = window.requestAnimationFrame(animateWheelScroll);
    }

    if (loopResetRef.current !== null) {
      window.clearTimeout(loopResetRef.current);
    }
    loopResetRef.current = window.setTimeout(normalizeLoopPosition, 220);
  };

  const onClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!dragState.current.moved) return;

    event.preventDefault();
    event.stopPropagation();
    dragState.current.moved = false;
  };

  const onScroll = () => {
    if (loopResetRef.current !== null) {
      window.clearTimeout(loopResetRef.current);
    }
    loopResetRef.current = window.setTimeout(normalizeLoopPosition, 80);
  };

  return (
    <section className="relative mx-auto w-[min(94vw,1640px)] border-b border-neutral-950/12 py-10 md:py-14">
      <div className="mb-8 grid gap-6 md:grid-cols-[0.34fr_0.66fr] md:items-end">
        <div>
          <SectionSignal index="05" label="Project gallery" />
          <h2 className="mt-5 max-w-[9ch] text-[clamp(2.7rem,5vw,5rem)] font-normal leading-[0.9] tracking-normal text-neutral-950">
            Scroll through the proof field.
          </h2>
        </div>
        <p className="max-w-[44rem] text-[16px] leading-8 text-neutral-600">
          A wider proof gallery stays available without turning the page into a heavy archive. Scroll the rail and enter any project directly.
        </p>
      </div>

      <div
        ref={railRef}
        role="region"
        aria-label="Scrollable project proof gallery"
        className="cursor-grab overflow-x-auto overscroll-contain pb-5 active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onWheel={onWheel}
        onScroll={onScroll}
        onClickCapture={onClickCapture}
      >
        <div className="flex w-max select-none gap-5 pr-[8vw]">
          {loopCards.map((card, index) => (
            <motion.div
              key={`${card.href}-${index}`}
              className={`w-[min(78vw,26rem)] shrink-0 ${index % 2 === 0 ? "pt-0" : "pt-8 md:pt-12"}`}
              whileHover={{ y: -6, scale: 1.012 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <PremiumCoverCard card={card} index={index % cards.length} size="gallery" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PremiumClosingRoute({ page, onOpenProject }: { page: ServicePageData; onOpenProject?: () => void }) {
  return (
    <section className="relative mx-auto w-[min(94vw,1640px)] py-12 md:py-16" data-sound-safe-area>
      <div className="grid gap-8 border-y border-neutral-950/12 bg-white/18 px-4 py-8 backdrop-blur-sm md:grid-cols-[0.48fr_0.52fr] md:items-end md:px-7 md:py-10">
        <div>
          <SectionSignal index="06" label="Start route" />
          <h2 className="mt-5 max-w-[10ch] text-[clamp(3rem,6.4vw,6rem)] font-normal leading-[0.9] tracking-normal text-neutral-950">
            {page.closingTitle}
          </h2>
          <p className="mt-6 max-w-[35rem] text-[15px] leading-7 text-neutral-600">{page.closingBody}</p>
        </div>
        <div className="grid gap-5">
          <div className="grid gap-2 sm:grid-cols-2">
            {page.deliverables.map((item, index) => (
              <div key={item} className="border-t border-neutral-950/10 py-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-[13px] leading-6 text-neutral-700">{item}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={onOpenProject}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-neutral-950 bg-neutral-950 px-5 text-center text-[11px] uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
          >
            {page.primaryCta} -&gt;
          </button>
        </div>
      </div>
    </section>
  );
}

function PremiumLandingRoute({
  page,
  proofCards,
  galleryCards,
  onOpenProject,
}: {
  page: ServicePageData;
  proofCards: ProofCardData[];
  galleryCards: ProofCardData[];
  onOpenProject?: () => void;
}) {
  return (
    <>
      <PremiumLandingHero page={page} proofCards={proofCards} onOpenProject={onOpenProject} />
      <PremiumDirectedProof proofCards={proofCards} />
      <PremiumServiceModel page={page} />
      <PremiumProjectGallery cards={galleryCards} />
      <PremiumClosingRoute page={page} onOpenProject={onOpenProject} />
    </>
  );
}

export default function ServicePage({ drawerOpen = false, onOpenProject, onCloseProject }: PageProps) {
  const { slug } = useParams();
  const page = getServicePage(slug);
  const galleryCards = useMemo(() => getProjectGalleryCards(), []);

  if (!page) {
    return <Navigate to="/offer" replace />;
  }

  const proofCards = getResolvedProof(page);

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-neutral-950">
      <ServiceMeta page={page} proofCards={proofCards} />
      <Header drawerOpen={drawerOpen} onOpenProject={onOpenProject} onCloseProject={onCloseProject} />
      <PageSurface className="relative min-h-screen overflow-x-clip bg-transparent">
        <AtmosphericSiteShell preset="practice" />
        <main className="relative">
          {page.slug === "premium-landing-page" ? (
            <PremiumLandingRoute
              page={page}
              proofCards={proofCards}
              galleryCards={galleryCards}
              onOpenProject={onOpenProject}
            />
          ) : (
            <>
              <ServiceHero page={page} proofCards={proofCards} onOpenProject={onOpenProject} />
              <RouteLedger page={page} />
              <FeaturedProof page={page} proofCards={proofCards} />
              <ServiceRouteDefinition page={page} />
              <BestFor items={page.bestFor} />
              <Method page={page} />
              <ProofStrip proofCards={proofCards} />
              <Deliverables items={page.deliverables} />
              <StartRoute page={page} onOpenProject={onOpenProject} />
            </>
          )}
        </main>
        <SiteFooterV2 onOpenProject={onOpenProject} variant="practice" hideClosingSignal />
      </PageSurface>
    </div>
  );
}
