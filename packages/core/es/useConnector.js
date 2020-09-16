import asyncHooks from 'async_hooks';

const contexts = new Map();
let rootConnector = null;

asyncHooks
  .createHook({
    destroy: asyncId => {
      contexts.delete(asyncId);
    },
    init: (asyncId, type, triggerAsyncId, resource) => {
      const context = contexts.get(triggerAsyncId);
      if (context) {
        contexts.set(asyncId, context);
      }
    },
  })
  .enable();

export default function useConnector(connector) {
  if (rootConnector) {
    const asyncId = asyncHooks.executionAsyncId();
    contexts.set(asyncId, connector);
  } else {
    rootConnector = connector;
  }
  return rootConnector;
}

export function getConnector() {
  let context;
  if (contexts.size) {
    const asyncId = asyncHooks.executionAsyncId();
    context = contexts.get(asyncId);
  }
  return context || rootConnector;
}
