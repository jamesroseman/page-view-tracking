import React from 'react';
import { Query } from 'react-apollo';

import './App.css';

import AnalyticsGraph from './components/AnalyticsGraph';
import { TrackerEvent } from './models/TrackerEvent';
import { GetTrackerEventsQuery, GetTrackerEventsQueryResponse } from './queries/GetTrackerEventsQuery';

function App() {
  const currentTrackerId: string = '3';

  return (
    <div className="App">
      <Query query={GetTrackerEventsQuery} variables={{ trackerId: currentTrackerId }}>
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

export default App;
