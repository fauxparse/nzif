import { formatCity } from '@/util/formatCity';
import { Text } from '@radix-ui/themes';
import { Link, LinkProps, useRouter } from '@tanstack/react-router';
import React, { forwardRef, useEffect, useRef } from 'react';
import Highlighter from 'react-highlight-words';
import { mergeRefs } from 'react-merge-refs';
import type { SearchResult } from './types';

import classes from './Search.module.css';

type SearchResultProps = {
  result: SearchResult;
  link: LinkProps;
  icon: React.ReactNode;
  active?: boolean;
  queryParts?: string[];
  onSelect: (result: SearchResult) => void;
};

export const Result = forwardRef<HTMLAnchorElement, SearchResultProps>(
  ({ result, link, icon, active, queryParts = [], onSelect }, ref) => {
    const ownRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
      if (active && ownRef.current) {
        ownRef.current.scrollIntoView({ block: 'center' });
      }
    }, [active]);

    const router = useRouter();

    const LinkComponent = router ? Link : 'a';

    return (
      <LinkComponent
        {...(router
          ? link
          : {
              href: link.to?.replaceAll(
                /\$([^/]+)/g,
                (_, match) => (link.params?.[match as keyof LinkProps['params']] || '') as string
              ),
            })}
        ref={mergeRefs([ref, ownRef])}
        className={classes.result}
        id={`${result.id}`}
        data-selected={active || undefined}
        onClick={(e) => {
          e.preventDefault();
          onSelect(result);
        }}
      >
        {icon}
        <Text truncate className={classes.resultTitle}>
          <Highlight text={result.title} query={queryParts} />
        </Text>
        <Text truncate className={classes.resultDescription}>
          <Highlight
            text={description(result) || ''}
            query={queryParts}
            defaultText="(no description)"
          />
        </Text>
      </LinkComponent>
    );
  }
);

const description = (result: SearchResult) => {
  switch (result.__typename) {
    case 'PersonResult':
      return result.person.city ? formatCity(result.person.city) : '';
    default:
      return result.description;
  }
};

const Highlight: React.FC<{ text: string; query: string[]; defaultText?: string }> = ({
  text,
  query,
  defaultText = '',
}) =>
  text ? (
    <Highlighter searchWords={query} autoEscape={true} textToHighlight={text} />
  ) : (
    <>{defaultText}</>
  );
