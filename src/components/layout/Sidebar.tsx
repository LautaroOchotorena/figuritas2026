import { useUIStore } from '../../store/uiStore';
import { useAlbumStore, getStickerNumbers } from '../../store/albumStore';
import { CONFEDERATION_ORDER, CONFEDERATION_LABELS, CONFEDERATION_COLORS, TOTAL_STICKERS, STICKERS_PER_TEAM } from '../../utils/constants';
import { TEAMS, TEAMS_BY_CONFEDERATION } from '../../data/teams';
import type { Confederation } from '../../types';

const NATION_TEAMS = TEAMS.filter((t) => t.confederation !== ('SPECIAL' as any));

function ProgressRing({ percentage }: { percentage: number }) {
  const r = 54, c = 2 * Math.PI * r;
  const offset = c - (percentage / 100) * c;
  return (
    <div className="progress-ring-container">
      <svg width="140" height="140" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <circle className="progress-ring-bg" cx="60" cy="60" r={r} strokeWidth="8" />
        <circle className="progress-ring-fill" cx="60" cy="60" r={r} strokeWidth="8"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
        <text className="progress-ring-text" x="60" y="56">{percentage}%</text>
        <text className="progress-ring-subtext" x="60" y="74">completado</text>
      </svg>
    </div>
  );
}

export default function Sidebar() {
  const stickers = useAlbumStore((s) => s.stickers);
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);

  let obtained = 0, repeated = 0;
  for (const s of Object.values(stickers)) {
    if (s.count > 0) obtained++;
    if (s.count > 1) repeated += s.count - 1;
  }
  const missing = TOTAL_STICKERS - obtained;
  const pct = Math.round((obtained / TOTAL_STICKERS) * 100);

  return (
    <aside className={`sidebar${isSidebarOpen ? ' open' : ''}`}>
      <ProgressRing percentage={pct} />

      <div className="stats-section">
        <div className="stats-title">Resumen</div>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-value obtained">{obtained}</div><div className="stat-label">Obtenidas</div></div>
          <div className="stat-card"><div className="stat-value missing">{missing}</div><div className="stat-label">Faltan</div></div>
          <div className="stat-card"><div className="stat-value repeated">{repeated}</div><div className="stat-label">Repetidas</div></div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
          {obtained} / {TOTAL_STICKERS} figuritas
        </div>
      </div>

      <div className="stats-section">
        <div className="stats-title">Por Confederación</div>
        {CONFEDERATION_ORDER.map((conf) => <ConfRow key={conf} confederation={conf as Confederation} />)}
        <SpecialRow code="fwc" label="FIFA World Cup" color="#ec4899" />
        <SpecialRow code="cc" label="Coca-Cola" color="#ef4444" />
      </div>
    </aside>
  );
}

function ConfRow({ confederation }: { confederation: Confederation }) {
  const stickers = useAlbumStore((s) => s.stickers);
  const teams = (TEAMS_BY_CONFEDERATION[confederation] || []).filter((t) => t.confederation !== ('SPECIAL' as any));
  const totalStickers = teams.length * STICKERS_PER_TEAM;
  const color = CONFEDERATION_COLORS[confederation] || '#888';
  let obtained = 0;
  for (const team of teams) {
    for (let i = 1; i <= STICKERS_PER_TEAM; i++) {
      if ((stickers[`${team.code}-${i}`]?.count ?? 0) > 0) obtained++;
    }
  }
  const percentage = totalStickers > 0 ? Math.round((obtained / totalStickers) * 100) : 0;
  return (
    <div className="conf-stat">
      <div className="conf-dot" style={{ background: color }} />
      <div className="conf-name">{CONFEDERATION_LABELS[confederation]}</div>
      <div className="conf-bar"><div className="conf-bar-fill" style={{ width: `${percentage}%`, background: color }} /></div>
      <div className="conf-pct">{percentage}%</div>
    </div>
  );
}

function SpecialRow({ code, label, color }: { code: string; label: string; color: string }) {
  const stickers = useAlbumStore((s) => s.stickers);
  const numbers = getStickerNumbers(code);
  const total = numbers.length;
  let obtained = 0;
  for (const n of numbers) {
    if ((stickers[`${code}-${n}`]?.count ?? 0) > 0) obtained++;
  }
  const percentage = Math.round((obtained / total) * 100);
  return (
    <div className="conf-stat">
      <div className="conf-dot" style={{ background: color }} />
      <div className="conf-name">{label}</div>
      <div className="conf-bar"><div className="conf-bar-fill" style={{ width: `${percentage}%`, background: color }} /></div>
      <div className="conf-pct">{percentage}%</div>
    </div>
  );
}
