import {
  Field, ObjectType, Mutation, Resolver, ArgsType, Args,
} from 'type-graphql';

import { Tracker } from '../../models/Tracker';
import { TrackerEvent } from '../../models/TrackerEvent';

@ArgsType()
export class TrackEventResolverArgs {
  @Field(() => String)
  trackerId: string;

  @Field(() => String)
  name: string;

  @Field(() => Number, { nullable: true })
  value?: number;
}

@ObjectType()
export class TrackEventResolverResponse {
  @Field(() => Boolean)
  wasSuccessful: boolean;

  @Field(() => String, { nullable: true })
  id?: string;
}

@Resolver()
export default class TrackEventResolver {
  @Mutation(() => TrackEventResolverResponse)
  async trackEvent(@Args() args: TrackEventResolverArgs): Promise<TrackEventResolverResponse> {
    const { trackerId, name, value } = args;
    
    // Fetch the tracker if possible, fail otherwise.
    const tracker: Tracker | undefined = await Tracker.findOne(trackerId);
    if (tracker === undefined) {
      return { wasSuccessful: false };
    }

    // Assemble the tracker event from the provided arguments.
    const timestamp: number = (new Date()).getTime();
    const trackerEvent: TrackerEvent = TrackerEvent.create({
      tracker,
      timestamp,
      name,
      value,
    });
    await trackerEvent.save();

    return {
      wasSuccessful: true,
      id: trackerEvent.id,
    };
  }
}
