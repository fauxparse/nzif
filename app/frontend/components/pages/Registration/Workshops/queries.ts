import { graphql } from '@/graphql';

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
      workshops {
        ...RegistrationWorkshop
      }
    }
  }
`,
  [RegistrationWorkshopFragment]
);
