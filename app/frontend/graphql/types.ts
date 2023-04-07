/* eslint-disable */
import { DateTime } from 'luxon';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date in ISO8601 format */
  ISODate: DateTime;
};

/** An activity that may be scheduled during the Festival */
export type Activity = {
  /** Unique ID */
  id: Scalars['ID'];
  /** Activity name */
  name: Scalars['String'];
  /** For use in URL generation */
  slug: Scalars['String'];
};

/** The state of a festival */
export enum ActivityType {
  /** Show */
  Show = 'show',
  /** Workshop */
  Workshop = 'workshop'
}

/** A boolean user preference */
export type BooleanPreference = Preference & {
  __typename: 'BooleanPreference';
  /** Preference description */
  description: Scalars['String'];
  /** Preference ID */
  id: Scalars['String'];
  /** Preference value */
  value: Scalars['Boolean'];
};

export type Credential = {
  __typename: 'Credential';
  accessToken: Scalars['String'];
  client: Scalars['String'];
  expiry: Scalars['Int'];
  tokenType: Scalars['String'];
  uid: Scalars['String'];
};

/** A festival */
export type Festival = {
  __typename: 'Festival';
  /** Activities (including unscheduled ones) */
  activities: Array<Activity>;
  /** Retrieve an activity by its type and slug */
  activity: Maybe<Activity>;
  /** The last day of the festival */
  endDate: Scalars['ISODate'];
  /** Year of the festival */
  id: Scalars['ID'];
  /** The first day of the festival */
  startDate: Scalars['ISODate'];
  /** State of the festival */
  state: FestivalState;
};


/** A festival */
export type FestivalActivitiesArgs = {
  type: InputMaybe<ActivityType>;
};


/** A festival */
export type FestivalActivityArgs = {
  slug: Scalars['String'];
  type: ActivityType;
};

/** The state of a festival */
export enum FestivalState {
  /** In the past */
  Finished = 'Finished',
  /** Happening right now */
  Happening = 'Happening',
  /** In the future */
  Upcoming = 'Upcoming'
}

/** Top-level mutation interface */
export type Mutation = {
  __typename: 'Mutation';
  /** Updates a user’s preference */
  updatePreference: Maybe<Preference>;
  userConfirmRegistrationWithToken: Maybe<UserConfirmRegistrationWithTokenPayload>;
  userLogin: Maybe<UserLoginPayload>;
  userLogout: Maybe<UserLogoutPayload>;
  userRegister: Maybe<UserRegisterPayload>;
  userResendConfirmationWithToken: Maybe<UserResendConfirmationWithTokenPayload>;
  userSendPasswordResetWithToken: Maybe<UserSendPasswordResetWithTokenPayload>;
  userUpdatePasswordWithToken: Maybe<UserUpdatePasswordWithTokenPayload>;
};


/** Top-level mutation interface */
export type MutationUpdatePreferenceArgs = {
  id: Scalars['String'];
  value: PreferenceValue;
};


/** Top-level mutation interface */
export type MutationUserConfirmRegistrationWithTokenArgs = {
  confirmationToken: Scalars['String'];
};


/** Top-level mutation interface */
export type MutationUserLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


/** Top-level mutation interface */
export type MutationUserRegisterArgs = {
  confirmUrl: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
};


/** Top-level mutation interface */
export type MutationUserResendConfirmationWithTokenArgs = {
  confirmUrl: Scalars['String'];
  email: Scalars['String'];
};


/** Top-level mutation interface */
export type MutationUserSendPasswordResetWithTokenArgs = {
  email: Scalars['String'];
  redirectUrl: Scalars['String'];
};


/** Top-level mutation interface */
export type MutationUserUpdatePasswordWithTokenArgs = {
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  resetPasswordToken: Scalars['String'];
};

/** A user preference */
export type Preference = {
  /** Preference description */
  description: Scalars['String'];
  /** Preference ID */
  id: Scalars['String'];
};

/** Value for a user preference */
export type PreferenceValue = {
  /** The new value for the preference as a boolean */
  boolean: InputMaybe<Scalars['Boolean']>;
  /** The new value for the preference as a string */
  string: InputMaybe<Scalars['String']>;
};

