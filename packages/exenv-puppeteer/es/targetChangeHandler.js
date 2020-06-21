import { debounce } from 'debounce';

export const targetChangeHandler = debounce(async function(target) {
  const page = await target.page();
  console.info('--targetChangeHandler--', target.url(), page !== null);

  if (page) {
    /*
      try {
        // TODO: If Page Loaded Logic is provied by script runt that insted
        await page.waitForNavigation({
          waitUntil: ['domcontentloaded', 'networkidle2', 'networkidle0'],
        });
      } catch (_) { /* ignore / }
    */
    // await page.waitFor(() => {});

    console.info('--targetChangeHandler--', target.url());
    this.handle(target.url(), page);
  }
}, 1000);
