import { useState, useRef } from 'react';
import { parseInput } from '../../services/parserService';
import { useAlbumStore } from '../../store/albumStore';
import { useUIStore } from '../../store/uiStore';
import { TEAM_BY_CODE } from '../../data/teams';
import { playSuccess, playDuplicate, playError, playComplete, vibrate } from '../../services/soundService';

export default function ManualInput() {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const addSticker = useAlbumStore((s) => s.addSticker);
  const isTeamComplete = useAlbumStore((s) => s.isTeamComplete);
  const addToast = useUIStore((s) => s.addToast);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    const results = parseInput(value);
    results.forEach((r) => {
      if (!r.success) {
        playError();
        addToast({ type: 'error', message: r.error || 'Error', detail: `"${r.originalInput}"` });
        return;
      }
      const outcome = addSticker(r.teamCode, r.number);
      const team = TEAM_BY_CODE[r.teamCode];
      if (outcome === 'new') {
        playSuccess();
        vibrate(50);
        addToast({ type: 'success', message: `${team?.flag} ${r.teamName} #${r.number}`, detail: '¡Nueva!' });
        setTimeout(() => {
          if (isTeamComplete(r.teamCode)) {
            playComplete();
            addToast({ type: 'success', message: `🎉 ¡${team?.flag} ${r.teamName} completo!`, duration: 5000 });
          }
        }, 50);
      } else if (outcome === 'repeated') {
        playDuplicate();
        addToast({ type: 'warning', message: `${team?.flag} ${r.teamName} #${r.number}`, detail: 'Repetida' });
      }
    });

    setValue('');
    inputRef.current?.focus();
  };

  return (
    <form className="manual-input-bar" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        className="input"
        type="text"
        placeholder='Ingresá figurita: ej. "arg 1" o "mexico 5, kor 3"'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
      />
      <button type="submit" className="btn btn-primary">Agregar</button>
    </form>
  );
}
