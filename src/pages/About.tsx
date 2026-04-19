import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Container from "../ui/Container";
import Header from "../ui/Header";
import PageSurface from "../ui/PageSurface";
import ExternalProfileLinks from "../ui/profile/ExternalProfileLinks";
import { startSpaPageTransition } from "../ui/pageTransition";
import { useLocale } from "../store/useLocale";

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
};

export default function About({
  drawerOpen = false,
  onOpenProject,
  onCloseProject,
}: PageProps) {
  const navigate = useNavigate();
  const { t, locale } = useLocale();
  const isWideCyrillic = locale === "ua" || locale === "ru";

  const fadeUp = {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" as const },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  };

  const fadeSoft = {
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" as const },
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Header
        drawerOpen={drawerOpen}
        onOpenProject={onOpenProject}
        onCloseProject={onCloseProject}
      />

      <main className="pb-16 pt-24 md:pb-24 md:pt-28">
        <PageSurface>
          <Container>
          <motion.section
            {...fadeUp}
            className="pb-10 md:pb-16"
          >
              <div
                className={[
                  isWideCyrillic
                    ? "max-w-[22rem] sm:max-w-[32rem] md:max-w-[52rem] xl:max-w-[58rem]"
                    : "max-w-[22rem] sm:max-w-[30rem] md:max-w-[42rem] xl:max-w-[46rem]",
                ].join(" ")}
              >
              <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{t.about.hero.label}</div>

                <h1
                  className={[
                    "mt-5 font-normal tracking-[-0.045em] leading-[0.92]",
                    isWideCyrillic
                      ? "text-[34px] leading-[0.96] sm:text-[48px] lg:text-[72px] xl:text-[82px]"
                      : "text-[34px] leading-[0.96] sm:text-[48px] lg:text-[72px] xl:text-[80px]",
                  ].join(" ")}
                >
                  {t.about.hero.title}
                </h1>

              <p
                className={[
                  "mt-6 text-[14px] leading-[1.8] text-black/60 sm:mt-8 sm:text-[15px]",
                  isWideCyrillic ? "max-w-[42rem]" : "max-w-[38rem]",
                ].join(" ")}
              >
                {t.about.hero.description}
              </p>

              <div className="mt-6 border-t border-neutral-100 pt-4 sm:mt-8">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.14em] text-neutral-500 sm:gap-x-6">
                  {t.about.hero.meta.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            {...fadeUp}
            className="border-t border-neutral-100 py-10 md:py-16"
          >
            <div className="grid gap-8 xl:grid-cols-[0.54fr_0.46fr] xl:items-start">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{t.about.roots.label}</div>
                <h2 className="mt-4 max-w-[15ch] text-[26px] leading-[1.12] tracking-tight sm:text-[30px] md:text-[42px]">
                  {t.about.roots.title}
                </h2>
                <p className="mt-4 max-w-[62ch] text-[14px] leading-[1.8] text-neutral-600 sm:mt-5 sm:text-[15px] md:text-[16px]">
                  {t.about.roots.description}
                </p>
              </div>

              <div className="xl:border-l xl:border-neutral-100 xl:pl-8">
                <div className="space-y-4 sm:space-y-5">
                  <div className="border-t border-neutral-100 pt-4">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{t.about.pillars.visualDirection.label}</div>
                    <p className="mt-2 text-[14px] leading-[1.8] text-neutral-400 sm:text-[15px] md:text-[16px]">
                      {t.about.pillars.visualDirection.text}
                    </p>
                  </div>

                  <div className="border-t border-neutral-100 pt-4">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{t.about.pillars.imageRhythm.label}</div>
                    <p className="mt-2 text-[14px] leading-[1.8] text-neutral-400 sm:text-[15px] md:text-[16px]">
                      {t.about.pillars.imageRhythm.text}
                    </p>
                  </div>

                  <div className="border-t border-neutral-100 pt-4">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{t.about.pillars.productionDiscipline.label}</div>
                    <p className="mt-2 text-[14px] leading-[1.8] text-neutral-400 sm:text-[15px] md:text-[16px]">
                      {t.about.pillars.productionDiscipline.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            {...fadeUp}
            className="border-t border-neutral-100 py-10 md:py-16"
          >
            <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{t.about.practiceLines.label}</div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,0.56fr)_minmax(0,0.44fr)] xl:items-start xl:gap-14">
              <motion.article
                whileHover={{ y: -3 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[24px] border border-neutral-100 bg-white/82 p-6 sm:p-7 shadow-[0_10px_24px_rgba(15,23,42,0.025)] transition-shadow duration-300 hover:shadow-[0_18px_36px_rgba(15,23,42,0.05)]"
              >
                <div className="grid gap-4 min-[430px]:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] min-[430px]:items-start xl:block">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{t.about.practiceLines.line1.label}</div>
                    <h2 className="mt-3 max-w-none text-[24px] leading-[1.02] tracking-tight sm:text-[28px] md:text-[38px] min-[430px]:max-w-[11ch] xl:max-w-[12ch] xl:text-[42px]">
                      {t.about.practiceLines.line1.title}
                    </h2>
                  </div>

                  <div>
                    <p className="max-w-[62ch] text-[14px] leading-[1.8] text-neutral-600 sm:text-[15px] md:text-[16px]">
                      {t.about.practiceLines.line1.description}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.14em] text-neutral-400 xl:mt-6">
                  {t.about.practiceLines.line1.tags.map((item) => (
                    <span key={item} className="inline-flex items-center whitespace-nowrap rounded-full border border-neutral-200/70 bg-white/78 px-3 py-1">{item}</span>
                  ))}
                </div>
              </motion.article>

              <motion.article
                whileHover={{ y: -3 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[24px] border border-neutral-100 bg-white/82 p-6 sm:p-7 shadow-[0_10px_24px_rgba(15,23,42,0.025)] transition-shadow duration-300 hover:shadow-[0_18px_36px_rgba(15,23,42,0.05)] xl:rounded-none xl:border-0 xl:bg-transparent xl:border-l xl:border-neutral-100 xl:p-0 xl:pl-8 xl:shadow-none xl:hover:shadow-none"
              >
                <div className="grid gap-4 min-[430px]:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] min-[430px]:items-start xl:block">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{t.about.practiceLines.line2.label}</div>
                    <h3 className="mt-3 max-w-none text-[22px] leading-[1.03] tracking-tight sm:text-[26px] md:text-[32px] min-[430px]:max-w-[10.5ch] xl:max-w-[11.5ch] xl:text-[34px]">
                      {t.about.practiceLines.line2.title}
                    </h3>
                  </div>

                  <div>
                    <p className="max-w-[62ch] text-[14px] leading-[1.8] text-neutral-600 sm:text-[15px] md:text-[16px]">
                      {t.about.practiceLines.line2.description}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.14em] text-neutral-400 xl:mt-6">
                  {t.about.practiceLines.line2.tags.map((item) => (
                    <span key={item} className="inline-flex items-center whitespace-nowrap rounded-full border border-neutral-200/70 bg-white/78 px-3 py-1">{item}</span>
                  ))}
                </div>
              </motion.article>
            </div>
          </motion.section>

          <motion.section
            {...fadeUp}
            className="border-t border-neutral-100 py-10 md:py-16"
          >
            <div className="grid gap-8 xl:grid-cols-[minmax(240px,0.32fr)_minmax(0,0.68fr)] xl:items-start xl:gap-14">
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[24px] border border-neutral-100 bg-white/82 p-6 sm:p-7 mb-6 shadow-[0_10px_24px_rgba(15,23,42,0.025)] transition-shadow duration-300 hover:shadow-[0_18px_36px_rgba(15,23,42,0.05)] xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0 xl:shadow-none xl:hover:shadow-none"
              >
                <div className="grid gap-4 min-[430px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] min-[430px]:items-start xl:block">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{t.about.method.label}</div>
                  <h2 className="max-w-none text-[24px] leading-[1.04] tracking-tight sm:text-[30px] md:text-[36px] min-[430px]:max-w-[8.5ch] xl:max-w-[9ch] xl:text-[40px]">
                    {t.about.method.title}
                  </h2>
                </div>
              </motion.div>

              <ol className="max-w-[56rem] space-y-7 sm:space-y-9">
                {t.about.method.items.map((item) => (
                  <motion.li
                    key={item.index}
                    {...fadeSoft}
                    className="grid gap-3 border-t border-neutral-100 pt-4 md:grid-cols-[46px_1fr] md:gap-5 md:pt-5"
                  >
                    <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{item.index}</div>
                    <div>
                      <h3 className="text-[22px] leading-[1.06] tracking-tight sm:text-[24px]">{item.title}</h3>
                      <p className="mt-2 max-w-[54ch] text-[14px] leading-[1.8] text-neutral-600 sm:text-[15px] md:text-[16px]">{item.text}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>
          </motion.section>

          <motion.section
            {...fadeUp}
            className="border-t border-neutral-100 py-10 md:py-16"
          >
            <div className="grid gap-8 xl:grid-cols-[minmax(260px,0.4fr)_minmax(0,0.6fr)] xl:items-start xl:gap-14">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{t.about.inventory.label}</div>
                <h2 className="mt-3 max-w-[14ch] text-[24px] leading-[1.06] tracking-tight sm:text-3xl md:text-[34px] xl:max-w-[12ch] xl:text-[38px]">
                  {t.about.inventory.title}
                </h2>
                <p className="mt-4 max-w-[50ch] text-[14px] leading-[1.8] text-neutral-600 sm:text-[15px] md:text-[16px]">
                  {t.about.inventory.description}
                </p>
              </div>

              <div className="grid gap-6 sm:gap-7">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-neutral-500">{t.about.inventory.coreSurfacesLabel}</div>
                  <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                    {t.about.inventory.coreSurfaces.map((item) => (
                      <span key={item} className="inline-flex items-center whitespace-nowrap rounded-full border border-neutral-200/70 bg-white/78 px-3 py-1 font-normal">{item}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-neutral-500">{t.about.inventory.extendedPracticeLabel}</div>
                  <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                    {t.about.inventory.extendedPractice.map((item) => (
                      <span key={item} className="inline-flex items-center whitespace-nowrap rounded-full border border-neutral-200/70 bg-white/78 px-3 py-1 font-normal">{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            {...fadeUp}
            className="border-t border-neutral-100 py-10 md:py-16"
          >
            <ExternalProfileLinks
              label={t.about.links.label}
              title={t.about.links.title}
              description={t.about.links.description}
            />
          </motion.section>

          <motion.section
            {...fadeUp}
            className="mt-20 border-t border-neutral-100 pt-10 pb-2 md:mt-24 md:pt-14 md:pb-4"
          >
            <div className="grid gap-6 xl:grid-cols-[minmax(0,0.62fr)_auto] xl:items-end">
              <div className="max-w-[58ch]">
                <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{t.about.cta.label}</div>
                <h2 className="mt-3 text-[28px] leading-[1.08] tracking-tight sm:text-[32px] md:text-[40px]">
                  {t.about.cta.title}
                </h2>
                <p className="mt-4 text-[14px] leading-[1.8] text-neutral-600 sm:text-[15px] md:text-[16px]">
                  {t.about.cta.description}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center xl:justify-end">
                <button
                  type="button"
                  onClick={() => onOpenProject?.()}
                  aria-haspopup="dialog"
                  className="inline-flex w-full min-w-0 items-center justify-center rounded-full border border-black bg-black px-6 py-3 text-[11px] uppercase tracking-[0.14em] text-white shadow-[0_10px_22px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-[1px] hover:bg-neutral-900 hover:text-white hover:shadow-[0_16px_30px_rgba(0,0,0,0.18)] sm:w-auto sm:min-w-[11rem]"
                >
                  {t.about.cta.primary}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    startSpaPageTransition(navigate, "/work", onCloseProject);
                  }}
                  className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition-all duration-300 hover:-translate-y-[1px] hover:border-neutral-400 hover:text-neutral-900 hover:shadow-[0_10px_24px_rgba(15,23,42,0.05)] sm:w-auto"
                >
                  {t.about.cta.secondary} <span className="text-neutral-400">&rarr;</span>
                </button>
              </div>
            </div>
          </motion.section>
          </Container>
        </PageSurface>
      </main>
    </div>
  );
}
