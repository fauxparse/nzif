import { graphql } from '@/graphql';

export const CalendarQuery = graphql(`
query Calendar {
  calendar {
    id
    hidden
    waitlisted

    session {
      id
      startsAt
      endsAt
      activityType

      activity {
        id
        name
        presenters {
          id
          name
        }
      }

      venue {
        id
        room
        building
      }
    }
  }
}
`);

export const SetSessionVisibilityMutation = graphql(`
  mutation SetSessionVisibility($sessionId: ID!, $hidden: Boolean!) {
    setSessionVisibility(sessionId: $sessionId, hidden: $hidden) {
      id
      hidden
    }
  }
`);
