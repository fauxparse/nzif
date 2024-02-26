import { PropsWithChildren, createContext, useCallback, useContext, useState } from 'react';
import { FragmentOf, ResultOf, VariablesOf, graphql, readFragment } from '@/graphql';
import { useQuery, useMutation, useApolloClient, FetchResult } from '@apollo/client';
import { User, UserLoginPayload } from '@/graphql/types';
import { clearAuthenticationInfo, saveAuthenticationInfo } from '@/graphql/authentication';

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
  const { loading: authLoading, data, ...rest } = useQuery(CurrentUser);

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

  const logIn = (variables: LogInVariables) => {
    setError(null);
    return doLogIn({ variables });
  };

  const [logOut] = useMutation(LogOut, {
    update: () => {
      client.resetStore();
      clearAuthenticationInfo();
    },
  });

  const loading = authLoading || loggingIn;

  return (
    <AuthenticationContext.Provider
      value={{
        user: data?.user ?? null,
        loading,
        error,
        logIn,
        logOut,
      }}
    >
      {authLoading ? null : children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = () => useContext(AuthenticationContext);
