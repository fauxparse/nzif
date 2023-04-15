import React, { Fragment, useEffect, useState } from 'react';
import type { Preview } from '@storybook/react';
import { DocsContainer } from '@storybook/addon-docs';
import { addons } from '@storybook/preview-api';
import { themes } from '@storybook/theming';
import { DARK_MODE_EVENT_NAME, useDarkMode } from 'storybook-dark-mode';

import dark from './themes/dark';
import light from './themes/light';

import '../app/frontend/entrypoints/application.css';

const channel = addons.getChannel();

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      container: ({ children, context }) => {
        const [isDark, setDark] = useState(useDarkMode());

        useEffect(() => {
          channel.on(DARK_MODE_EVENT_NAME, setDark);
          return () => channel.off(DARK_MODE_EVENT_NAME, setDark);
        }, [channel, setDark]);

        useEffect(() => {
          const theme = isDark ? 'dark' : 'light';
          const { classList } = document.body;

          document.body.setAttribute('data-theme', theme);
          classList.remove('dark-theme');
          classList.remove('light-theme');
          classList.add(`${theme}-theme`);
          document.body.style.colorScheme = theme;
        }, [isDark]);

        return (
          <DocsContainer context={context} theme={isDark ? dark : light}>
            {children}
          </DocsContainer>
        );
      },
    },
    darkMode: {
      dark: { ...themes.dark, ...dark },
      light: { ...themes.light, ...light },
      lightClass: 'light-theme',
      darkClass: 'dark-theme',
      stylePreview: true,
    },
    backgrounds: {
      disable: true,
      grid: {
        cellSize: 8,
        opacity: 0.25,
        cellAmount: 4,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = useDarkMode() ? 'dark' : 'light';
      const { classList } = document.body;

      document.body.setAttribute('data-theme', theme);
      classList.remove('dark-theme');
      classList.remove('light-theme');
      classList.add(`${theme}-theme`);
      document.body.style.colorScheme = theme;

      return <Story />;
    },
  ],
};

export default preview;
