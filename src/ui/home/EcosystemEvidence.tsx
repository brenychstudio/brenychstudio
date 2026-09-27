import type { ProjectRecord } from "../../data/projectRegistry.types";
import { resolveHomeProjectPoster } from "../../data/ecosystemHome";
import { getLocalizedPath } from "../../i18n";
import { homeCopy } from "./homeCopy";
import { Arrow, HomeLink, HomeSection, ProjectSignal, SectionLabel, type HomeSectionProps } from "./HomePrimitives";
import { projectPath, projectText } from "./homeProjectPresentation";

export default function EcosystemEvidence({ locale, navigate, projects }: HomeSectionProps & { projects: readonly ProjectRecord[] }) {
  const copy = homeCopy[locale];
  return <HomeSection id="evidence" className="eco-evidence eco-wrap">
    <SectionLabel number="03">{copy.evidence}</SectionLabel>
    <div className="eco-section-heading"><h2 id="evidence-title">{copy.evidenceTitle}</h2><HomeLink href={getLocalizedPath("/work", locale)} navigate={navigate} className="eco-text-link">{copy.archive}<Arrow /></HomeLink></div>
    <div className="eco-evidence-grid">{projects.map((project) => {
      const poster = resolveHomeProjectPoster(project, locale);
      return <article key={project.id} data-project-id={project.id}>
        <HomeLink href={projectPath(project, locale, "work")} navigate={navigate} className="eco-evidence-link">
          <div className="eco-evidence-image"><img src={poster.src} alt={poster.alt} loading="lazy" decoding="async" /></div>
          <h3>{project.publicName}<Arrow /></h3>
        </HomeLink>
        <ProjectSignal project={project} locale={locale} />
        <p className="eco-project-description">{projectText(project.copy.oneLiner, locale)}</p>
      </article>;
    })}</div>
  </HomeSection>;
}
