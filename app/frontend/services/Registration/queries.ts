import { graphql } from '@/graphql';

export const RegistrationDetailsFragment = graphql(`
  fragment RegistrationDetails on Registration @_unmask {
    id

    user {
      id
      email

      profile {
        id
        name
        pronouns
        phone
        city {
          id
          name
          country
          traditionalNames
        }
      }
    }

    codeOfConductAcceptedAt
    photoPermission
    showExplainer
    completedAt
    donateDiscount

    preferences {
      id
      position
      sessionId
    }

    sessions {
      id
    }

    waitlist {
      id
    }

    payments {
      id
      amount
      state
      createdAt
    }
  }
`);

export const RegistrationQuery = graphql(
  `
  query RegistrationQuery {
    festival {
      id
      registrationPhase
    }

    registration {
      ...RegistrationDetails
    }
  }
`,
  [RegistrationDetailsFragment]
);

export const LeaveSessionMutation = graphql(`
  mutation LeaveSession($sessionId: ID!) {
    removeFromSession(sessionId: $sessionId, promote: true) {
      registration {
        id
        sessions {
          id
        }
      }

      session {
        id
        full
      }
    }
  }
`);

export const LeaveWaitlistMutation = graphql(`
  mutation LeaveWaitlist($sessionId: ID!) {
    removeFromWaitlist(sessionId: $sessionId)
  }
`);

export const JoinSessionMutation = graphql(`
  mutation JoinSession($sessionId: ID!) {
    addToSession(sessionId: $sessionId) {
      registration {
        id
        sessions {
          id
        }
      }
    }
  }
`);

export const JoinWaitlistMutation = graphql(`
  mutation JoinWaitlist($sessionId: ID!) {
    addToWaitlist(sessionId: $sessionId) {
      waitlist {
        registration {
          id
          sessions {
            id
          }
        }
      }
    }
  }
`);
