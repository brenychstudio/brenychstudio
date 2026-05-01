import { useNavigate } from "react-router-dom";
import Container from "../ui/Container";
import Header from "../ui/Header";
import PageSurface from "../ui/PageSurface";
import CaseStatusPill from "../ui/status/CaseStatusPill";
import { startSpaPageTransition } from "../ui/pageTransition";
import { immersiveItems, type ImmersiveTone } from "../data/immersive";
import { useLocale } from "../store/useLocale";

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
};

const toneSurface: Record<ImmersiveTone, string> = {
  horizon:
    "bg-[radial-gradient(132%_120%_at_18%_16%,rgba(255,255,255,0.28),transparent_56%),linear-gradient(150deg,#1f2937_0%,#334155_34%,#0f172a_100%)]",
  signal:
    "bg-[radial-gradient(122%_120%_at_78%_8%,rgba(167,243,208,0.28),transparent_58%),linear-gradient(148deg,#052e2b_0%,#0f766e_42%,#164e63_100%)]",
  nocturne:
    "bg-[radial-gradient(126%_120%_at_50%_-8%,rgba(148,163,184,0.2),transparent_56%),linear-gradient(152deg,#18181b_0%,#27272a_38%,#0f172a_100%)]",
};

export default function Immersive({
  drawerOpen = false,
  onOpenProject,
  onCloseProject,
}: PageProps) {
  const navigate = useNavigate();
  const { t, locale } = useLocale();
  const isWideCyrillic = locale === "ua" || locale === "ru";

  const localizedImmersiveItems = immersiveItems.map((item) => ({
    ...item,
    copy: t.immersive.cases[item.key],
  }));

  const featuredItem =
    localizedImmersiveItems.find((item) => item.featured) ?? localizedImmersiveItems[0] ?? null;
  const secondaryItems = featuredItem
    ? localizedImmersiveItems.filter((item) => item.slug !== featuredItem.slug)
    : localizedImmersiveItems;

  const openImmersiveCase = (slug: string) => {
    startSpaPageTransition(navigate, `/immersive/${slug}`, onCloseProject);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Header
        drawerOpen={drawerOpen}
        onOpenProject={onOpenProject}
        onCloseProject={onCloseProject}
      />

      <main className="pb-20 pt-24 md:pb-24 md:pt-28">
        <PageSurface>
          <Container>
            <section className="relative border-b border-neutral-100/80 pb-12 sm:pb-14">
              <div className="grid gap-8 xl:grid-cols-[0.62fr_0.38fr] xl:items-start">
                <div>
                  <div className="text-[10px] tracking-[0.14em] uppercase text-neutral-500">
                    {t.immersive.hero.label}
                  </div>

                  <h1
                    className={[
                      "mt-5 font-normal leading-[0.92] tracking-[-0.045em]",
                      isWideCyrillic
                        ? "max-w-[16ch] text-[46px] sm:text-[58px] lg:text-[72px] xl:text-[82px]"
                        : "max-w-[15ch] text-[46px] sm:text-[58px] lg:text-[72px] xl:text-[80px]",
                    ].join(" ")}
                  >
                    {t.immersive.hero.title}
                  </h1>

                  <p className="mt-8 max-w-[38rem] text-[15px] leading-[1.7] text-black/60">
                    {t.immersive.hero.description}
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[18px] border border-neutral-100 bg-white/70 p-4 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-2px] hover:shadow-[0_12px_28px_rgba(0,0,0,0.045)]">
                    <div className="text-[10px] tracking-[0.14em] uppercase text-neutral-500">
                      {t.immersive.intro.practiceLineLabel}
                    </div>
                    <p className="mt-3 text-sm leading-7 text-neutral-600">
                      {t.immersive.intro.practiceLineText}
                    </p>
                  </div>

                  <div className="rounded-[18px] border border-neutral-100 bg-white/70 p-4 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-2px] hover:shadow-[0_12px_28px_rgba(0,0,0,0.045)]">
                    <div className="text-[10px] tracking-[0.14em] uppercase text-neutral-500">
                      {t.immersive.intro.focusLabel}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                      {t.immersive.intro.focusTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center whitespace-nowrap rounded-full border border-neutral-200/80 px-3 py-1 text-[10px] tracking-[0.14em] uppercase text-neutral-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {featuredItem ? (
              <section className="mt-14 border-b border-neutral-100 py-12 md:mt-16 md:py-14">
                <article className="rounded-[30px] border border-neutral-100 bg-white p-3 md:p-4">
                  <div
                    className={[
                      "relative overflow-hidden rounded-[24px] border border-white/10",
                      "shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
                      toneSurface[featuredItem.tone],
                    ].join(" ")}
                  >
                    {featuredItem.previewVideo ? (
                      <video
                        key={featuredItem.previewVideo}
                        className="absolute inset-0 h-full w-full object-cover object-center"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      >
                        <source src={featuredItem.previewVideo} type="video/mp4" />
                      </video>
                    ) : featuredItem.previewPoster ? (
                      <img
                        src={featuredItem.previewPoster}
                        alt={featuredItem.copy.title}
                        className="absolute inset-0 h-full w-full object-cover object-center"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}

                    <div className="relative flex min-h-[560px] flex-col p-4 text-white sm:min-h-[600px] sm:p-5 md:min-h-[600px] md:justify-between md:p-8 xl:min-h-[640px] 2xl:min-h-[680px]">
                      <div className="flex items-start justify-between gap-4">
                        <div className="inline-flex items-center whitespace-nowrap rounded-full border border-white/14 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/72">
                          {featuredItem.copy.supportLabel}
                        </div>

                        <div className="hidden items-center gap-2 md:flex">
                          <div className="inline-flex items-center whitespace-nowrap rounded-full border border-white/14 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/72">
                            {featuredItem.year}
                          </div>
                          <CaseStatusPill
                            kind={featuredItem.statusKind}
                            label={featuredItem.copy.status}
                            tone="dark"
                          />
                        </div>

                        <div className="hidden">
                          <span>{featuredItem.year}</span>
                          <span className="text-white/30">•</span>
                          <span>{featuredItem.copy.status}</span>
                        </div>
                      </div>

                      <div className="hidden max-w-[56ch] md:block md:translate-y-32 xl:translate-y-36">
                        <div className="text-[10px] uppercase tracking-[0.14em] text-white/85">
                          {featuredItem.copy.medium}
                        </div>
                      </div>

                      <div className="mt-auto grid gap-4 rounded-[24px] border border-white/10 bg-black/28 p-4 backdrop-blur-[2px] md:mt-0 md:rounded-none md:border-t md:border-x-0 md:border-b-0 md:border-white/10 md:bg-transparent md:p-0 md:backdrop-blur-0 md:grid-cols-[1fr_auto] md:items-end">
                        <div>
                          <p className="max-w-[60ch] text-[14px] leading-6 text-white/90 drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)] md:text-sm md:leading-7">
                            {featuredItem.copy.description}
                          </p>
                          <div className="mt-3 hidden max-w-[68ch] text-[10px] uppercase tracking-[0.16em] text-white/68 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:block">
                            {featuredItem.copy.stack}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => openImmersiveCase(featuredItem.slug)}
                          className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-full border border-white/20 bg-white/12 px-4 py-3 text-[11px] uppercase tracking-[0.14em] text-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-1px] hover:bg-white/24 md:w-auto"
                        >
                          {featuredItem.copy.ctaLabel} <span className="text-white/60">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </section>
            ) : null}

            {secondaryItems.length ? (
              <section className="border-b border-neutral-100 py-12 md:py-14">
                <div className="mb-6 text-[10px] tracking-[0.14em] uppercase text-neutral-500">
                  {t.immersive.secondary.label}
                </div>
                <div className="grid gap-5 xl:grid-cols-2">
                  {secondaryItems.map((item) => (
                    <article
                      key={item.slug}
                      role="link"
                      tabIndex={0}
                      onClick={() => openImmersiveCase(item.slug)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openImmersiveCase(item.slug);
                        }
                      }}
                      className="group cursor-pointer flex h-full flex-col rounded-[18px] border border-neutral-100 bg-white/90 p-4 backdrop-blur-[2px] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-2px] hover:shadow-[0_12px_28px_rgba(0,0,0,0.045)] hover:border-neutral-200"
                    >
                      <div
                        className={[
                          "relative overflow-hidden rounded-[18px] border border-white/10 text-white",
                          "aspect-[16/10] min-h-[264px]",
                        ].join(" ")}
                      >
                        {item.previewVideo ? (
                          <video
                            key={item.previewVideo}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                          >
                            <source src={item.previewVideo} type="video/mp4" />
                          </video>
                        ) : item.previewPoster ? (
                          <img
                            src={item.previewPoster}
                            alt={item.copy.title}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : null}

                        <div className="absolute inset-0 bg-black/12" />
                        <div className="pointer-events-none absolute left-4 top-4 z-10 text-[10px] tracking-[0.14em] uppercase text-white/72">
                          {item.copy.supportLabel}
                        </div>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-[20px] leading-[1.2] tracking-[-0.01em] text-neutral-950">
                          {item.copy.title}
                        </h3>
                        <p className="mt-2 text-[14px] leading-6 text-neutral-650">
                          {item.copy.description}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <CaseStatusPill kind={item.statusKind} label={item.copy.status} />
                          <div className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                            {item.copy.stack}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="grid gap-6 border-t border-neutral-100/80 pt-12 pb-12 xl:grid-cols-[0.56fr_0.44fr] md:pb-14">
              <div className="rounded-2xl border border-neutral-100 p-6 md:p-7">
                <div className="text-[10px] tracking-[0.14em] uppercase text-neutral-500">
                  {t.immersive.closing.practiceFramingLabel}
                </div>
                <h3 className="mt-3 text-[26px] leading-[1.2] tracking-[-0.025em]">
                  {t.immersive.closing.title}
                </h3>
                <p className="mt-4 max-w-[62ch] text-sm leading-7 text-neutral-600">
                  {t.immersive.closing.description}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-100 p-6 md:p-7">
                <div className="text-[10px] tracking-[0.14em] uppercase text-neutral-500">
                  {t.immersive.closing.nextStepLabel}
                </div>
                <p className="mt-4 text-sm leading-7 text-neutral-600">
                  {t.immersive.closing.nextStepDescription}
                </p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => onOpenProject?.()}
                    className="inline-flex min-w-[11rem] items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm tracking-wide text-white transition hover:opacity-90"
                    aria-haspopup="dialog"
                  >
                    {t.immersive.closing.primary}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      startSpaPageTransition(navigate, "/work", onCloseProject);
                    }}
                    className="inline-flex items-center whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-1px] hover:border-neutral-400 hover:text-neutral-900"
                  >
                    {t.immersive.closing.secondary} <span className="text-neutral-400">→</span>
                  </button>
                </div>
              </div>
            </section>
          </Container>
        </PageSurface>
      </main>
    </div>
  );
}
