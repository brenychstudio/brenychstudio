import {
  useEffect,
  useMemo,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
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
import { localizeCase, localizeImmersiveItem, localizeServicePage } from "../data/localization";
import { getServicePage, type ServicePageData, type ServiceProofRef } from "../data/servicePages";
import {
  getLocalizedPath,
  isSpanishPublicCaseRegistrySlug,
  isSpanishPublicImmersiveSlug,
  isSpanishPublicServiceSlug,
  useI18n,
  type LocaleCode,
} from "../i18n";
import { getSeoAlternates } from "../seo/alternates";

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
  noIndex?: boolean;
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

function resolveProof(ref: ServiceProofRef, locale: LocaleCode): ProofCardData | null {
  if (locale === "es") {
    const isPublicProof =
      ref.source === "immersive" ? isSpanishPublicImmersiveSlug(ref.slug) : isSpanishPublicCaseRegistrySlug(ref.slug);

    if (!isPublicProof) return null;
  }

  if (ref.source === "immersive") {
    const sourceItem = immersiveItems.find((candidate) => candidate.slug === ref.slug);
    const item = sourceItem ? localizeImmersiveItem(sourceItem, locale) : null;
    if (!item) return null;

    return {
      title: item.title,
      claim: ref.claim,
      image: item.previewPoster ?? item.frames?.[0]?.src ?? "/og-default.png",
      alt: item.frames?.[0]?.alt ?? `${item.title} immersive case preview`,
      type: item.searchContent?.category ?? item.medium,
      href: getLocalizedPath(`/immersive/${item.slug}`, locale),
      label: ref.label,
      role: ref.role,
    };
  }

  const sourceItem = getCaseBySlug(ref.slug);
  const item = sourceItem ? localizeCase(sourceItem, locale) : null;
  if (!item) return null;

  return {
    title: item.title,
    claim: ref.claim,
    image: item.previewImage,
    alt: item.alt,
    type: item.category,
    href: getLocalizedPath(getCasePath(item.slug), locale),
    label: ref.label,
    role: ref.role,
  };
}

function getResolvedProof(page: ServicePageData, locale: LocaleCode) {
  return page.proof.map((item) => resolveProof(item, locale)).filter((item): item is ProofCardData => Boolean(item));
}

function shortenText(text: string, maxLength = 150) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

type ServiceUi = {
  serviceThreshold: string;
  spatialProofChamber: string;
  demoSpine: string;
  viewCase: string;
  demoNarrative: string;
  productProofHeadline: string;
  workflowProof: string;
  immersiveProof: string;
  immersiveProofHeadline: string;
  routeModel: string;
  product: string;
  demo: string;
  field: string;
  route: string;
  buildSequence: string;
  spatialSequence: string;
  builtThrough: string;
  bestWhen: string;
  projectGallery: string;
  galleryAria: string;
  startRoute: string;
};

function getServiceUi(locale: LocaleCode): ServiceUi {
  if (locale === "es") {
    return {
      serviceThreshold: "Umbral de servicio",
      spatialProofChamber: "Camara de prueba espacial",
      demoSpine: "Columna demo",
      viewCase: "Ver caso",
      demoNarrative: "Narrativa demo",
      productProofHeadline: "Prueba de producto antes que promesa.",
      workflowProof: "prueba de flujo",
      immersiveProof: "Prueba inmersiva",
      immersiveProofHeadline: "Prueba espacial con bordes usables.",
      routeModel: "Modelo de ruta",
      product: "producto",
      demo: "demo",
      field: "campo",
      route: "ruta",
      buildSequence: "Secuencia de construccion",
      spatialSequence: "Secuencia espacial",
      builtThrough: "Construido mediante",
      bestWhen: "Mejor cuando",
      projectGallery: "Galeria de proyectos",
      galleryAria: "Galeria desplazable de prueba de proyectos",
      startRoute: "Ruta de inicio",
    };
  }

  return {
    serviceThreshold: "Service threshold",
    spatialProofChamber: "Spatial proof chamber",
    demoSpine: "Demo spine",
    viewCase: "View case",
    demoNarrative: "Demo narrative",
    productProofHeadline: "Product proof before product claims.",
    workflowProof: "workflow proof",
    immersiveProof: "Immersive proof",
    immersiveProofHeadline: "Spatial proof with usable edges.",
    routeModel: "Route model",
    product: "product",
    demo: "demo",
    field: "field",
    route: "route",
    buildSequence: "Build sequence",
    spatialSequence: "Spatial sequence",
    builtThrough: "Built through",
    bestWhen: "Best when",
    projectGallery: "Project gallery",
    galleryAria: "Scrollable project proof gallery",
    startRoute: "Start route",
  };
}

function ServiceMeta({
  page,
  proofCards,
  noIndex = false,
  locale,
}: {
  page: ServicePageData;
  proofCards: ProofCardData[];
  noIndex?: boolean;
  locale: LocaleCode;
}) {
  const heroProof = proofCards[0];
  const path = getLocalizedPath(page.path, locale);
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.schemaName,
    description: page.metaDescription,
    url: toAbsoluteSiteUrl(path),
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
        path={path}
        image={heroProof?.image ?? "/og-default.png"}
        imageAlt={heroProof?.alt ?? `${page.schemaName} by Brenych Studio`}
        type="website"
        noIndex={noIndex}
        alternates={getSeoAlternates(path)}
      />
      <StructuredData id={`structured-data-service-${page.slug}`} data={serviceSchema} />
    </>
  );
}

