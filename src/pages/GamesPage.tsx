import { useCallback, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { useLocation } from "react-router-dom";
import Header from "../ui/Header";
import PageSurface from "../ui/PageSurface";
import SiteFooterV2 from "../ui/SiteFooterV2";
import { useI18n } from "../i18n";
import {
  gameMediaKindLabel,
  gameProofLabel,
  games,
  gamesCopy,
  type GameLocale,
  type GameMedia,
  type GameMediaKind,
} from "../data/games";
import "../ui/games/gamesPage.css";

type GamesPageProps = { drawerOpen?: boolean; onOpenProject?: () => void; onCloseProject?: () => void };

const legendKinds: GameMediaKind[] = ["gameplay-capture", "prototype-capture", "realtime-render", "offline-render", "concept"];

const indexFromHash = (hash: string) => games.findIndex((game) => game.slug === hash.replace(/^#/, ""));

function GameImage({ media, lang, eager = false, sizes, decorative = false, className }: {
  media: GameMedia;
  lang: GameLocale;
  eager?: boolean;
  sizes: string;
  decorative?: boolean;
  className?: string;
}) {
  return (
    <img
      className={className}
      src={`${media.base}-${media.widths[media.widths.length - 1]}.webp`}
      srcSet={media.widths.map((width) => `${media.base}-${width}.webp ${width}w`).join(", ")}
      sizes={sizes}
      width={media.width}
      height={media.height}
      alt={decorative ? "" : media.alt[lang]}
      aria-hidden={decorative || undefined}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
    />
  );
}

function KindTag({ kind, lang }: { kind: GameMediaKind; lang: GameLocale }) {
  return <span className={`games-kind games-kind--${kind}`}>{gameMediaKindLabel[kind][lang]}</span>;
}

/** Games: one stage for the selected world (its strongest real frame, title, status and proof), a production file for the
 *  same selection, and the proof standard that explains every label. Selection is explicit (tabs, keyboard, touch); the page
 *  never auto-advances or takes over scrolling, and images load for a world only once it is selected or previewed. */
export default function GamesPage({ drawerOpen, onOpenProject, onCloseProject }: GamesPageProps) {
  const { locale } = useI18n();
  const lang: GameLocale = locale === "es" ? "es" : "en";
  const copy = gamesCopy[lang];
  const location = useLocation();
  const [active, setActive] = useState(() => Math.max(0, indexFromHash(location.hash)));
  const [warm, setWarm] = useState<ReadonlySet<number>>(() => new Set([Math.max(0, indexFromHash(location.hash))]));
  const [routedHash, setRoutedHash] = useState(location.hash);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // A link to /games#<slug> while the page is open selects that world (state adjusted during render, not in an effect).
  if (location.hash !== routedHash) {
    setRoutedHash(location.hash);
    const index = indexFromHash(location.hash);
    if (index >= 0) {
      setActive(index);
      setWarm((current) => (current.has(index) ? current : new Set(current).add(index)));
    }
  }
  const game = games[active];

  const preview = useCallback((index: number) => {
    setWarm((current) => (current.has(index) ? current : new Set(current).add(index)));
  }, []);

  const select = useCallback((index: number) => {
    preview(index);
    setActive(index);
    // The selection is shareable; replaceState keeps it out of the history stack and does not scroll.
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}#${games[index].slug}`);
  }, [preview]);

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next = -1;
    if (event.key in step) next = (index + step[event.key] + games.length) % games.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = games.length - 1;
    if (next < 0) return;
    event.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  };

  const hero = game.media[0];
  const accentStyle = { "--games-accent": game.accent } as CSSProperties;

  return (
    <>
      <Header drawerOpen={drawerOpen} onOpenProject={onOpenProject} onCloseProject={onCloseProject} />
      <PageSurface className="games-page">
        <main id="main-content" className="games-main" style={accentStyle}>
          <section className="games-stage" data-header-scene="games-stage" aria-labelledby="games-page-title">
            <div className="games-stage__ambient" aria-hidden="true">
              {games.map((item, index) =>
                warm.has(index) ? (
                  <img
                    key={item.slug}
                    className={index === active ? "is-active" : undefined}
                    src={`${item.media[0].base}-${item.media[0].widths[0]}.webp`}
                    alt=""
                    decoding="async"
                  />
                ) : null,
              )}
            </div>

            <div className="games-stage__inner">
              <header className="games-stage__intro">
                <p className="games-eyebrow">
                  <span>{copy.eyebrow}</span>
                  <span aria-hidden="true">{String(games.length).padStart(2, "0")}</span>
                </p>
                <h1 id="games-page-title" className="games-stage__page-title">{copy.title}</h1>
                <p className="games-stage__lede">{copy.lede}</p>
              </header>

              <div className="games-selector" role="tablist" aria-label={copy.selector} data-sound-safe-area>
                {games.map((item, index) => (
                  <button
                    key={item.slug}
                    ref={(node) => { tabs.current[index] = node; }}
                    type="button"
                    role="tab"
                    id={`games-tab-${item.slug}`}
                    aria-selected={index === active}
                    aria-controls="games-panel"
                    tabIndex={index === active ? 0 : -1}
                    className="games-selector__tab"
                    style={{ "--games-tab-accent": item.accent } as CSSProperties}
                    onClick={() => select(index)}
                    onPointerEnter={() => preview(index)}
                    onFocus={() => preview(index)}
                    onKeyDown={(event) => onTabKey(event, index)}
                  >
                    <span className="games-selector__index">{item.index}</span>
                    <span className="games-selector__title">{item.title}</span>
                    <span className="games-selector__meta">{gameProofLabel[item.proof][lang]}</span>
                  </button>
                ))}
              </div>

              <div className="games-panel" role="tabpanel" id="games-panel" aria-labelledby={`games-tab-${game.slug}`}>
                {/* All four copies share one grid cell (the tallest sets the height), so selecting a world never moves the tabs. */}
                <div className="games-panel__copies">
                  {games.map((item, index) => (
                    <div
                      key={item.slug}
                      className={index === active ? "games-panel__copy is-active" : "games-panel__copy"}
                      aria-hidden={index !== active || undefined}
                      inert={index !== active || undefined}
                    >
                      <p className="games-panel__index">{item.index} / {String(games.length).padStart(2, "0")}</p>
                      <h2 className="games-panel__title">
                        {item.titlePrefix ? <span className="games-panel__prefix">{item.titlePrefix}</span> : null}
                        <span className="games-panel__main">{item.titleMain}</span>
                      </h2>
                      <p className="games-panel__genre">{item.genre[lang]}</p>
                      <p className="games-panel__premise">{item.premise[lang]}</p>
                      <dl className="games-panel__status">
                        <div><dt>{copy.engine}</dt><dd>{item.engine[lang]}</dd></div>
                        <div><dt>{copy.stage}</dt><dd>{item.stage[lang]}</dd></div>
                        <div><dt>{copy.shown}</dt><dd>{[...new Set(item.media.map((media) => media.kind))].map((kind) => gameMediaKindLabel[kind][lang]).join(" · ")}</dd></div>
                      </dl>
                      {item.demo ? (
                        <a className="games-panel__demo" href={item.demo.href} target="_blank" rel="noopener noreferrer">
                          <span>{item.demo.label[lang]}</span>
                          <span aria-hidden="true">↗</span>
                          <span className="games-sr">({copy.external})</span>
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>

                <figure className="games-panel__view">
                  <div className="games-panel__frame">
                    {games.map((item, index) =>
                      warm.has(index) ? (
                        <GameImage
                          key={item.slug}
                          media={item.media[0]}
                          lang={lang}
                          eager={index === active}
                          decorative={index !== active}
                          sizes="(min-width: 1024px) 58vw, 100vw"
                          className={index === active ? "is-active" : undefined}
                        />
                      ) : null,
                    )}
                    <KindTag kind={hero.kind} lang={lang} />
                  </div>
                  <figcaption className="games-panel__captions" data-sound-safe-area>
                    {games.map((item, index) => (
                      <span key={item.slug} className={index === active ? "games-panel__caption is-active" : "games-panel__caption"} aria-hidden={index !== active || undefined}>
                        {item.media[0].caption[lang]}
                      </span>
                    ))}
                  </figcaption>
                </figure>
              </div>
            </div>
          </section>

          <section className="games-file" data-header-scene="games-ledger" aria-labelledby="games-file-title">
            <div className="games-file__inner" key={game.slug}>
              <header className="games-file__head">
                <p className="games-eyebrow"><span>{copy.file}</span><span aria-hidden="true">{game.index}</span></p>
                <h2 id="games-file-title" className="games-file__title">{game.title}</h2>
                <p className="games-file__lead">{copy.fileLead}</p>
              </header>

              <dl className="games-file__facts">
                {game.facts.map((fact) => (
                  <div key={fact.label.en}>
                    <dt>{fact.label[lang]}</dt>
                    <dd>{fact.value[lang]}</dd>
                  </div>
                ))}
              </dl>

              <div className="games-file__lists">
                <div>
                  <h3>{copy.inBuild}</h3>
                  <ul>{game.inBuild[lang].map((line) => <li key={line}>{line}</li>)}</ul>
                </div>
                <div className="games-file__planned">
                  <h3>{copy.planned}</h3>
                  <ul>{game.planned[lang].map((line) => <li key={line}>{line}</li>)}</ul>
                </div>
              </div>

              <div className="games-file__evidence">
                <h3 className="games-eyebrow"><span>{copy.media}</span><span aria-hidden="true">{String(game.media.length).padStart(2, "0")}</span></h3>
                <div className={`games-file__strip games-file__strip--${game.media.length}`}>
                  {game.media.map((media) => (
                    <figure key={media.id} className={`games-shot games-shot--${media.orientation}`} style={{ "--shot-ratio": (media.width / media.height).toFixed(3) } as CSSProperties}>
                      <div className="games-shot__frame">
                        <GameImage media={media} lang={lang} sizes={media.orientation === "portrait" ? "(min-width: 1024px) 18vw, 50vw" : "(min-width: 1024px) 40vw, 100vw"} />
                      </div>
                      <figcaption>
                        <KindTag kind={media.kind} lang={lang} />
                        <span>{media.caption[lang]}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="games-standard" data-header-scene="games-standard" aria-labelledby="games-standard-title">
            <div className="games-standard__inner">
              <div className="games-standard__head">
                <p className="games-eyebrow"><span>{copy.standardEyebrow}</span></p>
                <h2 id="games-standard-title" className="games-standard__title">{copy.standardTitle}</h2>
                <p className="games-standard__body">{copy.standardBody}</p>
                <p className="games-standard__note">{copy.standardNote}</p>
              </div>
              <dl className="games-standard__legend">
                {legendKinds.map((kind) => (
                  <div key={kind} className={kind === "concept" ? "is-excluded" : undefined}>
                    <dt><KindTag kind={kind} lang={lang} /></dt>
                    <dd>{copy.legend[kind]}</dd>
                  </div>
                ))}
              </dl>
              <div className="games-closing">
                <p className="games-closing__title">{copy.closingTitle}</p>
                <p className="games-closing__body">{copy.closingBody}</p>
                {onOpenProject ? (
                  <button type="button" className="games-closing__action" onClick={onOpenProject} aria-haspopup="dialog">
                    {copy.closingCta}<span aria-hidden="true">↗</span>
                  </button>
                ) : null}
              </div>
            </div>
          </section>
        </main>
        <SiteFooterV2 variant="studio" hideClosingSignal onOpenProject={onOpenProject} />
      </PageSurface>
    </>
  );
}
