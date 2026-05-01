// ============================================================================
// Types & Interfaces — Álbum de Figuritas Mundial 2026
// ============================================================================

/** Confederaciones FIFA */
export type Confederation =
  | 'CONMEBOL'
  | 'CONCACAF'
  | 'UEFA'
  | 'AFC'
  | 'CAF'
  | 'OFC';

/** Estado de una figurita en la colección del usuario */
export type StickerStatus = 'missing' | 'obtained' | 'repeated';

/** Tipos de filtro para la vista del álbum */
export type FilterType = 'all' | 'missing' | 'obtained' | 'repeated' | 'complete' | 'incomplete';

/** Filtro de vista de confederación */
export type ConfederationFilter = Confederation | 'ALL';

/** Tema visual */
export type Theme = 'light' | 'dark';

/** Tipo de toast notification */
export type ToastType = 'success' | 'warning' | 'error' | 'info';

// ============================================================================
// Data Models
// ============================================================================

/** Representa una selección nacional */
export interface Team {
  /** Código corto único (ej: "arg", "mex") */
  code: string;
  /** Nombre completo (ej: "Argentina", "México") */
  name: string;
  /** Confederación FIFA */
  confederation: Confederation;
  /** Emoji de bandera */
  flag: string;
  /** Grupo del mundial (A-L) */
  group: string;
  /** Nombres alternativos para búsqueda/voz */
  aliases: string[];
}

/** Representa una figurita individual en la colección */
export interface Sticker {
  /** ID único: "{teamCode}-{number}" (ej: "arg-0") */
  id: string;
  /** Código de la selección */
  teamCode: string;
  /** Número de la figurita (0-11) */
  number: number;
  /** Estado actual */
  status: StickerStatus;
  /** Cantidad total obtenida (0 = missing, 1 = obtained, 2+ = repeated) */
  count: number;
}

/** Estado completo del álbum persistido */
export interface AlbumState {
  /** Mapa de figuritas por ID */
  stickers: Record<string, Sticker>;
  /** Última actualización (ISO timestamp) */
  lastUpdated: string;
  /** Versión del esquema para migraciones */
  version: number;
}

// ============================================================================
// Service Results
// ============================================================================

/** Resultado del parseo de un input de texto */
export interface ParseResult {
  /** Si el parseo fue exitoso */
  success: boolean;
  /** Código de equipo resuelto */
  teamCode: string;
  /** Nombre completo del equipo (para display) */
  teamName: string;
  /** Número de figurita */
  number: number;
  /** ID de figurita generado */
  stickerId: string;
  /** Input original del usuario */
  originalInput: string;
  /** Mensaje de error si no fue exitoso */
  error?: string;
}

/** Resultado del reconocimiento de voz */
export interface VoiceResult {
  /** Texto reconocido */
  transcript: string;
  /** Confianza del reconocimiento (0-1) */
  confidence: number;
  /** Si es resultado final o intermedio */
  isFinal: boolean;
}

// ============================================================================
// UI State
// ============================================================================

/** Toast notification */
export interface Toast {
  /** ID único */
  id: string;
  /** Tipo de notificación */
  type: ToastType;
  /** Mensaje principal */
  message: string;
  /** Submensaje opcional */
  detail?: string;
  /** Duración en ms (default 3000) */
  duration?: number;
}

/** Progreso de un equipo */
export interface TeamProgress {
  teamCode: string;
  obtained: number;
  missing: number;
  repeated: number;
  total: number;
  percentage: number;
}

/** Progreso de una confederación */
export interface ConfederationProgress {
  confederation: Confederation;
  teams: number;
  totalStickers: number;
  obtained: number;
  percentage: number;
}

/** Datos para exportar/importar */
export interface ExportData {
  appName: string;
  version: number;
  exportDate: string;
  stickers: Record<string, { count: number }>;
}
