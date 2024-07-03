import { theme } from '@/theme';
import { GlobalProvider, useLadleContext } from '@ladle/react';
import { MantineProvider, useMantineColorScheme } from '@mantine/core';
import { PropsWithChildren, useEffect, useState } from 'react';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@/styles/new/application.css';

const getColorSchemeFromDocument = () =>
  (document.documentElement.getAttribute('data-theme') || 'auto') as 'auto' | 'light' | 'dark';

export const Provider: GlobalProvider = ({ children }) => {
  const [defaultColorScheme] = useState(getColorSchemeFromDocument);

  return (
    <MantineProvider theme={theme} defaultColorScheme={defaultColorScheme}>
      <ThemeDetector>{children}</ThemeDetector>
    </MantineProvider>
  );
};

const ThemeDetector: React.FC<PropsWithChildren> = ({ children }) => {
  const { setColorScheme } = useMantineColorScheme();

  const {
    globalState: { theme },
  } = useLadleContext();

  useEffect(() => {
    setColorScheme(theme);
  }, [theme]);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
};

export const argTypes = {
  background: {
    control: { type: 'background' },
    defaultValue: 'var(--color-background)',
    options: ['var(--color-background)'],
  },
};
