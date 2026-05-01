import { useAlbumStore, getStickerNumbers } from '../../store/albumStore';
import { useUIStore } from '../../store/uiStore';
import { TEAMS } from '../../data/teams';
import { CONFEDERATION_ORDER, CONFEDERATION_LABELS, CONFEDERATION_COLORS } from '../../utils/constants';
import { normalizeText } from '../../utils/fuzzyMatch';
import type { Team } from '../../types';
import Flag from '../ui/Flag';
import { useMemo } from 'react';

/** Teams that are actual nations (not FWC/CC) */
const NATION_TEAMS = TEAMS.filter((t) => t.confederation !== ('SPECIAL' as any));
const SPECIAL_TEAMS = TEAMS.filter((t) => t.confederation === ('SPECIAL' as any));

export default function AlbumView() {
  const filter = useUIStore((s) => s.filter);
  const confFilter = useUIStore((s) => s.confederationFilter);
  const searchQuery = useUIStore((s) => s.searchQuery);
  const stickers = useAlbumStore((s) => s.stickers);

  const filteredTeams = useMemo(() => {
    let teams = confFilter === 'SPECIAL' as any
      ? [...SPECIAL_TEAMS]
      : confFilter !== 'ALL'
        ? NATION_TEAMS.filter((t) => t.confederation === confFilter)
        : [...NATION_TEAMS];

    if (searchQuery) {
      const q = normalizeText(searchQuery);
      teams = teams.filter((t) =>
        normalizeText(t.name).includes(q) || t.code.includes(q) ||
        t.aliases.some((a) => normalizeText(a).includes(q))
      );
    }

    if (filter === 'complete') {
      teams = teams.filter((t) => {
        const nums = getStickerNumbers(t.code);
        return nums.every((n) => (stickers[`${t.code}-${n}`]?.count ?? 0) > 0);
      });
    } else if (filter === 'incomplete') {
      teams = teams.filter((t) => {
        const nums = getStickerNumbers(t.code);
        return !nums.every((n) => (stickers[`${t.code}-${n}`]?.count ?? 0) > 0);
      });
    } else if (filter === 'missing') {
      teams = teams.filter((t) => {
        const nums = getStickerNumbers(t.code);
        return nums.every((n) => (stickers[`${t.code}-${n}`]?.count ?? 0) === 0);
      });
    }

    return teams;
  }, [filter, confFilter, searchQuery, stickers]);

  // Include special teams when showing "all"
  const showSpecials = confFilter === 'ALL' || confFilter === 'SPECIAL' as any;
  const filteredSpecials = useMemo(() => {
    if (!showSpecials || confFilter === 'SPECIAL' as any) return []; // already in filteredTeams
    let sp = [...SPECIAL_TEAMS];
    if (searchQuery) {
      const q = normalizeText(searchQuery);
      sp = sp.filter((t) => normalizeText(t.name).includes(q) || t.code.includes(q) || t.aliases.some((a) => normalizeText(a).includes(q)));
    }

    if (filter === 'complete') {
      sp = sp.filter((t) => {
        const nums = getStickerNumbers(t.code);
        return nums.every((n) => (stickers[`${t.code}-${n}`]?.count ?? 0) > 0);
      });
    } else if (filter === 'incomplete') {
      sp = sp.filter((t) => {
        const nums = getStickerNumbers(t.code);
        return !nums.every((n) => (stickers[`${t.code}-${n}`]?.count ?? 0) > 0);
      });
    } else if (filter === 'missing') {
      sp = sp.filter((t) => {
        const nums = getStickerNumbers(t.code);
        return nums.every((n) => (stickers[`${t.code}-${n}`]?.count ?? 0) === 0);
      });
    }

    return sp;
  }, [showSpecials, confFilter, searchQuery, filter, stickers]);

  const grouped = useMemo(() => {
    const g: Record<string, Team[]> = {};
    filteredTeams.forEach((t) => {
      const key = t.group;
      if (!g[key]) g[key] = [];
      g[key].push(t);
    });
    return g;
  }, [filteredTeams]);

  const sortedGroups = Object.keys(grouped).sort((a, b) => {
    if (a === 'SPECIAL') return 1;
    if (b === 'SPECIAL') return -1;
    return a.localeCompare(b);
  });

  return (
    <div>
      <FilterBar />

      {/* Special sections first when showing all */}
      {filteredSpecials.length > 0 && (
        <div className="group-section">
          <div className="group-label">
            <span>⭐ Secciones Especiales</span>
          </div>
          <div className="teams-grid">
            {filteredSpecials.map((team) => <TeamCard key={team.code} team={team} />)}
          </div>
        </div>
      )}

      {filteredTeams.length === 0 && filteredSpecials.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-text">No se encontraron selecciones</div>
        </div>
      ) : (
        sortedGroups.map((group) => (
          <div className="group-section" key={group}>
            <div className="group-label">
              <span>{group === 'SPECIAL' ? '⭐ Especiales' : `Grupo ${group}`}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--text-muted)' }}>
                {grouped[group].length} {group === 'SPECIAL' ? 'secciones' : 'equipos'}
              </span>
            </div>
            <div className="teams-grid">
              {grouped[group].map((team) => <TeamCard key={team.code} team={team} />)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function FilterBar() {
  const filter = useUIStore((s) => s.filter);
  const setFilter = useUIStore((s) => s.setFilter);
  const confFilter = useUIStore((s) => s.confederationFilter);
  const setConfFilter = useUIStore((s) => s.setConfederationFilter);
  const searchQuery = useUIStore((s) => s.searchQuery);
  const setSearchQuery = useUIStore((s) => s.setSearchQuery);

  return (
    <div className="filter-bar">
      <input className="input filter-search" type="text" placeholder="🔍 Buscar selección..."
        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      {(['all', 'incomplete', 'complete'] as const).map((f) => (
        <button key={f} className={`filter-chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
          {f === 'all' ? 'Todas' : f === 'incomplete' ? 'Incompletas' : 'Completas'}
        </button>
      ))}
      <select className="input" style={{ maxWidth: 170, padding: '6px 10px', fontSize: '0.8rem' }}
        value={confFilter} onChange={(e) => setConfFilter(e.target.value as any)}>
        <option value="ALL">Todas las conf.</option>
        {CONFEDERATION_ORDER.map((c) => <option key={c} value={c}>{CONFEDERATION_LABELS[c]}</option>)}
        <option value="SPECIAL">⭐ Especiales</option>
      </select>
    </div>
  );
}

function TeamCard({ team }: { team: Team }) {
  const stickers = useAlbumStore((s) => s.stickers);
  const setSelectedTeam = useUIStore((s) => s.setSelectedTeam);
  const isSpecial = team.confederation === ('SPECIAL' as any);
  const color = isSpecial ? CONFEDERATION_COLORS['SPECIAL'] : (CONFEDERATION_COLORS[team.confederation] || 'var(--accent)');
  const numbers = getStickerNumbers(team.code);
  const total = numbers.length;

  let obtained = 0;
  for (const n of numbers) {
    if ((stickers[`${team.code}-${n}`]?.count ?? 0) > 0) obtained++;
  }
  const pct = Math.round((obtained / total) * 100);
  const complete = obtained === total;

  return (
    <div className={`team-card${complete ? ' complete' : ''}${isSpecial ? ' special' : ''}`}
      onClick={() => setSelectedTeam(team.code)}>
      <div className="team-card-flag">
        <Flag emoji={team.flag} />
        <span style={{ display: 'none' }}>{team.flag}</span>
      </div>
      <div className="team-card-name">{team.name}</div>
      <div className="team-card-code">
        <span style={{ fontWeight: 800 }}>{team.code.toUpperCase()}</span>
        {!isSpecial && ` · Grupo ${team.group}`}
      </div>
      <div className="team-card-progress">
        <div className="team-card-progress-fill" style={{ width: `${pct}%`, background: complete ? 'var(--success)' : color }} />
      </div>
      <div className="team-card-stats">{obtained}/{total}</div>
    </div>
  );
}
