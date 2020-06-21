const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { resolve, join, relative, hasTrailingSlash } = require('./utils/path');
const { entrysToSugar } = require('./utils/entrysToSugar');

// const EXPORTS_PATTERN = /^((?:@[^/\\%]+\/)?[^./\\%][^/\\%]*)(\/.*)?$/;
// const trailingSlashRegex = /(?:^|\/)\.?\.$/;

const PATH_STARTERS = ['.', '/', '\\'];
const STR_EMPTY = '';

function resolveExportsForTarget(exports, target) {
  if (typeof exports === 'string') {
    return exports;
  }

  return exports[target || 'default'] || exports['require'] || STR_EMPTY;
}

function resolveInPackage(id, options) {
  assert.ok(options.pkgPath, '');
  const { pkgPath, pkgJson = readPkgSync(options.pkgPath), target } = options;

  const {
    name,
    exports = {
      '.': entrysToSugar(pkgJson),
      './': './',
    },
  } = pkgJson;

  if ( id.startsWith(name) ) {
    id = id.replace(name, '');
  }

  const requested = `.${id}`;
  //TODO: requested should only start with / if not add it
  const exactMapping = exports[requested];

  if ( typeof(exactMapping) !== 'undefined' ) {
    return resolve(pkgPath, resolveExportsForTarget(exactMapping, target));
  }

  let dirMatch = STR_EMPTY;
  for (const candidateDir of Object.keys(exports)) {
    if (hasTrailingSlash(candidateDir) && requested.startsWith(candidateDir)) {
      dirMatch = candidateDir;
    }
  }

  if (dirMatch !== STR_EMPTY) {
    const subpath = requested.slice(dirMatch.length);
    return resolve(pkgPath, resolveExportsForTarget(exports[dirMatch], target), subpath);
  }
}

module.exports = { resolveInPackage };
