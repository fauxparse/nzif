import { useEffect } from 'react';

/**
 * Registers a `beforeunload` handler that prompts the browser's native
 * "leave site?" confirmation when `enabled` is true. Pass a falsy value to
 * silently allow navigation (e.g. once the user has finished).
 */
export const useBeforeUnload = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return;

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [enabled]);
};
