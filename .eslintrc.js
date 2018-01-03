module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'standard',
  plugins: ['html'],
  rules: {
    'arrow-parens': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
  env: {
    node: true
  },
  globals: {}
}
