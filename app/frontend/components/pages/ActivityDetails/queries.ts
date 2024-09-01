import { graphql } from '@/graphql';

export const ActivityPresenterFragment = graphql(`
  fragment ActivityPresenter on Person @_unmask {
    id
    name
    bio
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
`);

export const ActivityDetailsActivityFragment = graphql(
  `
  fragment ActivityDetailsActivity on Activity @_unmask {
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
      full

      venue {
        id
        room
        building
        address
      }
    }
  }
`,
  [ActivityPresenterFragment]
);

export const ActivityDetailsQuery = graphql(
  `
  query ActivityDetails($year: String!, $type: ActivityType!, $slug: String!) {
    festival(year: $year) {
      id

      activity(type: $type, slug: $slug) {
        ...ActivityDetailsActivity
      }
    }
  }
`,
  [ActivityDetailsActivityFragment]
);
