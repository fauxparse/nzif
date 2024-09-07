import { TimetableActivityFragment } from '@/components/organisms/TimetableEditor/queries';
import { graphql } from '@/graphql';

export const PresenterDetailsFragment = graphql(`
  fragment PresenterDetails on Person @_unmask {
    id
    name
    pronouns
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
          altText
        }

        ...on Show {
          workshop {
            ...TimetableActivity
          }
        }

        ...on Workshop {
          show {
            ...TimetableActivity
          }
        }

        presenters {
          ...PresenterDetails
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
            user {
              name
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
  [PresenterDetailsFragment, TimetableActivityFragment]
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

export const UpdateActivityMutation = graphql(
  `
  mutation AdminUpdateActivityMutation($id: ID!, $attributes: ActivityAttributes!) {
    updateActivity(id: $id, attributes: $attributes) {
      activity {
        id
        description
        picture {
          id
          large
          altText
        }

        presenters {
          ...PresenterDetails
        }

        ...on Show {
          workshop {
            ...TimetableActivity
          }
        }

        ...on Workshop {
          show {
            ...TimetableActivity
          }
        }
      }
    }
  }
`,
  [PresenterDetailsFragment, TimetableActivityFragment]
);

export const PresenterDetailsQuery = graphql(
  `
  query PresenterDetails($id: ID!) {
    person(id: $id) {
      ...PresenterDetails
    }
  }
  `,
  [PresenterDetailsFragment]
);

export const AddPresenterByNameMutation = graphql(
  `
  mutation AddPresenterByName($name: String!) {
    createPerson(attributes: { name: $name }) {
      profile {
        ...PresenterDetails
      }
    }
  }
  `,
  [PresenterDetailsFragment]
);

export const UpdatePresenterMutation = graphql(
  `
  mutation UpdatePresenter($id: ID!, $attributes: PersonAttributes!) {
    updatePerson(id: $id, attributes: $attributes) {
      profile {
        ...PresenterDetails
      }
    }
  }
  `,
  [PresenterDetailsFragment]
);
