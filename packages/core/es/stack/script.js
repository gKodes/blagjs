import fs from 'fs';
import path from 'path';
import { wrap, Module } from 'module';
import vm/*, { Script }*/ from 'vm';
import assert from 'assert';

// TODO: Comple and Cache it and then run it when need in a given context
export class Script {
  constructor(filepath, name) {
    this.filename = filepath;
    this.name = name;
    // TODO: Use Script class and change logic

    Object.freeze(this);
  }

  runIn(context) {
    console.info(this);
    fs.accessSync(this.filename, fs.constants.R_OK);
    assert(context, 'Context is a required parameter');
    const source = fs.readFileSync(this.filename, { encoding: 'utf8' });

    var _module = new Module(this.filename);
    var require = Module.createRequireFromPath(source);
    // let context = environment.getContext();

    if ( vm.isContext(context) ) {
      context = vm.createContext(context);
    }

    var compiled = vm.runInNewContext(
      wrap(source),
      context,
      {
        filename: this.filename,
        lineOffset: 0, // TODO: Figure this out later
        displayErrors: true
      }
    );

    compiled(_module.exports, require, _module, path.basename(this.filename), path.dirname(this.filename));
    return _module.exports;
  }
}
