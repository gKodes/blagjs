import { objectProperty, arrayExpression } from '@babel/types';

/**
 *
 * @param {import('@babel/types').ObjectExpression} obj
 * @param {import('@babel/types').Expression} propName
 * @param {import('@babel/types').Expression} value
 */
export default function getOrCreateProp(obj, propName, value) {
  let prop = obj.properties.find(objProp => propName.name === objProp.key.name);

  if (!prop) {
    obj.properties.push((prop = objectProperty(propName, value)));
  }

  return prop;
}
