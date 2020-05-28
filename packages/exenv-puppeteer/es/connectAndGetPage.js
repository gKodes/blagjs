import assert from 'assert';
import axios from 'axios';
import puppeteer from 'puppeteer-core';

class UnableToConnectToRunner extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 *
 * @param {PuppeteerEnvironmentConfig} config
 */
export async function getConnectionDetailsFromServer(config) {
  const { serverUrl, token, domains, name } = config;
  const {
    data: connectionInfo
  } = await axios.post(
    serverUrl,
    {
      name,
      domains,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'json',
    }
  );

  return connectionInfo;
}

async function connectToBrowser(browserWSEndpoint) {
  return await puppeteer.connect({
    browserWSEndpoint,
    defaultViewport: {
      width: 1366,
      height: 768,
    },
  });
}

/**
 *
 * @param {PuppeteerEnvironmentConfig} config
 */
export async function connectAndGetPage(config) {
  let connectionInfo;

  if (config.serverUrl) {
    connectionInfo = await getConnectionDetailsFromServer(config);
  } else {
    try {
      const { getConnectionDetails } = await import('@blag/puppeteer-chrome');
      connectionInfo = await getConnectionDetails({ domains: config.domains });
    } catch (_) {
      console.info(_);
      throw Error('Please provide config or install puppeteer-chrome localy');
    }
  }

  const { target, ws } = connectionInfo;
  const browser = await connectToBrowser(ws);
  const pages = await browser.pages();
  const page = pages.find((page) => target === page.target()._targetId);
  assert.ok(page, `could not connect to target ${target}`);
  return { browser, page };
}
