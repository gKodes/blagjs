import Variables from './variables';

export default async function query(fn) {
  const variables = new Variables();
  return await fn({ variables });
}
