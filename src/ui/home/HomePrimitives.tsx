import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ProjectRecord, PublicLocale } from "../../data/projectRegistry.types";

export type HomeSectionProps = { locale: PublicLocale; navigate: (path: string) => void };

export function HomeLink({ href, navigate, children, className = "" }: {
  href: string; navigate: (path: string) => void; children: ReactNode; className?: string;
}) {
  return <a href={href} className={className} onClick={(event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); navigate(href);
  }}>{children}</a>;
}

export function HomeSection({ id, children, className = "", scene = "living-threshold" }: {
  id: string; children: ReactNode; className?: string; scene?: string;
}) {
  const reduced = useReducedMotion();
  return <motion.section id={id} aria-labelledby={`${id}-title`} data-header-scene={scene}
    className={`eco-section ${className}`} initial={reduced ? false : { opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.section>;
}

export function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return <p className="eco-label"><span aria-hidden="true">{number}</span>{children}</p>;
}

export function Arrow() {
  return <span className="eco-arrow" aria-hidden="true">↗</span>;
}

const maturityLabels = {
  en: { concept: "Concept", prototype: "Prototype", beta: "Beta", "pre-release": "Pre-release", released: "Released", archived: "Archived" },
  es: { concept: "Concepto", prototype: "Prototipo", beta: "Beta", "pre-release": "Prelanzamiento", released: "Publicado", archived: "Archivado" },
};
const accessLabels = {
  en: { "not-offered": "Not offered", "adaptation-available": "Adaptation available", "reference-only": "Reference only", "controlled-access": "Controlled access", "public-access": "Public access" },
  es: { "not-offered": "No disponible comercialmente", "adaptation-available": "Adaptación disponible", "reference-only": "Solo referencia", "controlled-access": "Acceso controlado", "public-access": "Acceso público" },
};
export function ProjectSignal({ project, locale }: { project: ProjectRecord; locale: PublicLocale }) {
  return <p className="eco-project-signal">{maturityLabels[locale][project.maturity]}<span aria-hidden="true"> · </span>{accessLabels[locale][project.commercialAvailability]}</p>;
}
