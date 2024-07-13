import type { StoryDefault } from '@ladle/react';
import { randCity, randCountryCode, randFullName } from '@ngneat/falso';
import { deburr, range } from 'lodash-es';
import { Search } from '.';
import { PersonResult } from './types';
import { UseSearchOptions, useRealSearchResults, useSearch } from './useSearch';

const PEOPLE: PersonResult[] = range(100).map((i) => {
  const name = randFullName();
  return {
    id: String(i),
    __typename: 'PersonResult',
    title: name,
    description: '',
    person: {
      id: String(i),
      name,
      city: {
        id: String(i),
        name: randCity(),
        country: randCountryCode(),
        traditionalNames: [],
      },
      picture: null,
    },
  };
});

const useSearchResults = () => {
  const doSearch = ({ variables: { query } }: { variables: { query: string } }) =>
    new Promise((resolve) => {
      const regex = new RegExp(query, 'i');

      setTimeout(() => {
        resolve({
          data: {
            search: PEOPLE.filter(({ person }) => regex.test(deburr(person.name))),
          },
        });
      }, 150);
    });

  return [doSearch, {}] as ReturnType<typeof useRealSearchResults>;
};

const fakeUseSearch = (options: UseSearchOptions = {}) =>
  useSearch({
    ...options,
    useSearchResults,
    useNavigate:
      () =>
      async (...args) =>
        console.log(args),
  });

const SearchStory = () => <Search useSearch={fakeUseSearch} />;

export { SearchStory as Search };

export default {
  title: 'Organisms',
} satisfies StoryDefault;
