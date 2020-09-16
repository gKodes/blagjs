# `@blinds/connector-neo4j`

Neo4j Connector for Blinds

## Usage

```javascript
import Neo4JConnector from '@blinds/connector-neo4j';
import useConnector from '@blinds/core/useConnector';

const connector = new Neo4JConnector('neo4j://user:passowrd@localhost:7687');
useConnector(connector);
```
