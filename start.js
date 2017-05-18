// Server-side entrypoint that registers Babel's require() hook
const babelRegister = require('babel-register');
babelRegister();

if (process.argv.indexOf('--dev') > -1) {
  process.env.DEV = 1
}

require('./server');
