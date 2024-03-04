import { graphql } from '@/graphql';

export default graphql(`
  query Search($query: String!, $only: [SearchType!]) {
    search(query: $query, only: $only) {
      id
      title
      description
      url

      ... on ActivityResult {
        activity {
          id
          name
          type
          slug
        }
      }

      ... on PersonResult {
        person {
          id
          name
          city {
            name
            traditionalName
          }
          country {
            name
            traditionalName
          }

          picture {
            id
            small
          }
        }
      }

      ... on VenueResult {
        venue {
          id
          room
          building
          address
        }
      }
    }
  }
`);
