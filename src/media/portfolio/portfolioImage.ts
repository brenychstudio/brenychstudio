import { generatedPortfolioImages } from "./generatedPortfolioImages";

export type PortfolioImageFetchPriority = "high" | "low" | "auto";

export function getPortfolioImageEntry(src: string) {
  return generatedPortfolioImages[src] ?? null;
}

export function getPortfolioImageSrcSet(src: string) {
  const entry = getPortfolioImageEntry(src);
  if (!entry?.variants.length) return undefined;

  return entry.variants.map((variant) => `${variant.src} ${variant.width}w`).join(", ");
}

export function getPortfolioImageCandidate(src: string, preferredWidth: number) {
  const entry = getPortfolioImageEntry(src);
  if (!entry?.variants.length) return src;

  return (
    entry.variants.find((variant) => variant.width >= preferredWidth)?.src ??
    entry.variants.at(-1)?.src ??
    src
  );
}

const preloadRequests = new Map<string, Promise<void>>();

// Warms the same srcset/sizes candidate a rendered PortfolioImage will select, once per
// src + sizes. Failures resolve quietly: a missed preload must never break page state.
export function preloadPortfolioImage(
  src: string,
  sizes: string,
  fetchPriority: PortfolioImageFetchPriority = "auto",
) {
  if (typeof window === "undefined" || typeof Image === "undefined") return Promise.resolve();

  const key = `${src}|${sizes}`;
  const existing = preloadRequests.get(key);
  if (existing) return existing;

  const image = new Image();
  image.decoding = "async";
  image.fetchPriority = fetchPriority;
  image.sizes = sizes;
  const srcSet = getPortfolioImageSrcSet(src);
  if (srcSet) image.srcset = srcSet;
  image.src = src;

  const request =
    typeof image.decode === "function"
      ? image.decode().catch(() => undefined)
      : new Promise<void>((resolve) => {
          image.onload = () => resolve();
          image.onerror = () => resolve();
        });

  preloadRequests.set(key, request);
  return request;
}
