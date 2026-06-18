import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { startSpaPageTransition } from "./pageTransition";
import {
  getLocalizedPath,
  getLocaleConfig,
  hasSpanishPublicEquivalent,
  stripLocaleFromPathname,
  useI18n,
  type LocaleCode,
} from "../i18n";
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

const spanishNavItemDescriptions: Record<NavItem["id"], string> = {
  home: "Senal de estudio / sistema inicial",
  work: "Atlas de evidencia / sistemas de caso",
  immersive: "Prueba espacial / campo Web XR",
  offer: "Modelo de proyecto / arquitectura de servicio",
  about: "Practica / contexto de estudio",
};

const navItems: NavItem[] = [
  { id: "home", to: "/" },
  { id: "work", to: "/work" },
  { id: "immersive", to: "/immersive" },
  { id: "offer", to: "/offer" },
  { id: "about", to: "/about" },
];

function getHeaderUi(locale: LocaleCode) {
  const isSpanish = locale === "es";

  return {
    logoSubtitle: isSpanish ? "Sistemas de interfaz" : "Interface systems",
    signal: isSpanish ? "Senal" : "Signal",
    liveSignal: isSpanish ? "Senal activa" : "Live signal",
    routeTerminal: isSpanish ? "Terminal de rutas" : "Route terminal",
    paths: isSpanish ? "rutas" : "paths",
    selectSystemPath: isSpanish ? "Selecciona una ruta de sistema." : "Select system path.",
    close: isSpanish ? "Cerrar" : "Close",
    open: isSpanish ? "Abrir" : "Open",
    now: isSpanish ? "Ahora" : "Now",
    current: isSpanish ? "Actual" : "Current",
    signalReady: isSpanish ? "senal lista" : "signal ready",
    closeProjectPanel: isSpanish ? "Cerrar panel de proyecto" : "Close project panel",
    menu: isSpanish ? "Menu" : "Menu",
    closeRouteTerminal: isSpanish ? "Cerrar terminal de rutas" : "Close route terminal",
    openRouteTerminal: isSpanish ? "Abrir terminal de rutas" : "Open route terminal",
    closeProjectDrawer: isSpanish ? "Cerrar panel de proyecto" : "Close project drawer",
  };
}

function getNavItemDescription(id: NavItem["id"], locale: LocaleCode) {
  return locale === "es" ? spanishNavItemDescriptions[id] : navItemDescriptions[id];
}

