module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir : __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // 关闭不允许使用any的警告
    '@typescript-eslint/no-explicit-any':'off',
    // + 号连接符，两边都必须是统一类型 不允许隐式类型转换
    "@typescript-eslint/restrict-plus-operands": "error",
    // 关闭未使用变量的警告
    "@typescript-eslint/no-unused-vars": 'off'
  },
};