import { graphql } from '@/graphql';

const ProfileDetailsFragment = graphql(`
  fragment ProfileDetails on Person @_unmask {
    id
    name
    pronouns
    phone

    city {
      id
      name
      traditionalNames
      country
    }

    picture {
      id
      small
      medium
    }
  }
`);

export const ProfileQuery = graphql(
  `
  query ProfileQuery {
    user {
      id
      email

      profile {
        ...ProfileDetails
      }
    }
  }
`,
  [ProfileDetailsFragment]
);

export const UpdateProfileMutation = graphql(
  `
  mutation UpdateProfileMutation($attributes: ProfileAttributes!) {
    updateProfile(attributes: $attributes) {
      ...ProfileDetails

      user {
        id
        email
      }
    }
  }
`,
  [ProfileDetailsFragment]
);

export const UpdatePasswordMutation = graphql(`
  mutation UpdatePassword($password: String!, $passwordConfirmation: String!) {
    updateUser(attributes: { password: $password, passwordConfirmation: $passwordConfirmation }) {
      user {
        id
      }
    }
  }
`);
