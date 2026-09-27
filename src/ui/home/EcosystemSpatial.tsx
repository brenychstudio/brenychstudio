import type { ProjectRecord } from "../../data/projectRegistry.types";
import { resolveHomeProjectPoster } from "../../data/ecosystemHome";
import { immersiveItems } from "../../data/immersive";
import { getLocalizedPath } from "../../i18n";
import HomeManagedVideo from "../../media/home/HomeManagedVideo";
import { homeCopy } from "./homeCopy";
import { Arrow, HomeLink, HomeSection, ProjectSignal, SectionLabel, type HomeSectionProps } from "./HomePrimitives";
import { projectPath, projectText } from "./homeProjectPresentation";

export default function EcosystemSpatial({ locale, navigate, projects }: HomeSectionProps & { projects: readonly ProjectRecord[] }) {
  const copy = homeCopy[locale];
  return <HomeSection id="spatial" className="eco-spatial" scene="living-whisper">
    <div className="eco-wrap">
      <SectionLabel number="04">{copy.spatial}</SectionLabel>
      <div className="eco-section-heading"><h2 id="spatial-title">{copy.spatialTitle}</h2><p>{copy.spatialIntro}</p></div>
      <div className="eco-spatial-field">{projects.map((project, index) => {
        const poster = resolveHomeProjectPoster(project, locale);
        const reference = project.media.find((media) => media.asset.kind === "immersive-poster");
        const asset = reference?.asset;
        const video = asset?.kind === "immersive-poster" ? immersiveItems.find((item) => item.slug === asset.immersiveSlug)?.previewVideo : undefined;
        return <article key={project.id} className={`eco-spatial-project eco-spatial-project-${index + 1}`} data-project-id={project.id}>
          <HomeLink href={projectPath(project, locale, "immersive")} navigate={navigate} className="eco-spatial-media">
            {index === 0 && video ? <><div aria-hidden="true"><HomeManagedVideo src={video} poster={poster.src} className="eco-spatial-video" /></div><span className="sr-only">{poster.alt}</span></> : <img src={poster.src} alt={poster.alt} loading="lazy" decoding="async" />}
            <span className="eco-spatial-enter" aria-hidden="true"><Arrow /></span>
          </HomeLink>
          <div className="eco-spatial-caption"><h3>{project.publicName}</h3><ProjectSignal project={project} locale={locale} /><p>{projectText(project.copy.oneLiner, locale)}</p><HomeLink href={projectPath(project, locale, "immersive")} navigate={navigate} className="eco-text-link">{copy.case}<Arrow /></HomeLink></div>
        </article>;
      })}</div>
      <HomeLink href={getLocalizedPath("/immersive", locale)} navigate={navigate} className="eco-text-link eco-spatial-archive">{copy.immersive}<Arrow /></HomeLink>
    </div>
  </HomeSection>;
}
