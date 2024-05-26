import UserIcon from '@/icons/UserIcon';
import { useLazyQuery } from '@apollo/client';
import { Combobox, Input, Pill, PillsInput, rem, useCombobox } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { PresenterSearchQuery } from './queries';
import { Presenter } from './types';

type PresenterPickerProps = {
  value: Presenter[];
  onChange: (value: Presenter[]) => void;
};

export const PresenterPicker: React.FC<PresenterPickerProps> = ({ value, onChange }) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const abort = useRef<AbortController>();

  const [options, setOptions] = useState<Presenter[]>([]);

  const [query, setQuery] = useState<string>('');

  const [search, { loading, data }] = useLazyQuery(PresenterSearchQuery, {
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
    setOptions(
      (data.search
        ?.map((result) => ('person' in result ? result.person : null) as Presenter | null)
        .filter(Boolean) ?? []) as Presenter[]
    );
  }, [data]);

  const handleValueSelect = (id: string) => {
    setQuery('');
    combobox.closeDropdown();
    const presenter = options.find((person) => person.id === id);
    if (!presenter || value.some((p) => p.id === presenter.id)) return;
    onChange([...value, presenter]);
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
          className="presenter-picker__input"
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
                {value.map((presenter) => (
                  <Pill
                    size="md"
                    key={presenter.id}
                    withRemoveButton
                    onRemove={() => handleValueRemove(String(presenter.id))}
                  >
                    {presenter.name}
                  </Pill>
                ))}
              </>
            ) : (
              <Input.Placeholder>Add presenters…</Input.Placeholder>
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
                {option.name}
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
