import { FragmentOf, ResultOf, VariablesOf } from '@/graphql';
import { Permission } from '@/graphql/types';
import { FetchResult } from '@apollo/client';
import {
  AuthenticatedUserFragment,
  LogIn,
  LogOut,
  RequestPasswordReset,
  ResetPassword,
  SignUp,
} from './queries';

export type AuthenticatedUser = FragmentOf<typeof AuthenticatedUserFragment>;

export type AuthenticationContextType = {
  user: AuthenticatedUser | null;
  loading: boolean;
  error: string | null;
  logIn: (variables: LogInVariables) => Promise<FetchResult<ResultOf<typeof LogIn>>>;
  signUp: (variables: SignUpVariables) => Promise<FetchResult<ResultOf<typeof SignUp>>>;
  logOut: () => Promise<FetchResult<ResultOf<typeof LogOut>>>;
  requestPasswordReset: (variables: RequestPasswordResetVariables) => Promise<string | null>;
  resetPassword: (
    variables: ResetPasswordVariables
  ) => Promise<FetchResult<ResultOf<typeof ResetPassword>>>;
  hasPermission: (permission: Permission) => boolean;
};

export type LogInVariables = VariablesOf<typeof LogIn>;

export type SignUpVariables = VariablesOf<typeof SignUp>;

export type RequestPasswordResetVariables = VariablesOf<typeof RequestPasswordReset>;

export type ResetPasswordVariables = VariablesOf<typeof ResetPassword>;
