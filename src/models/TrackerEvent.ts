import {
  BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

import { Tracker } from './Tracker';

export interface ITrackerEvent {
  timestamp: number;
  name: string;
  value?: number;
}

/**
 * An individual event sent by a tracker.
 */
@ObjectType()
@Entity()
export class TrackerEvent extends BaseEntity implements ITrackerEvent {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id: string;

  @ManyToOne((type) => Tracker)
  tracker: Tracker;

  @Field(() => Number)
  @Column()
  timestamp: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true, type: 'real' })
  value?: number;
}