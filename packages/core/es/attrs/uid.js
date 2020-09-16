import PropTypes from 'prop-types';

export default function uid(validator) {
  return validator || PropTypes.any.isRequired;
}
