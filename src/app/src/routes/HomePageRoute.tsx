import React, { FunctionComponent, useState } from 'react';
import { Route } from 'react-router-dom';
import { useMutation } from 'react-apollo';

import styles from './HomePageRoute.module.css';

import Button from '../components/ui/Button';
import { CreateTrackerMutation } from '../queries/CreateTrackerMutation';


type HomePageRouteProps = {
  path: string;
  exact?: boolean;
}

const HomePageRoute: FunctionComponent<HomePageRouteProps> = ({
  path,
  exact = false,
}) => {
  const [trackerId, setTrackerId] = useState('');
  const [createTrackerMut, createTrackerResponse] = useMutation(CreateTrackerMutation);
  const { loading, data } = createTrackerResponse;

  function getId(): string {
    if (loading) {
      return '';
    } else {
      return data?.createTracker?.id ?? '-';
    }
  }

  return (
    <Route exact={exact} path={path}>
      <div className={styles['container']}>
        <div className={styles['input-tracker-container']}>
          <div className={styles['input-tracker-title']}>
            View Analytics for Tracker
          </div>
          <div className={styles['input-tracker-input']}>
            <input className={styles['input-tracker-input']} type={'text'} placeholder={'Tracker ID'} onChange={(event) => setTrackerId(event.target.value)} />
            <div className={styles['input-tracker-btn']}>
              <a href={`/events/${trackerId}`}>
                <Button isActive={false} label={'Submit'} />
              </a>
            </div>
          </div>
        </div>

        <div className={styles['register-tracker-container']}>
          <div className={styles['register-tracker-title']}>
            Register New Tracker
          </div>
          <div className={styles['register-tracker-output-container']}>
            <div className={styles['register-tracker-output']}>Your Tracker ID is:&nbsp;<span className={styles['tracker-id']}>{getId()}</span></div>
            <div className={styles['register-tracker-btn']}>
              <Button isActive={false} label={'Register'} onClick={() => createTrackerMut()} />
            </div>
          </div>
        </div>
      </div>
    </Route>
  );
}

export default HomePageRoute;