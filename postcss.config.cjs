module.exports = {
  plugins: [
    require('@csstools/postcss-global-data')({
      files: ['app/frontend/styles/new/breakpoints.css']
    }),
    require('postcss-for'),
    require('postcss-nested'),
    require('./postcss.breakpoints.cjs'),
    require('postcss-import'),
    require('postcss-combine-duplicated-selectors'),
    require('postcss-custom-media'),
    require('postcss-import-ext-glob'),
  ]
};
