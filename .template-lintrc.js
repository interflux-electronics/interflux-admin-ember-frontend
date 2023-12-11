'use strict';

module.exports = {
  extends: 'recommended',

  rules: {
    'no-down-event-binding': 'off',
    'no-duplicate-id': 'off',
    'no-duplicate-landmark-elements': 'off',
    'no-redundant-landmark-role': 'off',
    'require-input-label': 'off',
    'no-potential-path-strings': 'warn',
    'no-heading-inside-button': 'warn',
    'require-presentational-children': 'warn',
    'no-autofocus-attribute': 'warn',
    'require-valid-alt-text': 'warn',
    'simple-unless': 'warn',
    'no-implicit-this': { allow: ['cdn'] }
  }
};
