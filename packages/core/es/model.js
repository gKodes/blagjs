import PropTypes from 'prop-types'; // ES6
import { singular, plural } from 'pluralize';
import assert from 'assert';
import getMeta from './meta/get';
import SYM_META from './meta/sym';
import { EventEmitter2 } from 'eventemitter2';
import operationsByOne from './relations/one';
import lazyProp from './lazy/prop';
import { getConnector } from './useConnector';

const SYM_CONNECTOR = Symbol.for('model.connector');

function OperationsByRelation(SelfType, OtherType, options) {
  const { connector, relation } = options;
  const selfMeta = getMeta(SelfType);
  const otherMeta = getMeta(OtherType);
  // NOTE: Doing this for to restrict variable scope

  console.info(selfMeta, otherMeta);

  function find(query) {
    return connector.findByRelation(SelfType, relation, query);
  }

  return Object.assign(find, this);
}

// before
// after
export default class Model {
  constructor(props, connector = getConnector()) {
    this[SYM_CONNECTOR] = connector;
    Object.assign(this, props);
  }

  async save() {
    await this.validate();
    this.events.emit(['beforeSave', this[SYM_META].name], this);
    console.info(await this[SYM_CONNECTOR].save(this));
    this.events.emit(['save', this[SYM_META].name], this);
    return this;
  }

  async validate() {
    const { props, name } = getMeta(this);
    this.events.emit(['beforeValidate', this[SYM_META].name], this);
    PropTypes.checkPropTypes(props, this, '', name);
    this.events.emit(['validate', this[SYM_META].name], this);
  }

  static async find(query, connector = getConnector()) {
    return await connector.findAllByType(this, query);
  }

  static async findOne(query, connector = getConnector()) {
    return await connector.findByType(this, query);
  }

  static async create(props, connector = getConnector()) {
    assert.ok(connector, 'connector has to be passed for create');
    // This is the prototype co creating instance of this;
    const Type = this;
    return await new Type(props, connector).save();
  }

  static has(Other) {
    // help create the relation ship
    const { name: otherName } = getMeta(Other);
    const relation = plural(otherName.toLowerCase());
    // this[SYM_CONNECTOR].relate(getMeta(this), getMeta(Other));
    this.prototype[relation] = new OperationsByRelation(this, Other, {
      relation,
      connector: this[SYM_CONNECTOR],
    });
  }

  static hasOne(Other) {
    const { name: otherName } = getMeta(Other);
    const relation = singular(otherName.toLowerCase());
    lazyProp(this.prototype, relation, function () {
      return operationsByOne(this, Other, {
        relation,
        connector: this[SYM_CONNECTOR],
      });
    });
  }
}

Model.prototype.events = Model.events = new EventEmitter2({
  // set this to `true` to use wildcards
  wildcard: false,

  // the delimiter used to segment namespaces
  delimiter: '.',

  // the maximum amount of listeners that can be assigned to an event
  maxListeners: 10,
  verboseMemoryLeak: true,
  ignoreErrors: false,
});

Model.init = function init(Type, meta) {
  const metaFrozen = Object.freeze(meta);
  Object.defineProperties(Type.prototype, {
    [SYM_META]: {
      value: metaFrozen,
    },
  });

  Object.defineProperties(Type, {
    [SYM_META]: {
      value: metaFrozen,
    },
  });
};

// Simple.children({ name: "a" });

// Simple.child.is(new Child());
// Simple.children.add(child);
// Simple.children.remove(child, { purge: true });
