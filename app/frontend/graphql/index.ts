import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client';

import authentication from './authentication';
import { scalarTypePolicies } from './types';

const http = new HttpLink({
  uri: '/graphql',
});

export const client = new ApolloClient({
  link: from([authentication, http]),
  cache: new InMemoryCache({
    possibleTypes: {
      Activity: ['Show', 'Workshop'],
      Preference: ['BooleanPreference', 'StringPreference'],
    },
    typePolicies: {
      ...scalarTypePolicies,
    },
  }),
});
