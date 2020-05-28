import { register } from '../../register';

export function password(props) {
  const { name, label: message } = props;

  return {
    type: 'password',
    name,
    message
  };
}

register('/components/password', password);
