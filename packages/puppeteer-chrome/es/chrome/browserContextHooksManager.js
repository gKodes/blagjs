import debounce from 'debounce';
import { saveCookies } from './contextHooks/saveCookies';

const STR_DEVTOOLS_PROTOCOL = 'devtools://';

export async function browserContextHooksManager(userId, browserContext) {
  const pages = await browserContext.pages();

  // Determine if now context or not
  if (pages.length === 0) {
    //NOTE: When creating new context, open up an blank tab (as of now/later health check url)
    // which will help us to manage cookies and other stuff as needed
    const page = await browserContext.newPage();

    browserContext.on(
      'targetdestroyed',
      async (target) => {
        const targetUrl = target.url();
        if (target.page() !== null && targetUrl.startsWith(STR_DEVTOOLS_PROTOCOL)) {
          const pages = await browserContext.pages();
          if (pages.length === 1) {
            await saveCookies(userId, page);
          }
        }
      }
    );
  }

  return browserContext;
}
