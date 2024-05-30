import { ActionIcon } from '@mantine/core';

import ButtonClasses from './Button.module.css';

export default ActionIcon.extend({
  classNames: ButtonClasses,
  defaultProps: {
    size: 'md',
    'data-color': 'primary',
  },
  vars: () => ({
    root: {
      '--ai-size': 'var(--button-block-size)',
      '--ai-bg': 'var(--button-background)',
      '--ai-hover': 'var(--button-background-hover)',
      '--ai-color': 'var(--button-text)',
      '--ai-hover-color': 'var(--button-text-hover)',
      '--ai-bd': '1px solid var(--button-border-color)',
      '--ai-radius': 'var(--radius-round)',
    },
    icon: {
      '--icon': 'currentColor',
    },
  }),
});
