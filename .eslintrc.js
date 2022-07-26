module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        trailingComma: 'es5',
        tabWidth: 2,
        semi: true,
        singleQuote: true,
      },
    ],
    'react/prop-types': 'off',
  },
};
