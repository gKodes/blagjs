const fs = require('fs');
const { isFileSync } = require('path-type');
const BuiltinModule = require('module');

const Module = module.constructor.length > 1 ? module.constructor : BuiltinModule;

// eslint-disable-next-line no-underscore-dangle
const DEFAULT_EXTENSIONS = Object.keys(Module._extensions);

/**
 * For the given srcPath provided does not exist then we are going to append
 * each extension form the list provided and check if it exits. If it does return
 * the path with appended extension or else undefined.
 *
 *
 * @param {string} srcPath
 * @param {string[]} extensions
 */
function determineExtensionSync(srcPath, extensions = DEFAULT_EXTENSIONS) {
  if (fs.existsSync(srcPath) && isFileSync(srcPath)) {
    return srcPath;
  }

  for (let idx = 0; idx < extensions.length; idx += 1) {
    const srcPathWithExtension = `${srcPath}${extensions[idx]}`;
    if ( fs.existsSync(srcPathWithExtension) ) {
      return srcPathWithExtension;
    }
  }
  return undefined;
}

module.exports = { determineExtensionSync };
