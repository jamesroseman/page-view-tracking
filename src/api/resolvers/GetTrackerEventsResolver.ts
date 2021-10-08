import {
  Args,
  ArgsType, Field, ObjectType, Query, Resolver,
} from 'type-graphql';
import { TrackerEvent } from '../../models/TrackerEvent';

@ArgsType()
export class GetTrackerEventsResolverArgs {
  @Field(() => String)
  trackerId: string;
}

@ObjectType()
class GetTrackerEventsResolverResponse {
  @Field(() => [TrackerEvent])
  events: TrackerEvent[];
}

@Resolver()
export default class HelloWorldResolver {
  @Query(() => GetTrackerEventsResolverResponse)
  async getTrackerEvents(@Args() args: GetTrackerEventsResolverArgs): Promise<GetTrackerEventsResolverResponse> {
    const { trackerId } = args;
    const events: TrackerEvent[] = await TrackerEvent.find({
      relations: ['tracker'],
      where: {
        tracker: {
          id: trackerId,
        }
      }
    });
    return {
      events,
    };
  }
}
