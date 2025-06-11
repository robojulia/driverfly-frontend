module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  rules: {
    'no-unused-vars': 'off',
    indent: ['warn', 2, { SwitchCase: 1 }],
    'no-tabs': 'warn',
    'react/jsx-indent': ['warn', 2],
    'react/jsx-indent-props': ['warn', 2],
  },
};
