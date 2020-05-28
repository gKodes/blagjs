import fp from 'fastify-plugin';
import { manager } from '../sessionManager/index';

async function session_plugin(fastify, options) {
  async function findOrCreateSessionForRequest(request, reply) {
    request.session = manager.getSession(request.access.id);
  }

  fastify.addHook('onRoute', (routeOptions) => {
    // preSerialization can be an array or undefined
    if (routeOptions.config && routeOptions.config.needs && routeOptions.config.needs.includes('Session')) {
      routeOptions.preHandler = Array.isArray(routeOptions.preHandler)
        ? routeOptions.preHandler.concat(findOrCreateSessionForRequest)
        : [findOrCreateSessionForRequest];
    }
  });
}

export default fp(session_plugin, {
  fastify: '>=2.x',
  name: 'browser-session-plugin',
});
