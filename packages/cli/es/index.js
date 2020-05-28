import { prompt } from 'inquirer';
import { COMPONENTS, register } from './register';

import './components';

export async function render(model) {
  const { items } = model;
  const answers = await prompt( items.map(item => COMPONENTS[item.type](item)) );

  return answers;
}

export { register };
