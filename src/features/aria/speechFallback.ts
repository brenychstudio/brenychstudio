// An unavailable approved voice is a visible failure, never a different OS voice.
export type SpeechVoiceInfo = { name: string; lang: string; local: boolean };
export type SpeechOutcome = { status: 'completed' | 'interrupted' | 'failed' | 'blocked' | 'unsupported'; error?: string };
export type SpeechCallbacks = { onStart?: () => void; onBoundary?: (charIndex: number) => void };
export type BrowserSpeech = {
 readonly supported: boolean; ready(): Promise<SpeechVoiceInfo | null>; voice(): SpeechVoiceInfo | null;
 speak(text: string, callbacks?: SpeechCallbacks): Promise<SpeechOutcome>; cancel(): void; isSpeaking(): boolean; dispose(): void;
};
export function createBrowserSpeech(): BrowserSpeech {
 return { supported: false, ready: async () => null, voice: () => null,
   speak: async () => ({ status: 'unsupported', error: 'Approved Aria voice unavailable; no substitute used.' }),
   cancel() {}, isSpeaking: () => false, dispose() {} };
}
