import 'reflect-metadata';

import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';

import HelloWorldResolver from '../resolvers/HelloWorldResolver';
import CreateTrackerResolver from '../resolvers/CreateTrackerResolver';
import TrackEventResolver from '../resolvers/TrackEventResolver';

export default async function createSchema(): Promise<GraphQLSchema> {
  return buildSchema({
    resolvers: [
      HelloWorldResolver,
      CreateTrackerResolver,
      TrackEventResolver,
    ],
  });
}
