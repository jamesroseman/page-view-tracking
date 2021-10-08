import {
  BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';

import { TrackerEvent } from './TrackerEvent';

export interface ITrackerEventCounter {
  name: string;
  value?: number;
}

/**
 * An individual event counter, which stores the value of custom parameters from the tracking event
 * for the purpose of aggregation.
 */
@Entity()
export class TrackerEventCounter extends BaseEntity implements ITrackerEventCounter {
  @PrimaryGeneratedColumn()
  readonly id: string;

  @ManyToOne((type) => TrackerEvent)
  trackerEvent: TrackerEvent;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'real' })
  value?: number;
}