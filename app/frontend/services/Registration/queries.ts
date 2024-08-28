import { graphql } from '@/graphql';

export const RegistrationDetailsFragment = graphql(`
  fragment RegistrationDetails on Registration @_unmask {
    id

    user {
      id
      email

      profile {
        id
        name
        pronouns
        phone
        city {
          id
          name
          country
          traditionalNames
        }
      }
    }

    codeOfConductAcceptedAt
    photoPermission
    showExplainer

    preferences {
      id
      position
      sessionId
    }
  }
`);

export const RegistrationQuery = graphql(
  `
  query RegistrationQuery {
    festival {
      id
      registrationPhase
    }

    registration {
      ...RegistrationDetails
    }
  }
`,
  [RegistrationDetailsFragment]
);
