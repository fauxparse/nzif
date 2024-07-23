import { Toast } from '@/components/molecules/Toast';
import { ThemeProvider } from '@/services/Themes';
import { GlobalProvider } from '@ladle/react';
import { getRouterContext } from '@tanstack/react-router';
import { HelmetProvider } from 'react-helmet-async';

import '@radix-ui/themes/styles.css';
import '@/styles/new/application.css';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useEffect } from 'react';

const RouterContext = getRouterContext();

export const Provider: GlobalProvider = ({ globalState, children }) => {
  const { enable, disable } = useDarkMode();

  useEffect(() => {
    if (globalState.theme === 'dark') {
      enable();
    } else {
      disable();
    }
  }, [globalState.theme]);

  return (
    <HelmetProvider>
      <ThemeProvider>
        <Toast.Provider>{children}</Toast.Provider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export const argTypes = {
  background: {
    control: { type: 'background' },
    defaultValue: 'var(--color-background)',
    options: ['var(--color-background)'],
  },
};
