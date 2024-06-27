import { graphql } from '@/graphql';

export const ActivityResultFragment = graphql(
  `
  fragment ActivityResult on ActivityResult @_unmask {
    activity {
      id
      name
      type
      slug
    }
  }
`
);

export const PersonResultFragment = graphql(
  `
  fragment PersonResult on PersonResult @_unmask {
    person {
      id
      name
      city {
        id
        name
        traditionalNames
        country
      }

      picture {
        id
        small
      }
    }
  }
`
);

export const VenueResultFragment = graphql(
  `
  fragment VenueResult on VenueResult @_unmask {
    venue {
      id
      room
      building
      address
    }
  }
`
);

export const PageResultFragment = graphql(
  `
  fragment PageResult on PageResult @_unmask {
    slug
  }
`
);

export const SearchResultFragment = graphql(
  `
  fragment SearchResult on SearchResult @_unmask {
    __typename
    id
    title
    description

    ... on ActivityResult {
      ...ActivityResult
    }

    ... on PersonResult {
      ...PersonResult
    }

    ... on VenueResult {
      ...VenueResult
    }

    ... on PageResult {
      ...PageResult
    }
  }
`,
  [ActivityResultFragment, PersonResultFragment, VenueResultFragment, PageResultFragment]
);

export const SearchQuery = graphql(
  `
  query Search($query: String!, $only: [SearchType!]) {
    search(query: $query, only: $only) {
      ...SearchResult
    }
  }
`,
  [SearchResultFragment]
);
