/**
 *
 * @param {import('neo4j-driver').Result} result
 */
export default function updated(result) {
  const {
    nodesCreated,
    relationshipsCreated,
    propertiesSet,
    labelsAdded,
    indexesAdded,
    constraintsAdded,
  } = result.summary.counters.updates();

  return (
    nodesCreated +
    relationshipsCreated +
    propertiesSet +
    labelsAdded +
    indexesAdded +
    constraintsAdded
  );
}
