const fs = require('fs');
const path = require('path');
const { STR_PACKAGE_JSON } = require('./consts');


/**
 * Recursively look up for package.json for the given path to the root
 *
 * @param {string} srcPath
 */
function lookUpPkgSync(srcPath) {
  let pathToLookIn = srcPath;
  let lastValue;

  do {
    const candidatePkgJsonPath = path.join(pathToLookIn, STR_PACKAGE_JSON);
    if (fs.existsSync(candidatePkgJsonPath)) {
      return pathToLookIn;
    }
    lastValue = pathToLookIn;
    pathToLookIn = path.dirname(pathToLookIn);
  } while (lastValue !== pathToLookIn);
  return undefined;
}

module.exports = { lookUpPkgSync: lookUpPkgSync };
