import { graphql } from '@/graphql';

export const PersonQuery = graphql(`
  query Person($id: ID!) {
    person(id: $id) {
      id
      name
      pronouns
      bio
      picture {
        id
        large
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
            blurhash
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
      id

      people {
        id
        name
        pronouns

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
