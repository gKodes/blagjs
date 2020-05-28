import qs from 'qs';
import urlParser from 'url-parse';

export const URL_OBJ_PROPS_TO_MATCH = Object.freeze(['host', 'protocol', 'pathname', 'hash']);

/**
 * Parse the url query string and return it as an Object
 *
 * @param {string} queryStr
 */
export function qsParser(queryStr) {
  const stripedQS = queryStr && queryStr[0] === '?' ? queryStr.substr(1) : queryStr;
  return stripedQS ? qs.parse(stripedQS) : undefined;
}

/**
 *
 * @param {Object|string} url
 */
export function asUrl(url) {
  return (typeof url === 'string' && urlParser(url, qsParser)) || url;
}

/**
 * Match the available url semgnets with otherUrl. If the url segments match returns true.
 * The otherUrl can have more segments then the url
 *
 * @param {URLMatch|string} url
 */
export function matchURL(url) {
  const source = asUrl(url);
  const { query } = source;
  let querySegments;
  if (query) {
    querySegments = Object.keys(query);
  }

  return (otherUrl) => {
    const other = asUrl(otherUrl);
    let isMatch = false;
    if ((isMatch = URL_OBJ_PROPS_TO_MATCH.every((name) => !source[name] || source[name] === other[name]))) {
      if (query && (isMatch = typeof other.query === 'object')) {
        return querySegments.every((name) => source.query[name] === other.query[name]);
      }
    }
    return isMatch;
  };
}

/**
 * @typedef {Object} URLOptions
 * @property {string} url the complete URL or Path which would be merge with baseURL
 * @property {string} baseURL **optional** base url to be prefixed for baseURL
 * @property {Object} params an object representing query params
 */

 /**
  * Will create an url based on options passed
  * 
  * @param {URLOptions|string} options 
  */
export function asUrlStr(options) {
  if (typeof options === 'string') {
    return options;
  }

  const url = new Url(options.url, options.baseURL);

  if (options.params) {
    url.set('query', qs.stringify(Object.assign(qs.parse(url.query), params)));
  }

  return url.toString();
}
