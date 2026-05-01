// ============================================================================
// UI Store — Global UI state management
// ============================================================================

import { create } from 'zustand';
import type { Toast, Theme, FilterType, ConfederationFilter } from '../types';
import { loadTheme, saveTheme } from '../services/storageService';
import { TOAST_DURATION } from '../utils/constants';

interface UIStore {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Filters
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  confederationFilter: ConfederationFilter;
  setConfederationFilter: (conf: ConfederationFilter) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Modals
  selectedTeam: string | null;
  setSelectedTeam: (teamCode: string | null) => void;
  showBulkInput: boolean;
  setShowBulkInput: (show: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;

  // Sidebar
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

let toastCounter = 0;

export const useUIStore = create<UIStore>((set, get) => ({
  // ── Theme ──────────────────────────────────────────────
  theme: loadTheme(),

  setTheme: (theme: Theme) => {
    saveTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },

  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(newTheme);
  },

  // ── Filters ────────────────────────────────────────────
  filter: 'all',
  setFilter: (filter: FilterType) => set({ filter }),

  confederationFilter: 'ALL',
  setConfederationFilter: (conf: ConfederationFilter) => set({ confederationFilter: conf }),

  searchQuery: '',
  setSearchQuery: (query: string) => set({ searchQuery: query }),

  // ── Modals ─────────────────────────────────────────────
  selectedTeam: null,
  setSelectedTeam: (teamCode: string | null) => set({ selectedTeam: teamCode }),

  showBulkInput: false,
  setShowBulkInput: (show: boolean) => set({ showBulkInput: show }),

  showSettings: false,
  setShowSettings: (show: boolean) => set({ showSettings: show }),

  showHelp: false,
  setShowHelp: (show: boolean) => set({ showHelp: show }),

  // ── Sidebar ────────────────────────────────────────────
  isSidebarOpen: false,
  setSidebarOpen: (open: boolean) => set({ isSidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),

  // ── Toasts ─────────────────────────────────────────────
  toasts: [],

  addToast: (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastCounter}-${Date.now()}`;
    const newToast: Toast = { ...toast, id };
    set((s) => ({ toasts: [...s.toasts, newToast] }));

    // Auto-remove after duration
    const duration = toast.duration || TOAST_DURATION;
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },

  removeToast: (id: string) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
}));
