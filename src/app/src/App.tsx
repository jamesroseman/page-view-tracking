import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import styles from './App.module.css';

import EventsAnalyticsRoute from './routes/EventsAnalyticsRoute';
import HomePageRoute from './routes/HomePageRoute';

function App() {
  // const currentTrackerId: string = '3';

  return (
    <div className={styles['container']}>
      <Router>
        <Switch>
          <HomePageRoute exact={true} path={'/'} />
          
          <Route path='/events/:trackerId'>
            <EventsAnalyticsRoute />
          </Route>

          <Redirect from={'*'} to={'/'} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
