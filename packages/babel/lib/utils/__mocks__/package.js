// module.exports = jest.genMockFromModule('../package');
module.exports = {
  getInstalledPathSync: jest.fn(),
  readPkgSync: jest.fn(),
  getMainFileSync: jest.fn(),
  lookUpPkgSync: jest.fn(),
  lookUpMainFileSync: jest.fn()
};
