const path = require('path');
const { isDirectorySync } = require('path-type');
const readJSON = require('../utils/readJSON');
const { STR_PACKAGE_JSON } = require('./consts');

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

module.exports = { readPkgSync: readPkgSync };
