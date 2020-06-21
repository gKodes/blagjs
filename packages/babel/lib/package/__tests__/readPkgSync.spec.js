jest.mock('path-type', () => {
  return {
    isDirectorySync: jest.fn()
  };
})

jest.mock('../../utils/readJSON', () => {
  return jest.fn();
})

const { isDirectorySync } = require('path-type');
const { readPkgSync } = require('../readPkgSync');
const readJSON = require('../../utils/readJSON');

describe('readPkgSync', () => {
  it('', () => {
    readPkgSync('/mock/should/work')
  })

  it('', () => {
    readPkgSync('/mock/should/work')
  })

  it('', () => {
    readPkgSync('/mock/should/not/work')
  })

  it('', () => {
    readPkgSync('/mock/should/not/work/')
  })
})
