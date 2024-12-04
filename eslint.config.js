import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

export default [
  // Base configuration
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      parser: tsParser,
      globals: globals.browser,
    },
    ignores: [
      'dist',
      'infra',
      '.eslintrc.cjs',
      'index.html',
      '.env',
      '.env.*',
      '/public/assets/images/*',
      '/public/assets/fonts/*',
      '/public/assets/css/*',
      '*.svg',
      '*.pdf',
      'helm',
      'Dockerfile',
    ],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'warn',
    },
  },
  // TypeScript-specific configuration
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['react'], // React and related packages first
            ['^react', '^@?\\w'], // Other packages
            ['^(@|components)(/.*|$)'], // Internal packages
            ['^\\u0000'], // Side effect imports
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'], // Parent imports
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'], // Relative imports
            ['^.+\\.?(css)$'], // Style imports
          ],
        },
      ],
    },
  },
];
