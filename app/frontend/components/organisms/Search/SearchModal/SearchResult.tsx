import { pluralFromActivityType } from '@/constants/activityTypes';
import type { ResultOf } from '@/graphql';
import type { ActivityType } from '@/graphql/types';
import SearchIcon from '@/icons/SearchIcon';
import { Highlight } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { forwardRef } from 'react';
import SearchQuery from './query';

export type Result = ResultOf<typeof SearchQuery>['search'][number];

type SearchResultProps = {
  result: Result;
  active?: boolean;
  queryParts?: string[];
  onSelect: (result: Result) => void;
};

const SearchResult = forwardRef<HTMLAnchorElement, SearchResultProps>(
  ({ result, active, queryParts = [], onSelect }, ref) => {
    return (
      <Link
        {...linkProps(result)}
        className="search-result"
        ref={ref}
        id={`${result.id}`}
        data-selected={active || undefined}
        onClick={(e) => {
          e.preventDefault();
          onSelect(result);
        }}
      >
        <SearchIcon />
        <Highlight component="span" className="search-result__title" highlight={queryParts}>
          {result.title}
        </Highlight>
        <Highlight component="span" className="search-result__description" highlight={queryParts}>
          {result.description || '(no description)'}
        </Highlight>
      </Link>
    );
  }
);

export const linkProps = (result: Result) => {
  if ('activity' in result) {
    const activityType = pluralFromActivityType(result.activity.type as ActivityType);
    return {
      to: '/$activityType/$slug',
      params: { activityType, slug: result.activity.slug },
    };
  }

  // TODO: handle other types of results

  return { to: '/', params: true };
};

export default SearchResult;
