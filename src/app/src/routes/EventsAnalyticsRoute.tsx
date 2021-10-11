import React, { FunctionComponent } from 'react';
import {
  useParams,
} from 'react-router-dom';
import { Query } from 'react-apollo';

import styles from './EventsAnalyticsRoute.module.css';

import AnalyticsGraph from '../components/AnalyticsGraph';
import { TrackerEvent } from '../models/TrackerEvent';
import { GetTrackerEventsQuery, GetTrackerEventsQueryResponse } from '../queries/GetTrackerEventsQuery';

type EventsAnalyticsRouteParams = {
  trackerId: string;
}

const EventsAnalyticsRoute: FunctionComponent<{}> = () => {
  const { trackerId } = useParams<EventsAnalyticsRouteParams>();

  return (
    <div className={styles['container']}>
      <Query query={GetTrackerEventsQuery} variables={{ trackerId }}>
        {(response: GetTrackerEventsQueryResponse) => renderAnalyticsGraph(response)}
      </Query>
    </div>
  );
}

function renderAnalyticsGraph(response: GetTrackerEventsQueryResponse) {
  if (response.loading) {
    return <div>Loading...</div>
  }
  const events: TrackerEvent[]  = response.data.getTrackerEvents.events;
  return <AnalyticsGraph events={events} />
}

export default EventsAnalyticsRoute;