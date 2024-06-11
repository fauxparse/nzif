import { PersonSearchQuery } from '@/components/molecules/PersonPicker/queries';
import { Person } from '@/components/molecules/PersonPicker/types';
import PlusIcon from '@/icons/PlusIcon';
import SearchIcon from '@/icons/SearchIcon';
import UserIcon from '@/icons/UserIcon';
import { useLazyQuery } from '@apollo/client';
import { Combobox, Group, Loader, Text, TextInput, useCombobox } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { Presenter } from '../types';

type SearchProps = {
  existing: Presenter[];
  onSelect: (presenter: Presenter) => void;
};

export const Search: React.FC<SearchProps> = ({ existing, onSelect }) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

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

  const handleSearch = (query: string) => {
    abort.current?.abort();
    abort.current = new AbortController();
    search({ variables: { query } });
  };

  useEffect(() => {
    if (!data) return;
    setOptions([
      ...((data.search
        ?.map((result) => ('person' in result ? result.person : null) as Person | null)
        .filter(Boolean) ?? []) as Person[]),
      { id: 'add', name: query },
    ]);
  }, [data]);

  const handleValueSelect = (id: string) => {
    setQuery('');
    combobox.closeDropdown();
  };

  return (
    <Combobox
      store={combobox}
      middlewares={{ flip: false, shift: true, inline: false }}
      onOptionSubmit={(value) => handleValueSelect(value)}
    >
      <Combobox.Target>
        <TextInput
          className="presenter-search__input"
          size="md"
          placeholder="Add a presenter…"
          value={query}
          onChange={(event) => {
            setQuery(event.currentTarget.value);
            handleSearch(event.currentTarget.value);
            combobox.resetSelectedOption();
            combobox.openDropdown();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => {
            combobox.openDropdown();
            if (data === null) {
              handleSearch(query);
            }
          }}
          onBlur={() => combobox.closeDropdown()}
          leftSection={<SearchIcon />}
          rightSection={loading && <Loader size="sm" />}
        />
      </Combobox.Target>
      <Combobox.Dropdown className="presenter-search__dropdown">
        <Combobox.Options>
          {options.length > 1 ? (
            options.map(
              (option) =>
                (option.id !== 'add' || !!query) && (
                  <Combobox.Option key={option.id} value={String(option.id)}>
                    <Group className="presenter-search__option">
                      {option.id === 'add' ? <PlusIcon /> : <UserIcon />}
                      <Text>{option.id === 'add' ? `Add ${option.name}` : option.name}</Text>
                    </Group>
                  </Combobox.Option>
                )
            )
          ) : (
            <Combobox.Empty>{query ? 'No results' : 'Start typing…'}</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
