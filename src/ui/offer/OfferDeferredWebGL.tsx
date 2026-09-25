import { lazy, Suspense, type ComponentProps } from "react";

import { useNearViewport } from "../../hooks/useNearViewport";
import type OfferDeliveryModelEngine from "../OfferDeliveryModelEngine";
import type { OfferDeliveryInterfaceOverlay } from "../OfferDeliveryModelEngine";

// Offer's WebGL scenes (Three / R3F / Drei) sit below the first viewport, so their modules load
// only once the section comes near. Until then an aria-hidden shell keeps the exact footprint.

function memoizeModuleLoader<T>(loader: () => Promise<T>) {
  let promise: Promise<T> | null = null;

  return () => {
    if (!promise) {
      promise = loader().catch((error) => {
        promise = null;
        throw error;
      });
    }

    return promise;
  };
}

const loadArtifactModule = memoizeModuleLoader(() => import("../OfferScrollArtifactHero"));
// The delivery engine and its interface overlay share this one module request.
const loadDeliveryModule = memoizeModuleLoader(() => import("../OfferDeliveryModelEngine"));

const LazyOfferScrollArtifactHero = lazy(loadArtifactModule);
const LazyOfferDeliveryModelEngine = lazy(() =>
  loadDeliveryModule().then((module) => ({ default: module.default })),
);
const LazyOfferDeliveryInterfaceOverlay = lazy(() =>
  loadDeliveryModule().then((module) => ({ default: module.OfferDeliveryInterfaceOverlay })),
);

// Same section, sticky stage and static surface as OfferScrollArtifactHero, without the canvas.
function ArtifactFallback({ compact }: { compact: boolean }) {
  if (compact) {
    return (
      <section aria-hidden="true" className="relative z-10 h-[190svh] w-screen max-w-none overflow-visible px-0 lg:hidden">
        <div className="sticky top-[calc(var(--mobile-header-height)+0.25rem)] flex h-[calc(100svh-var(--mobile-header-height)-0.5rem)] min-h-[34rem] items-center overflow-visible">
          <div className="relative h-[min(38rem,calc(100svh-var(--mobile-header-height)-1rem))] min-h-[32rem] w-full overflow-visible md:h-[calc(100svh-var(--mobile-header-height)-1.5rem)] md:min-h-[46rem]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0.46)_34%,rgba(244,241,234,0.12)_60%,rgba(255,255,255,0)_86%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.02] [background-image:linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] [background-size:56px_56px]" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-hidden="true" className="relative z-10 mx-auto h-[205vh] w-[min(94vw,1640px)] sm:h-[220vh]">
      <div className="sticky top-[14.25rem] h-[calc(100vh-14.25rem)] min-h-[620px] overflow-visible sm:top-0 sm:h-screen sm:min-h-[720px]">
        <div className="relative left-1/2 h-full w-screen -translate-x-1/2 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.52)_30%,rgba(244,241,234,0.18)_56%,rgba(255,255,255,0)_82%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.022] [background-image:linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,transparent_0%,black_14%,black_84%,transparent_100%)]" />
        </div>
      </div>
    </section>
  );
}

// Fills the same box as the engine's own absolute root inside the delivery section.
function DeliveryEngineFallback() {
  return (
    <div aria-hidden="true" className="absolute inset-0 min-h-[560px] overflow-hidden sm:min-h-[640px] lg:min-h-[760px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_46%_42%,rgba(255,255,255,0.92),rgba(255,255,255,0.64)_31%,rgba(244,241,234,0.24)_66%,rgba(255,255,255,0.18)_100%)]" />
    </div>
  );
}

// The artifact starts 420–690 px below the fold on phones and ~690 px on 1920×1080 desktops, so
// the default 800 px margin would load it at first render there; these margins still preload
// ahead of the section while keeping the first render free of WebGL.
const ARTIFACT_ROOT_MARGIN = "600px 0px";
const COMPACT_ARTIFACT_ROOT_MARGIN = "300px 0px";

export function DeferredOfferScrollArtifactHero({ compact = false }: { compact?: boolean }) {
  const { ref, near } = useNearViewport<HTMLDivElement>({
    rootMargin: compact ? COMPACT_ARTIFACT_ROOT_MARGIN : ARTIFACT_ROOT_MARGIN,
  });
  const fallback = <ArtifactFallback compact={compact} />;

  return (
    <div ref={ref}>
      {near ? (
        <Suspense fallback={fallback}>
          <LazyOfferScrollArtifactHero compact={compact} />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}

export function DeferredOfferDeliveryModelEngine(props: ComponentProps<typeof OfferDeliveryModelEngine>) {
  const { ref, near } = useNearViewport<HTMLDivElement>();

  return (
    <div ref={ref} className="absolute inset-0">
      {near ? (
        <Suspense fallback={<DeliveryEngineFallback />}>
          <LazyOfferDeliveryModelEngine {...props} />
        </Suspense>
      ) : (
        <DeliveryEngineFallback />
      )}
    </div>
  );
}

// Opened from the delivery section, whose near-viewport preload normally has the module warm.
export function DeferredOfferDeliveryInterfaceOverlay(props: ComponentProps<typeof OfferDeliveryInterfaceOverlay>) {
  return (
    <Suspense fallback={null}>
      <LazyOfferDeliveryInterfaceOverlay {...props} />
    </Suspense>
  );
}
