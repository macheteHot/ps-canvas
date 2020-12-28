module.exports = {
  env: {
    browser : true,
    node    : true,
  },
  globals: {
    Gcss: true,
  },
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins       : ['@typescript-eslint'],
  parserOptions : {
    parser: '@typescript-eslint/parser',
  },
  rules: {
    '@typescript-eslint/no-var-requires' : 'off',
    'no-unused-vars'                     : 'off',
    'no-var'                             : 'error',
    eqeqeq                               : 'error',
    'comma-dangle'                       : ['error', {
      arrays    : 'always-multiline',
      objects   : 'always-multiline',
      imports   : 'always-multiline',
      exports   : 'always-multiline',
      functions : 'always-multiline',
    }],
    'key-spacing': ['error', {
      multiLine: {
        beforeColon : false,
        afterColon  : true,
      },
      align: {
        beforeColon : true,
        afterColon  : true,
        on          : 'colon',
      },
    }],
  },
}
