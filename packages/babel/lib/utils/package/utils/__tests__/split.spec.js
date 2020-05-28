import split from '../split';

describe('split', () => {

  describe('when pass only two arguments separator', () => {
    it('seperator is not found should only return source string in the array', () => {
      expect(split('/', 'a.b.c')).toEqual(['a.b.c'])
  });
    it('source should max split array', () => {
      expect(split('.', 'a.b.c')).toEqual(['a', 'b', 'c'])
    });
  });

  describe('when passed in limit', () => {
  it('two should reutrn only two elments and second sould contain remaing source as-is', () => {
      expect(split('.', 2, 'a.b.c')).toEqual(['a', 'b.c'])
    });

    it('one should reutrn only one elments which should be same as source', () => {
      expect(split('.', 1, 'a.b.c')).toEqual(['a.b.c'])
    });
  });
});
