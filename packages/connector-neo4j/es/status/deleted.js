/**
 *
 * @param {import('neo4j-driver').Result} result
 */
export default function deleted(result) {
  const {
    relationshipsDeleted,
    nodesDeleted,
  } = result.summary.counters.updates();

  return relationshipsDeleted + nodesDeleted;
}
