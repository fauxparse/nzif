import { ApolloClient, ApolloLink, HttpLink, Operation, from, split } from '@apollo/client';
import { createConsumer } from '@rails/actioncable';
import { createUploadLink } from 'apollo-upload-client';
import ActionCableLink from 'graphql-ruby-client/subscriptions/ActionCableLink';
import { DateTime } from 'luxon';

import authentication from './authentication';
import createCache from './cache';

import { initGraphQLTada } from 'gql.tada';
import type { introspection } from './graphql-env.d.ts';
import {
  ActivityType,
  FestivalState,
  JobState,
  PaymentState,
  PaymentType,
  Permission,
  RegistrationPhase,
  Role,
  SearchType,
} from './types';

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    Country: string;
    DateTime: DateTime;
    ISO8601DateTime: DateTime;
    ISO8601Date: DateTime;
    ActivityType: ActivityType;
    FestivalState: FestivalState;
    JobState: JobState;
    Money: number;
    PaymentState: PaymentState;
    PaymentType: PaymentType;
    Permission: Permission;
    RegistrationPhase: RegistrationPhase;
    Role: Role;
    SearchType: SearchType;
  };
}>();

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';
export { readFragment } from 'gql.tada';

const cable = createConsumer();

const hasSubscriptionOperation = ({ query: { definitions } }: Operation) =>
  (definitions as { kind: string; operation: string }[]).some(
    ({ kind, operation }) => kind === 'OperationDefinition' && operation === 'subscription'
  );

const http = createUploadLink({ uri: '/graphql' });

const local = ApolloLink.split(hasSubscriptionOperation, new ActionCableLink({ cable }), http);

const authenticated = from([authentication, local]);

const contentful = new HttpLink({
  uri: 'https://graphql.contentful.com/content/v1/spaces/4hh9rxfdoza6',
  headers: {
    Authorization: 'Bearer yOfSEJ4VUqP4uj_dPMEfVryXFV2F_CgA2gSjMoREqc8',
  },
});

export const cache = createCache();

export const client = new ApolloClient({
  link: split(
    (operation) => operation.getContext().clientName === 'contentful',
    contentful,
    authenticated
  ),
  cache,
});
