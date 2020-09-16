import { STR_CONSTRUCTOR } from './constants';

/**
 *
 * @param {import('@babel/traverse').NodePath} constructor
 *
 * @returns {import('@babel/traverse').NodePath}
 */
export default function getSuperCallExpression(constructor) {
  const constructorBody =
    (constructor.isClassMethod({ kind: STR_CONSTRUCTOR }) &&
      constructor.get('body')) ||
    constructor;

  return constructorBody
    .get('body')
    .filter(
      expressionNodes =>
        expressionNodes.isExpressionStatement() &&
        expressionNodes.get('expression.callee').isSuper()
    )[0];
}
