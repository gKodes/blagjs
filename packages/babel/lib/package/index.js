const fs = require('fs');
const path = require('path');
const { isDirectorySync } = require('path-type');
const isBuiltinModule = require('is-builtin-module');
const readJSON = require('../utils/readJSON');
const split = require('./utils/split');
const { resolveInPackage } = require('./package');
const { STR_PACKAGE_JSON } = require('./consts');

const DEFAULT_PATHS = module.paths;

const PACKAGES_CACHE = {};
const EXPORTS_PATTERN = /^((?:@[^/\\%]+\/)?[^./\\%][^/\\%]*)(\/.*)?$/;

function resolve(requested, options = {}) {
  const { paths = DEFAULT_PATHS, extensions, target = 'import' } = options;

  if (isBuiltinModule(requested) || path.isAbsolute(requested)) {
    return requested;
  }

  const cwd = path.dirname(paths[0]);
  const [, name, expansion = ''] = requested.match(EXPORTS_PATTERN);

  // console.info('--requested--', scope, name, requested);

  for (let idx = 0; idx < paths.length; idx += 1) {
    let namePath = path.join(paths[idx], name, STR_PACKAGE_JSON);
    let socpePath = path.join(paths[idx], name, expansion, STR_PACKAGE_JSON);

    const probablePath = (fs.existsSync(namePath) && namePath) || (fs.existsSync(socpePath) && socpePath);
    if (probablePath) {
      const jsonPkg = readJSON(probablePath);

      return (
        resolveInPackage(requested, {
          pkgPath: path.dirname(probablePath),
          pkgJson: jsonPkg,
          target,
        }) || requested
      );
    }
  }
}

module.exports = {
  resolve,
  lookUpPkgSync: require('./lookUpPkgSync').lookUpPkgSync,
  readPkgSync: require('./readPkgSync').readPkgSync,
};
