import { ResultOf, VariablesOf } from '@/graphql';
import { clearAuthenticationInfo, saveAuthenticationInfo } from '@/graphql/authentication';
import { Permission } from '@/graphql/types';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { hasPermission } from './permissions';
import { CurrentUser, LogIn, LogOut, RequestPasswordReset, ResetPassword, SignUp } from './queries';
import {
  AuthenticatedUser,
  AuthenticationContextType,
  LogInVariables,
  RequestPasswordResetVariables,
  ResetPasswordVariables,
  SignUpVariables,
} from './types';

export type {
  AuthenticatedUser,
  AuthenticationContextType,
  LogInVariables,
  SignUpVariables,
  RequestPasswordResetVariables,
};

export const AuthenticationContext = createContext<AuthenticationContextType>({
  user: null,
  loading: false,
  error: null,
  logIn: () => Promise.resolve({}),
  signUp: () => Promise.resolve({}),
  logOut: () => Promise.resolve({}),
  requestPasswordReset: () => Promise.resolve(null),
  resetPassword: () => Promise.resolve({}),
  hasPermission: () => false,
});

export const AuthenticationProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { loading: authLoading, data } = useQuery(CurrentUser);

  const client = useApolloClient();

  const [error, setError] = useState<string | null>(null);

  const logInAs = useCallback((result: ResultOf<typeof SignUp>['userRegister'] | undefined) => {
    if (!result) return;
    const { credentials, user } = result;
    if (credentials) {
      saveAuthenticationInfo(credentials);
    }
    if (user) {
      client.writeQuery({
        query: CurrentUser,
        data: {
          user,
        },
      });
    }
  }, []);

  const [doLogIn] = useMutation(LogIn, {
    update: (cache, { data }) => {
      logInAs(data?.userLogin);
    },
    onError: (error) => setError(error.message),
  });

  const logIn = useCallback((variables: LogInVariables) => {
    setError(null);
    return doLogIn({ variables });
  }, []);

  const [doSignUp] = useMutation(SignUp, {
    update: (cache, { data }) => {
      logInAs(data?.userRegister);
    },
    onError: (error) => setError(error.message),
  });

  const signUp = useCallback(
    (variables: VariablesOf<typeof SignUp>) => {
      setError(null);
      return doSignUp({ variables });
    },
    [doSignUp]
  );

  const [logOut] = useMutation(LogOut, {
    update: () => {
      client.resetStore();
      clearAuthenticationInfo();
    },
  });

  const [doRequestPasswordReset] = useMutation(RequestPasswordReset);

  const requestPasswordReset = useCallback(
    async (variables: RequestPasswordResetVariables) => {
      setError(null);
      const { data, errors, ...rest } = await doRequestPasswordReset({ variables });
      if (data) {
        return data.userSendPasswordResetWithToken?.message ?? null;
      }
      return null;
    },
    [doRequestPasswordReset]
  );

  const [doResetPassword] = useMutation(ResetPassword, {
    update: (cache, { data }) => {
      logInAs(data?.resetPasswordAndLogIn);
    },
    onError: (error) => setError(error.message),
  });

  const resetPassword = useCallback(
    (variables: ResetPasswordVariables) => doResetPassword({ variables }),
    [doResetPassword]
  );

  const loading = authLoading;

  const hasPermissionTo = useCallback(
    (permission: Permission) => hasPermission(permission, data?.user || null),
    [data]
  );

  const value = useMemo(
    () => ({
      user: data?.user ?? null,
      loading,
      error,
      logIn,
      signUp,
      logOut,
      requestPasswordReset,
      resetPassword,
      hasPermission: hasPermissionTo,
    }),
    [data, loading, error, logIn, signUp, logOut]
  );

  return (
    <AuthenticationContext.Provider value={value}>
      {authLoading ? null : children}
    </AuthenticationContext.Provider>
  );
};

export { hasPermission };

export const useAuthentication = () => useContext(AuthenticationContext);
