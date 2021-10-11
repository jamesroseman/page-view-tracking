import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export type CreateTrackerMutationResponse = {
  loading: boolean;
  data: {
    createTracker: {
      id: string;
    }
  }
}

export const CreateTrackerMutation: DocumentNode = gql`
  mutation CreateTracker {
    createTracker {
      id
    }
  }
`;