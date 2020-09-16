export default function withTransaction(connector) {
  async function usingTransaction(fn, options = {}) {
    usingTransaction.index++;
    let { transaction = options.transaction } = withTransaction;
    if (!transaction) {
      transaction = connector.transaction();
      usingTransaction.transaction = transaction;
    }

    try {
      const result = await fn(transaction);
      transaction = usingTransaction.transaction;
      if (transaction) {
        usingTransaction.index = usingTransaction.index - 1;
        !usingTransaction.index && (await transaction.commit());
      }
      return result;
    } catch (txError) {
      console.error('Error in TX', txError);
      usingTransaction.transaction && (await transaction.rollback());
    }
  }

  usingTransaction.index = 0;
  return usingTransaction;
}
