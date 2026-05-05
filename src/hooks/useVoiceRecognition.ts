// ============================================================================
// useVoiceRecognition Hook — Voice input integration
// ============================================================================

import { useState, useCallback, useRef, useEffect } from 'react';
import { createVoiceRecognition, isVoiceSupported } from '../services/voiceService';
import { parseInput } from '../services/parserService';
import { getStickerNumbers, useAlbumStore } from '../store/albumStore';
import { useUIStore } from '../store/uiStore';
import { playSuccess, playDuplicate, playError, playComplete, vibrate } from '../services/soundService';
import { TEAM_BY_CODE } from '../data/teams';

type VoiceRecordingSummary = {
  total: number;
  validCount: number;
  newCount: number;
  repeatedCount: number;
  invalidCount: number;
  completedTeams: number;
  capturedLabels: string[];
  repeatedLabels: string[];
  outOfRangeLabels: string[];
};

function formatStickerLabel(teamCode: string, teamName: string, number: number): string {
  const displayNumber = teamCode === 'fwc' && number === 0 ? '00' : String(number);
  return `${teamName} #${displayNumber}`;
}

function formatOutOfRangeLabel(teamCode: string, teamName: string, number: number): string {
  const stickerLabel = formatStickerLabel(teamCode, teamName, number);
  const numbers = getStickerNumbers(teamCode);
  if (numbers.length === 0) return stickerLabel;

  const rangeLabel = `${numbers[0]}-${numbers[numbers.length - 1]}`;
  return `${stickerLabel} (rango ${rangeLabel})`;
}

