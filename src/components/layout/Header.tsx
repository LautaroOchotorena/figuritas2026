import { useUIStore } from '../../store/uiStore';
import { TOTAL_STICKERS } from '../../utils/constants';
import { useAlbumStore } from '../../store/albumStore';

export default function Header() {
  const stickers = useAlbumStore((s) => s.stickers);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const theme = useUIStore((s) => s.theme);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  let obtained = 0;
  for (const s of Object.values(stickers)) {
    if (s.count > 0) obtained++;
  }
  const pct = Math.round((obtained / TOTAL_STICKERS) * 100);

  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">
          <span className="logo-panini">PANINI</span>
          <span className="logo-separator">×</span>
          <span className="logo-fifa">FIFA</span>
          <span className="logo-trophy">🏆</span>
        </div>
        <div className="header-subtitle">WORLD CUP 2026™</div>
      </div>
      <div className="header-progress">
        <div className="header-progress-bar">
          <div className="header-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="header-progress-label">{pct}% — {obtained}/{TOTAL_STICKERS}</div>
      </div>
      <div className="header-actions">
        <button className="btn btn-ghost btn-sm" onClick={toggleTheme} title="Tema">{theme === 'dark' ? '☀️' : '🌙'}</button>
        <button className="btn btn-ghost btn-sm btn-sidebar-toggle" onClick={toggleSidebar} title="Estadísticas">📊</button>
        <button className="btn btn-secondary btn-sm" onClick={() => useUIStore.getState().setShowSettings(true)} title="Ajustes">⚙️ Opciones</button>
      </div>
    </header>
  );
}
