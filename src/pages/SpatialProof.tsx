import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { immersiveItems } from "../data/immersive";
import Header from "../ui/Header";
import PageSurface from "../ui/PageSurface";
import { startSpaPageTransition } from "../ui/pageTransition";

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
};

type SectionId = "threshold" | "unfold" | "web" | "quest" | "collector" | "grammar" | "closing";

type MediaAsset = {
  kind: "image" | "video";
  src: string;
  poster?: string;
  label: string;
  className: string;
  clipPath?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

const whisper = immersiveItems.find((item) => item.slug === "whisper");

const findFrame = (label: string, fallback: string) =>
  whisper?.frames?.find((frame) => frame.label?.toLowerCase() === label.toLowerCase())?.src ?? fallback;

const findVideo = (device: "desktop" | "vr", fallback: string) =>
  whisper?.videos?.find((video) => video.device === device)?.src ?? fallback;

const findVideoPoster = (device: "desktop" | "vr", fallback: string) =>
  whisper?.videos?.find((video) => video.device === device)?.poster ?? fallback;

const media = {
  heroPoster: whisper?.previewPoster ?? "/immersive/Whisper/desktop/whisper-hero.jpg",
  heroVideo: whisper?.previewVideo ?? "/immersive/Whisper/Video/whisper-hero-poster.mp4",

  desktopVideo: findVideo("desktop", "/immersive/Whisper/Video/whisper-desktop-video.mp4"),
  desktopPoster: findVideoPoster("desktop", "/immersive/Whisper/desktop/whisper-8.jpg"),

  vrVideo: findVideo("vr", "/immersive/Whisper/Video/whisper-vr-video.mp4"),
  vrPoster: findVideoPoster("vr", "/immersive/Whisper/desktop/whisper-vr-1.jpg"),

  hero: findFrame("Hero", "/immersive/Whisper/desktop/whisper-hero.jpg"),
  series: findFrame("Series system", "/immersive/Whisper/desktop/whisper-1.jpg"),
  forest: findFrame("Forest series", "/immersive/Whisper/desktop/whisper-5.jpg"),
  print: findFrame("Print catalog", "/immersive/Whisper/desktop/whisper-7.jpg"),
  printDetail: findFrame("Print detail", "/immersive/Whisper/desktop/whisper-8.jpg"),
  ar: findFrame("AR preview", "/immersive/Whisper/desktop/whisper-9.jpg"),
  notes: findFrame("Notes layer", "/immersive/Whisper/desktop/whisper-10.jpg"),
  mobile: findFrame("Mobile 03", "/immersive/Whisper/mobile/whisper-mb-3.jpg"),
  mobilePrint: findFrame("Mobile 06", "/immersive/Whisper/mobile/whisper-mb-6.jpg"),
};

const railItems: Array<[string, string, SectionId]> = [
  ["01", "Threshold", "threshold"],
  ["02", "Unfold", "unfold"],
  ["03", "Web", "web"],
  ["04", "Quest", "quest"],
  ["05", "Collector", "collector"],
  ["06", "Grammar", "grammar"],
  ["07", "CTA", "closing"],
];

const grammarRows = [
  ["Web", "A public cinematic surface for entering the archive."],
  ["Mobile", "A handheld continuation of the same exhibition language."],
  ["Print", "A collector-facing object system with edition logic."],
  ["AR", "A preview layer that reconnects the physical print to space."],
  ["Quest", "A room-scale proof where the archive becomes embodied."],
];

function SpatialNoIndexMeta() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Spatial Proof — Rostyslav Brenych";

    const existing = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousContent = existing?.getAttribute("content") ?? null;
    const meta = existing ?? document.createElement("meta");

    meta.setAttribute("name", "robots");
    meta.setAttribute("content", "noindex, nofollow");

    if (!existing) document.head.appendChild(meta);

    return () => {
      document.title = previousTitle;

      if (existing && previousContent !== null) {
        existing.setAttribute("content", previousContent);
        return;
      }

      if (!existing) meta.remove();
    };
  }, []);

  return null;
}

