import assert from 'assert';

export async function getOrCreatePage(context, targetId) {
  let page;

  if (targetId) {
    const pages = await context.pages();
    page = pages.find(page => targetId === page.target()._targetId);

    assert.ok(page, `could not find target ${targetId}`);
  } else {
    page = await context.newPage();
  }

  return page;
}
