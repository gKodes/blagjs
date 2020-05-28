jest.mock('path-exists');

const pathExists = require('path-exists');
const { determineExtensionSync } = require('../source');

describe('determineExtensionSync', () => {
  beforeEach(() => {
    pathExists.sync.mockImplementation(jest.requireActual('path-exists').sync);
  });

  afterEach(() => {
    pathExists.sync.mockReset();
  });

  it('when provider srcPath is `./src/index` should return `./src/index.js` as `./src/index.js` exits', () => {
    expect(determineExtensionSync('./src/index')).toEqual('./src/index.js');
  });

  it('when provider srcPath is `./src/index2` should return `undefined` as nither the file or with extensions do not exist', () => {
    expect(determineExtensionSync('./src/index2')).toBeUndefined();
  });

  it('when provider srcPath is `./src/index` should return `undefined` as extensions list only has `.json` in it and `./src/index.json` does not exist', () => {
    expect(determineExtensionSync('./src/index', ['.json'])).toBeUndefined();
  });
});
