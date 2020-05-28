import fastify from 'fastify';
import { cosmiconfig } from 'cosmiconfig';


const application = fastify({ logger: true, caseSensitive: true });
application.register(require('../plugins/access').default, {
  jwksUri: process.env.JWKS_URL,
  kid: process.env.JWK_ID,
});
application.register(require('../plugins/session').default);
application.register(require('../plugins/browser').default);
application.route(require('./services/v1/context').default);

application.get('/', async (request, reply) => {
  return { hello: 'world' };
});

application.listen(process.env.PORT_NO || 8420, '::', (err, address) => {
  if (err) throw err
  application.log.info(`Server listening on ${address}`)
});
