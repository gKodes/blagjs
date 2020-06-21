import assert from 'assert';
import { matchURL } from './url';

/**
 * @typedef {Object} RequestOptions
 * @property {string} url the complete URL or Path which would be merge with baseURL
 * @property {string} method http method
 * @property {string} baseURL **optional** base url to be prefixed for baseURL
 * @property {Object} headers an object representing all the headers to be passed for the request
 * @property {Object} params an object representing query params
 * @property {Object|string} data
 * @property {string} type default is frame navagation. xhr or fetch for background requet types
 */
export class Environment {
  /**
   *
   * @param {PuppeteerEnvironmentConfig} config
   */
  constructor(config) {
    this.handlers = [];
    this.routines = {};
    this.config = config;
  }

  async init() {
    throw new Error('Method not implemented');
  }

  getContext() {
    throw new Error('Method not implemented');
  }

  /**
   * Register a callback to be invokded for the given URL
   *
   * @param {import('../index.d.ts').URLMatch|string} url
   * @param {function(state: Object)} handler
   */
  nav(url, handler) {
    const test = matchURL(url);

    this.handlers.push({
      test,
      handler,
    });
  }

  /**
   *
   * @param {string} name
   * @param {function(response: Object)} fn
   */
  routine(name, fn) {
    assert.ok(!this.routines[name], 'Routine is already defined');
    this.routines[name] = fn;
  }

  /**
   *
   * @param {Object|string} model
   * @param {string} routineName
   */
  prompt(model, routineName) {
    assert.ok(typeof this.routines[routineName] === 'function', `routine '${routineName}' not found in Environment`);
    const { promptHandler } = this.config;
    return promptHandler.render(model);
  }

  /**
   * Request the give url and then execut the navagation handler when the content has succesfully loaded
   *
   * @param {import('../index.d.ts').RequestOptions|string} config
   */
  async request(config) {
    throw new Error('Method not implemented');
  }

  /**
   * Look-up and find an handler for the give url, returns the callback function if found
   * else undefined
   *
   * @param {import('../index.d.ts').URLMatch|string} url
   */
  async handle(url, ...args) {
    const route = this.handlers.find((handler) => handler.test(url));

    if (!args.length) {
      return route;
    }

    if (route && route.handler) {
      if (args.length === 1 && typeof args[0] === 'function') {
        args = await args[0](...args.slice(1));
      }

      return route.handler(...args);
    }
  }
}
