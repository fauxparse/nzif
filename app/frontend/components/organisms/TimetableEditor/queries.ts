import { graphql } from '@/graphql';

export const TimetableCastFragment = graphql(`
  fragment TimetableCast on Person @_unmask {
    id
    name
  }
`);

export const TimetableActivityFragment = graphql(
  `
  fragment TimetableActivity on Activity @_unmask {
    id
    type
    name
    slug

    presenters {
      ...TimetableCast
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
  `
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
  `
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
  `
  mutation CreateActivity($type: ActivityType!, $attributes: ActivityAttributes!) {
    createActivity(type: $type, attributes: $attributes) {
      activity {
        ...TimetableActivity
      }
    }
  }
  `,
  [TimetableActivityFragment]
);

export const CreateSessionsMutation = graphql(
  `
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

export const UpdateSessionMutation = graphql(
  `
  mutation UpdateSession($id: ID!, $attributes: SessionAttributes!) {
    updateSession(id: $id, attributes: $attributes) {
      session {
        ...TimetableSession
      }
    }
  }
  `,
  [TimetableSessionFragment]
);

export const DestroySessionMutation = graphql(`
  mutation DestroySession($id: ID!) {
    destroySession(id: $id)
  }
`);

export const UpdateActivityPresentersMutation = graphql(
  `
  mutation UpdateActivityPresenters($id: ID!, $presenters: [ID!]!) {
    updateActivity(id: $id, attributes: { profileIds: $presenters }) {
      activity {
        id
        slug
        name
        type

        presenters {
          ...TimetableCast
        }
      }
    }
  }
`,
  [TimetableCastFragment]
);

export const AddActivityPresenterMutation = graphql(
  `
    mutation AddActivityPresenter($name: String!) {
      createPerson(attributes: { name: $name }) {
        profile {
          ...TimetableCast
        }
      }
    }
  `,
  [TimetableCastFragment]
);
