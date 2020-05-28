#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import minimist from 'minimist';
import puppeteer from 'puppeteer-core';
import pathExists from 'path-exists';
import exitHook from 'exit-hook';
import { cosmiconfig } from 'cosmiconfig';
import { Stack } from '@blag/core/stack';

export function readJSONFile(src) {
  return JSON.parse(fs.readFileSync(src, { encoding: 'utf8' }));
}

process.on('unhandledRejection', (reason, promise) => {
  console.info(reason);
});

const argv = minimist(process.argv.slice(3));

async function loadScriptsForAction(stack, action, context) {
  const actionJSON = stack.actions[action];
  assert.ok(actionJSON, 'Action not found');

  const { scripts, url } = actionJSON;

  await Promise.all(scripts.map((scriptName) => stack.scripts[scriptName].runIn(context)));
  return url;
}

(async () => {
  const { TYOURM_TOKEN } = process.env;
  const { envconfig } = argv;

  const rc = await cosmiconfig('blag').search();
  const {
    config: { defaults = {}, contexts, environments },
    filepath: rcPath,
  } = rc;

  let envConfigJson = {};
  if (envconfig) {
    envConfigJson = readJSONFile(envconfig);
  }

  const [scriptPkgSrc, action] = argv._;
  assert.ok(scriptPkgSrc, 'Script Package Path is not provied');

  const scriptJsonPath = path.join(scriptPkgSrc, 'scriptr.json');
  assert.ok(pathExists.sync(scriptJsonPath), `${scriptPkgSrc} does not have scriptr.json`);

  const scriptrJson = readJSONFile(scriptJsonPath);
  assert.ok(scriptrJson, `${scriptPkgSrc} is not a valid scriptr package`);

  const stack = new Stack(scriptPkgSrc, scriptrJson);
  assert.ok(stack.actions, 'There no actions defined for the stack');

  if ( !action || !stack.actions[action] ) {
    console.info(`Stack: ${stack.name}
  ${ Object.keys(stack.actions).map(actionName => `${actionName} - ${stack.actions[actionName].description}`).join('\r\n  ') }
    `);

    process.exit();
  }

  const { context = defaults.context, environment = defaults.environment } = stack;

  // assert.ok(contexts[context], `${context} context not found`);
  assert.ok(environments[environment], `${environment} context not found`);

  // const { Context } = await import(`../context/${context}`);
  const { Environment } = await import(require.resolve(environments[environment]));

  const exenv = new Environment({
    ...envConfigJson,
    promptHandler: {},
    domains: stack.domains,
    name: stack.getName(),
  });

  if (typeof exenv.init === 'function') {
    await exenv.init();
  }

  const contextIsntance = exenv.getContext();
  exenv.request(await loadScriptsForAction(stack, action, contextIsntance));
})();
