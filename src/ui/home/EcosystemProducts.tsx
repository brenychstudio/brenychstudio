import type { ProjectRecord } from "../../data/projectRegistry.types";
import { resolveHomeProjectPoster } from "../../data/ecosystemHome";
import { homeCopy } from "./homeCopy";
import { Arrow, HomeLink, HomeSection, ProjectSignal, SectionLabel, type HomeSectionProps } from "./HomePrimitives";
import { projectPath, projectText } from "./homeProjectPresentation";

export default function EcosystemProducts({ locale, navigate, projects }: HomeSectionProps & { projects: readonly ProjectRecord[] }) {
  const copy = homeCopy[locale];
  return <HomeSection id="products" className="eco-products eco-wrap">
    <SectionLabel number="02">{copy.products}</SectionLabel>
    <div className="eco-section-heading"><h2 id="products-title">{copy.productsTitle}</h2><p>{copy.productsIntro}</p></div>
    <div className="eco-product-pair">{projects.map((project, index) => {
      const poster = resolveHomeProjectPoster(project, locale);
      const live = project.links.find((link) => link.kind === "live");
      return <article key={project.id} className="eco-product" data-project-id={project.id}>
        <HomeLink href={projectPath(project, locale, "work")} navigate={navigate} className="eco-project-image-link">
          <div className="eco-product-image"><img src={poster.src} alt={poster.alt} loading="lazy" decoding="async" /><span className="eco-image-index" aria-hidden="true">P / 0{index + 1}</span></div>
        </HomeLink>
        <ProjectSignal project={project} locale={locale} />
        <h3>{project.publicName}</h3><p className="eco-project-description">{projectText(project.copy.oneLiner, locale)}</p>
        <div className="eco-project-actions"><HomeLink href={projectPath(project, locale, "work")} navigate={navigate} className="eco-text-link">{copy.case}<Arrow /></HomeLink>
          {live && <a href={live.href} target="_blank" rel="noreferrer" className="eco-text-link eco-secondary-link">{copy.proof}<Arrow /></a>}</div>
      </article>;
    })}</div>
  </HomeSection>;
}