export function useVoiceRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const stopTimerRef = useRef<number | null>(null);
  const finalizeTimerRef = useRef<number | null>(null);
  const accumulatedText = useRef('');
  const latestInterimText = useRef('');
  const finalizedRecordingRef = useRef(false);
  const isSupported = isVoiceSupported();

  const clearPendingTimers = useCallback(() => {
    if (stopTimerRef.current) {
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }

    if (finalizeTimerRef.current) {
      window.clearTimeout(finalizeTimerRef.current);
      finalizeTimerRef.current = null;
    }
  }, []);

  const addSticker = useAlbumStore((s) => s.addSticker);
  const isTeamComplete = useAlbumStore((s) => s.isTeamComplete);
  const addToast = useUIStore((s) => s.addToast);

  const processTranscript = useCallback(
    (text: string): VoiceRecordingSummary => {
      const summary: VoiceRecordingSummary = {
        total: 0,
        validCount: 0,
        newCount: 0,
        repeatedCount: 0,
        invalidCount: 0,
        completedTeams: 0,
        capturedLabels: [],
        repeatedLabels: [],
        outOfRangeLabels: [],
      };

      const completedTeams = new Set<string>();
      const results = parseInput(text);
      summary.total = results.length;

      const uiState = useUIStore.getState();

      results.forEach((result) => {
        if (!result.success) {
          if (result.error?.toLowerCase().includes('rango') && result.teamCode) {
            summary.outOfRangeLabels.push(formatOutOfRangeLabel(result.teamCode, result.teamName, result.number));
          }
          summary.invalidCount++;
          return;
        }

        summary.validCount++;
        const outcome = addSticker(result.teamCode, result.number);
        const team = TEAM_BY_CODE[result.teamCode];

        if (uiState.isPasteModeActive && team && outcome === 'new') {
          uiState.addPasteSticker({ teamCode: result.teamCode, group: team.group, number: result.number });
        }

        if (outcome === 'new') {
          summary.newCount++;
          summary.capturedLabels.push(formatStickerLabel(result.teamCode, result.teamName, result.number));

          if (isTeamComplete(result.teamCode)) {
            completedTeams.add(result.teamCode);
          }
        } else if (outcome === 'repeated') {
          summary.repeatedCount++;
          summary.repeatedLabels.push(formatStickerLabel(result.teamCode, result.teamName, result.number));
        } else {
          summary.invalidCount++;
        }
      });

      summary.completedTeams = completedTeams.size;
      return summary;
    },
    [addSticker, isTeamComplete]
  );

  const emitRecordingFeedback = useCallback(
    (summary: VoiceRecordingSummary) => {
      if (summary.validCount === 0) {
        if (summary.invalidCount > 0) {
          playError();
        }

        addToast({
          type: summary.outOfRangeLabels.length > 0 ? 'warning' : summary.invalidCount > 0 ? 'warning' : 'info',
          message: summary.outOfRangeLabels.length > 0
            ? 'Fuera de rango'
            : summary.repeatedLabels.length > 0
              ? 'Figurita repetida'
              : 'Grabación finalizada',
          detail: summary.outOfRangeLabels.length > 0
            ? `Fuera de rango: ${summary.outOfRangeLabels.join(', ')}`
            : summary.invalidCount > 0
              ? `${summary.invalidCount} entrada${summary.invalidCount === 1 ? '' : 's'} inválida${summary.invalidCount === 1 ? '' : 's'}`
              : 'No se detectó ninguna figurita',
        });
        return;
      }

      if (summary.completedTeams > 0) {
        playComplete();
        vibrate([100, 50, 100]);
      } else if (summary.newCount > 0) {
        playSuccess();
        vibrate(50);
      } else if (summary.outOfRangeLabels.length > 0) {
        playError();
        vibrate(30);
      } else if (summary.repeatedCount > 0) {
        playDuplicate();
        vibrate(30);
      } else {
        playError();
      }

      const detailParts: string[] = [];
      if (summary.capturedLabels.length > 0) {
        detailParts.push(`Capturada${summary.capturedLabels.length === 1 ? '' : 's'}: ${summary.capturedLabels.join(', ')}`);
      } else {
        detailParts.push('No se captó figurita nueva');
      }
      if (summary.repeatedLabels.length > 0) {
        detailParts.push(`Repetida${summary.repeatedLabels.length === 1 ? '' : 's'}: ${summary.repeatedLabels.join(', ')}`);
      }
      if (summary.outOfRangeLabels.length > 0) {
        detailParts.push(`Fuera de rango: ${summary.outOfRangeLabels.join(', ')}`);
      }
      if (summary.invalidCount > 0) detailParts.push(`${summary.invalidCount} inválida${summary.invalidCount === 1 ? '' : 's'}`);
      if (summary.completedTeams > 0) {
        detailParts.push(`${summary.completedTeams} selección${summary.completedTeams === 1 ? '' : 'es'} completa${summary.completedTeams === 1 ? '' : 's'}`);
      }

      addToast({
        type: summary.capturedLabels.length > 0 ? 'success' : summary.outOfRangeLabels.length > 0 || summary.repeatedLabels.length > 0 ? 'warning' : 'info',
        message: summary.capturedLabels.length > 0
          ? (summary.capturedLabels.length === 1
            ? 'Se captó figurita'
            : `Se captaron ${summary.capturedLabels.length} figuritas`)
          : summary.outOfRangeLabels.length > 0
            ? 'Fuera de rango'
            : summary.repeatedLabels.length > 0
              ? 'Figurita repetida'
              : 'No se captó figurita',
        detail: detailParts.join(' • '),
        duration: 4500,
      });
    },
    [addToast]
  );

  const finalizeRecording = useCallback(() => {
    if (finalizedRecordingRef.current) return;
    finalizedRecordingRef.current = true;
    clearPendingTimers();

    const fullText = [accumulatedText.current, latestInterimText.current].filter(Boolean).join(' ').trim();
    accumulatedText.current = '';
    latestInterimText.current = '';
    setTranscript('');
    setInterimTranscript('');

    if (!fullText) {
      addToast({
        type: 'info',
        message: 'Grabación finalizada',
        detail: 'No se detectó ninguna figurita',
      });
      setIsListening(false);
      return;
    }

    const summary = processTranscript(fullText);
    emitRecordingFeedback(summary);
    setIsListening(false);
  }, [processTranscript, emitRecordingFeedback, addToast, clearPendingTimers]);

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

    clearPendingTimers();
    finalizedRecordingRef.current = false;
    accumulatedText.current = '';
    latestInterimText.current = '';

    const recognition = createVoiceRecognition({
      onResult: (text, _confidence, isFinal) => {
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
          latestInterimText.current = '';
        } else {
          // For interim, we also avoid duplication
          const currAcc = accumulatedText.current.toLowerCase();
          const newText = text.toLowerCase().trim();
          
          let displayInterim = text;
          if (currAcc && newText.startsWith(currAcc)) {
             displayInterim = text.substring(currAcc.length).trim();
          }
          
          latestInterimText.current = displayInterim;
          setInterimTranscript(displayInterim);
        }
      },
      onError: (error) => {
        finalizedRecordingRef.current = true;
        clearPendingTimers();
        accumulatedText.current = '';
        latestInterimText.current = '';
        setTranscript('');
        setInterimTranscript('');
        addToast({ type: 'error', message: error });
        setIsListening(false);
      },
      onEnd: () => {
        recognitionRef.current = null;
        if (finalizeTimerRef.current) {
          window.clearTimeout(finalizeTimerRef.current);
        }

        finalizeTimerRef.current = window.setTimeout(() => {
          finalizeTimerRef.current = null;
          finalizeRecording();
        }, 350);
      },
      onStart: () => {
        setIsListening(true);
        setTranscript('');
        setInterimTranscript('');
        accumulatedText.current = '';
        latestInterimText.current = '';
        finalizedRecordingRef.current = false;
      },
    });

    if (recognition) {
      recognitionRef.current = recognition;
      recognition.start();
    }
  }, [isSupported, addToast, finalizeRecording]);

  const stopListening = useCallback(() => {
    if (finalizedRecordingRef.current) return;

    if (stopTimerRef.current) {
      window.clearTimeout(stopTimerRef.current);
    }

    stopTimerRef.current = window.setTimeout(() => {
      stopTimerRef.current = null;

      const recognition = recognitionRef.current;
      if (recognition) {
        recognitionRef.current = null;
        recognition.stop();
      } else {
        finalizeRecording();
      }
    }, 450);
  }, [finalizeRecording]);

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
      clearPendingTimers();
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, [clearPendingTimers]);

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
