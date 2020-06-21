import { resolveInPackage } from '../package';

describe('resolveInPackage', () => {
  describe('with out exports and no main attr', () => {
    let resolveOptions = {
      pkgPath: '/test/module-path',
      pkgJson: { name: '@test/test' },
    };

    it('when given an absolute path shoud resolve relative to the package', () => {
      expect(resolveInPackage('/test', resolveOptions)).toBe('/test/module-path/test');
    });

    it('when given `/` as path shoud resolve to the package base path', () => {
      expect(resolveInPackage('/', resolveOptions)).toBe('/test/module-path/');
    });

    it('when given `@test/test/` as path shoud resolve to the package base path', () => {
      expect(resolveInPackage('@test/test/', resolveOptions)).toBe('/test/module-path/');
    });

    it('when given empty path shoud resolve to the package base path', () => {
      expect(resolveInPackage('', resolveOptions)).toBe('/test/module-path/');
    });

    it('when given package name path shoud resolve to the package base path', () => {
      expect(resolveInPackage('@test/test', resolveOptions)).toBe('/test/module-path/');
    });
  });

  describe('with only main attr in package.json', () => {
    let resolveOptions = {
      pkgPath: '/test/module-path',
      pkgJson: { name: '@test/test', main: 'main.js' },
    };

    it('when given `/` as path shoud resolve to the package base path', () => {
      expect(resolveInPackage('/', resolveOptions)).toBe('/test/module-path/');
    });

    it('when given empty path shoud resolve to the package main file', () => {
      expect(resolveInPackage('', resolveOptions)).toBe('/test/module-path/main.js');
    });
  });

  describe('with only main, module and browser attr in package.json', () => {
    let resolveOptions = {
      pkgPath: '/test/module-path',
      pkgJson: { name: '@test/test', main: 'main.js', module: 'es6.js', browser: 'browser.js' },
    };

    it('when given `/` as path shoud resolve to the package base path', () => {
      expect(resolveInPackage('/', resolveOptions)).toBe('/test/module-path/');
    });

    it('when given empty path shoud resolve to the package main file', () => {
      expect(resolveInPackage('', resolveOptions)).toBe('/test/module-path/main.js');
    });

    it('when given empty path with target import shoud resolve to the package main file', () => {
      expect(resolveInPackage('', Object.assign({ target: 'import' }, resolveOptions))).toBe(
        '/test/module-path/es6.js'
      );
    });

    it('when given empty path with target browser shoud resolve to the package main file', () => {
      expect(resolveInPackage('', Object.assign({ target: 'browser' }, resolveOptions))).toBe(
        '/test/module-path/browser.js'
      );
    });
  });

  describe('with only main, module and browser attr in package.json', () => {
    let resolveOptions = {
      pkgPath: '/test/module-path',
      pkgJson: {
        name: '@test/test',
        main: 'main.js',
        exports: {
          './': 'exports.main.js',
        },
      },
    };

    it('when given `/` as path shoud resolve to the package base path', () => {
      expect(resolveInPackage('/', resolveOptions)).toBe('/test/module-path/exports.main.js');
    });

    it('when given empty path shoud resolve to the package main file', () => {
      expect(resolveInPackage('', resolveOptions)).toBeUndefined();
    });

    it('when given empty path with target import shoud resolve to the package main file', () => {
      expect(resolveInPackage('', Object.assign({ target: 'import' }, resolveOptions))).toBeUndefined();
    });

    it('when given empty path with target browser shoud resolve to the package main file', () => {
      expect(resolveInPackage('/', Object.assign({ target: 'import' }, resolveOptions))).toBe('/test/module-path/exports.main.js');
    });
  });
});
