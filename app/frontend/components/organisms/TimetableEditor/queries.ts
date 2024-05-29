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
      presenters {
        ...TimetableCast
      }
    }

    ... on Show {
      presenters {
        ...TimetableCast
      }
    }

    ... on SocialEvent {
      presenters {
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
    capacity

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

export const PresenterSearchQuery = graphql(
  `#graphql
  query PresenterSearch($query: String!) {
    search(query: $query, only: Person) {
      ...on PersonResult {
        person {
          ...TimetableCast
        }
      }
    }
  }
  `,
  [TimetableCastFragment]
);

export const ActivitySearchQuery = graphql(
  `#graphql
  query ActivitySearch($query: String!, $activityType: ActivityType!) {
    search(query: $query, only: Activity, activityType: $activityType) {
      ...on ActivityResult {
        activity {
          ...TimetableActivity
        }
      }
    }
  }
  `,
  [TimetableActivityFragment]
);

export const CreateActivityMutation = graphql(
  `#graphql
  mutation CreateActivity($festivalId: ID!, $type: ActivityType!, $attributes: ActivityAttributes!) {
    createActivity(festivalId: $festivalId, type: $type, attributes: $attributes) {
      activity {
        ...TimetableActivity
      }
    }
  }
  `,
  [TimetableActivityFragment]
);

export const CreateSessionsMutation = graphql(
  `#graphql
  mutation CreateSessions($attributes: MultipleSessionAttributes!) {
    createSessions(attributes: $attributes) {
      sessions {
        ...TimetableSession
      }
    }
  }
  `,
  [TimetableSessionFragment]
);
