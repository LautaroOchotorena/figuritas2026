import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

export default function VoiceInput() {
  const { isListening, isSupported, transcript, interimTranscript, toggleListening } = useVoiceRecognition();

  useKeyboardShortcuts({
    onSpaceDown: () => { if (!isListening) toggleListening(); },
    onSpaceUp: () => { if (isListening) toggleListening(); },
  });

  if (!isSupported) return null;

  return (
    <>
      <button
        className={`voice-fab${isListening ? ' listening' : ''}`}
        onClick={toggleListening}
        title={isListening ? 'Detener (o soltar espacio)' : 'Hablar (o mantener espacio)'}
      >
        {isListening ? '⏹' : '🎤'}
      </button>
      {(isListening || transcript || interimTranscript) && (
        <div className="voice-transcript">
          <div className="voice-transcript-label">
            {isListening ? '🔴 Escuchando...' : 'Último resultado'}
          </div>
          <div>{interimTranscript || transcript || 'Decí el código de figurita...'}</div>
        </div>
      )}
    </>
  );
}