function getGalleryPriority(tone: ServicePageData["visualTone"]) {
  if (tone === "product") {
    return [
      "/work/creatorops",
      "/work/sprintcrm",
      "/work/barcelona-private-advisory",
      "/work/arcwave-integrations",
      "/work/print-border-studio",
      "/work/form-index",
    ];
  }

  if (tone === "immersive") {
    return [
      "/immersive/whisper",
      "/immersive/webhero",
      "/immersive/kool-berk",
      "/immersive/presence-os-memory-atlas",
      "/immersive/orbit-lens",
      "/work/house-of-lune",
      "/work/arcwave-integrations",
    ];
  }

  return [
    "/work/house-of-lune",
    "/work/barcelona-private-advisory",
    "/work/creatorops",
    "/work/oria-house-barcelona",
    "/work/casa-nube",
    "/work/print-border-studio",
  ];
}

function getProjectGalleryCards(tone: ServicePageData["visualTone"], locale: LocaleCode): ProofCardData[] {
  const sourceCases =
    locale === "es" ? cases.filter((sourceItem) => isSpanishPublicCaseRegistrySlug(sourceItem.slug)) : cases;
  const sourceImmersiveItems =
    locale === "es" ? immersiveItems.filter((sourceItem) => isSpanishPublicImmersiveSlug(sourceItem.slug)) : immersiveItems;

  const workCards = sourceCases.map((sourceItem) => {
    const item = localizeCase(sourceItem, locale);

    return {
      title: item.title,
      claim: shortenText(item.shortDescription, 150),
      image: item.previewImage,
      alt: item.alt,
      type: item.category,
      href: getLocalizedPath(getCasePath(item.slug), locale),
      label: item.proofType,
      role: item.clientType ?? item.status,
    };
  });

  const immersiveCards = sourceImmersiveItems.map((sourceItem) => {
    const item = localizeImmersiveItem(sourceItem, locale);

    return {
      title: item.title,
      claim: shortenText(item.searchContent?.shortDescription ?? item.description, 150),
      image: item.previewPoster ?? item.frames?.[0]?.src ?? "/og-default.png",
      alt: item.frames?.[0]?.alt ?? `${item.title} immersive case preview`,
      type: item.searchContent?.category ?? "Immersive System",
      href: getLocalizedPath(`/immersive/${item.slug}`, locale),
      label: item.searchContent?.proofType ?? "Immersive Proof",
      role: item.medium,
    };
  });

  const priority = getGalleryPriority(tone);

  return [...workCards, ...immersiveCards].sort((first, second) => {
    const firstRank = priority.indexOf(first.href.replace(/^\/es/, ""));
    const secondRank = priority.indexOf(second.href.replace(/^\/es/, ""));
    const normalizedFirst = firstRank === -1 ? priority.length + 1 : firstRank;
    const normalizedSecond = secondRank === -1 ? priority.length + 1 : secondRank;

    return normalizedFirst - normalizedSecond;
  });
}

