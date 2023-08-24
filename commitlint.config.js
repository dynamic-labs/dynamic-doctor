module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [2, 'always', '500'],
    'header-case': [1, 'always', 'lower-case'],
  },
};
