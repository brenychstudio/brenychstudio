import { useEffect, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import AtmosphericSiteShell from "../ui/atmosphere/AtmosphericSiteShell";
import Header from "../ui/Header";
import PageSurface from "../ui/PageSurface";
import SiteFooterV2 from "../ui/SiteFooterV2";
import LivingAtlasReleaseStatus from "../ui/living-atlas/LivingAtlasReleaseStatus";
import LivingAtlasTrustNav from "../ui/living-atlas/LivingAtlasTrustNav";
import { LIVING_ATLAS_PLATFORM } from "../ui/living-atlas/livingAtlasRelease";
import { useSound } from "../stage/audio/useSound";

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
};

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ideas = [
  {
    index: "01",
    title: "Capture",
    body: "Capture a photograph with its place, time and spatial context.",
  },
  {
    index: "02",
    title: "Revisit",
    body: "Return through Locations and Visits instead of searching through an anonymous camera roll.",
  },
  {
    index: "03",
    title: "Plan light",
    body: "Use the place as the centre of a 24-hour photographic light-planning instrument.",
  },
];

const localFirst = [
  "Living Atlas V1 keeps your captures, photos, locations, visits and spatial memory on your device.",
  "There is no Living Atlas cloud account or advertising profile in V1.",
  "Atlas Pro adds advanced individual photographic tools through a one-time lifetime purchase.",
];

const hourTicks = Array.from({ length: 24 }, (_, hour) => hour);

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#b8955a]" />
      <span>{children}</span>
    </div>
  );
}

/** 24-hour dial coordinates: noon at the top, midnight at the bottom. */
function dialPoint(hour: number, radius: number) {
  const angle = ((hour - 12) / 24) * Math.PI * 2;

  return {
    x: (200 + Math.sin(angle) * radius).toFixed(2),
    y: (200 - Math.cos(angle) * radius).toFixed(2),
  };
}

/**
 * Decorative light-planning instrument: a 24-hour dial, a horizon line, a day
 * arc and one place at the centre. No coordinates, no map tiles, no real data.
 */
function AtlasInstrument() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false" className="h-auto w-full text-neutral-950">
      <circle cx="200" cy="200" r="172" fill="none" stroke="currentColor" strokeOpacity="0.16" />
      <circle cx="200" cy="200" r="138" fill="none" stroke="currentColor" strokeOpacity="0.08" />
      {hourTicks.map((hour) => {
        const major = hour % 6 === 0;
        const inner = dialPoint(hour, major ? 156 : 164);
        const outer = dialPoint(hour, 172);

        return (
          <line
            key={hour}
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
            stroke="currentColor"
            strokeOpacity={major ? 0.5 : 0.2}
            strokeWidth={major ? 1.25 : 1}
          />
        );
      })}
      <line x1="48" y1="200" x2="352" y2="200" stroke="currentColor" strokeOpacity="0.14" strokeDasharray="1.5 6" />
      <path d="M 62 200 A 138 138 0 0 1 338 200" fill="none" stroke="#b8955a" strokeOpacity="0.6" strokeWidth="1.25" />
      <circle cx="200" cy="200" r="16" fill="none" stroke="#b8955a" strokeOpacity="0.45" />
      <line x1="200" y1="184" x2="200" y2="166" stroke="#b8955a" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="200" cy="200" r="4.5" fill="#b8955a" />
    </svg>
  );
}

