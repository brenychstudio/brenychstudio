import { useCallback, useEffect, useReducer, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { PublicLocale } from "../../data/projectRegistry.types";
import { getLocalizedPath, useI18n } from "../../i18n";
import { useSound } from "../../stage/audio/useSound";
import { startSpaPageTransition } from "../pageTransition";
import { DIRECTOR_RECEIPT_EVENT, type DirectorReceipt, type DirectorReceiptStatus, type PresenterCta } from "./directorContract";
import { glideBack, runDirectorAction, type DirectorRuntime } from "./directorRuntime";
import PresenterDock from "./PresenterDock";
import { presenterCopy, type PresenterAnswerId } from "./presenterContent";
import { PresenterContext, type PresenterApi } from "./presenterContext";
import { initialPresenterState, presenterReducer } from "./presenterMachine";
import { presenterAnswerClips, presenterIdleClip } from "./presenterMedia";
import { PresenterPlayer } from "./presenterPlayer";
import { usePresenterPlayback } from "./usePresenterPlayback";
import "./studioPresenter.css";

type Origin = { path: string; scrollY: number };

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (notify: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};
const getReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;

/** Studio Experience Director host. Lives above the routes so the presenter keeps speaking while the site it directs
 *  scrolls between HOME scenes or opens another page. */
export default function StudioPresenterProvider({ children, onOpenProject }: { children: ReactNode; onOpenProject: () => void }) {
  const { locale: currentLocale } = useI18n();
  const locale: PublicLocale = currentLocale === "es" ? "es" : "en";
  const copy = presenterCopy[locale];
  const routerNavigate = useNavigate();
  const { pathname } = useLocation();
  const { playRole } = useSound();
  const [state, dispatch] = useReducer(presenterReducer, initialPresenterState);
  const [receipts, setReceipts] = useState<DirectorReceipt[]>([]);
  const [muted, setMuted] = useState(false);
  const [player] = useState(() => new PresenterPlayer());
  const [dockOrigin, setDockOrigin] = useState<DOMRect | null>(null);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const plateRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const focusTriggerRef = useRef(false);
  const stagePlateRef = useRef<HTMLElement | null>(null);
  const originRef = useRef<Origin | null>(null);
  const expectedPathRef = useRef<string | null>(null);
  const lastPathRef = useRef(pathname);
  const controllerRef = useRef<AbortController | null>(null);
  const controllerRunRef = useRef(0);
  const startedRef = useRef(new Set<number>());
  const queueRef = useRef<Promise<void>>(Promise.resolve());

  const run = state.run;
  const touring = state.phase === "playing_answer" || state.phase === "stopped" || state.phase === "completed";
  const answer = "answerId" in state ? copy.answers.find((item) => item.id === state.answerId) ?? null : null;
  const clip = answer ? presenterAnswerClips[locale][answer.id] : undefined;
  const position = usePresenterPlayback({ state, answer, clip, player, progress: plateRef, audible: !muted, showPicture: !reducedMotion, dispatch });

  // The idle loop plays only where the presenter is on screen and nothing is being answered over a still: the open
  // stage, or the dock between answers. Reduced motion keeps the still.
  const idleOn = Boolean(presenterIdleClip) && !reducedMotion
    && (state.phase === "idle_open" || state.phase === "stopped" || state.phase === "completed"
      || (state.phase === "playing_answer" && (position.status === "loading" || position.status === "speaking")));
  useEffect(() => {
    if (idleOn) player.prepareIdle(presenterIdleClip);
    player.setIdle(idleOn);
  }, [idleOn, player]);
  useEffect(() => () => player.release(), [player]);

  const publish = useCallback((receipt: DirectorReceipt) => {
    setReceipts((previous) => [...previous.filter((item) => item.run !== receipt.run || item.step !== receipt.step), receipt]);
    window.dispatchEvent(new CustomEvent(DIRECTOR_RECEIPT_EVENT, { detail: receipt }));
  }, []);
  const cancelTour = () => {
    controllerRef.current?.abort();
    controllerRef.current = null;
  };

  // Each answer start owns one director run. Steps start with their caption cue on the answer's own clock (the clip's
  // first frame, or the transcript's first line), run one after another, and report only what the page confirms; a new
  // run, Stop, Back or Close cancels whatever is still pending.
  useEffect(() => {
    if (state.phase !== "playing_answer" || !answer || !position.started || position.run !== run) return;
    if (!controllerRef.current || controllerRunRef.current !== run) {
      controllerRef.current?.abort();
      controllerRef.current = new AbortController();
      controllerRunRef.current = run;
      startedRef.current = new Set();
      queueRef.current = Promise.resolve();
    }
    const controller = controllerRef.current;
    const runtime: DirectorRuntime = {
      locale,
      signal: controller.signal,
      openPage: (to) => {
        expectedPathRef.current = to.split("#")[0];
        startSpaPageTransition(routerNavigate, to);
      },
      replaceHash: (to) => routerNavigate(to, { replace: true }),
    };
    answer.plan.forEach((step, index) => {
      if (step.atCue > position.cue || startedRef.current.has(index)) return;
      startedRef.current.add(index);
      queueRef.current = queueRef.current.then(async () => {
        if (controller.signal.aborted) return;
        const receipt = { run, step: index, label: step.receipt };
        publish({ ...receipt, status: "running" });
        let status: DirectorReceiptStatus;
        try { status = await runDirectorAction(step.action, runtime); }
        catch { status = controller.signal.aborted ? "cancelled" : "failed"; }
        publish({ ...receipt, status });
        // The visitor took over the scroll: the director makes no further moves in this run.
        if (status === "interrupted") controller.abort();
      });
    });
  }, [state.phase, run, position.cue, position.started, position.run, answer, locale, routerNavigate, publish]);

  // However an answer stops (Stop, hidden tab, a media key pausing the clip), no further step of its run may start.
  useEffect(() => {
    if (state.phase !== "stopped") return;
    controllerRef.current?.abort();
    controllerRef.current = null;
  }, [state.phase]);

  // A visitor who navigates on their own (header, link, history) ends the experience where they went.
  useEffect(() => {
    if (pathname === lastPathRef.current) return;
    lastPathRef.current = pathname;
    if (expectedPathRef.current === pathname) {
      expectedPathRef.current = null;
      return;
    }
    if (state.phase === "closed") return;
    controllerRef.current?.abort();
    focusTriggerRef.current = false;
    player.release();
    dispatch({ type: "close" });
  }, [pathname, state.phase, player]);

  // Nobody is addressed in a hidden tab.
  useEffect(() => {
    if (state.phase !== "playing_answer") return;
    const onVisibility = () => {
      if (!document.hidden) return;
      controllerRef.current?.abort();
      dispatch({ type: "interrupt" });
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [state.phase]);

  // After Back crossed a route, focus returns to the HOME trigger as soon as it is mounted again.
  const registerTrigger = useCallback((element: HTMLButtonElement | null) => {
    triggerRef.current = element;
    if (element && focusTriggerRef.current) {
      focusTriggerRef.current = false;
      element.focus({ preventScroll: true });
    }
  }, []);
  const registerStagePlate = useCallback((element: HTMLElement | null) => { stagePlateRef.current = element; }, []);
  const mountMedia = useCallback((host: HTMLElement) => player.mount(host), [player]);
  const engage = useCallback(() => player.prepareIdle(reducedMotion ? null : presenterIdleClip), [player, reducedMotion]);
  const open = () => {
    cancelTour();
    engage();
    dispatch({ type: "open" });
    playRole("open");
  };
  const close = (restoreFocus = false) => {
    cancelTour();
    focusTriggerRef.current = false;
    player.release();
    dispatch({ type: "close" });
    setReceipts([]);
    playRole("close");
    if (restoreFocus) triggerRef.current?.focus({ preventScroll: true });
  };
  const select = (answerId: PresenterAnswerId) => {
    // The browsing context Back returns to: where the visitor chose the question.
    if (state.phase === "idle_open") originRef.current = { path: window.location.pathname, scrollY: window.scrollY };
    const plate = stagePlateRef.current?.getBoundingClientRect();
    setDockOrigin(plate && plate.width > 0 && plate.bottom > 0 && plate.top < window.innerHeight ? plate : null);
    dispatch({ type: "select", answerId });
  };
  const back = () => {
    cancelTour();
    dispatch({ type: "open" });
    const origin = originRef.current;
    if (!origin) return;
    if (window.location.pathname !== origin.path) {
      expectedPathRef.current = origin.path;
      focusTriggerRef.current = true;
      startSpaPageTransition(routerNavigate, origin.path);
      return;
    }
    glideBack(origin.scrollY).catch(() => undefined);
    triggerRef.current?.focus({ preventScroll: true });
  };
  const runCta = (cta: PresenterCta) => {
    cancelTour();
    player.release();
    dispatch({ type: "close" });
    setReceipts([]);
    if (cta.kind === "route") startSpaPageTransition(routerNavigate, getLocalizedPath(cta.path, locale));
    else if (cta.kind === "project") {
      playRole("select");
      onOpenProject();
    }
  };

  const latest = receipts
    .filter((item) => item.run === run && item.status !== "cancelled" && item.status !== "skipped")
    .reduce<DirectorReceipt | null>((last, item) => (!last || item.step >= last.step ? item : last), null);
  const api: PresenterApi = { state, locale, copy, open, close, select, registerTrigger, registerStagePlate, mountMedia, engage };

  return <PresenterContext.Provider value={api}>
    {children}
    {touring && answer && <PresenterDock locale={locale} copy={copy} answer={answer} phase={state.phase} position={position}
      receipt={latest} clip={clip} muted={muted} plateRef={plateRef} origin={dockOrigin} mountMedia={mountMedia}
      onStop={() => { cancelTour(); dispatch({ type: "stop" }); }}
      onReplay={() => dispatch({ type: "replay" })}
      onBack={back} onClose={() => close(true)} onCta={runCta} onToggleVoice={() => setMuted((value) => !value)} />}
  </PresenterContext.Provider>;
}
