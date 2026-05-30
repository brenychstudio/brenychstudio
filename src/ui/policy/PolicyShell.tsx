import { useEffect, type ReactNode } from "react";

import AtmosphericSiteShell from "../atmosphere/AtmosphericSiteShell";
import Header from "../Header";
import PageSurface from "../PageSurface";
import SiteFooterV2 from "../SiteFooterV2";
import { useSound } from "../../stage/audio/useSound";

type PolicyShellProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
  sceneId: string;
  label: string;
  title: string;
  intro: string;
  updated: string;
  metaTitle?: string;
  children: ReactNode;
};

export default function PolicyShell({
  drawerOpen = false,
  onOpenProject,
  onCloseProject,
  sceneId,
  label,
  title,
  intro,
  updated,
  metaTitle,
  children,
}: PolicyShellProps) {
  const { setScene, stopAmbient } = useSound();

  useEffect(() => {
    setScene("trust");
    stopAmbient();
  }, [setScene, stopAmbient]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = metaTitle ?? `${title} - Brenych Studio`;

    return () => {
      document.title = previousTitle;
    };
  }, [metaTitle, title]);

  return (
    <>
      <Header drawerOpen={drawerOpen} onOpenProject={onOpenProject} onCloseProject={onCloseProject} />

      <PageSurface className="tablet-reader-surface relative min-h-screen overflow-x-hidden bg-transparent text-neutral-950">
        <AtmosphericSiteShell preset="practice" />

        <main className="relative z-10 pt-24">
          <section
            id={sceneId}
            data-header-scene={sceneId}
            className="mx-auto grid w-[min(92vw,1500px)] gap-12 border-y border-neutral-950/12 py-12 sm:py-14 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[0.34fr_0.66fr] lg:items-start lg:gap-16 lg:py-20"
          >
            <div className="min-w-0 lg:sticky lg:top-28">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">{label}</div>
              <h1 className="mt-6 max-w-[11ch] text-[48px] font-normal leading-[0.92] tracking-[-0.055em] text-neutral-950 sm:text-[70px] lg:text-[82px]">
                {title}
              </h1>
              <p className="mt-6 max-w-[42rem] text-[16px] leading-7 text-neutral-600 sm:text-[17px] sm:leading-8">
                {intro}
              </p>
              <div className="mt-8 grid w-fit gap-2 border-y border-neutral-950/12 py-3 font-mono text-[10px] uppercase tracking-[0.17em] text-neutral-400">
                <span>Last updated: {updated}</span>
                <span>Studio Trust Surface</span>
              </div>
            </div>

            <div className="min-w-0 border-y border-neutral-950/10 bg-white/18 px-0 backdrop-blur-[2px]">
              {children}
            </div>
          </section>

          <section className="mx-auto w-[min(92vw,1500px)] py-10 sm:py-12">
            <div className="flex flex-wrap items-center justify-between gap-4 border-y border-neutral-950/10 py-5 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
              <span>Policy Surface</span>
              <span className="text-neutral-950">Built as a living interface system.</span>
            </div>
          </section>
        </main>

        <SiteFooterV2 onOpenProject={onOpenProject} variant="studio" />
      </PageSurface>
    </>
  );
}
