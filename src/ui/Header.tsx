import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
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
  const headerRef = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 12);

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });

    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

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
    navigateWithTransition(to);
  };

  const linkClass = (isActive: boolean) =>
    [
      "group relative inline-flex h-8 items-center gap-2 px-1 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[color:var(--header-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2",
      isActive ? "text-[color:var(--header-text)]" : "text-[color:var(--header-muted)]",
    ].join(" ");

  const onCta = () => {
    if (drawerOpen) onCloseProject?.();
    else onOpenProject?.();
  };

  const navLabels = t.nav;
  const getNavItemLabel = (item: NavItem) =>
    item.id === "home" ? "Home" : navLabels[item.id];

  return (
    <header
      ref={headerRef}
      className={[
        "site-header fixed inset-x-0 top-0 z-50 border-b",
      ].join(" ")}
    >
      <div className="relative mx-auto grid w-[min(94vw,1640px)] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-2.5 sm:h-[60px] sm:grid-cols-[minmax(16rem,1fr)_auto_minmax(20rem,1fr)] sm:py-0">
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

        <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
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
            onClick={onCta}
            aria-expanded={drawerOpen}
            aria-label={drawerOpen ? "Close project drawer" : navLabels.start}
            className={[
              "inline-flex min-w-[2.75rem] shrink-0 items-center justify-center gap-2 rounded-full px-3 py-[9px] text-[10px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-1px] active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2 active:scale-[0.995] min-[560px]:min-w-[5.8rem] sm:min-w-[12.2rem] sm:px-4 sm:text-[11px]",
              drawerOpen
                ? "border border-[color:var(--header-progress)] bg-[color:var(--header-chip-bg)] text-[color:var(--header-text)] shadow-[0_10px_26px_rgba(0,0,0,0.07)]"
                : "border border-[color:var(--header-action-border)] bg-[color:var(--header-action-bg)] text-[color:var(--header-action-text)] hover:opacity-85",
            ].join(" ")}
          >
            <span className="hidden min-[560px]:inline sm:hidden">{navLabels.startShort}</span>
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
  );
}
