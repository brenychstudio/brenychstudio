import { lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

import OfferV2 from "./pages/OfferV2";
import ImmersiveV2 from "./pages/ImmersiveV2";
import ImmersiveCasePage from "./pages/ImmersiveCasePage";
import AboutV2 from "./pages/AboutV2";
import StudioIndex from "./pages/StudioIndex";
import EvidenceAtlas from "./pages/EvidenceAtlas";
import CasePageV2 from "./pages/CasePageV2";
import ServicePage from "./pages/ServicePage";
import ProjectDrawerV2 from "./ui/ProjectDrawerV2";
import ScrollToTop from "./ui/ScrollToTop";
import PageTransitionOverlay from "./ui/PageTransitionOverlay";
import SoundSignalDock from "./ui/SoundSignalDock";
import SeoMeta, { type SeoMetaProps } from "./ui/SeoMeta";
import StructuredData, { type StructuredDataValue } from "./ui/StructuredData";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  STUDIO_CITY,
  STUDIO_COUNTRY,
  STUDIO_LOCATION,
  STUDIO_REGION,
  toAbsoluteSiteUrl,
} from "./config/site";
import { I18nProvider } from "./i18n";
import { spanishPageSeoDrafts } from "./data/spanishContent";
import { getSeoAlternates, withSeoAlternates } from "./seo/alternates";
import { SoundProvider } from "./stage/audio/SoundProvider";

const SpatialProof = lazy(() => import("./pages/SpatialProof"));
const PrivacyV2 = lazy(() => import("./pages/PrivacyV2"));
const LegalV2 = lazy(() => import("./pages/LegalV2"));
const LivingAtlasPage = lazy(() => import("./pages/LivingAtlasPage"));
const LivingAtlasPrivacy = lazy(() => import("./pages/LivingAtlasPrivacy"));
const LivingAtlasSupport = lazy(() => import("./pages/LivingAtlasSupport"));

const routeSeo = {
  home: {
    title: "Brenych Studio — Product Engineering & Creative Technology",
    description:
      "Independent Barcelona studio building AI-native products, controlled agent systems, interactive software, real-time 3D / XR experiences and digital worlds.",
    path: "/",
  },
  work: {
    title: "Work — Products, Systems & Interactive Experiences | Brenych Studio",
    description:
      "Selected Brenych Studio work across software products, internal systems, creative technology, real-time 3D, immersive experiences and authored digital projects.",
    path: "/work",
  },
  immersive: {
    title: "Immersive & Spatial Systems — XR, Real-time 3D & Interactive Worlds | Brenych Studio",
    description:
      "Spatial interfaces, WebGL / WebGPU, XR environments, digital exhibitions and experimental interactive systems by Brenych Studio.",
    path: "/immersive",
  },
  offer: {
    title: "Product Engineering, AI Systems & Creative Technology | Brenych Studio",
    description:
      "Product development, controlled AI and agent systems, interactive software, real-time 3D / XR and creative technology for ambitious digital projects.",
    path: "/offer",
  },
  about: {
    title: "About — Rostyslav Brenych / Brenych Studio",
    description:
      "Rostyslav Brenych is the founder of Brenych Studio, an independent Barcelona practice spanning product engineering, AI systems, creative technology and spatial interaction.",
    path: "/about",
  },
  privacy: {
    title: "Privacy Policy - Brenych Studio",
    description:
      "How Brenych Studio handles information shared through project inquiries, preferences, and basic website interactions.",
    path: "/privacy",
  },
  legal: {
    title: "Legal Notice - Brenych Studio",
    description:
      "Terms for using the Brenych Studio website, viewing portfolio materials, and contacting the studio about projects.",
    path: "/legal",
  },
  livingAtlas: {
    title: "Living Atlas — Photography, Place & Light | Brenych Studio",
    description:
      "Living Atlas is a local-first photographic memory tool for preserving place, visits and light context around your captures.",
    path: "/living-atlas",
    noIndex: true,
  },
  livingAtlasPrivacy: {
    title: "Living Atlas Privacy Policy | Brenych Studio",
    description:
      "Privacy information for Living Atlas, including local photo and location storage, Atlas Pro purchases and third-party services.",
    path: "/living-atlas/privacy",
    noIndex: true,
  },
  livingAtlasSupport: {
    title: "Living Atlas Support | Brenych Studio",
    description:
      "Support for Living Atlas captures, locations, light planning, Atlas Pro and local app data.",
    path: "/living-atlas/support",
    noIndex: true,
  },
} satisfies Record<string, SeoMetaProps>;

