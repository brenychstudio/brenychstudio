import { getLocalizedPath, type LocaleCode } from "../i18n";
import type { Case } from "./cases";
import type { CaseStory, CaseStoryMedia } from "./caseStories";
import type { ImmersiveItem } from "./immersive";
import type { ServicePageData } from "./servicePages";

export function localizeServicePage(page: ServicePageData, locale: LocaleCode): ServicePageData {
  const translation = locale === "es" ? page.translations?.es : undefined;

  return translation
    ? {
        ...page,
        ...translation,
        secondaryHref: getLocalizedPath(page.secondaryHref, locale),
        proof: page.proof.map((proofRef, index) => ({
          ...proofRef,
          ...translation.proof[index],
        })),
      }
    : page;
}

export function localizeCase(item: Case, locale: LocaleCode): Case {
  const translation = locale === "es" ? item.translations?.es : undefined;

  if (!translation) return item;

  return {
    ...item,
    ...translation,
    poster: {
      ...item.poster,
      alt: translation.alt ?? item.poster.alt,
    },
  };
}

export function localizeCaseStory(story: CaseStory, locale: LocaleCode): CaseStory {
  const translation = locale === "es" ? story.translations?.es : undefined;

  if (!translation) return story;

  const mediaSequence = story.mediaSequence.map((media) => {
    const mediaTranslation = translation.mediaSequence.find((item) => item.id === media.id);

    if (mediaTranslation) return { ...media, ...mediaTranslation } satisfies CaseStoryMedia;

    const roleLabel =
      media.role === "hero"
        ? "Umbral"
        : media.role === "mobile"
          ? "Pantalla movil"
          : media.role === "proof"
            ? "Prueba visual"
            : media.role === "detail"
              ? "Detalle"
              : "Flujo";

    return {
      ...media,
      alt: `${translation.headline} - ${roleLabel}`,
      label: roleLabel,
      caption: translation.summary,
    } satisfies CaseStoryMedia;
  });

  return {
    ...story,
    ...translation,
    mediaSequence,
    availability:
      story.availability && translation.availability
        ? {
            ...story.availability,
            ...translation.availability,
          }
        : story.availability,
  };
}

export function localizeImmersiveItem(item: ImmersiveItem, locale: LocaleCode): ImmersiveItem {
  const translation = locale === "es" ? item.translations?.es : undefined;

  if (!translation) return item;

  const videos = item.videos?.map((media, index) => {
    const mediaTranslation = translation.videos?.find((candidate) => candidate.index === index);

    return mediaTranslation
      ? { ...media, ...mediaTranslation }
      : {
          ...media,
          alt: `${item.title} - video ${index + 1}`,
          label: `Video ${String(index + 1).padStart(2, "0")}`,
          caption: translation.description,
        };
  });
  const frames = item.frames?.map((media, index) => {
    const mediaTranslation = translation.frames?.find((candidate) => candidate.index === index);

    return mediaTranslation
      ? { ...media, ...mediaTranslation }
      : {
          ...media,
          alt: `${item.title} - frame ${index + 1}`,
          label: `Frame ${String(index + 1).padStart(2, "0")}`,
          caption: translation.description,
        };
  });

  return {
    ...item,
    ...translation,
    status: translation.status as ImmersiveItem["status"],
    links: item.links?.map((link) => ({
      ...link,
      label:
        link.label.toLowerCase().includes("live")
          ? "Sitio live"
          : link.label.toLowerCase().includes("repo")
            ? "Repositorio"
            : link.label,
    })),
    searchContent: item.searchContent
      ? {
          ...item.searchContent,
          ...translation.searchContent,
        }
      : undefined,
    videos,
    frames,
  };
}
