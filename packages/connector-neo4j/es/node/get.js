import { isInt, integer } from 'neo4j-driver';
import toObj from './toObj';

/**
 *
 * @param {import('neo4j-driver').Result} result
 * @param {String} varName
 */
export default function get(result, varName, instanceBy) {
  const foundRecord = result.records.find(record => record.has(varName));
  return toObj(foundRecord?.get(varName), instanceBy);
}
