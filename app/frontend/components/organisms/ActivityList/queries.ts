import { graphql } from '@/graphql';

export const ActivityCardPresenterFragment = graphql(`
  fragment ActivityCardPresenter on Person {
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
  fragment ActivityCardPicture on ActivityPicture {
    id
    medium
    blurhash
  }
`);

export const ActivityCardFragment = graphql(
  `
  fragment ActivityCard on Activity {
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

export const ActivitiesQuery = graphql(
  `
  query Programme($activityType: ActivityType!) {
    festival {
      id

      activities(type: $activityType) {
        ...ActivityCard
      }
    }
  }
`,
  [ActivityCardFragment]
);