function getLocalizedSignalLabel(label: string, locale: LocaleCode) {
  if (locale !== "es") return label;

  const labels: Record<string, string> = {
    "LIVING SYSTEMS": "SISTEMAS VIVOS",
    "EVIDENCE ATLAS": "ATLAS DE EVIDENCIA",
    "IMMERSIVE SYSTEMS": "SISTEMAS INMERSIVOS",
    "PRACTICE MODEL": "MODELO DE PRACTICA",
    "STUDIO POSITION": "POSICION DE ESTUDIO",
    "SYSTEMS INDEX": "INDICE DE SISTEMAS",
    "SPATIAL PROOF": "PRUEBA ESPACIAL",
    "VISUAL ATLAS": "ATLAS VISUAL",
    "INTERFACE GRAMMAR": "GRAMATICA DE INTERFAZ",
    "START SIGNAL": "SENAL DE INICIO",
    "CLOSING SIGNAL": "SENAL DE CIERRE",
    "PRIVACY LAYER": "CAPA DE PRIVACIDAD",
    "LEGAL LAYER": "CAPA LEGAL",
    "CHAMBER MAP": "MAPA DE SALAS",
    "FIRST PROOF": "PRIMERA PRUEBA",
    "ENGINE STACK": "STACK DE MOTORES",
    "FUTURE CHAMBERS": "SALAS FUTURAS",
    "APPLICATION LAYER": "CAPA DE APLICACION",
    "START ROOM": "SALA INICIAL",
    "SPATIAL ATLAS": "ATLAS ESPACIAL",
    "WEB EXHIBITION": "EXHIBICION WEB",
    "SPATIAL FIELD": "CAMPO ESPACIAL",
    "QUEST PROOF": "PRUEBA QUEST",
    "OBJECT HANDOFF": "ENTREGA DE OBJETO",
    "MOBILE PROOF": "PRUEBA MOBILE",
    "ENGINE LEDGER": "LEDGER DE MOTOR",
    "LIVING VISUAL SYSTEMS": "SISTEMAS VISUALES VIVOS",
    "SPATIAL PROOF FIELD": "CAMPO DE PRUEBA ESPACIAL",
    "SONIC OBJECT OS": "SONIC OBJECT OS",
    "RELEASE OBJECT FIELD": "CAMPO DE RELEASE",
    "AUDIO REACTIVE ROOM": "SALA AUDIO-REACTIVA",
    "SIGNAL DOSSIER": "DOSSIER DE SENAL",
    "MEMORY ATLAS": "ATLAS DE MEMORIA",
    "PRESENCE FIELD": "CAMPO DE PRESENCIA",
    "XR MEMORY ROOM": "SALA XR DE MEMORIA",
    "LOCAL ARTIFACTS": "ARTEFACTOS LOCALES",
    "LOCAL-FIRST ENGINE": "MOTOR LOCAL-FIRST",
    "ORBIT LENS OS": "ORBIT LENS OS",
    "SPATIAL FIELDS": "CAMPOS ESPACIALES",
    "REFERENCE ORBIT": "ORBITA DE REFERENCIA",
    "WEBXR PROOF": "PRUEBA WEBXR",
    "OPTICAL STACK": "STACK OPTICO",
    "EVIDENCE READER": "LECTOR DE EVIDENCIA",
    "FEATURED SYSTEMS": "SISTEMAS DESTACADOS",
    "AVAILABLE SYSTEMS": "SISTEMAS DISPONIBLES",
    "CAPABILITY LAYER": "CAPA DE CAPACIDAD",
    "FAST INDEX": "INDICE RAPIDO",
    "START PROJECT": "INICIAR PROYECTO",
    "COMMERCIAL SYSTEMS": "SISTEMAS COMERCIALES",
    "NOT A PAGE": "NO ES UNA PAGINA",
    "DELIVERY ENGINE": "MOTOR DE ENTREGA",
    "WAYS TO BEGIN": "FORMAS DE EMPEZAR",
    "RECEIVE": "ENTREGA",
    "START OFFER": "INICIAR OFERTA",
    "PRACTICE LAYERS": "CAPAS DE PRACTICA",
    "METHOD SPINE": "COLUMNA DE METODO",
    "SYSTEM MAP": "MAPA DE SISTEMA",
    "TECHNICAL FOUNDATION": "BASE TECNICA",
    "WORKING PRINCIPLES": "PRINCIPIOS DE TRABAJO",
    "AUTHORIAL NOTE": "NOTA AUTORAL",
  };

  return labels[label] ?? label;
}

