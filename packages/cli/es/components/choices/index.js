import { register } from '../../register';

export function choices(props) {
  const { name, label: message, choices } = props;

  return {
    type: 'checkbox',
    name,
    message,
    choices
  };
}

register('/components/choices', choices);
