import { avatarMedia, spokenClipFor } from "../../data/avatarMedia";
import { avatarProfiles, type AvatarLocale } from "../../data/avatarProfiles";
import type { AvatarsCopy } from "../../data/avatarsCopy";

type Props = { lang: AvatarLocale; copy: AvatarsCopy["library"]; active: number; onSelect: (index: number) => void };

/** The Cast (AVATARS-02): editorial discovery of the eight identities: name, working role, scenario and the real media
 *  state. The stage's trace stays the quick switch; choosing a card puts that identity on stage (no sound starts). */
export default function CastLibrary({ lang, copy, active, onSelect }: Props) {
  return (
    <section className="av-library" data-header-scene="avatars-chamber" aria-labelledby="avatars-library-title">
      <div className="av-library__inner">
        <header className="av-library__head">
          <p className="av-label">{copy.label}</p>
          <h2 id="avatars-library-title" className="av-library__heading">{copy.heading}</h2>
          <p className="av-library__lede">{copy.lede}</p>
        </header>
        <ol className="av-library__grid" data-sound-safe-area>
          {avatarProfiles.map((profile, index) => {
            const media = avatarMedia[profile.id];
            const pilot = Boolean(spokenClipFor(media, lang));
            const recorded = media?.availability === "release-candidate" || media?.availability === "approved-demo";
            const status = pilot ? recorded ? copy.statusRecorded : copy.statusPilot : media ? copy.statusUnavailable : copy.statusConcept;
            const selected = index === active;
            return (
              <li key={profile.id} className="av-library__item">
                <button
                  type="button"
                  className="av-card"
                  aria-current={selected ? "true" : undefined}
                  aria-label={`${profile.name}, ${profile.role[lang]}. ${status}. ${selected ? copy.onStage : copy.show}`}
                  onClick={() => onSelect(index)}
                >
                  <span className="av-card__frame">
                    <img src={profile.cardWebp} alt="" width={800} height={1000} loading="lazy" decoding="async" draggable={false} />
                  </span>
                  <span className="av-card__meta" aria-hidden="true">
                    <span className="av-card__index">{profile.displayNumber}<span> · {profile.role[lang]}</span></span>
                    <span className="av-card__name">{profile.name}</span>
                    <span className="av-card__scenario">{profile.scenario[lang]}</span>
                    <span className="av-card__status" data-state={pilot ? "pilot" : "concept"}>{selected ? `${copy.onStage} · ${status}` : status}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <p className="av-library__note">{copy.note}</p>
      </div>
    </section>
  );
}