export default function Header({
  drawerOpen = false,
  onOpenProject,
  onCloseProject,
}: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { locale, t, allLocales } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const mobileMenuCloseRef = useRef<HTMLButtonElement | null>(null);
  const cleanPathname = useMemo(() => stripLocaleFromPathname(location.pathname), [location.pathname]);

  const onHome = cleanPathname === "/";
  const activeSceneId = useActiveHeaderScene(cleanPathname);
  const routeTheme = useMemo(() => getHeaderMoodForPath(cleanPathname), [cleanPathname]);
  const headerTheme = useMemo(
    () => resolveHeaderTheme({ routeTheme, activeSceneId }),
    [activeSceneId, routeTheme],
  );

  useHeaderThemeMorph(headerRef, headerTheme, scrolled);

  const activePath = useMemo(() => {
    if (cleanPathname === "/") return "/";

    if (cleanPathname === "/work" || cleanPathname.startsWith("/work/")) {
      return "/work";
    }

    if (cleanPathname === "/immersive" || cleanPathname.startsWith("/immersive/")) {
      return "/immersive";
    }

    if (cleanPathname === "/offer") return "/offer";
    if (cleanPathname === "/about") return "/about";

    return "";
  }, [cleanPathname]);
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

    startSpaPageTransition(navigate, getLocalizedPath("/", locale), () => {
      onCloseProject?.();
    });
  };

  const onNav = (to: NavItem["to"]) => {
    setMobileMenuOpen(false);
    navigateWithTransition(getLocalizedPath(to, locale));
  };

  const onLocale = (nextLocale: LocaleCode) => {
    const nextLocaleConfig = allLocales.find((language) => language.code === nextLocale) ?? getLocaleConfig(nextLocale);
    const isUnavailableSpanishRoute = nextLocale === "es" && !hasSpanishPublicEquivalent(cleanPathname);

    if (!nextLocaleConfig.enabled || isUnavailableSpanishRoute || nextLocale === locale) return;

    navigateWithTransition(getLocalizedPath(location.pathname, nextLocale));
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
  const currentLocaleConfig = getLocaleConfig(locale);
  const headerUi = getHeaderUi(locale);
  const localizedSignalLabel = getLocalizedSignalLabel(headerTheme.signalLabel, locale);
  const getNavItemLabel = (item: NavItem) => navLabels[item.id];

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
                className="fixed inset-0 z-[90] flex items-center justify-center px-4 pb-4 pt-[calc(4.25rem+env(safe-area-inset-top))] lg:hidden"
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
                  aria-label={headerUi.closeRouteTerminal}
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
                          {headerUi.routeTerminal} / {String(navItems.length).padStart(2, "0")} {headerUi.paths}
                        </div>
                        <h2
                          id="mobile-route-terminal-title"
                          className="mt-1.5 text-[22px] font-normal leading-[0.94] tracking-[-0.035em] text-white"
                        >
                          {headerUi.selectSystemPath}
                        </h2>
                      </div>

                      <button
                        ref={mobileMenuCloseRef}
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="inline-flex min-h-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/70 transition hover:border-white/30 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                      >
                        {headerUi.close}
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
                                {getNavItemDescription(item.id, locale)}
                              </span>
                            </span>
                            <span className={isActive ? "font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-950" : "font-mono text-[9px] uppercase tracking-[0.14em] text-white/42 group-hover:text-white/70"}>
                              {isActive ? headerUi.now : headerUi.open}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="grid gap-3">
                      <div className="grid grid-cols-[1fr_auto] gap-3 border-y border-white/10 py-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-white/40">
                        <span>{headerUi.current} / {getNavItemLabel(navItems.find((item) => item.to === activePath) ?? navItems[0])}</span>
                        <span>{currentLocaleConfig.label} / {headerUi.signalReady}</span>
                      </div>
                      <button
                        type="button"
                        onClick={onCta}
                        className="inline-flex min-h-11 items-center justify-between rounded-full border border-white bg-white px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-950 transition hover:-translate-y-0.5 hover:bg-[#f7f3ea] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                      >
                        <span>{drawerOpen ? headerUi.closeProjectPanel : navLabels.startProject}</span>
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
      <div className="relative mx-auto grid min-h-[56px] w-[min(96vw,1640px)] grid-cols-[minmax(0,1fr)_auto] items-center gap-1.5 py-2 sm:h-[60px] sm:w-[min(94vw,1640px)] sm:py-0 lg:grid-cols-[minmax(16rem,1fr)_auto_minmax(20rem,1fr)] lg:gap-3">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-px bg-[linear-gradient(90deg,transparent,var(--header-border),transparent)] sm:block" />
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={onLogo}
            className="group min-w-0 text-left transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2"
          >
            <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--header-text)] min-[420px]:text-[11px] min-[420px]:tracking-[0.18em]">
              BRENYCH STUDIO
            </span>
            <span className="mt-1 hidden text-[9px] uppercase tracking-[0.22em] text-[color:var(--header-muted)] transition group-hover:text-[color:var(--header-text)] lg:block">
              {headerUi.logoSubtitle}
            </span>
          </button>

          <div className="hidden min-w-0 items-center gap-2 border-l border-[color:var(--header-border)] pl-4 xl:flex">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--header-progress)] opacity-20" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--header-progress)]" />
            </span>
            <span className="truncate text-[9px] font-semibold uppercase tracking-[0.22em] text-[color:var(--header-muted)]">
              {headerUi.signal} / {localizedSignalLabel}
            </span>
          </div>
        </div>

        <nav className="hidden items-center justify-center gap-5 whitespace-nowrap text-[11px] text-[color:var(--header-muted)] lg:flex lg:gap-6">
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

        <div className="flex min-w-0 items-center justify-end gap-1 sm:gap-3">
          <div className="hidden items-center gap-2 border-r border-[color:var(--header-border)] pr-3 lg:flex">
            <span className="relative h-1.5 w-1.5 rounded-full bg-[color:var(--header-progress)]" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[color:var(--header-muted)]">
              {headerUi.liveSignal}
            </span>
          </div>

          <div className="flex shrink-0 items-center justify-center gap-1 rounded-full border border-[color:var(--header-border)] bg-[color:var(--header-chip-bg)] px-1 py-1 text-[9px] uppercase tracking-[0.12em] text-[color:var(--header-muted)] shadow-[0_4px_14px_rgba(0,0,0,0.018)] transition-colors duration-[420ms] min-[420px]:px-1.5 min-[420px]:text-[10px] min-[420px]:tracking-[0.14em] sm:text-[11px]">
            {allLocales.map((language) => {
              const isActive = locale === language.code;
              const isUnavailableSpanishRoute = language.code === "es" && !hasSpanishPublicEquivalent(cleanPathname);
              const isDisabled = !language.enabled || isUnavailableSpanishRoute;

              return (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => onLocale(language.code)}
                  disabled={isDisabled}
                  className={[
                    "shrink-0 items-center whitespace-nowrap rounded-full px-1.5 py-1 transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2 min-[420px]:px-2",
                    isActive ? "inline-flex" : "hidden lg:inline-flex",
                    isActive
                      ? "bg-[color:var(--header-active-chip-bg)] text-[color:var(--header-active-chip-text)] opacity-100"
                      : isDisabled
                        ? "cursor-not-allowed opacity-28"
                        : "opacity-35 hover:opacity-100",
                  ].join(" ")}
                  aria-pressed={isActive}
                  aria-disabled={isDisabled || undefined}
                  aria-label={`${language.name}${isDisabled ? ` - ${t.language.unavailable}` : ""}`}
                  title={isDisabled ? t.language.unavailable : language.name}
                >
                  {language.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-header-menu"
            aria-label={mobileMenuOpen ? headerUi.closeRouteTerminal : headerUi.openRouteTerminal}
            className={[
              "inline-flex h-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--header-border)] bg-[color:var(--header-chip-bg)] px-2.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[color:var(--header-text)] transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2 min-[420px]:h-9 min-[420px]:px-3 min-[420px]:text-[10px] min-[420px]:tracking-[0.14em] lg:hidden",
              mobileMenuOpen ? "shadow-[0_10px_24px_rgba(0,0,0,0.07)]" : "opacity-88",
            ].join(" ")}
          >
            {mobileMenuOpen ? headerUi.close : headerUi.menu}
          </button>

          <button
            type="button"
            onClick={onCta}
            aria-expanded={drawerOpen}
            aria-label={drawerOpen ? headerUi.closeProjectDrawer : navLabels.startProject}
            className={[
              "inline-flex min-w-10 shrink-0 items-center justify-center gap-1 rounded-full px-2.5 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-1px] active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2 active:scale-[0.995] min-[420px]:min-w-[4.8rem] min-[420px]:gap-1.5 min-[420px]:px-3 min-[420px]:py-[9px] min-[420px]:text-[10px] min-[420px]:tracking-[0.14em] sm:min-w-[12.2rem] sm:gap-2 sm:px-4 sm:text-[11px] sm:tracking-[0.16em]",
              drawerOpen
                ? "border border-[color:var(--header-progress)] bg-[color:var(--header-chip-bg)] text-[color:var(--header-text)] shadow-[0_10px_26px_rgba(0,0,0,0.07)]"
                : "border border-[color:var(--header-action-border)] bg-[color:var(--header-action-bg)] text-[color:var(--header-action-text)] hover:opacity-85",
            ].join(" ")}
          >
            <span className="hidden min-[420px]:inline sm:hidden">{navLabels.startProjectShort}</span>
            <span className="hidden sm:inline">{navLabels.startProject}</span>
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
