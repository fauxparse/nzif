import { RefObject, useEffect, useState } from 'react';
import { useDarkMode } from 'usehooks-ts';

export const useCurrentTheme = (ref: RefObject<HTMLElement>) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const parent = ref.current?.parentElement?.closest('[data-theme]');

    const checkTheme = () => {
      setTheme(parent?.getAttribute('data-theme') || 'light');
    };

    const observer = new MutationObserver(checkTheme);

    if (parent) {
      observer.observe(parent, { attributes: true, attributeFilter: ['data-theme'] });
    }

    checkTheme();

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return theme;
};

const useTheme = (): { theme: 'light' | 'dark'; toggle: () => void } => {
  const { isDarkMode, toggle } = useDarkMode();

  return { theme: isDarkMode ? 'dark' : 'light', toggle };
};

export default useTheme;
