import { graphql } from '@/graphql';
import { ActivityPresenterFragment } from '../../ActivityDetails/queries';

export const RegistrationWorkshopFragment = graphql(`
  fragment RegistrationWorkshop on Workshop @_unmask {
    id
    name
    type
    slug

    picture {
      id
      medium
      blurhash
      altText
    }

    presenters {
      id
      name
      city {
        id
        name
        traditionalNames
        country
      }
    }

    show {
      id
      name
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
`);

export const WorkshopRegistrationQuery = graphql(
  `
  query WorkshopRegistrationQuery {
    festival {
      id
      workshops {
        ...RegistrationWorkshop
      }
    }
  }
`,
  [RegistrationWorkshopFragment]
);

export const SaveWorkshopPreferencesMutation = graphql(`
  mutation SaveWorkshopPreferences($preferences: [PreferenceAttributes!]!) {
    updatePreferences(preferences: $preferences) {
      registration {
        id
        preferences {
          id
          position
          sessionId
        }
      }
    }
  }
`);

export const WorkshopDetailsQuery = graphql(
  `
  query ActivityDetails($slug: String!) {
    festival {
      id

      activity(type: Workshop, slug: $slug) {
        id
        type
        slug
        name
        description
        bookingLink

        presenters {
          ...ActivityPresenter
        }

        picture {
          id
          large
          blurhash
          altText
        }

        sessions {
          id
          startsAt
          endsAt

          venue {
            id
            room
            building
            address
          }
        }
      }
    }
  }
`,
  [ActivityPresenterFragment]
);
