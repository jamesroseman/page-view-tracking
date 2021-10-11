import { ApolloServer, ExpressContext } from 'apollo-server-express';
import { GraphQLResponse } from 'apollo-server-types';
import { Express } from 'express';
import gql from 'graphql-tag';
import { Connection, createConnection } from 'typeorm';

import { Tracker } from '../../../models/Tracker';
import { TrackerEvent } from '../../../models/TrackerEvent';
import createServer, { APIServer } from '../../server/createServer';

describe('GetTrackerEventsResolver', () => {
  let connection: Connection;
  let server: ApolloServer<ExpressContext>;
  let app: Express;
  let tracker: Tracker;

  beforeAll(async () => {
    connection = await createConnection({
      type: 'sqlite',
      database: './get_tracker_events_test.sqlite3',
      entities: [
        './src/models/**/*.ts',
      ],
      synchronize: true,
    });

    const apiServer: APIServer = await createServer();
    server = apiServer.server;
    app = apiServer.app;

    tracker = Tracker.create();
    await tracker.save();
  });

  beforeEach(async () => {
    await TrackerEvent.clear();
  });

  it('gets no events for unrecognized tracker ID', async () => {
    const response: GraphQLResponse = await server.executeOperation({
      query: gql`
        query GetTrackerEvents($trackerId: String!) {
          getTrackerEvents(trackerId: $trackerId) {
            events {
              timestamp,
              name
            }
          }
        }`,
        variables: {
          trackerId: tracker.id.toString(),
        }
    });
    expect(response?.data?.getTrackerEvents?.events).toEqual([]);
  });

  it('does get expected response', async () => {
    // Create and save tracker events.
    const trackerEvents: TrackerEvent[] = [
      {
        tracker,
        timestamp: '1',
        name: 'PageView',
      } as unknown as Partial<TrackerEvent>,
      {
        tracker,
        timestamp: '2',
        name: 'PageView',
      } as unknown as Partial<TrackerEvent>,
      {
        tracker,
        timestamp: '3',
        name: 'PageView',
      } as unknown as Partial<TrackerEvent>,
    ].map((obj) => TrackerEvent.create(obj));
    await TrackerEvent.save(trackerEvents);

    const response: GraphQLResponse = await server.executeOperation({
      query: gql`
        query GetTrackerEvents($trackerId: String!) {
          getTrackerEvents(trackerId: $trackerId) {
            events {
              timestamp,
              name
            }
          }
        }`,
        variables: {
          trackerId: tracker.id.toString(),
        }
    });
    
    const expectedData = [
      {
        timestamp: '1',
        name: 'PageView',
      },
      {
        timestamp: '2',
        name: 'PageView',
      },
      {
        timestamp: '3',
        name: 'PageView',
      }
    ];
    expect(response?.data?.getTrackerEvents?.events).toEqual(expectedData);
  });
});