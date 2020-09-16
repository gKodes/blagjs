import toObj from './toObj';

/**
 *
 * @param {import('neo4j-driver').Result} result
 * @param {String} varName
 */
export default function getAll(result, varName, instanceBy) {
  const foundRecords = result.records.filter(record => record.has(varName));
  return foundRecords?.map(foundRecord =>
    toObj(foundRecord.get(varName), instanceBy)
  );
}
