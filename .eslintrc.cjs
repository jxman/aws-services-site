module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  overrides: [
    {
      // Allow exporting hooks from context files
      files: ['**/contexts/**/*.jsx', '**/contexts/**/*.js'],
      rules: {
        'react-refresh/only-export-components': 'off',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: '18.3'
    }
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // Additional recommended rules
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react/prop-types': 'off', // TODO: Enable after adding PropTypes or TypeScript
    'react/jsx-no-target-blank': 'warn',
    'react/no-unescaped-entities': 'error', // Fix quotes in JSX
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
}
