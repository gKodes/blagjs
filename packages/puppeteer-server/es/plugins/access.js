import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import fp from 'fastify-plugin';

const STR_AUTHORIZATION = 'authorization';
const REGX_BEARER = /^Bearer[ :]/i;

function getTokenFromJWKS(jwksUri, kid) {
  return new Promise((resolve, reject) => {
    const jwks = jwksClient({
      jwksUri,
    });

    jwks.getSigningKey(kid, function (err, key) {
      if (err) return reject(err);
      resolve(key.getPublicKey());
    });
  });
}

async function access_plugin(fastify, options) {
  const publicKey = await getTokenFromJWKS(options.jwksUri, options.kid);

  async function parseAndValidAccessToken(request, reply) {
    const header = request.headers[STR_AUTHORIZATION];
    let barerTokens = [];
    let message = {
      message: 'Unkown error with authentication'
    };

    if (typeof header !== 'undefined') {
      if (Array.isArray(header)) {
        barerTokens = header.filter((value) => value.match(REGX_BEARER)).map((value) => value.replace(REGX_BEARER, ''));
      } else {
        barerTokens.push(header.replace(REGX_BEARER, ''));
      }

      for (let btx = 0; btx < barerTokens.length && !request.access; btx++) {
        try {
          request.access = jwt.verify(barerTokens[btx], publicKey);
        } catch (tokenErr) {
          if ( tokenErr.name === 'TokenExpiredError' ) {
            message = {
              message: 'Token Expired'
            }
          } else {
            request.log.error(tokenErr);
          }
        }
      }
    }

    if (!request.access) {
      reply.code(403);
      reply.send(message);
      return reply;
    }
  }

  fastify.addHook('onRoute', (routeOptions) => {
    // preSerialization can be an array or undefined
    if (routeOptions.config && routeOptions.config.needs && routeOptions.config.needs.includes('AccessToken')) {
      routeOptions.onRequest = [parseAndValidAccessToken];
    }
  });
}

export default fp(access_plugin, {
  fastify: '>=2.x',
  name: 'access-plugin',
});
