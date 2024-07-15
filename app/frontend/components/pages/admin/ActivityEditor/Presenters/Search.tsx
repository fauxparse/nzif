import { Combobox, ComboboxItem } from '@/components/molecules/Combobox';
import { PersonSearchQuery } from '@/components/molecules/PersonPicker/queries';
import { PickablePersonFragment } from '@/components/molecules/PersonPicker/queries';
import { Person } from '@/components/molecules/PersonPicker/types';
import SearchIcon from '@/icons/SearchIcon';
import { useLazyQuery } from '@apollo/client';
import { FragmentOf } from 'gql.tada';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PresenterDetailsQuery } from '../queries';
import { Presenter } from '../types';

type SearchResult = ComboboxItem & { person: FragmentOf<typeof PickablePersonFragment> };

type SearchProps = {
  existing: Presenter[];
  onSelect: (presenter: Presenter) => void;
};

export const Search: React.FC<SearchProps> = ({ existing, onSelect }) => {
  const abort = useRef<AbortController>();

  const [options, setOptions] = useState<Person[]>([]);

  const [query, setQuery] = useState<string>('');

  const [search, { loading, data }] = useLazyQuery(PersonSearchQuery, {
    fetchPolicy: 'network-only',
    context: {
      fetchOptions: {
        signal: abort.current?.signal,
      },
      queryDeduplication: false,
    },
  });

  const handleSearch = useCallback(
    (query: string) =>
      new Promise<SearchResult[]>((resolve) => {
        abort.current?.abort();
        abort.current = new AbortController();
        search({ variables: { query } }).then(({ data }) => {
          if (data?.search) {
            resolve(
              data.search.flatMap((result) =>
                'person' in result
                  ? [
                      {
                        id: result.person.id,
                        label: result.person.name,
                        person: result.person,
                      },
                    ]
                  : []
              )
            );
          }
        });
      }),
    [search]
  );

  useEffect(() => {
    if (!data) return;
    setOptions([
      ...((data.search
        ?.map((result) => ('person' in result ? result.person : null) as Person | null)
        .filter(Boolean) ?? []) as Person[]),
      { id: 'add', name: query },
    ]);
  }, [data]);

  const [findPerson] = useLazyQuery(PresenterDetailsQuery);

  const handleValueSelect = useCallback(
    (result: SearchResult | null) => {
      if (!result) return;

      findPerson({ variables: { id: result.id } }).then(({ data }) => {
        if (data?.person) {
          onSelect(data.person);
        }
      });
    },
    [findPerson, onSelect]
  );

  return (
    <Combobox.Root<SearchResult, null>
      icon={<SearchIcon />}
      placeholder="Add a presenter…"
      items={handleSearch}
      onSelect={handleValueSelect}
    />
  );
};
