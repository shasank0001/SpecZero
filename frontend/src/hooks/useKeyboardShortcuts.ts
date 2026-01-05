import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
  description?: string;
}

/**
 * Hook for registering keyboard shortcuts
 * Handles both Cmd (Mac) and Ctrl (Windows/Linux) modifiers
 */
export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const matchesKey = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const matchesShift = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
        const matchesAlt = shortcut.altKey ? event.altKey : !event.altKey;
        
        // Handle Cmd on Mac, Ctrl on Windows/Linux
        const matchesCmdOrCtrl = shortcut.ctrlKey 
          ? (event.ctrlKey || event.metaKey) 
          : (!event.ctrlKey && !event.metaKey);
        
        if (matchesKey && matchesCmdOrCtrl && matchesShift && matchesAlt) {
          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    },
    [shortcuts]
  );
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Hook for app-wide navigation shortcuts
 * Ctrl/Cmd + 1-4 navigates to different tabs
 */
export function useAppShortcuts() {
  const navigate = useNavigate();
  
  const shortcuts: ShortcutConfig[] = [
    {
      key: '1',
      ctrlKey: true,
      callback: () => navigate('/'),
      description: 'Go to Plan tab',
    },
    {
      key: '2',
      ctrlKey: true,
      callback: () => navigate('/data'),
      description: 'Go to Data tab',
    },
    {
      key: '3',
      ctrlKey: true,
      callback: () => navigate('/designs'),
      description: 'Go to Designs tab',
    },
    {
      key: '4',
      ctrlKey: true,
      callback: () => navigate('/export'),
      description: 'Go to Export tab',
    },
  ];
  
  useKeyboardShortcuts(shortcuts);
}

// Export list of available shortcuts for display in help modal
export const APP_SHORTCUTS = [
  { keys: 'Ctrl/⌘ + 1', description: 'Go to Plan tab' },
  { keys: 'Ctrl/⌘ + 2', description: 'Go to Data tab' },
  { keys: 'Ctrl/⌘ + 3', description: 'Go to Designs tab' },
  { keys: 'Ctrl/⌘ + 4', description: 'Go to Export tab' },
];
