import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useSound } from "../stage/audio/useSound";
import { useI18n } from "../i18n";

type Props = {
  open: boolean;
  onClose: () => void;
};

type ProjectDirection =
  | "available-system"
  | "premium-website"
  | "product-surface"
  | "multilingual-system"
  | "immersive-prototype"
  | "creative-technology"
  | "not-sure";

type ProjectSignal =
  | "specific-case"
  | "new-launch"
  | "existing-offer"
  | "product-demo"
  | "portfolio-brand"
  | "culture-archive-exhibition"
  | "hospitality-advisory-real-estate"
  | "not-sure";

type DirectionOption = {
  value: ProjectDirection;
  label: string;
  helper: string;
  readout: string;
  firstFormat: string;
  nextStep: string;
  tags: string[];
};

type SignalOption = {
  value: ProjectSignal;
  label: string;
  helper: string;
};

const CONTACT_EMAIL = "info@brenych.com";

const projectDirections: DirectionOption[] = [
  {
    value: "available-system",
    label: "Adapt an available system",
    helper: "Commissioned adaptation of a studio foundation",
    readout:
      "Start from an authored Brenych Studio concept and adapt it into a production-ready client system.",
    firstFormat: "Available system adaptation",
    nextStep: "Send the case you like, brand context, market, content state, and timeline.",
    tags: ["Foundation", "Adaptation", "Commission"],
  },
  {
    value: "premium-website",
    label: "Premium website",
    helper: "Editorial / high-trust commercial surface",
    readout: "A precise commercial surface with strong offer, trust, and conversion logic.",
    firstFormat: "Landing system or premium micro-site",
    nextStep: "Send the offer, audience, current page, and launch timing.",
    tags: ["Offer", "Trust", "Launch"],
  },
  {
    value: "product-surface",
    label: "Product surface",
    helper: "Product, service, or demo interface",
    readout: "A product-facing layer that makes a service, demo, workflow, or product idea easier to understand.",
    firstFormat: "Product surface or demo interface",
    nextStep: "Send the product context, key user action, and what needs to be proven.",
    tags: ["Product", "Demo", "UX"],
  },
  {
    value: "multilingual-system",
    label: "Multilingual system",
    helper: "International presentation layer",
    readout: "A structured surface for brands, offers, or content that needs to work across languages.",
    firstFormat: "Multilingual site architecture",
    nextStep: "Send the languages, core pages, content state, and regional priorities.",
    tags: ["Language", "Structure", "Scale"],
  },
  {
    value: "immersive-prototype",
    label: "Immersive prototype",
    helper: "Interactive / spatial / experimental proof",
    readout: "A cinematic, spatial, or interaction-led prototype for presentation, mood, and proof.",
    firstFormat: "Immersive prototype or motion surface",
    nextStep: "Send the world, reference material, interaction idea, and intended audience.",
    tags: ["Motion", "Spatial", "Proof"],
  },
  {
    value: "creative-technology",
    label: "Creative technology direction",
    helper: "Concept, system, prototype strategy",
    readout: "A technical and visual direction for unusual web, motion, spatial, or generative work.",
    firstFormat: "Creative technology route",
    nextStep: "Send the concept, constraints, references, and what the first prototype should clarify.",
    tags: ["Concept", "System", "Prototype"],
  },
  {
    value: "not-sure",
    label: "Not sure yet",
    helper: "I'll help define the route",
    readout: "A short note is enough. The first response can define the cleanest route before scope.",
    firstFormat: "Route definition before scope",
    nextStep: "Send a short note about the offer, product, audience, timeline, or current challenge.",
    tags: ["Open", "Scope", "Signal"],
  },
];

