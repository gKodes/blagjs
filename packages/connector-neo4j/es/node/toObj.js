import { isInt } from 'neo4j-driver';

const instanceBuilder = () => ({});

/**
 *
 * @param {import('neo4j-driver').Node} result
 * @param {Function} instanceBy
 */
export default function toObj(node, instanceBy = instanceBuilder) {
  if (node && node.properties) {
    const instance = instanceBy();

    for (const [attr, value] of Object.entries(node.properties)) {
      if (isInt(value)) {
        instance[attr] = value.toNumber();
      } else {
        instance[attr] = value;
      }
    }
    return instance;
  }
  return node;
}
