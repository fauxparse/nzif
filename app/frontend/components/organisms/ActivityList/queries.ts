import { ActivityCardFragment } from '@/components/molecules/ActivityCard/queries';
import { graphql } from '@/graphql';

export const ActivitiesQuery = graphql(
  `
  query Programme($activityType: ActivityType!) {
    festival {
      id

      activities(type: $activityType) {
        ...ActivityCard
      }
    }
  }
`,
  [ActivityCardFragment]
);
