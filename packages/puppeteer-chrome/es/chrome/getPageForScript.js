import multimatch from 'multimatch';
import { getOrCreateContext } from './getConext';
import { getOrCreatePage } from './getPage';
import { browserContextHooksManager } from './browserContextHooksManager';

const STR_STANDALONE_USER = 'standalone';

export async function getPageForScript(browser, options) {
  const { targetId, contextId, domains, userId = STR_STANDALONE_USER } = options;

  // DB Create a record
  // NOTE: If context is not created for user then create one
  const userContext = await browserContextHooksManager(userId, await getOrCreateContext(browser, contextId));
  const page = await getOrCreatePage(userContext, targetId);
  const isNew = targetId !== page.target()._targetId;

  if (isNew && domains && domains.length) {
    await page.setRequestInterception(true);

    page.on('request', (request) => {
      const url = new URL(request.url());
      /*
        if ( [ 'document', 'xhr', 'fetch', 'websocket' ].includes(request.resourceType()) ) {
          console.info('--url--', request.url());
        }
*/
      if (multimatch(url.hostname, domains).length) {
        // console.info(multimatch(url.hostname, domains));
        return request.continue();
      }

      request.abort('namenotresolved');
    });
  }

  return {
    userContext,
    page,
  };
}
