#!/usr/bin/env node

// http://omahaproxy.appspot.com/all.json
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const ProgressBar = require('progress');
const { cosmiconfig } = require('cosmiconfig');
const {
  puppeteer: { chromium_revision: revision },
} = require('puppeteer-core/package.json');
const searchPlaces = require('./searchPlaces');

async function installChromium() {
  let config = {};
  let installPath;
  try {
    const result = await cosmiconfig('blag').search();
    config = result.config.browser;
  } catch (_) {}

  if (config && config.browserInstallDir) {
    installPath = path.resolve(config.browserInstallDir);
  } else {
    installPath = path.resolve('./chromium');
    fs.writeFileSync(
      path.resolve('./.blagrc', JSON.stringify(Object.assign({}, config, { browserInstallDir: installPath })))
    );
  }

  const browserFetcher = puppeteer.createBrowserFetcher({
    path: installPath,
  });

  var progress;
  var lastDownloadedBytes = 0;

  browserFetcher
    .download(revision, (downloadedBytes, totalBytes) => {
      if (!progress) {
        console.info('created progress');
        progress = new ProgressBar('  downloading [:bar] :rate/bps :percent :etas', {
          complete: '=',
          incomplete: ' ',
          total: totalBytes,
        });
      }

      const delta = downloadedBytes - lastDownloadedBytes;
      lastDownloadedBytes = downloadedBytes;

      progress.tick(delta);
    })
    .then(() => Promise.all([browserFetcher.platform(), browserFetcher.localRevisions()]))
    .then(([platform, localRevisions]) => console.info(platform, localRevisions[0]));
  // .then(onSuccess)
  // .catch(onError);;
}

installChromium();
