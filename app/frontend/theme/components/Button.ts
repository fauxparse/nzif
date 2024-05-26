import { Button } from '@mantine/core';

import ButtonClasses from './Button.module.css';

export default Button.extend({
  classNames: ButtonClasses,
  defaultProps: {
    size: 'md',
    'data-color': 'primary',
  },
  vars: () => ({
    root: {
      '--button-height': 'var(--button-block-size)',
      '--button-padding-x': 'var(--button-padding-inline)',
      '--button-bg': 'var(--button-background)',
      '--button-hover': 'var(--button-background-hover)',
      '--button-color': 'var(--button-text)',
      '--button-hover-color': 'var(--button-text-hover)',
      '--button-bd': '1px solid var(--button-border-color)',
    },
  }),
});
