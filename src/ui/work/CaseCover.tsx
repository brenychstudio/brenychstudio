import { useState } from "react";
import type { CaseCoverFocus, CaseCoverTone } from "./caseCover.types";

type PosterVariant = "cards" | "list";

type CaseCoverProps = {
  src: string;
  alt: string;
  tone: CaseCoverTone;
  focus?: CaseCoverFocus;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  variant?: PosterVariant;
};

const focusMap: Record<CaseCoverFocus, string> = {
  center: "50% 50%",
  top: "50% 0%",
  left: "0% 50%",
  right: "100% 50%",
};

const toneMap: Record<
  CaseCoverTone,
  {
    shell: string;
    frame: string;
    placeholder: string;
    image: string;
    halo?: string;
  }
> = {
  light: {
    shell:
      "border border-black/[0.045] bg-[#f5f5f7] p-2 shadow-[0_16px_34px_rgba(15,23,42,0.04)]",
    frame: "border border-black/[0.045] bg-[#ffffff]",
    placeholder: "bg-[#ececf0]",
    image: "saturate-[1.01]",
    halo: "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.62)]",
  },
  dark: {
    shell:
      "border border-black/[0.04] bg-white p-1.5 shadow-[0_12px_28px_rgba(15,23,42,0.03)]",
    frame: "border border-black/[0.04] bg-neutral-50",
    placeholder: "bg-neutral-100",
    image: "saturate-[1.02]",
  },
  mixed: {
    shell:
      "border border-black/[0.045] bg-[#f4f4f6] p-1.5 shadow-[0_14px_30px_rgba(15,23,42,0.035)]",
    frame: "border border-black/[0.045] bg-white/96",
    placeholder: "bg-[#ececef]",
    image: "brightness-[1.02] saturate-[1.02]",
    halo: "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.42)]",
  },
};

export default function CaseCover({
  src,
  alt,
  tone,
  focus = "center",
  className = "",
  imageClassName = "",
  priority = false,
  variant = "cards",
}: CaseCoverProps) {
  const [loaded, setLoaded] = useState(false);

  const toneStyles = toneMap[tone];
  const objectPosition = focusMap[focus];
  const posterScale = variant === "cards" ? "scale-[1.02]" : "scale-[1.03]";

  return (
    <div className={`relative h-full w-full ${className}`}>
      <div className={`relative h-full w-full rounded-[18px] ${toneStyles.shell}`}>
        {toneStyles.halo ? (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 rounded-[18px] ${toneStyles.halo}`}
          />
        ) : null}

        <div className={`relative h-full w-full overflow-hidden rounded-[14px] ${toneStyles.frame}`}>
          <div
            className={[
              "absolute inset-0 transition-opacity duration-500",
              toneStyles.placeholder,
              loaded ? "opacity-0" : "opacity-100",
            ].join(" ")}
          />

          <img
            src={src}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onLoad={() => setLoaded(true)}
            style={{ objectPosition }}
            className={[
              "absolute inset-0 h-full w-full object-cover transition duration-700",
              posterScale,
              toneStyles.image,
              loaded ? "opacity-100 blur-0" : "opacity-0 blur-[8px]",
              imageClassName,
            ].join(" ")}
          />
        </div>
      </div>
    </div>
  );
}
