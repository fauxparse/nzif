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
  }
`);

export const RegistrationQuery = graphql(
  `
  query RegistrationQuery {
    registration {
      ...RegistrationDetails
    }
  }
`,
  [RegistrationDetailsFragment]
);
