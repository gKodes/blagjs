const fs = require('fs');
const path = require('path');
const isBuiltinModule = require('is-builtin-module');
const split = require('./utils/split');
const readJSON = require('../readJSON');
const { Package } = require('./package');

const DEFAULT_PATHS = module.paths;
const STR_PACKAGE_JSON = 'package.json';

const PACKAGES_CACHE = {};

function resolve(requested, options = {}) {
  const { paths = DEFAULT_PATHS, extensions } = options;
  const cwd = path.dirname(paths[0]);
  let pkg;

  if (isBuiltinModule(requested)) {
    return requested;
  }

  const [ scope, name = '' ] = split('/', 3, requested);

  // console.info('--requested--', scope, name, requested);

  if ( ( pkg = (PACKAGES_CACHE[path.join(scope, name)] || PACKAGES_CACHE[scope]) ) ) {
    return pkg.resolve(requested, 'import');
  }

  for (let idx = 0; idx < paths.length; idx += 1) {
    let namePath = path.join(paths[idx], scope, name, STR_PACKAGE_JSON);
    let socpePath = path.join(paths[idx], scope, STR_PACKAGE_JSON);

    const probablePath = ((fs.existsSync(namePath) && namePath) || (fs.existsSync(socpePath) && socpePath));
    if ( probablePath ) {
      const jsonPkg = readJSON(probablePath);
      pkg = new Package(jsonPkg, path.dirname(probablePath));      
      PACKAGES_CACHE[pkg.name] = pkg;
      return pkg.resolve(requested, 'import');
    }
  }
}

module.exports = { resolve };
