export function mergeContexts(...contexts) {
  return Object.assign({}, ...contexts);
}

export function contextBuilder(source, toExpose) {
  const context = {};

  toExpose.forEach((name) => {
    if (source[name]) {
      context[name] = source[name].bind(source);
    } else {
      console.warn(`Invalid Property name for context ${name}`);
    }
  });

  return context;
}
