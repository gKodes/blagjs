import getMeta from '../meta/get';
import whenOnlyWithUid from '../uid/whenOnly';
import withTransaction from '../withTransaction';

export default function one(node, OtherType, relationOptions) {
  const { connector, relation } = relationOptions;
  const selfMeta = getMeta(node);
  const otherMeta = getMeta(OtherType);
  // NOTE: Doing this for to restrict variable scope
  // console.info(selfMeta, otherMeta);
  const usingTransaction = withTransaction(connector);

  function findOne(query) {
    return connector.findByRelation(whenOnlyWithUid(node), relation, query, {
      instanceBy: () => new OtherType(),
    });
  }

  /**
   * Delete the given relation for the node
   *
   * @param {*} options
   */
  async function purgeRelation(options) {
    return await usingTransaction(async transaction => {
      await connector.detachRelation(whenOnlyWithUid(node), relation, {
        transaction,
      });
      if (options?.purge) {
        await connector.purge(other, { transaction });
      }
    }, options);
  }

  /**
   * Set the node to the other end of the relation
   *
   * @param {import('@blinds/core').Model} leaf
   * @param {*} options
   */
  async function setOne(leaf, options) {
    return await usingTransaction(async transaction => {
      // NOTE: remove the child if it exists before we replace it.
      await purgeRelation({ ...options, transaction });
      return await connector.saveAndRelate(
        whenOnlyWithUid(node),
        leaf,
        relation,
        {
          transaction,
        }
      );
    }, options);
  }

  return Object.defineProperties(findOne, {
    is: { value: setOne },
    remove: {
      value: purgeRelation,
    },
  });
}
