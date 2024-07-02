import ActivityIcon from '@/icons/ActivityIcon';
import LocationIcon from '@/icons/LocationIcon';
import PageIcon from '@/icons/PageIcon';
import SearchIcon from '@/icons/SearchIcon';
import UserIcon from '@/icons/UserIcon';
import { useLazyQuery } from '@apollo/client';
import { LinkProps, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SearchQuery } from './queries';
import { SearchResult } from './types';

type UseSearchOptions = {
  maxResults?: number;
  onResultClick?: (result: MarkedUpSearchResult) => void;
};

export type MarkedUpSearchResult = {
  id: SearchResult['id'];
  result: SearchResult;
  link: LinkProps;
  icon: React.ReactNode;
};

export const useSearch = ({ maxResults = 5, onResultClick }: UseSearchOptions = {}) => {
  const [query, setQuery] = useState('');

  const [doSearch] = useLazyQuery(SearchQuery, {
    fetchPolicy: 'network-only',
  });

  const [results, setResults] = useState<MarkedUpSearchResult[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);

  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setActiveIndex(0);
      return;
    }

    timer.current = window.setTimeout(() => {
      doSearch({ variables: { query: query.trim() } }).then(({ data }) => {
        setResults(
          (data?.search || []).slice(0, maxResults).map((result) => ({
            result,
            id: result.id,
            link: linkProps(result),
            icon: <SearchResultIcon result={result} />,
          }))
        );
        setActiveIndex(0);
      });
    }, 500);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query, maxResults]);

  const reset = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  const previousResult = useCallback(() => {
    setActiveIndex((i) => Math.max(i - 1, 0));
  }, [results]);

  const nextResult = useCallback(() => {
    setActiveIndex((i) => Math.min(i + 1, results.length - 1));
  }, [results]);

  const activeResult = results[activeIndex] ?? null;

  const queryParts = useMemo(() => query.split(/\s+/), [query]);

  const navigate = useNavigate();

  const resultClicked = useCallback(
    (result: MarkedUpSearchResult) => {
      onResultClick?.(result);
      navigate(result.link);
    },
    [navigate]
  );

  const selectActiveResult = useCallback(() => {
    if (!activeResult) return;
    resultClicked(activeResult);
  }, [activeResult, resultClicked]);

  return {
    query,
    queryParts,
    setQuery,
    results,
    activeIndex,
    reset,
    activeResult,
    previousResult,
    nextResult,
    selectActiveResult,
    resultClicked,
  };
};

export const linkProps = (result: SearchResult): LinkProps => {
  switch (result.__typename) {
    case 'ActivityResult':
      return {
        to: '/$activityType/$slug',
        params: { activityType: result.activity.type, slug: result.activity.slug },
      };
    case 'PersonResult':
      return {
        to: '/people/$id',
        params: { id: result.person.id },
      };
    // case 'VenueResult':
    //   return {
    //     to: '/venues/$id',
    //     params: { id: result.venue.id },
    //   };
    case 'PageResult':
      return {
        to: '/about/$slug',
        params: { slug: result.slug },
      };
    default:
      return {
        to: '/',
        params: true,
      };
  }
};

const SearchResultIcon: React.FC<{ result: SearchResult }> = ({ result }) => {
  switch (result.__typename) {
    case 'ActivityResult':
      return <ActivityIcon activityType={result.activity.type} />;
    case 'PersonResult':
      return <UserIcon />;
    case 'PageResult':
      return <PageIcon />;
    case 'VenueResult':
      return <LocationIcon />;
    default:
      return <SearchIcon />;
  }
};
