import FlagIcon from '@/icons/FlagIcon';
import { Combobox, Group, Text, TextInput, useCombobox } from '@mantine/core';
import { getCodeList, overwrite } from 'country-list';
import { deburr, sortBy } from 'lodash-es';
import React, { useMemo, useState } from 'react';

type CountryPickerProps = {
  value: string | null;
  limit?: number;
  onChange: (value: string) => void;
};

overwrite([
  {
    code: 'NZ',
    name: 'Aotearoa/New Zealand',
  },
  {
    code: 'GB',
    name: 'United Kingdom',
  },
  {
    code: 'US',
    name: 'United States',
  },
]);

const PRIORITY_COUNTRIES = new Set(['nz', 'au', 'gb', 'us']);

export const CountryPicker: React.FC<CountryPickerProps> = ({ value, limit = 7, onChange }) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const allOptions = useMemo(
    () =>
      sortBy(
        Object.entries(getCodeList()).map(([id, name]) => ({ id, name, search: deburr(name) })),
        [({ id }) => (PRIORITY_COUNTRIES.has(id) ? 0 : 1), 'name']
      ),
    []
  );

  const [query, setQuery] = useState<string>(
    () => (value && allOptions.find((option) => option.id === value)?.name) || ''
  );

  const options = useMemo(() => {
    const regexp = new RegExp(deburr(query), 'i');
    return allOptions.filter((option) => regexp.test(option.search)).slice(0, limit);
  }, [allOptions, query]);

  const handleValueSelect = (value: string) => {
    const option = options.find((option) => option.id === value);
    if (option) {
      setQuery(option.name);
      onChange(option.id);
    }
  };

  return (
    <Combobox
      store={combobox}
      middlewares={{ flip: true, shift: true, inline: false }}
      onOptionSubmit={(value) => handleValueSelect(value)}
    >
      <Combobox.Target>
        <TextInput
          size="md"
          className="city-picker__country"
          value={query}
          leftSection={<FlagIcon />}
          autoComplete="off"
          onChange={(e) => {
            setQuery(e.currentTarget.value);
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => combobox.closeDropdown()}
        />
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>
          {options.map((option) => (
            <Combobox.Option key={option.id} value={option.id}>
              <Group gap="sm">
                <Text size="md">{flagEmoji(option.id)}</Text>
                <Text size="md">{option.name}</Text>
              </Group>
            </Combobox.Option>
          ))}
          {!options.length && (
            <Combobox.Empty>
              <Text component="div" className="city-picker__no-results">
                No results
              </Text>
            </Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

const flagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};
