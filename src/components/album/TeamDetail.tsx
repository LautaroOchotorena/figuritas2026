import { useAlbumStore, getStickerNumbers } from '../../store/albumStore';
import { useUIStore } from '../../store/uiStore';
import { TEAM_BY_CODE } from '../../data/teams';
import { playSuccess, playDuplicate, playComplete, vibrate } from '../../services/soundService';
import Flag from '../ui/Flag';

export default function TeamDetail() {
  const selectedTeam = useUIStore((s) => s.selectedTeam);
  const setSelectedTeam = useUIStore((s) => s.setSelectedTeam);

  if (!selectedTeam) return null;
  const team = TEAM_BY_CODE[selectedTeam];
  if (!team) return null;
  const numbers = getStickerNumbers(selectedTeam);
  const isSpecial = selectedTeam === 'fwc' || selectedTeam === 'cc';

  return (
    <div className="modal-overlay" onClick={() => setSelectedTeam(null)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Flag emoji={team.flag} />
            <span style={{ display: 'none' }}>{team.flag}</span>
            <span>{team.name}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
              {team.code.toUpperCase()}{!isSpecial && ` · Grupo ${team.group}`}
            </span>
          </div>
          <button className="modal-close" onClick={() => setSelectedTeam(null)}>×</button>
        </div>
        <div className="modal-body">
          <TeamProgress teamCode={selectedTeam} />
          <div className="sticker-grid">
            {numbers.map((n) => (
              <StickerSlot key={n} teamCode={selectedTeam} number={n} />
            ))}
          </div>
        </div>
        <div className="modal-actions">
          <MarkCompleteBtn teamCode={selectedTeam} />
          <ClearBtn teamCode={selectedTeam} />
        </div>
      </div>
    </div>
  );
}

function TeamProgress({ teamCode }: { teamCode: string }) {
  const stickers = useAlbumStore((s) => s.stickers);
  const numbers = getStickerNumbers(teamCode);
  let obtained = 0, missing = 0, repeated = 0;
  for (const n of numbers) {
    const s = stickers[`${teamCode}-${n}`];
    if (s && s.count > 0) { obtained++; if (s.count > 1) repeated += s.count - 1; }
    else missing++;
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
      <MiniStat label="Obtenidas" value={obtained} color="var(--accent)" />
      <MiniStat label="Faltan" value={missing} color="var(--error)" />
      <MiniStat label="Repetidas" value={repeated} color="var(--warning)" />
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' as const }}>{label}</div>
    </div>
  );
}

function StickerSlot({ teamCode, number }: { teamCode: string; number: number }) {
  const stickerId = `${teamCode}-${number}`;
  const count = useAlbumStore((s) => s.stickers[stickerId]?.count ?? 0);
  const addSticker = useAlbumStore((s) => s.addSticker);
  const toggleSticker = useAlbumStore((s) => s.toggleSticker);
  const addToast = useUIStore((s) => s.addToast);
  const team = TEAM_BY_CODE[teamCode];
  const status = count === 0 ? 'missing' : count > 1 ? 'repeated' : 'obtained';
  const displayNum = teamCode === 'fwc' && number === 0 ? '00' : String(number);

  const handleClick = () => {
    if (count === 0) {
      addSticker(teamCode, number);
      playSuccess(); vibrate(50);
      addToast({ type: 'success', message: `${team?.flag} ${team?.name} #${displayNum}`, detail: 'Figurita agregada' });
      setTimeout(() => {
        const st = useAlbumStore.getState().stickers;
        const nums = getStickerNumbers(teamCode);
        if (nums.every((n) => (st[`${teamCode}-${n}`]?.count ?? 0) > 0)) {
          playComplete(); vibrate([100, 50, 100]);
          addToast({ type: 'success', message: `🎉 ¡${team?.flag} ${team?.name} completo!`, duration: 5000 });
        }
      }, 50);
    } else {
      toggleSticker(teamCode, number);
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (count > 0) {
      addSticker(teamCode, number);
      playDuplicate();
      addToast({ type: 'warning', message: `${team?.flag} ${team?.name} #${displayNum}`, detail: `Repetida ×${count + 1}` });
    }
  };

  return (
    <div className={`sticker-slot ${status}`} onClick={handleClick} onContextMenu={handleRightClick}
      title={`${teamCode.toUpperCase()} ${displayNum}`}>
      <div className="sticker-number">{displayNum}</div>
      <div className="sticker-label">
        {status === 'missing' ? 'falta' : status === 'repeated' ? `×${count}` : '✓'}
      </div>
      {count > 1 && <div className="sticker-badge">×{count}</div>}
    </div>
  );
}

function MarkCompleteBtn({ teamCode }: { teamCode: string }) {
  const markTeamComplete = useAlbumStore((s) => s.markTeamComplete);
  const addToast = useUIStore((s) => s.addToast);
  const team = TEAM_BY_CODE[teamCode];
  return (
    <button className="btn btn-primary btn-sm" onClick={() => { markTeamComplete(teamCode); playComplete(); addToast({ type: 'success', message: `${team?.flag} ${team?.name} completado` }); }}>
      ✓ Completar página
    </button>
  );
}

function ClearBtn({ teamCode }: { teamCode: string }) {
  const clearTeam = useAlbumStore((s) => s.clearTeam);
  const addToast = useUIStore((s) => s.addToast);
  return (
    <button className="btn btn-secondary btn-sm" onClick={() => {
      if (window.confirm('¿Limpiar todas las figuritas de esta sección?')) { clearTeam(teamCode); addToast({ type: 'info', message: 'Página limpiada' }); }
    }}>
      ✕ Limpiar
    </button>
  );
}
