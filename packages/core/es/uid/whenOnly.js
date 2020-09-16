import { strict as assert } from 'assert';
import getMeta from '../meta/get';

export default function only(instance, meta = getMeta(instance)) {
  const { uid, name } = meta;

  if (!instance[uid]) {
    return { [uid]: instance[uid] };
  }

  return instance;
}
