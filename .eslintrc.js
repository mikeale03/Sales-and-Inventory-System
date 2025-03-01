module.exports = {
  extends: 'erb',
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'error',
    // Since React 17 and typescript 4.1 you can safely disable the rule
    'react/react-in-jsx-scope': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-expressions': 'off',
    'no-redeclare': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    'react/require-default-props': 'off',
    '@typescript-eslint/naming-convention': 'off',
    camelcase: 'off',
    'import/extensions': 'off',
    'react/jsx-filename-extension': 'off',
    'react/function-component-definition': 'off',
    'import/no-relative-packages': 'off',
    'no-unused-vars': 'off',
    'no-console': 'off',
    'no-restricted-syntax': 'off',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
