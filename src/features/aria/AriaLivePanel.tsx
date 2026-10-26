import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { useSound } from '../../stage/audio/useSound';
import { usePresenter } from '../../ui/presenter/presenterContext';
import { startSpaPageTransition } from '../../ui/pageTransition';
import { avatarProfiles } from '../../data/avatarProfiles';
import { createStudioAria } from './studioRuntime';
import { ariaPhaseLabels, type AriaSessionPhase } from './sessionView';
import type { LiveTranscriptEntry } from './liveConsultation';
import type { AdvisorHealth, ToolReceiptPayload } from './protocol';
import './ariaLive.css';

type Runtime = ReturnType<typeof createStudioAria>;
const privateLab = import.meta.env.VITE_ARIA_LIVE === 'private-lab';
const portrait = avatarProfiles.find(profile => profile.id === 'avatar-02')!;

// Language changes dispose capture, playback and pending actions before starting a new session.
export default function AriaLivePanel() {
 const { locale } = useI18n();
 const presenter = usePresenter();
 const { pathname } = useLocation();
 if (!privateLab && !/^(\/es)?(\/avatars)?\/?$/.test(pathname)) return null;
 // HOME owns the controls while its menu or tour is open. Unmount also releases an Aria session.
 if (presenter.state.phase !== 'closed') return null;
 return <AriaSessionPanel key={locale} locale={locale === 'es' ? 'es' : 'en'} />;
}

