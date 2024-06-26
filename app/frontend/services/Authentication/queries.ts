import { graphql } from '@/graphql';

export const AuthenticatedUserFragment = graphql(
  `
  fragment AuthenticatedUser on User @_unmask {
    id
    email
    permissions

    profile {
      id
      name

      picture {
        id
        small
      }
    }
  }
`
);

export const CurrentUser = graphql(
  `
  query CurrentUser {
    user {
      ...AuthenticatedUser
    }
  }
`,
  [AuthenticatedUserFragment]
);

export const LogIn = graphql(
  `
  mutation LogIn($email: String!, $password: String!) {
    userLogin(email: $email, password: $password) {
      user: authenticatable {
        ...AuthenticatedUser
      }

      credentials {
        accessToken
        client
        uid
      }
    }
  }
`,
  [AuthenticatedUserFragment]
);

export const SignUp = graphql(
  `
    mutation SignUp($name: String!, $email: String!, $password: String!) {
      userRegister(name: $name, email: $email, password: $password, passwordConfirmation: $password) {
        user: authenticatable {
          ...AuthenticatedUser
        }

        credentials {
          accessToken
          client
          uid
        }
      }
    }
  `,
  [AuthenticatedUserFragment]
);

export const LogOut = graphql(
  `
  mutation LogOut {
    userLogout {
      user: authenticatable {
        id
      }
    }
  }
`
);

export const RequestPasswordReset = graphql(`
  mutation RequestPasswordReset($email: String!, $redirectUrl: String!) {
    userSendPasswordResetWithToken(email: $email, redirectUrl: $redirectUrl) {
      message
    }
  }
`);

export const ResetPassword = graphql(
  `
  mutation ResetPassword($token: String!, $password: String!, $passwordConfirmation: String!) {
    resetPasswordAndLogIn(resetPasswordToken: $token, password: $password, passwordConfirmation: $passwordConfirmation) {
      user: authenticatable {
        ...AuthenticatedUser
      }

      credentials {
        accessToken
        client
        uid
      }
    }
  }
`,
  [AuthenticatedUserFragment]
);
