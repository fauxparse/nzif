import { graphql } from '@/graphql';

export const RegistrationSummaryFragment = graphql(`
  fragment RegistrationSummary on Registration @_unmask {
    id

    preferences {
      id
      session {
        id
        slots {
          id
        }
      }
    }

    sessions {
      id
      slots {
        id
      }
    }
  }
`);

export const MyActivityFragment = graphql(`
  fragment MyActivity on Activity @_unmask {
    id
    name
    type
    slug

    sessions {
      id
      startsAt
      endsAt
    }
  }
`);

export const NavigationMenuQuery = graphql(
  `
  query NavigationMenu {
    registration {
      ...RegistrationSummary
    }

    user {
      id

      activities {
        ...MyActivity
      }
    }
  }
`,
  [RegistrationSummaryFragment, MyActivityFragment]
);
