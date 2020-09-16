import JSON5 from 'json5';
import neo4j from 'neo4j-driver';
import query from '@blinds/core/query';
import getMeta from '@blinds/core/meta/get';
import setUid from '@blinds/core/uid/set';

import getNode from './node/get';
import getNodes from './node/getAll';
import updatedCount from './status/updated';
import stringify from './stringify';
import { inspect } from 'util';

const SYM_META = Symbol.for('model.meta');

const RANDOM_UUID = '#randomUUID()';

export default class Neo4JConnector {
  constructor(connectionUrl) {
    this.connectionUrl = connectionUrl;
    this.driver = neo4j.driver(
      'neo4j://localhost',
      neo4j.auth.basic('neo4j', 'admin')
    );
    this.session = this.driver.session();
  }

  transaction() {
    return this.session.beginTransaction();
  }

  // TODO: Support Array of instance's of same type
  async save(instance, options = {}) {
    const meta = getMeta(instance);
    const { name } = meta;
    const { transaction = this.session } = options;
    return await query(async ({ variables, q }) => {
      const sourceVar = variables.for(name);
      var result = await transaction.run(
        `MERGE (${sourceVar}:${name} ${stringify(
          setUid(instance, RANDOM_UUID, meta)
        )}) RETURN ${sourceVar}`
      );
      return getNode(result, sourceVar);
    });
  }

  async detachRelation(instance, relation, options = {}) {
    const { name } = getMeta(instance);
    const { transaction = this.session } = options;
    return await query(async ({ variables, q }) => {
      const sourceVar = variables.for(name);
      const relationVar = variables.for(relation);

      var result = await transaction.run(
        `MATCH (${sourceVar}:${name} ${JSON5.stringify(
          instance
        )})-[${relationVar}:${relation}]-() DELETE ${relationVar}`
      );
      return updatedCount(result);
    });
  }

  async purge(instance, options = {}) {
    const { name } = getMeta(instance);
    const { transaction = this.session } = options;
    return await query(async ({ variables, q }) => {
      const sourceVar = variables.for(name);

      var result = await transaction.run(
        `MATCH (${sourceVar}:${name} ${JSON5.stringify(
          instance
        )}) DETACH DELETE ${sourceVar}`
      );
      return updatedCount(result);
    });
  }

  // TODO: Support Array of leaf's
  async saveAndRelate(instance, leaf, relation, options = {}) {
    const { name } = getMeta(instance);
    const { name: leafName } = getMeta(leaf);
    const { transaction = this.session } = options;
    return await query(async ({ variables, q }) => {
      const sourceVar = variables.for(name);
      const leafVar = variables.for(leafName);
      var result = await transaction.run(
        `MATCH (${sourceVar}:${name} ${JSON5.stringify(
          instance
        )}) MERGE (${sourceVar})-[:${relation}]->(${leafVar}:${leafName} ${JSON5.stringify(
          leaf
        )}) RETURN ${leafVar}`
      );
      return getNode(result, leafVar);
    });
  }

  async findByRelation(instance, relation, filter, options = {}) {
    const { name } = getMeta(instance);
    const { transaction = this.session, instanceBy } = options;
    return await query(async ({ variables, q }) => {
      const sourceVar = variables.for(name);
      const relationVar = variables.for(relation);
      var result = await transaction.run(
        `MATCH (${sourceVar}:${name} ${JSON5.stringify(
          instance
        )}) OPTIONAL MATCH (${sourceVar})-[${relationVar}:${relation}]->() RETURN ${sourceVar}`
      );
      return getNodes(result, sourceVar, instanceBy);
    });
  }

  async findAllByType(Type, filter, options = {}) {
    const { name } = getMeta(Type);
    const { transaction = this.session, instanceBy } = options;
    return await query(async ({ variables, q }) => {
      const sourceVar = variables.for(name);
      var result = await transaction.run(
        `MATCH (${sourceVar}:${name} ${JSON5.stringify(
          filter
        )}) RETURN ${sourceVar}`
      );
      return getNodes(result, sourceVar, () => new Type());
    });
  }

  async findByType(Type, filter, options = {}) {
    const { name } = getMeta(Type);
    const { transaction = this.session, instanceBy } = options;
    return await query(async ({ variables, q }) => {
      const sourceVar = variables.for(name);
      var result = await transaction.run(
        `MATCH (${sourceVar}:${name} ${JSON5.stringify(
          filter
        )}) RETURN ${sourceVar} LIMIT 1`
      );
      return getNode(result, sourceVar, () => new Type());
    });
  }

  async close() {
    await this.session.close();
    await this.driver.close();
  }

  toString() {
    return `Neo4JConnector { connectionUrl: ${this.connectionUrl} }`;
  }

  [inspect.custom]() {
    return this.toString();
  }

  toJSON() {
    return { connectionUrl: this.connectionUrl };
  }
}
