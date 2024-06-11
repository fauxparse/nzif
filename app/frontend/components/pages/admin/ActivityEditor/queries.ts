import { graphql } from '@/graphql';

export const PresenterDetailsFragment = graphql(`
  fragment PresenterDetails on Person @_unmask {
    id
    name
    bio
    picture {
      id
      medium
    }
    city {
      id
      name
      traditionalNames
      country
    }
  }
`);

export const ActivityDetailsQuery = graphql(
  `
  query AdminActivityDetailsQuery($year: String!, $type: ActivityType!, $slug: String!) {
    festival(year: $year) {
      id

      activity(type: $type, slug: $slug) {
        id
        name
        slug
        type
        description

        picture {
          id
          large
        }

        ...on Workshop {
          tutors {
            ...PresenterDetails
          }
        }

        ...on Show {
          directors {
            ...PresenterDetails
          }
        }

        sessions {
          id
          startsAt
          endsAt
          capacity


          participants {
            id

            user {
              id
              name
            }
          }

          waitlist {
            id
            position

            registration {
              id
              user {
                name
              }
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
  }
`,
  [PresenterDetailsFragment]
);

export const UpdateActivityDetailsMutation = graphql(`
  mutation AdminUpdateActivityDetailsMutation($id: ID!, $attributes: ActivityAttributes!) {
    updateActivity(id: $id, attributes: $attributes) {
      activity {
        id
        name
        slug
        type
      }
    }
  }
`);

export const UpdateActivityMutation = graphql(`
  mutation AdminUpdateActivityMutation($id: ID!, $attributes: ActivityAttributes!) {
    updateActivity(id: $id, attributes: $attributes) {
      activity {
        id
        description
        picture {
          id
          large
        }

        ...on Workshop {
          tutors {
            id
            name
            picture {
              id
              small
            }
          }
        }

        ...on Show {
          directors {
            id
            name
          }
        }
      }
    }
  }
`);
