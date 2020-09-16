import SYM_META from './sym';

export default function set(instance, meta) {
  return (instance[SYM_META] = meta);
}
