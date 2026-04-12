import { useMemo } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { startHardPageTransition, startSpaPageTransition } from "./pageTransition";
import { availableLocales } from "../i18n";
import { useLocale } from "../store/useLocale";

type Props = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
};

type NavItem = {
  id: "work" | "immersive" | "offer" | "about";
  to: "/work" | "/immersive" | "/offer" | "/about";
};

const navItems: NavItem[] = [
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

  const onHome = location.pathname === "/";

  const activePath = useMemo(() => {
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

  const navigateWithTransition = (to: string) => {
    if (location.pathname === to) return;

    if (onHome) {
      startHardPageTransition(to, () => {
        onCloseProject?.();
      });
      return;
    }

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
      "relative transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2",
      isActive ? "text-neutral-900" : "text-neutral-600",
    ].join(" ");

  const onCta = () => {
    if (drawerOpen) onCloseProject?.();
    else onOpenProject?.();
  };

  const navLabels = t.nav;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/6 bg-white/72 backdrop-blur-xl supports-[backdrop-filter]:bg-white/66">
      <div className="mx-auto w-[min(94vw,1180px)] py-3 sm:flex sm:h-[62px] sm:items-center sm:justify-between sm:py-0">
        <div className="flex flex-col gap-3 sm:contents">
          <button
            type="button"
            onClick={onLogo}
            className="text-left text-[10px] uppercase tracking-[0.14em] text-neutral-800 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2 sm:text-[11px]"
          >
            ROSTYSLAV BRENYCH
          </button>

          <div className="flex flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-5">
            <nav className="flex items-center gap-5 overflow-x-auto whitespace-nowrap pb-0.5 text-[11px] text-neutral-600 [scrollbar-width:none] [-ms-overflow-style:none] sm:flex-nowrap sm:gap-6 sm:text-[12px] [&::-webkit-scrollbar]:hidden">
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
                    {navLabels[item.id]}

                    {isActive ? (
                      <motion.span
                        layoutId="nav-underline"
                        className="pointer-events-none absolute -bottom-1.5 left-0 right-0 h-[1px] bg-neutral-900/90 sm:-bottom-2"
                        transition={{
                          duration: 0.3,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    ) : null}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-full border border-neutral-200/80 bg-white/76 px-1.5 py-1 text-[10px] uppercase tracking-[0.14em] text-neutral-500 shadow-[0_4px_14px_rgba(0,0,0,0.02)] sm:min-w-[120px] sm:flex-none sm:text-[11px]">
                {availableLocales.map((language) => {
                  const isActive = locale === language;

                  return (
                    <button
                      key={language}
                      type="button"
                      onClick={() => setLocale(language)}
                      className={[
                        "inline-flex min-w-0 items-center whitespace-nowrap rounded-full px-2 py-1 transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2",
                        isActive
                          ? "bg-neutral-900 text-white opacity-100"
                          : "opacity-45 hover:opacity-100",
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
                className={[
                  "inline-flex min-w-[8.3rem] shrink-0 items-center justify-center gap-2 rounded-full px-3 py-[9px] text-[10px] uppercase tracking-[0.16em] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-1px] active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2 active:scale-[0.995] sm:min-w-[12.5rem] sm:px-4 sm:text-[12px]",
                  drawerOpen
                    ? "border border-neutral-900/60 bg-white/80 text-neutral-900 shadow-[0_10px_26px_rgba(0,0,0,0.07)]"
                    : "border border-black/10 bg-white/70 text-neutral-800 hover:border-neutral-400 hover:bg-white/88",
                ].join(" ")}
              >
                <span className="sm:hidden">{navLabels.startShort}</span>
                <span className="hidden sm:inline">{navLabels.start}</span>
                <span
                  className={[
                    "text-neutral-400 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    drawerOpen ? "translate-x-[1px]" : "",
                  ].join(" ")}
                >
                  {"->"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
