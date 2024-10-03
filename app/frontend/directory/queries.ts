import { graphql } from '@/graphql';

export const DirectoryResultFragment = graphql(`
  fragment DirectoryResult on Person @_unmask {
    id
    name
  }
`);

export const DirectorySearchQuery = graphql(
  `
  query DirectorySearch($query: String!) {
    directorySearch(query: $query) {
      ...DirectoryResult
    }
  }
`,
  [DirectoryResultFragment]
);
