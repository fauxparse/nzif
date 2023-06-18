import { ApolloClient, from, HttpLink, split } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

import authentication from './authentication';
import cache from './cache';

const http = createUploadLink({ uri: '/graphql' });

const local = from([authentication, http]);

const contentful = new HttpLink({
  uri: 'https://graphql.contentful.com/content/v1/spaces/4hh9rxfdoza6',
  headers: {
    Authorization: 'Bearer yOfSEJ4VUqP4uj_dPMEfVryXFV2F_CgA2gSjMoREqc8',
  },
});

export const client = new ApolloClient({
  link: split((operation) => operation.getContext().clientName === 'contentful', contentful, local),
  cache: cache(),
});