function useActiveSection() {
  const [activeId, setActiveId] = useState<SectionId>("threshold");

  useEffect(() => {
    const ids: SectionId[] = ["threshold", "unfold", "web", "quest", "collector", "grammar", "closing"];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) setActiveId(visible.target.id as SectionId);
      },
      {
        threshold: [0.18, 0.32, 0.48, 0.62],
        rootMargin: "-24% 0px -46% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return activeId;
}

function SpatialAtmosphere() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 28, mass: 0.45 });

  const ringRotate = useTransform(progress, [0, 1], ["0deg", "48deg"]);
  const ringY = useTransform(progress, [0, 1], ["0vh", "-24vh"]);
  const lineX = useTransform(progress, [0, 1], ["-18vw", "18vw"]);
  const lineY = useTransform(progress, [0, 1], ["0vh", "30vh"]);
  const progressScale = useTransform(progress, [0, 1], [0.04, 1]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#f0ede6]" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(0,0,0,0.12),transparent_28%),radial-gradient(circle_at_78%_12%,rgba(0,0,0,0.07),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.9),rgba(240,237,230,0.96)_48%,rgba(255,255,255,0.98))]" />
      <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] [background-size:90px_90px]" />

      <motion.div
        className="absolute left-1/2 top-[18vh] h-[86rem] w-[86rem] -translate-x-1/2 rounded-full border border-neutral-950/[0.06]"
        style={{ y: ringY, rotate: ringRotate }}
      />
      <motion.div
        className="absolute left-[5vw] top-[34vh] h-px w-[92vw] rotate-[-13deg] bg-gradient-to-r from-transparent via-neutral-950/18 to-transparent"
        style={{ x: lineX }}
      />
      <motion.div
        className="absolute left-[12vw] top-[70vh] h-px w-[78vw] rotate-[18deg] bg-gradient-to-r from-transparent via-neutral-950/12 to-transparent"
        style={{ y: lineY }}
      />

      <motion.div
        className="absolute right-5 top-[18vh] hidden h-[64vh] w-px origin-top bg-neutral-950/16 lg:block"
        style={{ scaleY: progressScale }}
      />
      <div className="absolute right-4 top-[18vh] hidden rounded-full border border-neutral-950/12 bg-white/48 px-2 py-1 text-[9px] uppercase tracking-[0.16em] text-neutral-400 backdrop-blur lg:block">
        Spatial signal
      </div>
    </div>
  );
}

