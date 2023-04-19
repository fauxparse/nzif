import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { camelCase } from 'lodash-es';

import { IconName } from '../../atoms/Icon';
import {
  ActivityResult,
  PageResult,
  SearchResult as BaseSearchResult,
  UserResult,
  useSearchLazyQuery,
} from '../../graphql/types';
import Search from '../../molecules/Search';
import { SearchResult } from '../../molecules/Search/Search.types';

import './Header.css';

type HeaderSearchProps = {
  container: React.RefObject<HTMLElement>;
};

const isPageResult = (result: BaseSearchResult & { __typename: string }): result is PageResult =>
  result.__typename === 'PageResult';

const isActivityResult = (
  result: BaseSearchResult & { __typename: string }
): result is ActivityResult => result.__typename === 'ActivityResult';

const isUserResult = (result: BaseSearchResult & { __typename: string }): result is UserResult =>
  result.__typename === 'UserResult';

const HeaderSearch: React.FC<HeaderSearchProps> = ({ container }) => {
  const [search] = useSearchLazyQuery();

  const navigate = useNavigate();

  const measureSearch = (el: HTMLDivElement) => {
    const header = container.current;
    if (!el || !header) return { left: 0, right: 0 };

    if (header.clientWidth <= 1024) {
      const padding = parseFloat(getComputedStyle(header).paddingLeft || '0');
      const left = padding - el.getBoundingClientRect().left;
      const right = el.getBoundingClientRect().right - (header.clientWidth - padding);
      return { left, right };
    } else {
      const logo = header.querySelector('.header__logo');
      const left =
        (logo?.getBoundingClientRect().right || 0) + 16 - el.getBoundingClientRect().left;
      const right = 0;
      return { left, right };
    }
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
                url: result.url,
                description: '',
                icon: 'page',
              };
              if (isPageResult(result)) {
                searchResult.icon = 'page';
                searchResult.description = result.lede || '(no description)';
              }
              if (isActivityResult(result)) {
                searchResult.icon = camelCase(result.activity.type) as IconName;
                searchResult.description = result.activity.type;
              }
              if (isUserResult(result)) {
                searchResult.icon = 'user';
                searchResult.description = result.user.email;
              }
              return searchResult;
            }) || []
          )
        )
      ),
    [search]
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
