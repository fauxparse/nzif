import { Combobox, ComboboxItem } from '@/components/molecules/Combobox';
import SearchIcon from '@/icons/SearchIcon';
import { useLazyQuery, useMutation } from '@apollo/client';
import { FragmentOf } from 'gql.tada';
import { useCallback, useRef, useState } from 'react';
import { PresenterDetailsQuery } from '../queries';
import { Presenter } from '../types';
import { AddPersonMutation, PersonSearchQuery, PickablePersonFragment } from './queries';

type SearchResult = ComboboxItem & { person: Person };

type Person = FragmentOf<typeof PickablePersonFragment>;

type SearchProps = {
  existing: Presenter[];
  onSelect: (presenter: Presenter) => void;
};

export const Search: React.FC<SearchProps> = ({ existing, onSelect }) => {
  const abort = useRef<AbortController>();

  const [options, setOptions] = useState<Person[]>([]);

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

  // useEffect(() => {
  //   if (!data) return;
  //   setOptions([
  //     ...((data.search
  //       ?.map((result) => ('person' in result ? result.person : null) as Person | null)
  //       .filter(Boolean) ?? []) as Person[]),
  //     { id: 'add', name: query },
  //   ]);
  // }, [data]);

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

  const [add] = useMutation(AddPersonMutation);

  const handleAdd = useCallback(
    async (name: string) => {
      const { data } = await add({ variables: { name } });

      const person = data?.createPerson?.profile;

      if (!person) throw new Error('Failed to create presenter');

      return {
        id: person.id,
        label: person.name,
        person,
      };
    },
    [add]
  );

  return (
    <Combobox.Root<SearchResult, null>
      icon={<SearchIcon />}
      placeholder="Add a presenter…"
      items={handleSearch}
      enableAdd
      onSelect={handleValueSelect}
      onAdd={handleAdd}
    />
  );
};
