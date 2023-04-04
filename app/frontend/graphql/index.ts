import { ApolloClient, InMemoryCache } from '@apollo/client';
import { scalarTypePolicies } from './types';

const CSRFToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

export const client = new ApolloClient({
  uri: '/graphql',
  headers: CSRFToken
    ? {
        'X-CSRF-Token': CSRFToken,
      }
    : {},
  cache: new InMemoryCache({
    possibleTypes: {
      Activity: ['Show', 'Workshop'],
    },
    typePolicies: {
      ...scalarTypePolicies,
    },
  }),
});
