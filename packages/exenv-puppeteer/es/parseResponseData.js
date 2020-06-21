import contentType from 'content-type';

export const STR_CONTENT_TYPE = 'content-type';
const STR_JSON_LOWER = 'json';

export async function parseResponseData(response, options) {
  let { headers = response.headers(), responseType = 'text' } = options;

  // responseType <> json, text, buffer
  if (responseType !== STR_JSON_LOWER && headers[STR_CONTENT_TYPE]) {
    const mime = contentType.parse(headers[STR_CONTENT_TYPE]);
    if (mime && mime.type) {
      responseType = (mime.type.toLowerCase().includes(STR_JSON_LOWER) && STR_JSON_LOWER) || 'text';
    }
  }

  return await response[responseType]();
}
