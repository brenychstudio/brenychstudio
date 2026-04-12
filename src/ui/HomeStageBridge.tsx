import { useEffect, useState } from "react";
import type { Case } from "../data/cases";
import MetamorphStageGL from "./MetamorphStageGL";
import StickyStage from "./StickyStage";

type HomeStageBridgeProps = {
  activeSlug: string;
  activeCase: Case;
  activeIndex: number;
  total: number;
  progressBySlug: Record<string, number>;
  caseSlugs: string[];
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function smoothstep(n: number) {
  const x = clamp01(n);
  return x * x * (3 - 2 * x);
}

export default function HomeStageBridge({
  activeSlug,
  activeCase,
  activeIndex,
  total,
  progressBySlug,
  caseSlugs,
}: HomeStageBridgeProps) {
  const [frozen, setFrozen] = useState(false);

  useEffect(() => {
    const freeze = () => setFrozen(true);
    window.addEventListener("app:freeze-home-stage", freeze);
    return () => window.removeEventListener("app:freeze-home-stage", freeze);
  }, []);

  const lastCaseSlug = caseSlugs[caseSlugs.length - 1] ?? "";
  const archiveProgress = progressBySlug.archive ?? 0;
  const skillsProgress = progressBySlug.skills ?? 0;
  const servicesProgress = progressBySlug.services ?? 0;

  const isCase = caseSlugs.includes(activeSlug);
  const isLastCase = activeSlug === lastCaseSlug;
  const isArchive = activeSlug === "archive";
  const isSkills = activeSlug === "skills";
  const isServices = activeSlug === "services";

  // last case should fade out inside archive block, before Skills begins
  const archiveFade = smoothstep((archiveProgress - 0.04) / 0.34);

  // balls should start only near the first Skills line, not above the archive CTA
  const skillsReveal = smoothstep((skillsProgress - 0.0) / 0.3);

  // leave Services blend unchanged for now
  const servicesBlend = smoothstep((servicesProgress - 0.01) / 0.46);

  let caseLayerOpacity = 0;
  if (isCase) {
    caseLayerOpacity = 1;
  } else if (isArchive) {
    caseLayerOpacity = 1 - archiveFade;
  }

  let stageLayerOpacity = 0;
  if (isSkills) {
    stageLayerOpacity = skillsReveal;
  } else if (isServices) {
    stageLayerOpacity = 1;
  }

  const shouldMountStage =
    !frozen &&
    (archiveProgress > 0.06 || isLastCase || isSkills || isServices || stageLayerOpacity > 0.01);

  return (
    <div className="sticky top-24 relative h-[calc(100vh-6rem)]">
      {caseLayerOpacity > 0.01 ? (
        <div
          className="absolute inset-0"
          style={{
            opacity: caseLayerOpacity,
            transform: `translate3d(0, ${stageLayerOpacity * -6}px, 0) scale(${1 - stageLayerOpacity * 0.006})`,
            filter: `blur(${stageLayerOpacity * 3.25}px)`,
            willChange: "opacity, transform, filter",
          }}
        >
          <StickyStage
            activeCase={activeCase}
            activeIndex={activeIndex}
            total={total}
            progress={progressBySlug[activeCase.slug] ?? 0}
            embedded
          />
        </div>
      ) : null}

      {shouldMountStage ? (
        <div
          className="absolute inset-0"
          style={{
            opacity: stageLayerOpacity,
            pointerEvents: "none",
            willChange: "opacity",
          }}
        >
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.14),rgba(255,255,255,0.06)_36%,rgba(255,255,255,0)_72%)]"
            style={{
              opacity: clamp01(stageLayerOpacity * 0.14),
              willChange: "opacity",
            }}
          />

          <MetamorphStageGL embedded intensity={0.88} blend={servicesBlend} />
        </div>
      ) : null}
    </div>
  );
}
