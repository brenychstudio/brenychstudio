import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { externalProfiles } from "./profile/ExternalProfileLinks";

type SiteFooterV2Props = {
  onOpenProject?: () => void;
  variant?: FooterVariant;
};

type FooterLink = {
  label: string;
  to: string;
};

type FooterExternalLink = {
  label: string;
  href: string;
};

type FooterVariant = "living" | "evidence" | "immersive" | "practice" | "studio";

type FooterCopy = {
  headline: string;
  description: string;
  signal: string;
  intake: string;
  studioLine: string;
  bottomLine: string;
};

const navigationLinks: FooterLink[] = [
  { label: "Home", to: "/" },
  { label: "Work", to: "/work" },
  { label: "Immersive", to: "/immersive" },
  { label: "Offer", to: "/offer" },
  { label: "About", to: "/about" },
];

const systemLinks: FooterLink[] = [
  { label: "Living Systems", to: "/" },
  { label: "Evidence Atlas", to: "/work" },
  { label: "Immersive Interfaces", to: "/immersive" },
  { label: "Practice Model", to: "/offer" },
];

const legalLinks: FooterLink[] = [
  { label: "Privacy", to: "/privacy" },
  { label: "Legal", to: "/legal" },
];

const profileLinks: FooterExternalLink[] = externalProfiles.map(({ label, href }) => ({
  label,
  href,
}));

const CONTACT_EMAIL = "info@brenych.com";

