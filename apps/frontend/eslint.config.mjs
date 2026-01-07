import angular from 'angular-eslint';
import baseConfig from '../../eslint.config.mjs';

export default [
  {
    ignores: [
      'dist/**',
      '.angular/**',
      'node_modules/**',
      'proxy.conf.js',
      '**/*.html',
    ],
  },
  ...baseConfig,
  ...angular.configs.tsRecommended,
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {},
  },
];
