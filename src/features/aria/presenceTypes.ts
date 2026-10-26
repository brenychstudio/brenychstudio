import type { ToolReceiptPayload } from './protocol';
import type { SpeechVoiceInfo } from './speechFallback';
export type AdvisorToolResult = ToolReceiptPayload;
export type AdvisorPresenceState = 'off' | 'idle' | 'listening' | 'thinking' | 'speaking';
export type AdvisorUtterance = { text: string; audio?: MediaStream | AudioBuffer; visemes?: Array<{ atMs: number; shape: string; weight: number }> };
export type PortraitPresentation = 'consultation' | 'compact';
export type ClipPresenceAdapter = {
 id: string; mount(container: HTMLElement): Promise<void>; setState(state: AdvisorPresenceState): void;
 speak(utterance: AdvisorUtterance): Promise<void>; interrupt(): void; dispose(): void;
 setPresentation(presentation: PortraitPresentation): void; setMuted(muted: boolean): void;
 getSnapshot(): Record<string, unknown>; subscribe(listener: () => void): () => void;
 prepareVoice(): Promise<SpeechVoiceInfo | null>; hasPairedClip(text: string): boolean;
 setClipPairing(enabled: boolean): void; debug(): Record<string, unknown>;
};
export type RecognitionHandlers = {
 onState(state: 'unsupported'|'idle'|'starting'|'listening'|'denied'|'error', detail?: string): void;
 onInterim(text: string): void; onFinal(text: string): void;
};
export type BrowserRecognition = {
 readonly supported: boolean; start(handlers: RecognitionHandlers): void; stop(): void; abort(): void;
};
