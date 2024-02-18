import { camelCase } from 'lodash-es';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { IconName } from '@/atoms/Icon';
import {
  ActivityResult,
  PageResult,
  PersonResult,
  SearchResult as BaseSearchResult,
  useSearchLazyQuery,
} from '@/graphql/types';
import useSetting from '@/hooks/useSetting';
import Search from '@/molecules/Search';
import { SearchResult } from '@/molecules/Search/Search.types';

import './Header.css';

type HeaderSearchProps = {
  container: React.RefObject<HTMLElement>;
};

const isPageResult = (result: BaseSearchResult & { __typename: string }): result is PageResult =>
  result.__typename === 'PageResult';

const isActivityResult = (
  result: BaseSearchResult & { __typename: string }
): result is ActivityResult => result.__typename === 'ActivityResult';

const isPersonResult = (
  result: BaseSearchResult & { __typename: string }
): result is PersonResult => result.__typename === 'PersonResult';

const HeaderSearch: React.FC<HeaderSearchProps> = ({ container }) => {
  const [search] = useSearchLazyQuery();

  const navigate = useNavigate();

  const [showTraditionalNameByDefault] = useSetting<boolean>('showTraditionalNames', true);

  const location = useCallback(
    ({ person }: PersonResult) => {
      const key = showTraditionalNameByDefault ? 'traditionalName' : 'name';
      return [person.city, person.country]
        .map((place) => place?.[key])
        .filter(Boolean)
        .join(', ');
    },
    [showTraditionalNameByDefault]
  );

  const measureSearch = (el: HTMLDivElement) => {
    const header = container.current;
    if (!el || !header) return { left: 0, right: 0 };

    if (header.clientWidth <= 768) {
      const padding = parseFloat(getComputedStyle(header).paddingLeft || '0');
      const left = padding - el.getBoundingClientRect().left;
      const right = el.getBoundingClientRect().right - (header.clientWidth - padding);
      return { left, right };
    }
    const logo = header.querySelector('.header__logo');
    const left = (logo?.getBoundingClientRect().right || 0) + 16 - el.getBoundingClientRect().left;
    const right = 0;
    return { left, right };
  };

  const performSearch = useCallback(
    (query: string) =>
      new Promise<SearchResult[]>((resolve) =>
        search({ variables: { query } }).then(({ data }) =>
          resolve(
            data?.search.map((result) => {
              const searchResult: SearchResult = {
                id: result.id,
                title: result.title,
                description: result.description || '',
                url: result.url,
                icon: 'page',
              };
              if (isPageResult(result)) {
                searchResult.icon = 'page';
                searchResult.description ||= '(no description)';
              }
              if (isActivityResult(result)) {
                searchResult.icon = camelCase(result.activity.type) as IconName;
              }
              if (isPersonResult(result)) {
                searchResult.icon = 'user';
                searchResult.description = location(result);
                searchResult.image = result.person.picture?.small;
              }
              return searchResult;
            }) || []
          )
        )
      ),
    [search, location]
  );

  const searchResultClicked = (result: SearchResult) => navigate(result.url);

  return (
    <Search
      onMeasure={measureSearch}
      onSearch={performSearch}
      onResultClick={searchResultClicked}
    />
  );
};

export default HeaderSearch;
