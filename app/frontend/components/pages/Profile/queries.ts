import { graphql } from '@/graphql';

export const ProfileQuery = graphql(`
  query ProfileQuery {
    user {
      id
      email

      profile {
        id
        name
        phone

        city {
          id
          name
          traditionalNames
          country
        }

        picture {
          id
          medium
        }
      }
    }
  }
`);

export const UpdateProfileMutation = graphql(`
  mutation UpdateProfileMutation($attributes: ProfileAttributes!) {
    updateProfile(attributes: $attributes) {
      id
      name
      phone
      picture {
        id
        small
        medium
      }

      city {
        id
        name
        traditionalNames
        country
      }

      user {
        id
        email
      }
    }
  }
`);

export const UpdatePasswordMutation = graphql(`
  mutation UpdatePassword($password: String!, $passwordConfirmation: String!) {
    updateUser(attributes: { password: $password, passwordConfirmation: $passwordConfirmation }) {
      user {
        id
      }
    }
  }
`);
