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
  const timeoutRef = useRef<number | null>(null);
  const accumulatedText = useRef('');
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
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

        if (isFinal) {
          // Avoid text duplication if the browser sends cumulative final chunks
          const currAcc = accumulatedText.current.toLowerCase();
          const newText = text.toLowerCase().trim();
          
          if (currAcc && newText.startsWith(currAcc)) {
            accumulatedText.current = text.trim();
          } else {
            accumulatedText.current = (accumulatedText.current + ' ' + text).trim();
          }

          setTranscript(accumulatedText.current);
          setInterimTranscript('');

          timeoutRef.current = window.setTimeout(() => {
            if (accumulatedText.current) {
              processTranscript(accumulatedText.current);
              accumulatedText.current = '';
              setTranscript('');
            }
          }, 1500);
        } else {
          // For interim, we also avoid duplication
          const currAcc = accumulatedText.current.toLowerCase();
          const newText = text.toLowerCase().trim();
          
          let displayInterim = text;
          if (currAcc && newText.startsWith(currAcc)) {
             displayInterim = text.substring(currAcc.length).trim();
          }
          
          setInterimTranscript(displayInterim);
          
          timeoutRef.current = window.setTimeout(() => {
            let fullText = '';
            if (currAcc && newText.startsWith(currAcc)) {
               fullText = text.trim();
            } else {
               fullText = (accumulatedText.current + ' ' + text).trim();
            }
            
            if (fullText) {
              processTranscript(fullText);
              accumulatedText.current = '';
              setTranscript('');
              setInterimTranscript('');
            }
          }, 2000);
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
        accumulatedText.current = '';
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
    
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    
    // Use the functional state update pattern to get the latest interimTranscript just in case,
    // but we can rely on the accumulated text mostly.
    setInterimTranscript((currentInterim) => {
      const fullText = (accumulatedText.current + ' ' + currentInterim).trim();
      if (fullText) {
        processTranscript(fullText);
      }
      accumulatedText.current = '';
      setTranscript('');
      return '';
    });
    
    setIsListening(false);
  }, [processTranscript]);

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
      if (recognitionRef.current) recognitionRef.current.abort();
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
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
