import { graphql } from '@/graphql';

export const PersonQuery = graphql(`
  query Person($id: ID!) {
    person(id: $id) {
      id
      name
      bio
      picture {
        id
        medium
      }

      appearances {
        id
        role

        activity {
          id
          name
          type
          slug

          picture {
            id
            medium
          }
        }

        sessions {
          id
          startsAt
          endsAt

          venue {
            id
            room
            building
          }
        }
      }
    }
  }
`);

export const AllPresentersQuery = graphql(`
  query AllPresenters {
    festival {
      people {
        id
        name

        city {
          id
          name
          traditionalNames
          country
        }

        picture {
          id
          medium
        }
      }
    }
  }
`);
