import os from 'os';
import path from 'path';
import puppeteer from 'puppeteer-core';
import { cosmiconfig } from 'cosmiconfig';
const {
  puppeteer: { chromium_revision: revision },
} = require('puppeteer-core/package.json');

export async function launchAndGetBrowser() {
  let config = {};
  try {
    const result = await cosmiconfig('blag').search();
    config = result.config.browser;
  } catch (_) {}

  const browserFetcher = puppeteer.createBrowserFetcher({
    path: path.resolve(config.browserInstallDir),
  });

  const revisionInfo = browserFetcher.revisionInfo(revision);
  const { debug: IS_IN_DEBUG, wsPort: WS_PORT } = config;

  return await puppeteer.launch({
    headless: !IS_IN_DEBUG,
    devtools: IS_IN_DEBUG,
    executablePath: revisionInfo.executablePath,
    args: [/*'--no-sandbox', '--disable-setuid-sandbox',*/ `--remote-debugging-port=${WS_PORT || 0}`],
    // TODO: Determine the userDataDir
    userDataDir: path.join(os.tmpdir(), 'tyourm-chrome'),
  });
}
