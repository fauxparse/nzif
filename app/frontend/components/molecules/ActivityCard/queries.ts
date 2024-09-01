import { graphql } from '@/graphql';

export const ActivityCardPresenterFragment = graphql(`
  fragment ActivityCardPresenter on Person @_unmask {
    id
    name
    city {
      id
      name
      traditionalNames
      country
    }
  }
`);

export const ActivityCardPictureFragment = graphql(`
  fragment ActivityCardPicture on ActivityPicture @_unmask {
    id
    medium
    blurhash
    altText
  }
`);

export const ActivityCardFragment = graphql(
  `
  fragment ActivityCard on Activity @_unmask {
    id
    name
    type
    slug

    picture {
      ...ActivityCardPicture
    }

    presenters {
      ...ActivityCardPresenter
    }

    sessions {
      id
      startsAt
      endsAt
      full
    }

    ...on Workshop {
      show {
        id
      }
    }

    ...on Show {
      workshop {
        id
      }
    }
  }
`,
  [ActivityCardPresenterFragment, ActivityCardPictureFragment]
);
