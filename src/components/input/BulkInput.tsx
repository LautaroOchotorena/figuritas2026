import { useState } from 'react';
import { parseInput } from '../../services/parserService';
import { useAlbumStore } from '../../store/albumStore';
import { useUIStore } from '../../store/uiStore';
import { TEAM_BY_CODE } from '../../data/teams';
import { playSuccess, playDuplicate } from '../../services/soundService';
import type { ParseResult } from '../../types';

export default function BulkInput() {
  const show = useUIStore((s) => s.showBulkInput);
  const setShow = useUIStore((s) => s.setShowBulkInput);
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<ParseResult[]>([]);
  const addSticker = useAlbumStore((s) => s.addSticker);
  const stickers = useAlbumStore((s) => s.stickers);
  const addToast = useUIStore((s) => s.addToast);

  if (!show) return null;

  const handlePreview = () => {
    const results = parseInput(text);
    setPreview(results);
  };

  const handleConfirm = () => {
    const valid = preview.filter((r) => r.success);
    let newCount = 0, dupeCount = 0;
    valid.forEach((r) => {
      const result = addSticker(r.teamCode, r.number);
      if (result === 'new') newCount++;
      else if (result === 'repeated') dupeCount++;
    });
    if (newCount > 0) playSuccess();
    if (dupeCount > 0) playDuplicate();
    addToast({
      type: 'success',
      message: `Carga masiva completada`,
      detail: `${newCount} nuevas, ${dupeCount} repetidas, ${preview.length - valid.length} inválidas`,
    });
    setText('');
    setPreview([]);
    setShow(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setShow(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">📋 Carga Masiva</div>
          <button className="modal-close" onClick={() => setShow(false)}>×</button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
            Pegá una lista de figuritas separadas por comas o saltos de línea.<br />
            Ej: <code>arg 1, mex 3, kor 5</code>
          </p>
          <textarea
            className="input textarea"
            value={text}
            onChange={(e) => { setText(e.target.value); setPreview([]); }}
            placeholder="arg 0, arg 1, mex 5&#10;bra 3, col 7"
            rows={5}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn btn-secondary" onClick={handlePreview} disabled={!text.trim()}>
              Previsualizar
            </button>
            {preview.length > 0 && (
              <button className="btn btn-primary" onClick={handleConfirm}>
                Confirmar ({preview.filter((r) => r.success).length} válidas)
              </button>
            )}
          </div>
          {preview.length > 0 && (
            <div className="bulk-preview">
              {preview.map((r, i) => {
                const team = r.success ? TEAM_BY_CODE[r.teamCode] : null;
                const exists = r.success && stickers[r.stickerId]?.count > 0;
                return (
                  <div className="bulk-item" key={i}>
                    <div className={`bulk-status ${r.success ? (exists ? 'dupe' : 'valid') : 'invalid'}`} />
                    <span>
                      {r.success
                        ? `${team?.flag} ${r.teamName} #${r.number}${exists ? ' (repetida)' : ''}`
                        : `❌ ${r.originalInput}: ${r.error}`
                      }
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