/** Top-level query interface */
export type Query = {
  __typename: 'Query';
  /** Find a festival by year */
  festival: Festival;
  /** User preference (if set) */
  preference: Maybe<Preference>;
  /** Current user */
  user: Maybe<User>;
};


/** Top-level query interface */
export type QueryFestivalArgs = {
  year: Scalars['String'];
};


/** Top-level query interface */
export type QueryPreferenceArgs = {
  id: Scalars['String'];
};

/** A show */
export type Show = Activity & {
  __typename: 'Show';
  /** Unique ID */
  id: Scalars['ID'];
  /** Activity name */
  name: Scalars['String'];
  /** For use in URL generation */
  slug: Scalars['String'];
};

/** A string user preference */
export type StringPreference = Preference & {
  __typename: 'StringPreference';
  /** Preference description */
  description: Scalars['String'];
  /** Preference ID */
  id: Scalars['String'];
  /** Preference value */
  value: Scalars['String'];
};

/** A user */
export type User = {
  __typename: 'User';
  /** Email address */
  email: Scalars['String'];
  /** Unique ID */
  id: Scalars['ID'];
  /** Name */
  name: Scalars['String'];
};

/** Autogenerated return type of UserConfirmRegistrationWithToken. */
export type UserConfirmRegistrationWithTokenPayload = {
  __typename: 'UserConfirmRegistrationWithTokenPayload';
  authenticatable: User;
  /** Authentication credentials. Null unless user is signed in after confirmation. */
  credentials: Maybe<Credential>;
};

/** Autogenerated return type of UserLogin. */
export type UserLoginPayload = {
  __typename: 'UserLoginPayload';
  authenticatable: User;
  credentials: Credential;
};

/** Autogenerated return type of UserLogout. */
export type UserLogoutPayload = {
  __typename: 'UserLogoutPayload';
  authenticatable: User;
};

/** Autogenerated return type of UserRegister. */
export type UserRegisterPayload = {
  __typename: 'UserRegisterPayload';
  authenticatable: User;
  /**
   * Authentication credentials. Null if after signUp resource is not active for
   * authentication (e.g. Email confirmation required).
   */
  credentials: Maybe<Credential>;
};

/** Autogenerated return type of UserResendConfirmationWithToken. */
export type UserResendConfirmationWithTokenPayload = {
  __typename: 'UserResendConfirmationWithTokenPayload';
  message: Scalars['String'];
};

/** Autogenerated return type of UserSendPasswordResetWithToken. */
export type UserSendPasswordResetWithTokenPayload = {
  __typename: 'UserSendPasswordResetWithTokenPayload';
  message: Scalars['String'];
};

/** Autogenerated return type of UserUpdatePasswordWithToken. */
export type UserUpdatePasswordWithTokenPayload = {
  __typename: 'UserUpdatePasswordWithTokenPayload';
  authenticatable: User;
  /** Authentication credentials. Resource must be signed_in for credentials to be returned. */
  credentials: Maybe<Credential>;
};

/** A workshop */
export type Workshop = Activity & {
  __typename: 'Workshop';
  /** Unique ID */
  id: Scalars['ID'];
  /** Activity name */
  name: Scalars['String'];
  /** For use in URL generation */
  slug: Scalars['String'];
};

export type GetPreferenceQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetPreferenceQuery = { __typename: 'Query', preference: { __typename: 'BooleanPreference', id: string, valueAsBoolean: boolean } | { __typename: 'StringPreference', id: string, valueAsString: string } | null };

export type UpdatePreferenceMutationVariables = Exact<{
  id: Scalars['String'];
  value: PreferenceValue;
}>;


export type UpdatePreferenceMutation = { __typename: 'Mutation', updatePreference: { __typename: 'BooleanPreference', id: string, valueAsBoolean: boolean } | { __typename: 'StringPreference', id: string, valueAsString: string } | null };

type PreferenceValueFragment_BooleanPreference_Fragment = { __typename: 'BooleanPreference', valueAsBoolean: boolean };

