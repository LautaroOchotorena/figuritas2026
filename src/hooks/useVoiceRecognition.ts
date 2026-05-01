// ============================================================================
// useVoiceRecognition Hook — Voice input integration
// ============================================================================

import { useState, useCallback, useRef, useEffect } from 'react';
import { createVoiceRecognition, isVoiceSupported } from '../services/voiceService';
import { parseInput } from '../services/parserService';
import { useAlbumStore } from '../store/albumStore';
import { useUIStore } from '../store/uiStore';
import { playSuccess, playDuplicate, playError, playComplete, vibrate } from '../services/soundService';
import { TEAM_BY_CODE } from '../data/teams';

export function useVoiceRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const isSupported = isVoiceSupported();

  const addSticker = useAlbumStore((s) => s.addSticker);
  const isTeamComplete = useAlbumStore((s) => s.isTeamComplete);
  const addToast = useUIStore((s) => s.addToast);

  const processTranscript = useCallback(
    (text: string) => {
      const results = parseInput(text);
      results.forEach((result) => {
        if (!result.success) {
          playError();
          addToast({
            type: 'error',
            message: result.error || 'No se pudo reconocer la figurita',
            detail: `Entrada: "${result.originalInput}"`,
          });
          return;
        }

        const outcome = addSticker(result.teamCode, result.number);
        const team = TEAM_BY_CODE[result.teamCode];

        if (outcome === 'new') {
          playSuccess();
          vibrate(50);
          addToast({
            type: 'success',
            message: `${team?.flag} ${result.teamName} #${result.number}`,
            detail: '¡Figurita nueva agregada!',
          });

          // Verificar si se completó el equipo
          if (isTeamComplete(result.teamCode)) {
            setTimeout(() => {
              playComplete();
              vibrate([100, 50, 100]);
              addToast({
                type: 'success',
                message: `🎉 ¡${team?.flag} ${result.teamName} completo!`,
                detail: 'Completaste todas las figuritas de esta selección',
                duration: 5000,
              });
            }, 500);
          }
        } else if (outcome === 'repeated') {
          playDuplicate();
          vibrate(30);
          addToast({
            type: 'warning',
            message: `${team?.flag} ${result.teamName} #${result.number}`,
            detail: 'Figurita repetida',
          });
        } else {
          playError();
          addToast({
            type: 'error',
            message: 'Figurita no válida',
            detail: `"${result.originalInput}" no existe en el álbum`,
          });
        }
      });
    },
    [addSticker, isTeamComplete, addToast]
  );

  const startListening = useCallback(() => {
    if (!isSupported) {
      addToast({
        type: 'error',
        message: 'Tu navegador no soporta reconocimiento de voz',
        detail: 'Probá con Chrome o Edge',
      });
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const recognition = createVoiceRecognition({
      onResult: (text, _confidence, isFinal) => {
        if (isFinal) {
          setTranscript(text);
          setInterimTranscript('');
          processTranscript(text);
        } else {
          setInterimTranscript(text);
        }
      },
      onError: (error) => {
        addToast({ type: 'error', message: error });
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      },
      onStart: () => {
        setIsListening(true);
        setTranscript('');
        setInterimTranscript('');
      },
    });

    if (recognition) {
      recognitionRef.current = recognition;
      recognition.start();
    }
  }, [isSupported, processTranscript, addToast]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    toggleListening,
  };
}