function SpatialRail({
  activeId,
  onSelect,
}: {
  activeId: SectionId;
  onSelect: (id: SectionId) => void;
}) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.45 });

  return (
    <nav className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 items-end gap-4 2xl:flex">
      <div className="relative h-[19.5rem] w-px overflow-hidden rounded-full bg-neutral-950/10">
        <motion.div className="absolute left-0 top-0 h-full w-full origin-top bg-neutral-950" style={{ scaleY: progress }} />
      </div>

      <div className="flex flex-col gap-2">
        {railItems.map(([index, label, id]) => {
          const active = activeId === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className={`group grid grid-cols-[2rem_1fr] items-center gap-2 rounded-full border px-3 py-2 text-left text-[10px] uppercase tracking-[0.14em] shadow-[0_14px_44px_rgba(0,0,0,0.04)] backdrop-blur-xl transition ${
                active
                  ? "border-neutral-950 bg-neutral-950 text-white"
                  : "border-white/70 bg-white/54 text-neutral-400 hover:border-neutral-300 hover:bg-white hover:text-neutral-950"
              }`}
            >
              <span className={active ? "text-white/58" : "text-neutral-300 group-hover:text-neutral-950"}>{index}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function KineticTitle({
  as = "h2",
  text,
  className,
}: {
  as?: "h1" | "h2" | "h3";
  text: string;
  className: string;
}) {
  const reduceMotion = useReducedMotion();
  const MotionTag = as === "h1" ? motion.h1 : as === "h3" ? motion.h3 : motion.h2;
  const StaticTag = as;

  if (reduceMotion) return <StaticTag className={className}>{text}</StaticTag>;

  return (
    <MotionTag className={className}>
      {text.split(" ").map((word, index, words) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block"
          initial={{ opacity: 0, y: 24, rotateX: -30 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: false, amount: 0.44 }}
          transition={{ duration: 0.68, delay: index * 0.028, ease }}
        >
          {word}
          {index < words.length - 1 ? "\u00a0" : ""}
        </motion.span>
      ))}
    </MotionTag>
  );
}

function Chapter({
  id,
  children,
  className = "",
}: {
  id?: SectionId;
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <section id={id} className={className}>{children}</section>;

  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.22 }}
      transition={{ duration: 0.9, ease }}
    >
      {children}
    </motion.section>
  );
}

function TiltMedia({ asset, index }: { asset: MediaAsset; index: number }) {
  const reduceMotion = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateY = useTransform(mx, [-1, 1], [-7, 7]);
  const rotateX = useTransform(my, [-1, 1], [6, -6]);
  const mediaX = useTransform(mx, [-1, 1], ["-3%", "3%"]);
  const mediaY = useTransform(my, [-1, 1], ["-3%", "3%"]);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
    my.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const handlePointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.figure
      className={`absolute overflow-hidden border border-white/70 bg-white/10 shadow-[0_46px_150px_rgba(0,0,0,0.17)] backdrop-blur-[2px] ${asset.className}`}
      style={{
        clipPath: asset.clipPath ?? "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        rotateX: reduceMotion ? 0 : rotateX,
        rotateY: reduceMotion ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      initial={reduceMotion ? undefined : { opacity: 0, y: 56, scale: 0.97 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1.02 }}
      whileHover={reduceMotion ? undefined : { scale: 1.055, zIndex: 20 }}
      viewport={{ once: false, amount: 0.35 }}
      transition={{ duration: 0.9, delay: index * 0.08, ease }}
    >
      {asset.kind === "video" ? (
        <motion.video
          className="absolute inset-[-4%] h-[108%] w-[108%] object-cover opacity-100 saturate-[1.04] contrast-[1.04]"
          style={{ x: reduceMotion ? 0 : mediaX, y: reduceMotion ? 0 : mediaY }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={asset.poster}
        >
          <source src={asset.src} type="video/mp4" />
        </motion.video>
      ) : (
        <motion.img
          src={asset.src}
          alt=""
          className="absolute inset-[-4%] h-[108%] w-[108%] object-cover opacity-100 saturate-[1.04] contrast-[1.04]"
          style={{ x: reduceMotion ? 0 : mediaX, y: reduceMotion ? 0 : mediaY }}
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.015)_58%,rgba(0,0,0,0.16))]" />

      <figcaption className="absolute bottom-5 left-5 right-5">
        <div className="inline-flex rounded-full border border-white/50 bg-white/24 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white/80 shadow-[0_10px_34px_rgba(0,0,0,0.1)] backdrop-blur-md">
          {asset.label}
        </div>
      </figcaption>
    </motion.figure>
  );
}

function ThresholdScene({ onOpenImmersive }: { onOpenImmersive: () => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="threshold" className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-[0.84] saturate-[1.05] contrast-[1.04]"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={media.heroPoster}
      >
        <source src={media.heroVideo} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_42%,rgba(0,0,0,0.08),rgba(0,0,0,0.62)_62%,rgba(0,0,0,0.92)),linear-gradient(90deg,rgba(0,0,0,0.82),rgba(0,0,0,0.2)_52%,rgba(0,0,0,0.72))]" />

      <motion.div
        className="absolute left-[7%] top-[18%] h-px w-[86%] bg-gradient-to-r from-transparent via-white/36 to-transparent"
        animate={reduceMotion ? undefined : { opacity: [0.18, 0.72, 0.18], scaleX: [0.78, 1, 0.78] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto grid min-h-screen w-[min(92vw,1600px)] items-end pb-16 pt-28 xl:grid-cols-[0.58fr_0.42fr]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-white/45">Spatial proof / WHISPER</div>

          <KineticTitle
            as="h1"
            text="A web exhibition that became a room."
            className="mt-6 max-w-[11ch] text-[72px] font-normal leading-[0.82] tracking-[-0.085em] text-white sm:text-[106px] xl:text-[138px]"
          />

          <p className="mt-8 max-w-[42rem] text-[17px] leading-[1.85] text-white/68">
            WHISPER connects public website, mobile presentation, print logic, AR preview, and Quest-tested space
            as one cinematic interface system.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onOpenImmersive}
              className="rounded-full border border-white bg-white px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-neutral-950 transition hover:-translate-y-0.5 hover:bg-white/84"
            >
              Open current case →
            </button>
            <a
              href="#unfold"
              className="rounded-full border border-white/18 bg-white/[0.08] px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-white/70 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/[0.14] hover:text-white"
            >
              Follow proof →
            </a>
          </div>
        </div>

        <div className="hidden xl:block">
          <div className="ml-auto max-w-[19rem] border-l border-white/14 pl-6">
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/38">Connected surfaces</div>
            <div className="mt-5 grid gap-2">
              {["Web", "Mobile", "Print", "AR", "Quest"].map((item) => (
                <div key={item} className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-[10px] uppercase tracking-[0.15em] text-white/54">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function UnfoldScene() {
  const target = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 28, mass: 0.45 });

  const height = useTransform(progress, [0.05, 0.32, 0.68], ["5rem", "30rem", "70vh"]);
  const width = useTransform(progress, [0.05, 0.36, 0.74], ["54vw", "84vw", "96vw"]);
  const radius = useTransform(progress, [0.05, 0.34, 0.74], ["999px", "4rem", "1.2rem"]);
  const textOpacity = useTransform(progress, [0.12, 0.32], [0, 1]);
  const textY = useTransform(progress, [0.12, 0.52], ["3rem", "0rem"]);

  return (
    <section ref={target} id="unfold" className="relative min-h-[205vh] bg-[#f0ede6] px-4 sm:px-6 lg:px-8">
      <div className="sticky top-[4.5rem] min-h-[calc(100vh-4.5rem)] overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-1/2 overflow-hidden border border-white/70 shadow-[0_54px_170px_rgba(0,0,0,0.2)]"
          style={{ width, height, borderRadius: radius, x: "-50%", y: "-50%" }}
        >
          <video
            className="absolute inset-[-3%] h-[106%] w-[106%] object-cover opacity-100 saturate-[1.05] contrast-[1.04]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={media.desktopPoster}
          >
            <source src={media.desktopVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.34),rgba(0,0,0,0.02)_44%,rgba(0,0,0,0.2))]" />
        </motion.div>

        <motion.div
          className="relative z-10 mx-auto grid min-h-[calc(100vh-4.5rem)] w-[min(92vw,1600px)] items-end pb-16 xl:grid-cols-[0.46fr_0.54fr]"
          style={{ opacity: textOpacity, y: textY }}
        >
          <div>
            <div className="text-[10px] uppercase tracking-[0.26em] text-white/68 drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]">
              Surface unfolds
            </div>
            <h2 className="mt-5 max-w-[10ch] text-[62px] font-normal leading-[0.84] tracking-[-0.078em] text-white drop-shadow-[0_3px_24px_rgba(0,0,0,0.58)] sm:text-[92px] xl:text-[118px]">
              The website opens like a spatial instrument.
            </h2>
          </div>

          <p className="max-w-[36rem] text-[17px] leading-[1.85] text-white/74 drop-shadow-[0_2px_18px_rgba(0,0,0,0.72)]">
            Instead of showing the case as a static cover, the page reveals the interface as movement: archive,
            navigation, rhythm, and attention.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function MediaScene({
  id,
  eyebrow,
  title,
  text,
  assets,
  reverse = false,
}: {
  id: SectionId;
  eyebrow: string;
  title: string;
  text: string;
  assets: MediaAsset[];
  reverse?: boolean;
}) {
  return (
    <Chapter id={id} className="relative min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className={`mx-auto grid min-h-[calc(100vh-12rem)] w-[min(92vw,1600px)] gap-14 xl:grid-cols-[0.36fr_0.64fr] xl:items-center ${reverse ? "xl:grid-cols-[0.64fr_0.36fr]" : ""}`}>
        <div className={reverse ? "xl:order-2" : ""}>
          <div className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">{eyebrow}</div>
          <KineticTitle
            as="h2"
            text={title}
            className="mt-5 max-w-[9.2ch] text-[58px] font-normal leading-[0.82] tracking-[-0.078em] text-neutral-950 sm:text-[88px] xl:text-[112px]"
          />
          <p className="mt-7 max-w-[36rem] text-[16px] leading-[1.85] text-neutral-600">{text}</p>
        </div>

        <div className={`relative min-h-[690px] xl:min-h-[790px] ${reverse ? "xl:order-1" : ""}`}>
          {assets.map((asset, index) => (
            <TiltMedia key={`${id}-${asset.label}`} asset={asset} index={index} />
          ))}

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[35rem] w-[35rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-950/8" />
          <div className="pointer-events-none absolute left-[8%] top-[34%] h-px w-[86%] rotate-[-12deg] bg-gradient-to-r from-transparent via-neutral-950/13 to-transparent" />
        </div>
      </div>
    </Chapter>
  );
}

function GrammarScene() {
  return (
    <Chapter id="grammar" className="relative min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-12rem)] w-[min(92vw,1600px)] items-center gap-14 xl:grid-cols-[0.46fr_0.54fr]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Spatial grammar</div>
          <KineticTitle
            as="h2"
            text="One project, five connected surfaces."
            className="mt-7 max-w-[9.4ch] text-[62px] font-normal leading-[0.82] tracking-[-0.078em] text-neutral-950 sm:text-[94px] xl:text-[126px]"
          />
          <p className="mt-8 max-w-[38rem] text-[17px] leading-[1.85] text-neutral-600">
            WHISPER proves the practice as a system: the same atmosphere, interaction logic, and media rhythm
            can move from browser to phone, print, AR, and headset.
          </p>
        </div>

        <div className="border-y border-neutral-950/14">
          {grammarRows.map(([title, note], index) => (
            <motion.div
              key={title}
              className="grid gap-5 border-b border-neutral-950/12 py-7 last:border-b-0 md:grid-cols-[0.16fr_0.3fr_0.54fr] md:items-start"
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.26 }}
              transition={{ duration: 0.72, ease }}
            >
              <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-300">0{index + 1}</div>
              <h3 className="text-[34px] font-normal leading-none tracking-[-0.06em] text-neutral-950 md:text-[46px]">
                {title}
              </h3>
              <p className="text-[15px] leading-7 text-neutral-600">{note}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Chapter>
  );
}

function ClosingScene({
  onOpenProject,
  onOpenImmersive,
}: {
  onOpenProject?: () => void;
  onOpenImmersive: () => void;
}) {
  return (
    <Chapter id="closing" className="relative min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-12rem)] w-[min(92vw,1600px)] items-center gap-14 xl:grid-cols-[0.58fr_0.42fr]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Closing signal</div>
          <KineticTitle
            as="h2"
            text="Spatial work is the proof layer."
            className="mt-7 max-w-[10ch] text-[64px] font-normal leading-[0.82] tracking-[-0.078em] text-neutral-950 sm:text-[96px] xl:text-[126px]"
          />
          <p className="mt-8 max-w-[42rem] text-[17px] leading-[1.85] text-neutral-600">
            The same logic that shapes an immersive room can also clarify a product, a service, a collection,
            an advisory flow, or a premium digital launch.
          </p>
        </div>

        <div className="border-y border-neutral-950/14 py-8">
          <div className="text-[10px] uppercase tracking-[0.22em] text-neutral-400">Next action</div>
          <div className="mt-8 grid gap-3">
            <button
              type="button"
              onClick={onOpenProject}
              className="rounded-full border border-neutral-950 bg-neutral-950 px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
            >
              Start a project →
            </button>
            <button
              type="button"
              onClick={onOpenImmersive}
              className="rounded-full border border-neutral-300 bg-white/50 px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-neutral-700 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
            >
              Open current immersive →
            </button>
          </div>
        </div>
      </div>
    </Chapter>
  );
}

const webAssets: MediaAsset[] = [
  {
    kind: "video",
    src: media.desktopVideo,
    poster: media.desktopPoster,
    label: "desktop walkthrough",
    className: "left-[0%] top-[4%] h-[64%] w-[66%]",
    clipPath: "polygon(0 6%, 100% 0, 94% 92%, 7% 100%)",
  },
  {
    kind: "image",
    src: media.series,
    label: "series system",
    className: "right-[2%] top-[18%] h-[42%] w-[38%]",
    clipPath: "polygon(8% 0, 100% 7%, 91% 100%, 0 88%)",
  },
  {
    kind: "image",
    src: media.forest,
    label: "forest detail",
    className: "left-[34%] bottom-[2%] h-[38%] w-[28%]",
    clipPath: "polygon(9% 0, 100% 8%, 90% 100%, 0 90%)",
  },
];

const questAssets: MediaAsset[] = [
  {
    kind: "video",
    src: media.vrVideo,
    poster: media.vrPoster,
    label: "quest capture",
    className: "right-[0%] top-[2%] h-[68%] w-[62%]",
    clipPath: "polygon(6% 0, 100% 6%, 92% 100%, 0 91%)",
  },
  {
    kind: "image",
    src: media.vrPoster,
    label: "spatial room",
    className: "left-[4%] top-[22%] h-[48%] w-[42%]",
    clipPath: "polygon(0 8%, 94% 0, 100% 88%, 7% 100%)",
  },
  {
    kind: "image",
    src: media.mobile,
    label: "mobile threshold",
    className: "left-[32%] bottom-[1%] h-[38%] w-[24%]",
    clipPath: "polygon(10% 0, 100% 6%, 90% 100%, 0 91%)",
  },
];

const collectorAssets: MediaAsset[] = [
  {
    kind: "image",
    src: media.print,
    label: "print catalog",
    className: "left-[0%] top-[6%] h-[55%] w-[52%]",
    clipPath: "polygon(0 0, 100% 8%, 92% 100%, 6% 92%)",
  },
  {
    kind: "image",
    src: media.ar,
    label: "AR preview",
    className: "right-[0%] top-[12%] h-[52%] w-[47%]",
    clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 90%)",
  },
  {
    kind: "image",
    src: media.mobilePrint,
    label: "mobile collector flow",
    className: "left-[30%] bottom-[2%] h-[40%] w-[28%]",
    clipPath: "polygon(8% 0, 100% 7%, 90% 100%, 0 90%)",
  },
];

export default function SpatialProof({
  drawerOpen = false,
  onOpenProject,
  onCloseProject,
}: PageProps) {
  const navigate = useNavigate();
  const activeId = useActiveSection();

  const goTo = (path: string) => {
    startSpaPageTransition(navigate, path, () => {
      onCloseProject?.();
    });
  };

  const scrollTo = (id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <SpatialNoIndexMeta />
      <Header drawerOpen={drawerOpen} onOpenProject={onOpenProject} onCloseProject={onCloseProject} />

      <PageSurface className="relative min-h-screen overflow-x-hidden bg-[#f0ede6] text-neutral-950">
        <SpatialAtmosphere />
        <SpatialRail activeId={activeId} onSelect={scrollTo} />

        <main className="relative z-10">
          <ThresholdScene onOpenImmersive={() => goTo("/immersive/whisper")} />

          <UnfoldScene />

          <MediaScene
            id="web"
            eyebrow="Scene 01 / Web exhibition"
            title="The archive becomes a public cinematic surface."
            text="The website is the first layer of the spatial system: a slow editorial threshold, series navigation, collector context, and artwork-first rhythm."
            assets={webAssets}
          />

          <MediaScene
            id="quest"
            eyebrow="Scene 02 / Quest proof"
            title="The same archive becomes a room."
            text="Quest capture turns the exhibition into spatial proof: scale, orientation, presence, and embodied navigation become part of the case."
            assets={questAssets}
            reverse
          />

          <MediaScene
            id="collector"
            eyebrow="Scene 03 / Print + AR continuation"
            title="The collector layer continues beyond the screen."
            text="Print catalog, artwork details, mobile surfaces, and AR preview connect the cinematic website to physical presentation and future collector logic."
            assets={collectorAssets}
          />

          <GrammarScene />

          <ClosingScene onOpenProject={onOpenProject} onOpenImmersive={() => goTo("/immersive/whisper")} />
        </main>
      </PageSurface>
    </>
  );
}
