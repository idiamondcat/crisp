module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'airbnb-typescript/base',  "eslint:recommended", 'plugin:@typescript-eslint/recommended', 'prettier'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['prettier', '@typescript-eslint'],
  root: true,
  rules:
  {
    'no-console': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/array-type': [
      'error',
      {
        default: 'array',
      },
    ],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'explicit',
        overrides: {
          accessors: 'explicit',
          constructors: 'off',
          methods: 'explicit',
          properties: 'explicit',
          parameterProperties: 'explicit',
        },
      },
    ],
    'max-lines-per-function': "off",
    'class-methods-use-this': 'off',
    "no-restricted-syntax": "off",
    "no-param-reassign": "off",
    // '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
  },
  ignorePatterns: ['*config.js']
};