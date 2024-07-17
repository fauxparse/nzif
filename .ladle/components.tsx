import { Toast } from '@/components/molecules/Toast';
import { ThemeProvider } from '@/services/Themes';
import { GlobalProvider } from '@ladle/react';
import { HelmetProvider } from 'react-helmet-async';

import '@radix-ui/themes/styles.css';
import '@/styles/new/application.css';

export const Provider: GlobalProvider = ({ children }) => (
  <HelmetProvider>
    <ThemeProvider>
      <Toast.Provider>{children}</Toast.Provider>
    </ThemeProvider>
  </HelmetProvider>
);

export const argTypes = {
  background: {
    control: { type: 'background' },
    defaultValue: 'var(--color-background)',
    options: ['var(--color-background)'],
  },
};
