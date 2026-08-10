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
};

const defaultImage = "/og-default.png";

const pageMetadata: StaticRouteMetadata[] = [
  {
    path: "/",
    title: "Brenych Studio — Premium Front-end Systems & Interactive Web",
    description:
      "Barcelona-based premium front-end systems, interactive websites, product presentations and immersive digital surfaces for brands, creators, founders and cultural projects.",
    image: defaultImage,
    imageAlt: "Brenych Studio — Premium Front-end Systems & Interactive Web",
    type: "website",
  },
  {
    path: "/work",
    title: "Work — Premium Websites, Product Interfaces & Interactive Systems | Brenych Studio",
    description:
      "Selected Brenych Studio work across premium websites, product interfaces, creator tools, advisory surfaces and immersive web systems.",
    image: defaultImage,
    imageAlt: "Selected work from Brenych Studio",
    type: "website",
  },
  {
    path: "/immersive",
    title: "Immersive Interface Systems — WebGL, Spatial Archives & Cinematic Web | Brenych Studio",
    description:
      "Interactive and immersive web systems for spatial archives, cinematic storytelling, WebGL-ready presentations and experimental digital experiences.",
    image: defaultImage,
    imageAlt: "Immersive interface systems from Brenych Studio",
    type: "website",
  },
  {
    path: "/offer",
    title: "Offer — Premium Landing Pages, Product Demo Pages & Interactive Web Systems | Brenych Studio",
    description:
      "Focused premium web systems from a Barcelona-based studio for launches, products, creators, advisory services and immersive digital presentations.",
    image: defaultImage,
    imageAlt: "Brenych Studio offer",
    type: "website",
  },
  {
    path: "/about",
    title: "About — Rostyslav Brenych / Brenych Studio",
    description:
      "Barcelona-based creative developer and interactive front-end systems builder working across premium websites, product prototypes, visual storytelling and immersive interfaces.",
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
    description: isWebhero
      ? "A production-minded WebGL system for premium hero stages, interactive product surfaces, cinematic visual storytelling, and spatial interface experiences."
      : item.searchContent?.shortDescription ?? item.tagline,
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
