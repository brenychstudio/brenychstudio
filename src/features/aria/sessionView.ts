export type AriaSessionPhase = 'available' | 'connecting' | 'listening' | 'processing' | 'speaking' | 'interrupted' | 'failed' | 'ended';

export const ariaPhaseLabels: Record<'en' | 'es', Record<AriaSessionPhase, string>> = {
 en: { available: 'Available for private preview', connecting: 'Connecting', listening: 'Listening', processing: 'Processing your message', speaking: 'Aria is speaking', interrupted: 'Interrupted · microphone off', failed: 'Connection unavailable', ended: 'Session ended · microphone off' },
 es: { available: 'Disponible para vista previa privada', connecting: 'Conectando', listening: 'Escuchando', processing: 'Procesando tu mensaje', speaking: 'Aria está hablando', interrupted: 'Interrumpida · micrófono apagado', failed: 'Conexión no disponible', ended: 'Sesión finalizada · micrófono apagado' },
};
