const fs = require('fs');
const path = require('path');
const upath = require('upath');
const BuiltinModule = require('module');
const pathExists = require('path-exists');
// const { getInstalledPathSync, readPkgSync, getMainFileSync } = require('./utils/package');
const readJSON = require('./utils/readJSON');
const { resolve } = require('./package');

// Guard against poorly mocked module constructors
const Module = module.constructor.length > 1 ? module.constructor : BuiltinModule;

const PATH_RESOLVE_DEFAULT = ['.', '/', '\\'];

/**
 *
 * @param {string} request
 * @param {Module} parentModule
 * @param {boolean} isMain
 * @param {object} options
 */
// eslint-disable-next-line no-underscore-dangle
const _resolveFilename = (() => {
  // eslint-disable-next-line no-shadow
  const resolveFilename = Module._resolveFilename;

  return function resolveByMainFields(request, parentModule, isMain, options) {
    // console.info('--resolveByMainFields--', parentModule.id, request);
    const absolutePath = path.resolve(path.basename(parentModule.filename), request);

    // If its not the main js and no potions and its not an relative path and if the module was not requested by any @babel modules
    if (!(isMain || options || PATH_RESOLVE_DEFAULT.includes(request[0]) || parentModule.id.includes('@babel'))) {
      // TODO: Find a way to pass in options
      const resolvedPath = resolve(request, {
        paths: [...parentModule.paths, '/Users/kgadi366/Desktop/kamal/dev/blagjs/packages/babel/node_modules'],
      });

      if (resolvedPath) {
        return resolveFilename(resolvedPath, parentModule, isMain, options);
      }
    }

    // console.info('--absolutePath--', request, parentModule.id);
    return resolveFilename(...arguments);
  };
})();

/**
 *
 * @param {string} request
 * @param {Module} parentModule
 * @param {boolean} isMain
 * @param {object} options
 */
function resolveFilename(request, parentModule, isMain, options) {
  // console.info('resolveTo', request);
  return _resolveFilename(request, parentModule, isMain, options);
}

// Patched the node response
// eslint-disable-next-line no-underscore-dangle
// TODO: Move this into /register.js
Module._resolveFilename = resolveFilename;

module.exports = { resolveFilename };
