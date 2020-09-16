import getConstructor from './getConstructor';
import createConstructor from './createConstructor';

/**
 *
 * @param {import('@babel/traverse').NodePath} classNodePath
 * @returns {import('@babel/traverse').NodePath}
 */
export default function getOrCreateConstructor(classNodePath) {
  classNodePath.assertClassDeclaration();

  let constructor = getConstructor(classNodePath);
  if (!constructor) {
    constructor = classNodePath
      .get('body')
      .pushContainer('body', createConstructor())[0];
  }

  return constructor;
}
