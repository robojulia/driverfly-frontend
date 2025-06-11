module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  rules: {
    'no-unused-vars': 'off',
    indent: ['warn', 2, { SwitchCase: 1 }],
    'no-tabs': 'warn',
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
  },
};
