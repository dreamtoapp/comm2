// prettier.config.js
module.exports = {
  // existing config...
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  arrowParens: 'always',
  bracketSpacing: true,
  endOfLine: 'auto',

  // add this line:
  plugins: ['prettier-plugin-tailwindcss'],

  // (optional) if your tailwind.config.js lives elsewhere:
  // tailwindConfig: './path/to/tailwind.config.js',
};
