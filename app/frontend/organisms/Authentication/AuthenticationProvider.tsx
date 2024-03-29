import { useApolloClient } from '@apollo/client';
import PERMISSIONS from '@config/permissions.yml';
import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react';

import { ROUTES } from '@/Routes';
import { clearAuthenticationInfo, saveAuthenticationInfo } from '@/graphql/authentication';
import {
  AuthenticatedUserFragment,
  CurrentUserQuery,
  LogInMutationVariables,
  Permission,
  SignUpMutationVariables,
  useCurrentUserQuery,
  useLogInMutation,
  useLogOutMutation,
  useResetPasswordMutation,
  useSignUpMutation,
} from '@/graphql/types';

type AuthenticationContextShape = {
  loading: boolean;
  user: CurrentUserQuery['user'];
  logIn: (variables: {
    email: string;
    password: string;
  }) => Promise<{ user: AuthenticatedUserFragment }>;
  logOut: () => Promise<boolean>;
  signUp: (variables: {
    name: string;
    email: string;
    password: string;
  }) => Promise<{ user: AuthenticatedUserFragment }>;
  resetPassword: (variables: { email: string }) => Promise<boolean>;
  hasPermission: (permission: Permission) => boolean;
};

const AuthenticationContext = createContext({
  loading: true,
  user: null,
  logIn: () => Promise.reject(),
  logOut: () => Promise.reject(),
  signUp: () => Promise.reject(),
  resetPassword: () => Promise.reject(),
  hasPermission: () => false,
} as AuthenticationContextShape);

export const useAuthentication = () => useContext(AuthenticationContext);

const descendants = (() => {
  const buildDescendants = (config: typeof PERMISSIONS, map: Map<Permission, Set<Permission>>) => {
    for (const [key, value] of Object.entries(config)) {
      const permission = key as Permission;
      const children = (value.implies || {}) as Record<Permission, typeof PERMISSIONS>;
      buildDescendants(children, map);
      map.set(
        permission,
        new Set([
          permission,
          ...Object.keys(children).flatMap((k) => [...(map.get(k as Permission) || [])]),
        ])
      );
    }
    return map;
  };
  return buildDescendants(PERMISSIONS, new Map<Permission, Set<Permission>>());
})();

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

  const [doLogOut] = useLogOutMutation({});

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

  const logIn = (variables: LogInMutationVariables) =>
    doLogIn({ variables }).then(
      ({ data }) =>
        new Promise<{ user: AuthenticatedUserFragment }>((resolve, reject) => {
          const { user, credentials } = data?.userLogin || {};
          if (user && credentials) {
            resolve({ user });
          } else {
            reject();
          }
        })
    );

  const signUp = (variables: SignUpMutationVariables) =>
    doSignUp({ variables }).then(
      ({ data }) =>
        new Promise<{ user: AuthenticatedUserFragment }>((resolve, reject) => {
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
      clearAuthenticationInfo();
      return true;
    });

  const resetPassword = (variables: { email: string }) => {
    const redirect = new URL(ROUTES.PASSWORD.path, window.location.origin).toString();
    return doResetPassword({ variables: { ...variables, redirect } }).then(() => true);
  };

  const permissions = useMemo<Set<Permission>>(() => {
    const set = new Set<Permission>();
    if (user?.permissions) {
      return new Set(user.permissions.flatMap((p) => [...(descendants.get(p) || [])]));
    }
    return set;
  }, [user?.permissions]);

  const hasPermission = (permission: Permission) => {
    return permissions.has(permission);
  };

  return (
    <AuthenticationContext.Provider
      value={{ loading, user, logIn, logOut, signUp, resetPassword, hasPermission }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;

export const MockAuthenticationProvider = AuthenticationContext.Provider;
