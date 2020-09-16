import JSON5 from 'json5';

const FUNCTION_REGEX = /'(#([^]+\(\)))'/gi;

export default function stringify(instance) {
  const value = JSON5.stringify(instance).replace(
    FUNCTION_REGEX,
    (_, __, fnName) => fnName
  );
  console.info(value);
  return value;
}
