import { Package } from '../package';

describe('Package', () => {
  describe('with out exports and no main attr', () => {
    let pkg;

    beforeAll(() => {
      pkg = new Package({ name: '@test/test' }, '/test/module-path');
    });

    it('when given an absolute path shoud resolve to comple relative path of the package', () => {
      expect(pkg.resolve('test')).toBe('/test/module-path/test');
    });

    it('when given `/` as path shoud resolve to the package base path', () => {
      expect(pkg.resolve('/')).toBe('/test/module-path/index');
    });

    it('when given empty path shoud resolve to the package base path', () => {
      expect(pkg.resolve('')).toBe('/test/module-path/index');
    });

    it('when given package name as path shoud resolve to the package base path', () => {
      expect(pkg.resolve('@test/test')).toBe('/test/module-path/index');
    });

    it('when given path including package name shoud resolve to comple relative path of the package', () => {
      expect(pkg.resolve('@test/test/test')).toBe('/test/module-path/test');
    });
  });

  describe('with out exports and has main attr', () => {
    let pkg;

    beforeAll(() => {
      pkg = new Package({ name: '@test/test', main: 'main.js' }, '/test/module-path');
    });

    it('when given an absolute path shoud resolve to comple relative path of the package', () => {
      expect(pkg.resolve('test')).toBe('/test/module-path/test');
    });

    it('when given `/` as path shoud resolve to the package main attribute value', () => {
      expect(pkg.resolve('/')).toBe('/test/module-path/main.js');
    });

    it('when given empty path shoud resolve to the package main attribute value', () => {
      expect(pkg.resolve('')).toBe('/test/module-path/main.js');
    });

    it('when given package name as path shoud resolve to the package main attribute value', () => {
      expect(pkg.resolve('@test/test')).toBe('/test/module-path/main.js');
    });

    it('when given path including package name shoud resolve to comple relative path of the package', () => {
      expect(pkg.resolve('@test/test/test')).toBe('/test/module-path/test');
    });

    it('when given path is just package name and condition is browser shoud resolve to default value `index`', () => {
      expect(pkg.resolve('@test/test', 'browser')).toBe('/test/module-path/main.js');
    });

    it('when given path is just package name and condition is import shoud resolve to default value `index`', () => {
      expect(pkg.resolve('@test/test', 'import')).toBe('/test/module-path/main.js');
    });
  });

  describe('with out exports and has browser attr and browser condition', () => {
    let pkg;

    beforeAll(() => {
      pkg = new Package({ name: '@test/test', browser: 'browser.js' }, '/test/module-path');
    });

    it('when given an absolute path shoud resolve to comple relative path of the package', () => {
      expect(pkg.resolve('test', 'browser')).toBe('/test/module-path/test');
    });

    it('when given `/` as path shoud resolve to the package browser attribute value', () => {
      expect(pkg.resolve('/', 'browser')).toBe('/test/module-path/browser.js');
    });

    it('when given empty path shoud resolve to the package browser attribute value', () => {
      expect(pkg.resolve('', 'browser')).toBe('/test/module-path/browser.js');
    });

    it('when given package name as path shoud resolve to the package browser attribute value', () => {
      expect(pkg.resolve('@test/test', 'browser')).toBe('/test/module-path/browser.js');
    });

    it('when given path including package name shoud resolve to comple relative path of the package', () => {
      expect(pkg.resolve('@test/test/test', 'browser')).toBe('/test/module-path/test');
    });

    it('when given path is just package name and no condition shoud resolve to default value `index`', () => {
      expect(pkg.resolve('@test/test')).toBe('/test/module-path/index');
    });

    it('when given path is just package name and condition is import shoud resolve to default value `index`', () => {
      expect(pkg.resolve('@test/test', 'import')).toBe('/test/module-path/index');
    });
  });

  describe('with out exports and has browser and main attr', () => {
    let pkg;

    beforeAll(() => {
      pkg = new Package({ name: '@test/test', main: 'main.js', browser: 'browser.js' }, '/test/module-path');
    });

    it('when given path is just package name and condition is browser shoud resolve to browser attr', () => {
      expect(pkg.resolve('@test/test', 'browser')).toBe('/test/module-path/browser.js');
    });

    it('when given path is just package name and no condition shoud resolve to main attr', () => {
      expect(pkg.resolve('@test/test')).toBe('/test/module-path/main.js');
    });

    it('when given path is just package name and no condition shoud resolve to main attr', () => {
      expect(pkg.resolve('@test/test', 'import')).toBe('/test/module-path/main.js');
    });
  });

  describe('with exports and has browser and main attr', () => {
    let pkg;

    beforeAll(() => {
      pkg = new Package({ name: '@test/test', main: 'main.js', browser: 'browser.js', exports: { 
        '.': './exports.js',
        './main': './cjs/main.js',
        './main/': './cjs/dotmain/',
        './main2': './cjs/dotmain2.js'
      } }, '/test/module-path');
    });

    it('when given path is just package name and condition is browser shoud resolve to browser attr', () => {
      expect(pkg.resolve('@test/test', 'browser')).toBe('/test/module-path/browser.js');
    });

    it('when given path is just package name and no condition shoud resolve to main attr', () => {
      expect(pkg.resolve('@test/test')).toBe('/test/module-path/main.js');
    });

    it('when given path is just package name and no condition shoud resolve to main attr', () => {
      expect(pkg.resolve('@test/test', 'import')).toBe('/test/module-path/exports.js');
    });

    it('when given an suger path which is a folder and an index should resolved to the index', () => {
      expect(pkg.resolve('@test/test/main', 'import')).toBe('/test/module-path/cjs/main.js');
    });

    it('when given an suger path which is a folder and an index should resolved to index', () => {
      expect(pkg.resolve('@test/test/main/', 'import')).toBe('/test/module-path/cjs/main.js');
    });

    it('when given an a path which is a sub-path of a suger should return the path based on suger value', () => {
      expect(pkg.resolve('@test/test/main/abc', 'import')).toBe('/test/module-path/cjs/dotmain/abc');
    });

    it('when given an suger path which resolves should return the path based on suger value', () => {
      expect(pkg.resolve('@test/test/main2', 'import')).toBe('/test/module-path/cjs/dotmain2.js');
    });
  });

  describe('with exports having conditions', () => {
    let pkg;

    beforeAll(() => {
      pkg = new Package({ name: '@test/test', exports: { 
        '.': {
          'require': './main.js',
          'import': './exports.js',
          'browser': './browser.js'
        },
        './main': './share/main.js',
        './main/': {
          'require': './cjs/dotmain/',
          'import': './esm/dotmain/'
        }
      } }, '/test/module-path');
    });

    it('when given path is just package name and condition is browser shoud resolve to browser attr', () => {
      expect(pkg.resolve('@test/test', 'browser')).toBe('/test/module-path/browser.js');
    });

    it('when given path is just package name and no condition shoud resolve to main attr', () => {
      expect(pkg.resolve('@test/test')).toBe('/test/module-path/main.js');
    });

    describe('with condition import', () => {
      it('when given an suger path which is a folder and an index should resolved to the index', () => {
        expect(pkg.resolve('@test/test/main', 'import')).toBe('/test/module-path/share/main.js');
      });

      it('when given an suger path which is a folder and an index should resolved to index', () => {
        expect(pkg.resolve('@test/test/main/', 'import')).toBe('/test/module-path/share/main.js');
      });

      it('when given an a path which is a sub-path of a suger and cond should return the path based on suger value', () => {
        expect(pkg.resolve('@test/test/main/abc', 'import')).toBe('/test/module-path/esm/dotmain/abc');
      });

      it('when given an suger path which resolves should return the path based on suger value', () => {
        expect(pkg.resolve('@test/test/main2', 'import')).toBe('/test/module-path/main2');
      });
    });

    describe('with condition require', () => {
      it('when given an suger path which is a folder and an index should resolved to the index', () => {
        expect(pkg.resolve('@test/test/main', 'require')).toBe('/test/module-path/share/main.js');
      });

      it('when given an suger path which is a folder and an index should resolved to index', () => {
        expect(pkg.resolve('@test/test/main/', 'require')).toBe('/test/module-path/share/main.js');
      });

      it('when given an export path which is a folder should resolved to the match', () => {
        expect(pkg.resolve('@test/test/main/', 'require')).toBe('/test/module-path/share/main.js');
      });

      it('when given an a path which is a sub-path of a suger and cond should return the path based on suger value', () => {
        expect(pkg.resolve('@test/test/main/abc', 'require')).toBe('/test/module-path/cjs/dotmain/abc');
      });

      it('when given an suger path which resolves should return the path based on suger value', () => {
        expect(pkg.resolve('@test/test/main2', 'require')).toBe('/test/module-path/main2');
      });
    });
  });
});
