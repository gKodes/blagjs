/**
 *
 * @param {import('neo4j-driver').Result} result
 */
export default function removed(result) {
  const {
    labelsRemoved,
    indexesRemoved,
    constraintsRemoved,
  } = result.summary.counters.updates();

  return labelsRemoved + indexesRemoved + constraintsRemoved;
}
