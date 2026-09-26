import { LIVING_ATLAS_APP_STORE_URL, LIVING_ATLAS_RELEASE_STATUS } from "./livingAtlasRelease";

type LivingAtlasReleaseStatusProps = {
  className?: string;
};

/**
 * Release status for the product page.
 *
 * Pre-release: a plain status line. Once `LIVING_ATLAS_APP_STORE_URL` holds a
 * real public App Store URL, this renders a real App Store link instead.
 * No badge artwork or Apple link is shown before that URL exists.
 */
export default function LivingAtlasReleaseStatus({ className = "" }: LivingAtlasReleaseStatusProps) {
  if (LIVING_ATLAS_APP_STORE_URL) {
    return (
      <a
        href={LIVING_ATLAS_APP_STORE_URL}
        className={[
          "inline-flex min-h-11 items-center gap-2 rounded-full border border-neutral-950 bg-neutral-950 px-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white transition hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 motion-safe:hover:-translate-y-0.5",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span>Download on the App Store</span>
        <span aria-hidden="true">-&gt;</span>
      </a>
    );
  }

  return (
    <p
      className={[
        "inline-flex min-h-11 items-center gap-2.5 rounded-full border border-neutral-950/14 bg-white/55 px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-700 backdrop-blur",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full border border-[#b8955a] bg-[#b8955a]/30" />
      <span>{LIVING_ATLAS_RELEASE_STATUS}</span>
    </p>
  );
}
