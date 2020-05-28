#!/usr/bin/env node

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2019 Marriott International Inc
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const { lookUpPkgSync, readPkgSync } = require('../lib/utils/package');
const babelrc = require('../babel.config');
const path = require('path');

// NOTE: Its true by default and should be true for webpack builds, in dev we need it to be false
babelrc.presets[0][1].modules = 'auto';
babelrc.plugins[babelrc.plugins.length - 1][1].useESModules = false;

const es6Packages = {};

//  require('ignore-styles');

//TODO: Create a cache for the ES6 Package's
function isNotES6Package(requestedPath) {
  const isES6 = es6Packages[Object.keys(es6Packages).find(cachePkgPath => {
    const isES6 = requestedPath.startsWith(cachePkgPath);

    if (isES6) {
      const requestSubPath = path.relative(cachePkgPath, requestedPath);
      return !requestSubPath.startsWith('node_modules');
    }

    return isES6;
  })]

  if ( typeof(isES6) === 'undefined' ) {
    const pkgPath = lookUpPkgSync(requestedPath);

    if ( pkgPath ) {
      const packageJSON = readPkgSync(pkgPath);
      // If package.module or pacjage.type is defined then its an ES6 Module and cannot be ignored
      // console.info('--packageJSON.name--', typeof(packageJSON.module) === 'undefined' && packageJSON.type !== 'module', pkgPath);
      return es6Packages[pkgPath] = (typeof(packageJSON.module) === 'undefined' && packageJSON.type !== 'module');
    }
  }

  return isES6;
}

require('@babel/register')({
  // ignore: [],
  ignore: [isNotES6Package],
  // only: [],
  sourceType: 'unambiguous',
  presets: babelrc.presets,
  plugins: babelrc.plugins,
  cache: false
});
// require('babel-polyfill');

require('../lib/resolver');
require(path.resolve(process.argv[2]));
