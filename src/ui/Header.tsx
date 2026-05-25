import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { startSpaPageTransition } from "./pageTransition";
import { availableLocales } from "../i18n";
import { useLocale } from "../store/useLocale";
import { useActiveHeaderScene } from "../hooks/useActiveHeaderScene";
import { useHeaderThemeMorph } from "../hooks/useHeaderThemeMorph";
import { getHeaderMoodForPath, resolveHeaderTheme } from "./header/headerThemeTokens";
import "../styles/header-chameleon.css";

type Props = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
};

type NavItem = {
  id: "home" | "work" | "immersive" | "offer" | "about";
  to: "/" | "/work" | "/immersive" | "/offer" | "/about";
};

const navItemDescriptions: Record<NavItem["id"], string> = {
  home: "Studio signal / opening system",
  work: "Evidence atlas / case systems",
  immersive: "Spatial proof / Web XR field",
  offer: "Project model / service architecture",
  about: "Practice / studio context",
};

const navItems: NavItem[] = [
  { id: "home", to: "/" },
  { id: "work", to: "/work" },
  { id: "immersive", to: "/immersive" },
  { id: "offer", to: "/offer" },
  { id: "about", to: "/about" },
];

export default function Header({
  drawerOpen = false,
  onOpenProject,
  onCloseProject,
}: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { locale, setLocale, t } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const mobileMenuCloseRef = useRef<HTMLButtonElement | null>(null);

  const onHome = location.pathname === "/";
  const activeSceneId = useActiveHeaderScene(location.pathname);
  const routeTheme = useMemo(() => getHeaderMoodForPath(location.pathname), [location.pathname]);
  const headerTheme = useMemo(
    () => resolveHeaderTheme({ routeTheme, activeSceneId }),
    [activeSceneId, routeTheme],
  );

  useHeaderThemeMorph(headerRef, headerTheme, scrolled);

  const activePath = useMemo(() => {
    if (location.pathname === "/") return "/";

    if (location.pathname === "/work" || location.pathname.startsWith("/work/")) {
      return "/work";
    }

    if (location.pathname === "/immersive" || location.pathname.startsWith("/immersive/")) {
      return "/immersive";
    }

    if (location.pathname === "/offer") return "/offer";
    if (location.pathname === "/about") return "/about";

    return "";
  }, [location.pathname]);
  const mobileMenuContext = `${drawerOpen ? "drawer-open" : "drawer-closed"}:${location.pathname}`;
  const mobileMenuContextRef = useRef(mobileMenuContext);

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 12);

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });

    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  useEffect(() => {
    if (mobileMenuContextRef.current === mobileMenuContext) return;

    mobileMenuContextRef.current = mobileMenuContext;
    if (!mobileMenuOpen) return;

    const frame = window.requestAnimationFrame(() => setMobileMenuOpen(false));

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [mobileMenuContext, mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      mobileMenuCloseRef.current?.focus();
    });

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileMenuOpen]);

  const navigateWithTransition = (to: string) => {
    if (location.pathname === to) return;

    startSpaPageTransition(navigate, to, () => {
      onCloseProject?.();
    });
  };

  const onLogo = () => {
    onCloseProject?.();

    if (onHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    startSpaPageTransition(navigate, "/", () => {
      onCloseProject?.();
    });
  };

  const onNav = (to: NavItem["to"]) => {
    setMobileMenuOpen(false);
    navigateWithTransition(to);
  };

  const linkClass = (isActive: boolean) =>
    [
      "group relative inline-flex h-8 items-center gap-2 px-1 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[color:var(--header-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2",
      isActive ? "text-[color:var(--header-text)]" : "text-[color:var(--header-muted)]",
    ].join(" ");

  const onCta = () => {
    setMobileMenuOpen(false);
    if (drawerOpen) onCloseProject?.();
    else onOpenProject?.();
  };

  const navLabels = t.nav;
  const getNavItemLabel = (item: NavItem) =>
    item.id === "home" ? "Home" : navLabels[item.id];

  const mobileRouteTerminal =
    typeof document === "undefined"
      ? null
      : createPortal(
          <AnimatePresence mode="wait">
            {mobileMenuOpen ? (
              <motion.div
                id="mobile-header-menu"
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-route-terminal-title"
                className="fixed inset-0 z-[90] flex items-center justify-center px-4 pb-4 pt-[calc(4.25rem+env(safe-area-inset-top))] md:hidden"
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  closed: { opacity: 0 },
                  open: { opacity: 1 },
                }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.button
                  type="button"
                  aria-label="Close route terminal"
                  className="absolute inset-0 cursor-default"
                  onClick={() => setMobileMenuOpen(false)}
                  variants={{
                    closed: {
                      backgroundColor: "rgba(243, 240, 232, 0)",
                      backdropFilter: "blur(0px)",
                    },
                    open: {
                      backgroundColor: "rgba(243, 240, 232, 0.42)",
                      backdropFilter: "blur(1.5px)",
                    },
                  }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.16),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(18,17,15,0.025))]"
                    variants={{
                      closed: { opacity: 0 },
                      open: { opacity: 1 },
                    }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  />
                </motion.button>

                <motion.div
                  className="relative max-h-[calc(100dvh-5.75rem)] w-full max-w-[27rem] overflow-hidden border border-white/14 bg-[#090908] text-[#f7f3ea] shadow-[0_34px_120px_rgba(18,17,15,0.28)]"
                  variants={{
                    closed: {
                      opacity: 0,
                      y: 16,
                      scale: 0.985,
                      clipPath: "inset(49% 0 49% 0)",
                    },
                    open: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      clipPath: "inset(0 0 0 0)",
                    },
                  }}
                  transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:52px_52px]" />
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                  <div className="pointer-events-none absolute inset-x-5 top-14 h-px bg-white/10" />

                  <div className="relative grid max-h-[calc(100dvh-5.75rem)] gap-3 overflow-y-auto overscroll-contain p-3.5">
                    <div className="grid grid-cols-[1fr_auto] items-start gap-3">
                      <div>
                        <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/42">
                          Route terminal / {String(navItems.length).padStart(2, "0")} paths
                        </div>
                        <h2
                          id="mobile-route-terminal-title"
                          className="mt-1.5 text-[22px] font-normal leading-[0.94] tracking-[-0.035em] text-white"
                        >
                          Select system path.
                        </h2>
                      </div>

                      <button
                        ref={mobileMenuCloseRef}
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="inline-flex min-h-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/70 transition hover:border-white/30 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                      >
                        Close
                      </button>
                    </div>

                    <div className="border-y border-white/12">
                      {navItems.map((item, index) => {
                        const isActive = activePath === item.to;
                        const label = getNavItemLabel(item);

                        return (
                          <motion.button
                            key={item.id}
                            type="button"
                            onClick={() => onNav(item.to)}
                            aria-current={isActive ? "page" : undefined}
                            className={[
                              "group grid w-full grid-cols-[2.1rem_1fr_auto] items-center gap-2.5 border-b border-white/10 px-2 py-2.5 text-left transition last:border-b-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                              isActive
                                ? "bg-white text-neutral-950"
                                : "text-white/72 hover:bg-white/[0.07] hover:text-white",
                            ].join(" ")}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.34, delay: 0.12 + index * 0.045, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <span className={isActive ? "font-mono text-[10px] text-neutral-950/55" : "font-mono text-[10px] text-white/35"}>
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[13px] font-semibold uppercase tracking-[0.14em]">
                                {label}
                              </span>
                              <span className={isActive ? "mt-1 block truncate text-[11px] leading-4 text-neutral-950/62" : "mt-1 block truncate text-[11px] leading-4 text-white/48"}>
                                {navItemDescriptions[item.id]}
                              </span>
                            </span>
                            <span className={isActive ? "font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-950" : "font-mono text-[9px] uppercase tracking-[0.14em] text-white/42 group-hover:text-white/70"}>
                              {isActive ? "Now" : "Open"}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="grid gap-3">
                      <div className="grid grid-cols-[1fr_auto] gap-3 border-y border-white/10 py-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-white/40">
                        <span>Current / {getNavItemLabel(navItems.find((item) => item.to === activePath) ?? navItems[0])}</span>
                        <span>{locale} / signal ready</span>
                      </div>
                      <button
                        type="button"
                        onClick={onCta}
                        className="inline-flex min-h-11 items-center justify-between rounded-full border border-white bg-white px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-950 transition hover:-translate-y-0.5 hover:bg-[#f7f3ea] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                      >
                        <span>{drawerOpen ? "Close project panel" : "Start a project"}</span>
                        <span className="font-mono opacity-55">-&gt;</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body,
        );

  return (
    <>
    <header
      ref={headerRef}
      className={[
        "site-header fixed inset-x-0 top-0 z-50 border-b",
      ].join(" ")}
    >
      <div className="relative mx-auto grid min-h-[56px] w-[min(94vw,1640px)] grid-cols-[minmax(0,1fr)_auto] items-center gap-2 py-2 sm:h-[60px] sm:grid-cols-[minmax(16rem,1fr)_auto_minmax(20rem,1fr)] sm:gap-3 sm:py-0">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-px bg-[linear-gradient(90deg,transparent,var(--header-border),transparent)] sm:block" />
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={onLogo}
            className="group min-w-0 text-left transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2"
          >
            <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--header-text)]">
              BRENYCH STUDIO
            </span>
            <span className="mt-1 hidden text-[9px] uppercase tracking-[0.22em] text-[color:var(--header-muted)] transition group-hover:text-[color:var(--header-text)] lg:block">
              Interface systems
            </span>
          </button>

          <div className="hidden min-w-0 items-center gap-2 border-l border-[color:var(--header-border)] pl-4 xl:flex">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--header-progress)] opacity-20" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--header-progress)]" />
            </span>
            <span className="truncate text-[9px] font-semibold uppercase tracking-[0.22em] text-[color:var(--header-muted)]">
              Signal / {headerTheme.signalLabel}
            </span>
          </div>
        </div>

        <nav className="hidden items-center justify-center gap-5 whitespace-nowrap text-[11px] text-[color:var(--header-muted)] md:flex lg:gap-6">
          {navItems.map((item) => {
            const isActive = activePath === item.to;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNav(item.to)}
                className={`shrink-0 ${linkClass(isActive)}`}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive ? (
                  <motion.span
                    layoutId="header-active-dot"
                    className="h-1.5 w-1.5 rounded-full bg-[color:var(--header-progress)]"
                    transition={{
                      duration: 0.34,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-transparent transition group-hover:bg-[color:var(--header-muted)]" />
                )}
                <span>{getNavItemLabel(item)}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex min-w-0 items-center justify-end gap-1.5 sm:gap-3">
          <div className="hidden items-center gap-2 border-r border-[color:var(--header-border)] pr-3 lg:flex">
            <span className="relative h-1.5 w-1.5 rounded-full bg-[color:var(--header-progress)]" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[color:var(--header-muted)]">
              Live signal
            </span>
          </div>

          <div className="flex min-w-0 items-center justify-center gap-1 rounded-full border border-[color:var(--header-border)] bg-[color:var(--header-chip-bg)] px-1.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[color:var(--header-muted)] shadow-[0_4px_14px_rgba(0,0,0,0.018)] transition-colors duration-[420ms] sm:text-[11px]">
            {availableLocales.map((language) => {
              const isActive = locale === language;

              return (
                <button
                  key={language}
                  type="button"
                  onClick={() => setLocale(language)}
                  className={[
                    "min-w-0 items-center whitespace-nowrap rounded-full px-2 py-1 transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2",
                    isActive ? "inline-flex" : "hidden sm:inline-flex",
                    isActive
                      ? "bg-[color:var(--header-active-chip-bg)] text-[color:var(--header-active-chip-text)] opacity-100"
                      : "opacity-35 hover:opacity-100",
                  ].join(" ")}
                  aria-pressed={isActive}
                >
                  {language}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-header-menu"
            aria-label={mobileMenuOpen ? "Close route terminal" : "Open route terminal"}
            className={[
              "inline-flex h-9 shrink-0 items-center justify-center rounded-full border border-[color:var(--header-border)] bg-[color:var(--header-chip-bg)] px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--header-text)] transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2 md:hidden",
              mobileMenuOpen ? "shadow-[0_10px_24px_rgba(0,0,0,0.07)]" : "opacity-88",
            ].join(" ")}
          >
            {mobileMenuOpen ? "Close" : "Menu"}
          </button>

          <button
            type="button"
            onClick={onCta}
            aria-expanded={drawerOpen}
            aria-label={drawerOpen ? "Close project drawer" : navLabels.start}
            className={[
              "inline-flex min-w-[4.8rem] shrink-0 items-center justify-center gap-1.5 rounded-full px-3 py-[9px] text-[10px] font-semibold uppercase tracking-[0.14em] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-1px] active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2 active:scale-[0.995] sm:min-w-[12.2rem] sm:gap-2 sm:px-4 sm:text-[11px] sm:tracking-[0.16em]",
              drawerOpen
                ? "border border-[color:var(--header-progress)] bg-[color:var(--header-chip-bg)] text-[color:var(--header-text)] shadow-[0_10px_26px_rgba(0,0,0,0.07)]"
                : "border border-[color:var(--header-action-border)] bg-[color:var(--header-action-bg)] text-[color:var(--header-action-text)] hover:opacity-85",
            ].join(" ")}
          >
            <span className="inline sm:hidden">{navLabels.startShort}</span>
            <span className="hidden sm:inline">{navLabels.start}</span>
            <span
              className={[
                "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                drawerOpen ? "translate-x-[1px] text-[color:var(--header-muted)]" : "text-[color:var(--header-action-text)] opacity-55",
              ].join(" ")}
            >
              {"->"}
            </span>
          </button>
        </div>

      </div>
    </header>
    {mobileRouteTerminal}
    </>
  );
}
