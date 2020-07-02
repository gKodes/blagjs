const path = require('path');
const { resolve } = require('../lib/package');

const PERIOD_CHAR = '.';

function resolver(request, options) {
  const { defaultResolver, rootDir, paths, moduleDirectory, basedir } = options;
  let resolved = undefined;

  if ( PERIOD_CHAR !== request[0] ) {
    let modulePaths = undefined;
    if ( rootDir ) {
      modulePaths = moduleDirectory.map(moduleDir => path.join(rootDir, moduleDir))
    }
    resolved = resolve(request, { paths: paths || modulePaths });
    // console.info('--resolve--', request, resolved);
  }

  return defaultResolver(resolved || request, options);
}

module.exports = resolver;
