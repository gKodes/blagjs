#!/usr/bin/env node

const path = require('path');
// process.env.BABEL_ENV = 'build';
// BABEL_ENV=build babel src --root-mode upward --out-dir dist  --no-comments

const DEAFULT_FLAGS = ['--delete-dir-on-start', '--no-comments'];
process.argv.push('--config-file', path.resolve(__dirname, '../babel.config.js'));

if ( !process.argv.includes('--out-dir') ) {
  process.argv.push('--out-dir', 'dist');
}

// const ignore = [/__([a-z0-9]*)__/i, /\.spec\./, /\.test\./]

DEAFULT_FLAGS.forEach(flag => {
  if ( !process.argv.includes(flag) ) {
    process.argv.push(flag);
  }
});

process.argv.push('--ignore', '**/__*__,**/__assets__,**/*.spec.js,**/*.test.js');

require('@babel/cli/lib/babel');
