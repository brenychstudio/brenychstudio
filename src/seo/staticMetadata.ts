import { cases, getCasePath } from "../data/cases";
import { immersiveItems } from "../data/immersive";
import { servicePages } from "../data/servicePages";
import {
  spanishImmersiveTranslations,
  spanishPageSeoDrafts,
  spanishServicePageTranslations,
} from "../data/spanishContent";
import { SITE_NAME } from "../config/site";

export type StaticRouteMetadata = {
  path: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  type: "website" | "article";
  ogTitle?: string;
  ogDescription?: string;
  language?: "en" | "es";
  /** Pre-release / controlled routes: emit a robots noindex tag in the static HTML. */
  noIndex?: boolean;
};

const defaultImage = "/og-default.png";

const pageMetadata: StaticRouteMetadata[] = [
  {
    path: "/",
    title: "Brenych Studio — Product Engineering & Creative Technology",
    description:
      "Independent Barcelona studio building AI-native products, controlled agent systems, interactive software, real-time 3D / XR experiences and digital worlds.",
    image: defaultImage,
    imageAlt: "Brenych Studio — Product Engineering & Creative Technology",
    type: "website",
  },
  {
    path: "/work",
    title: "Work — Products, Systems & Interactive Experiences | Brenych Studio",
    description:
      "Selected Brenych Studio work across software products, internal systems, creative technology, real-time 3D, immersive experiences and authored digital projects.",
    image: defaultImage,
    imageAlt: "Selected work from Brenych Studio",
    type: "website",
  },
  {
    path: "/immersive",
    title: "Immersive & Spatial Systems — XR, Real-time 3D & Interactive Worlds | Brenych Studio",
    description:
      "Spatial interfaces, WebGL / WebGPU, XR environments, digital exhibitions and experimental interactive systems by Brenych Studio.",
    image: defaultImage,
    imageAlt: "Immersive interface systems from Brenych Studio",
    type: "website",
  },
  {
    path: "/offer",
    title: "Product Engineering, AI Systems & Creative Technology | Brenych Studio",
    description:
      "Product development, controlled AI and agent systems, interactive software, real-time 3D / XR and creative technology for ambitious digital projects.",
    image: defaultImage,
    imageAlt: "Brenych Studio offer",
    type: "website",
  },
  {
    path: "/about",
    title: "About — Rostyslav Brenych / Brenych Studio",
    description:
      "Rostyslav Brenych is the founder of Brenych Studio, an independent Barcelona practice spanning product engineering, AI systems, creative technology and spatial interaction.",
    image: defaultImage,
    imageAlt: "About Brenych Studio",
    type: "website",
  },
  {
    path: "/privacy",
    title: "Privacy Policy — Brenych Studio",
    description:
      "How Brenych Studio handles information shared through project inquiries, preferences, and basic website interactions.",
    image: defaultImage,
    imageAlt: "Brenych Studio privacy policy",
    type: "website",
  },
  {
    path: "/legal",
    title: "Legal Notice — Brenych Studio",
    description:
      "Terms for using the Brenych Studio website, viewing portfolio materials, and contacting the studio about projects.",
    image: defaultImage,
    imageAlt: "Brenych Studio legal notice",
    type: "website",
  },
];

/**
 * Living Atlas release surface (LA-WEB-RELEASE-01).
 * Publicly reachable App Store trust URLs, kept noindex and outside the sitemap
 * until the owner authorises the public reveal.
 */
const livingAtlasMetadata: StaticRouteMetadata[] = [
  {
    path: "/living-atlas",
    title: "Living Atlas — Photography, Place & Light | Brenych Studio",
    description:
      "Living Atlas is a local-first photographic memory tool for preserving place, visits and light context around your captures.",
    image: defaultImage,
    imageAlt: "Living Atlas — photography, place and light",
    type: "website",
    noIndex: true,
  },
  {
    path: "/living-atlas/privacy",
    title: "Living Atlas Privacy Policy | Brenych Studio",
    description:
      "Privacy information for Living Atlas, including local photo and location storage, Atlas Pro purchases and third-party services.",
    image: defaultImage,
    imageAlt: "Living Atlas privacy policy",
    type: "website",
    noIndex: true,
  },
  {
    path: "/living-atlas/support",
    title: "Living Atlas Support | Brenych Studio",
    description:
      "Support for Living Atlas captures, locations, light planning, Atlas Pro and local app data.",
    image: defaultImage,
    imageAlt: "Living Atlas support",
    type: "website",
    noIndex: true,
  },
];

