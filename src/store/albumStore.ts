// ============================================================================
// Album Store — Zustand state management for sticker collection
// ============================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Sticker, StickerStatus, ExportData } from '../types';
import { TEAMS } from '../data/teams';
import { STICKERS_PER_TEAM, STORAGE_KEY, DATA_VERSION, SPECIAL_SECTIONS, STICKER_MIN } from '../utils/constants';
import { makeStickerID } from '../services/parserService';

// ============================================================================
// Initial State Builder
// ============================================================================

/** Get the list of sticker numbers for a given team code */
export function getStickerNumbers(teamCode: string): number[] {
  if (teamCode === 'fwc') return [...SPECIAL_SECTIONS.fwc.numbers];
  if (teamCode === 'cc') return [...SPECIAL_SECTIONS.cc.numbers];
  // Normal teams: 1 to 20
  return Array.from({ length: STICKERS_PER_TEAM }, (_, i) => i + STICKER_MIN);
}

/** Get the total sticker count for a given team code */
export function getStickerCount(teamCode: string): number {
  if (teamCode === 'fwc') return SPECIAL_SECTIONS.fwc.count;
  if (teamCode === 'cc') return SPECIAL_SECTIONS.cc.count;
  return STICKERS_PER_TEAM;
}

function buildInitialStickers(): Record<string, Sticker> {
  const stickers: Record<string, Sticker> = {};
  TEAMS.forEach((team) => {
    const numbers = getStickerNumbers(team.code);
    numbers.forEach((n) => {
      const id = makeStickerID(team.code, n);
      stickers[id] = { id, teamCode: team.code, number: n, status: 'missing', count: 0 };
    });
  });
  return stickers;
}

// ============================================================================
// Store Interface
// ============================================================================

interface AlbumStore {
  stickers: Record<string, Sticker>;
  lastUpdated: string;
  version: number;

  addSticker: (teamCode: string, number: number) => 'new' | 'repeated' | 'invalid';
  removeSticker: (teamCode: string, number: number) => boolean;
  toggleSticker: (teamCode: string, number: number) => void;
  markTeamComplete: (teamCode: string) => void;
  clearTeam: (teamCode: string) => void;
  resetAlbum: () => void;
  completeAlbum: () => void;
  importData: (data: ExportData) => number;
  isTeamComplete: (teamCode: string) => boolean;
}

// ============================================================================
// Store Implementation
// ============================================================================

export const useAlbumStore = create<AlbumStore>()(
  persist(
    (set, get) => ({
      stickers: buildInitialStickers(),
      lastUpdated: new Date().toISOString(),
      version: DATA_VERSION,

      addSticker: (teamCode: string, number: number): 'new' | 'repeated' | 'invalid' => {
        const id = makeStickerID(teamCode, number);
        const stickers = get().stickers;
        const sticker = stickers[id];
        if (!sticker) return 'invalid';

        const newCount = sticker.count + 1;
        const newStatus: StickerStatus = newCount > 1 ? 'repeated' : 'obtained';
        const result = sticker.count === 0 ? 'new' : 'repeated';
        set({
          stickers: { ...stickers, [id]: { ...sticker, count: newCount, status: newStatus } },
          lastUpdated: new Date().toISOString(),
        });
        return result;
      },

      removeSticker: (teamCode: string, number: number): boolean => {
        const id = makeStickerID(teamCode, number);
        const stickers = get().stickers;
        const sticker = stickers[id];
        if (!sticker || sticker.count === 0) return false;

        const newCount = sticker.count - 1;
        let newStatus: StickerStatus = 'missing';
        if (newCount >= 2) newStatus = 'repeated';
        else if (newCount === 1) newStatus = 'obtained';
        set({
          stickers: { ...stickers, [id]: { ...sticker, count: newCount, status: newStatus } },
          lastUpdated: new Date().toISOString(),
        });
        return true;
      },

      toggleSticker: (teamCode: string, number: number): void => {
        const id = makeStickerID(teamCode, number);
        const stickers = get().stickers;
        const sticker = stickers[id];
        if (!sticker) return;

        if (sticker.count === 0) {
          get().addSticker(teamCode, number);
        } else {
          set({
            stickers: { ...stickers, [id]: { ...sticker, count: 0, status: 'missing' } },
            lastUpdated: new Date().toISOString(),
          });
        }
      },

      markTeamComplete: (teamCode: string): void => {
        const stickers = { ...get().stickers };
        const numbers = getStickerNumbers(teamCode);
        numbers.forEach((n) => {
          const id = makeStickerID(teamCode, n);
          if (stickers[id] && stickers[id].count === 0) {
            stickers[id] = { ...stickers[id], count: 1, status: 'obtained' };
          }
        });
        set({ stickers, lastUpdated: new Date().toISOString() });
      },

      clearTeam: (teamCode: string): void => {
        const stickers = { ...get().stickers };
        const numbers = getStickerNumbers(teamCode);
        numbers.forEach((n) => {
          const id = makeStickerID(teamCode, n);
          if (stickers[id]) {
            stickers[id] = { ...stickers[id], count: 0, status: 'missing' };
          }
        });
        set({ stickers, lastUpdated: new Date().toISOString() });
      },

      resetAlbum: (): void => {
        set({ stickers: buildInitialStickers(), lastUpdated: new Date().toISOString() });
      },

      completeAlbum: (): void => {
        const stickers: Record<string, Sticker> = {};
        TEAMS.forEach((team) => {
          const numbers = getStickerNumbers(team.code);
          numbers.forEach((n) => {
            const id = makeStickerID(team.code, n);
            stickers[id] = { id, teamCode: team.code, number: n, status: 'obtained', count: 1 };
          });
        });
        set({ stickers, lastUpdated: new Date().toISOString() });
      },

      isTeamComplete: (teamCode: string): boolean => {
        const stickers = get().stickers;
        const numbers = getStickerNumbers(teamCode);
        return numbers.every((n) => {
          const id = makeStickerID(teamCode, n);
          return stickers[id] && stickers[id].count > 0;
        });
      },

      importData: (data: ExportData): number => {
        const stickers = { ...buildInitialStickers() };
        let imported = 0;
        Object.entries(data.stickers).forEach(([id, { count }]) => {
          if (stickers[id] && count > 0) {
            stickers[id] = { ...stickers[id], count, status: count > 1 ? 'repeated' : 'obtained' };
            imported++;
          }
        });
        set({ stickers, lastUpdated: new Date().toISOString() });
        return imported;
      },
    }),
    {
      name: STORAGE_KEY,
      version: DATA_VERSION,
      migrate: (persistedState: any, version: number) => {
        // Migration from v1 (old 0-11 numbering) — just reset
        if (version < DATA_VERSION) {
          return { ...persistedState, stickers: buildInitialStickers(), version: DATA_VERSION };
        }
        return persistedState as any;
      },
    }
  )
);
