import { customRandom, customAlphabet, urlAlphabet } from 'nanoid';
const nanoid = customAlphabet(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  10
);

const SYM_INDEX = Symbol.for('index');

export default class Variables {
  [SYM_INDEX] = 0;

  constructor() {
    this.id = nanoid();
  }

  for(name) {
    this[SYM_INDEX] = [];
    return `${this.id}_${name}${(this[SYM_INDEX] = this[SYM_INDEX] + 1)}`;
  }
}
