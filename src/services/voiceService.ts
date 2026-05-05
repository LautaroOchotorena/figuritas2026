// ============================================================================
// Voice Service — Web Speech API wrapper
// ============================================================================

export interface VoiceServiceCallbacks {
  onResult: (transcript: string, confidence: number, isFinal: boolean) => void;
  onError: (error: string) => void;
  onEnd: () => void;
  onStart: () => void;
}

// Browser compatibility
const SpeechRecognitionAPI =
  (window as any).SpeechRecognition ||
  (window as any).webkitSpeechRecognition;

/**
 * Verifica si el navegador soporta Web Speech API.
 */
export function isVoiceSupported(): boolean {
  return !!SpeechRecognitionAPI;
}

/**
 * Crea y configura una instancia de SpeechRecognition.
 * Soporta español (es-AR) e inglés (en-US).
 */
export function createVoiceRecognition(
  callbacks: VoiceServiceCallbacks,
  lang: string = 'es-AR'
): any | null {
  if (!SpeechRecognitionAPI) {
    return null;
  }

  const recognition = new SpeechRecognitionAPI();

  // Configuración
  recognition.lang = lang;
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 5;

  const pickBestAlternative = (result: any): { transcript: string; confidence: number } => {
    const alternatives = Array.from(result || []).map((alternative: any) => ({
      transcript: String(alternative?.transcript ?? '').trim(),
      confidence: Number(alternative?.confidence ?? 0),
    }));

    if (alternatives.length === 0) {
      return { transcript: '', confidence: 0 };
    }

    alternatives.sort((left, right) => right.confidence - left.confidence);
    return alternatives[0];
  };

  // Event handlers
  recognition.onresult = (event: any) => {
    const startIndex = typeof event.resultIndex === 'number' ? event.resultIndex : 0;

    for (let index = startIndex; index < event.results.length; index++) {
      const result = event.results[index];
      const bestAlternative = pickBestAlternative(result);

      if (!bestAlternative.transcript) continue;

      callbacks.onResult(bestAlternative.transcript, bestAlternative.confidence, result.isFinal);
    }
  };

  recognition.onerror = (event: any) => {
    let message = 'Error de reconocimiento de voz';
    switch (event.error) {
      case 'no-speech':
        message = 'No se detectó voz. Intentá de nuevo.';
        break;
      case 'audio-capture':
        message = 'No se encontró micrófono. Verificá los permisos.';
        break;
      case 'not-allowed':
        message = 'Permiso de micrófono denegado. Habilitalo en la configuración del navegador.';
        break;
      case 'network':
        message = 'Error de red. Verificá tu conexión.';
        break;
      case 'aborted':
        // No mostrar error si fue cancelado por el usuario
        return;
      default:
        message = `Error: ${event.error}`;
    }
    callbacks.onError(message);
  };

  recognition.onend = () => {
    callbacks.onEnd();
  };

  recognition.onstart = () => {
    callbacks.onStart();
  };

  return recognition;
}
