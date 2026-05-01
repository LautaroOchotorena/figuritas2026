// ============================================================================
// Sound Service — Web Audio API feedback sounds (no external files)
// ============================================================================

let audioContext: AudioContext | null = null;

/**
 * Obtiene o crea el AudioContext (lazy initialization).
 */
function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

/**
 * Reproduce una nota con la frecuencia y duración dadas.
 */
function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.15
): void {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Envelope suave para evitar clicks
    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
  } catch {
    // Silently fail if audio isn't available
  }
}

/**
 * Reproduce una secuencia de notas con delay entre ellas.
 */
function playSequence(
  notes: Array<{ freq: number; dur: number; delay: number }>,
  type: OscillatorType = 'sine',
  volume: number = 0.15
): void {
  notes.forEach(({ freq, dur, delay }) => {
    setTimeout(() => playTone(freq, dur, type, volume), delay);
  });
}

/** 
 * Sonido alegre al agregar una figurita nueva.
 * Acorde ascendente C-E-G
 */
export function playSuccess(): void {
  playSequence([
    { freq: 523, dur: 0.12, delay: 0 },     // C5
    { freq: 659, dur: 0.12, delay: 80 },     // E5
    { freq: 784, dur: 0.2, delay: 160 },      // G5
  ], 'sine', 0.12);
}

/**
 * Sonido de aviso al detectar figurita repetida.
 * Dos tonos descendentes
 */
export function playDuplicate(): void {
  playSequence([
    { freq: 440, dur: 0.15, delay: 0 },      // A4
    { freq: 349, dur: 0.2, delay: 120 },      // F4
  ], 'triangle', 0.1);
}

/**
 * Sonido de error.
 * Tono grave corto
 */
export function playError(): void {
  playTone(220, 0.25, 'sawtooth', 0.08);
}

/**
 * Fanfarria al completar un equipo.
 * Acorde mayor completo ascendente
 */
export function playComplete(): void {
  playSequence([
    { freq: 523, dur: 0.15, delay: 0 },      // C5
    { freq: 659, dur: 0.15, delay: 100 },     // E5
    { freq: 784, dur: 0.15, delay: 200 },     // G5
    { freq: 1047, dur: 0.4, delay: 300 },     // C6
  ], 'sine', 0.12);
}

/**
 * Vibra el dispositivo (si está soportado).
 */
export function vibrate(pattern: number | number[] = 50): void {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}
