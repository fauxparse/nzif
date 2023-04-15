import { create } from '@storybook/theming/create';
import { slateDark } from '@radix-ui/colors';
import { crimsonDark } from '@radix-ui/colors';

export default create({
  base: 'dark',
  fontBase: '"Inter", sans-serif',
  fontCode: 'monospace',

  brandTitle: 'NZIF',
  brandUrl: 'https://my.improvfest.nz',
  // brandImage: 'https://storybook.js.org/images/placeholders/350x150.png',
  brandTarget: '_self',

  colorPrimary: crimsonDark.crimson9,
  colorSecondary: crimsonDark.crimson9,

  // UI
  appBg: slateDark.slate2,
  appContentBg: slateDark.slate1,
  appBorderColor: slateDark.slate6,
  appBorderRadius: 0,

  // Text colors
  textColor: slateDark.slate12,
  textInverseColor: slateDark.slate1,

  // Toolbar default and active colors
  barTextColor: slateDark.slate11,
  barSelectedColor: slateDark.slate5,
  barBg: slateDark.slate2,

  // Form colors
  inputBg: slateDark.slate3,
  inputBorder: slateDark.slate7,
  inputTextColor: slateDark.slate12,
  inputBorderRadius: 4,
});
