import { ApolloServer } from 'apollo-server-express';
import express from 'express';

import createSchema from './schema/createSchema';

async function main() {
  const app = express();
  const schema = await createSchema();
  const apolloServer = new ApolloServer({ schema });
  await apolloServer.start();
  await apolloServer.applyMiddleware({ app, path: '/' });
  const apiUrl: string = 'localhost';
  const apiPort: number = 8085;
  await app.listen(apiPort);
  // eslint-disable-next-line no-console
  console.log(`Server started at ${apiUrl}:${apiPort}`);
}

main();
