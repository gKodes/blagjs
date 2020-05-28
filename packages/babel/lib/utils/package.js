const fs = require('fs');
const path = require('path');
const { isDirectorySync } = require('path-type');
const isBuiltinModule = require('is-builtin-module');
const { determineExtensionSync } = require('./source');
const split = require('./package/utils/split');
const readJSON = require('./readJSON');

const RESOLVE_MAIN_FIELDS = ['module', 'main'];

const DEFAULT_PATHS = module.paths;
const STR_PACKAGE_JSON = 'package.json';

function resolveExport(exports, condition) {
  if (typeof exports === 'string') {
    return () => exports;
  }

  return () => exports[condition] || exports['require'] || exports['default'];
}

/**
 * Look up for the installed path of a given module or a file in the module
 *
 * @param {string} requested
 * @param {*} options
 */
// pkgInsalledPathSync
function getInstalledPathSync(requested, options = {}) {
  const { paths = DEFAULT_PATHS, extensions } = options;
  const cwd = path.dirname(paths[0]);

  if (isBuiltinModule(requested)) {
    return requested;
  }

  const pathSegments = split('/', 3, requested);

  for (let idx = 0; idx < paths.length; idx += 1) {
    const probablePath = path.join(paths[idx], pathSegments[0]);
    const probablePkgJsonPath = path.join(probablePath, STR_PACKAGE_JSON);
    if ( fs.existsSync(probablePkgJsonPath) ) {
      return probablePath;
    }
  }

  if (!determineExtensionSync(path.resolve(cwd, requested), extensions)) {
    // do the lookup logic
  }
  return undefined;
}

/**
 * If `packagePath` is directory look for package.json in it and read it as a json or else
 * read the give `packagePath` as json
 *
 * @param {string} packagePath
 */
function readPkgSync(packagePath) {
  let resolvedPath = packagePath;
  if (isDirectorySync(packagePath)) {
    resolvedPath = path.join(packagePath, STR_PACKAGE_JSON);
  }

  return readJSON(resolvedPath);
}

/**
 *
 *
 * @param {string} probablePath
 * @param {object} packageJson
 * @param {string[]} mainFields
 */
function getMainFileSync(probablePath, packageJson, mainFields = RESOLVE_MAIN_FIELDS) {
  if (!probablePath) {
    return undefined;
  }
  if (!packageJson) {
    // eslint-disable-next-line no-param-reassign
    packageJson = readPkgSync(probablePath);
  }

  for (let idx = 0; idx < mainFields.length; idx += 1) {
    const probableMainFile = packageJson[mainFields[idx]];
    if (probableMainFile) {
      const mainFile = determineExtensionSync(path.resolve(probablePath, probableMainFile));
      if (mainFile) {
        return mainFile;
      }
    }
  }
  return undefined;
}

/**
 * Recursively look up for package.json for the given path to the root
 *
 * @param {string} srcPath
 */
function lookUpPkgSync(srcPath) {
  let pathToLookIn = srcPath;

  do {
    const probablePkgJsonPath = path.join(pathToLookIn, STR_PACKAGE_JSON);
    if (fs.existsSync(probablePkgJsonPath)) {
      return pathToLookIn;
    }
    pathToLookIn = path.dirname(pathToLookIn);
  } while (pathToLookIn !== '/');
  return undefined;
}

/**
 * Recursively look up for package.json and then read the attributes defined in mainFields and return the mainFile
 *
 * @param {string} srcPath
 * @param {string[]} mainFields
 */
function lookUpMainFileSync(srcPath, mainFields) {
  const packagePath = lookUpPkgSync(srcPath);

  if (packagePath) {
    const packageJson = readPkgSync(packagePath);

    return getMainFileSync(packagePath, packageJson, mainFields);
  }
  return undefined;
}

/**
 * Recursively look up for package.json for the given path to the root
 *
 * @param {string} srcPath
 */
function readUpPkgSync(srcPath) {
  const pkgPath = lookUpPkgSync(srcPath);
  if (pkgPath) {
    return readPkgSync(pkgPath);
  }

  return pkgPath;
}

module.exports = {
  getInstalledPathSync,
  readPkgSync,
  getMainFileSync,
  lookUpPkgSync,
  lookUpMainFileSync,
  readUpPkgSync,
};
