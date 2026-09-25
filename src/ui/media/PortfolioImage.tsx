import { useLayoutEffect, useRef, useState, type CSSProperties, type SyntheticEvent } from "react";

import {
  getPortfolioImageEntry,
  getPortfolioImageSrcSet,
  type PortfolioImageFetchPriority,
} from "../../media/portfolio/portfolioImage";

type PortfolioImageProps = {
  src: string;
  alt: string;
  sizes: string;
  loading?: "eager" | "lazy";
  fetchPriority?: PortfolioImageFetchPriority;
  containerClassName?: string;
  imageClassName?: string;
  style?: CSSProperties;
};

const POSITIONED_CLASS = /(^|\s)(absolute|fixed|sticky|relative)(\s|$)/;

// Presentation image with a source-derived loading state: dominant color, then the 64 px
// preview, then the srcset-selected display image once it has loaded and decoded.
// Authored classes go on both images so crop and treatment stay identical; the handoff
// opacity lives on wrapper layers so authored opacity/transition classes are untouched.
export default function PortfolioImage({
  src,
  alt,
  sizes,
  loading = "lazy",
  fetchPriority = "auto",
  containerClassName = "",
  imageClassName = "",
  style,
}: PortfolioImageProps) {
  const entry = getPortfolioImageEntry(src);
  const srcSet = getPortfolioImageSrcSet(src);

  const [activeSrc, setActiveSrc] = useState(src);
  const [ready, setReady] = useState(false);
  const [useOriginal, setUseOriginal] = useState(false);
  const [failed, setFailed] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const sourceGenerationRef = useRef(0);
  const finalRef = useRef<HTMLImageElement>(null);

  // A new source starts over from its own preview.
  if (activeSrc !== src) {
    setActiveSrc(src);
    setReady(false);
    setUseOriginal(false);
    setFailed(false);
    setPreviewFailed(false);
  }

  // Bumped during commit so a decode that finishes for an older source is ignored.
  useLayoutEffect(() => {
    sourceGenerationRef.current += 1;
  }, [src]);

  // Derivative failure retries the original exactly once; a failed original keeps the
  // preview and dominant color. No timers, no loops.
  const handleFailure = () => {
    if (!useOriginal && srcSet) {
      setUseOriginal(true);
      setReady(false);
      return;
    }

    setFailed(true);
    setReady(false);
  };

  const markReady = (image: HTMLImageElement) => {
    const generation = sourceGenerationRef.current;
    const loadedSrc = image.getAttribute("src");
    const isCurrent = () =>
      generation === sourceGenerationRef.current &&
      image === finalRef.current &&
      image.getAttribute("src") === loadedSrc;

    if (typeof image.decode !== "function") {
      if (isCurrent()) setReady(true);
      return;
    }

    image.decode().then(
      () => {
        if (isCurrent()) setReady(true);
      },
      () => {
        if (isCurrent()) handleFailure();
      },
    );
  };

  const finalSrcSet = useOriginal ? undefined : srcSet;
  const showPreview = Boolean(entry?.placeholder) && !previewFailed;
  const containerClasses = [
    POSITIONED_CLASS.test(containerClassName) ? "" : "relative",
    "block overflow-hidden",
    containerClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={containerClasses}
      style={{ backgroundColor: entry?.dominantColor }}
      data-portfolio-image={src}
      data-portfolio-image-ready={ready ? "true" : "false"}
      data-portfolio-image-fallback={failed ? "failed" : useOriginal ? "original" : "derivative"}
    >
      {showPreview ? (
        <span
          aria-hidden="true"
          className={[
            "pointer-events-none absolute inset-0 block",
            ready ? "transition-opacity delay-[180ms] duration-0 motion-reduce:transition-none" : "",
          ].join(" ")}
          style={{ opacity: ready ? 0 : 1 }}
        >
          <img
            src={entry?.placeholder ?? undefined}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            className={imageClassName}
            style={style}
            onError={() => setPreviewFailed(true)}
          />
        </span>
      ) : null}

      {failed ? null : (
        <span
          className={[
            "relative block h-full w-full",
            ready ? "transition-opacity duration-[180ms] ease-out motion-reduce:transition-none" : "",
          ].join(" ")}
          style={{ opacity: ready ? 1 : 0 }}
        >
          <img
            key={useOriginal ? "original" : "derivative"}
            ref={finalRef}
            src={src}
            srcSet={finalSrcSet}
            sizes={finalSrcSet ? sizes : undefined}
            alt={alt}
            loading={loading}
            fetchPriority={fetchPriority}
            decoding="async"
            className={imageClassName}
            style={style}
            onLoad={(event: SyntheticEvent<HTMLImageElement>) => markReady(event.currentTarget)}
            onError={handleFailure}
          />
        </span>
      )}
    </span>
  );
}
