import CloseIcon from '@/icons/CloseIcon';
import LocationIcon from '@/icons/LocationIcon';
import PlusIcon from '@/icons/PlusIcon';
import { CitiesQuery } from '@/services/Placenames/queries';
import { useQuery } from '@apollo/client';
import {
  ActionIcon,
  Box,
  Combobox,
  Input,
  Loader,
  Text,
  TextInput,
  TextInputProps,
  useCombobox,
} from '@mantine/core';
import clsx from 'clsx';
import { getName as getCountryName } from 'country-list';
import { deburr, sortBy } from 'lodash-es';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CountryPicker } from './CountryPicker';
import { Placename, SearchableOption } from './types';
import { useAutocomplete } from './useAutocomplete';

import './CityPicker.css';

type CityPickerProps = Omit<TextInputProps, 'value' | 'onChange'> & {
  className?: string;
  city: string | null;
  country: string | null;
  limit?: number;
  onChange: (city: string | null, country: string | null) => void;
};

type CityPickerOption =
  | {
      id: string;
      city: Placename;
      country: Placename;
    }
  | {
      id: 'add';
      city: string;
    };

export const CityPicker: React.FC<CityPickerProps> = ({
  className,
  city,
  country,
  limit = 5,
  onChange,
  ...props
}) => {
  const cityInput = useRef<HTMLInputElement>(null);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const [query, setQuery] = useState<string>('');

  const [custom, setCustom] = useState(false);

  const { data, loading } = useQuery(CitiesQuery);

  const searchable = useMemo(
    () =>
      sortBy(
        data?.cities?.map((city) => ({
          ...city,
          search: [city.name, ...city.traditionalNames].map(deburr).join('/'),
          country: getCountryName(city.country) ?? '',
        })) || [],
        'search'
      ),
    [data]
  );

  const [optionsFromAutocomplete, setOptionsFromAutocomplete] = useState<SearchableOption[]>([]);

  const { autocomplete, busy } = useAutocomplete();

  useEffect(() => {
    if (query.length < 3) {
      setOptionsFromAutocomplete([]);
      return;
    }
    autocomplete(query)?.then(setOptionsFromAutocomplete);
  }, [autocomplete, query]);

  const options = useMemo<SearchableOption[]>(() => {
    if (!query) return searchable.slice(0, limit);

    const regexp = new RegExp(deburr(query), 'i');

    return [...searchable, ...optionsFromAutocomplete]
      .filter((city) => city.search.match(regexp))
      .slice(0, limit);
  }, [searchable, query, optionsFromAutocomplete, limit]);

  const selectedOption = useMemo(() => {
    if (!city) return null;

    return (
      searchable.find((option) => option.name === city) || {
        id: 'custom',
        name: city,
        country: (country && getCountryName(country)) || '',
        traditionalNames: [],
        search: deburr(city),
      }
    );
  }, [searchable, city, country]);

  useEffect(() => {
    combobox.selectFirstOption();
  }, [query]);

  const clear = () => {
    setQuery('');
    onChange(null, null);
    setTimeout(() => {
      cityInput.current?.focus();
    });
  };

  const handleValueSelect = (value: string) => {
    if (value === 'add') {
      setCustom(true);
      combobox.closeDropdown();
    } else {
      const option = options.find((option) => option.id === value);
      if (option) {
        onChange(option.name, option.country);
      }
      combobox.closeDropdown();
    }
  };

  const handleCountrySelect = (country: string) => {
    setCustom(false);
    onChange(query, country);
  };

  return (
    <Box className={clsx('city-picker', className)}>
      <Combobox
        store={combobox}
        middlewares={{ flip: true, shift: true, inline: false }}
        onOptionSubmit={(value) => handleValueSelect(value)}
      >
        <Combobox.Target>
          {selectedOption ? (
            <Input
              component="div"
              className="city-picker__selected"
              size="md"
              style={{ '--input-height': 'auto' }}
            >
              <Option option={selectedOption} />
              <ActionIcon size="sm" variant="transparent" data-color="neutral" onClick={clear}>
                <CloseIcon />
              </ActionIcon>
            </Input>
          ) : (
            <TextInput
              ref={cityInput}
              size="md"
              className="city-picker__city"
              value={query}
              leftSection={<LocationIcon />}
              rightSection={
                loading || busy ? (
                  <Loader size="sm" />
                ) : query ? (
                  <ActionIcon size="sm" variant="transparent" data-color="neutral" onClick={clear}>
                    <CloseIcon />
                  </ActionIcon>
                ) : null
              }
              autoComplete="off"
              onChange={(e) => {
                setQuery(e.currentTarget.value);
                combobox.openDropdown();
                combobox.updateSelectedOptionIndex();
              }}
              onClick={() => combobox.openDropdown()}
              onFocus={() => combobox.openDropdown()}
              onBlur={() => combobox.closeDropdown()}
              __vars={{ '--input-height-md': '66px' }}
            />
          )}
        </Combobox.Target>
        <Combobox.Dropdown>
          <Combobox.Options>
            {options.map((option) => (
              <Combobox.Option key={option.id} value={option.id}>
                <Option option={option} />
              </Combobox.Option>
            ))}
            {!options.length &&
              (query ? (
                <Combobox.Option value="add">
                  <div className="city-picker__option">
                    <PlusIcon />
                    <Text component="div" className="city-picker__city-name" size="md">
                      {`Add “${query}”`}
                    </Text>
                  </div>
                </Combobox.Option>
              ) : (
                <Combobox.Empty>
                  <Text component="div" className="city-picker__no-results">
                    No results
                  </Text>
                </Combobox.Empty>
              ))}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
      {custom && <CountryPicker value={null} onChange={handleCountrySelect} />}
    </Box>
  );
};

const Option: React.FC<{ option: SearchableOption }> = ({ option }) => (
  <div className="city-picker__option">
    <LocationIcon />
    <Text component="div" className="city-picker__city-name" size="md">
      {option.name}
      {option.traditionalNames.length > 0 && (
        <small>{` / ${option.traditionalNames.join(' / ')}`}</small>
      )}
    </Text>
    <Text component="div" className="city-picker__country-name" size="sm">
      {option.country}
    </Text>
  </div>
);
