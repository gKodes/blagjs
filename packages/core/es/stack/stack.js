import fs from 'fs';
import path from 'path';
import { Script } from './script';

/**
{
  "name": "At&t",
  "cname": "att",
  "domains": ["*.att.com"],
  "scripts": {
    "login": "./dist/login.js",
    "read-statements": "./dist/read-statements.js"
  },
  "environment": "puppeteer",
  "context": "statement"
}
 */

// class Environment {}

function readJSON(jsonpath) {
  return JSON.parse(fs.readFileSync(jsonpath, { encoding: 'utf-8' }));
}

// Bundle, Package, Pack, Box, Stack

export class Stack {
  constructor(dirname, scriptrJson) {
    const { scripts } = scriptrJson;

    Object.assign(this, scriptrJson);
    Object.assign(this, {
      dirname,
      scripts: [], // [ /* array of scripts avilable and also the as names */ ]
    });

    Object.keys(scripts).forEach((name, _, source) => {
      const scriptPath = path.resolve(dirname, scripts[name]);
      this.scripts.push(this.scripts[name] = new Script(scriptPath, name, this));
    })
    Object.freeze(this);
  }

  getName() {
    return this.cname || this.name;
  }

  // load(environment) {}

  runIn(name, context) {
    if ( arguments.length > 1 ) {
      return this.scripts[name].runIn(context);
    }

    this.scripts.forEach(script => script.runIn(arguments[0]));
  }

  static from(dirname) {
    return new Stack(path.resolve(dirname), stackJson);
  }
}

// Stack.from();