const projectSignals: SignalOption[] = [
  {
    value: "specific-case",
    label: "I like a specific case",
    helper: "Adapting from a selected system direction.",
  },
  {
    value: "new-launch",
    label: "New launch",
    helper: "Preparing the first public surface.",
  },
  {
    value: "existing-offer",
    label: "Existing offer",
    helper: "Making an offer clearer or more premium.",
  },
  {
    value: "product-demo",
    label: "Product demo",
    helper: "Explaining, showing, or selling a product experience.",
  },
  {
    value: "portfolio-brand",
    label: "Personal brand / portfolio",
    helper: "A higher-trust personal, expert, or studio presence.",
  },
  {
    value: "culture-archive-exhibition",
    label: "Culture / archive / exhibition",
    helper: "A careful digital layer for cultural material or research.",
  },
  {
    value: "hospitality-advisory-real-estate",
    label: "Hospitality / advisory / real estate",
    helper: "A premium service or place-based surface.",
  },
  {
    value: "not-sure",
    label: "Not sure yet",
    helper: "The note can define the route.",
  },
];

const mobileDirectionOptions: ProjectDirection[] = [
  "premium-website",
  "product-surface",
  "multilingual-system",
  "immersive-prototype",
  "available-system",
  "not-sure",
];

const mobileSignalOptions: ProjectSignal[] = [
  "new-launch",
  "existing-offer",
  "product-demo",
  "specific-case",
  "not-sure",
];

const mobileDirectionLabels: Partial<Record<ProjectDirection, string>> = {
  "available-system": "Adapt system",
  "premium-website": "Website",
  "product-surface": "Product",
  "multilingual-system": "Multilingual",
  "immersive-prototype": "Immersive",
  "not-sure": "Not sure",
};

const mobileSignalLabels: Partial<Record<ProjectSignal, string>> = {
  "new-launch": "New launch",
  "existing-offer": "Improve",
  "product-demo": "Demo",
  "specific-case": "Specific case",
  "not-sure": "Not sure",
};

const desktopDirectionLabels: Partial<Record<ProjectDirection, string>> = {
  "available-system": "Adapt system",
  "premium-website": "Website",
  "product-surface": "Product surface",
  "multilingual-system": "Multilingual",
  "immersive-prototype": "Immersive",
  "creative-technology": "Creative tech",
  "not-sure": "Not sure",
};

function useIsMobileSheet() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 639px)").matches : false,
  );

  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(query.matches);

    update();
    query.addEventListener("change", update);

    return () => {
      query.removeEventListener("change", update);
    };
  }, []);

  return isMobile;
}

function getDirection(value: ProjectDirection) {
  return projectDirections.find((option) => option.value === value) ?? projectDirections[0];
}

function getSignal(value: ProjectSignal) {
  return projectSignals.find((option) => option.value === value) ?? projectSignals[0];
}

