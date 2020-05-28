const path = require('path');
const packageJSON = require('../../../package.json');
const { getInstalledPathSync, readPkgSync, lookUpPkgSync, lookUpMainFileSync } = require('../package');

// eslint-disable-next-line sonarjs/no-duplicate-string
jest.unmock('path-exists');

describe('getInstalledPathSync', () => {
  it('when requested for `jest` package which exists in dependencies, it should return `$cwd/node_modules/jest`', () => {
    expect(getInstalledPathSync('jest')).toEqual(path.join(process.cwd(), '/node_modules/jest'));
  });

  it('when requested for `unknown` package which does not exists in dependencies, it should return `undefined`', () => {
    expect(getInstalledPathSync('unknown')).toBeUndefined();
  });

  xit('when requested a file in package `jest/bin/jest` without extension it should return the file with extension `$cwd/node_modules/jest/bin/jest.js`', () => {
    expect(getInstalledPathSync('jest/index')).toEqual('/Users/kgadi366/Desktop/aries/aem/agora-node-package-manager/node_modules/jest/bin/jest.js');
  });
});

describe('readPkgSync', () => {
  const packageJsonPath = path.join(process.cwd(), 'package.json');

  it('read package.json when provided relateive path should read and return package.json as Object', () => {
    expect(readPkgSync('.')).toMatchObject(packageJSON);
  });

  it(`read package.json when proved absolute path ${process.cwd()} should read and return package.json as Object`, () => {
    expect(readPkgSync(process.cwd())).toMatchObject(packageJSON);
  });

  it(`read package.json when proved compelte absolute path ${packageJsonPath} should read and return package.json as Object`, () => {
    expect(readPkgSync(packageJsonPath)).toMatchObject(packageJSON);
  });

  it('read package.json for a path where it does not exist should throw', () => {
    expect(() => readPkgSync('./src/utils')).toThrow();
  });
});

describe('lookUpPkgSync', () => {
  it(`looking for package.json in ${process.cwd()} should return ${process.cwd()} as pacjage.json exists in the path`, () => {
    expect(lookUpPkgSync(process.cwd())).toBe(process.cwd());
  });

  it('looking for package.json in `.` should return `.` as package json exists in cwd', () => {
    expect(lookUpPkgSync('.')).toBe('.');
  });

  it(`looking for package.json in ${path.resolve(process.cwd(), './src/utils/__tests__')} should walk up and return ${process.cwd()} as pacjage.json exists in the path`, () => {
    expect(lookUpPkgSync(path.resolve(process.cwd(), './src/utils/__tests__'))).toBe(process.cwd());
  });

  it(`looking for package.json in ${path.resolve(process.cwd(), '../')} should return undefined as we dont have package.json in any of the parent dir's`, () => {
    expect(lookUpPkgSync(path.resolve(process.cwd(), '../'))).toBeUndefined();
  });
});

describe('lookUpMainFileSync', () => {
  it(`looking for main attribute in package.json and return the absolute path for the file as ${path.join(process.cwd(), './src/index.js')}`, () => {
    expect(lookUpMainFileSync(process.cwd())).toBe(path.join(process.cwd(), './src/index.js'));
  });

  it('when package.json is not found using recursive lookup should return undefined', () => {
    expect(lookUpMainFileSync(path.resolve(process.cwd(), '../'))).toBeUndefined();
  });
});