function getDirectedProofCopy(page: ServicePageData, locale: LocaleCode) {
  if (locale === "es") {
    if (page.visualTone === "product") {
      return [
        {
          title: "El workflow se vuelve visible.",
          text: "Una pagina demo debe mostrar la promesa del producto mediante pantallas, estados y pruebas de flujo antes de la primera explicacion.",
        },
        {
          title: "El pitch se vuelve ruta.",
          text: "Solicitud demo, lista de espera, beta o revision inversora se ordenan en una ruta enfocada, no en un deck suelto.",
        },
      ];
    }

    if (page.visualTone === "immersive") {
      return [
        {
          title: "La atmosfera se vuelve estructura.",
          text: "Una ruta inmersiva necesita mas que mood: un mundo legible, logica visual clara y una forma precisa de atravesar la experiencia.",
        },
        {
          title: "El movimiento sigue siendo usable.",
          text: "Capas cinematicas, prueba de archivo y ritmo espacial pueden avanzar juntas sin ocultar el mensaje ni convertir la pagina en una demo tecnica.",
        },
      ];
    }

    return [
      {
        title: "La confianza se vuelve ruta.",
        text: "Una pagina premium no es una pila de secciones. Dirige la atencion mediante prueba, contexto, jerarquia visual y una via clara de consulta.",
      },
      {
        title: "Un lanzamiento necesita movimiento, no ruido.",
        text: "La superficie puede moverse con la oferta: modulos de producto, pantallas de prueba, logica de campaña y handoff enfocado sin volverse un sitio pesado.",
      },
    ];
  }

  if (page.visualTone === "product") {
    return [
      {
        title: "The workflow becomes visible.",
        text: "A product demo page should let a founder show the product promise through screens, states and workflow evidence before the first explanation.",
      },
      {
        title: "The pitch turns into a path.",
        text: "Demo request, waitlist, beta access or investor review become one focused route instead of a loose deck and scattered screenshots.",
      },
    ];
  }

  if (page.visualTone === "immersive") {
    return [
      {
        title: "Atmosphere becomes structure.",
        text: "An immersive route needs more than mood. It needs a readable world, visible media logic and a clear way through the experience.",
      },
      {
        title: "Motion stays usable.",
        text: "Cinematic layers, archive proof and spatial rhythm can move together without hiding the message or turning the page into a technical demo.",
      },
    ];
  }

  return [
    {
      title: "Trust becomes a route.",
      text: "A premium page is not a pile of sections. It guides attention through proof, context, visual hierarchy and one clear inquiry path.",
    },
    {
      title: "A launch needs motion, not noise.",
      text: "The surface can move with the offer: product modules, proof screens, campaign logic and a focused handoff without becoming a heavy website.",
    },
  ];
}

function getGalleryCopy(tone: ServicePageData["visualTone"], locale: LocaleCode) {
  if (locale === "es") {
    if (tone === "product") {
      return {
        title: "Recorre la prueba de producto.",
        text: "Un rail amplio de prueba mantiene visibles workflow, SaaS, CRM y superficies de advisory sin convertir la ruta en un archivo de casos.",
      };
    }

    if (tone === "immersive") {
      return {
        title: "Muévete por el campo de prueba espacial.",
        text: "El trabajo inmersivo y de interfaz permanece disponible en un rail cinematografico, para mostrar atmosfera, logica de medios y sistemas usables a la vez.",
      };
    }

    return {
      title: "Recorre el campo de prueba.",
      text: "Una galeria amplia de prueba permanece disponible sin convertir la pagina en un archivo pesado. Desplaza el rail y entra en cualquier proyecto.",
    };
  }

  if (tone === "product") {
    return {
      title: "Scroll through product proof.",
      text: "A wider product proof rail keeps workflow, SaaS, CRM and advisory surfaces available without turning the route into a case archive.",
    };
  }

  if (tone === "immersive") {
    return {
      title: "Move through the spatial proof field.",
      text: "Immersive and interface-led work stay available in one cinematic rail, so the route can show atmosphere, media logic and usable systems together.",
    };
  }

  return {
    title: "Scroll through the proof field.",
    text: "A wider proof gallery stays available without turning the page into a heavy archive. Scroll the rail and enter any project directly.",
  };
}

