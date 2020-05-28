import assert from 'assert';

export async function getOrCreateContext(browser, contextId) {
  if (contextId) {
    const contexts = await browser.browserContexts();
    const userContext = contexts.find((browserContext) => contextId === browserContext._id);

    assert.ok(userContext, `could not find context ${contextId}`);

    return userContext;
  }

  return await browser.createIncognitoBrowserContext();
}
