import { register } from '../../register';

export function input(props) {
  const { name, label: message } = props;

  return {
    type: 'input',
    name,
    message
  };
}

register('/components/input', input);
