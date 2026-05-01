// ============================================================================
// Parser Service — Parseo inteligente de inputs de figuritas
// ============================================================================

import type { ParseResult } from '../types';
import { ALIAS_TO_CODE, TEAM_BY_CODE, TEAMS } from '../data/teams';
import { SPANISH_NUMBER_MAP, ENGLISH_NUMBER_MAP, NATO_ALPHABET } from '../utils/constants';
import { fuzzyMatch, normalizeText, removeAccents } from '../utils/fuzzyMatch';
import { getStickerNumbers } from '../store/albumStore';

const ALL_ALIASES = Object.keys(ALIAS_TO_CODE);

/**
 * Resuelve un texto de número a su valor numérico.
 * Soporta: dígitos directos, "00", texto en español e inglés.
 */
function resolveNumber(text: string): number | undefined {
  const trimmed = text.trim().toLowerCase();

  // Handle special "00" case for FWC
  if (trimmed === '00') return 0;

  const parsed = parseInt(trimmed, 10);
  if (!isNaN(parsed)) return parsed;

  if (SPANISH_NUMBER_MAP[trimmed] !== undefined) return SPANISH_NUMBER_MAP[trimmed];
  if (ENGLISH_NUMBER_MAP[trimmed] !== undefined) return ENGLISH_NUMBER_MAP[trimmed];

  return undefined;
}

/**
 * Detecta si el input contiene letras sueltas dictadas y las une.
 * "j p n 5" → "jpn 5"
 * "c o l 3" → "col 3"
 * "f w c 12" → "fwc 12"
 * También soporta: "jota pe ene 5" (Spanish letter names)
 */
function joinSpelledLetters(input: string): string {
  const parts = input.split(/\s+/);
  if (parts.length < 3) return input;

  // Spanish letter names → letter
  const spanishLetterMap: Record<string, string> = {
    a: 'a', be: 'b', ce: 'c', de: 'd', e: 'e', efe: 'f', ge: 'g', hache: 'h',
    i: 'i', jota: 'j', ka: 'k', ele: 'l', eme: 'm', ene: 'n', o: 'o', pe: 'p',
    cu: 'q', erre: 'r', ese: 's', te: 't', u: 'u', uve: 'v', 'doble uve': 'w',
    equis: 'x', ye: 'y', zeta: 'z',
    // Also handle NATO
    ...NATO_ALPHABET,
  };

  // Try to find a sequence of single letters (or Spanish letter names) followed by a number
  const letters: string[] = [];
  let numberIdx = -1;

  for (let i = 0; i < parts.length; i++) {
    const p = parts[i].toLowerCase();

    // Is it a single letter?
    if (p.length === 1 && /^[a-z]$/i.test(p)) {
      letters.push(p);
      continue;
    }

    // Is it a Spanish letter name or NATO?
    if (spanishLetterMap[p]) {
      letters.push(spanishLetterMap[p]);
      continue;
    }

    // If we already have some letters and this looks like a number, we're done
    if (letters.length >= 2) {
      numberIdx = i;
      break;
    }

    // Not a letter, not after enough letters — reset
    return input;
  }

  if (letters.length >= 2) {
    const code = letters.join('');
    const rest = numberIdx >= 0 ? ' ' + parts.slice(numberIdx).join(' ') : '';
    return code + rest;
  }

  return input;
}

/**
 * Resuelve un texto de equipo a su código.
 */
function resolveTeam(text: string): { code: string; name: string } | undefined {
  const normalized = normalizeText(text);

  // 1. Exact match
  const directCode = ALIAS_TO_CODE[normalized];
  if (directCode) return { code: directCode, name: TEAM_BY_CODE[directCode].name };

  // 2. Without accents
  const noAccent = removeAccents(normalized);
  const directCode2 = ALIAS_TO_CODE[noAccent];
  if (directCode2) return { code: directCode2, name: TEAM_BY_CODE[directCode2].name };

  // 3. Fuzzy match
  const bestAlias = fuzzyMatch(normalized, ALL_ALIASES, 2);
  if (bestAlias) {
    const code = ALIAS_TO_CODE[bestAlias];
    return { code, name: TEAM_BY_CODE[code].name };
  }

  // 4. Partial match
  for (const team of TEAMS) {
    const teamNameNorm = normalizeText(team.name);
    if (teamNameNorm.includes(normalized) || normalized.includes(teamNameNorm)) {
      return { code: team.code, name: team.name };
    }
    for (const alias of team.aliases) {
      const aliasNorm = normalizeText(alias);
      if (aliasNorm.includes(normalized) || normalized.includes(aliasNorm)) {
        return { code: team.code, name: team.name };
      }
    }
  }

  return undefined;
}

/**
 * Valida que un número es válido para un equipo dado.
 */
function isValidNumber(teamCode: string, number: number): boolean {
  const numbers = getStickerNumbers(teamCode);
  return numbers.includes(number);
}

/**
 * Parsea un string de input individual.
 */
function parseSingleInput(input: string): ParseResult {
  const original = input.trim();
  if (!original) {
    return { success: false, teamCode: '', teamName: '', number: -1, stickerId: '', originalInput: original, error: 'Input vacío' };
  }

  // Pre-process: join spelled-out letters
  const processed = joinSpelledLetters(normalizeText(original));
  const parts = processed.split(/\s+/);

  if (parts.length < 2) {
    return { success: false, teamCode: '', teamName: '', number: -1, stickerId: '', originalInput: original, error: 'Formato: <selección> <número>. Ej: "arg 1" o "fwc 00"' };
  }

  // Try: last part = number, rest = team
  const numberPart = parts[parts.length - 1];
  const teamPart = parts.slice(0, -1).join(' ');
  let number = resolveNumber(numberPart);

  if (number !== undefined) {
    const team = resolveTeam(teamPart);
    if (team) {
      if (!isValidNumber(team.code, number)) {
        const nums = getStickerNumbers(team.code);
        return { success: false, teamCode: team.code, teamName: team.name, number, stickerId: '', originalInput: original,
          error: `Número ${number} no existe para ${team.name}. Rango: ${nums[0]}-${nums[nums.length - 1]}` };
      }
      return { success: true, teamCode: team.code, teamName: team.name, number, stickerId: `${team.code}-${number}`, originalInput: original };
    }
  }

  // Try: first part = number, rest = team
  const firstAsNumber = resolveNumber(parts[0]);
  if (firstAsNumber !== undefined) {
    const altTeamPart = parts.slice(1).join(' ');
    const team = resolveTeam(altTeamPart);
    if (team && isValidNumber(team.code, firstAsNumber)) {
      return { success: true, teamCode: team.code, teamName: team.name, number: firstAsNumber, stickerId: `${team.code}-${firstAsNumber}`, originalInput: original };
    }
  }

  // Couldn't parse
  const errorMsg = number === undefined
    ? `No se pudo reconocer: "${original}"`
    : `Selección no reconocida: "${teamPart}"`;
  return { success: false, teamCode: '', teamName: '', number: number ?? -1, stickerId: '', originalInput: original, error: errorMsg };
}

/**
 * Parsea múltiples inputs separados por comas, saltos de línea, o punto y coma.
 */
export function parseInput(input: string): ParseResult[] {
  const entries = input.split(/[,;\n]+/).map((s) => s.trim()).filter((s) => s.length > 0);
  return entries.map(parseSingleInput);
}

/**
 * Genera el ID de una figurita a partir de código de equipo y número.
 */
export function makeStickerID(teamCode: string, number: number): string {
  return `${teamCode}-${number}`;
}
