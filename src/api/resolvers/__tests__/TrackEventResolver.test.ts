import { ApolloServer, ExpressContext } from 'apollo-server-express';
import { GraphQLResponse } from 'apollo-server-types';
import { Express } from 'express';
import gql from 'graphql-tag';
import { Connection, createConnection } from 'typeorm';

import { Tracker } from '../../../models/Tracker';
import { TrackerEvent } from '../../../models/TrackerEvent';
import createServer, { APIServer } from '../../server/createServer';

describe('TrackEventResolver', () => {
  let connection: Connection;
  let server: ApolloServer<ExpressContext>;
  let app: Express;
  let tracker: Tracker;

  beforeAll(async () => {
    connection = await createConnection({
      type: 'sqlite',
      database: './track_event_resolver_test.sqlite3',
      entities: [
        './src/models/**/*.ts',
      ],
      synchronize: true,
    });
    tracker = Tracker.create();
    await tracker.save();
  });

  beforeEach(async () => {
    const apiServer: APIServer = await createServer();
    server = apiServer.server;
    app = apiServer.app;
  });

  afterAll(async () => {
    await connection.close();
  });

  it('fails to track event if provided invalid tracker id', async () => {
    const response: GraphQLResponse = await server.executeOperation({
      query: gql`
        mutation TrackEvent($trackerId: String!, $name: String!, $value: Float) {
          trackEvent(trackerId: $trackerId, name: $name, value: $value) {
            wasSuccessful,
            id
          }
        }`,
        variables: {
          trackerId: 'invalid tracker id',
          name: 'PageView',
        }
    });
    expect(response?.data?.trackEvent?.wasSuccessful).toBe(false);
  });

  it('successfully tracks event when provided correct arguments', async () => {
    const response: GraphQLResponse = await server.executeOperation({
      query: gql`
        mutation TrackEvent($trackerId: String!, $name: String!, $value: Float) {
          trackEvent(trackerId: $trackerId, name: $name, value: $value) {
            wasSuccessful,
            id
          }
        }`,
        variables: {
          trackerId: tracker.id.toString(),
          name: 'PageView',
        }
    });
    expect(response?.data?.trackEvent?.wasSuccessful).toBe(true);
    const id: string | undefined = response?.data?.trackEvent?.id;
    if (id === undefined) {
      expect(id).not.toBeUndefined();
    }
    // This find call will fail if the TrackerEvent has not been successfully created and stored.
    await TrackerEvent.findOneOrFail(id);
  });
});