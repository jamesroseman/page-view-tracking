import React from 'react';
import { Query } from 'react-apollo';

import './App.css';
import { TrackerEvent } from './models/TrackerEvent';
import { GetTrackerEventsQuery, GetTrackerEventsQueryResponse } from './queries/GetTrackerEventsQuery';

function App() {
  const currentTrackerId: string = '3';

  return (
    <div className="App">
      <Query query={GetTrackerEventsQuery} variables={{ trackerId: currentTrackerId }}>
        {(response: GetTrackerEventsQueryResponse) => renderTrackerEvents(response)}
      </Query>
    </div>
  );
}

function renderTrackerEvents(response: GetTrackerEventsQueryResponse) {
  if (response.loading) {
    return <div>Loading...</div>
  }
  return (
    <ul>
      {response.data.getTrackerEvents.events.map((event: TrackerEvent) => (
        <li>{event.timestamp} - {event.id} {event.name}</li>
      ))}
    </ul>
  )
}

export default App;
