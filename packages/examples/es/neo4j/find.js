import { toNumber } from 'neo4j-driver/lib/integer.js';
import Neo4JConnector from '@blinds/connector-neo4j';
import { Simple, Child } from '../models';
import useConnector from '@blinds/core/useConnector';

const connector = new Neo4JConnector();
useConnector(connector);

(async () => {
  try {
    const a = await Simple.findOne({ name: 'Sample-Example3' });
    console.info(a);
    console.info(await a.child());
  } catch (e) {
    console.info(e);
    throw e;
  } finally {
    await connector.close();
  }
})();
