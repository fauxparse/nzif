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

/** A festival */
export type Festival = {
  __typename: 'Festival';
  /** The last day of the festival */
  endDate: Scalars['ISODate'];
  /** Year of the festival */
  id: Scalars['ID'];
  /** The first day of the festival */
  startDate: Scalars['ISODate'];
  /** State of the festival */
  state: FestivalState;
};

/** The state of a festival */
export enum FestivalState {
  /** In the past */
  Finished = 'finished',
  /** Happening right now */
  Happening = 'happening',
  /** In the future */
  Upcoming = 'upcoming'
}

/** Top-level mutation interface */
export type Mutation = {
  __typename: 'Mutation';
  /** An example field added by the generator */
  testField: Scalars['String'];
};

/** Top-level query interface */
export type Query = {
  __typename: 'Query';
  /** Find a festival by year */
  festival: Festival;
};


/** Top-level query interface */
export type QueryFestivalArgs = {
  year: Scalars['String'];
};

export type TestQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type TestQueryQuery = { __typename: 'Query', festival: { __typename: 'Festival', id: string, startDate: DateTime, endDate: DateTime, state: FestivalState } };


export const TestQueryDocument = gql`
    query TestQuery {
  festival(year: "2023") {
    id
    startDate
    endDate
    state
  }
}
    `;

/**
 * __useTestQueryQuery__
 *
 * To run a query within a React component, call `useTestQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useTestQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTestQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useTestQueryQuery(baseOptions?: Apollo.QueryHookOptions<TestQueryQuery, TestQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TestQueryQuery, TestQueryQueryVariables>(TestQueryDocument, options);
      }
export function useTestQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TestQueryQuery, TestQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TestQueryQuery, TestQueryQueryVariables>(TestQueryDocument, options);
        }
export type TestQueryQueryHookResult = ReturnType<typeof useTestQueryQuery>;
export type TestQueryLazyQueryHookResult = ReturnType<typeof useTestQueryLazyQuery>;
export type TestQueryQueryResult = Apollo.QueryResult<TestQueryQuery, TestQueryQueryVariables>;
import { datePolicy } from './policies/dateTimePolicy';

export const scalarTypePolicies = {
  Festival: { fields: { endDate: datePolicy, startDate: datePolicy } },
};
