import contentType from 'content-type';
import { parseResponseData } from './parseResponseData';

const STR_DOCUMENT = 'document';

export async function responseInterceptor(deferrals, response) {
  // Not checking for OK status as in some cases we might want to other responses then 200
  const request = response.request();
  const defered = deferrals.get(request._scriptr_uid);

  if (defered) {
    defered.resolve(response);
  }

  if (request && request.resourceType() !== STR_DOCUMENT) {
    await this.handle(response.url(), async () => {
      const headers = response.headers();
      return [await parseResponseData(response, { headers }), headers];
    });
  }
}