type PublicSchemaLocale = "en" | "es";

const organizationDescriptions: Record<PublicSchemaLocale, string> = {
  en: "Independent product engineering and creative technology studio in Barcelona building intelligent software, controlled agent systems, spatial experiences and interactive worlds.",
  es: "Estudio independiente de ingeniería de producto y tecnología creativa en Barcelona que desarrolla software inteligente, sistemas de agentes con control explícito, experiencias espaciales y mundos interactivos.",
};

const organizationSlogans: Record<PublicSchemaLocale, string> = {
  en: "Product Engineering & Creative Technology Studio",
  es: "Estudio de ingeniería de producto y tecnología creativa",
};

function getOrganizationSchema(locale: PublicSchemaLocale): StructuredDataValue {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: toAbsoluteSiteUrl(DEFAULT_OG_IMAGE),
    slogan: organizationSlogans[locale],
    description: organizationDescriptions[locale],
    inLanguage: locale,
    address: {
      "@type": "PostalAddress",
      addressLocality: STUDIO_CITY,
      addressCountry: STUDIO_COUNTRY,
    },
    areaServed: [
      { "@type": "Place", name: STUDIO_CITY },
      { "@type": "Country", name: STUDIO_COUNTRY },
      { "@type": "Place", name: STUDIO_REGION },
      { "@type": "Place", name: "International" },
    ],
    availableLanguage: ["en", "es"],
    founder: {
      "@type": "Person",
      name: "Rostyslav Brenych",
    },
  };
}

function getWebsiteSchema(locale: PublicSchemaLocale): StructuredDataValue {
  const meta = locale === "es" ? spanishPageSeoDrafts["/"] : routeSeo.home;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: locale === "es" ? toAbsoluteSiteUrl("/es") : SITE_URL,
    description: meta.description,
    inLanguage: locale,
  };
}

function getAboutSchema(locale: PublicSchemaLocale): StructuredDataValue {
  const isSpanish = locale === "es";
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: isSpanish
      ? "Acerca de — Rostyslav Brenych / Brenych Studio"
      : "About — Rostyslav Brenych / Brenych Studio",
    url: toAbsoluteSiteUrl(isSpanish ? "/es/about" : "/about"),
    inLanguage: locale,
    mainEntity: {
      "@type": "Person",
      name: "Rostyslav Brenych",
      url: SITE_URL,
      jobTitle: "Founder & Creative Developer",
      homeLocation: { "@type": "Place", name: STUDIO_LOCATION },
      workLocation: { "@type": "Place", name: STUDIO_LOCATION },
    },
  };
}

const livingAtlasSchema: StructuredDataValue = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Living Atlas",
  applicationCategory: "Photography",
  operatingSystem: "iOS",
  url: toAbsoluteSiteUrl(routeSeo.livingAtlas.path),
  description: routeSeo.livingAtlas.description,
  inLanguage: "en",
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
};

function getSpanishMeta(path: string, fallback: SeoMetaProps): SeoMetaProps {
  const draft = spanishPageSeoDrafts[path];
  const spanishPath = `/es${path === "/" ? "" : path}`;

  return {
    ...fallback,
    title: draft?.title ?? fallback.title,
    description: draft?.description ?? fallback.description,
    ogTitle: draft?.ogTitle ?? fallback.ogTitle,
    ogDescription: draft?.ogDescription ?? fallback.ogDescription,
    imageAlt: draft?.ogTitle ?? fallback.imageAlt,
    path: spanishPath,
    alternates: getSeoAlternates(spanishPath),
  };
}

function SeoRoute({
  meta,
  structuredData,
  children,
}: {
  meta: SeoMetaProps;
  structuredData?: StructuredDataValue | StructuredDataValue[];
  children: ReactNode;
}) {
  return (
    <>
      <SeoMeta {...meta} />
      {structuredData ? <StructuredData id={`structured-data-${meta.path.replace(/[^a-z0-9]/gi, "-") || "home"}`} data={structuredData} /> : null}
      {children}
    </>
  );
}

