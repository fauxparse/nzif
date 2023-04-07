import React from 'react';
import type { Preview } from '@storybook/react';
import '../app/frontend/entrypoints/application.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;

export const decorators = [
  (Story) => {
    document.body.setAttribute('data-theme', 'light');
    document.body.classList.add('light-theme');
    return <Story />;
  },
];
