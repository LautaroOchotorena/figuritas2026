// ============================================================================
// Teams Dataset — FIFA World Cup 2026 (48 selecciones)
// ============================================================================

import type { Team } from '../types';

/**
 * Dataset completo de las 48 selecciones clasificadas al Mundial 2026.
 * Cada equipo incluye código, nombre, bandera emoji, confederación,
 * grupo y aliases para reconocimiento por voz / fuzzy matching.
 */
export const TEAMS: Team[] = [
  // ──────────────────────────────────────────────────────────
  // CONCACAF (6 equipos)
  // ──────────────────────────────────────────────────────────
  {
    code: 'usa',
    name: 'Estados Unidos',
    flag: '🇺🇸',
    confederation: 'CONCACAF',
    group: 'D',
    aliases: ['united states', 'eeuu', 'estados unidos', 'us', 'usa'],
  },
  {
    code: 'mex',
    name: 'México',
    flag: '🇲🇽',
    confederation: 'CONCACAF',
    group: 'A',
    aliases: ['mexico', 'méxico', 'mex'],
  },
  {
    code: 'can',
    name: 'Canadá',
    flag: '🇨🇦',
    confederation: 'CONCACAF',
    group: 'B',
    aliases: ['canada', 'canadá', 'can'],
  },
  {
    code: 'pan',
    name: 'Panamá',
    flag: '🇵🇦',
    confederation: 'CONCACAF',
    group: 'L',
    aliases: ['panama', 'panamá', 'pan'],
  },
  {
    code: 'hai',
    name: 'Haití',
    flag: '🇭🇹',
    confederation: 'CONCACAF',
    group: 'C',
    aliases: ['haiti', 'haití', 'hai'],
  },
  {
    code: 'cur',
    name: 'Curazao',
    flag: '🇨🇼',
    confederation: 'CONCACAF',
    group: 'E',
    aliases: ['curacao', 'curazao', 'curaçao', 'cur'],
  },

  // ──────────────────────────────────────────────────────────
  // CONMEBOL (6 equipos)
  // ──────────────────────────────────────────────────────────
  {
    code: 'arg',
    name: 'Argentina',
    flag: '🇦🇷',
    confederation: 'CONMEBOL',
    group: 'J',
    aliases: ['argentina', 'arg', 'arge'],
  },
  {
    code: 'bra',
    name: 'Brasil',
    flag: '🇧🇷',
    confederation: 'CONMEBOL',
    group: 'C',
    aliases: ['brazil', 'brasil', 'bra'],
  },
  {
    code: 'col',
    name: 'Colombia',
    flag: '🇨🇴',
    confederation: 'CONMEBOL',
    group: 'K',
    aliases: ['colombia', 'col'],
  },
  {
    code: 'ecu',
    name: 'Ecuador',
    flag: '🇪🇨',
    confederation: 'CONMEBOL',
    group: 'E',
    aliases: ['ecuador', 'ecu'],
  },
  {
    code: 'par',
    name: 'Paraguay',
    flag: '🇵🇾',
    confederation: 'CONMEBOL',
    group: 'D',
    aliases: ['paraguay', 'par'],
  },
  {
    code: 'uru',
    name: 'Uruguay',
    flag: '🇺🇾',
    confederation: 'CONMEBOL',
    group: 'H',
    aliases: ['uruguay', 'uru'],
  },

  // ──────────────────────────────────────────────────────────
  // UEFA (16 equipos)
  // ──────────────────────────────────────────────────────────
  {
    code: 'eng',
    name: 'Inglaterra',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    confederation: 'UEFA',
    group: 'L',
    aliases: ['england', 'inglaterra', 'eng'],
  },
  {
    code: 'fra',
    name: 'Francia',
    flag: '🇫🇷',
    confederation: 'UEFA',
    group: 'I',
    aliases: ['france', 'francia', 'fra'],
  },
  {
    code: 'ger',
    name: 'Alemania',
    flag: '🇩🇪',
    confederation: 'UEFA',
    group: 'E',
    aliases: ['germany', 'alemania', 'ger'],
  },
  {
    code: 'esp',
    name: 'España',
    flag: '🇪🇸',
    confederation: 'UEFA',
    group: 'H',
    aliases: ['spain', 'españa', 'espana', 'esp'],
  },
  {
    code: 'por',
    name: 'Portugal',
    flag: '🇵🇹',
    confederation: 'UEFA',
    group: 'K',
    aliases: ['portugal', 'por'],
  },
  {
    code: 'ned',
    name: 'Países Bajos',
    flag: '🇳🇱',
    confederation: 'UEFA',
    group: 'F',
    aliases: ['netherlands', 'holanda', 'paises bajos', 'holland', 'ned'],
  },
  {
    code: 'bel',
    name: 'Bélgica',
    flag: '🇧🇪',
    confederation: 'UEFA',
    group: 'G',
    aliases: ['belgium', 'belgica', 'bélgica', 'bel'],
  },
  {
    code: 'cro',
    name: 'Croacia',
    flag: '🇭🇷',
    confederation: 'UEFA',
    group: 'L',
    aliases: ['croatia', 'croacia', 'cro'],
  },
  {
    code: 'sui',
    name: 'Suiza',
    flag: '🇨🇭',
    confederation: 'UEFA',
    group: 'B',
    aliases: ['switzerland', 'suiza', 'sui'],
  },
  {
    code: 'aut',
    name: 'Austria',
    flag: '🇦🇹',
    confederation: 'UEFA',
    group: 'J',
    aliases: ['austria', 'aut'],
  },
  {
    code: 'swe',
    name: 'Suecia',
    flag: '🇸🇪',
    confederation: 'UEFA',
    group: 'F',
    aliases: ['sweden', 'suecia', 'swe'],
  },
  {
    code: 'nor',
    name: 'Noruega',
    flag: '🇳🇴',
    confederation: 'UEFA',
    group: 'I',
    aliases: ['norway', 'noruega', 'nor'],
  },
  {
    code: 'sco',
    name: 'Escocia',
    flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    confederation: 'UEFA',
    group: 'C',
    aliases: ['scotland', 'escocia', 'sco'],
  },
  {
    code: 'cze',
    name: 'Chequia',
    flag: '🇨🇿',
    confederation: 'UEFA',
    group: 'A',
    aliases: ['czechia', 'czech republic', 'republica checa', 'república checa', 'cze'],
  },
  {
    code: 'bih',
    name: 'Bosnia y Herzegovina',
    flag: '🇧🇦',
    confederation: 'UEFA',
    group: 'B',
    aliases: ['bosnia', 'bosnia and herzegovina', 'bosnia herzegovina', 'bih'],
  },
  {
    code: 'tur',
    name: 'Turquía',
    flag: '🇹🇷',
    confederation: 'UEFA',
    group: 'D',
    aliases: ['turkey', 'turquia', 'turquía', 'turkiye', 'türkiye', 'tur'],
  },

  // ──────────────────────────────────────────────────────────
  // AFC (9 equipos)
  // ──────────────────────────────────────────────────────────
  {
    code: 'jpn',
    name: 'Japón',
    flag: '🇯🇵',
    confederation: 'AFC',
    group: 'F',
    aliases: ['japan', 'japon', 'japón', 'jpn'],
  },
  {
    code: 'kor',
    name: 'Corea del Sur',
    flag: '🇰🇷',
    confederation: 'AFC',
    group: 'A',
    aliases: ['korea', 'south korea', 'corea', 'corea del sur', 'kor'],
  },
  {
    code: 'aus',
    name: 'Australia',
    flag: '🇦🇺',
    confederation: 'AFC',
    group: 'D',
    aliases: ['australia', 'aus'],
  },
  {
    code: 'irn',
    name: 'Irán',
    flag: '🇮🇷',
    confederation: 'AFC',
    group: 'G',
    aliases: ['iran', 'irán', 'irn'],
  },
  {
    code: 'ksa',
    name: 'Arabia Saudita',
    flag: '🇸🇦',
    confederation: 'AFC',
    group: 'H',
    aliases: ['saudi arabia', 'arabia saudita', 'saudi', 'ksa'],
  },
  {
    code: 'qat',
    name: 'Catar',
    flag: '🇶🇦',
    confederation: 'AFC',
    group: 'B',
    aliases: ['qatar', 'catar', 'qat'],
  },
  {
    code: 'irq',
    name: 'Irak',
    flag: '🇮🇶',
    confederation: 'AFC',
    group: 'I',
    aliases: ['iraq', 'irak', 'irq'],
  },
  {
    code: 'jor',
    name: 'Jordania',
    flag: '🇯🇴',
    confederation: 'AFC',
    group: 'J',
    aliases: ['jordan', 'jordania', 'jor'],
  },
  {
    code: 'uzb',
    name: 'Uzbekistán',
    flag: '🇺🇿',
    confederation: 'AFC',
    group: 'K',
    aliases: ['uzbekistan', 'uzbekistán', 'uzb'],
  },

  // ──────────────────────────────────────────────────────────
  // CAF (10 equipos)
  // ──────────────────────────────────────────────────────────
  {
    code: 'mar',
    name: 'Marruecos',
    flag: '🇲🇦',
    confederation: 'CAF',
    group: 'C',
    aliases: ['morocco', 'marruecos', 'mar'],
  },
  {
    code: 'sen',
    name: 'Senegal',
    flag: '🇸🇳',
    confederation: 'CAF',
    group: 'I',
    aliases: ['senegal', 'sen'],
  },
  {
    code: 'civ',
    name: 'Costa de Marfil',
    flag: '🇨🇮',
    confederation: 'CAF',
    group: 'E',
    aliases: ['ivory coast', 'cote divoire', 'costa de marfil', 'civ'],
  },
  {
    code: 'egy',
    name: 'Egipto',
    flag: '🇪🇬',
    confederation: 'CAF',
    group: 'G',
    aliases: ['egypt', 'egipto', 'egy'],
  },
  {
    code: 'alg',
    name: 'Argelia',
    flag: '🇩🇿',
    confederation: 'CAF',
    group: 'J',
    aliases: ['algeria', 'argelia', 'alg'],
  },
  {
    code: 'rsa',
    name: 'Sudáfrica',
    flag: '🇿🇦',
    confederation: 'CAF',
    group: 'A',
    aliases: ['south africa', 'sudafrica', 'sudáfrica', 'rsa'],
  },
  {
    code: 'gha',
    name: 'Ghana',
    flag: '🇬🇭',
    confederation: 'CAF',
    group: 'L',
    aliases: ['ghana', 'gha'],
  },
  {
    code: 'cpv',
    name: 'Cabo Verde',
    flag: '🇨🇻',
    confederation: 'CAF',
    group: 'H',
    aliases: ['cape verde', 'cabo verde', 'cpv'],
  },
  {
    code: 'cod',
    name: 'RD Congo',
    flag: '🇨🇩',
    confederation: 'CAF',
    group: 'K',
    aliases: ['dr congo', 'congo', 'rd congo', 'cod'],
  },
  {
    code: 'tun',
    name: 'Túnez',
    flag: '🇹🇳',
    confederation: 'CAF',
    group: 'F',
    aliases: ['tunisia', 'tunez', 'túnez', 'tun'],
  },

  // ──────────────────────────────────────────────────────────
  // OFC (1 equipo)
  // ──────────────────────────────────────────────────────────
  {
    code: 'nzl',
    name: 'Nueva Zelanda',
    flag: '🇳🇿',
    confederation: 'OFC',
    group: 'G',
    aliases: ['new zealand', 'nueva zelanda', 'nzl'],
  },

  // ──────────────────────────────────────────────────────────
  // ESPECIALES
  // ──────────────────────────────────────────────────────────
  {
    code: 'fwc',
    name: 'FIFA World Cup',
    flag: '🏆',
    confederation: 'SPECIAL' as any,
    group: 'SPECIAL',
    aliases: ['fwc', 'fifa', 'world cup', 'copa del mundo', 'fifa world cup'],
  },
  {
    code: 'cc',
    name: 'Coca-Cola',
    flag: 'CC_LOGO',
    confederation: 'SPECIAL' as any,
    group: 'SPECIAL',
    aliases: ['cc', 'coca cola', 'cocacola', 'coca-cola'],
  },
];

