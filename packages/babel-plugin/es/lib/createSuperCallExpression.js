import * as types from '@babel/types';

/**
 *
 * @returns {import('@babel/types').CallExpression}
 */
export default function createSuperCallExpression() {
  return types.callExpression(types.super(), [
    types.spreadElement(types.identifier('arguments')),
  ]);
}
