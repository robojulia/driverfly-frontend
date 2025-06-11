module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  rules: {
    'no-unused-vars': 'off',
    indent: ['off', 2, { SwitchCase: 1 }],
    'no-tabs': 'off',
    'react/jsx-indent': ['off', 2],
    'react/jsx-indent-props': ['off', 2],
  },
};
