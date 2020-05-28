import urlParser from 'url-parse';
import { getPageForScript } from '../../../../chrome/getPageForScript';

export default {
  method: 'POST',
  url: '/v1/context',
  schema: {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        // the list of domains which would allowed to be accessed in the new opened tab
        domains: { type: 'array', items: { type: 'string' } },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          ws: { type: 'string' }, // WS URL to which puppeteer should connect to
          target: { type: 'string' }, // Page Target
        },
      },
    },
  },
  config: {
    needs: ['AccessToken', 'Session', 'Browser'],
  },
  // TODO: Set page View Port Size
  // TODO: On Page create set cookies from store and on page close save cookies back to store
  handler: async function (request, reply) {
    const {
      hostname,
      browser,
      session,
      body: { domains, name },
    } = request;
    const { contextId, [name]: targetId, userId } = session;
    const { page, userContext } = await getPageForScript(browser, { userId, contextId, targetId });

    session.contextId = userContext._id;
    session[name] = page.target()._targetId;

    page.on('close', () => {
      delete session[name];
    });

    const host = hostname.indexOf(':') > -1 ? hostname.split(':')[0] : hostname; // 127.0.0.1:8420
    const wsUrl = urlParser(userContext._connection._url);
    wsUrl.set('hostname', host);

    // Inside docker this should be docker/service name
    reply.send({ ws: wsUrl.toString(), target: page.target()._targetId });
  },
};
