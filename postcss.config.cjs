module.exports = {
  plugins: {
    'postcss-for': {},
    'postcss-nested': {},
    'postcss-import': {},
    'postcss-combine-duplicated-selectors': {},
    'postcss-custom-media': {},
    'postcss-import-ext-glob': {},
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
  }
};
