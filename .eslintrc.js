module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    webextensions: true,
    es6: true,
  },
  extends: ['eslint:recommended', 'eslint-config-google', 'prettier'],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  rules: { 'no-console': 'warn' },
};
