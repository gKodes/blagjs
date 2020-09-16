import { STR_CONSTRUCTOR } from './constants';

/**
 *
 * @param {import('@babel/traverse').NodePath} classNodePath
 */
export default function getConstructor(classNodePath) {
  classNodePath.assertClassDeclaration();

  return classNodePath
    .get('body.body')
    .find(nodePath => nodePath.isClassMethod({ kind: STR_CONSTRUCTOR }));
}
