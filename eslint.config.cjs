// eslint.config.cjs
const js = require('@eslint/js');
const nextPlugin = require('@next/eslint-plugin-next');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const reactPlugin = require('eslint-plugin-react');
const hooksPlugin = require('eslint-plugin-react-hooks');
const globals = require('globals');

module.exports = [
  {
    ignores: [
      'node_modules/',
      '.next/',
      'dist/',
      'out/',
      'build/',
      '*.config.js',
      '*.config.ts',
      '**/*.d.ts',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': hooksPlugin,
      '@next/next': nextPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...hooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      // Reglas personalizadas para manejar advertencias comunes
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      '@next/next/no-img-element': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
      next: {
        rootDir: '.',
      },
    },
  },
];
