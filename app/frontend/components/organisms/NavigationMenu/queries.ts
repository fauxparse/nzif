import { graphql } from '@/graphql';

export const RegistrationSummaryQuery = graphql(`
  query RegistrationSummary {
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
    }
  }
`);