const caseMetadata: StaticRouteMetadata[] = cases.map((item) => {
  const path = getCasePath(item.slug);

  return {
    path,
    title: item.seoTitle ?? `${item.title} — ${item.category} | ${SITE_NAME}`,
    description: item.seoDescription ?? item.shortDescription,
    image: `/og/${path.split("/").at(-1)}.png`,
    imageAlt: item.alt,
    type: "article",
    ogTitle: item.ogTitle,
    ogDescription: item.ogDescription,
  };
});

const immersiveMetadata: StaticRouteMetadata[] = immersiveItems.map((item) => {
  const path = `/immersive/${item.slug}`;
  const isWebhero = item.slug === "webhero";

  return {
    path,
    title: isWebhero
      ? "WEBHERO — Premium WebGL Interface System | Brenych Studio"
      : `${item.title} — ${item.searchContent?.category ?? "Immersive System"} | ${SITE_NAME}`,
    description: item.searchContent?.shortDescription ?? item.tagline,
    image: `/og/${item.slug}.png`,
    imageAlt: `${item.title} immersive case`,
    type: "article",
    ogTitle: isWebhero ? "WEBHERO — Premium WebGL Interface System" : item.title,
  };
});

const serviceMetadata: StaticRouteMetadata[] = servicePages.map((item) => ({
  path: item.path,
  title: item.seoTitle,
  description: item.metaDescription,
  image: defaultImage,
  imageAlt: item.seoTitle,
  type: "website",
}));

const spanishPageMetadata: StaticRouteMetadata[] = pageMetadata
  .filter((item) => ["/", "/work", "/immersive", "/offer", "/about"].includes(item.path))
  .map((item) => {
    const draft = spanishPageSeoDrafts[item.path];
    const path = item.path === "/" ? "/es" : `/es${item.path}`;

    return {
      ...item,
      path,
      title: draft?.title ?? item.title,
      description: draft?.description ?? item.description,
      ogTitle: draft?.ogTitle,
      ogDescription: draft?.ogDescription,
      language: "es",
    };
  });

const spanishCaseMetadata: StaticRouteMetadata[] = cases
  .filter((item) => item.translations?.es)
  .map((item) => {
    const translation = item.translations!.es!;
    const path = `/es${getCasePath(item.slug)}`;

    return {
      path,
      title: translation.seoTitle,
      description: translation.seoDescription,
      image: `/og/${getCasePath(item.slug).split("/").at(-1)}.png`,
      imageAlt: translation.alt,
      type: "article",
      ogTitle: translation.ogTitle,
      ogDescription: translation.ogDescription,
      language: "es",
    };
  });

const spanishImmersiveMetadata: StaticRouteMetadata[] = immersiveItems
  .filter((item) => item.translations?.es)
  .map((item) => {
    const translation = spanishImmersiveTranslations[item.slug];
    const path = `/es/immersive/${item.slug}`;
    const english = immersiveMetadata.find((entry) => entry.path === `/immersive/${item.slug}`)!;

    return {
      ...english,
      path,
      title: translation?.seo.title ?? english.title,
      description: translation?.seo.description ?? english.description,
      imageAlt: translation?.seo.alt ?? english.imageAlt,
      ogTitle: translation?.seo.ogTitle ?? english.ogTitle,
      ogDescription: translation?.seo.ogDescription ?? english.ogDescription,
      language: "es",
    };
  });

const spanishServiceMetadata: StaticRouteMetadata[] = servicePages.map((item) => {
  const translation = spanishServicePageTranslations[item.slug];

  return {
    path: `/es${item.path}`,
    title: translation?.seoTitle ?? item.seoTitle,
    description: translation?.metaDescription ?? item.metaDescription,
    image: defaultImage,
    imageAlt: translation?.seoTitle ?? item.seoTitle,
    type: "website",
    ogTitle: translation?.ogTitle,
    ogDescription: translation?.ogDescription,
    language: "es",
  };
});

export const staticRouteMetadata: readonly StaticRouteMetadata[] = [
  ...pageMetadata,
  ...serviceMetadata,
  ...livingAtlasMetadata,
  ...caseMetadata,
  ...immersiveMetadata,
  ...spanishPageMetadata,
  ...spanishServiceMetadata,
  ...spanishCaseMetadata,
  ...spanishImmersiveMetadata,
];

export function getStaticRouteMetadata(path: string) {
  return staticRouteMetadata.find((item) => item.path === path);
}

export function getStaticRouteSocialImageSource(path: string) {
  const caseItem = cases.find((item) => getCasePath(item.slug) === path || `/es${getCasePath(item.slug)}` === path);
  if (caseItem) return caseItem.ogImage;

  const immersiveItem = immersiveItems.find(
    (item) => `/immersive/${item.slug}` === path || `/es/immersive/${item.slug}` === path,
  );
  return immersiveItem?.previewPoster;
}
