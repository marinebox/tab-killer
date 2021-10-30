module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    webextensions: true,
    es6: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {},
};
