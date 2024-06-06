import { graphql } from '@/graphql';

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
`
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
