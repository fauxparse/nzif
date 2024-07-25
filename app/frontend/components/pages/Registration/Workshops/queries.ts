import { graphql } from '@/graphql';

export const WorkshopRegistrationQuery = graphql(`
  query WorkshopRegistrationQuery {
    festival {
      workshops {
        id
        name

        presenters {
          id
          name
          city {
            id
            name
            country
          }
        }

        sessions {
          id
          startsAt
          endsAt

          slots {
            id
            startsAt
            endsAt
          }
        }
      }
    }
  }
`);
