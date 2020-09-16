import SYM_META from './sym';

export default function get(instance) {
  return instance[SYM_META];
}