type PreferenceValueFragment_StringPreference_Fragment = { __typename: 'StringPreference', valueAsString: string };

export type PreferenceValueFragmentFragment = PreferenceValueFragment_BooleanPreference_Fragment | PreferenceValueFragment_StringPreference_Fragment;

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename: 'Query', user: { __typename: 'User', id: string, name: string } | null };

export type LogInMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LogInMutation = { __typename: 'Mutation', userLogin: { __typename: 'UserLoginPayload', user: { __typename: 'User', id: string, name: string }, credentials: { __typename: 'Credential', accessToken: string, client: string, uid: string } } | null };

export type LogOutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogOutMutation = { __typename: 'Mutation', userLogout: { __typename: 'UserLogoutPayload', user: { __typename: 'User', id: string } } | null };

export type SignUpMutationVariables = Exact<{
  name: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignUpMutation = { __typename: 'Mutation', userRegister: { __typename: 'UserRegisterPayload', user: { __typename: 'User', id: string, name: string }, credentials: { __typename: 'Credential', accessToken: string, client: string, uid: string } | null } | null };

export type ResetPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ResetPasswordMutation = { __typename: 'Mutation', userSendPasswordResetWithToken: { __typename: 'UserSendPasswordResetWithTokenPayload', message: string } | null };

export type HeaderQueryVariables = Exact<{ [key: string]: never; }>;


export type HeaderQuery = { __typename: 'Query', festival: { __typename: 'Festival', id: string, startDate: DateTime, endDate: DateTime } };

export const PreferenceValueFragmentFragmentDoc = gql`
    fragment PreferenceValueFragment on Preference {
  ... on StringPreference {
    valueAsString: value
  }
  ... on BooleanPreference {
    valueAsBoolean: value
  }
}
    `;
export const GetPreferenceDocument = gql`
    query GetPreference($id: String!) {
  preference(id: $id) {
    id
    ... on StringPreference {
      valueAsString: value
    }
    ... on BooleanPreference {
      valueAsBoolean: value
    }
  }
}
    `;

/**
 * __useGetPreferenceQuery__
 *
 * To run a query within a React component, call `useGetPreferenceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPreferenceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPreferenceQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPreferenceQuery(baseOptions: Apollo.QueryHookOptions<GetPreferenceQuery, GetPreferenceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPreferenceQuery, GetPreferenceQueryVariables>(GetPreferenceDocument, options);
      }
export function useGetPreferenceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPreferenceQuery, GetPreferenceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPreferenceQuery, GetPreferenceQueryVariables>(GetPreferenceDocument, options);
        }
export type GetPreferenceQueryHookResult = ReturnType<typeof useGetPreferenceQuery>;
export type GetPreferenceLazyQueryHookResult = ReturnType<typeof useGetPreferenceLazyQuery>;
export type GetPreferenceQueryResult = Apollo.QueryResult<GetPreferenceQuery, GetPreferenceQueryVariables>;
export const UpdatePreferenceDocument = gql`
    mutation UpdatePreference($id: String!, $value: PreferenceValue!) {
  updatePreference(id: $id, value: $value) {
    id
    ... on StringPreference {
      valueAsString: value
    }
    ... on BooleanPreference {
      valueAsBoolean: value
    }
  }
}
    `;
export type UpdatePreferenceMutationFn = Apollo.MutationFunction<UpdatePreferenceMutation, UpdatePreferenceMutationVariables>;

/**
 * __useUpdatePreferenceMutation__
 *
 * To run a mutation, you first call `useUpdatePreferenceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePreferenceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePreferenceMutation, { data, loading, error }] = useUpdatePreferenceMutation({
 *   variables: {
 *      id: // value for 'id'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useUpdatePreferenceMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePreferenceMutation, UpdatePreferenceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePreferenceMutation, UpdatePreferenceMutationVariables>(UpdatePreferenceDocument, options);
      }
export type UpdatePreferenceMutationHookResult = ReturnType<typeof useUpdatePreferenceMutation>;
export type UpdatePreferenceMutationResult = Apollo.MutationResult<UpdatePreferenceMutation>;
export type UpdatePreferenceMutationOptions = Apollo.BaseMutationOptions<UpdatePreferenceMutation, UpdatePreferenceMutationVariables>;
export const CurrentUserDocument = gql`
    query CurrentUser {
  user {
    id
    name
  }
}
    `;

/**
 * __useCurrentUserQuery__
 *
 * To run a query within a React component, call `useCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
      }
export function useCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
        }
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>;
export type CurrentUserLazyQueryHookResult = ReturnType<typeof useCurrentUserLazyQuery>;
export type CurrentUserQueryResult = Apollo.QueryResult<CurrentUserQuery, CurrentUserQueryVariables>;
export const LogInDocument = gql`
    mutation LogIn($email: String!, $password: String!) {
  userLogin(email: $email, password: $password) {
    user: authenticatable {
      id
      name
    }
    credentials {
      accessToken
      client
      uid
    }
  }
}
    `;
export type LogInMutationFn = Apollo.MutationFunction<LogInMutation, LogInMutationVariables>;

/**
 * __useLogInMutation__
 *
 * To run a mutation, you first call `useLogInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logInMutation, { data, loading, error }] = useLogInMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLogInMutation(baseOptions?: Apollo.MutationHookOptions<LogInMutation, LogInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogInMutation, LogInMutationVariables>(LogInDocument, options);
      }
export type LogInMutationHookResult = ReturnType<typeof useLogInMutation>;
export type LogInMutationResult = Apollo.MutationResult<LogInMutation>;
export type LogInMutationOptions = Apollo.BaseMutationOptions<LogInMutation, LogInMutationVariables>;
export const LogOutDocument = gql`
    mutation LogOut {
  userLogout {
    user: authenticatable {
      id
    }
  }
}
    `;
export type LogOutMutationFn = Apollo.MutationFunction<LogOutMutation, LogOutMutationVariables>;

/**
 * __useLogOutMutation__
 *
 * To run a mutation, you first call `useLogOutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogOutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logOutMutation, { data, loading, error }] = useLogOutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogOutMutation(baseOptions?: Apollo.MutationHookOptions<LogOutMutation, LogOutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogOutMutation, LogOutMutationVariables>(LogOutDocument, options);
      }
export type LogOutMutationHookResult = ReturnType<typeof useLogOutMutation>;
export type LogOutMutationResult = Apollo.MutationResult<LogOutMutation>;
export type LogOutMutationOptions = Apollo.BaseMutationOptions<LogOutMutation, LogOutMutationVariables>;
export const SignUpDocument = gql`
    mutation SignUp($name: String!, $email: String!, $password: String!) {
  userRegister(
    name: $name
    email: $email
    password: $password
    passwordConfirmation: $password
  ) {
    user: authenticatable {
      id
      name
    }
    credentials {
      accessToken
      client
      uid
    }
  }
}
    `;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      name: // value for 'name'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($email: String!) {
  userSendPasswordResetWithToken(email: $email, redirectUrl: "http://example.com") {
    message
  }
}
    `;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const HeaderDocument = gql`
    query Header {
  festival(year: "2023") {
    id
    startDate
    endDate
  }
}
    `;

/**
 * __useHeaderQuery__
 *
 * To run a query within a React component, call `useHeaderQuery` and pass it any options that fit your needs.
 * When your component renders, `useHeaderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHeaderQuery({
 *   variables: {
 *   },
 * });
 */
export function useHeaderQuery(baseOptions?: Apollo.QueryHookOptions<HeaderQuery, HeaderQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HeaderQuery, HeaderQueryVariables>(HeaderDocument, options);
      }
export function useHeaderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HeaderQuery, HeaderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HeaderQuery, HeaderQueryVariables>(HeaderDocument, options);
        }
export type HeaderQueryHookResult = ReturnType<typeof useHeaderQuery>;
export type HeaderLazyQueryHookResult = ReturnType<typeof useHeaderLazyQuery>;
export type HeaderQueryResult = Apollo.QueryResult<HeaderQuery, HeaderQueryVariables>;
import { datePolicy } from './policies/dateTimePolicy';

export const scalarTypePolicies = {
  Festival: { fields: { endDate: datePolicy, startDate: datePolicy } },
};
