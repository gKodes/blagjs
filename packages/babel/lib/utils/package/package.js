const fs = require('fs');
const path = require('path');
const split = require('./utils/split');

const PKG_ENTRY_ATTRS = ['main', 'module', 'browser'];
const PKG_TO_EXPORTS_SUGAR = { require: 'main', browser: 'browser', import: 'module' };
const PATH_STARTERS = ['.', '/', '\\'];

function resolveExport(exports, condition) {
  if (typeof exports === 'string') {
    return exports;
  }

  return exports[condition || 'default'] || exports['require'];
}

class Package {
  constructor(pkg, pkgPath) {
    const { name, exports } = pkg;
    this.name = name;
    this.path = pkgPath;

    // main (require/default), browser (browser), module (import)
    this.main = (condition) => {
      const nodeName = PKG_TO_EXPORTS_SUGAR[condition];
      let index = (nodeName && pkg[nodeName]) || pkg['main'] || 'index';

      return path.resolve(pkgPath, index);
    };

    // Convert it into array
    if (exports) {
      this.exports = Object.keys(exports)
        .sort(function (left, right) {
          return right.length - left.length;
        })
        .map((key) => {
          const value = exports[key];
          const pathKey = path.relative('./', key);

          let resolver = {
            resolve: (condition) => {
              return path.resolve(pkgPath, resolveExport(value, condition));
            }
          };

          if (!pathKey && typeof value === 'string') {
            resolver = {
              resolve: (condition) => {
                if (condition === 'import') {
                  return path.resolve(pkgPath, resolveExport(value, condition));
                }
                return this.main(condition);
              }
            };
          }

          // TODO: . should bve handle separately
          // TODO: (/?) should be replaced with just $
          return Object.assign(
            new RegExp('^' + pathKey + (key[key.length - 1] === '/' ? '([/]{1}|$)' : '(/?)')),
            resolver
          );
        });
    }

    this.match = new RegExp('^' + this.name + '(/?)');

    Object.freeze(this);
  }

  resolve(requested, condition) {
    const resourcePath = requested.replace(this.match, '');

    if (this.exports) {
      const route = this.exports.find((match) => match.test(resourcePath));

      if (route) {
        return path.join(route.resolve(condition), resourcePath.replace(route, ''));
      }
    }

    if (!resourcePath || (resourcePath.length === 1 && PATH_STARTERS.includes(resourcePath))) {
      return this.main(condition);
    }

    //NOTE: Default Fallback
    return path.resolve(this.path, resourcePath);
  }
}

module.exports = { Package };
