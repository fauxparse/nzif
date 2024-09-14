import { graphql } from '@/graphql';

export const RegistrationSummaryQuery = graphql(`
  query RegistrationSummary {
    festival {
      id
      registrationPhase
    }

    registration {
      id

      preferences {
        id
        session {
          id
          slots {
            id
          }
        }
      }

      sessions {
        id
        slots {
          id
        }
      }
    }
  }
`);