function PremiumCoverCard({
  card,
  index,
  size = "default",
  viewCaseLabel = "View case",
}: {
  card: ProofCardData;
  index: number;
  size?: "hero" | "default" | "gallery";
  viewCaseLabel?: string;
}) {
  const imageHeight = size === "hero" ? "aspect-[16/10]" : size === "gallery" ? "aspect-[16/11]" : "aspect-[16/10]";
  const imageClass =
    size === "gallery"
      ? "h-full w-full object-cover opacity-90 saturate-[0.92] transition duration-700 group-hover:scale-[1.035] group-hover:opacity-100 group-hover:saturate-100"
      : "h-full w-full object-cover opacity-[0.92] saturate-[0.94] transition duration-700 group-hover:scale-[1.035] group-hover:opacity-100 group-hover:saturate-100";
  const overlayClass =
    size === "gallery"
      ? "absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.3))] transition-opacity duration-700 group-hover:opacity-0"
      : "absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.24))] transition-opacity duration-700 group-hover:opacity-0";
  const titleClass =
    size === "hero"
      ? "text-[clamp(1.8rem,3vw,2.65rem)] leading-none text-neutral-950"
      : size === "gallery"
        ? "text-[20px] leading-none text-neutral-950"
        : "text-[22px] leading-none text-neutral-950";

  return (
    <Link
      to={card.href}
      data-proof-link="true"
      draggable={false}
      className="group flex h-full flex-col overflow-hidden border border-neutral-950/12 bg-white/76 text-left shadow-[0_24px_90px_rgba(20,20,20,0.08)] backdrop-blur-md transition duration-500 hover:-translate-y-1 hover:shadow-[0_32px_120px_rgba(20,20,20,0.13)] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
    >
      <span className={`relative block overflow-hidden bg-neutral-950 ${imageHeight}`}>
        <img
          src={card.image}
          alt={card.alt}
          draggable={false}
          className={imageClass}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
        />
        <span className={overlayClass} />
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
        <span className="mt-auto pt-2 text-[10px] uppercase tracking-[0.16em] text-neutral-500">
          {viewCaseLabel} -&gt;
        </span>
      </span>
    </Link>
  );
}

