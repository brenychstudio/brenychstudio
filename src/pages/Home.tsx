import { useState } from "react";
import { motion } from "framer-motion";
import Header from "../ui/Header";
import Container from "../ui/Container";
import { cases } from "../data/cases";
import { immersiveItems, type ImmersiveTone } from "../data/immersive";
import HomeStageBridge from "../ui/HomeStageBridge";
import MetamorphStageGL from "../ui/MetamorphStageGL";
import { useSectionProgressMap } from "../ui/useSectionProgress";
import { useActiveSection } from "../ui/useActiveSection";
import ActionPill from "../ui/ActionPill";
import ExternalProfileLinks from "../ui/profile/ExternalProfileLinks";
import LegalFooterLinks from "../ui/LegalFooterLinks";
import { startHardPageTransition } from "../ui/pageTransition";
import { useLocale } from "../store/useLocale";
type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
};
const immersiveToneSurface: Record<ImmersiveTone, string> = {
  horizon:
    "bg-[radial-gradient(140%_120%_at_14%_10%,rgba(255,255,255,0.24),transparent_54%),linear-gradient(148deg,#1f2937_0%,#334155_40%,#0f172a_100%)]",
  signal:
    "bg-[radial-gradient(130%_120%_at_80%_4%,rgba(167,243,208,0.24),transparent_54%),linear-gradient(145deg,#052e2b_0%,#0f766e_42%,#164e63_100%)]",
  nocturne:
    "bg-[radial-gradient(128%_120%_at_52%_-12%,rgba(148,163,184,0.22),transparent_56%),linear-gradient(150deg,#18181b_0%,#27272a_40%,#0f172a_100%)]",
};
export default function Home({
  drawerOpen = false,
  onOpenProject,
  onCloseProject,
}: PageProps) {
  const { t, locale } = useLocale();
  const isWideCyrillic = locale === "ua" || locale === "ru";
  const navigateFromHome = (to: string) => {
    window.dispatchEvent(new Event("app:freeze-home-stage"));
    startHardPageTransition(to, () => {
      onCloseProject?.();
    });
  };
  const homeCaseOrder = [
    "sprintcrm",
    "creatorops",
    "form-index",
    "house-of-lune",
    "casa-nube",
  ];

  const homeCases = homeCaseOrder
    .map((slug) => cases.find((caseItem) => caseItem.slug === slug))
    .filter((caseItem): caseItem is (typeof cases)[number] => Boolean(caseItem));
  const caseSlugs = homeCases.map((c) => c.slug);
  const immersivePreview = immersiveItems.slice(0, 3);
  const [activeImmersiveIndex, setActiveImmersiveIndex] = useState(0);
  const activeImmersive =
    immersivePreview[activeImmersiveIndex] ?? immersivePreview[0];
  const activeImmersiveVideo =
    activeImmersive?.previewVideo ?? immersivePreview[0]?.previewVideo ?? "";
  const activeImmersivePoster =
    activeImmersive?.previewPoster ?? immersivePreview[0]?.previewPoster ?? "";
  const hasImmersiveVideo = Boolean(activeImmersiveVideo);
  const homeSkillItems = t.home.skills.items;
  const homeServiceItems = t.home.services.items;
  const canCycleImmersive = immersivePreview.length > 1;
  const goImmersivePrev = () => {
    if (!canCycleImmersive) return;
    setActiveImmersiveIndex((prev) =>
      prev === 0 ? immersivePreview.length - 1 : prev - 1,
    );
  };
  const goImmersiveNext = () => {
    if (!canCycleImmersive) return;
    setActiveImmersiveIndex((prev) =>
      prev === immersivePreview.length - 1 ? 0 : prev + 1,
    );
  };
  const slugs = [...caseSlugs, "archive", "skills", "services"];
  const activeSlug = useActiveSection(slugs, 0.54, 0.055);
  const progressBySlug = useSectionProgressMap(slugs);
  const matchedCaseIndex = homeCases.findIndex((c) => c.slug === activeSlug);
  const fallbackIndex = Math.max(0, homeCases.length - 1);
  const activeIndex = matchedCaseIndex >= 0 ? matchedCaseIndex : fallbackIndex;
  const activeCase = homeCases[activeIndex] ?? homeCases[0];
  const isArchive = activeSlug === "archive";
  const isSkills = activeSlug === "skills";
  const isServices = activeSlug === "services";
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {" "}
      <Header
        drawerOpen={drawerOpen}
        onOpenProject={onOpenProject}
        onCloseProject={onCloseProject}
      />{" "}
      <main className="pb-20 pt-40 sm:pt-32 md:pt-28">
        {" "}
        <Container>
          {" "}
          <section className="pb-10 md:pb-12 xl:pb-14">
            {" "}
            <div className="max-w-[1180px]">
              {" "}
              <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-400">
                {" "}
                {t.home.hero.label}{" "}
              </div>{" "}
              <h1
                className={[
                  "mt-5 font-normal leading-[0.92] tracking-[-0.045em]",
                  isWideCyrillic
                    ? "max-w-[15ch] text-[46px] sm:text-[58px] lg:text-[72px] xl:text-[82px]"
                    : "max-w-[14ch] text-[46px] sm:text-[58px] lg:text-[72px] xl:text-[80px]",
                ].join(" ")}
              >
                {" "}
                <span className="text-neutral-900">
                  {" "}
                  {t.home.hero.titleMain}{" "}
                </span>{" "}
                <span
                  className={[
                    "mt-8 block text-[15px] font-normal leading-[1.7] tracking-normal text-black/60",
                    isWideCyrillic ? "max-w-[42rem]" : "max-w-[38rem]",
                  ].join(" ")}
                >
                  {" "}
                  {t.home.hero.titleSub}{" "}
                </span>{" "}
              </h1>{" "}
            </div>{" "}
          </section>{" "}
          <section className="mb-14 border-t border-neutral-100 pt-10 md:mb-[4.5rem] md:pt-12 xl:mb-20 xl:pt-14">
            {" "}
            {activeImmersive ? (
              <article className="rounded-[26px] border border-neutral-100 bg-white p-2.5 shadow-[0_24px_60px_rgba(17,17,17,0.05)] transition duration-300 hover:shadow-[0_28px_70px_rgba(17,17,17,0.06)] sm:p-3 md:rounded-[30px] md:p-4">
                {" "}
                <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#06080d] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                  {" "}
                  {hasImmersiveVideo ? (
                    <div className="absolute inset-0 bg-[#06080d]">
                      {" "}
                      <video
                        key={activeImmersiveVideo}
                        className="h-full w-full object-cover"
                        autoPlay
                        muted
                        playsInline
                        preload="metadata"
                        poster={activeImmersivePoster || undefined}
                        onEnded={goImmersiveNext}
                      >
                        {" "}
                        <source
                          src={activeImmersiveVideo}
                          type="video/mp4"
                        />{" "}
                      </video>{" "}
                    </div>
                  ) : (
                    <div
                      className={[
                        "absolute inset-0",
                        immersiveToneSurface[activeImmersive.tone],
                      ].join(" ")}
                    />
                  )}{" "}
                  <div className="relative flex min-h-[520px] flex-col p-4 text-white sm:min-h-[560px] sm:p-5 md:min-h-[480px] md:justify-between md:p-7 xl:min-h-[520px] xl:p-8">
                    {" "}
                    <div className="flex items-start justify-between gap-4">
                      {" "}
                      <div className="inline-flex items-center whitespace-nowrap rounded-full border border-white/14 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/72">
                        {" "}
                        {t.home.immersive.label}{" "}
                      </div>{" "}
                      <div className="hidden items-center gap-2 whitespace-nowrap rounded-full border border-white/14 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/72 md:inline-flex">
                        {" "}
                        <span>{activeImmersive.year}</span>{" "}
                        <span className="text-white/30">·</span>{" "}
                        <span>{activeImmersive.status}</span>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className="hidden max-w-[56ch] md:block md:translate-y-32 xl:translate-y-36">
                      {" "}
                      <div className="text-[10px] uppercase tracking-[0.14em] text-white/68">
                        {" "}
                        {activeImmersive.medium}{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className="mt-auto grid gap-4 rounded-[24px] border border-white/10 bg-black/28 p-4 backdrop-blur-[2px] md:mt-0 md:rounded-none md:border-t md:border-x-0 md:border-b-0 md:border-white/10 md:bg-transparent md:p-0 md:backdrop-blur-0 lg:grid-cols-[1fr_auto] lg:items-end">
                      {" "}
                      <div>
                        <p className="max-w-[46ch] text-[14px] leading-6 text-white/90 drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)] md:text-[16px] md:leading-7">
                          {activeImmersive.tagline}
                        </p>

                        <div className="mt-3 hidden max-w-[68ch] text-[10px] uppercase tracking-[0.16em] text-white/62 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:block">
                          {activeImmersive.stack}
                        </div>
                      </div>{" "}
                      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        {" "}
                        <button
                          type="button"
                          onClick={goImmersivePrev}
                          disabled={!canCycleImmersive}
                          className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-white/5 text-white transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-1px] hover:border-white/24 hover:bg-white/12 disabled:cursor-default disabled:opacity-35 sm:inline-flex"
                          aria-label="Previous immersive project"
                        >
                          {" "}
                          &larr;{" "}
                        </button>{" "}
                        <div className="hidden min-w-[72px] text-center text-[11px] uppercase tracking-[0.14em] text-white/70 sm:block">
                          {" "}
                          {String(activeImmersiveIndex + 1).padStart(
                            2,
                            "0",
                          )} /{" "}
                          {String(immersivePreview.length).padStart(
                            2,
                            "0",
                          )}{" "}
                        </div>{" "}
                        <button
                          type="button"
                          onClick={goImmersiveNext}
                          disabled={!canCycleImmersive}
                          className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-white/5 text-white transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-1px] hover:border-white/24 hover:bg-white/12 disabled:cursor-default disabled:opacity-35 sm:inline-flex"
                          aria-label="Next immersive project"
                        >
                          {" "}
                          &rarr;{" "}
                        </button>{" "}
                        <button
                          type="button"
                          onClick={() => navigateFromHome("/immersive")}
                          className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-full border border-white/14 bg-white/8 px-4 py-3 text-[11px] uppercase tracking-[0.14em] text-white transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-1px] hover:bg-white/12 sm:w-auto lg:ml-2"
                        >
                          {" "}
                          {t.home.immersive.cta}{" "}
                          <span className="text-white/60">&rarr;</span>{" "}
                        </button>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
              </article>
            ) : null}{" "}
          </section>{" "}
          <section className="grid gap-10 xl:grid-cols-[0.42fr_0.58fr]">
            {" "}
            <div
              id="work"
              className="scroll-mt-24 overflow-x-clip xl:pb-[60vh]"
            >
              {" "}
              <div className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                {" "}
                <div className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                  {" "}
                  {t.home.work.label}{" "}
                </div>{" "}
                <button
                  type="button"
                  onClick={() => navigateFromHome("/work")}
                  className="inline-flex items-center whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-neutral-900 hover:translate-y-[-1px] hover:border-neutral-400"
                >
                  {" "}
                  {t.home.work.archive}{" "}
                  <span className="text-neutral-400">&rarr;</span>{" "}
                </button>{" "}
              </div>{" "}
              {/* mobile/tablet sticky preview removed intentionally for stability */}{" "}
              <div className="mt-6 divide-y divide-neutral-100">
                {" "}
                {homeCases.map((c, index) => {
                  const isActive = c.slug === activeSlug;
                  const displayIndex = String(index + 1).padStart(2, "0");
                  return (
                    <article
                      key={c.slug}
                      data-case={c.slug}
                      className={[
                        "flex items-center xl:min-h-[86vh]",
                        "transition duration-300",
                        isActive
                          ? "opacity-100 xl:opacity-100"
                          : "opacity-100 xl:opacity-58",
                      ].join(" ")}
                    >
                      {" "}
                      <button
                        type="button"
                        onClick={() => navigateFromHome(`/work/${c.slug}`)}
                        className={[
                          "group w-full cursor-pointer select-none py-8 text-left transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:py-10 xl:py-14",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-4",
                        ].join(" ")}
                      >
                        {" "}
                        <div className="xl:hidden">
                          <div className="overflow-hidden rounded-[30px] border border-neutral-100 bg-white p-3 shadow-[0_18px_48px_rgba(15,23,42,0.045)]">
                            <div className="overflow-hidden rounded-[24px] border border-neutral-200/70 bg-neutral-50/70 p-2">
                              <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] bg-white">
                                <img
                                  src={c.poster.src}
                                  alt={c.poster.alt}
                                  className="h-full w-full object-contain object-center"
                                  draggable={false}
                                />
                              </div>
                            </div>
                            <div className="px-2 pb-2 pt-5">
                              <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                                {displayIndex} / {String(homeCases.length).padStart(2, "0")} · {c.code}
                              </div>
                              <div className="mt-2 text-[34px] leading-[0.95] tracking-[-0.035em] text-neutral-950">
                                {c.title}
                              </div>
                              <p className="mt-4 max-w-[28rem] text-[15px] leading-7 text-neutral-650">
                                {c.tagline}
                              </p>
                              <div className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-neutral-600">
                                <span>{t.home.work.view}</span>
                                <span aria-hidden="true">→</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="hidden xl:flex xl:w-full xl:flex-row xl:items-start xl:justify-between xl:gap-6">
                          {" "}
                          <div className="flex gap-4 sm:gap-5">
                            {" "}
                            <div className="w-10 shrink-0">
                              {" "}
                              <div
                                className={`text-sm ${isActive ? "text-black" : "text-neutral-500"}`}
                              >
                                {displayIndex}
                              </div>{" "}
                              <div className="mt-2 min-h-[1em] text-[11px] uppercase tracking-[0.14em] text-neutral-400">
                                {c.code}
                              </div>{" "}
                            </div>{" "}
                            <div>
                              {" "}
                              <h2 className="text-[28px] tracking-tight transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[2px] sm:text-[32px] md:text-[36px] xl:text-4xl">
                                {c.title}
                              </h2>{" "}
                              <p className="mt-3 max-w-[32ch] text-sm leading-6 text-neutral-600 sm:max-w-[36ch] md:leading-7">
                                {" "}
                                {c.tagline}{" "}
                              </p>{" "}
                              <div className="mt-6 inline-flex items-center gap-2 whitespace-nowrap text-[11px] uppercase tracking-[0.14em] text-neutral-500 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-neutral-800">
                                {" "}
                                {t.home.work.view}{" "}
                                <span className="text-neutral-400">
                                  &rarr;
                                </span>{" "}
                              </div>{" "}
                            </div>{" "}
                          </div>{" "}
                          <div className="text-[12px] uppercase tracking-[0.16em] text-neutral-400 md:text-sm md:tracking-normal">
                            {" "}
                            {c.year}{" "}
                          </div>{" "}
                        </div>{" "}
                        <div className="relative mt-8 h-[1px] w-full bg-neutral-100 xl:mt-10">
                          {" "}
                          {isActive ? (
                            <div className="absolute left-0 top-0 hidden h-[1px] w-24 bg-neutral-900 xl:block" />
                          ) : null}{" "}
                        </div>{" "}
                      </button>{" "}
                    </article>
                  );
                })}{" "}
                <article
                  data-case="archive"
                  className={[
                    "flex min-h-[16vh] items-center md:min-h-[22vh] xl:min-h-[44vh]",
                    "transition duration-300",
                    isArchive ? "opacity-100" : "opacity-70",
                  ].join(" ")}
                >
                  {" "}
                  <div className="w-full py-8 md:py-10 xl:py-14">
                    {" "}
                    <button
                      type="button"
                      onClick={() => navigateFromHome("/work")}
                      className="inline-flex items-center whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-1px] hover:border-neutral-400 hover:text-neutral-900"
                    >
                      {" "}
                      {t.home.work.archive}{" "}
                      <span className="text-neutral-400">&rarr;</span>{" "}
                    </button>{" "}
                    <div className="mt-10 h-[1px] w-full bg-neutral-100" />{" "}
                  </div>{" "}
                </article>{" "}
                <article
                  data-case="skills"
                  className={[
                    "flex min-h-[24vh] items-center md:min-h-[32vh] xl:min-h-[86vh]",
                    "transition duration-300",
                    isSkills ? "opacity-100" : "opacity-50",
                  ].join(" ")}
                >
                  {" "}
                  <div className="w-full py-8 md:py-10 xl:py-14">
                    {" "}
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-6">
                      {" "}
                      <div className="flex gap-4 sm:gap-5">
                        {" "}
                        <div className="w-10 shrink-0">
                          {" "}
                          <div
                            className={`text-sm ${isSkills ? "text-black" : "text-neutral-500"}`}
                          >
                            04
                          </div>{" "}
                          <div className="mt-2 min-h-[1em] text-[11px] uppercase tracking-[0.14em] text-neutral-400">
                            S-04
                          </div>{" "}
                        </div>{" "}
                        <div>
                          {" "}
                          <h2 className="text-[28px] tracking-tight sm:text-[32px] md:text-[36px] xl:text-4xl">
                            {" "}
                            {t.home.skills.title}{" "}
                          </h2>{" "}
                          <p className="mt-3 max-w-[46ch] text-sm text-neutral-600">
                            {" "}
                            {t.home.skills.description}{" "}
                          </p>{" "}
                          <div className="xl:hidden mt-6 mb-8">
                            {" "}
                            <div className="overflow-hidden rounded-[28px] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(250,250,250,0.93)_100%)] p-4 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
                              {" "}
                              <div className="overflow-hidden rounded-[22px] border border-black/6 bg-white/80">
                                {" "}
                                <div className="h-[320px] sm:h-[360px]">
                                  {" "}
                                  <MetamorphStageGL
                                    embedded
                                    intensity={0.94}
                                    blend={0}
                                    compact
                                  />{" "}
                                </div>{" "}
                              </div>{" "}
                            </div>{" "}
                          </div>{" "}
                          <div className="mt-6 grid gap-3.5 md:mt-7 md:gap-4">
                            {" "}
                            {homeSkillItems.map((item, index) => (
                              <div
                                key={`${item.title}-${index}`}
                                className="rounded-[20px] border border-neutral-100 bg-white/72 p-3.5 backdrop-blur-[2px] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-neutral-200 hover:bg-white/88 hover:translate-y-[-1px] sm:p-4"
                              >
                                {" "}
                                <div className="min-h-[1em] text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                                  {" "}
                                  {item.title}{" "}
                                </div>{" "}
                                <div className="mt-2 text-sm leading-6 text-neutral-700">
                                  {" "}
                                  {item.text}{" "}
                                </div>{" "}
                              </div>
                            ))}{" "}
                          </div>{" "}
                          <div className="mt-8">
                            {" "}
                            <ActionPill
                              onClick={() => onOpenProject?.()}
                              aria-haspopup="dialog"
                              className="hover:translate-y-[-1px] hover:bg-neutral-900 hover:text-white transition"
                            >
                              {" "}
                              {t.nav.start}{" "}
                            </ActionPill>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                      <div className="text-sm text-neutral-400">
                        Capabilities
                      </div>{" "}
                    </div>{" "}
                    <div className="relative mt-10 h-[1px] w-full bg-neutral-100">
                      {" "}
                      {isSkills ? (
                        <div className="absolute left-0 top-0 h-[1px] w-24 bg-neutral-900" />
                      ) : null}{" "}
                    </div>{" "}
                  </div>{" "}
                </article>{" "}
                <article
                  data-case="services"
                  className={[
                    "flex min-h-[24vh] items-center md:min-h-[32vh] xl:min-h-[86vh]",
                    "transition duration-300",
                    isServices ? "opacity-100" : "opacity-50",
                  ].join(" ")}
                >
                  {" "}
                  <div className="w-full py-8 md:py-10 xl:py-14">
                    {" "}
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-6">
                      {" "}
                      <div className="flex gap-4 sm:gap-5">
                        {" "}
                        <div className="w-10 shrink-0">
                          {" "}
                          <div
                            className={`text-sm ${isServices ? "text-black" : "text-neutral-500"}`}
                          >
                            05
                          </div>{" "}
                          <div className="mt-2 min-h-[1em] text-[11px] uppercase tracking-[0.14em] text-neutral-400">
                            P-05
                          </div>{" "}
                        </div>{" "}
                        <div>
                          {" "}
                          <h2 className="text-[28px] tracking-tight sm:text-[32px] md:text-[36px] xl:text-4xl">
                            {" "}
                            {t.home.services.title}{" "}
                          </h2>{" "}
                          <p className="mt-3 max-w-[46ch] text-sm text-neutral-600">
                            {" "}
                            {t.home.services.description}{" "}
                          </p>{" "}
                          <div className="xl:hidden mt-6 mb-8">
                            {" "}
                            <div className="overflow-hidden rounded-[28px] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(250,250,250,0.93)_100%)] p-4 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
                              {" "}
                              <div className="overflow-hidden rounded-[22px] border border-black/6 bg-white/80">
                                {" "}
                                <div className="h-[320px] sm:h-[360px]">
                                  {" "}
                                  <MetamorphStageGL
                                    embedded
                                    intensity={0.96}
                                    blend={1}
                                    compact
                                  />{" "}
                                </div>{" "}
                              </div>{" "}
                            </div>{" "}
                          </div>{" "}
                          <div className="mt-6 grid gap-3.5 md:mt-7 md:gap-4">
                            {" "}
                            {homeServiceItems.map((item, index) => (
                              <div
                                key={`${item.title}-${index}`}
                                className="rounded-[20px] border border-neutral-100 bg-white/72 p-3.5 backdrop-blur-[2px] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-neutral-200 hover:bg-white/88 hover:translate-y-[-1px] sm:p-4"
                              >
                                {" "}
                                <div className="min-h-[1em] text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                                  {" "}
                                  {item.title}{" "}
                                </div>{" "}
                                <div className="mt-2 text-sm leading-6 text-neutral-700">
                                  {" "}
                                  {item.text}{" "}
                                </div>{" "}
                              </div>
                            ))}{" "}
                          </div>{" "}
                          <div className="mt-8">
                            {" "}
                            <ActionPill
                              onClick={() => onOpenProject?.()}
                              aria-haspopup="dialog"
                              className="hover:translate-y-[-1px] hover:bg-neutral-900 hover:text-white transition"
                            >
                              {" "}
                              {t.nav.start}{" "}
                            </ActionPill>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                      <div className="text-sm text-neutral-400">
                        Packages
                      </div>{" "}
                    </div>{" "}
                    <div className="relative mt-10 h-[1px] w-full bg-neutral-100">
                      {" "}
                      {isServices ? (
                        <div className="absolute left-0 top-0 h-[1px] w-24 bg-neutral-900" />
                      ) : null}{" "}
                    </div>{" "}
                  </div>{" "}
                </article>{" "}
              </div>{" "}
            </div>{" "}
            <div className="hidden min-w-0 xl:block">
              {" "}
              <HomeStageBridge
                activeSlug={activeSlug}
                activeCase={activeCase}
                activeIndex={activeIndex}
                total={homeCases.length}
                progressBySlug={progressBySlug}
                caseSlugs={caseSlugs}
              />{" "}
            </div>{" "}
          </section>{" "}
          <motion.section
            id="about"
            className="scroll-mt-24 mt-24 border-t border-neutral-100 pt-16"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            {" "}
            <div className="grid gap-10 md:grid-cols-[0.42fr_0.58fr]">
              {" "}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.28 }}
                transition={{
                  duration: 0.72,
                  delay: 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {" "}
                <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                  {" "}
                  {t.about.hero.label}{" "}
                </div>{" "}
                <h2 className="mt-3 text-3xl tracking-tight md:text-[42px]">
                  {t.home.about.title}
                </h2>{" "}
                <p className="mt-8 max-w-[38rem] text-[15px] leading-[1.7] text-black/60">
                  {" "}
                  {t.home.about.text}{" "}
                </p>{" "}
              </motion.div>{" "}
              <motion.div
                className="grid gap-4"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.28 }}
                transition={{
                  duration: 0.72,
                  delay: 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {" "}
                <div className="rounded-[20px] border border-neutral-100 bg-white/72 p-4 backdrop-blur-[2px] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-neutral-200 hover:bg-white/88 hover:translate-y-[-1px]">
                  {" "}
                  <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                    Best role fit
                  </div>{" "}
                  <div className="mt-2 text-sm text-neutral-700">
                    Creative Developer / Interactive Web Developer / Design
                    Engineer / Premium Front-end Systems Builder.
                  </div>{" "}
                </div>{" "}
                <div className="rounded-[20px] border border-neutral-100 bg-white/72 p-4 backdrop-blur-[2px] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-neutral-200 hover:bg-white/88 hover:translate-y-[-1px]">
                  {" "}
                  <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                    Core stack
                  </div>{" "}
                  <div className="mt-2 text-sm text-neutral-700">
                    React, TypeScript, Astro, Next.js, Vite, Tailwind CSS,
                    motion systems, structured content architecture.
                  </div>{" "}
                </div>{" "}
                <div className="pt-2">
                  {" "}
                  <ActionPill
                    onClick={() => onOpenProject?.()}
                    aria-haspopup="dialog"
                  >
                    {" "}
                    {t.nav.start}{" "}
                  </ActionPill>{" "}
                </div>{" "}
              </motion.div>{" "}
            </div>{" "}
          </motion.section>{" "}
          <motion.section
            id="contact"
            className="scroll-mt-24 mt-24 border-t border-neutral-100 pt-16"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            {" "}
            <div className="grid gap-10 md:grid-cols-[0.55fr_0.45fr]">
              {" "}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.28 }}
                transition={{
                  duration: 0.72,
                  delay: 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {" "}
                <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                  {" "}
                  {t.home.contact.label}{" "}
                </div>{" "}
                <h2 className="mt-5 text-3xl leading-tight tracking-tight md:text-4xl">
                  {" "}
                  {t.home.contact.title}{" "}
                </h2>{" "}
                <p className="mt-8 max-w-[38rem] text-[15px] leading-[1.7] text-black/60">
                  {" "}
                  {t.home.contact.text}{" "}
                </p>{" "}
                <div className="mt-8 flex flex-wrap items-center gap-2.5">
                  {" "}
                  <a
                    href="mailto:info@brenych.com?subject=Project%20inquiry&body=Hi%20Rostyslav%2C%0A%0AProject%3A%0ABudget%3A%0ATimeline%3A%0ALinks%3A%0A%0AThanks%2C"
                    className="inline-flex items-center whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-neutral-400 hover:translate-y-[-1px] hover:text-neutral-900"
                  >
                    {" "}
                    {t.home.contact.email}{" "}
                    <span className="text-neutral-400">&rarr;</span>{" "}
                  </a>{" "}
                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard?.writeText("info@brenych.com")
                    }
                    className="inline-flex items-center whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-neutral-400 hover:translate-y-[-1px] hover:text-neutral-900"
                  >
                    {" "}
                    {t.home.contact.copy}{" "}
                  </button>{" "}
                </div>{" "}
                <div className="mt-10 h-[1px] w-full bg-neutral-100" />{" "}
              </motion.div>{" "}
              <motion.div
                className="grid gap-3"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.28 }}
                transition={{
                  duration: 0.72,
                  delay: 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {" "}
                <div className="rounded-[20px] border border-neutral-100 bg-white/72 p-4 backdrop-blur-[2px] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-neutral-200 hover:bg-white/88 hover:translate-y-[-1px]">
                  {" "}
                  <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                    {" "}
                    {t.home.contact.email}{" "}
                  </div>{" "}
                  <div className="mt-2 text-sm text-neutral-900">
                    info@brenych.com
                  </div>{" "}
                  <div className="mt-1 text-xs text-neutral-500">
                    Best for briefs & references.
                  </div>{" "}
                </div>{" "}
                <div className="rounded-[20px] border border-neutral-100 bg-white/72 p-4 backdrop-blur-[2px] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-neutral-200 hover:bg-white/88 hover:translate-y-[-1px]">
                  {" "}
                  <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                    Location
                  </div>{" "}
                  <div className="mt-2 text-sm text-neutral-900">
                    Barcelona / EU
                  </div>{" "}
                  <div className="mt-1 text-xs text-neutral-500">
                    Remote worldwide.
                  </div>{" "}
                </div>{" "}
              </motion.div>{" "}
            </div>{" "}
            <div className="mt-8 border-t border-neutral-100 pt-5">
              {" "}
              <ExternalProfileLinks
                label={t.home.contact.linksLabel}
                variant="compact"
              />{" "}
              <LegalFooterLinks className="mt-5" onNavigate={navigateFromHome} />{" "}
            </div>{" "}
          </motion.section>{" "}
        </Container>{" "}
      </main>{" "}
    </div>
  );
}
