import gql from 'graphql-tag';

import { TrackerEvent } from '../models/TrackerEvent';

export type GetTrackerEventsQueryResponse = {
  loading: boolean;
  data: {
    getTrackerEvents: {
      events: TrackerEvent[];
    }
  }
}

export const GetTrackerEventsQuery = gql`
  query GetTrackerEvents($trackerId: String!) {
    getTrackerEvents(trackerId: $trackerId) {
      events {
        timestamp,
        id,
        name,
        value,
      }
    }
  }
`;