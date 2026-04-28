import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ImmersiveItem, ImmersiveMedia } from "../../data/immersive";
import type { CaseFrame } from "../../data/cases";
import { whisperCaseI18n } from "../../data/whisperCaseI18n";
import { useLocale } from "../../store/useLocale";
import CaseMobileShowcase from "../work/CaseMobileShowcase";
import CaseImageLightbox from "../work/CaseImageLightbox";

type WhisperCaseLayoutProps = {
  item: ImmersiveItem;
};

type LightboxFrame = {
  src: string;
  alt?: string;
  caption?: string;
};

type WhisperMediaCopy = {
  label?: string;
  alt?: string;
  caption?: string;
};

const sectionEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
const WHISPER_DESKTOP_VIDEO = "/immersive/Whisper/Video/whisper-desktop-video.mp4";
const WHISPER_DESKTOP_POSTER = "/immersive/Whisper/desktop/whisper-1.jpg";
const WHISPER_LIVE_URL = "https://whisper-sg8.pages.dev/";
const WHISPER_REPO_URL = "https://github.com/brenychstudio/Whisper";

function toLightboxFrames(frames: ImmersiveMedia[]): LightboxFrame[] {
  return frames.map((frame) => ({
    src: frame.src,
    alt: frame.alt,
    caption: frame.caption,
  }));
}

function toMobileShowcaseFrames(frames: ImmersiveMedia[]): CaseFrame[] {
  return frames.map((frame) => ({
    kind: "image",
    device: "mobile",
    aspect: "phone",
    src: frame.src,
    alt: frame.alt,
    caption: frame.caption,
  }));
}

function applyMediaCopy(
  media: ImmersiveMedia,
  mediaCopy?: WhisperMediaCopy
): ImmersiveMedia {
  return {
    ...media,
    label: mediaCopy?.label ?? media.label,
    alt: mediaCopy?.alt ?? media.alt,
    caption: mediaCopy?.caption ?? media.caption,
  };
}

type WhisperFrameCardProps = {
  src: string;
  alt: string;
  label: string;
  description: string;
  dark?: boolean;
  onClick?: () => void;
};

function WhisperFrameCard({
  src,
  alt,
  label,
  description,
  dark = false,
  onClick,
}: WhisperFrameCardProps) {
  const cardTone = dark
    ? "border-neutral-800 bg-[#050608]"
    : "border-neutral-200 bg-white";

  const textTone = dark ? "text-white/86" : "text-neutral-900";
  const subTone = dark ? "text-white/46" : "text-neutral-500";

  return (
    <button
      type="button"
      onClick={onClick}
      className="group block w-full text-left"
    >
      <div className={`overflow-hidden rounded-[28px] border p-3 transition ${cardTone}`}>
        <img
          src={src}
          alt={alt}
          className="block h-auto w-full rounded-[20px] object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="mt-3 px-1">
        <div className={`text-[10px] uppercase tracking-[0.14em] ${subTone}`}>
          {label}
        </div>
        <p className={`mt-2 text-[15px] leading-7 ${textTone}`}>
          {description}
        </p>
      </div>
    </button>
  );
}

