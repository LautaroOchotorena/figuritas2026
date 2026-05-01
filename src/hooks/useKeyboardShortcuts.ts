// ============================================================================
// useKeyboardShortcuts Hook — Global keyboard shortcuts
// ============================================================================

import { useEffect } from 'react';
import { useUIStore } from '../store/uiStore';

interface KeyboardShortcutsOptions {
  onSpaceDown?: () => void;
  onSpaceUp?: () => void;
}

export function useKeyboardShortcuts(options: KeyboardShortcutsOptions = {}) {
  const setSelectedTeam = useUIStore((s) => s.setSelectedTeam);
  const setShowBulkInput = useUIStore((s) => s.setShowBulkInput);
  const setShowSettings = useUIStore((s) => s.setShowSettings);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // No capturar si estamos en un input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          options.onSpaceDown?.();
          break;
        case 'Escape':
          setSelectedTeam(null);
          setShowBulkInput(false);
          setShowSettings(false);
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        options.onSpaceUp?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [options, setSelectedTeam, setShowBulkInput, setShowSettings]);
}