const footerCopyByVariant: Record<FooterVariant, FooterCopy> = {
  living: {
    headline: "If your project needs more than a website, start with the system.",
    description:
      "Brenych Studio builds premium websites, product surfaces, multilingual systems, immersive interface prototypes, and creative front-end systems where visual direction, content, motion, and technical structure work as one environment.",
    signal: "studio system",
    intake: "route ready",
    studioLine: "Interface systems for premium web, immersive experiences, and product surfaces.",
    bottomLine: "Built as a living interface system.",
  },
  evidence: {
    headline: "If the work needs trust, make the evidence visible.",
    description:
      "Evidence-led websites and product surfaces turn proof, case logic, references, and outcomes into a clear interface architecture that people can scan, understand, and believe.",
    signal: "proof layer",
    intake: "case route ready",
    studioLine: "Evidence systems for premium work, proof archives, and high-trust digital surfaces.",
    bottomLine: "Built as a proof-driven interface system.",
  },
  immersive: {
    headline: "Build the next room as an interface.",
    description:
      "The immersive practice is ready for premium launches, cultural archives, collector systems, spatial pitch pages, and WebXR-ready prototypes, using motion, atmosphere, media, sound, and technical structure as one field.",
    signal: "spatial layer",
    intake: "chamber ready",
    studioLine: "Spatial interface systems for immersive experiences, archives, and experimental web.",
    bottomLine: "Built as a spatial interface system.",
  },
  practice: {
    headline: "If the offer needs clarity, build the route before the page.",
    description:
      "The practice model shapes commercial direction, visual hierarchy, content rhythm, motion behavior, and front-end structure into a launch-ready system with a clear next step.",
    signal: "offer system",
    intake: "project route ready",
    studioLine: "Commercial interface systems for premium offers, launches, and product surfaces.",
    bottomLine: "Built as a commercial interface system.",
  },
  studio: {
    headline: "If the project needs more than a website, start with the system.",
    description:
      "Brenych Studio is an authorial creative development practice for premium web, product surfaces, immersive interface systems, and front-end architecture where visual direction, content, motion, and technical structure work as one environment.",
    signal: "studio position",
    intake: "authorial route ready",
    studioLine: "Authorial interface systems for premium web, product surfaces, and immersive digital experiences.",
    bottomLine: "Built as an authorial interface system.",
  },
};

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-400">
        {title}
      </div>
      <div className="mt-5 grid gap-3">
        {links.map((link) => (
          <Link
            key={`${title}-${link.to}-${link.label}`}
            to={link.to}
            className="group inline-flex w-fit items-center gap-2 text-[14px] leading-none text-neutral-700 transition hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2"
          >
            <span className="h-px w-0 bg-neutral-950 transition-all duration-300 group-hover:w-5" />
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function FooterExternalColumn({
  title,
  links,
}: {
  title: string;
  links: FooterExternalLink[];
}) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-400">
        {title}
      </div>
      <div className="mt-5 grid gap-3">
        {links.map((link) => (
          <a
            key={`${title}-${link.href}-${link.label}`}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex w-fit items-center gap-2 text-[14px] leading-none text-neutral-700 transition hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2"
          >
            <span className="h-px w-0 bg-neutral-950 transition-all duration-300 group-hover:w-5" />
            <span>{link.label}</span>
            <span className="text-neutral-400 transition group-hover:text-neutral-700">-&gt;</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function SiteFooterV2({ onOpenProject, variant = "living" }: SiteFooterV2Props) {
  const reduceMotion = useReducedMotion();
  const copy = footerCopyByVariant[variant];

  return (
    <motion.footer
      data-header-scene="footer-closing"
      className="relative z-10 overflow-hidden border-t border-neutral-950/12 text-neutral-950"
      initial={reduceMotion ? undefined : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_17%_12%,rgba(255,255,255,0.72),transparent_32%),radial-gradient(circle_at_82%_35%,rgba(120,120,120,0.12),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.48),rgba(244,242,236,0.42))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(15,15,15,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(15,15,15,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-55" />
      <div className="pointer-events-none absolute left-[7vw] top-16 h-[38rem] w-[38rem] rounded-full border border-neutral-950/[0.055]" />
      <div className="pointer-events-none absolute bottom-10 right-[9vw] h-px w-[38vw] rotate-[-7deg] bg-gradient-to-r from-transparent via-neutral-950/22 to-transparent" />

      <div className="relative mx-auto w-[min(94vw,1640px)] py-14 sm:py-18 lg:py-20">
        <div className="grid gap-10 pb-12 lg:grid-cols-[minmax(0,0.68fr)_minmax(20rem,0.32fr)] lg:items-end">
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 22 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.34 }}
            transition={{ duration: 0.74, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500"
              initial={reduceMotion ? undefined : { opacity: 0, x: -14 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.62, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <span>Closing signal</span>
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
            </motion.div>
            <motion.h2
              className="mt-6 max-w-[13ch] text-[52px] font-normal leading-[0.88] tracking-[-0.065em] text-neutral-950 sm:text-[82px] lg:text-[104px]"
              initial={reduceMotion ? undefined : { opacity: 0, y: 26, filter: "blur(8px)" }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.34 }}
              transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              {copy.headline}
            </motion.h2>
            <motion.p
              className="mt-8 max-w-[54rem] text-[16px] leading-8 text-neutral-600 sm:text-[18px] sm:leading-9"
              initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.74, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {copy.description}
            </motion.p>
          </motion.div>

          <motion.div
            className="border-y border-neutral-950/14 py-6"
            initial={reduceMotion ? undefined : { opacity: 0, y: 22 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.42 }}
            transition={{ duration: 0.72, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-6 grid gap-3 text-[10px] uppercase tracking-[0.2em] text-neutral-400">
              <div className="flex items-center justify-between gap-5">
                <span>Studio signal</span>
                <span className="text-neutral-950">{copy.signal}</span>
              </div>
              <div className="h-px bg-gradient-to-r from-neutral-950/42 via-neutral-950/14 to-transparent" />
              <div className="flex items-center justify-between gap-5">
                <span>Project intake</span>
                <span className="text-neutral-950">{copy.intake}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenProject}
              className="group inline-flex min-h-12 w-full items-center justify-between rounded-full border border-neutral-950 bg-neutral-950 px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_22px_64px_rgba(17,17,17,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2"
            >
              <span>Start a project</span>
              <span className="transition duration-300 group-hover:translate-x-1">-&gt;</span>
            </button>
          </motion.div>
        </div>

        <div className="grid gap-10 border-y border-neutral-950/[0.08] py-10 sm:grid-cols-2 lg:grid-cols-[1.08fr_0.62fr_0.78fr_0.62fr_0.7fr] lg:py-12">
          <div>
            <div className="text-[13px] font-semibold uppercase tracking-[0.18em] text-neutral-950">
              BRENYCH STUDIO
            </div>
            <p className="mt-5 max-w-[22rem] text-[14px] leading-7 text-neutral-600">
              {copy.studioLine}
            </p>
          </div>

          <FooterColumn title="Navigation" links={navigationLinks} />
          <FooterColumn title="Systems" links={systemLinks} />
          <FooterExternalColumn title="Profiles" links={profileLinks} />

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-400">
              Contact
            </div>
            <div className="mt-5 grid gap-3">
              <button
                type="button"
                onClick={onOpenProject}
                className="group inline-flex w-fit items-center gap-2 text-left text-[14px] leading-none text-neutral-700 transition hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2"
              >
                <span className="h-px w-0 bg-neutral-950 transition-all duration-300 group-hover:w-5" />
                <span>Start a project</span>
              </button>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group inline-flex w-fit items-center gap-2 text-[14px] leading-none text-neutral-700 transition hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2"
              >
                <span className="h-px w-0 bg-neutral-950 transition-all duration-300 group-hover:w-5" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-7 text-[11px] uppercase tracking-[0.16em] text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
          <div>&copy; 2026 Brenych Studio</div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="transition hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div>{copy.bottomLine}</div>
        </div>
      </div>
    </motion.footer>
  );
}
