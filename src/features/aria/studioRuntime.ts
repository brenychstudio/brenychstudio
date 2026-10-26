import { avatarProfiles } from '../../data/avatarProfiles';
import { runDirectorAction, type DirectorRuntime } from '../../ui/presenter/directorRuntime';
import { createBpeLivePresence } from './BpeLivePresenceAdapter';
import { createLiveAdvisorClient } from './liveAdvisorClient';
import { createLiveConsultation, type LiveTranscriptEntry } from './liveConsultation';
import { createLiveVoice } from './liveVoice';
import { createVoiceConversation, type ConversationState } from './voiceConversation';
import { createBrowserSpeech } from './speechFallback';
import type { ClipPresenceAdapter } from './presenceTypes';
import type { AdvisorHealth, SiteLocale, ToolReceiptPayload } from './protocol';
import { parseStudioTool } from './studioTools';
import type { AriaSessionPhase } from './sessionView';

export const ariaPortraitSha256 = '2c2e0c2e35195a2c182c4a03dff336303b494cd3fe920f855d5890b0265c1786';
const portrait = avatarProfiles.find(profile => profile.id === 'avatar-02')!;

// Only a still fallback. No canned speaking clip or unrelated browser voice can stand in for live Aria.
function createStill(): ClipPresenceAdapter {
 let image: HTMLImageElement | null = null;
 return { id: 'aria-still', async mount(host) {
   image = new Image(); image.src = portrait.portraitWebp; image.alt = 'Aria';
   image.style.cssText = 'width:100%;height:100%;object-fit:cover'; host.append(image);
 }, setState() {}, async speak() {}, interrupt() {}, dispose() { image?.remove(); },
 setPresentation() {}, setMuted() {}, getSnapshot: () => ({ tier: 'still' }), subscribe: () => () => {},
 prepareVoice: async () => null, hasPairedClip: () => false, setClipPairing() {}, debug: () => ({ tier: 'still', syntheticMotion: false }) };
}

