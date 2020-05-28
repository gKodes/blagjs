import { asUrl, qsParser, matchURL } from '../url';

describe('qsParser', () => {
  it('when empty string is passed should return undefined', () => {
    expect(qsParser('')).toBeUndefined();
  });

  it("when query string is just '?' passed should return undefined", () => {
    expect(qsParser('?')).toBeUndefined();
  });

  it('when has query data should return them as an object', () => {
    expect(qsParser('?a=b')).toEqual({ a: 'b' });
  });
});

describe('asUrl', () => {
  it('when passed in object should return that object back', () => {
    const url = { hash: 'hash' };
    expect(asUrl(url)).toEqual(url);
  });

  it('when passed in a full url as string should parse url and reutrn url object', () => {
    expect(asUrl('http://www.example.com/test')).toEqual(
      expect.objectContaining({
        hostname: 'www.example.com',
        pathname: '/test',
        protocol: 'http:',
      })
    );
  });

  it('when passed in only url path should parse url and reutrn url object', () => {
    expect(asUrl('/test')).toEqual(
      expect.objectContaining({
        hostname: '',
        pathname: '/test',
        protocol: '',
      })
    );
  });

  xit('when passed in only url path with out / should parse url and reutrn url object', () => {
    expect(asUrl('test')).toEqual(
      expect.objectContaining({
        hostname: '',
        pathname: '/test',
        protocol: '',
      })
    );
  });

  it('when passed in url with out protocol should parse url and reutrn url object', () => {
    expect(asUrl('//www.example.com/test')).toEqual(
      expect.objectContaining({
        hostname: 'www.example.com',
        pathname: '/test',
        protocol: '',
      })
    );
  });

  it('when passed in url with query string should parse url and reutrn url object', () => {
    expect(asUrl('http://www.example.com/test?a=b')).toEqual(
      expect.objectContaining({
        hostname: 'www.example.com',
        pathname: '/test',
        protocol: 'http:',
        query: expect.objectContaining({ a: 'b' }),
      })
    );
  });

  it('when passed in url with hash should parse url and reutrn url object', () => {
    expect(asUrl('http://www.example.com/test#/path')).toEqual(
      expect.objectContaining({
        hostname: 'www.example.com',
        pathname: '/test',
        protocol: 'http:',
        hash: '#/path',
      })
    );
  });
});

describe('matchURL', () => {
  it('when source url is same as otherUrl should return true', () => {
    const test = matchURL('http://www.example.com/test');
    expect(test('http://www.example.com/test')).toBeTruthy();
  });

  it('when source url is does not match otherUrl should return false', () => {
    const test = matchURL('http://www.example.com/test');
    expect(test('http://www.example2.com/test')).toBeFalsy();
  });

  it('when source url has query string and otherUrl does not have it should return false', () => {
    const test = matchURL('http://www.example.com/test?a=b');
    expect(test('http://www.example.com/test')).toBeFalsy();
  });

  it('when source url with query string is same as otherUrl should return true', () => {
    const test = matchURL('http://www.example.com/test?a=b');
    expect(test('http://www.example.com/test?a=b')).toBeTruthy();
  });

  it('when source url with query param\'s exist in otherUrl query string should return true', () => {
    const test = matchURL('http://www.example.com/test?a=b');
    expect(test('http://www.example.com/test?a=b&c=d')).toBeTruthy();
  });

  it('when source url has Hash and otherUrl does not have it should return false', () => {
    const test = matchURL('http://www.example.com/test#/path');
    expect(test('http://www.example.com/test')).toBeFalsy();
  });

  it('when source url has Hash and otherUrl with Hash is same should return true', () => {
    const test = matchURL('http://www.example.com/test#/path');
    expect(test('http://www.example.com/test#/path')).toBeTruthy();
  });
});
