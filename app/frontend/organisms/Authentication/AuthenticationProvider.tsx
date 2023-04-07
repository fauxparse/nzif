import React, { createContext, PropsWithChildren, useContext } from 'react';
import { useApolloClient } from '@apollo/client';

import { saveAuthenticationInfo } from '../../graphql/authentication';
import {
  useCurrentUserQuery,
  useLogInMutation,
  useLogOutMutation,
  User,
  useResetPasswordMutation,
  useSignUpMutation,
} from '../../graphql/types';

export type AuthenticatedUser = Pick<User, 'id' | 'name'>;

type AuthenticationContextShape = {
  loading: boolean;
  user: AuthenticatedUser | null;
  logIn: (variables: { email: string; password: string }) => Promise<{ user: AuthenticatedUser }>;
  logOut: () => Promise<boolean>;
  signUp: (variables: {
    name: string;
    email: string;
    password: string;
  }) => Promise<{ user: AuthenticatedUser }>;
  resetPassword: (variables: { email: string }) => Promise<boolean>;
};

const AuthenticationContext = createContext({} as AuthenticationContextShape);

export const useAuthentication = () => useContext(AuthenticationContext);

const AuthenticationProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { data, loading } = useCurrentUserQuery();

  const user = data?.user || null;

  const client = useApolloClient();

  const [doLogIn] = useLogInMutation({
    update: (_, { data }) => {
      const { credentials } = data?.userLogin || {};
      if (credentials) {
        saveAuthenticationInfo(credentials);
      }
      client.resetStore();
    },
  });

  const [doLogOut] = useLogOutMutation();

  const [doSignUp] = useSignUpMutation({
    update: (_, { data }) => {
      const { credentials } = data?.userRegister || {};
      if (credentials) {
        saveAuthenticationInfo(credentials);
      }
    },
    refetchQueries: ['CurrentUser'],
  });

  const [doResetPassword] = useResetPasswordMutation();

  const logIn = (variables) =>
    doLogIn({ variables }).then(
      ({ data }) =>
        new Promise<{ user: AuthenticatedUser }>((resolve, reject) => {
          const { user, credentials } = data?.userLogin || {};
          if (user && credentials) {
            resolve({ user });
          } else {
            reject();
          }
        })
    );

  const signUp = (variables) =>
    doSignUp({ variables }).then(
      ({ data }) =>
        new Promise<{ user: AuthenticatedUser }>((resolve, reject) => {
          const { user, credentials } = data?.userRegister || {};
          if (user && credentials) {
            resolve({ user });
          } else {
            reject();
          }
        })
    );

  const logOut = () =>
    doLogOut().then(() => {
      client.resetStore();
      return true;
    });

  const resetPassword = (variables) => doResetPassword({ variables }).then(() => true);

  return (
    <AuthenticationContext.Provider value={{ loading, user, logIn, logOut, signUp, resetPassword }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;

export const MockAuthenticationProvider = AuthenticationContext.Provider;
