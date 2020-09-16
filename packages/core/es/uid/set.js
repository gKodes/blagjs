import { strict as assert } from 'assert';
import getMeta from '../meta/get';

export default function set(instance, value, meta = getMeta(instance)) {
  const { uid, name } = meta;

  assert.ok(uid, `${name} does not have a UID`);

  if (!instance[uid]) {
    instance[uid] = value;
  }

  return instance;
}
