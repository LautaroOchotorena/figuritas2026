import { useUIStore } from '../../store/uiStore';
import PasteOrderModal from './PasteOrderModal';

export default function PasteModeBar() {
  const isPasteModeActive = useUIStore((s) => s.isPasteModeActive);
  const setPasteModeActive = useUIStore((s) => s.setPasteModeActive);
  const accumulatedPasteStickers = useUIStore((s) => s.accumulatedPasteStickers);
  const setShowPasteOrderModal = useUIStore((s) => s.setShowPasteOrderModal);

  const startPasteMode = () => {
    setPasteModeActive(true);
  };

  const endPasteMode = () => {
    setPasteModeActive(false);
    setShowPasteOrderModal(true);
  };

  return (
    <div className="paste-mode-bar" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '10px 1rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '1rem' }}>
      {!isPasteModeActive ? (
        <button className="btn btn-primary" onClick={startPasteMode}>
          📝 Iniciar Modo Pegado
        </button>
      ) : (
        <>
          <button className="btn btn-danger" style={{ background: '#e74c3c', color: 'white' }} onClick={endPasteMode}>
            🛑 Finalizar Modo Pegado
          </button>
          <span style={{ fontWeight: 'bold' }}>
            Figuritas listas para pegar: {accumulatedPasteStickers.length}
          </span>
        </>
      )}
      <PasteOrderModal />
    </div>
  );
}