export function createStudioAria(options: {
 host: HTMLElement; locale: () => SiteLocale; navigate: (path: string, signal: AbortSignal) => void;
 onTranscript: (entry: LiveTranscriptEntry) => void;
 onStatus: (status: string) => void; onReceipt: (receipt: ToolReceiptPayload) => void;
}) {
 const client = createLiveAdvisorClient();
 let health: AdvisorHealth | null = null;
 let disposed = false; let actionController = new AbortController(); let receiptSequence = 0;
 let conversationState: ConversationState = 'off'; let latestReply = ''; let busy = false; let sendSequence = 0;
 let phase: AriaSessionPhase = 'available'; let failed = false;
 let failure: 'connection' | 'microphone-denied' | 'voice' = 'connection';
 let rendererStartedAt: number | null = null;
 const face = createBpeLivePresence({ still: createStill(), expectedPortraitSha256: ariaPortraitSha256,
   url: `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/api/aria/presence`, leadSeconds: 1.4, jpegQuality: 50 });
 const voice = createLiveVoice({ client, fallback: createBrowserSpeech(), voiceName: () => health?.voice.voiceName || null, tap: face.voiceTap });
 const consultation = createLiveConsultation({ client, voice,
   readContext: () => ({ route: location.pathname, revision: receiptSequence, siteLocale: options.locale() }),
   siteLocale: options.locale,
   setSiteLocale: () => ({ ok: false, status: 'rejected', summary: 'Use the site language control.', changed: [], receiptId: 'u-0000' }),
 });
 const conversation = createVoiceConversation({ client, language: options.locale,
   onUtterance: heard => { void send(heard.text, { spokenLanguage: heard.language, speechEndAt: heard.speechEndAt, sttFinalAt: heard.finalAt }); },
   onState: (state, detail) => { conversationState = state; if (state === 'error' || detail === 'denied' || detail === 'error') { failed = true; failure = detail === 'denied' ? 'microphone-denied' : 'connection'; } options.onStatus(detail || state); }, onInterim: text => options.onStatus(text ? `Listening: ${text}` : conversationState),
   maxTurns: 6, maxMinutes: 5,
 });
 const offs = [consultation.onTranscript(entry => {
   if (disposed) return;
   if (entry.failed) failed = true;
   if (entry.role === 'advisor' && entry.final) latestReply = entry.text;
   options.onTranscript(entry);
 }), consultation.onUtterance(utterance => {
   conversation.hold('speaking');
   void voice.speak(utterance.text).then(outcome => {
     if (disposed) return;
     if (outcome.status === 'completed') { options.onStatus('Ready'); if (!busy) conversation.listen(); }
     else if (outcome.status !== 'interrupted') { conversation.end('error'); failed = true; failure = 'voice'; options.onStatus('Approved voice unavailable — text only'); }
   });
 }), consultation.onToolCall(async call => {
   const parsed = parseStudioTool(call.name, call.input);
   const receiptId = `r-${String(++receiptSequence).padStart(4, '0')}`;
   const result = (status: ToolReceiptPayload['status'], summary: string, changed: string[] = []): ToolReceiptPayload => ({ ok: status !== 'rejected', status, summary, changed, receiptId });
   if (!parsed.ok || disposed || actionController.signal.aborted) return result('rejected', 'Cancelled or invalid website action.');
   const signal = actionController.signal;
   const navigate = (path: string) => { if (!signal.aborted) options.navigate(path, signal); };
   const runtime: DirectorRuntime = { locale: options.locale(), signal,
     openPage: navigate, replaceHash: navigate };
   try {
     // Product/section/spatial actions use existing HOME scenes; return to HOME first.
     if (['product','anchor','spatial'].includes(parsed.action.kind)) {
       const home = options.locale() === 'es' ? '/es/' : '/';
       if ((location.pathname.replace(/\/$/,'') || '/') !== (home.replace(/\/$/,'') || '/')) {
         navigate(home);
         const end = performance.now() + 5000;
         while (!document.querySelector('#ecosystem') && performance.now() < end) {
           if (runtime.signal.aborted) throw new DOMException('Cancelled', 'AbortError');
           await new Promise(resolve => setTimeout(resolve, 50));
         }
       }
     }
     if (parsed.action.kind === 'offer-system') await runDirectorAction({ kind: 'route', path: '/offer' }, runtime);
     const status = await runDirectorAction(parsed.action, runtime);
     const receipt = result(status === 'done' ? 'applied' : 'rejected', `Website action ${call.name}: ${status}.`, status === 'done' ? [call.name] : []);
     options.onReceipt(receipt); return receipt;
   } catch {
     const receipt = result('rejected', 'Website action cancelled or failed.'); options.onReceipt(receipt); return receipt;
   }
 })];
 async function send(text: string, meta = {}) {
   if (disposed || !health?.live || (health.provider !== 'mock' && face.bpeStatus() !== 'ready')) { options.onStatus('Live session is not ready'); return; }
   const sequence = ++sendSequence; failed = false; phase = 'processing';
   actionController.abort(); actionController = new AbortController(); busy = true;
   consultation.cancel(); conversation.hold('thinking'); options.onStatus('Thinking');
   consultation.setLanguage(options.locale());
   try { await consultation.send(text, meta); }
   finally { if (sequence === sendSequence && !disposed) { busy = false; phase = failed ? 'failed' : 'available'; if (!voice.isActive()) conversation.listen(); } }
 }
 function stop() { sendSequence++; actionController.abort(); busy = false; consultation.cancel(); conversation.end('ended'); voice.cancel(); face.interrupt(); phase = 'interrupted'; options.onStatus('Stopped'); }
 const hide = () => { if (document.visibilityState === 'hidden') stop(); };
 document.addEventListener('visibilitychange', hide);
 window.addEventListener('popstate', stop);
 return {
   async start() {
     phase = 'connecting';
     const checked = await client.health(); health = checked;
     if (!checked?.live) throw new Error(checked?.reason || 'Live service disabled');
     if (disposed) throw new Error('Session closed');
     if (checked.provider !== 'mock' && !window.AudioContext && !(window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext) throw new Error('This browser cannot play live audio. Use Chrome for the private demo.');
     await client.ensureSession();
     if (disposed) throw new Error('Session closed');
     if (checked.provider !== 'mock') { rendererStartedAt = performance.now(); await face.mount(options.host); } else await createStill().mount(options.host);
     options.onStatus(checked.provider === 'mock' ? 'MOCK engineering mode · no live AI' : 'Preparing approved Aria renderer');
     phase = 'available';
     return checked;
   }, send, stop,
   async microphone() {
     if (!health?.live || health.provider === 'mock' || face.bpeStatus() !== 'ready') { options.onStatus('Live renderer and voice must be ready before microphone input'); return; }
     failed = false; phase = 'available'; await conversation.start();
   },
   async replay() {
     if (!latestReply || busy || disposed) return;
     conversation.hold('speaking');
     const outcome = await voice.speak(latestReply);
     if (disposed) return;
     if (outcome.status === 'completed') conversation.listen();
     else if (outcome.status !== 'interrupted') {
       conversation.end('error'); failed = true; failure = 'voice'; options.onStatus('Approved voice unavailable');
     }
   },
   view() {
     const renderer = face.bpeStatus();
     // mount() only opens the socket. A connected socket without ready frames is not a ready renderer.
     if (rendererStartedAt !== null && renderer !== 'ready' && performance.now() - rendererStartedAt >= 12000) { failed = true; failure = 'connection'; }
     const ready = !disposed && Boolean(health?.live) && (health?.provider === 'mock' || renderer === 'ready');
     const state: AriaSessionPhase = disposed ? 'ended'
       : failed || (health?.provider !== 'mock' && renderer === 'fallback') ? 'failed'
       : phase === 'interrupted' ? 'interrupted'
       : voice.isActive() ? 'speaking' : busy ? 'processing'
       : ['listening', 'hearing'].includes(conversationState) ? 'listening'
       : conversationState === 'starting' || (health?.provider !== 'mock' && renderer === 'connecting') ? 'connecting' : phase;
     return { phase: state, ready: ready && !failed, canReplay: Boolean(latestReply) && ready && !busy && !voice.isActive(), microphone: conversationState, failure };
   },
   debug: () => ({ health: health ? { provider: health.provider, model: health.model, voice: health.voice, budget: health.budget } : null,
     face: face.debug(), voice: { active: voice.isActive(), error: voice.lastError(), time: voice.playbackMs() }, busy, receipts: receiptSequence, latency: consultation.latency }),
   dispose() { if (disposed) return; disposed = true; stop(); offs.forEach(off => off()); document.removeEventListener('visibilitychange', hide); window.removeEventListener('popstate', stop); voice.dispose(); face.dispose(); options.host.replaceChildren(); },
 };
}
