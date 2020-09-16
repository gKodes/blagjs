import PropTypes from 'prop-types';
import Model from '@blinds/core/model';
import uid from '@blinds/core/attrs/uid';
import Simple from './simple';

export default class Child extends Model {
  uid = uid();
  name = PropTypes.string.isRequired;
}

Simple.hasOne(Child);
