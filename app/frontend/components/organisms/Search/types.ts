import { ResultOf } from 'gql.tada';
import { SearchQuery } from './queries';

export type SearchResult = ResultOf<typeof SearchQuery>['search'][number];

type TypedSearchResult<T extends SearchResult['__typename']> = Extract<
  SearchResult,
  { __typename: T }
>;

export type ActivityResult = TypedSearchResult<'ActivityResult'>;

export type PersonResult = TypedSearchResult<'PersonResult'>;

export type VenueResult = TypedSearchResult<'VenueResult'>;

export type PageResult = TypedSearchResult<'PageResult'>;
