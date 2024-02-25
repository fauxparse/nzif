import { PropsWithChildren, createContext, useCallback, useContext, useState } from 'react';
import { FragmentOf, ResultOf, VariablesOf, graphql, readFragment } from '@/graphql';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { User } from '@/graphql/types';
import { saveAuthenticationInfo } from '@/graphql/authentication';

const AuthenticatedUser = graphql(
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
  [AuthenticatedUser]
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
  [AuthenticatedUser]
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

type AuthenticationContextType = {
  user: FragmentOf<typeof AuthenticatedUser> | null;
  loading: boolean;
  error: string | null;
  logIn: (variables: LogInVariables) => void;
};

export type LogInVariables = VariablesOf<typeof LogIn>;

const AuthenticationContext = createContext<AuthenticationContextType>({
  user: null,
  loading: false,
  error: null,
  logIn: () => void 0,
});

export const AuthenticationProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { loading: authLoading, data } = useQuery(CurrentUser);

  const client = useApolloClient();

  const [error, setError] = useState<string | null>(null);

  const [doLogIn, { loading: loggingIn }] = useMutation(LogIn, {
    update(cache, { data }) {
      const credentials = data?.userLogin?.credentials;
      if (credentials) {
        saveAuthenticationInfo(credentials);
      }
      client.resetStore();
    },
    onError: (error) => setError(error.message),
  });

  const logIn = (variables: LogInVariables) => {
    setError(null);
    doLogIn({ variables });
  };

  const loading = authLoading || loggingIn;

  return (
    <AuthenticationContext.Provider value={{ user: data?.user ?? null, loading, error, logIn }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = () => useContext(AuthenticationContext);
