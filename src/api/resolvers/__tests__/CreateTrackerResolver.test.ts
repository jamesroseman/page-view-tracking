import { ApolloServer, ExpressContext } from 'apollo-server-express';
import { GraphQLResponse } from 'apollo-server-types';
import { Express } from 'express';
import gql from 'graphql-tag';
import { Connection, createConnection } from 'typeorm';

import { Tracker } from '../../../models/Tracker';
import createServer, { APIServer } from '../../server/createServer';

describe('CreateTrackerResolver', () => {
  let connection: Connection;
  let server: ApolloServer<ExpressContext>;
  let app: Express;

  beforeAll(async () => {
    connection = await createConnection({
      type: 'sqlite',
      database: './create_tracker_resolver_test.sqlite3',
      entities: [
        './src/models/**/*.ts',
      ],
      synchronize: true,
    });
  });

  beforeEach(async () => {
    const apiServer: APIServer = await createServer();
    server = apiServer.server;
    app = apiServer.app;
  });

  afterAll(async () => {
    await connection.close();
  });

  it('creates tracker when given no arguments', async () => {
    const response: GraphQLResponse = await server.executeOperation({
      query: gql`
        mutation CreateTracker {
          createTracker {
            id
          }
        }
      `,
    });
    const id: string | undefined = response?.data?.createTracker?.id;
    if (id === undefined) {
      expect(id).not.toBeUndefined();
    }
    // This find call will fail if the Tracker has not been successfully created and stored.
    await Tracker.findOneOrFail(id);
  });
});