import { ThemeProvider } from '@/services/Themes';
import { GlobalProvider } from '@ladle/react';
import { HelmetProvider } from 'react-helmet-async';
// import { PropsWithChildren, useEffect } from 'react';

import '@radix-ui/themes/styles.css';
import '@/styles/new/application.css';

// const getColorSchemeFromDocument = () =>
//   (document.documentElement.getAttribute('data-theme') || 'auto') as 'auto' | 'light' | 'dark';

export const Provider: GlobalProvider = ({ children }) => (
  <HelmetProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </HelmetProvider>
);

// const ThemeDetector: React.FC<PropsWithChildren> = ({ children }) => {
//   const {
//     globalState: { theme },
//   } = useLadleContext();

//   useEffect(() => {
//     document.body.setAttribute('data-theme', theme);
//   }, [theme]);

//   return <>{children}</>;
// };

export const argTypes = {
  background: {
    control: { type: 'background' },
    defaultValue: 'var(--color-background)',
    options: ['var(--color-background)'],
  },
};
