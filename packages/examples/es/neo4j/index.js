import Neo4JConnector from '@blinds/connector-neo4j';
import useConnector from '@blinds/core/useConnector';
import { Simple, Child } from '../models';

const connector = new Neo4JConnector();
useConnector(connector);

// Simple.prototype.meta = { prop1: 'prop1' };

(async () => {
  try {
    const instance = await Simple.create({
      name: 'Sample-Example3',
      phone: 9931231234,
    });
    console.info(instance.child);

    const child = await instance.child.is(new Child({ name: 'Child' }));
    // await instance.child();
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    await connector.close();
  }
})();
