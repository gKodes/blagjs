import { launchAndGetBrowser } from './chrome';
import { getPageForScript } from './chrome/getPageForScript';

/**
 * The config object throught which information can be passed
 * @typedef {Object} Options
 * @property {string} name - the name of the script
 * @property {array[string]} domains - the list of domains to be allowed for the tab
 * @property {string} userId - the user thats tied up with the connection context
 */

 /**
 * @typedef {Object} ConnectionInfo
 * @property {string} ws - developer tools connection url
 * @property {string} target - puppeteer page target id
 */

/**
 * Create or Give back for an existing page there connection details.
 * 
 * @param {Options} options 
 * @returns {ConnectionInfo}
 * 
 */
export async function getConnectionDetails(options) {
  const browser = await launchAndGetBrowser();
  const { userContext, page } = await getPageForScript(browser, { domains: options.domains });

  return { ws: userContext._connection._url, target: page.target()._targetId };
}

export { launchAndGetBrowser, getPageForScript };
