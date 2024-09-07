import { graphql } from '@/graphql';

export const SessionRegistrationFragment = graphql(`
  fragment SessionRegistration on Registration @_unmask {
    id
    user {
      id
      name
    }
    sessions {
      id
      startsAt
      endsAt
      activity {
        id
        name
      }
    }
  }
`);

export const WorkshopSessionFragment = graphql(
  `
  fragment WorkshopSession on Session @_unmask {
    id
    startsAt
    endsAt
    capacity

    participants {
      ...SessionRegistration
    }

    waitlist {
        ...SessionRegistration
    }
  }
`,
  [SessionRegistrationFragment]
);

export const WorkshopWithSessionsFragment = graphql(
  `
  fragment WorkshopWithSessions on Activity @_unmask {
    id
    slug
    name

    sessions {
      ...WorkshopSession
    }
  }
`,
  [WorkshopSessionFragment]
);

export const WorkshopSessionQuery = graphql(
  `
  query WorkshopSession($slug: String!) {
    festival {
      activity(type: Workshop, slug: $slug) {
        ...WorkshopWithSessions
      }
    }
  }
`,
  [WorkshopWithSessionsFragment]
);

export const AddToSessionMutation = graphql(
  `
  mutation AddToSession($sessionId: ID!, $registrationId: ID!) {
    addToSession(sessionId: $sessionId, registrationId: $registrationId) {
      registration {
        ...SessionRegistration
      }
    }
  }
`,
  [SessionRegistrationFragment]
);

export const AddToWaitlistMutation = graphql(
  `
  mutation AddToWaitlist($sessionId: ID!, $registrationId: ID!, $position: Int) {
    addToWaitlist(sessionId: $sessionId, registrationId: $registrationId, position: $position) {
      waitlist {
        id
        position
        registration {
          ...SessionRegistration
        }
      }
    }
  }
`,
  [SessionRegistrationFragment]
);

export const RemoveFromSessionMutation = graphql(
  `
  mutation RemoveFromSession($sessionId: ID!, $registrationId: ID!) {
    removeFromSession(sessionId: $sessionId, registrationId: $registrationId) {
      registration {
        ...SessionRegistration
      }
    }
  }
`,
  [SessionRegistrationFragment]
);

export const RemoveFromWaitlistMutation = graphql(`
  mutation RemoveFromWaitlist($sessionId: ID!, $registrationId: ID!) {
    removeFromWaitlist(sessionId: $sessionId, registrationId: $registrationId)
  }
`);
