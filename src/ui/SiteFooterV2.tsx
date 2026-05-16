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

type FooterVariant = "living" | "evidence" | "immersive" | "practice" | "studio" | "case";

type FooterCopy = {
  headline: string;
  signal: string;
  intake: string;
  nextStep: string;
  bottomLine: string;
};

const routeLinks: FooterLink[] = [
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

const profileLinks: FooterExternalLink[] = externalProfiles
  .filter(({ label }) => label !== "Brenych.com")
  .map(({ label, href }) => ({
    label,
    href,
  }));

const footerCopyByVariant: Record<FooterVariant, FooterCopy> = {
  living: {
    headline: "Start with the system.",
    signal: "interface systems",
    intake: "available",
    nextStep: "start a project",
    bottomLine: "Built as a living interface system.",
  },
  evidence: {
    headline: "Move from proof to project.",
    signal: "evidence layer",
    intake: "available",
    nextStep: "start a project",
    bottomLine: "Built as a proof-driven interface system.",
  },
  immersive: {
    headline: "Build the next room as an interface.",
    signal: "spatial systems",
    intake: "available",
    nextStep: "start a project",
    bottomLine: "Built as a spatial interface system.",
  },
  practice: {
    headline: "Translate the system into an offer.",
    signal: "practice route",
    intake: "available",
    nextStep: "start a project",
    bottomLine: "Built as a commercial interface system.",
  },
  studio: {
    headline: "Start with the method.",
    signal: "studio position",
    intake: "available",
    nextStep: "start a project",
    bottomLine: "Built as an authorial interface system.",
  },
  case: {
    headline: "Evidence becomes project when the fit is right.",
    signal: "evidence layer",
    intake: "available",
    nextStep: "start a project",
    bottomLine: "Interface systems.",
  },
};

function FooterLedgerLinks({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div className="grid gap-2">
      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">{title}</div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {links.map((link) => (
          <Link
            key={`${title}-${link.to}-${link.label}`}
            to={link.to}
            className="text-[12px] uppercase tracking-[0.12em] text-neutral-600 transition hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function SiteFooterV2({ onOpenProject, variant = "living" }: SiteFooterV2Props) {
  const reduceMotion = useReducedMotion();
  const copy = footerCopyByVariant[variant];
  const isCase = variant === "case";

  if (isCase) {
    return (
      <motion.footer
        id="site-footer"
        data-header-scene="footer-closing"
        data-footer-rail-state="closing"
        className="relative z-10 overflow-hidden border-t border-neutral-950/12 text-neutral-950"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_28%,rgba(15,15,15,0.055),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.46),rgba(244,242,236,0.34))]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(15,15,15,0.032)_1px,transparent_1px),linear-gradient(90deg,rgba(15,15,15,0.03)_1px,transparent_1px)] bg-[size:76px_76px] opacity-50" />

        <div className="relative mx-auto w-[min(92vw,1640px)] py-10 sm:py-12 lg:w-[min(94vw,1640px)]">
          <div className="grid gap-8 border-b border-neutral-950/[0.08] pb-8 lg:grid-cols-[0.4fr_0.6fr] lg:items-end">
            <div>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                <span>Closing signal</span>
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-neutral-950"
                  animate={reduceMotion ? undefined : { opacity: [0.34, 1, 0.34], scale: [1, 1.28, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <p className="mt-4 max-w-md text-xl leading-7 text-neutral-700">
                {copy.headline}
              </p>
            </div>

            <div className="border-y border-neutral-950/12 bg-white/18 px-4 py-5 backdrop-blur-sm">
              <div className="grid gap-3 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400 sm:grid-cols-3">
                <div>
                  <span className="block text-neutral-300">Studio signal</span>
                  <span className="mt-2 block text-neutral-950">{copy.signal}</span>
                </div>
                <div>
                  <span className="block text-neutral-300">Project intake</span>
                  <span className="mt-2 block text-neutral-950">{copy.intake}</span>
                </div>
                <div>
                  <span className="block text-neutral-300">Next step</span>
                  <span className="mt-2 block text-neutral-950">{copy.nextStep}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 border-b border-neutral-950/[0.08] py-7 lg:grid-cols-[0.95fr_1.2fr_1fr] lg:items-start">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-neutral-950">BRENYCH STUDIO</div>
              <div className="mt-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                <span>Brenych Studio / Interface Systems</span>
              </div>
            </div>

            <FooterLedgerLinks title="Systems" links={systemLinks} />
            <FooterLedgerLinks title="Routes" links={routeLinks} />
          </div>

          <div className="flex flex-col gap-4 pt-6 text-[10px] uppercase tracking-[0.16em] text-neutral-400 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {profileLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2"
                >
                  {link.label}
                </a>
              ))}
            </div>

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

            <div>&copy; 2026 Brenych Studio</div>
          </div>
        </div>
      </motion.footer>
    );
  }

  return (
    <motion.footer
      id="site-footer"
      data-header-scene="footer-closing"
      data-footer-rail-state="closing"
      className="relative z-10 overflow-hidden border-t border-neutral-950/12 text-neutral-950"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(255,255,255,0.72),transparent_30%),radial-gradient(circle_at_82%_42%,rgba(120,120,120,0.11),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.46),rgba(244,242,236,0.4))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(15,15,15,0.038)_1px,transparent_1px),linear-gradient(90deg,rgba(15,15,15,0.035)_1px,transparent_1px)] bg-[size:76px_76px] opacity-55" />
      <div className="pointer-events-none absolute left-[8vw] top-8 h-[30rem] w-[30rem] rounded-full border border-neutral-950/[0.05]" />
      <div className="pointer-events-none absolute bottom-12 right-[8vw] h-px w-[46vw] rotate-[-6deg] bg-gradient-to-r from-transparent via-neutral-950/20 to-transparent" />

      <div className="relative mx-auto w-[min(92vw,1640px)] py-10 sm:py-12 lg:w-[min(94vw,1640px)] lg:py-14">
        <div className="grid gap-8 border-b border-neutral-950/[0.08] pb-9 lg:grid-cols-[minmax(0,0.62fr)_minmax(20rem,0.38fr)] lg:items-end">
          <div>
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500">
              <span>Closing signal</span>
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
            </div>
            <h2 className="mt-5 max-w-[12ch] text-[48px] font-normal leading-[0.9] tracking-[-0.06em] text-neutral-950 sm:text-[72px] lg:text-[92px]">
              {copy.headline}
            </h2>
          </div>

          <div className="border-y border-neutral-950/14 bg-white/20 py-5 backdrop-blur-sm">
            <div className="grid gap-3 px-1 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
              <div className="flex items-center justify-between gap-5">
                <span>Studio signal</span>
                <span className="text-neutral-950">{copy.signal}</span>
              </div>
              <div className="h-px bg-gradient-to-r from-neutral-950/40 via-neutral-950/14 to-transparent" />
              <div className="flex items-center justify-between gap-5">
                <span>Project intake</span>
                <span className="text-neutral-950">{copy.intake}</span>
              </div>
              <div className="h-px bg-gradient-to-r from-neutral-950/40 via-neutral-950/14 to-transparent" />
              <div className="flex items-center justify-between gap-5">
                <span>Next step</span>
                <span className="text-neutral-950">{copy.nextStep}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenProject}
              className="group mt-6 inline-flex min-h-12 w-full items-center justify-between rounded-full border border-neutral-950 bg-neutral-950 px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_22px_64px_rgba(17,17,17,0.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2"
            >
              <span>Start a project</span>
              <span className="transition duration-300 group-hover:translate-x-1">-&gt;</span>
            </button>
          </div>
        </div>

        <div className="grid gap-6 border-b border-neutral-950/[0.08] py-7 lg:grid-cols-[0.95fr_1.2fr_1fr] lg:items-start">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-neutral-950">BRENYCH STUDIO</div>
            <div className="mt-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-neutral-950"
                animate={reduceMotion ? undefined : { opacity: [0.34, 1, 0.34], scale: [1, 1.28, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <span>{copy.bottomLine}</span>
            </div>
          </div>

          <FooterLedgerLinks title="Systems" links={systemLinks} />
          <FooterLedgerLinks title="Routes" links={routeLinks} />
        </div>

        <div className="flex flex-col gap-4 pt-6 text-[10px] uppercase tracking-[0.16em] text-neutral-400 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {profileLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2"
              >
                {link.label}
              </a>
            ))}
          </div>

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

          <div>&copy; 2026 Brenych Studio</div>
        </div>
      </div>
    </motion.footer>
  );
}
