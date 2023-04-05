import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { scalarTypePolicies } from './types';
import authentication from './authentication';

const http = new HttpLink({
  uri: '/graphql',
});

export const client = new ApolloClient({
  link: from([authentication, http]),
  cache: new InMemoryCache({
    possibleTypes: {
      Activity: ['Show', 'Workshop'],
    },
    typePolicies: {
      ...scalarTypePolicies,
    },
  }),
});
