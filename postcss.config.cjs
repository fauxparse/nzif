const postcssNesting = require('postcss-nested');
const postcssImport = require('postcss-import');
const combineSelectors = require('postcss-combine-duplicated-selectors');
const customMedia = require('postcss-custom-media');
const importGlob = require('postcss-import-ext-glob');

module.exports = {
  plugins: [importGlob(), postcssImport(), customMedia(), postcssNesting(), combineSelectors()],
};
