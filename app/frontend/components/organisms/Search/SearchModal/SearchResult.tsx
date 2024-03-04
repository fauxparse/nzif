import { forwardRef } from 'react';
import SearchQuery from './query';
import { ResultOf } from '@/graphql';
import SearchIcon from '@/icons/SearchIcon';
import { Link, LinkProps } from '@tanstack/react-router';
import { ACTIVITY_TYPES, getPluralFromActivityType } from '@/constants/activityTypes';
import { ActivityType } from '@/graphql/types';
import { Highlight } from '@mantine/core';

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
        href={result.url}
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

export const linkProps = (result: Result): Pick<LinkProps, 'to' | 'params'> => {
  if ('activity' in result) {
    const activityType = getPluralFromActivityType(result.activity.type as ActivityType);
    return { to: '/$activityType/$slug', params: { activityType, slug: result.activity.slug } };
  }

  // TODO: handle other types of results

  return { to: '/', params: {} };
};

export default SearchResult;
