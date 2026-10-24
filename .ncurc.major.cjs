const minorConfig = require('./.ncurc.minor.cjs')

module.exports = {
  ...minorConfig,
  reject: [
    ...minorConfig.reject,
    // @types/node is kept in line with the node version in .nvmrc and package.json#engines.node
    '@types/node',
    // Next.js lint plugins do not support ESLint 10 yet.
    'eslint',
  ],
  target: 'latest',
}
