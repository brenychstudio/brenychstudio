import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { ImmersiveItem, ImmersiveMedia } from "../../data/immersive";
import type { CaseFrame } from "../../data/cases";
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
  const videos = item.videos ?? [];
  const frames = item.frames ?? [];

  const questVideo = videos.find((video) => video.device === "vr");

  const webFrames = frames.filter((frame) => frame.device === "desktop");
  const vrFrames = frames.filter((frame) => frame.device === "vr");
  const mobileFrames = frames.filter((frame) => frame.device === "mobile");

  const openingFrame = webFrames[0] ?? null;
  const webSequenceFrames = webFrames.slice(1, 5);
  const postXrFrames = webFrames.slice(5, 10);

  const mobileShowcaseFrames = useMemo(
    () => toMobileShowcaseFrames(mobileFrames),
    [mobileFrames]
  );

  const [lightboxFrames, setLightboxFrames] = useState<LightboxFrame[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  return (
    <>
      <motion.section
        className="border-b border-neutral-100 py-14 md:py-18 xl:py-20"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto max-w-[1320px] px-4 md:px-8">
          <div className="overflow-hidden rounded-[34px] border border-neutral-200/80 bg-[#050608] p-2 shadow-[0_26px_80px_rgba(17,17,17,0.10)] md:p-3">
            <div className="relative overflow-hidden rounded-[26px] bg-black">
              <video
                className="block h-auto w-full"
                src={WHISPER_DESKTOP_VIDEO}
                poster={WHISPER_DESKTOP_POSTER}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-black/78 via-black/38 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[16%] bg-gradient-to-b from-black/34 via-black/8 to-transparent" />

              <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2 md:left-5 md:top-5">
                <span className="whitespace-nowrap rounded-full border border-white/16 bg-black/32 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white/84 backdrop-blur-md">
                  Whisper
                </span>
                <span className="whitespace-nowrap rounded-full border border-white/16 bg-black/32 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white/84 backdrop-blur-md">
                  Desktop walkthrough
                </span>
              </div>

              <div className="absolute right-4 top-4 z-10 hidden max-w-[58%] flex-nowrap justify-end gap-2 md:right-5 md:top-5 md:flex">
                <span className="whitespace-nowrap rounded-full border border-white/14 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white/74 backdrop-blur-md">
                  Interactive web
                </span>
                <span className="whitespace-nowrap rounded-full border border-white/14 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white/74 backdrop-blur-md">
                  XR exhibition
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-5">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-white/54">
                      Website navigation
                    </div>

                    <p className="mt-4 max-w-[43ch] text-sm leading-6 text-white/82 md:text-[15px]">
                      Desktop navigation through the editorial website, series pages,
                      print catalog, and collector-facing flow.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/58">
                        React
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/58">
                        Vite
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/58">
                        Three.js
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/58">
                        WebXR
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/58">
                        Quest VR
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/58">
                        AR Preview
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-start gap-2 md:justify-end">
                    <a
                      href={WHISPER_LIVE_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center whitespace-nowrap rounded-full border border-white/14 bg-white/[0.07] px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-white/88 transition hover:bg-white/14"
                    >
                      Live site ↗
                    </a>

                    <a
                      href={WHISPER_REPO_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center whitespace-nowrap rounded-full border border-white/14 bg-white/[0.07] px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-white/88 transition hover:bg-white/14"
                    >
                      Repository ↗
                    </a>
                  </div>
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
              Opening direction
            </div>
            <h2 className="mt-3 max-w-[11ch] text-[40px] leading-[0.98] tracking-[-0.045em] text-neutral-950 md:text-[62px]">
              A quiet immersive system for art, presence, prints, VR, and AR.
            </h2>
            <p className="mt-5 max-w-[58ch] text-[15px] leading-8 text-neutral-600">
              WHISPER is structured as a layered exhibition product: editorial
              web, spatial XR, headset-tested navigation, collector print logic,
              and AR preview working as one authored system.
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
                Web exhibition
              </div>
              <h2 className="mt-3 max-w-[13ch] text-[40px] leading-[0.98] tracking-[-0.045em] text-neutral-950 md:text-[62px]">
                Editorial surfaces arranged as a cinematic case sequence.
              </h2>
            </div>

            <p className="max-w-[40ch] text-[15px] leading-8 text-neutral-600 xl:justify-self-end">
              The web frames are arranged as a directed sequence: one large
              anchor, then asymmetric image and text moments.
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
                    Presentation logic
                  </div>
                  <p className="mt-4 text-sm leading-7 text-neutral-650">
                    The goal is not to display every screenshot equally. The
                    layout should show rhythm: series system, gallery staging,
                    print layer, notes layer, and collector continuation.
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
                XR spatial proof
              </div>
              <h2 className="mt-3 max-w-[10ch] text-[40px] leading-[0.98] tracking-[-0.045em] md:text-[62px]">
                Quest-tested exhibition space.
              </h2>
              <p className="mt-5 max-w-[42ch] text-[15px] leading-8 text-white/64">
                The Quest capture is the key proof point. It shows that the
                project moves beyond web presentation into headset-tested
                spatial experience.
              </p>
            </div>

            {questVideo ? (
              <article className="rounded-[30px] border border-white/10 bg-black p-3">
                <div className="relative overflow-hidden rounded-[22px] bg-black">
                  <div className="pointer-events-none absolute left-5 top-5 z-10 rounded-full border border-white/12 bg-black/45 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-white/80 backdrop-blur">
                    Meta Quest 3 capture
                  </div>

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
                    VR walkthrough
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
                Post-XR sequence
              </div>
              <h2 className="mt-3 max-w-[12ch] text-[40px] leading-[0.98] tracking-[-0.045em] text-neutral-950 md:text-[62px]">
                The collector layer brings the experience back to the artwork.
              </h2>
            </div>

            <p className="max-w-[40ch] text-[15px] leading-8 text-neutral-600 xl:justify-self-end">
              After the headset proof, the page returns to prints, details, AR
              preview, notes, and collector-facing continuation.
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
          eyebrow="Mobile showcase"
          description="Guided handheld sequence across exhibition entry, series navigation, mobile drawer, work detail, and print / AR continuation."
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
              Current milestone
            </div>
            <h3 className="mt-4 max-w-[13ch] text-[34px] leading-[1.02] tracking-[-0.04em] text-neutral-950 md:text-[48px]">
              An advanced working V1, ready for deeper production polish.
            </h3>
            <p className="mt-5 max-w-[60ch] text-[15px] leading-8 text-neutral-600">
              WHISPER already proves the core direction: public website, XR
              extension, Quest proof, print logic, AR continuation, and premium
              cinematic presentation. The next layer is refinement, timing,
              assets, and production hardening.
            </p>
          </div>

          <div className="rounded-[34px] border border-neutral-100 bg-neutral-50 p-8">
            <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
              What this proves
            </div>

            <div className="mt-6 space-y-5 text-sm leading-7 text-neutral-650">
              <p>Premium editorial web can become a spatial art product.</p>
              <p>Quest hand-navigation can be integrated without turning the experience into a game UI.</p>
              <p>Print, AR, and XR can live inside one coherent collector-facing system.</p>
            </div>
          </div>
        </div>
      </motion.section>

      <CaseImageLightbox
        frames={lightboxFrames}
        index={lightboxIndex}
        onClose={closeLightbox}
        onPrev={goPrev}
        onNext={goNext}
      />
    </>
  );
}
