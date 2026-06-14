import { Link, Navigate, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

import AtmosphericSiteShell from "../ui/atmosphere/AtmosphericSiteShell";
import Header from "../ui/Header";
import PageSurface from "../ui/PageSurface";
import SiteFooterV2 from "../ui/SiteFooterV2";
import SeoMeta from "../ui/SeoMeta";
import StructuredData from "../ui/StructuredData";
import { SITE_NAME, toAbsoluteSiteUrl } from "../config/site";
import { getCaseBySlug, getCasePath } from "../data/cases";
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
  };
}

function ServiceMeta({ page }: { page: ServicePageData }) {
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
        image="/og-default.png"
        imageAlt={`${page.schemaName} by Brenych Studio`}
        type="website"
      />
      <StructuredData id={`structured-data-service-${page.slug}`} data={serviceSchema} />
    </>
  );
}

function ServiceHero({ page, onOpenProject }: { page: ServicePageData; onOpenProject?: () => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="service-threshold"
      data-header-scene="practice-threshold"
      data-sound-safe-area
      className="relative mx-auto grid min-h-[calc(100svh-5rem)] w-[min(94vw,1720px)] gap-9 border-y border-neutral-950/14 py-10 pt-24 md:min-h-[calc(100svh-5.5rem)] md:py-12 md:pt-28"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
        className="min-w-0"
      >
        <SectionSignal index="01" label="Service threshold" />
        <h1 className="mt-7 max-w-full text-[clamp(4rem,10vw,9rem)] font-normal leading-[0.88] tracking-normal text-neutral-950 sm:max-w-[11ch]">
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

      <div className="relative min-w-0 overflow-hidden border-y border-neutral-950/12 bg-white/24 p-4 backdrop-blur-sm md:max-w-[48rem] md:p-5">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] [background-size:52px_52px]" />
        <div className="relative grid gap-4">
          {["01 / route", "02 / proof", "03 / launch"].map((label, index) => (
            <div key={label} className="grid grid-cols-[4rem_1fr] gap-4 border-b border-neutral-950/10 pb-4 last:border-b-0 last:pb-0">
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">{label}</div>
              <div>
                <div className="text-[13px] uppercase tracking-[0.12em] text-neutral-950">
                  {index === 0 ? "Focused entry" : index === 1 ? "Case-backed" : "Deploy-ready"}
                </div>
                <p className="mt-2 text-[13px] leading-6 text-neutral-500">
                  {index === 0
                    ? "One commercial route with a clear action."
                    : index === 1
                      ? "Proof is pulled from current public work."
                      : "Metadata, responsive structure and handoff stay included."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceRouteDefinition({ page }: { page: ServicePageData }) {
  return (
    <section className="relative mx-auto grid w-[min(94vw,1500px)] gap-8 border-b border-neutral-950/12 py-12 md:grid-cols-[0.36fr_0.64fr] md:py-16">
      <div>
        <SectionSignal index="02" label="What this route is" />
        <h2 className="mt-5 max-w-[10ch] text-[clamp(2.8rem,6vw,5.2rem)] font-normal leading-[0.9] tracking-normal text-neutral-950">
          One clear commercial route.
        </h2>
      </div>
      <p className="max-w-[46rem] text-[22px] leading-[1.18] text-neutral-800 md:text-[32px]">
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
          <SectionSignal index="03" label="Best for" />
        </div>
        <div className="grid border-y border-neutral-950/12">
          {items.map((item, index) => (
            <div key={item} className="grid gap-3 border-b border-neutral-950/10 py-4 last:border-b-0 sm:grid-cols-[4rem_1fr] sm:items-baseline">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-300">
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

function Method({ steps }: { steps: ServicePageData["method"] }) {
  return (
    <section className="relative mx-auto w-[min(94vw,1500px)] border-b border-neutral-950/12 py-12 md:py-16">
      <div className="grid gap-8 md:grid-cols-[0.36fr_0.64fr]">
        <div>
          <SectionSignal index="04" label="Method" />
          <h2 className="mt-5 max-w-[9ch] text-[clamp(2.8rem,6vw,5.2rem)] font-normal leading-[0.9] tracking-normal text-neutral-950">
            Built through a quiet sequence.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {steps.map((step, index) => (
            <article key={step.title} className="border-y border-neutral-950/12 bg-white/18 p-4 backdrop-blur-sm">
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-4 text-[24px] leading-none text-neutral-950">{step.title}</h3>
              <p className="mt-3 text-[13px] leading-6 text-neutral-600">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProofStrip({ proof }: { proof: ServiceProofRef[] }) {
  const cards = proof.map(resolveProof).filter((item): item is ProofCardData => Boolean(item));

  return (
    <section className="relative mx-auto w-[min(94vw,1500px)] border-b border-neutral-950/12 py-12 md:py-16">
      <div className="grid gap-8 md:grid-cols-[0.36fr_0.64fr]">
        <div>
          <SectionSignal index="05" label="Relevant proof" />
          <p className="mt-5 max-w-[22rem] text-[14px] leading-7 text-neutral-500">
            Short proof references only. Full case stories stay inside Work and Immersive.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              to={card.href}
              className="group grid overflow-hidden border border-neutral-950/12 bg-white/24 text-left shadow-[0_18px_54px_rgba(15,15,15,0.05)] transition hover:-translate-y-1 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-neutral-950">
                <img
                  src={card.image}
                  alt={card.alt}
                  className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
                <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.32))]" />
                <span className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/72">
                  {card.type}
                </span>
              </span>
              <span className="grid gap-3 p-4">
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
          <SectionSignal index="06" label="What you receive" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item, index) => (
            <div key={item} className="grid grid-cols-[2.8rem_1fr] gap-3 border-y border-neutral-950/10 bg-white/14 px-3 py-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-300">
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
            <SectionSignal index="07" label="Start route" />
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

export default function ServicePage({ drawerOpen = false, onOpenProject, onCloseProject }: PageProps) {
  const { slug } = useParams();
  const page = getServicePage(slug);

  if (!page) {
    return <Navigate to="/offer" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-neutral-950">
      <ServiceMeta page={page} />
      <Header drawerOpen={drawerOpen} onOpenProject={onOpenProject} onCloseProject={onCloseProject} />
      <PageSurface className="relative min-h-screen overflow-x-clip bg-transparent">
        <AtmosphericSiteShell preset="practice" />
        <main className="relative">
          <ServiceHero page={page} onOpenProject={onOpenProject} />
          <ServiceRouteDefinition page={page} />
          <BestFor items={page.bestFor} />
          <Method steps={page.method} />
          <ProofStrip proof={page.proof} />
          <Deliverables items={page.deliverables} />
          <StartRoute page={page} onOpenProject={onOpenProject} />
        </main>
        <SiteFooterV2 onOpenProject={onOpenProject} variant="practice" hideClosingSignal />
      </PageSurface>
    </div>
  );
}
