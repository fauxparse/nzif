import { ActivityIcon } from '@/icons/ActivityIcon';
import LocationIcon from '@/icons/LocationIcon';
import PageIcon from '@/icons/PageIcon';
import SearchIcon from '@/icons/SearchIcon';
import UserIcon from '@/icons/UserIcon';
import { formatCity } from '@/util/formatCity';
import { Highlight } from '@mantine/core';
import { Link, LinkProps } from '@tanstack/react-router';
import { forwardRef, useEffect, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import type { SearchResult } from '../types';

type SearchResultProps = {
  result: SearchResult;
  active?: boolean;
  queryParts?: string[];
  onSelect: (result: SearchResult) => void;
};

export const Result = forwardRef<HTMLAnchorElement, SearchResultProps>(
  ({ result, active, queryParts = [], onSelect }, ref) => {
    const ownRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
      if (active && ownRef.current) {
        ownRef.current.scrollIntoView({ block: 'center' });
      }
    }, [active]);

    return (
      <Link
        {...linkProps(result)}
        className="search-result"
        ref={mergeRefs([ref, ownRef])}
        id={`${result.id}`}
        data-selected={active || undefined}
        onClick={(e) => {
          e.preventDefault();
          onSelect(result);
        }}
      >
        <SearchResultIcon result={result} />
        <Highlight component="span" className="search-result__title" highlight={queryParts}>
          {result.title}
        </Highlight>
        <Highlight component="span" className="search-result__description" highlight={queryParts}>
          {description(result) || '(no description)'}
        </Highlight>
      </Link>
    );
  }
);

export const linkProps = (result: SearchResult): LinkProps => {
  switch (result.__typename) {
    case 'ActivityResult':
      return {
        to: '/$activityType/$slug',
        params: { activityType: result.activity.type, slug: result.activity.slug },
      };
    // case 'PersonResult':
    //   return {
    //     to: '/people/$id',
    //     params: { id: result.person.id },
    //   };
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

const description = (result: SearchResult) => {
  switch (result.__typename) {
    case 'PersonResult':
      return result.person.city ? formatCity(result.person.city) : '';
    default:
      return result.description;
  }
};