function RoutePendingSurface() {
  const { pathname } = useLocation();
  const isWorkCase = pathname.startsWith("/work/");
  const isImmersiveCase = pathname.startsWith("/immersive/");
  const isPolicy = pathname === "/privacy" || pathname === "/legal";
  const isLivingAtlas = pathname === "/living-atlas" || pathname.startsWith("/living-atlas/");

  let background = "bg-[#f2efe8]";

  if (isLivingAtlas) background = "bg-[#f5f3ee]";
  else if (pathname === "/work") background = "bg-[#f3f1ec]";
  else if (pathname === "/immersive") background = "bg-[#f1eee7]";
  else if (pathname === "/offer" || pathname === "/about") background = "bg-[#f3f0e9]";
  else if (pathname.startsWith("/services/")) background = "bg-[#f4f1ea]";
  else if (isPolicy || isWorkCase) background = "bg-[#f6f4ef]";
  else if (isImmersiveCase) background = "bg-[#080807]";

  return (
    <div aria-hidden="true" className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${background}`}>
      {!isImmersiveCase ? (
        <>
          <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] [background-size:88px_88px]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_0%,rgba(255,255,255,0.72),transparent_68%)]" />
        </>
      ) : null}
    </div>
  );
}

function RouteNoIndexMeta() {
  useEffect(() => {
    const existing = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousContent = existing?.getAttribute("content") ?? null;
    const meta = existing ?? document.createElement("meta");

    meta.setAttribute("name", "robots");
    meta.setAttribute("content", "noindex, nofollow");

    if (!existing) document.head.appendChild(meta);

    return () => {
      if (existing && previousContent !== null) {
        existing.setAttribute("content", previousContent);
        return;
      }

      if (!existing) meta.remove();
    };
  }, []);

  return null;
}

function HiddenRoute({ children }: { children: ReactNode }) {
  return (
    <>
      <RouteNoIndexMeta />
      {children}
    </>
  );
}

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openProject = useCallback(() => setDrawerOpen(true), []);
  const closeProject = useCallback(() => setDrawerOpen(false), []);

  return (
    <SoundProvider>
      <BrowserRouter>
        <I18nProvider>
          <ScrollToTop />

          <Suspense fallback={<RoutePendingSurface />}>
            <Routes>
            <>
              <Route
                path="/es"
                element={
                  <SeoRoute meta={getSpanishMeta("/", routeSeo.home)} structuredData={[getOrganizationSchema("es"), getWebsiteSchema("es")]}>
                    <StudioIndex
                      drawerOpen={drawerOpen}
                      onOpenProject={openProject}
                      onCloseProject={closeProject}
                      noIndex={false}
                    />
                  </SeoRoute>
                }
              />

              <Route
                path="/es/work"
                element={
                  <SeoRoute meta={getSpanishMeta("/work", routeSeo.work)}>
                    <EvidenceAtlas
                      drawerOpen={drawerOpen}
                      onOpenProject={openProject}
                      onCloseProject={closeProject}
                      noIndex={false}
                    />
                  </SeoRoute>
                }
              />

              <Route
                path="/es/immersive"
                element={
                  <SeoRoute meta={getSpanishMeta("/immersive", routeSeo.immersive)}>
                    <ImmersiveV2
                      drawerOpen={drawerOpen}
                      onOpenProject={openProject}
                      onCloseProject={closeProject}
                      noIndex={false}
                    />
                  </SeoRoute>
                }
              />

              <Route
                path="/es/offer"
                element={
                  <SeoRoute meta={getSpanishMeta("/offer", routeSeo.offer)}>
                    <OfferV2
                      drawerOpen={drawerOpen}
                      onOpenProject={openProject}
                      onCloseProject={closeProject}
                      noIndex={false}
                    />
                  </SeoRoute>
                }
              />

              <Route
                path="/es/about"
                element={
                  <SeoRoute meta={getSpanishMeta("/about", routeSeo.about)} structuredData={getAboutSchema("es")}>
                    <AboutV2
                      drawerOpen={drawerOpen}
                      onOpenProject={openProject}
                      onCloseProject={closeProject}
                      noIndex={false}
                    />
                  </SeoRoute>
                }
              />

              <Route path="/es/services" element={<Navigate to="/es/offer" replace />} />

              <Route path="/es/living-atlas" element={<Navigate to="/living-atlas" replace />} />
              <Route path="/es/living-atlas/privacy" element={<Navigate to="/living-atlas/privacy" replace />} />
              <Route path="/es/living-atlas/support" element={<Navigate to="/living-atlas/support" replace />} />

              <Route
                path="/es/services/:slug"
                element={
                  <ServicePage
                    drawerOpen={drawerOpen}
                    onOpenProject={openProject}
                    onCloseProject={closeProject}
                  />
                }
              />

              <Route
                path="/es/work/:slug"
                element={
                  <CasePageV2
                    drawerOpen={drawerOpen}
                    onOpenProject={openProject}
                    onCloseProject={closeProject}
                  />
                }
              />

              <Route
                path="/es/immersive/:slug"
                element={
                  <ImmersiveCasePage
                    drawerOpen={drawerOpen}
                    onOpenProject={openProject}
                    onCloseProject={closeProject}
                  />
                }
              />
            </>

          <Route
            path="/"
            element={
              <SeoRoute meta={withSeoAlternates(routeSeo.home)} structuredData={[getOrganizationSchema("en"), getWebsiteSchema("en")]}>
                <StudioIndex
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                  noIndex={false}
                />
              </SeoRoute>
            }
          />

          <Route
            path="/work"
            element={
              <SeoRoute meta={withSeoAlternates(routeSeo.work)}>
                <EvidenceAtlas
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                  noIndex={false}
                />
              </SeoRoute>
            }
          />

          <Route
            path="/immersive"
            element={
              <SeoRoute meta={withSeoAlternates(routeSeo.immersive)}>
                <ImmersiveV2
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                  noIndex={false}
                />
              </SeoRoute>
            }
          />

          <Route
            path="/offer"
            element={
              <SeoRoute meta={withSeoAlternates(routeSeo.offer)}>
                <OfferV2
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                  noIndex={false}
                />
              </SeoRoute>
            }
          />

          <Route
            path="/work/:slug"
            element={
              <CasePageV2
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
              />
            }
          />

          <Route path="/services" element={<Navigate to="/offer" replace />} />

          <Route
            path="/services/:slug"
            element={
              <ServicePage
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
              />
            }
          />

          <Route
            path="/work-lab/:slug"
            element={
              <HiddenRoute>
                <CasePageV2
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                  noIndex
                />
              </HiddenRoute>
            }
          />

          <Route
            path="/immersive/:slug"
            element={
              <ImmersiveCasePage
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
              />
            }
          />

          <Route
            path="/about"
            element={
              <SeoRoute meta={withSeoAlternates(routeSeo.about)} structuredData={getAboutSchema("en")}>
                <AboutV2
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                  noIndex={false}
                />
              </SeoRoute>
            }
          />

          <Route
            path="/privacy"
            element={
              <SeoRoute meta={routeSeo.privacy}>
                <PrivacyV2
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                />
              </SeoRoute>
            }
          />

          <Route
            path="/legal"
            element={
              <SeoRoute meta={routeSeo.legal}>
                <LegalV2
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                />
              </SeoRoute>
            }
          />

          <Route
            path="/living-atlas"
            element={
              <SeoRoute meta={routeSeo.livingAtlas} structuredData={livingAtlasSchema}>
                <LivingAtlasPage
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                />
              </SeoRoute>
            }
          />

          <Route
            path="/living-atlas/privacy"
            element={
              <SeoRoute meta={routeSeo.livingAtlasPrivacy}>
                <LivingAtlasPrivacy
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                />
              </SeoRoute>
            }
          />

          <Route
            path="/living-atlas/support"
            element={
              <SeoRoute meta={routeSeo.livingAtlasSupport}>
                <LivingAtlasSupport
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                />
              </SeoRoute>
            }
          />

          <Route
            path="/privacy-v2"
            element={
              <HiddenRoute>
                <PrivacyV2
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                />
              </HiddenRoute>
            }
          />

          <Route
            path="/legal-v2"
            element={
              <HiddenRoute>
                <LegalV2
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                />
              </HiddenRoute>
            }
          />

          <Route
            path="/studio-index"
            element={
              <StudioIndex
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
                noIndex
              />
            }
          />

          <Route
            path="/evidence-atlas"
            element={
              <EvidenceAtlas
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
                noIndex
              />
            }
          />

          <Route
            path="/immersive-v2"
            element={
              <ImmersiveV2
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
                noIndex
              />
            }
          />

          <Route
            path="/offer-v2"
            element={
              <OfferV2
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
                noIndex
              />
            }
          />

          <Route
            path="/about-v2"
            element={
              <AboutV2
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
                noIndex
              />
            }
          />

          <Route
            path="/spatial-proof"
            element={
              <HiddenRoute>
                <SpatialProof
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                />
              </HiddenRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>

          <ProjectDrawerV2 open={drawerOpen} onClose={closeProject} />
          <SoundSignalDock />
          <PageTransitionOverlay />
        </I18nProvider>
      </BrowserRouter>
    </SoundProvider>
  );
}