export default function WhisperCaseLayout({ item }: WhisperCaseLayoutProps) {
  const { locale } = useLocale();
  const copy =
    whisperCaseI18n[locale as keyof typeof whisperCaseI18n] ??
    whisperCaseI18n.en;

  const rawVideos = item.videos ?? [];
  const rawFrames = item.frames ?? [];

  const videos = rawVideos.map((video) => {
    if (video.device === "desktop") {
      return applyMediaCopy(video, copy.videos.desktop);
    }
    if (video.device === "vr") {
      return applyMediaCopy(video, copy.videos.quest);
    }
    return video;
  });

  const desktopWalkthrough = videos.find((video) => video.device === "desktop");
  const questVideo = videos.find((video) => video.device === "vr");

  const webFrames = rawFrames
    .filter((frame) => frame.device === "desktop")
    .map((frame, index) => applyMediaCopy(frame, copy.frames.web[index]));

  const vrFrames = rawFrames
    .filter((frame) => frame.device === "vr")
    .map((frame, index) => applyMediaCopy(frame, copy.frames.vr[index]));

  const mobileFrames = rawFrames
    .filter((frame) => frame.device === "mobile")
    .map((frame, index) => applyMediaCopy(frame, copy.frames.mobile[index]));

  const openingFrame = webFrames[0] ?? null;
  const webSequenceFrames = webFrames.slice(1, 5);
  const postXrFrames = webFrames.slice(5, 10);

  const mobileShowcaseFrames = useMemo(
    () => toMobileShowcaseFrames(mobileFrames),
    [mobileFrames]
  );

  const [lightboxFrames, setLightboxFrames] = useState<LightboxFrame[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<ImmersiveMedia | null>(null);

  const openLightbox = (sourceFrames: ImmersiveMedia[], index: number) => {
    setLightboxFrames(toLightboxFrames(sourceFrames));
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const goPrev = () => {
    setLightboxIndex((current) => {
      if (current === null || lightboxFrames.length === 0) return current;
      return current === 0 ? lightboxFrames.length - 1 : current - 1;
    });
  };

  const goNext = () => {
    setLightboxIndex((current) => {
      if (current === null || lightboxFrames.length === 0) return current;
      return current === lightboxFrames.length - 1 ? 0 : current + 1;
    });
  };

  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxIndex, lightboxFrames.length]);

  useEffect(() => {
    if (!activeVideo) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveVideo(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeVideo]);

  return (
    <div className="overflow-x-hidden">
      <motion.section
        className="overflow-hidden border-b border-neutral-100 py-10 md:py-14 xl:py-20"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="w-full md:relative md:left-1/2 md:w-[calc(100vw-120px)] md:max-w-[1240px] md:-translate-x-1/2 xl:max-w-[1100px]">
          <div className="overflow-hidden rounded-[24px] border border-neutral-200/80 bg-[#050608] p-2 shadow-[0_20px_56px_rgba(17,17,17,0.10)] md:rounded-[34px] md:p-3 md:shadow-[0_26px_80px_rgba(17,17,17,0.10)]">
            <div className="relative overflow-hidden rounded-[18px] bg-black md:rounded-[26px]">
              <video
                className="block h-auto w-full"
                src={desktopWalkthrough?.src ?? WHISPER_DESKTOP_VIDEO}
                poster={desktopWalkthrough?.poster ?? WHISPER_DESKTOP_POSTER}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-black/78 via-black/38 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[16%] bg-gradient-to-b from-black/34 via-black/8 to-transparent" />

              <div className="absolute left-3 top-3 z-10 flex max-w-[calc(100%-24px)] flex-wrap gap-1.5 md:left-5 md:top-5 md:max-w-none md:gap-2">
                <span className="whitespace-nowrap rounded-full border border-white/16 bg-black/32 px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-white/84 backdrop-blur-md md:px-3 md:text-[10px] md:tracking-[0.16em]">
                  {copy.opening.badges.whisper}
                </span>
                <span className="whitespace-nowrap rounded-full border border-white/16 bg-black/32 px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-white/84 backdrop-blur-md md:px-3 md:text-[10px] md:tracking-[0.16em]">
                  {copy.opening.badges.desktop}
                </span>
              </div>

              <div className="absolute right-4 top-4 z-10 hidden max-w-[58%] flex-nowrap justify-end gap-2 md:right-5 md:top-5 md:flex">
                <span className="whitespace-nowrap rounded-full border border-white/14 bg-black/30 px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-white/74 backdrop-blur-md md:px-3 md:text-[10px] md:tracking-[0.16em]">
                  {copy.opening.badges.interactive}
                </span>
                <span className="whitespace-nowrap rounded-full border border-white/14 bg-black/30 px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-white/74 backdrop-blur-md md:px-3 md:text-[10px] md:tracking-[0.16em]">
                  {copy.opening.badges.xr}
                </span>
              </div>

              <div className="hidden md:absolute md:inset-x-0 md:bottom-0 md:z-10 md:block md:p-5">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-white/54">
                      {copy.opening.kicker}
                    </div>

                    <p className="mt-4 max-w-[43ch] text-sm leading-6 text-white/82 md:text-[15px]">
                      {copy.opening.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {copy.opening.stackTop.map((label) => (
                        <span
                          key={label}
                          className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/58"
                        >
                          {label}
                        </span>
                      ))}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {copy.opening.stackBottom.map((label) => (
                        <span
                          key={label}
                          className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/58"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-start gap-2 md:justify-end">
                    <a
                      href={WHISPER_LIVE_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center whitespace-nowrap rounded-full border border-white/14 bg-white/[0.07] px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-white/88 transition hover:bg-white/14"
                    >
                      {copy.links.live} в†—
                    </a>

                    <a
                      href={WHISPER_REPO_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center whitespace-nowrap rounded-full border border-white/14 bg-white/[0.07] px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-white/88 transition hover:bg-white/14"
                    >
                      {copy.links.repo} в†—
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 px-3 pb-3 pt-4 md:hidden">
                <div>
                  <div className="text-[9px] uppercase tracking-[0.18em] text-white/46">
                    {copy.opening.kicker}
                  </div>

                  <p className="mt-2 max-w-[34ch] text-[13px] leading-6 text-white/74">
                    {copy.opening.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {copy.opening.stackTop.map((label) => (
                      <span
                        key={label}
                        className="rounded-full border border-white/10 bg-white/[0.045] px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] text-white/56"
                      >
                        {label}
                      </span>
                    ))}
                  </div>

                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {copy.opening.stackBottom.map((label) => (
                      <span
                        key={label}
                        className="rounded-full border border-white/10 bg-white/[0.045] px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] text-white/56"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <a
                    href={WHISPER_LIVE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center whitespace-nowrap rounded-full border border-white/14 bg-white/[0.07] px-3 py-2 text-[10px] uppercase tracking-[0.13em] text-white/86 transition hover:bg-white/14"
                  >
                    {copy.links.live} ↗
                  </a>

                  <a
                    href={WHISPER_REPO_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center whitespace-nowrap rounded-full border border-white/14 bg-white/[0.07] px-3 py-2 text-[10px] uppercase tracking-[0.13em] text-white/86 transition hover:bg-white/14"
                  >
                    {copy.links.repo} ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="border-b border-neutral-100 py-14 md:py-18 xl:py-20"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.14 }}
        transition={{ duration: 0.85, ease: sectionEase }}
      >
        <div className="grid gap-10 xl:grid-cols-[0.46fr_0.54fr] xl:items-end">
          <div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
              {copy.direction.eyebrow}
            </div>
            <h2 className="mt-3 max-w-[11ch] text-[40px] leading-[0.98] tracking-[-0.045em] text-neutral-950 md:text-[62px]">
              {copy.direction.title}
            </h2>
            <p className="mt-5 max-w-[58ch] text-[15px] leading-8 text-neutral-600">
              {copy.direction.body}
            </p>
          </div>

          {openingFrame ? (
            <WhisperFrameCard
              src={openingFrame.src}
              alt={openingFrame.alt}
              label={openingFrame.label ?? "Hero"}
              description={openingFrame.caption ?? ""}
              onClick={() => openLightbox(webFrames, 0)}
            />
          ) : null}
        </div>
      </motion.section>

      <motion.section
        className="border-b border-neutral-100 py-14 md:py-18 xl:py-20"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.14 }}
        transition={{ duration: 0.85, ease: sectionEase }}
      >
        <div className="grid gap-10">
          <div className="grid gap-6 xl:grid-cols-[0.56fr_0.44fr] xl:items-end">
            <div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                {copy.web.eyebrow}
              </div>
              <h2 className="mt-3 max-w-[13ch] text-[40px] leading-[0.98] tracking-[-0.045em] text-neutral-950 md:text-[62px]">
                {copy.web.title}
              </h2>
            </div>

            <p className="max-w-[40ch] text-[15px] leading-8 text-neutral-600 xl:justify-self-end">
              {copy.web.description}
            </p>
          </div>

          {webSequenceFrames.length ? (
            <div className="grid gap-8 lg:grid-cols-12">
              {webSequenceFrames[0] ? (
                <div className="lg:col-span-7">
                  <WhisperFrameCard
                    src={webSequenceFrames[0].src}
                    alt={webSequenceFrames[0].alt}
                    label={webSequenceFrames[0].label ?? "Frame 02"}
                    description={webSequenceFrames[0].caption ?? ""}
                    onClick={() => openLightbox(webFrames, 1)}
                  />
                </div>
              ) : null}

              <div className="grid gap-8 lg:col-span-5">
                {webSequenceFrames[1] ? (
                  <WhisperFrameCard
                    src={webSequenceFrames[1].src}
                    alt={webSequenceFrames[1].alt}
                    label={webSequenceFrames[1].label ?? "Frame 03"}
                    description={webSequenceFrames[1].caption ?? ""}
                    onClick={() => openLightbox(webFrames, 2)}
                  />
                ) : null}

                <div className="rounded-[30px] border border-neutral-100 bg-neutral-50 p-6">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                    {copy.web.noteLabel}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-neutral-650">
                    {copy.web.note}
                  </p>
                </div>
              </div>

              {webSequenceFrames[2] ? (
                <div className="lg:col-span-5">
                  <WhisperFrameCard
                    src={webSequenceFrames[2].src}
                    alt={webSequenceFrames[2].alt}
                    label={webSequenceFrames[2].label ?? "Frame 04"}
                    description={webSequenceFrames[2].caption ?? ""}
                    onClick={() => openLightbox(webFrames, 3)}
                  />
                </div>
              ) : null}

              {webSequenceFrames[3] ? (
                <div className="lg:col-span-7">
                  <WhisperFrameCard
                    src={webSequenceFrames[3].src}
                    alt={webSequenceFrames[3].alt}
                    label={webSequenceFrames[3].label ?? "Frame 05"}
                    description={webSequenceFrames[3].caption ?? ""}
                    onClick={() => openLightbox(webFrames, 4)}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </motion.section>

      <motion.section
        className="border-b border-neutral-100 py-14 md:py-18 xl:py-20"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.14 }}
        transition={{ duration: 0.85, ease: sectionEase }}
      >
        <div className="overflow-hidden rounded-[36px] border border-neutral-100 bg-[#05070a] p-5 text-white shadow-[0_28px_76px_rgba(17,17,17,0.12)] md:p-8">
          <div className="grid gap-8 xl:grid-cols-[0.38fr_0.62fr] xl:items-start">
            <div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-white/42">
                {copy.xr.eyebrow}
              </div>
              <h2 className="mt-3 max-w-[10ch] text-[40px] leading-[0.98] tracking-[-0.045em] md:text-[62px]">
                {copy.xr.title}
              </h2>
              <p className="mt-5 max-w-[42ch] text-[15px] leading-8 text-white/64">
                {copy.xr.body}
              </p>
            </div>

            {questVideo ? (
              <article className="rounded-[30px] border border-white/10 bg-black p-3">
                <div className="relative overflow-hidden rounded-[22px] bg-black">
                  <div className="pointer-events-none absolute left-5 top-5 z-10 rounded-full border border-white/12 bg-black/45 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-white/80 backdrop-blur">
                    {copy.xr.videoBadge}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveVideo(questVideo)}
                    className="absolute right-4 top-4 z-10 whitespace-nowrap rounded-full border border-white/14 bg-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-white/86 backdrop-blur-md transition hover:bg-white/16"
                  >
                    {copy.links.viewQuestCapture}
                  </button>

                  <video
                    className="block h-auto w-full object-contain"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={questVideo.poster}
                  >
                    <source src={questVideo.src} type="video/mp4" />
                  </video>
                </div>

                <div className="px-2 pb-1 pt-5">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-white/42">
                    {copy.xr.videoLabel}
                  </div>
                  <p className="mt-2 max-w-[70ch] text-sm leading-7 text-white/66">
                    {questVideo.caption}
                  </p>
                </div>
              </article>
            ) : null}
          </div>

          {vrFrames.length ? (
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {vrFrames.map((frame, index) => (
                <WhisperFrameCard
                  key={frame.src}
                  src={frame.src}
                  alt={frame.alt}
                  label={frame.label ?? `Quest frame ${index + 1}`}
                  description={frame.caption ?? ""}
                  dark
                  onClick={() => openLightbox(vrFrames, index)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </motion.section>

      <motion.section
        className="border-b border-neutral-100 py-14 md:py-18 xl:py-20"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.14 }}
        transition={{ duration: 0.85, ease: sectionEase }}
      >
        <div className="grid gap-10">
          <div className="grid gap-6 xl:grid-cols-[0.46fr_0.54fr] xl:items-end">
            <div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                {copy.collector.eyebrow}
              </div>
              <h2 className="mt-3 max-w-[12ch] text-[40px] leading-[0.98] tracking-[-0.045em] text-neutral-950 md:text-[62px]">
                {copy.collector.title}
              </h2>
            </div>

            <p className="max-w-[40ch] text-[15px] leading-8 text-neutral-600 xl:justify-self-end">
              {copy.collector.description}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {postXrFrames[0] ? (
              <div className="lg:col-span-5">
                <WhisperFrameCard
                  src={postXrFrames[0].src}
                  alt={postXrFrames[0].alt}
                  label={postXrFrames[0].label ?? "Frame 06"}
                  description={postXrFrames[0].caption ?? ""}
                  onClick={() => openLightbox(webFrames, 5)}
                />
              </div>
            ) : null}

            {postXrFrames[1] ? (
              <div className="lg:col-span-7">
                <WhisperFrameCard
                  src={postXrFrames[1].src}
                  alt={postXrFrames[1].alt}
                  label={postXrFrames[1].label ?? "Frame 07"}
                  description={postXrFrames[1].caption ?? ""}
                  onClick={() => openLightbox(webFrames, 6)}
                />
              </div>
            ) : null}

            {postXrFrames[2] ? (
              <div className="lg:col-span-12">
                <WhisperFrameCard
                  src={postXrFrames[2].src}
                  alt={postXrFrames[2].alt}
                  label={postXrFrames[2].label ?? "Frame 08"}
                  description={postXrFrames[2].caption ?? ""}
                  onClick={() => openLightbox(webFrames, 7)}
                />
              </div>
            ) : null}

            {postXrFrames[3] ? (
              <div className="lg:col-span-7">
                <WhisperFrameCard
                  src={postXrFrames[3].src}
                  alt={postXrFrames[3].alt}
                  label={postXrFrames[3].label ?? "Frame 09"}
                  description={postXrFrames[3].caption ?? ""}
                  onClick={() => openLightbox(webFrames, 8)}
                />
              </div>
            ) : null}

            {postXrFrames[4] ? (
              <div className="lg:col-span-5">
                <WhisperFrameCard
                  src={postXrFrames[4].src}
                  alt={postXrFrames[4].alt}
                  label={postXrFrames[4].label ?? "Frame 10"}
                  description={postXrFrames[4].caption ?? ""}
                  onClick={() => openLightbox(webFrames, 9)}
                />
              </div>
            ) : null}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="border-b border-neutral-100 py-14 md:py-18 xl:py-20"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.14 }}
        transition={{ duration: 0.85, ease: sectionEase }}
      >
        <CaseMobileShowcase
          frames={mobileShowcaseFrames}
          onOpenFrame={(src) => {
            const index = mobileFrames.findIndex((frame) => frame.src === src);
            openLightbox(mobileFrames, index >= 0 ? index : 0);
          }}
          eyebrow={copy.mobile.eyebrow}
          description={copy.mobile.description}
        />
      </motion.section>

      <motion.section
        className="py-14 md:py-18 xl:py-20"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.14 }}
        transition={{ duration: 0.85, ease: sectionEase }}
      >
        <div className="grid gap-8 xl:grid-cols-[0.62fr_0.38fr]">
          <div className="rounded-[34px] border border-neutral-100 bg-white p-8 shadow-[0_18px_46px_rgba(17,17,17,0.045)]">
            <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
              {copy.closing.eyebrow}
            </div>
            <h3 className="mt-4 max-w-[13ch] text-[34px] leading-[1.02] tracking-[-0.04em] text-neutral-950 md:text-[48px]">
              {copy.closing.title}
            </h3>
            <p className="mt-5 max-w-[60ch] text-[15px] leading-8 text-neutral-600">
              {copy.closing.body}
            </p>
          </div>

          <div className="rounded-[34px] border border-neutral-100 bg-neutral-50 p-8">
            <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
              {copy.closing.proofEyebrow}
            </div>

            <div className="mt-6 space-y-5 text-sm leading-7 text-neutral-650">
              {copy.closing.proof.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {activeVideo ? (
          <motion.div
            className="fixed inset-0 z-[90] bg-[#030406]/88 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: sectionEase }}
          >
            <div className="flex h-full w-full flex-col p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-[0.16em] text-white/52">
                  {copy.xr.viewerTitle}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-white/82 backdrop-blur-md transition hover:bg-white/14"
                >
                  {copy.links.close} Г—
                </button>
              </div>

              <div className="flex flex-1 items-center justify-center py-5 md:py-7">
                <motion.div
                  className="w-full max-w-[1480px]"
                  initial={{ opacity: 0, scale: 0.985, y: 14 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.99, y: 8 }}
                  transition={{ duration: 0.32, ease: sectionEase }}
                >
                  <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-[0_28px_90px_rgba(0,0,0,0.38)]">
                    <video
                      className="aspect-video w-full object-contain"
                      src={activeVideo.src}
                      poster={activeVideo.poster}
                      controls
                      autoPlay
                      muted
                      playsInline
                      preload="metadata"
                    />
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-[0.24fr_0.76fr] md:items-start">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-white/42">
                      {activeVideo.label ?? "Quest capture"}
                    </div>

                    <p className="max-w-[78ch] text-sm leading-7 text-white/68">
                      {activeVideo.caption}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <CaseImageLightbox
        frames={lightboxFrames}
        index={lightboxIndex}
        onClose={closeLightbox}
        onPrev={goPrev}
        onNext={goNext}
      />
    </div>
  );
}

