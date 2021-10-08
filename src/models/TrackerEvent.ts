import {
  BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';

import { Tracker } from './Tracker';

export interface ITrackerEvent {
  timestamp: number;
  name: string;
}

/**
 * An individual event sent by a tracker.
 */
@Entity()
export class TrackerEvent extends BaseEntity implements ITrackerEvent {
  @PrimaryGeneratedColumn()
  readonly id: string;

  @ManyToOne((type) => Tracker)
  tracker: Tracker;

  @Column()
  timestamp: number;

  @Column()
  name: string;
}