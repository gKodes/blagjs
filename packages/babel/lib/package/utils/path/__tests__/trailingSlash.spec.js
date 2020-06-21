const { withTailSepAsIs, hasTrailingSlash } = require('../trailingSlash');

describe('withTailSepAsIs', () => {
  it('when there only one argument passed which does not end with a path seperator should return the value with out path seperator', () => {
    expect(withTailSepAsIs((input) => input)('name')).toBe('name');
  });

  it('when there only one argument passed which does end with a path seperator should return the value with path seperator', () => {
    expect(withTailSepAsIs((input) => input)('name/')).toBe('name/');
  });

  it('when there the callback return anything but a string should return the same', () => {
    expect(withTailSepAsIs(() => {})('name/')).toBeUndefined();
  });

  it('when there only one argument with path seperator passed and the result string does not end with a path seperator should return the value with out path seperator', () => {
    expect(withTailSepAsIs(() => 'name')('name/')).toBe('name/');
  });

  it('when there only one argument with out path seperator passed and the return sould be return as is', () => {
    expect(withTailSepAsIs(() => 'name')('name')).toBe('name');
  });

  it('when the last argument with ends with path seperator result should be ended with path seperator', () => {
    expect(withTailSepAsIs(() => 'name')('name', 'e/')).toBe('name/');
  });
});

describe('hasTrailingSlash', () => {
  //
});