// ============================================================================
// Lookup Maps (pre-computed for O(1) access)
// ============================================================================

/** Mapa de código → Team */
export const TEAM_BY_CODE: Record<string, Team> = {};
TEAMS.forEach((team) => {
  TEAM_BY_CODE[team.code] = team;
});

/** Mapa de alias → código de equipo (incluye el código mismo) */
export const ALIAS_TO_CODE: Record<string, string> = {};
TEAMS.forEach((team) => {
  // El código mismo es un alias
  ALIAS_TO_CODE[team.code] = team.code;
  // Todos los aliases
  team.aliases.forEach((alias) => {
    ALIAS_TO_CODE[alias.toLowerCase()] = team.code;
  });
});

/** Equipos agrupados por grupo */
export const TEAMS_BY_GROUP: Record<string, Team[]> = {};
TEAMS.forEach((team) => {
  if (!TEAMS_BY_GROUP[team.group]) {
    TEAMS_BY_GROUP[team.group] = [];
  }
  TEAMS_BY_GROUP[team.group].push(team);
});

/** Equipos agrupados por confederación */
export const TEAMS_BY_CONFEDERATION: Record<string, Team[]> = {};
TEAMS.forEach((team) => {
  if (!TEAMS_BY_CONFEDERATION[team.confederation]) {
    TEAMS_BY_CONFEDERATION[team.confederation] = [];
  }
  TEAMS_BY_CONFEDERATION[team.confederation].push(team);
});

/** Lista de todos los grupos ordenados */
export const GROUPS = Object.keys(TEAMS_BY_GROUP).sort();

// ============================================================================
// Utility Functions
// ============================================================================

/** Buscar equipo por código */
export function getTeamByCode(code: string): Team | undefined {
  return TEAM_BY_CODE[code.toLowerCase()];
}

/** Buscar equipo por alias (nombre completo, abreviatura, etc.) */
export function getTeamByAlias(alias: string): Team | undefined {
  const code = ALIAS_TO_CODE[alias.toLowerCase()];
  return code ? TEAM_BY_CODE[code] : undefined;
}

/** Resolver un texto a código de equipo */
export function resolveTeamCode(input: string): string | undefined {
  return ALIAS_TO_CODE[input.toLowerCase()];
}

/** Obtener todos los aliases válidos (para autocompletado) */
export function getAllAliases(): string[] {
  return Object.keys(ALIAS_TO_CODE);
}
