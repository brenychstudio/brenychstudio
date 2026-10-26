import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { useLocation } from "react-router-dom";
import Header from "../ui/Header";
import PageSurface from "../ui/PageSurface";
import SiteFooterV2 from "../ui/SiteFooterV2";
import SpatialHorizonFigure from "../ui/avatars/SpatialHorizonFigure";
import StagePresence from "../ui/avatars/StagePresence";
import CastLibrary from "../ui/avatars/CastLibrary";
import PerformanceProof from "../ui/avatars/PerformanceProof";
import { useI18n } from "../i18n";
import { avatarIndexFromHash, avatarProfiles, type AvatarLocale } from "../data/avatarProfiles";
import { avatarMedia, spokenClipFor } from "../data/avatarMedia";
import { avatarsCopy } from "../data/avatarsCopy";
import "../ui/avatars/avatarsPage.css";

type AvatarsPageProps = { drawerOpen?: boolean; onOpenProject?: () => void; onCloseProject?: () => void };

const total = avatarProfiles.length;
const pad = (value: number) => String(value).padStart(2, "0");
const DESKTOP = "(min-width: 1024px)";

const scrollBehavior = (): ScrollBehavior => (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

/** AI Digital Humans: one active presence on a sticky stage, the cast trace under it, the cast library, and the two
 *  technology tracks (Cinematic Presence now, Spatial Digital Humans coming soon). Selection is explicit (click, keyboard,
 *  touch) and shareable as #avatar-0N; the page never auto-advances or claims a live conversation. A character with a
 *  recorded introduction (only in a build that carries one) plays a muted idle loop and speaks only after a click. */
export default function AvatarsPage({ drawerOpen, onOpenProject, onCloseProject }: AvatarsPageProps) {
  const { locale } = useI18n();
  const lang: AvatarLocale = locale === "es" ? "es" : "en";
  const copy = avatarsCopy[lang];
  const location = useLocation();
  const [active, setActive] = useState(() => Math.max(0, avatarIndexFromHash(location.hash)));
  // Portraits load once an identity is selected or previewed (hover / focus); thumbnails load with the trace.
  const [warm, setWarm] = useState<ReadonlySet<number>>(() => new Set([Math.max(0, avatarIndexFromHash(location.hash))]));
  const [routedHash, setRoutedHash] = useState(location.hash);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const trace = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  // A link to /avatars#avatar-0N while the page is open selects that identity (state adjusted during render).
  if (location.hash !== routedHash) {
    setRoutedHash(location.hash);
    const index = avatarIndexFromHash(location.hash);
    if (index >= 0) {
      setActive(index);
      setWarm((current) => (current.has(index) ? current : new Set(current).add(index)));
    }
  }
  const profile = avatarProfiles[active];

  // A hash typed into the address bar (or reached with back / forward) after an in-page selection: the router still holds
  // the hash the page was opened with, so it may not see a change. hashchange never fires for our own replaceState.
  useEffect(() => {
    const onHashChange = () => {
      const index = avatarIndexFromHash(window.location.hash);
      if (index < 0) return;
      setActive(index);
      setWarm((current) => (current.has(index) ? current : new Set(current).add(index)));
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Below ~360px the trace scrolls sideways: keep the selected port in view (the trace scrolls, never the page).
  useEffect(() => {
    const strip = trace.current;
    const port = tabs.current[active];
    if (!strip || !port || strip.scrollWidth <= strip.clientWidth) return;
    const box = strip.getBoundingClientRect();
    const rect = port.getBoundingClientRect();
    const delta = rect.left < box.left ? rect.left - box.left - 6 : rect.right > box.right ? rect.right - box.right + 6 : 0;
    if (delta) strip.scrollBy({ left: delta, behavior: scrollBehavior() });
  }, [active]);

  const preview = useCallback((index: number) => {
    setWarm((current) => (current.has(index) ? current : new Set(current).add(index)));
  }, []);

  const select = useCallback((index: number) => {
    preview(index);
    setActive(index);
    // Shareable without a history entry or a scroll jump (no element carries this id).
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}#${avatarProfiles[index].id}`);
  }, [preview]);

  const step = (delta: number) => select((active + delta + total) % total);

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const moves: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next = -1;
    if (event.key in moves) next = (index + moves[event.key] + total) % total;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = total - 1;
    if (next < 0) return;
    event.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  };

  // Desktop: the stage stays in view, so the cast narrative is the destination. Phones: the stage itself.
  const exploreCast = () => {
    const target = document.getElementById(window.matchMedia(DESKTOP).matches ? "avatars-cast" : "avatars-stage");
    target?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    tabs.current[active]?.focus({ preventScroll: true });
  };
  const showHorizon = () => document.getElementById("avatars-horizon")?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  // From the cast library: the chosen identity goes on stage and the stage comes into view (no sound starts).
  // The scroll starts on the next frame, once the new identity is laid out: WebKit drops a smooth scroll begun in the same
  // task as a re-render that changes the page height (phones).
  const showOnStage = (index: number) => {
    select(index);
    tabs.current[index]?.focus({ preventScroll: true });
    requestAnimationFrame(() => {
      const target = document.getElementById(window.matchMedia(DESKTOP).matches ? "avatars-chamber" : "avatars-stage");
      target?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    });
  };

  const number = profile.displayNumber;
  const levels = copy.ledger.levels;
  const selectedMedia = avatarMedia[profile.id];
  const sampleAvailable = Boolean(spokenClipFor(selectedMedia, lang));
  const recordedCast = selectedMedia?.availability === "release-candidate" || selectedMedia?.availability === "approved-demo";

  return (
    <>
      <Header drawerOpen={drawerOpen} onOpenProject={onOpenProject} onCloseProject={onCloseProject} />
      <PageSurface className="avatars-page">
        <main id="main-content">
          <section className="av-chamber" id="avatars-chamber" data-header-scene="avatars-chamber" aria-labelledby="avatars-title">
            <div className="av-chamber__inner">
              <div className="av-threshold">
                <header className="av-intro">
                  <p className="av-label"><span>{copy.eyebrow}</span><span aria-hidden="true">01—{pad(total)}</span></p>
                  <h1 id="avatars-title" className="av-title">{copy.title}</h1>
                </header>
                <div className="av-lead">
                  <p className="av-supporting">{copy.supporting}</p>
                  <p className="av-body">{copy.body}</p>
                  <div className="av-actions" data-sound-safe-area>
                    <button type="button" className="av-button" onClick={exploreCast}>{copy.exploreCast}<span aria-hidden="true">↓</span></button>
                    <button type="button" className="av-quiet" onClick={onOpenProject} aria-haspopup="dialog">{copy.discuss}<span aria-hidden="true">↗</span></button>
                  </div>
                  <div id="aria-preview-entry" className="av-aria-entry" />
                  <p className="av-disclaimer">{recordedCast ? copy.releaseDisclaimer : copy.disclaimer}</p>
                </div>
              </div>

              <div className="av-stage-col">
                <div className="av-stage" id="avatars-stage" ref={stage}>
                  <div className="av-stage__frame" role="tabpanel" id="avatars-presence" aria-labelledby={`avatar-tab-${profile.id}`}>
                    <div className="av-stage__ambient" aria-hidden="true">
                      {avatarProfiles.map((item, index) =>
                        warm.has(index) ? <img key={item.id} className={index === active ? "is-active" : undefined} src={item.thumbWebp} alt="" decoding="async" /> : null,
                      )}
                    </div>
                    <StagePresence profile={profile} media={avatarMedia[profile.id]} lang={lang} copy={copy.presence} stage={stage}>
                      {/* Slow network: the trace's own thumbnail (already loaded) holds the same framing, softly, until the
                          portrait arrives on top of it. Never an empty stage. */}
                      <img
                        key={`placeholder-${profile.id}`}
                        className="av-stage__placeholder"
                        src={profile.thumbWebp}
                        alt=""
                        aria-hidden="true"
                        decoding="async"
                        draggable={false}
                        style={{ "--focal": profile.imageFocalPoint, "--zoom": profile.stageZoom } as CSSProperties}
                      />
                      {avatarProfiles.map((item, index) =>
                        warm.has(index) ? (
                          <img
                            key={item.id}
                            className={index === active ? "is-active" : undefined}
                            src={item.portraitWebp}
                            width={item.portraitSize}
                            height={item.portraitSize}
                            alt={index === active ? `${copy.cast.portraitAlt} ${item.displayNumber} — ${item.name}, ${item.role[lang]}` : ""}
                            aria-hidden={index === active ? undefined : true}
                            decoding="async"
                            fetchPriority={index === active ? "high" : "low"}
                            draggable={false}
                            style={{ "--focal": item.imageFocalPoint, "--zoom": item.stageZoom } as CSSProperties}
                          />
                        ) : null,
                      )}
                    </StagePresence>
                  </div>

                  {/* The dock steps aside while these controls pass its corner (small screens). */}
                  <div className="av-stage__band" data-sound-safe-area>
                    {/* Announces Previous / Next, where focus stays on the button. */}
                    <p className="av-identity" aria-live="polite" aria-atomic="true">
                      <span className="av-identity__count">{number}<span> / {pad(total)}</span></span>
                      <span className="av-identity__role"><span className="av-identity__name">{profile.name}</span> {profile.role[lang]}</span>
                      <span className="av-identity__scenario">{profile.scenario[lang]}</span>
                    </p>
                    <div className="av-steps">
                      <button type="button" className="av-step" onClick={() => step(-1)} aria-label={copy.cast.previous}><span aria-hidden="true">←</span></button>
                      <button type="button" className="av-step" onClick={() => step(1)} aria-label={copy.cast.next}><span aria-hidden="true">→</span></button>
                    </div>
                    <div ref={trace} className="av-trace" role="tablist" aria-label={copy.cast.tablist}>
                      {avatarProfiles.map((item, index) => (
                        <button
                          key={item.id}
                          ref={(node) => { tabs.current[index] = node; }}
                          type="button"
                          role="tab"
                          id={`avatar-tab-${item.id}`}
                          className="av-port"
                          aria-selected={index === active}
                          aria-controls="avatars-presence"
                          aria-label={`${copy.cast.viewIdentity} ${item.displayNumber} — ${item.name}, ${item.role[lang]}`}
                          tabIndex={index === active ? 0 : -1}
                          onClick={() => select(index)}
                          onKeyDown={(event) => onTabKey(event, index)}
                          onPointerEnter={() => preview(index)}
                          onFocus={() => preview(index)}
                        >
                          <span className="av-port__thumb"><img src={item.thumbWebp} alt="" width={320} height={320} decoding="async" draggable={false} /></span>
                          <span className="av-port__number" aria-hidden="true">{item.displayNumber}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <section className="av-cast" id="avatars-cast" aria-labelledby="avatars-cast-title">
                <p className="av-label">{copy.cast.label}</p>
                <h2 id="avatars-cast-title" className="av-cast__heading">{copy.cast.heading}</h2>
                <p className="av-cast__caption">{copy.cast.caption}</p>
                <div className="av-now">
                  <p className="av-label av-now__label">{copy.cast.nowPresenting}</p>
                  <p className="av-now__number" aria-hidden="true">{number}</p>
                  <div className="av-now__live" key={profile.id}>
                    <dl className="av-now__facts">
                      <div><dt>{copy.cast.nameLabel}</dt><dd>{profile.name}{profile.nameStatus === "provisional" ? <span className="av-now__aside"> · {copy.cast.provisional}</span> : null}</dd></div>
                      <div><dt>{copy.cast.roleLabel}</dt><dd>{profile.role[lang]}</dd></div>
                      <div><dt>{copy.cast.scenarioLabel}</dt><dd>{profile.scenario[lang]}</dd></div>
                      <div><dt>{copy.cast.statusLabel}</dt><dd>{sampleAvailable ? recordedCast ? copy.cast.statusRecorded : copy.cast.statusPilot : selectedMedia ? copy.cast.statusPartial : copy.cast.status}</dd></div>
                    </dl>
                  </div>
                  <p className="av-now__disclosure">{copy.cast.disclosure}</p>
                  <button type="button" className="av-quiet av-now__action" onClick={onOpenProject} aria-haspopup="dialog" data-sound-safe-area>
                    {copy.cast.action}<span aria-hidden="true">↗</span>
                  </button>
                </div>
              </section>
            </div>
          </section>

          <CastLibrary lang={lang} copy={copy.library} active={active} onSelect={showOnStage} />

          <section className="av-ledger" data-header-scene="avatars-ledger" aria-labelledby="avatars-ledger-title">
            <div className="av-ledger__inner">
              <div className="av-ledger__head">
                <p className="av-label">{copy.ledger.label}</p>
                <h2 id="avatars-ledger-title" className="av-ledger__heading">{copy.ledger.heading}</h2>
                <p className="av-ledger__lede">{copy.ledger.lede}</p>
              </div>
              <PerformanceProof lang={lang} copy={copy} />
              <ol className="av-levels">
                {levels.map((level, index) => {
                  const state = index === 0 ? "current" : index === 1 ? "bridge" : "future";
                  return (
                    <li key={level.name} className="av-level" data-state={state}>
                      <span className="av-level__index" aria-hidden="true">{level.index}</span>
                      <h3 className="av-level__name">{level.name}</h3>
                      <p className="av-level__state">{level.state}</p>
                      <p className="av-level__body">{level.body}</p>
                      {level.points ? <ul className="av-level__points">{level.points.map((point) => <li key={point}>{point}</li>)}</ul> : null}
                      {level.note ? <p className="av-level__note">{index === 0 && recordedCast ? copy.performance.currentNote : level.note}</p> : null}
                      {state === "future" ? (
                        <button type="button" className="av-level__link av-quiet" onClick={showHorizon} data-sound-safe-area>{copy.ledger.horizonLink}<span aria-hidden="true">↓</span></button>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            </div>

            <section className="av-roles" aria-labelledby="avatars-roles-title">
              <p className="av-label">{copy.roles.label}</p>
              <h2 id="avatars-roles-title" className="av-roles__heading">{copy.roles.heading}</h2>
              <ol className="av-roles__list">
                {copy.roles.items.map((role, index) => (
                  <li key={role.name} className="av-role">
                    <span className="av-role__index" aria-hidden="true">{pad(index + 1)}</span>
                    <div className="av-role__portrait"><img src={avatarProfiles[[1,6,7,2][index]].portraitWebp} alt={avatarProfiles[[1,6,7,2][index]].name} width={480} height={480} loading="lazy" decoding="async" /></div>
                    <h3 className="av-role__name">{role.name}</h3>
                    <p className="av-role__body">{role.body}</p>
                    <button type="button" className="av-quiet av-role__link" onClick={() => showOnStage([1,6,7,2][index])}>{copy.performance.castLink} {avatarProfiles[[1,6,7,2][index]].name}<span aria-hidden="true">↗</span></button>
                  </li>
                ))}
              </ol>
              <p className="av-roles__note">{copy.roles.note}</p>
            </section>
          </section>

          <section className="av-horizon" id="avatars-horizon" data-header-scene="avatars-horizon" aria-labelledby="avatars-horizon-title">
            <div className="av-horizon__inner">
              <div>
                <p className="av-label">{copy.horizon.label}</p>
                <h2 id="avatars-horizon-title" className="av-horizon__heading">{copy.horizon.heading}</h2>
                <p className="av-horizon__line">{copy.horizon.line}</p>
                <p className="av-horizon__body">{copy.horizon.body}</p>
                <p className="av-flag">{copy.horizon.flag}</p>
                <p className="av-horizon__frontier">{copy.horizon.frontier}</p>
                <p className="av-horizon__tech">{copy.horizon.technology}</p>
              </div>
              <figure className="av-horizon__figure">
                <SpatialHorizonFigure label={copy.horizon.figureLabel} />
                <figcaption>{copy.horizon.figureNote}</figcaption>
              </figure>
            </div>
          </section>

          <section className="av-closing" data-header-scene="avatars-closing" aria-labelledby="avatars-closing-title">
            <div className="av-closing__inner" data-sound-safe-area>
              <p className="av-label">{copy.closing.label}</p>
              <h2 id="avatars-closing-title" className="av-closing__heading">{copy.closing.heading}</h2>
              <p className="av-closing__body">{copy.closing.body}</p>
              <button type="button" className="av-button" onClick={onOpenProject} aria-haspopup="dialog">{copy.closing.cta}<span aria-hidden="true">↗</span></button>
            </div>
          </section>
        </main>
        <SiteFooterV2 variant="studio" hideClosingSignal onOpenProject={onOpenProject} />
      </PageSurface>
    </>
  );
}
