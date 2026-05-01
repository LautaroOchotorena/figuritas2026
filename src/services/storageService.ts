// ============================================================================
// Storage Service — LocalStorage persistence + export/import
// ============================================================================

import type { AlbumState, ExportData, Sticker } from '../types';
import { STORAGE_KEY, DATA_VERSION, THEME_STORAGE_KEY } from '../utils/constants';
import type { Theme } from '../types';

/**
 * Guarda el estado del álbum en LocalStorage.
 */
export function saveAlbumState(state: AlbumState): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Error saving album state:', error);
  }
}

/**
 * Carga el estado del álbum desde LocalStorage.
 */
export function loadAlbumState(): AlbumState | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    
    const state = JSON.parse(serialized) as AlbumState;
    
    // Validación básica
    if (!state.stickers || typeof state.version !== 'number') {
      return null;
    }

    // Migración si es necesario
    if (state.version < DATA_VERSION) {
      return migrateState(state);
    }

    return state;
  } catch (error) {
    console.error('Error loading album state:', error);
    return null;
  }
}

/**
 * Migra estados de versiones anteriores a la versión actual.
 */
function migrateState(state: AlbumState): AlbumState {
  // Futuras migraciones van acá
  return { ...state, version: DATA_VERSION };
}

/**
 * Exporta el estado del álbum a un objeto JSON descargable.
 * Solo exporta las figuritas con count > 0 para mantener el archivo liviano.
 */
export function exportAlbum(stickers: Record<string, Sticker>): ExportData {
  const exportStickers: Record<string, { count: number }> = {};
  
  Object.entries(stickers).forEach(([id, sticker]) => {
    if (sticker.count > 0) {
      exportStickers[id] = { count: sticker.count };
    }
  });

  return {
    appName: 'Álbum Mundial 2026',
    version: DATA_VERSION,
    exportDate: new Date().toISOString(),
    stickers: exportStickers,
  };
}

/**
 * Descarga un objeto como archivo JSON.
 */
export function downloadJSON(data: ExportData, filename: string = 'album-mundial-2026.json'): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Lee un archivo JSON subido por el usuario.
 * Retorna los datos parseados o null si es inválido.
 */
export function readJSONFile(file: File): Promise<ExportData | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as ExportData;
        
        // Validación básica
        if (!data.stickers || !data.version) {
          resolve(null);
          return;
        }
        
        resolve(data);
      } catch {
        resolve(null);
      }
    };
    reader.onerror = () => resolve(null);
    reader.readAsText(file);
  });
}

/**
 * Guarda el tema en LocalStorage.
 */
export function saveTheme(theme: Theme): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/**
 * Carga el tema desde LocalStorage.
 */
export function loadTheme(): Theme {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  
  // Detectar preferencia del sistema
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'dark'; // Default dark mode
}
