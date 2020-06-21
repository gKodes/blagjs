jest.mock('fs', () => {
  return jest.createMockFromModule('fs');
});
const { lookUpPkgSync } = require('../lookUpPkgSync');
const fs = require('fs');

describe('lookUpPkgSync', () => {
  it('when package.json in a parent directory should be able to walk up and find it and return the dir path where it was found', () => {
    fs.existsSync.mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValueOnce(true);
    expect(lookUpPkgSync('/mock/first/second/third.js')).toBe('/mock/first');
  });

  it('if package.json was unable to be found until it reaches the root dir should return undefined', () => {
    fs.existsSync.mockReturnValueOnce(false).mockReturnValueOnce(false);
    expect(lookUpPkgSync('/mock/first')).toBeUndefined();
  });

  it('if path reachs root return undefined', () => {
    fs.existsSync.mockReturnValueOnce(false).mockReturnValueOnce(false);
    expect(lookUpPkgSync('/mock')).toBeUndefined();
  });
});