function AriaSessionPanel({ locale }: { locale: 'en' | 'es' }) {
 const navigate = useNavigate(); const presenter = usePresenter(); const sound = useSound(); const es = locale === 'es';
 const location = useLocation(); const onCastPage = /\/(?:es\/)?avatars\/?$/.test(location.pathname);
 const [entryHost, setEntryHost] = useState<HTMLElement | null>(null);
 const [open, setOpen] = useState(false); const [text, setText] = useState('');
 const [expanded, setExpanded] = useState(true); const [microphone, setMicrophone] = useState('off');
 const [viewport, setViewport] = useState({ height: window.innerHeight, inset: 0 });
 const [phase, setPhase] = useState<AriaSessionPhase>('available');
 const [entries, setEntries] = useState<LiveTranscriptEntry[]>([]); const [receipts, setReceipts] = useState<ToolReceiptPayload[]>([]);
 const [health, setHealth] = useState<AdvisorHealth | null>(null); const [ready, setReady] = useState(false);
 const [canReplay, setCanReplay] = useState(false); const [starting, setStarting] = useState(false);
 const [failure, setFailure] = useState<'connection' | 'microphone-denied' | 'voice'>('connection');
 const host = useRef<HTMLDivElement>(null); const runtime = useRef<Runtime | null>(null); const trigger = useRef<HTMLButtonElement>(null);
 const closeButton = useRef<HTMLButtonElement>(null); const input = useRef<HTMLInputElement>(null);
 const generation = useRef(0); const startupTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
 const mock = health?.provider === 'mock'; const busy = starting || phase === 'connecting' || phase === 'processing' || phase === 'speaking';

 // The cast has its own entry in the introduction; a floating button must never cover its controls.
 useEffect(() => {
   if (!onCastPage) { setEntryHost(null); return; }
   const findEntry = () => { const entry = document.getElementById('aria-preview-entry'); if (entry) setEntryHost(entry); return Boolean(entry); };
   if (findEntry()) return;
   const observer = new MutationObserver(() => { if (findEntry()) observer.disconnect(); });
   observer.observe(document.body, { childList: true, subtree: true });
   return () => observer.disconnect();
 }, [onCastPage]);

 useEffect(() => {
   const update = () => { const v = window.visualViewport; setViewport({ height: v?.height ?? window.innerHeight, inset: v ? Math.max(0, window.innerHeight - v.height - v.offsetTop) : 0 }); };
   update(); window.visualViewport?.addEventListener('resize', update); window.visualViewport?.addEventListener('scroll', update); window.addEventListener('resize', update);
   return () => { window.visualViewport?.removeEventListener('resize', update); window.visualViewport?.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
 }, []);

 useEffect(() => () => { generation.current++; clearTimeout(startupTimer.current); runtime.current?.dispose(); runtime.current = null; }, []);
 useEffect(() => {
   if (!open) return;
   closeButton.current?.focus();
   const userNavigation = (event: MouseEvent) => {
     if (!event.isTrusted || !(event.target instanceof Element) || event.target.closest('.aria-live,.aria-live-trigger')) return;
     if (event.target.closest('a,header button,.studio-presence__question,.av-presence__play,.av-card,.av-port')) runtime.current?.stop();
   };
   const otherPlayback = (event: Event) => { if (event.target instanceof HTMLMediaElement && !event.target.muted) runtime.current?.stop(); };
   const timer = window.setInterval(() => {
     const view = runtime.current?.view();
     if (view) { setPhase(view.phase); setReady(view.ready && view.phase !== 'failed'); setCanReplay(view.canReplay); setFailure(view.failure); setMicrophone(view.microphone); }
   }, 150);
   document.addEventListener('click', userNavigation, true); document.addEventListener('play', otherPlayback, true);
   return () => { clearInterval(timer); document.removeEventListener('click', userNavigation, true); document.removeEventListener('play', otherPlayback, true); };
 }, [open]);

 function endSession() {
   generation.current++; clearTimeout(startupTimer.current);
   runtime.current?.dispose(); runtime.current = null;
   setMicrophone('off'); setHealth(null); setStarting(false); setReady(false); setCanReplay(false); setPhase('ended');
 }
 function close() { endSession(); setOpen(false); trigger.current?.focus(); }
 async function start() {
   if (!privateLab || !host.current || starting) return;
   const ticket = ++generation.current;
   runtime.current?.dispose(); runtime.current = null;
   setMicrophone('off'); setHealth(null); setReady(false); setCanReplay(false); setStarting(true); setPhase('connecting'); setEntries([]); setReceipts([]);
   presenter.close(false); sound.stopAmbient();
   document.querySelectorAll<HTMLMediaElement>('video,audio').forEach(media => { if (!media.muted) media.pause(); });
   const r = createStudioAria({ host: host.current, locale: () => locale,
     navigate: (path, signal) => startSpaPageTransition(navigate, path, undefined, signal),
     onTranscript: entry => { if (generation.current === ticket) setEntries(old => [...old.filter(item => item.id !== entry.id), entry].slice(-20)); },
     onStatus() {}, onReceipt: receipt => { if (generation.current === ticket) setReceipts(old => [...old, receipt].slice(-8)); },
   });
   runtime.current = r;
   (window as unknown as { __studioAria?: { state(): unknown } }).__studioAria = { state: r.debug };
   try {
     const checked = await Promise.race([r.start(), new Promise<never>((_, reject) => { startupTimer.current = setTimeout(() => reject(new Error('Connection timed out')), 12000); })]);
     if (generation.current !== ticket) return;
     setHealth(checked); setPhase(r.view().phase); setReady(r.view().ready); input.current?.focus();
   } catch {
     r.dispose();
     if (generation.current === ticket) { runtime.current = null; setPhase('failed'); setFailure('connection'); setReady(false); }
   } finally { if (generation.current === ticket) { clearTimeout(startupTimer.current); setStarting(false); } }
 }
 function send() { const message = text.trim(); if (!message || !ready || busy || !runtime.current) return; setText(''); void runtime.current.send(message); }
 const status = ariaPhaseLabels[locale][phase];
 const microphoneHeld = microphone === 'thinking' || microphone === 'speaking';
 const recording = microphone === 'listening' || microphone === 'hearing' || microphoneHeld;
 const latestCaption = entries.filter(entry => entry.role === 'advisor').at(-1)?.text;
 const viewportStyle = { '--aria-visible-height': `${viewport.height}px`, '--aria-keyboard-inset': `${viewport.inset}px` } as CSSProperties;
 const launcher = <button ref={trigger} className={`aria-live-trigger${onCastPage ? ' aria-live-trigger--inline' : ''}`} onClick={() => setOpen(true)} aria-expanded={open} aria-controls="aria-live-panel" data-sound-safe-area>Aria · {es ? 'Vista previa privada' : 'Private preview'}</button>;
 return <>
   {onCastPage ? entryHost?.isConnected && createPortal(launcher, entryHost) : launcher}
   {open && <aside id="aria-live-panel" className="aria-live" data-presentation={expanded ? 'focus' : 'compact'} data-short-viewport={viewport.height < 520} style={viewportStyle} data-phase={phase} aria-labelledby="aria-live-title" data-sound-safe-area onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); close(); } }}>
     <header><div><strong id="aria-live-title">Aria</strong><small>{mock ? (es ? 'MOCK · simulación local' : 'MOCK · local simulation') : es ? 'Conversación · vista previa privada' : 'Conversation · private preview'}</small></div><button ref={closeButton} onClick={close} aria-label={es ? 'Cerrar Aria' : 'Close Aria'}>×</button><button className="aria-live__presentation" aria-expanded={expanded} aria-controls="aria-live-visual aria-live-actions aria-live-details aria-live-form" onClick={() => setExpanded(value => !value)}>{expanded ? (es ? 'Contraer' : 'Collapse') : (es ? 'Ampliar' : 'Expand')}</button></header>
     <div className="aria-live__identity"><img src={portrait.thumbWebp} alt="Aria" width="64" height="64" /><p>{es ? 'Tu guía por Brenych Studio.' : 'Your guide to Brenych Studio.'}<span>{es ? 'Ideas claras. Una conversación a tu ritmo.' : 'Clear ideas. A conversation at your pace.'}</span></p></div>
     <div className="aria-live__visual" id="aria-live-visual">
       <img className="aria-live__poster" src={portrait.portraitWebp} alt={es ? 'Retrato de Aria' : 'Aria portrait'} />
       <div className="aria-live__portrait" ref={host} />
       <span className="aria-live__visual-label">{mock ? (es ? 'MOCK · retrato estático' : 'MOCK · still portrait') : !privateLab || !ready || phase === 'failed' || phase === 'ended' ? (es ? 'Retrato · sin conexión en directo' : 'Portrait · live connection unavailable') : (es ? 'Sesión privada' : 'Private session')}</span>
       {phase === 'speaking' && latestCaption && <p className="aria-live__caption">{latestCaption}</p>}
     </div>
     <p className="aria-live__status" role="status" aria-live="polite"><span aria-hidden="true" />{status}<span className="aria-live__microphone" data-recording={recording}>{microphoneHeld ? (es ? 'Micrófono activo · sin enviar audio' : 'Microphone on · not sending audio') : recording ? (es ? 'Micrófono activo' : 'Microphone on') : microphone === 'starting' ? (es ? 'Permiso del micrófono…' : 'Microphone permission…') : (es ? 'Micrófono apagado' : 'Microphone off')}</span></p>
     <div id="aria-live-actions" className="aria-live__actions">
       <button disabled={!ready || mock || busy} onClick={() => void runtime.current?.microphone()}>{es ? 'Activar micrófono' : 'Start microphone'}</button>
       <button disabled={!runtime.current} onClick={() => { runtime.current?.stop(); setPhase('interrupted'); }}>{es ? 'Interrumpir' : 'Interrupt'}</button>
       <button disabled={!canReplay || !ready} onClick={() => void runtime.current?.replay()}>{es ? 'Repetir voz' : 'Replay voice'}</button>
       <button disabled={!runtime.current && phase === 'ended'} onClick={endSession}>{es ? 'Finalizar sesión' : 'End session'}</button>
     </div>
     <div id="aria-live-details" className="aria-live__details">
     {!privateLab && <p className="aria-live__notice">{es ? 'Puedes explorar esta interfaz. La conversación en directo estará disponible después de verificar la conexión. El micrófono permanece apagado.' : 'Explore the conversation interface. Live conversation will be available after connection verification. Your microphone stays off.'}</p>}
     {phase === 'failed' && <p className="aria-live__notice">{failure === 'microphone-denied' ? (es ? 'El permiso del micrófono está desactivado. Puedes cambiarlo en tu navegador y volver a conectar.' : 'Microphone permission is off. You can change it in your browser and reconnect.') : failure === 'voice' ? (es ? 'La voz no está disponible. La respuesta permanece en la transcripción. Vuelve a conectar para intentarlo de nuevo.' : 'Voice playback is unavailable. The reply remains in the transcript. Reconnect to try again.') : (es ? 'No se pudo mantener la conexión. Puedes volver a conectar o seguir explorando el estudio.' : 'The connection could not be maintained. Reconnect or keep exploring the studio.')}</p>}
     {privateLab && (!health || phase === 'failed') && <button className="aria-live__start" disabled={starting} onClick={() => void start()}>{starting ? (es ? 'Conectando…' : 'Connecting…') : phase === 'failed' ? (es ? 'Volver a conectar' : 'Reconnect') : (es ? 'Preparar sesión' : 'Prepare session')}</button>}
     <p className="aria-live__consent">{mock ? (es ? 'Simulación local. Sin IA real, micrófono ni avatar en directo.' : 'Local simulation. No real AI, microphone or live avatar.') : privateLab ? (es ? 'Al activar el micrófono, ElevenLabs transcribe tu voz. Claude recibe el texto. Interrumpir detiene la captura.' : 'Starting the microphone sends your voice to ElevenLabs for transcription. Claude receives the text. Interrupt ends capture.') : (es ? 'Sin grabación ni envío de audio en esta vista previa.' : 'This preview does not record or send audio.')}</p>
     <div className="aria-live__transcript" role="log" aria-live="polite" aria-relevant="additions text" aria-label={es ? 'Transcripción' : 'Transcript'}>{entries.length ? entries.map(entry => <p key={entry.id} data-failed={entry.failed || undefined}><b>{entry.role === 'advisor' ? 'Aria' : es ? 'Tú' : 'You'}</b> {entry.text}</p>) : <p className="aria-live__empty">{es ? 'Tus mensajes y las respuestas aparecerán aquí.' : 'Your messages and replies will appear here.'}</p>}</div>

     {receipts.length > 0 && <ul className="aria-live__receipts" aria-label={es ? 'Acciones confirmadas' : 'Website action receipts'}>{receipts.map(receipt => <li key={receipt.receiptId} data-status={receipt.status}>{receipt.status === 'rejected' ? (es ? 'Acción cancelada o no disponible.' : 'Action cancelled or unavailable.') : (es ? 'Navegación confirmada.' : 'Navigation confirmed.')}</li>)}</ul>}
     <Link className="aria-live__sample" to={(es ? '/es' : '') + '/avatars#avatar-02'} onClick={close}>{es ? 'Ver la presentación grabada de Aria' : 'Watch Aria’s recorded introduction'} <span aria-hidden="true">↗</span></Link>
     </div>
     <form id="aria-live-form" onSubmit={event => { event.preventDefault(); send(); }}><input ref={input} value={text} onChange={event => setText(event.target.value)} disabled={!ready} maxLength={500} aria-label={es ? 'Mensaje para Aria' : 'Message for Aria'} placeholder={es ? 'Pregúntame por el estudio…' : 'Ask about the studio…'} /><button type="submit" disabled={!ready || busy || !text.trim()}>{es ? 'Enviar' : 'Send'}</button></form>
   </aside>}
 </>;
}
