// ============================================================================
// Constants — Álbum de Figuritas Mundial 2026
// ============================================================================

/** Cantidad de figuritas por equipo (selecciones) */
export const STICKERS_PER_TEAM = 20;

/** Rango de números de figuritas para selecciones */
export const STICKER_MIN = 1;
export const STICKER_MAX = 20;

/** Total de equipos (selecciones) */
export const TOTAL_TEAMS = 48;

/** Configuración de secciones especiales */
export const SPECIAL_SECTIONS = {
  fwc: { name: 'FIFA World Cup', icon: '🏆', numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], count: 20 },
  cc: { name: 'Coca-Cola', icon: '🥤', numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], count: 14 },
} as const;

/** Total de figuritas en el álbum */
export const TOTAL_STICKERS = (TOTAL_TEAMS * STICKERS_PER_TEAM) + SPECIAL_SECTIONS.fwc.count + SPECIAL_SECTIONS.cc.count; // 960 + 20 + 14 = 994

/** Versión actual del esquema de datos */
export const DATA_VERSION = 2;

/** Clave de LocalStorage */
export const STORAGE_KEY = 'figuritas2026_album';
export const THEME_STORAGE_KEY = 'figuritas2026_theme';

/** Nombre de la app */
export const APP_NAME = 'Álbum Mundial 2026';

/** Duración default de toast (ms) */
export const TOAST_DURATION = 3500;

/** Mapeo de números en texto (español) a dígitos */
export const SPANISH_NUMBER_MAP: Record<string, number> = {
  cero: 0, uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5,
  seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11,
  doce: 12, trece: 13, catorce: 14, quince: 15, dieciseis: 16,
  diecisiete: 17, dieciocho: 18, diecinueve: 19, veinte: 20,
};

/** Mapeo de números en texto (inglés) a dígitos */
export const ENGLISH_NUMBER_MAP: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11,
  twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
};

/** Orden de confederaciones para display */
export const CONFEDERATION_ORDER = [
  'CONMEBOL', 'CONCACAF', 'UEFA', 'AFC', 'CAF', 'OFC',
] as const;

/** Labels legibles de confederaciones */
export const CONFEDERATION_LABELS: Record<string, string> = {
  CONMEBOL: 'Sudamérica', CONCACAF: 'Norte y Centroamérica', UEFA: 'Europa',
  AFC: 'Asia', CAF: 'África', OFC: 'Oceanía', SPECIAL: 'Especiales',
};

/** Colores de confederaciones */
export const CONFEDERATION_COLORS: Record<string, string> = {
  CONMEBOL: '#2563eb', CONCACAF: '#16a34a', UEFA: '#7c3aed',
  AFC: '#ea580c', CAF: '#ca8a04', OFC: '#0891b2', SPECIAL: '#ec4899',
};

/** Letras del alfabeto NATO para parseo por voz letra a letra */
export const NATO_ALPHABET: Record<string, string> = {
  alfa: 'a', alpha: 'a', bravo: 'b', charlie: 'c', delta: 'd', echo: 'e',
  foxtrot: 'f', golf: 'g', hotel: 'h', india: 'i', juliet: 'j', kilo: 'k',
  lima: 'l', mike: 'm', november: 'n', oscar: 'o', papa: 'p', quebec: 'q',
  romeo: 'r', sierra: 's', tango: 't', uniform: 'u', victor: 'v',
  whiskey: 'w', 'x-ray': 'x', xray: 'x', yankee: 'y', zulu: 'z',
};
