module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    webextensions: true,
    es6: true,
    jest: true
  },
  extends: ['eslint:recommended', 'eslint-config-google', 'prettier'],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module'
  },
  ignorePatterns: ['/src/icon/*'],
  rules: { 'no-console': 'warn', 'require-jsdoc': 0 }
};
