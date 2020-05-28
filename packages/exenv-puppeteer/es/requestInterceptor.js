export const STR_UID_HEADER = 'x-scriptr-uid';

/**
 * 
 * @param {Map} toIntercept 
 * @param {puppeteer.Request} request 
 */
export async function requestInterceptor(toIntercept, request) {
  const requestURL = request.url();
  const overrides = toIntercept.get(requestURL);
  const headers = request.headers();
  const scriptrUID = headers[STR_UID_HEADER];

  if ( scriptrUID ) {
    request._scriptr_uid = scriptrUID;
    delete headers[STR_UID_HEADER];
  }

  if ( overrides ) {
    overrides.headers = Object.assign({}, headers, overrides.headers);
    toIntercept.delete(requestURL);

    // console.info('request scriptr UID', requestURL, overrides.headers);

    return request.continue(overrides);
  }

  request.continue({ headers });
}
