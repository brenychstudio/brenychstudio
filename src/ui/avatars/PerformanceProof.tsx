import { useRef, type CSSProperties } from 'react';
import { avatarProfiles, type AvatarLocale } from '../../data/avatarProfiles';
import { avatarMedia, spokenClipFor } from '../../data/avatarMedia';
import type { AvatarsCopy } from '../../data/avatarsCopy';
import StagePresence from './StagePresence';

export default function PerformanceProof({ lang, copy }: { lang: AvatarLocale; copy: AvatarsCopy }) {
 const stage = useRef<HTMLDivElement>(null);
 const profile = avatarProfiles[1]; const media = avatarMedia[profile.id];
 if (!spokenClipFor(media, lang)) return null;
 return <div className="av-performance" aria-labelledby="avatars-performance-title">
   <div className="av-performance__film" ref={stage}>
     <StagePresence profile={profile} media={media} lang={lang} copy={copy.presence} stage={stage} instanceId="proof">
       <img className="is-active" src={profile.portraitWebp} alt="Aria" loading="lazy" decoding="async" width={profile.portraitSize} height={profile.portraitSize} style={{'--focal':profile.imageFocalPoint,'--zoom':profile.stageZoom} as CSSProperties} />
     </StagePresence>
   </div>
   <div className="av-performance__story">
     <p className="av-label">{copy.performance.label}</p>
     <h3 id="avatars-performance-title">{copy.performance.heading}</h3>
     <p>{copy.performance.body}</p>
     <dl>{copy.performance.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
     <p className="av-performance__note">{copy.performance.note}</p>
   </div>
 </div>;
}
