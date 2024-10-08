import { graphql } from '@/graphql';

export const RegistrationsRowFragment = graphql(`
  fragment RegistrationsRow on Registration @_unmask {
    id
    user {
      id
      name
      email
      profile {
        id
      }
    }
    completedAt
    photoPermission
    preferences {
      id
      position
      session {
        id
        slots {
          id
          startsAt
          endsAt
        }
      }
    }
    sessions {
      id
    }
  }
`);

export const RegistrationsQuery = graphql(
  `
  query Registrations {
    festival {
      id
      registrationPhase

      registrations {
        ...RegistrationsRow
      }

      workshops {
        id
        sessions {
          id
          capacity
        }
      }
    }
  }
`,
  [RegistrationsRowFragment]
);

export const RegistrationDetailsQuery = graphql(`
  query RegistrationDetails($id: ID!) {
    registration(id: $id) {
      id

      preferences {
        id
        position

        session {
          id

          slots {
            startsAt
            endsAt
          }

          activity {
            id
            name
          }
        }
      }
    }
  }
`);
