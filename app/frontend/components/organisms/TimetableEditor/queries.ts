import { graphql } from '@/graphql';

export const TimetableCastFragment = graphql(`
  fragment TimetableCast on Person @_unmask {
    id
    name
    picture {
      id
      small
    }
  }
`);

export const TimetableActivityFragment = graphql(
  `
  fragment TimetableActivity on Activity @_unmask {
    id
    type
    name
    slug

    ... on Workshop {
      tutors {
        ...TimetableCast
      }
    }

    ... on Show {
      directors {
        ...TimetableCast
      }
    }

    ... on SocialEvent {
      organisers {
        ...TimetableCast
      }
    }
  }
`,
  [TimetableCastFragment]
);

export const TimetableSessionFragment = graphql(
  `
  fragment TimetableSession on Session @_unmask {
    id
    startsAt
    endsAt
    activityType

    activity {
      ...TimetableActivity
    }

    venue {
      id
      room
      building
      position
    }
  }
`,
  [TimetableActivityFragment]
);

export const TimetableQuery = graphql(
  `
  query Timetable {
    festival {
      id
      startDate
      endDate

      timetable {
        id

        sessions {
          ...TimetableSession
        }
      }

      venues {
        id
        room
        building
        position
      }
    }
  }
`,
  [TimetableSessionFragment]
);
