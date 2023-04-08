import { useEffect, useMemo } from 'react';
import { ApolloError } from '@apollo/client';
import { useDebounce } from 'usehooks-ts';

import { SearchQuery, useSearchLazyQuery } from '../../../graphql/types';

type UseSearchResult = {
  loading: boolean;
  error?: ApolloError;
  results: SearchQuery['search'];
};

export const tooShort = (query: string) => !query || query.length < 3;

const useSearch = (query: string): UseSearchResult => {
  const [search, { loading, error, data }] = useSearchLazyQuery();

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (tooShort(debouncedQuery)) return;
    search({ variables: { query: debouncedQuery } });
  }, [debouncedQuery, search]);

  const results = useMemo(
    () => (!tooShort(debouncedQuery) && data?.search) || [],
    [debouncedQuery, data]
  );

  return {
    loading: loading || debouncedQuery !== query,
    error,
    results,
  };
};

export default useSearch;
