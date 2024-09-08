import { graphql } from '@/graphql';

export const AdminActivityListItemFragment = graphql(`
  fragment AdminActivityListItem on Activity @_unmask {
    id
    type
    name
    slug

    sessions {
      id
      startsAt
      endsAt
      capacity
      count
    }
  }
`);

export const AdminActivityListQuery = graphql(
  `
  query AdminActivityListQuery($activityType: ActivityType!) {
    festival {
      id
      activities(type: $activityType) {
        ...AdminActivityListItem
      }
    }
  }
`,
  [AdminActivityListItemFragment]
);
