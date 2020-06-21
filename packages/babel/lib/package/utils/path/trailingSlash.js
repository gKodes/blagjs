const upath = require('upath');
const path = require('path');

const SEPS = [upath.sep, path.sep];
const PATH_SEP = upath.sep;
const STR_EMPTY = '';

/*
function tailSep(lastCar, src) {
  return src + (SEPS.includes(lastCar) ? PATH_SEP : '');
}
*/

function withTailSepAsIs(destFn, thisFn) {
  return function (...args) {
    const result = destFn.apply(thisFn, args);
    if (typeof result === 'string') {
      if (hasTrailingSlash(result)) {
        return result;
      }

      return result + (hasTrailingSlash(args[args.length - 1]) ? PATH_SEP : STR_EMPTY);
    }
    return result;
  };
}

function hasTrailingSlash(srcPath) {
  return SEPS.includes(srcPath[srcPath.length - 1]);
}

module.exports = { withTailSepAsIs, hasTrailingSlash };
