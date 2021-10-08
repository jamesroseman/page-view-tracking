import {
  BaseEntity, Column, Entity, PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * The website tracker which should be unique for each client website.
 */
@Entity()
export class Tracker extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: string;
}