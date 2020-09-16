import PropTypes from 'prop-types';
import Model from '@blinds/core/model';
import uid from '@blinds/core/attrs/uid';

export default class Simple extends Model {
  uid = uid();
  name = PropTypes.string.isRequired;
  phone = PropTypes.number.isRequired;
}
