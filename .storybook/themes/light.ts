import { create } from '@storybook/theming/create';
import { slate } from '@radix-ui/colors';
import { crimson } from '@radix-ui/colors';

export default create({
  base: 'light',
  fontBase: '"Inter", sans-serif',
  fontCode: 'monospace',

  brandTitle: 'NZIF',
  brandUrl: 'https://my.improvfest.nz',
  // brandImage: 'https://storybook.js.org/images/placeholders/350x150.png',
  brandTarget: '_self',

  colorPrimary: crimson.crimson9,
  colorSecondary: crimson.crimson9,

  // UI
  appBg: slate.slate2,
  appContentBg: slate.slate1,
  appBorderColor: slate.slate6,
  appBorderRadius: 0,

  // Text colors
  textColor: slate.slate12,
  textInverseColor: slate.slate1,

  // Toolbar default and active colors
  barTextColor: slate.slate11,
  barSelectedColor: slate.slate5,
  barBg: slate.slate2,

  // Form colors
  inputBg: slate.slate3,
  inputBorder: slate.slate7,
  inputTextColor: slate.slate12,
  inputBorderRadius: 4,
});
