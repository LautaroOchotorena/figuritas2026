import { useUIStore } from '../../store/uiStore';
import { TEAMS, TEAM_BY_CODE } from '../../data/teams';
import type { PasteSticker } from '../../types';

export default function PasteOrderModal() {
  const showPasteOrderModal = useUIStore((s) => s.showPasteOrderModal);
  const setShowPasteOrderModal = useUIStore((s) => s.setShowPasteOrderModal);
  const accumulatedPasteStickers = useUIStore((s) => s.accumulatedPasteStickers);
  const clearPasteStickers = useUIStore((s) => s.clearPasteStickers);

  if (!showPasteOrderModal) return null;

  const closeAndClear = () => {
    setShowPasteOrderModal(false);
    clearPasteStickers();
  };

  const closeModalOptions = () => {
    setShowPasteOrderModal(false);
  };

  // Grouping logic based on rules
  const sortedStickers = [...accumulatedPasteStickers].sort((a, b) => {
    const getPageWeight = (s: PasteSticker) => {
      if (s.teamCode === 'fwc') {
        if (s.number <= 4) return 1;
        if (s.number >= 5 && s.number <= 8) return 2;
        if (s.number >= 9 && s.number <= 13) return 1000;
        if (s.number >= 14 && s.number <= 19) return 1001;
      }
      if (s.teamCode === 'cc') return 1002;
      const teamIdx = TEAMS.findIndex(t => t.code === s.teamCode);
      return 10 + (teamIdx >= 0 ? teamIdx : 900);
    };

    const diffWeight = getPageWeight(a) - getPageWeight(b);
    if (diffWeight !== 0) return diffWeight;

    // Same page: sort by number
    return a.number - b.number;
  });

  return (
    <div className="modal-overlay" onClick={closeModalOptions}>
      <div className="modal paste-order-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Orden de Pegado 📋</h2>
          <button className="btn btn-ghost" onClick={closeModalOptions}>×</button>
        </div>
        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto', padding: '1rem' }}>
          {sortedStickers.length === 0 ? (
            <div className="empty-state" style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>🤷‍♂️</span>
              <p>No dictaste figuritas para pegar.</p>
            </div>
          ) : (
            <div className="paste-order-list">
              {sortedStickers.map((s, idx) => {
                const team = TEAM_BY_CODE[s.teamCode];
                const name = team?.name || s.teamCode.toUpperCase();
                const displayNum = s.teamCode === 'fwc' && s.number === 0 ? '00' : s.number;
                return (
                  <div key={idx} className="paste-order-item">
                    <div className="paste-order-badge">
                      <span className="sticker-index">#{idx + 1}</span>
                    </div>
                    <div className="paste-order-details">
                      <span className="sticker-name">{name}</span>
                      <span className="sticker-number badge badge-info" style={{ marginLeft: 'auto', fontSize: '1.1rem', fontWeight: 'bold' }}>{displayNum}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="modal-footer" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button className="btn" onClick={closeAndClear}>Limpiar Lista</button>
          <button className="btn btn-primary" onClick={closeModalOptions}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
