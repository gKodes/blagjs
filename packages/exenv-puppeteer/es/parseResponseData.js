import contentType from 'content-type';

export const STR_CONTENT_TYPE = 'content-type';
const STR_JSON_LOWER = 'json';

export async function parseResponseData(response, options) {
  const { headers = response.headers(), responseType = 'json' } = options;

  // responseType <> json, text, buffer
  if (responseType !== STR_JSON_LOWER && headers[STR_CONTENT_TYPE]) {
    const mime = contentType.parse(headers[STR_CONTENT_TYPE]);
    if (mime && mime.type) {
      isJSON = mime.type.toLowerCase().includes(STR_JSON_LOWER);
    }
  }

  return await response[responseType]();
}
