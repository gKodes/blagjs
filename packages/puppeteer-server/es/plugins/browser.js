import fp from 'fastify-plugin';
import { launchAndGetBrowser } from '../chrome';

async function browser_plugin(fastify, options) {
  const browser = await launchAndGetBrowser();

  async function attachBrowser(request, reply) {
    request.browser = browser;
  }

  fastify.addHook('onRoute', (routeOptions) => {
    // preSerialization can be an array or undefined
    if (routeOptions.config && routeOptions.config.needs && routeOptions.config.needs.includes('Browser')) {
      routeOptions.preHandler = Array.isArray(routeOptions.preHandler)
        ? routeOptions.preHandler.concat(attachBrowser)
        : [attachBrowser];
    }
  });
}

export default fp(browser_plugin, {
  fastify: '>=2.x',
  name: 'browser-plugin',
});