export default function ProjectDrawerV2({ open, onClose }: Props) {
  const { playRole } = useSound();
  const { t } = useI18n();
  const isMobile = useIsMobileSheet();
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  const [selectedDirection, setSelectedDirection] =
    useState<ProjectDirection>("not-sure");
  const [selectedSignal, setSelectedSignal] = useState<ProjectSignal>("not-sure");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const direction = getDirection(selectedDirection);
  const signal = getSignal(selectedSignal);
  const projectNotePlaceholder =
    selectedDirection === "available-system" || selectedSignal === "specific-case"
      ? "Tell me which available system you like and what you want to adapt it for: brand, product, audience, market, timeline, or required features."
      : "Project, offer, audience, timeline, current challenge...";

  const hasInteraction =
    selectedDirection !== "not-sure" ||
    selectedSignal !== "not-sure" ||
    name.trim().length > 0 ||
    email.trim().length > 0 ||
    message.trim().length > 0;

  useEffect(() => {
    if (!open) return;

    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    playRole("open");
  }, [open, playRole]);

  useEffect(() => {
    if (!open) return;

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [open]);

  const closeDrawer = useCallback(() => {
    playRole("close");
    onClose();

    window.setTimeout(() => {
      lastFocusedRef.current?.focus?.();
    }, 0);
  }, [onClose, playRole]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeDrawer, open]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const mailtoHref = useMemo(() => {
    const subject = `Project signal${name.trim() ? ` - ${name.trim()}` : ""}`;
    const body = [
      "Project signal",
      "",
      `Direction: ${direction.label}`,
      `Suggested first format: ${direction.firstFormat}`,
      `Current need: ${signal.label}`,
      `Name / company: ${name.trim() || "-"}`,
      `Email: ${email.trim() || "-"}`,
      "",
      "Project note:",
      message.trim() || "-",
      "",
      "Sent from Project Signal Drawer V2",
    ].join("\n");

    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [direction.firstFormat, direction.label, email, message, name, signal.label]);

  async function copyEmail() {
    try {
      await navigator.clipboard?.writeText(CONTACT_EMAIL);
      playRole("success");
      setCopiedEmail(true);

      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopiedEmail(false), 1400);
    } catch {
      playRole("blocked");
      setCopiedEmail(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    playRole(hasInteraction ? "success" : "blocked");
    window.location.href = mailtoHref;
  }

  const panelInitial = isMobile ? { y: "100%", opacity: 1 } : { x: "100%", opacity: 1 };
  const panelAnimate = isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 };
  const panelExit = isMobile ? { y: "100%", opacity: 1 } : { x: "100%", opacity: 1 };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="project-drawer-v2"
          className="fixed inset-0 z-[90] overflow-hidden bg-neutral-950/[0.085]"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDrawer();
          }}
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={isMobile ? "project-signal-title-mobile" : "project-signal-title"}
            className="fixed bottom-0 left-0 right-0 flex h-[96svh] max-h-[96svh] max-w-full flex-col overflow-hidden rounded-t-[8px] border-t border-neutral-300/70 bg-[#f5f2eb] text-neutral-950 shadow-[0_-18px_64px_rgba(0,0,0,0.14)] sm:bottom-auto sm:left-auto sm:top-0 sm:h-svh sm:max-h-none sm:w-[min(92vw,540px)] sm:rounded-none sm:border-l sm:border-t-0 sm:shadow-[-24px_0_74px_rgba(0,0,0,0.12)]"
            initial={panelInitial}
            animate={{
              ...panelAnimate,
              transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
            }}
            exit={{
              ...panelExit,
              transition: { duration: 0.34, ease: [0.4, 0, 0.2, 1] },
            }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.36]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(10,10,10,0.032) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.032) 1px, transparent 1px)",
                backgroundSize: "42px 42px",
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.96),rgba(255,255,255,0.28)_35%,rgba(245,242,235,0)_70%)]" />

            <div className="relative flex min-h-0 flex-1 flex-col">
              <form onSubmit={onSubmit} className="relative flex min-h-0 flex-1 flex-col sm:hidden">
                <header className="shrink-0 px-4 pb-3 pt-3">
                  <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-neutral-950/16" />
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        Project signal
                      </p>
                      <h2
                        id="project-signal-title-mobile"
                        className="mt-1 text-[34px] font-normal leading-none tracking-normal text-neutral-950"
                      >
                        {t.drawer.title}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onMouseEnter={() => playRole("hover")}
                      onClick={closeDrawer}
                      className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-neutral-300/80 bg-white/72 px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-700 shadow-[0_8px_20px_rgba(0,0,0,0.045)] transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f2eb]"
                    >
                      {t.drawer.close}
                    </button>
                  </div>

                  <p className="mt-3 text-[13px] leading-6 text-neutral-600">
                    Pick a direction, add a short note, and I'll reply with the cleanest next step.
                  </p>

                </header>

                <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-5 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <section>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        What are we building?
                      </h3>
                      <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-neutral-400">01</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {mobileDirectionOptions.map((value) => {
                        const option = getDirection(value);
                        const active = selectedDirection === value;

                        return (
                          <button
                            key={value}
                            type="button"
                            aria-pressed={active}
                            onMouseEnter={() => playRole("hover")}
                            onClick={() => {
                              playRole("select");
                              setSelectedDirection(value);
                            }}
                            className={[
                              "min-h-[4.25rem] rounded-[18px] border px-3 py-3 text-left transition active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f2eb]",
                              active
                                ? "border-neutral-950 bg-neutral-950 text-white shadow-[0_16px_34px_rgba(0,0,0,0.13)]"
                                : "border-neutral-300/70 bg-white/46 text-neutral-800 shadow-[0_8px_24px_rgba(0,0,0,0.035)]",
                            ].join(" ")}
                          >
                            <span className="block text-[12px] font-semibold leading-4">
                              {mobileDirectionLabels[value] ?? option.label}
                            </span>
                            <span className={["mt-1.5 block text-[10px] leading-4", active ? "text-white/58" : "text-neutral-500"].join(" ")}>
                              {option.helper}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        Current need
                      </h3>
                      <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-neutral-400">02</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {mobileSignalOptions.map((value) => {
                        const option = getSignal(value);
                        const active = selectedSignal === value;

                        return (
                          <button
                            key={value}
                            type="button"
                            aria-pressed={active}
                            onMouseEnter={() => playRole("hover")}
                            onClick={() => {
                              playRole("select");
                              setSelectedSignal(value);
                            }}
                            className={[
                              "min-h-10 rounded-full border px-4 text-[10px] font-semibold uppercase tracking-[0.11em] transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f2eb]",
                              active
                                ? "border-neutral-950 bg-neutral-950 text-white"
                                : "border-neutral-300/70 bg-white/50 text-neutral-600",
                            ].join(" ")}
                          >
                            {mobileSignalLabels[value] ?? option.label}
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        Short note
                      </h3>
                      <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-neutral-400">03</span>
                    </div>

                    <textarea
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      rows={4}
                      placeholder="Offer, audience, timeline, current page, or what should become clearer..."
                      className="min-h-[116px] w-full resize-none rounded-[20px] border border-neutral-300/70 bg-white/48 px-4 py-3 text-[14px] leading-6 text-neutral-900 outline-none shadow-[0_10px_26px_rgba(0,0,0,0.035)] transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-0"
                    />
                  </section>

                  <section className="mt-4 grid gap-2">
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      type="email"
                      inputMode="email"
                      placeholder="Email for reply"
                      className="h-12 rounded-[16px] border border-neutral-300/70 bg-white/54 px-4 text-[14px] text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-0"
                    />
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Name / company, optional"
                      className="h-12 rounded-[16px] border border-neutral-300/70 bg-white/40 px-4 text-[14px] text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-0"
                    />
                  </section>
                </div>

                <footer className="shrink-0 border-t border-neutral-300/70 bg-[#f5f2eb]/98 px-4 pb-[max(0.85rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-18px_42px_rgba(245,242,235,0.9)]">
                  <button
                    type="submit"
                    onMouseEnter={() => playRole("hover")}
                    className="flex h-12 w-full items-center justify-between rounded-full bg-neutral-950 px-5 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-white shadow-[0_16px_36px_rgba(0,0,0,0.14)] transition active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f2eb]"
                  >
                    <span>Send project signal</span>
                    <span aria-hidden>{"->"}</span>
                  </button>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <a
                      href={mailtoHref}
                      onMouseEnter={() => playRole("hover")}
                      onClick={() => playRole("success")}
                      className="flex h-10 items-center justify-center rounded-full border border-neutral-300/80 bg-white/46 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-700 transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f2eb]"
                    >
                      Email directly
                    </a>
                    <button
                      type="button"
                      onMouseEnter={() => playRole("hover")}
                      onClick={copyEmail}
                      className="flex h-10 items-center justify-center rounded-full border border-neutral-300/80 bg-white/46 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-700 transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f2eb]"
                    >
                      {copiedEmail ? "Copied" : "Copy email"}
                    </button>
                  </div>
                </footer>
              </form>

              <header className="hidden shrink-0 px-4 pb-3 pt-4 sm:block sm:px-7 sm:pb-5 sm:pt-7">
                <div className="flex items-start justify-between gap-3 sm:gap-5">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 sm:tracking-[0.3em]">
                      Project signal
                    </p>
                    <h2
                      id="project-signal-title"
                      className="mt-2 text-[34px] font-normal leading-[0.98] tracking-normal text-neutral-950 sm:mt-3 sm:text-[50px]"
                    >
                      {t.drawer.title}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-neutral-300/80 bg-white/60 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-700 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-neutral-500 hover:bg-white/86 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f2eb] sm:px-4 sm:tracking-[0.22em]"
                  >
                    {t.drawer.close}
                  </button>
                </div>

                <p className="mt-4 max-w-[39rem] text-[13px] leading-6 text-neutral-600 sm:mt-5 sm:text-[14px]">
                  Tell me what you want to build. I'll respond with the best next
                  format: landing page, micro-site, product surface, immersive
                  prototype, or creative technology direction.
                </p>

                <div className="mt-4 border-t border-neutral-300/70 pt-3 sm:mt-5">
                  <div className="grid grid-cols-2 gap-3 text-[9px] uppercase tracking-[0.14em] text-neutral-500 sm:gap-4 sm:text-[10px] sm:tracking-[0.2em]">
                    <div>
                      <span className="block text-neutral-400">01 / Signal intake</span>
                      <span className="mt-1 block text-neutral-800">Direction + need</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-neutral-400">Response</span>
                      <span className="mt-1 block text-neutral-800">Next format + route</span>
                    </div>
                  </div>
                </div>
              </header>

              <form onSubmit={onSubmit} className="relative hidden min-h-0 flex-1 flex-col sm:flex">
                <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-7 pb-6 pt-3 [scrollbar-color:rgba(0,0,0,0.22)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-950/20 [&::-webkit-scrollbar-track]:bg-transparent">
                  <section className="border-t border-neutral-300/70 pt-5">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                        What are we building?
                      </h3>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">01</span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                      {projectDirections.map((option) => {
                        const active = selectedDirection === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            aria-pressed={active}
                            onMouseEnter={() => playRole("hover")}
                            onClick={() => {
                              playRole("select");
                              setSelectedDirection(option.value);
                            }}
                            className={[
                              "min-h-[5.25rem] rounded-[18px] border px-4 py-3 text-left transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f2eb]",
                              active
                                ? "border-neutral-950 bg-neutral-950 text-white shadow-[0_18px_40px_rgba(0,0,0,0.13)]"
                                : "border-neutral-300/70 bg-white/42 text-neutral-800 shadow-[0_8px_24px_rgba(0,0,0,0.035)] hover:border-neutral-500 hover:bg-white/70",
                            ].join(" ")}
                          >
                            <span className="block text-[13px] font-semibold leading-4">
                              {desktopDirectionLabels[option.value] ?? option.label}
                            </span>
                            <span className={["mt-2 block text-[11px] leading-4", active ? "text-white/58" : "text-neutral-500"].join(" ")}>
                              {option.helper}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section className="mt-6">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                        Current need
                      </h3>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">02</span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {mobileSignalOptions.map((value) => {
                        const option = getSignal(value);
                        const active = selectedSignal === value;

                        return (
                          <button
                            key={value}
                            type="button"
                            aria-pressed={active}
                            onMouseEnter={() => playRole("hover")}
                            onClick={() => {
                              playRole("select");
                              setSelectedSignal(value);
                            }}
                            className={[
                              "min-h-10 rounded-full border px-4 text-[10px] font-semibold uppercase tracking-[0.13em] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f2eb]",
                              active
                                ? "border-neutral-950 bg-neutral-950 text-white shadow-[0_12px_26px_rgba(0,0,0,0.12)]"
                                : "border-neutral-300/70 bg-white/46 text-neutral-600 hover:border-neutral-500 hover:bg-white/72",
                            ].join(" ")}
                          >
                            {mobileSignalLabels[value] ?? option.label}
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section className="mt-6">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={`${direction.value}-${signal.value}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
                        }}
                        exit={{
                          opacity: 0,
                          y: -4,
                          transition: { duration: 0.14, ease: [0.4, 0, 0.2, 1] },
                        }}
                        className="rounded-[20px] border border-neutral-300/70 bg-white/38 p-4 shadow-[0_12px_34px_rgba(0,0,0,0.035)]"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                            Route preview
                          </p>
                          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">Live</span>
                        </div>

                        <div className="mt-3 grid grid-cols-[1fr_auto] gap-4">
                          <div className="min-w-0">
                            <p className="text-[24px] leading-[1.02] text-neutral-950">
                              {desktopDirectionLabels[direction.value] ?? direction.label}
                            </p>
                            <p className="mt-2 text-[12px] leading-5 text-neutral-600">
                              {direction.firstFormat}
                            </p>
                          </div>
                          <div className="self-start rounded-full border border-neutral-300/80 bg-white/55 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                            {mobileSignalLabels[signal.value] ?? signal.label}
                          </div>
                        </div>

                        <p className="mt-4 border-t border-neutral-300/70 pt-3 text-[13px] leading-6 text-neutral-600">
                          {direction.nextStep}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </section>

                  <section className="mt-6 border-t border-neutral-300/70 pt-5">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                        Project note
                      </h3>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">03</span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Name / company"
                        className="h-12 rounded-[16px] border border-neutral-300/70 bg-white/48 px-4 text-[14px] text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-0"
                      />
                      <input
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        type="email"
                        inputMode="email"
                        placeholder="Email for reply"
                        className="h-12 rounded-[16px] border border-neutral-300/70 bg-white/48 px-4 text-[14px] text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-0"
                      />
                    </div>

                    <textarea
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      rows={5}
                      placeholder={projectNotePlaceholder}
                      className="mt-3 min-h-[132px] w-full resize-none rounded-[20px] border border-neutral-300/70 bg-white/44 px-4 py-3 text-[14px] leading-6 text-neutral-900 outline-none shadow-[0_10px_26px_rgba(0,0,0,0.025)] transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-0"
                    />
                  </section>
                </div>

                <footer className="shrink-0 border-t border-neutral-300/70 bg-[#f5f2eb]/98 px-7 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-18px_42px_rgba(245,242,235,0.92)]">
                  <button
                    type="submit"
                    onMouseEnter={() => playRole("hover")}
                    className={[
                      "flex h-12 w-full items-center justify-between rounded-full border px-5 text-left text-[11px] font-semibold uppercase tracking-[0.18em] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f2eb]",
                      hasInteraction
                        ? "border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800"
                        : "border-neutral-950/80 bg-neutral-950/88 text-white/86 hover:bg-neutral-950",
                    ].join(" ")}
                  >
                    <span>Send project signal</span>
                    <span aria-hidden>{"->"}</span>
                  </button>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <a
                      href={mailtoHref}
                      onMouseEnter={() => playRole("hover")}
                      onClick={() => playRole("success")}
                      className="flex h-10 items-center justify-center rounded-full border border-neutral-300/80 bg-white/42 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-700 transition duration-300 hover:border-neutral-700 hover:bg-white/76 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f2eb]"
                    >
                      Email directly
                    </a>
                    <button
                      type="button"
                      onClick={copyEmail}
                      onMouseEnter={() => playRole("hover")}
                      className="flex h-10 items-center justify-center rounded-full border border-neutral-300/80 bg-white/42 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-700 transition duration-300 hover:border-neutral-700 hover:bg-white/76 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f2eb]"
                    >
                      {copiedEmail ? "Email copied" : "Copy email"}
                    </button>
                  </div>
                </footer>
              </form>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