function PremiumLandingHero({
  page,
  proofCards,
  onOpenProject,
  ui,
}: {
  page: ServicePageData;
  proofCards: ProofCardData[];
  onOpenProject?: () => void;
  ui: ServiceUi;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const coverY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const coverRotate = useTransform(scrollYProgress, [0, 1], ["-1.4deg", "1.2deg"]);
  const coverScale = useTransform(scrollYProgress, [0, 0.72, 1], [1, 1.055, 1.035]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-2%"]);
  const primaryCard = proofCards[0];
  const secondaryCard = proofCards[1];
  const isProduct = page.visualTone === "product";
  const isImmersive = page.visualTone === "immersive";
  const heroGridClass = isImmersive
    ? "lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1.18fr)]"
    : isProduct
      ? "lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.08fr)]"
      : "lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)]";
  const titleClass = isImmersive
    ? "mt-7 max-w-[11ch] text-[clamp(3rem,6vw,6.7rem)] font-normal leading-[0.88] tracking-normal text-neutral-950"
    : isProduct
      ? "mt-7 max-w-[11ch] text-[clamp(3.05rem,6.4vw,7.3rem)] font-normal leading-[0.88] tracking-normal text-neutral-950"
      : "mt-7 max-w-[10.5ch] text-[clamp(3.15rem,6.2vw,7rem)] font-normal leading-[0.88] tracking-normal text-neutral-950";

  return (
    <section
      ref={ref}
      id="service-threshold"
      data-header-scene="practice-threshold"
      data-sound-safe-area
      className={`relative mx-auto grid w-[min(94vw,1640px)] gap-8 border-y border-neutral-950/12 py-9 pt-24 md:py-10 md:pt-28 lg:min-h-[calc(100svh-5rem)] lg:items-center xl:gap-12 ${heroGridClass}`}
    >
      <motion.div
        style={reduceMotion ? undefined : { y: copyY }}
        className="relative z-10 min-w-0"
      >
        <SectionSignal index="01" label={ui.serviceThreshold} />
        <h1 className={titleClass}>
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

      {isImmersive ? (
        <div className="relative min-h-[30rem] overflow-hidden border border-neutral-950/25 bg-[#020403] p-4 text-white shadow-[0_44px_140px_rgba(0,0,0,0.22)] md:min-h-[42rem] md:p-5">
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:70px_70px]" />
          <div className="pointer-events-none absolute left-[10%] top-[14%] h-[72%] w-[82%] rounded-[999px] border border-cyan-100/12" />
          <div className="pointer-events-none absolute left-[20%] top-[24%] h-[52%] w-[62%] rounded-[999px] border border-white/10" />
          <div className="relative z-10 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-white/54">
            <span>{ui.spatialProofChamber}</span>
            <span>{page.heroProofLayout.replace("-stack", " stack")}</span>
          </div>
          <motion.div
            style={reduceMotion ? undefined : { y: coverY, rotate: coverRotate, scale: coverScale }}
            className="relative z-10 mx-auto mt-8 w-full max-w-[48rem] md:mt-10"
          >
            {primaryCard ? <PremiumCoverCard card={primaryCard} index={0} size="hero" viewCaseLabel={ui.viewCase} /> : null}
          </motion.div>
          {secondaryCard ? (
            <motion.div
              style={reduceMotion ? undefined : { y: copyY }}
              className="relative z-20 mt-5 w-[min(78vw,28rem)] rotate-2 md:absolute md:right-8 md:top-24 md:mt-0"
            >
              <PremiumCoverCard card={secondaryCard} index={1} viewCaseLabel={ui.viewCase} />
            </motion.div>
          ) : null}
        </div>
      ) : isProduct ? (
        <div className="relative min-h-[26rem] overflow-hidden border border-neutral-950/18 bg-neutral-950 p-4 text-white shadow-[0_38px_130px_rgba(0,0,0,0.18)] md:min-h-[38rem] md:p-5">
          <div className="pointer-events-none absolute inset-0 opacity-[0.09] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:58px_58px]" />
          <div className="relative z-10 grid h-full gap-5 md:grid-cols-[0.72fr_0.28fr]">
            <motion.div
              style={reduceMotion ? undefined : { y: coverY, rotate: coverRotate, scale: coverScale }}
              className="w-full max-w-[51rem] self-center"
            >
              {primaryCard ? <PremiumCoverCard card={primaryCard} index={0} size="hero" viewCaseLabel={ui.viewCase} /> : null}
            </motion.div>
            <div className="grid content-between gap-4 border-t border-white/14 pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/46">{ui.demoSpine}</div>
                <div className="mt-5 grid gap-3">
                  {page.routeLedger.map((item, index) => (
                    <div key={item.title} className="border-t border-white/14 pt-3">
                      <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/38">
                        {String(index + 1).padStart(2, "0")} / {ui.product}
                      </div>
                      <p className="mt-2 text-[18px] leading-none text-white">{item.title}</p>
                    </div>
                  ))}
                </div>
              </div>
              {secondaryCard ? (
                <Link
                  to={secondaryCard.href}
                  className="group border-y border-white/14 py-4 transition hover:border-white/26 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/55"
                >
                  <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/38">{secondaryCard.label}</span>
                  <span className="mt-2 block text-[18px] leading-none text-white">{secondaryCard.title}</span>
                  <span className="mt-2 block text-[12px] leading-5 text-white/50">{secondaryCard.claim}</span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative min-h-[24rem] overflow-visible md:min-h-[34rem] lg:min-h-[40rem]">
          <div className="pointer-events-none absolute inset-0 border border-neutral-950/10 bg-white/16 backdrop-blur-[2px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] [background-size:64px_64px]" />
          <motion.div
            style={reduceMotion ? undefined : { y: coverY, rotate: coverRotate, scale: coverScale }}
            className="relative z-10 mx-auto w-full max-w-[50rem] pt-5 md:pt-8 lg:ml-auto lg:mr-0"
          >
            {primaryCard ? <PremiumCoverCard card={primaryCard} index={0} size="hero" viewCaseLabel={ui.viewCase} /> : null}
          </motion.div>
        </div>
      )}
    </section>
  );
}

function PremiumSequenceScene({
  card,
  index,
  title,
  text,
  ui,
  reverse = false,
}: {
  card: ProofCardData;
  index: number;
  title: string;
  text: string;
  ui: ServiceUi;
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
          {ui.viewCase} -&gt;
        </Link>
      </motion.div>
      <motion.div
        style={reduceMotion ? undefined : { y: coverY, rotate: coverRotate, scale: coverScale }}
        className={`w-full max-w-[48rem] ${reverse ? "md:order-1" : "md:justify-self-end"}`}
      >
        <PremiumCoverCard card={card} index={index + 1} viewCaseLabel={ui.viewCase} />
      </motion.div>
    </section>
  );
}

function PremiumDirectedProof({
  page,
  proofCards,
  locale,
  ui,
}: {
  page: ServicePageData;
  proofCards: ProofCardData[];
  locale: LocaleCode;
  ui: ServiceUi;
}) {
  const secondary = proofCards[1];
  const tertiary = proofCards[2];
  const scenes = getDirectedProofCopy(page, locale);

  if (page.visualTone === "product") {
    return (
      <section className="relative mx-auto w-[min(94vw,1640px)] border-b border-neutral-950/12 py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-center">
          <div>
            <SectionSignal index="02" label={ui.demoNarrative} />
            <h2 className="mt-5 max-w-[11ch] text-[clamp(2.7rem,5.3vw,5.4rem)] font-normal leading-[0.9] tracking-normal text-neutral-950">
              {ui.productProofHeadline}
            </h2>
            <p className="mt-6 max-w-[31rem] text-[15px] leading-7 text-neutral-600">{page.proofStatement}</p>
          </div>
          <div className="grid gap-4">
            {[secondary, tertiary].filter((card): card is ProofCardData => Boolean(card)).map((card, index) => (
              <Link
                key={card.href}
                to={card.href}
                className="group grid gap-4 border-y border-neutral-950/12 bg-white/18 p-4 transition hover:bg-white/48 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 md:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)] md:items-center"
              >
                <span className="relative block aspect-[16/10] overflow-hidden bg-neutral-950">
                  <img src={card.image} alt={card.alt} className="h-full w-full object-cover opacity-95 transition duration-700 group-hover:scale-[1.035]" loading="lazy" decoding="async" />
                  <span className="absolute bottom-3 left-3 font-mono text-[8px] uppercase tracking-[0.16em] text-white/66">{card.label}</span>
                </span>
                <span className="block">
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
                    0{index + 2} / {ui.workflowProof}
                  </span>
                  <span className="mt-3 block text-[clamp(1.8rem,3.1vw,3rem)] leading-[0.95] text-neutral-950">{scenes[index].title}</span>
                  <span className="mt-4 block text-[14px] leading-7 text-neutral-600">{scenes[index].text}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (page.visualTone === "immersive") {
    const immersiveDirectedCards = [proofCards[2], proofCards[3]].filter(
      (card): card is ProofCardData => Boolean(card),
    );

    return (
      <section className="relative mx-auto w-[min(94vw,1640px)] border-b border-neutral-950/12 py-10 md:py-14">
        <div className="relative overflow-hidden border border-neutral-950/24 bg-[#020403] p-4 text-white shadow-[0_44px_140px_rgba(0,0,0,0.2)] md:p-7">
          <div className="pointer-events-none absolute inset-0 opacity-[0.09] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:72px_72px]" />
          <div className="pointer-events-none absolute right-[7%] top-[10%] h-[72%] w-[58%] rounded-[999px] border border-cyan-100/12" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[0.36fr_0.64fr] lg:items-end">
            <div>
              <SectionSignal index="02" label={ui.immersiveProof} />
              <h2 className="mt-5 max-w-[9ch] text-[clamp(2.9rem,5.6vw,5.8rem)] font-normal leading-[0.9] tracking-normal text-white">
                {ui.immersiveProofHeadline}
              </h2>
              <p className="mt-6 max-w-[30rem] text-[15px] leading-7 text-white/54">{page.proofStatement}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {immersiveDirectedCards.map((card, index) => (
                <motion.div
                  key={card.href}
                  className={index === 1 ? "md:pt-16" : ""}
                  whileHover={{ y: -7, scale: 1.012 }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                >
                  <PremiumCoverCard card={card} index={index + 1} viewCaseLabel={ui.viewCase} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative mx-auto w-[min(94vw,1640px)] border-b border-neutral-950/12">
      {secondary ? (
        <PremiumSequenceScene
          card={secondary}
          index={0}
          title={scenes[0].title}
          text={scenes[0].text}
          ui={ui}
        />
      ) : null}
      {tertiary ? (
        <PremiumSequenceScene
          card={tertiary}
          index={1}
          title={scenes[1].title}
          text={scenes[1].text}
          ui={ui}
          reverse
        />
      ) : null}
    </section>
  );
}

function PremiumServiceModel({ page, ui }: { page: ServicePageData; ui: ServiceUi }) {
  const methodLine = page.method.map((step) => step.title).join(" -> ");

  if (page.visualTone === "product") {
    return (
      <section className="relative mx-auto w-[min(94vw,1640px)] border-b border-neutral-950/12 py-10 md:py-14">
        <div className="grid gap-9 lg:grid-cols-[0.36fr_0.64fr] lg:items-start">
          <div>
            <SectionSignal index="04" label={ui.routeModel} />
            <h2 className="mt-5 max-w-[10ch] text-[clamp(2.8rem,5.8vw,5.4rem)] font-normal leading-[0.9] tracking-normal text-neutral-950">
              {page.routeTitle}
            </h2>
            <p className="mt-6 max-w-[31rem] text-[16px] leading-8 text-neutral-600">{page.routeDefinition}</p>
          </div>

          <div className="grid gap-8">
            <div className="grid gap-px overflow-hidden border-y border-neutral-950/12 bg-neutral-950/10 md:grid-cols-3">
              {page.routeLedger.map((item, index) => (
                <article key={item.title} className="bg-[#f4f1ea]/88 p-4 md:min-h-[13rem]">
                  <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
                    {String(index + 1).padStart(2, "0")} / {ui.demo}
                  </div>
                  <h3 className="mt-7 text-[clamp(1.7rem,2.4vw,2.7rem)] leading-[0.94] text-neutral-950">{item.title}</h3>
                  <p className="mt-4 text-[13px] leading-6 text-neutral-600">{item.text}</p>
                </article>
              ))}
            </div>

            <div className="border-y border-neutral-950/12 py-5">
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">{ui.buildSequence}</div>
              <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 text-[17px] leading-7 text-neutral-800">
                {page.method.map((step, index) => (
                  <span key={step.title}>
                    {step.title}
                    {index < page.method.length - 1 ? <span className="px-3 text-neutral-300">-&gt;</span> : null}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (page.visualTone === "immersive") {
    return (
      <section className="relative mx-auto w-[min(94vw,1640px)] border-b border-neutral-950/12 py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-center">
          <div>
            <SectionSignal index="04" label={ui.routeModel} />
            <h2 className="mt-5 max-w-[10ch] text-[clamp(2.8rem,5.8vw,5.4rem)] font-normal leading-[0.9] tracking-normal text-neutral-950">
              {page.routeTitle}
            </h2>
            <p className="mt-6 max-w-[32rem] text-[16px] leading-8 text-neutral-600">{page.routeDefinition}</p>
          </div>

          <div className="relative overflow-hidden border border-neutral-950/18 bg-white/20 p-5 backdrop-blur-sm md:p-7">
            <div className="pointer-events-none absolute left-[10%] top-[8%] h-[84%] w-[76%] rounded-[999px] border border-neutral-950/10" />
            <div className="relative grid gap-6">
              {page.routeLedger.map((item, index) => (
                <article key={item.title} className="grid gap-3 border-t border-neutral-950/12 pt-5 md:grid-cols-[5rem_0.38fr_0.62fr] md:items-start">
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-300">
                    {String(index + 1).padStart(2, "0")} / {ui.field}
                  </span>
                  <h3 className="text-[clamp(1.7rem,2.4vw,2.55rem)] leading-[0.95] text-neutral-950">{item.title}</h3>
                  <p className="text-[13px] leading-6 text-neutral-600">{item.text}</p>
                </article>
              ))}
              <div className="border-y border-neutral-950/12 py-4">
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">{ui.spatialSequence}</div>
                <p className="mt-3 text-[18px] leading-8 text-neutral-800">{methodLine}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative mx-auto w-[min(94vw,1640px)] border-b border-neutral-950/12 py-10 md:py-14">
      <div className="grid gap-10 lg:grid-cols-[0.38fr_0.62fr] lg:items-start">
        <div>
          <SectionSignal index="04" label={ui.routeModel} />
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
                  {String(index + 1).padStart(2, "0")} / {ui.route}
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
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">{ui.builtThrough}</div>
              <p className="mt-3 text-[20px] leading-7 text-neutral-800">{methodLine}</p>
            </div>

            <div className="border-t border-neutral-950/12 pt-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">{ui.bestWhen}</div>
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

function PremiumProjectGallery({
  page,
  cards,
  locale,
  ui,
}: {
  page: ServicePageData;
  cards: ProofCardData[];
  locale: LocaleCode;
  ui: ServiceUi;
}) {
  const navigate = useNavigate();
  const railRef = useRef<HTMLDivElement | null>(null);
  const loopResetRef = useRef<number | null>(null);
  const wheelFrameRef = useRef<number | null>(null);
  const wheelVelocityRef = useRef(0);
  const suppressNextClickRef = useRef(false);
  const dragState = useRef({
    active: false,
    moved: false,
    pointerId: -1,
    startX: 0,
    scrollLeft: 0,
    targetHref: "",
  });
  const loopCards = useMemo(() => [...cards, ...cards, ...cards], [cards]);
  const galleryCopy = getGalleryCopy(page.visualTone, locale);

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
    const target = event.target as HTMLElement;
    const proofLink = target.closest('a[data-proof-link="true"]') as HTMLAnchorElement | null;

    dragState.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: rail.scrollLeft,
      targetHref: proofLink?.getAttribute("href") ?? "",
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

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    const state = dragState.current;
    if (!state.active || state.pointerId !== event.pointerId) return;

    const targetHref = state.targetHref;
    const shouldOpenCase = !state.moved && Boolean(targetHref);

    state.active = false;
    state.targetHref = "";
    if (rail?.hasPointerCapture(event.pointerId)) {
      rail.releasePointerCapture(event.pointerId);
    }
    normalizeLoopPosition();

    if (shouldOpenCase) {
      event.preventDefault();
      event.stopPropagation();
      suppressNextClickRef.current = true;
      navigate(targetHref);
    }
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
    if (!dragState.current.moved && !suppressNextClickRef.current) return;

    event.preventDefault();
    event.stopPropagation();
    dragState.current.moved = false;
    suppressNextClickRef.current = false;
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
          <SectionSignal index="05" label={ui.projectGallery} />
          <h2 className="mt-5 max-w-[9ch] text-[clamp(2.7rem,5vw,5rem)] font-normal leading-[0.9] tracking-normal text-neutral-950">
            {galleryCopy.title}
          </h2>
        </div>
        <p className="max-w-[44rem] text-[16px] leading-8 text-neutral-600">
          {galleryCopy.text}
        </p>
      </div>

      <div
        ref={railRef}
        role="region"
        aria-label={ui.galleryAria}
        className="cursor-grab overflow-x-auto overscroll-contain pb-5 active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
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
              <PremiumCoverCard card={card} index={index % cards.length} size="gallery" viewCaseLabel={ui.viewCase} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PremiumClosingRoute({
  page,
  onOpenProject,
  ui,
}: {
  page: ServicePageData;
  onOpenProject?: () => void;
  ui: ServiceUi;
}) {
  return (
    <section className="relative mx-auto w-[min(94vw,1640px)] py-12 md:py-16" data-sound-safe-area>
      <div className="grid gap-8 border-y border-neutral-950/12 bg-white/18 px-4 py-8 backdrop-blur-sm md:grid-cols-[0.48fr_0.52fr] md:items-end md:px-7 md:py-10">
        <div>
          <SectionSignal index="06" label={ui.startRoute} />
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
  locale,
}: {
  page: ServicePageData;
  proofCards: ProofCardData[];
  galleryCards: ProofCardData[];
  onOpenProject?: () => void;
  locale: LocaleCode;
}) {
  const ui = getServiceUi(locale);

  return (
    <>
      <PremiumLandingHero page={page} proofCards={proofCards} onOpenProject={onOpenProject} ui={ui} />
      <PremiumDirectedProof page={page} proofCards={proofCards} locale={locale} ui={ui} />
      <PremiumServiceModel page={page} ui={ui} />
      <PremiumProjectGallery page={page} cards={galleryCards} locale={locale} ui={ui} />
      <PremiumClosingRoute page={page} onOpenProject={onOpenProject} ui={ui} />
    </>
  );
}

export default function ServicePage({
  drawerOpen = false,
  onOpenProject,
  onCloseProject,
  noIndex = false,
}: PageProps) {
  const { slug } = useParams();
  const { locale } = useI18n();
  const sourcePage = getServicePage(slug);
  const isUnavailableSpanishService = locale === "es" && !isSpanishPublicServiceSlug(slug);
  const page = useMemo(
    () => (sourcePage ? localizeServicePage(sourcePage, locale) : null),
    [locale, sourcePage],
  );
  const galleryCards = useMemo(
    () => (page ? getProjectGalleryCards(page.visualTone, locale) : []),
    [locale, page],
  );

  if (!page || isUnavailableSpanishService) {
    return <Navigate to={getLocalizedPath("/offer", locale)} replace />;
  }

  const proofCards = getResolvedProof(page, locale);

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-neutral-950">
      <ServiceMeta page={page} proofCards={proofCards} locale={locale} noIndex={noIndex} />
      <Header drawerOpen={drawerOpen} onOpenProject={onOpenProject} onCloseProject={onCloseProject} />
      <PageSurface className="relative min-h-screen overflow-x-clip bg-transparent">
        <AtmosphericSiteShell preset="practice" />
        <main className="relative">
          <PremiumLandingRoute
            page={page}
            proofCards={proofCards}
            galleryCards={galleryCards}
            onOpenProject={onOpenProject}
            locale={locale}
          />
        </main>
        <SiteFooterV2 onOpenProject={onOpenProject} variant="practice" hideClosingSignal />
      </PageSurface>
    </div>
  );
}
