import { FragmentOf, ResultOf, VariablesOf, graphql } from '@/graphql';
import { clearAuthenticationInfo, saveAuthenticationInfo } from '@/graphql/authentication';
import { FetchResult, useApolloClient, useMutation, useQuery } from '@apollo/client';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { Permission } from '@/graphql/types';
import { isEmpty, memoize } from 'lodash-es';

import PERMISSIONS from './permissions.json';

const AuthenticatedUserFragment = graphql(
  `#graphql
  fragment AuthenticatedUser on User @_unmask {
    id
    email
    permissions

    profile {
      id
      name

      picture {
        small
      }
    }
  }
`
);

const CurrentUser = graphql(
  `#graphql
  query CurrentUser {
    user {
      ...AuthenticatedUser
    }
  }
`,
  [AuthenticatedUserFragment]
);

const LogIn = graphql(
  `#graphql
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

const LogOut = graphql(
  `#graphql
  mutation LogOut {
    userLogout {
      user: authenticatable {
        id
      }
    }
  }
`
);

export type AuthenticatedUser = FragmentOf<typeof AuthenticatedUserFragment>;

export type AuthenticationContextType = {
  user: AuthenticatedUser | null;
  loading: boolean;
  error: string | null;
  logIn: (variables: LogInVariables) => Promise<FetchResult<ResultOf<typeof LogIn>>>;
  logOut: () => Promise<FetchResult<ResultOf<typeof LogOut>>>;
};

export type LogInVariables = VariablesOf<typeof LogIn>;

export const AuthenticationContext = createContext<AuthenticationContextType>({
  user: null,
  loading: false,
  error: null,
  logIn: () => Promise.resolve({}),
  logOut: () => Promise.resolve({}),
});

export const AuthenticationProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { loading: authLoading, data } = useQuery(CurrentUser);

  const client = useApolloClient();

  const [error, setError] = useState<string | null>(null);

  const [doLogIn, { loading: loggingIn }] = useMutation(LogIn, {
    update: (cache, { data }) => {
      const credentials = data?.userLogin?.credentials;
      if (credentials) {
        saveAuthenticationInfo(credentials);
      }
      if (data?.userLogin?.user) {
        cache.writeQuery({
          query: CurrentUser,
          data: {
            user: data.userLogin.user,
          },
        });
      }
    },
    onError: (error) => setError(error.message),
  });

  const logIn = useCallback((variables: LogInVariables) => {
    setError(null);
    return doLogIn({ variables });
  }, []);

  const [logOut] = useMutation(LogOut, {
    update: () => {
      client.resetStore();
      clearAuthenticationInfo();
    },
  });

  const loading = authLoading || loggingIn;

  const value = useMemo(
    () => ({
      user: data?.user ?? null,
      loading,
      error,
      logIn,
      logOut,
    }),
    [data, loading, error, logIn, logOut]
  );

  return (
    <AuthenticationContext.Provider value={value}>
      {authLoading ? null : children}
    </AuthenticationContext.Provider>
  );
};

type PermissionTree = {
  [key in Permission]?: PermissionNode;
};

type PermissionNode = {
  description: string;
  implies?: PermissionTree;
};

const unnestedPermissions = memoize(() => {
  const parents: Map<Permission, Permission[]> = new Map();
  const stack: PermissionTree[] = [PERMISSIONS];

  while (stack.length > 0) {
    const permissions = stack.shift();
    for (const id in permissions) {
      const permission = permissions[id as Permission];
      if (!permission || isEmpty(permission?.implies)) continue;
      stack.push(permission.implies);
      for (const child in permission.implies) {
        const chain = parents.get(id as Permission) || [];
        parents.set(child as Permission, [...chain, id as Permission]);
      }
    }
  }

  return parents;
});

export const hasPermission = (permission: Permission, user: AuthenticatedUser | null) => {
  if (!user || isEmpty(user?.permissions)) return false;

  if (user.permissions.includes(permission) || user.permissions.includes(Permission.Admin))
    return true;

  return user.permissions.some(
    (p) =>
      unnestedPermissions()
        .get(p as Permission)
        ?.includes(permission) ?? false
  );
};

export const useAuthentication = () => useContext(AuthenticationContext);
