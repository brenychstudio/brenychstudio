import { useEffect } from "react";

import { DEFAULT_OG_IMAGE, SITE_NAME, toAbsoluteSiteUrl } from "../config/site";

export type SeoMetaProps = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  alternates?: SeoAlternate[];
};

export type SeoAlternate = {
  hreflang: string;
  href: string;
};

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
}

function setCanonical(canonicalUrl: string) {
  let tag = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }

  tag.setAttribute("href", canonicalUrl);
}

function setAlternates(alternates: SeoAlternate[] = []) {
  document.head.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][data-seo-managed="true"]').forEach((tag) => {
    tag.remove();
  });

  alternates.forEach((alternate) => {
    const tag = document.createElement("link");
    tag.setAttribute("rel", "alternate");
    tag.setAttribute("hreflang", alternate.hreflang);
    tag.setAttribute("href", alternate.href);
    tag.setAttribute("data-seo-managed", "true");
    document.head.appendChild(tag);
  });
}

export default function SeoMeta({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  imageAlt,
  type = "website",
  noIndex = false,
  alternates = [],
}: SeoMetaProps) {
  useEffect(() => {
    const canonicalUrl = toAbsoluteSiteUrl(path);
    const imageUrl = toAbsoluteSiteUrl(image);
    const resolvedImageAlt = imageAlt ?? title;
    document.title = title;
    setCanonical(canonicalUrl);
    setAlternates(alternates);

    setMeta("name", "description", description);
    setMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");

    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", imageUrl);
    setMeta("property", "og:image:width", "1200");
    setMeta("property", "og:image:height", "630");
    setMeta("property", "og:image:alt", resolvedImageAlt);

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", imageUrl);
  }, [alternates, description, image, imageAlt, noIndex, path, title, type]);

  return null;
}
