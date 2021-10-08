import {
  Field, ObjectType, Mutation, Resolver,
} from 'type-graphql';

import { Tracker } from '../../models/Tracker';

@ObjectType()
export class CreateTrackerResolverResponse {
  @Field(() => String)
  id: string;
}

@Resolver()
export default class CreateTrackerResolver {
  @Mutation(() => CreateTrackerResolverResponse)
  async createTracker(): Promise<CreateTrackerResolverResponse> {
    const newTracker: Tracker = Tracker.create();
    await newTracker.save();
    return {
      id: newTracker.id,
    }
  }
}
