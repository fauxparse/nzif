import { graphql } from '@/graphql';

export const CalendarQuery = graphql(`
  query Calendar {
    calendar {
      id
      hidden
      waitlisted
      full

      feedback {
        id
      }

      session {
        id
        startsAt
        endsAt
        activityType

        activity {
          id
          name
          slug
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

export const SubmitWorkshopFeedbackMutation = graphql(`
  mutation SubmitWorkshopFeedback($sessionId: ID!, $attributes: FeedbackAttributes!) {
    saveFeedback(sessionId: $sessionId, attributes: $attributes) {
      feedback {
        id
      }
    }
  }
`);