export default function LivingAtlasPage({ drawerOpen = false, onOpenProject, onCloseProject }: PageProps) {
  const reduceMotion = useReducedMotion();
  const { setScene, stopAmbient } = useSound();

  useEffect(() => {
    setScene("studio");
    stopAmbient();
  }, [setScene, stopAmbient]);

  const reveal = (delay = 0) =>
    reduceMotion
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease, delay },
        };

  return (
    <>
      <Header drawerOpen={drawerOpen} onOpenProject={onOpenProject} onCloseProject={onCloseProject} />

      <PageSurface className="tablet-reader-surface relative min-h-screen overflow-x-hidden bg-transparent text-neutral-950">
        <AtmosphericSiteShell preset="classic" />

        <main className="relative z-10 pt-24">
          <section
            id="living-atlas-release"
            data-header-scene="living-atlas-release"
            className="mx-auto grid w-[min(92vw,1500px)] gap-12 border-y border-neutral-950/12 py-14 sm:py-16 lg:min-h-[calc(100vh-6rem)] lg:grid-cols-[0.6fr_0.4fr] lg:items-center lg:gap-16 lg:py-20"
          >
            <motion.div className="min-w-0" {...reveal()}>
              <SectionLabel>Living Atlas</SectionLabel>
              <h1 className="mt-6 max-w-[20ch] text-[46px] font-normal leading-[0.94] tracking-[-0.05em] text-neutral-950 sm:text-[60px] md:text-[length:clamp(44px,5.2vw,84px)]">
                Remember the place,
                <br className="hidden md:block" /> not just the photo.
              </h1>
              <p className="mt-8 max-w-[34ch] text-[19px] leading-8 text-neutral-800 sm:max-w-[40ch] sm:text-[22px] sm:leading-9 md:max-w-[62ch]">
                Your camera roll remembers the image.
                <br /> Living Atlas remembers the place, direction, light and context.
              </p>
              <div aria-hidden="true" className="mt-8 h-px w-16 bg-[#b8955a]/70" />
              <p className="mt-6 max-w-[56ch] text-[16px] leading-7 text-neutral-600 sm:text-[17px] sm:leading-8">
                Living Atlas is a private, map-first photographic memory tool designed to preserve the spatial context
                around a capture — where it happened, when it happened, how visits relate, and how light changes around
                the place.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <LivingAtlasReleaseStatus />
                <span className="font-mono text-[10px] uppercase tracking-[0.17em] text-neutral-500">
                  {LIVING_ATLAS_PLATFORM}
                </span>
              </div>
              <LivingAtlasTrustNav current="product" label="Living Atlas trust links" className="mt-6" />
            </motion.div>

            <motion.figure className="mx-auto w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[420px]" {...reveal(0.12)}>
              <AtlasInstrument />
              <figcaption className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-neutral-950/10 pt-3 font-mono text-[10px] uppercase tracking-[0.17em] text-neutral-500">
                <span>24-hour light instrument</span>
                <span>Place · Direction · Light</span>
              </figcaption>
            </motion.figure>
          </section>

          <section id="living-atlas-ideas" className="mx-auto w-[min(92vw,1500px)] py-16 sm:py-20 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <SectionLabel>Three ideas</SectionLabel>
                <h2 className="mt-5 text-[40px] font-normal leading-[0.95] tracking-[-0.04em] text-neutral-950 sm:text-[56px] lg:text-[64px]">
                  Capture.
                  <br />
                  Revisit.
                  <br />
                  Plan light.
                </h2>
              </div>

              <ol className="border-t border-neutral-950/12">
                {ideas.map((idea) => (
                  <li
                    key={idea.index}
                    className="grid gap-3 border-b border-neutral-950/12 py-7 sm:py-8 md:grid-cols-[4.5rem_minmax(9rem,0.3fr)_1fr] md:gap-6 lg:gap-8"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#7a5d27]">{idea.index}</span>
                    <h3 className="text-[18px] font-normal uppercase leading-6 tracking-[0.09em] text-neutral-950">
                      {idea.title}
                    </h3>
                    <p className="max-w-[52ch] text-[16px] leading-7 text-neutral-600 sm:text-[17px] sm:leading-8">
                      {idea.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section id="living-atlas-local-first" className="mx-auto w-[min(92vw,1500px)] pb-16 sm:pb-20 lg:pb-24">
            <div className="grid gap-10 border-y border-neutral-950/12 py-12 sm:py-14 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16 lg:py-16">
              <div>
                <SectionLabel>Local first</SectionLabel>
                <h2 className="mt-5 max-w-[12ch] text-[40px] font-normal leading-[0.95] tracking-[-0.04em] text-neutral-950 sm:text-[56px] lg:text-[64px]">
                  Your captures stay on your device.
                </h2>
              </div>

              <div className="max-w-[60ch] space-y-5 text-[17px] leading-8 text-neutral-700 sm:text-[19px] sm:leading-9">
                {localFirst.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </section>

          <section id="living-atlas-release-status" className="mx-auto w-[min(92vw,1500px)] pb-14 sm:pb-16">
            <div className="grid gap-8 border-y border-neutral-950/10 py-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <SectionLabel>Release</SectionLabel>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <LivingAtlasReleaseStatus />
                  <span className="font-mono text-[10px] uppercase tracking-[0.17em] text-neutral-500">
                    {LIVING_ATLAS_PLATFORM}
                  </span>
                </div>
                <p className="mt-4 max-w-[52ch] text-[15px] leading-7 text-neutral-600">
                  Free to download. Atlas Pro is an optional one-time lifetime unlock.
                </p>
              </div>

              <LivingAtlasTrustNav current="product" label="Living Atlas pages" />
            </div>
          </section>
        </main>

        <SiteFooterV2 onOpenProject={onOpenProject} variant="studio" />
      </PageSurface>
    </>
  );
}
