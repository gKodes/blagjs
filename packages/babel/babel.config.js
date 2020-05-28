const fs = require('fs');
const path = require('path');

const presets = [
  [
    require.resolve('@babel/preset-env'),
    {
      modules: 'auto', // When used in webpack it should be set to false
      targets: {
        node: '10',
      },
    },
  ],
];

const plugins = [
  require.resolve('babel-plugin-macros'),
  require.resolve('babel-plugin-codegen'),
  require.resolve('@babel/plugin-proposal-class-properties'),
  [
    require.resolve('@babel/plugin-transform-runtime'),
    {
      useESModules: false, // if true, bable will use modules, when using webpack we can set it to true
    },
  ],
];

/*
// if jsconfig.json exists
try {
  const configPath = path.resolve('package.json');
  if (fs.existsSync(configPath)) {
    const { jest } = require(configPath);
    if (jest) {
      const { moduleNameMapper } = jest;
      const alias = {};

      Object.keys(moduleNameMapper).forEach(
        (key) => (alias[`^${key}`] = moduleNameMapper[key].replace('<rootDir>/', './').replace('$', '\\'))
      );

      plugins.push([
        'babel-plugin-module-resolver',
        {
          root: '.',
          alias: alias,
          loglevel: 'verbose',
        },
      ]);
    }
  }
} catch (_) {
  console.info(_);
}
//
*/

const babelrcRoots = [
  // Keep the root as a root
  '.',

  // Also consider monorepo packages "root" and load their .babelrc.json files.
  './packages/*',
];

module.exports = {
  presets,
  plugins,
  babelrcRoots,
};
