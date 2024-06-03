import PlusIcon from '@/icons/PlusIcon';
import UserIcon from '@/icons/UserIcon';
import { useLazyQuery } from '@apollo/client';
import { Combobox, Group, Input, Pill, PillsInput, Text, rem, useCombobox } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { PersonSearchQuery } from './queries';
import { Person } from './types';

import './PersonPicker.css';

type PersonPickerProps = {
  value: Person[];
  allowAdd?: boolean;
  onChange: (value: Person[]) => void;
};

export const PersonPicker: React.FC<PersonPickerProps> = ({
  value,
  allowAdd = false,
  onChange,
}) => {
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
      ...(allowAdd && query ? [{ id: 'add', name: query }] : []),
    ]);
  }, [data]);

  const handleValueSelect = (id: string) => {
    setQuery('');
    combobox.closeDropdown();
    if (id === 'add') {
      //
    } else {
      const person = options.find((person) => person.id === id);
      if (!person || value.some((p) => p.id === person.id)) return;
      onChange([...value, person]);
    }
  };

  const handleValueRemove = (id: string) => onChange(value.filter((p) => p.id !== id));

  return (
    <Combobox
      store={combobox}
      middlewares={{ flip: false, shift: true, inline: false }}
      onOptionSubmit={(value) => handleValueSelect(value)}
    >
      <Combobox.DropdownTarget>
        <PillsInput
          className="person-picker__input"
          size="md"
          pointer
          onClick={() => combobox.toggleDropdown()}
          leftSection={<UserIcon />}
          style={{
            '--input-padding': rem(3),
          }}
        >
          <Pill.Group>
            {value.length > 0 ? (
              <>
                {value.map((person) => (
                  <Pill
                    size="md"
                    key={person.id}
                    withRemoveButton
                    onRemove={() => handleValueRemove(String(person.id))}
                  >
                    {person.name}
                  </Pill>
                ))}
              </>
            ) : (
              <Input.Placeholder>Add persons…</Input.Placeholder>
            )}
            <Combobox.EventsTarget>
              <PillsInput.Field
                value={query}
                onChange={(e) => {
                  setQuery(e.currentTarget.value);
                  handleSearch(e.currentTarget.value);
                  combobox.resetSelectedOption();
                  combobox.openDropdown();
                  combobox.updateSelectedOptionIndex();
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>
      <Combobox.Dropdown>
        <Combobox.Options>
          {options.length > 0 ? (
            options.map((option) => (
              <Combobox.Option key={option.id} value={String(option.id)}>
                <Group className="person-picker__option">
                  {option.id === 'add' ? <PlusIcon /> : <UserIcon />}
                  <Text>{option.id === 'add' ? `Add ${option.name}` : option.name}</Text>
                </Group>
              </Combobox.Option>
            ))
          ) : (
            <Combobox.Empty>{query ? 'No results' : 'Start typing…'}</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
