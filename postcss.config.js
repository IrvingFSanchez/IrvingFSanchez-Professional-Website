const purgecss = require("@fullhuman/postcss-purgecss");

module.exports = {
  plugins: {
    autoprefixer: {}, // Add vendor prefixes
    cssnano: {},      // Minify CSS
    'postcss-calc': {},
    "@fullhuman/postcss-purgecss": {
      content: ["./blog/**/*.html", "./assets/js/**/*.js"], // Specify files to scan for used styles
      safelist: ["trigger", "popover", "progress"],        // Safelist any dynamic classes
    },
  },
};
