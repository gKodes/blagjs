import assert from 'assert';
import urlParser from 'url-parse';
import defer from 'p-defer';
import shortid from 'shortid';
import LRU from 'lru-cache';
import { Environment } from '@blag/core/environment';
import { contextBuilder } from '@blag/core/context';
import { asUrlStr } from '@blag/core/url';
import { connectAndGetPage } from './connectAndGetPage';
import { responseInterceptor } from './responseInterceptor';
import { targetChangeHandler } from './targetChangeHandler';
import { requestInterceptor, STR_UID_HEADER } from './requestInterceptor';
import { parseResponseData } from './parseResponseData';

const STR_GET = 'get';

// NOTES: https://github.com/sindresorhus/promise-fun

/**
 * @typedef {Object} PuppeteerEnvironmentConfig
 * @property {string} serverUrl url of the browser server
 * @property {string} token access token used for requesting the page
 * @property {array[string]} domains the list of domains which would be allowed on the page
 * @property {string} name the name of the script/environment
 */

class PuppeteerEnvironment extends Environment {
  /**
   *
   * @param {PuppeteerEnvironmentConfig} config
   */
  constructor(config) {
    super(config);
    this.context = {
      script: contextBuilder(this, ['nav', 'prompt', 'routine', 'exec', 'request']),
    };
    this.toIntercept = new Map();
    this.deferrals = new LRU({
      max: 50,
    });
    // Object.freeze(this.context);
  }

  // TODO: Make this singletone
  async init() {
    const { page, browser } = await connectAndGetPage(this.config);
    this.page = page;

    await page.setRequestInterception(true);

    // Response intreceptor to help determine when the date is recived back to the browser
    page.on('request', requestInterceptor.bind(this, this.toIntercept));
    page.on('response', responseInterceptor.bind(this, this.deferrals));
    // Update the stage value of the targe id has changed
    browser.on('targetchanged', targetChangeHandler.bind(this));

    Object.freeze(this);
  }

  getContext() {
    return this.context;
  }

  // Context Function's and Object's

  // execute the given script inside or on the page
  /**
   *
   * @param {string} source
   */
  exec(source, ...args) {
    // This is crutual functionality to help inject code into chrome
    return this.page.evaluate(source, ...args);
  }

  /**
   * Request the give url and then execut the navagation handler when the content has succesfully loaded
   *
   * @param {import('@blag/core/index.ts.d').RequestOptions|string} config
   */
  async request(config) {
    // TODO: Handle XHR
    const { page } = this;
    const target = page.target();
    let { method = STR_GET, type, data, params, headers } = config;
    let url = asUrlStr(config);

    if (method.toLowerCase() !== STR_GET) {
      let overrides = {
        method,
        postData: data, //typeof(data) === 'string'? data : json.stringify(data),
        headers,
      };

      this.toIntercept.set(url, updateOverridesWithData(overrides, data));
    }

    if (!type) {
      if (target.url() === url && method.toLowerCase() === STR_GET) {
        return targetChangeHandler.call(this, target);
      }

      return transformResponse(
        await page.goto(url, {
          waitUntil: ['domcontentloaded', 'networkidle2', 'networkidle0'],
        }),
        config
      );
    } else {
      const deffered = defer();
      let uid = shortid.generate();
      while (this.deferrals.has(uid)) {
        uid = shortid.generate();
      }

      this.deferrals.set(uid, deffered);
      await page.evaluate(
        async function (type, method, url, headerName, uid) {
          if (type === 'fetch') {
            fetch(url, {
              method,
              headers: {
                [headerName]: uid,
              },
            });
            return;
          }

          const request = new XMLHttpRequest();
          request.open(method, url, true);
          request.setRequestHeader(headerName, uid);

          request.addEventListener('error', function () {
            console.info('xhr-error', arguments);
          });

          request.send(null);
        },
        type,
        method,
        url,
        STR_UID_HEADER,
        uid
      );
      return await transformResponse(await deffered.promise, config);
    }
  }
}

function updateOverridesWithData(overrides = {}, data) {
  if (data) {
    if (Buffer.isBuffer(data)) {
      data = data.toString();
    }

    if (typeof data === 'string') {
      overrides.postData = data;
    } else {
      // Handle Form Data
      overrides.postData = JSON.stringify(data);
      overrides.headers = Object.assign({}, overrides.headers, {
        'content-type': 'application/json',
      });
    }
  }

  return overrides;
}

async function transformResponse(response, config) {
  if (response) {
    const transformed = {
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers(),
      config,
      request: response.request(),
    };

    transformed.data = await parseResponseData(response, { headers: transformed.headers });
    return transformed;
  }

  return response;
}

export { PuppeteerEnvironment as Environment };
