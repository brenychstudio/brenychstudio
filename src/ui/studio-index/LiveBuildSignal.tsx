import { useEffect, useMemo, useState } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";

import type { LocaleCode } from "../../i18n";

type LiveBuildSignalProps = {
  readiness?: number;
  compact?: boolean;
  locale?: LocaleCode;
};

const buildStatusItems = [
  { label: "Core pages", value: "online" },
  { label: "Case archive", value: "active" },
  { label: "Motion pass", value: "tuning" },
  { label: "Mobile polish", value: "in progress" },
];

const signalLines = [
  "The portfolio is being rebuilt in public as a living interface system.",
  "Core sections are online while final motion, responsive, and",
  "case-detail refinements continue.",
];

function getLiveBuildSignalCopy(locale: LocaleCode = "en") {
  if (locale !== "es") {
    return {
      title: "Live build signal",
      ariaLabel: "Live build signal",
      buildStatusItems,
      signalLines,
      readinessLabel: "System readiness",
    };
  }

  return {
    title: "Senal de build en vivo",
    ariaLabel: "Senal de build en vivo",
    buildStatusItems: [
      { label: "Paginas core", value: "online" },
      { label: "Archivo de casos", value: "activo" },
      { label: "Motion pass", value: "ajuste" },
      { label: "Pulido mobile", value: "en progreso" },
    ],
    signalLines: [
      "El portfolio se reconstruye en publico como un sistema de interfaz vivo.",
      "Las secciones principales estan online mientras continuan los ajustes",
      "de motion, responsive y detalle de casos.",
    ],
    readinessLabel: "Preparacion del sistema",
  };
}

export default function LiveBuildSignal({
  readiness = 78,
  compact = false,
  locale = "en",
}: LiveBuildSignalProps) {
  const prefersReducedMotion = useReducedMotion();
  const copy = useMemo(() => getLiveBuildSignalCopy(locale), [locale]);
  const safeReadiness = Math.max(0, Math.min(100, readiness));
  const firstLine = copy.signalLines[0];
  const [typedLine, setTypedLine] = useState(prefersReducedMotion ? firstLine : "");
  const [displayReadiness, setDisplayReadiness] = useState(prefersReducedMotion ? safeReadiness : 0);

  useEffect(() => {
    if (prefersReducedMotion || compact) {
      setTypedLine(firstLine);
      return;
    }

    setTypedLine("");
    let index = 0;
    const timer = window.setInterval(() => {
      index += 2;
      setTypedLine(firstLine.slice(0, index));
      if (index >= firstLine.length) window.clearInterval(timer);
    }, 30);

    return () => window.clearInterval(timer);
  }, [compact, firstLine, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayReadiness(safeReadiness);
      return;
    }

    setDisplayReadiness(0);

    const controls = animate(0, safeReadiness, {
      duration: compact ? 1.25 : 1.75,
      delay: compact ? 0.22 : 0.82,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => setDisplayReadiness(Math.round(value)),
    });

    return () => controls.stop();
  }, [compact, prefersReducedMotion, safeReadiness]);

  const progressStyle = useMemo(
    () => ({ width: `${displayReadiness}%` }),
    [displayReadiness],
  );

  if (compact) {
    return (
      <motion.div
        className="inline-flex max-w-full items-center gap-3 border-l border-neutral-950/30 bg-white/30 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-neutral-600 backdrop-blur"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
      >
        <span className="relative flex h-2 w-2 shrink-0">
          {!prefersReducedMotion ? (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neutral-950/22" />
          ) : null}
          <span className="relative inline-flex h-2 w-2 rounded-full bg-neutral-950" />
        </span>
        <span className="truncate">{copy.title}</span>
        <span className="shrink-0 text-neutral-950">{displayReadiness}%</span>
      </motion.div>
    );
  }

  return (
    <motion.aside
      className="pointer-events-none w-full max-w-[21rem] border-y border-neutral-950/14 py-4 pl-4 text-neutral-950"
      aria-label={copy.ariaLabel}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12, filter: "blur(4px)" }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
          {copy.title}
        </div>
        <span className="relative flex h-2 w-2 shrink-0">
          {!prefersReducedMotion ? (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neutral-950/20" />
          ) : null}
          <span className="relative inline-flex h-2 w-2 rounded-full bg-neutral-950" />
        </span>
      </div>

      <div className="mt-4 min-h-[6.25rem] font-mono text-[12px] leading-6 text-neutral-600">
        <p>
          {typedLine}
          {!prefersReducedMotion && typedLine.length < firstLine.length ? (
            <span className="ml-1 inline-block h-3 w-px translate-y-0.5 bg-neutral-950/70" />
          ) : null}
        </p>

        {copy.signalLines.slice(1).map((line, index) => (
          <motion.p
            key={line}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 3 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{
              duration: 0.42,
              ease: [0.22, 1, 0.36, 1],
              delay: 1.08 + index * 0.16,
            }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      <div className="mt-4 border-t border-neutral-950/10 pt-3">
        <div className="grid gap-2">
          {copy.buildStatusItems.map((item) => (
            <div
              key={item.label}
              className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 font-mono text-[10px] uppercase tracking-[0.14em]"
            >
              <span className="truncate text-neutral-500">{item.label}</span>
              <span className="text-neutral-950/70">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 border-t border-neutral-950/10 pt-3">
        <div className="mb-2 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.14em]">
          <span className="text-neutral-500">{copy.readinessLabel}</span>
          <span className="text-neutral-950">{displayReadiness}%</span>
        </div>
        <div className="h-px w-full bg-neutral-950/14">
          <motion.div
            className="h-px bg-neutral-950"
            initial={false}
            animate={progressStyle}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </motion.aside>
  );
}
