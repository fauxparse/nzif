import CloseIcon from '@/icons/CloseIcon';
import LocationIcon from '@/icons/LocationIcon';
import { usePlacenames } from '@/services/Placenames';
import { CitiesQuery } from '@/services/Placenames/queries';
import { useQuery } from '@apollo/client';
import { Box, Card, Flex, IconButton, Inset, Text } from '@radix-ui/themes';
import { uniqBy } from 'lodash-es';
import { CSSProperties, useCallback } from 'react';
import { CircleFlag } from 'react-circle-flags';
import { Combobox } from '../Combobox';
import { ComboboxProps } from '../Combobox/types';
import { CityPickerOption } from './types';
import { useAutocomplete } from './useAutocomplete';

import clsx from 'clsx';
import classes from './CityPicker.module.css';

type CityPickerProps = Pick<
  ComboboxProps<CityPickerOption>,
  'className' | 'size' | 'icon' | 'placeholder'
> & {
  city: string | null;
  country: string | null;
  limit?: number;
  onChange: (city: string | null, country: string | null) => void;
};

export const CityPicker: React.FC<CityPickerProps> = ({
  className,
  city,
  country,
  limit = 5,
  onChange,
  ...props
}) => {
  const { search, countryCode, countryName, cityDisplayName } = usePlacenames();

  const { data } = useQuery(CitiesQuery);

  const cities = data?.cities || [];

  const { autocomplete } = useAutocomplete();

  const items = useCallback(
    (query: string) =>
      new Promise<CityPickerOption[]>((resolve) => {
        const customised = search(query).map((city) => {
          const country = countryName(city.country) || '';
          return {
            ...city,
            label: cityDisplayName(city.name, city.country, true),
            value: `${city.name}|${city.country.toLowerCase()}`,
            country,
            countryCode: city.country.toLowerCase(),
          };
        });

        autocomplete(query)?.then((options) => {
          resolve(uniqBy([...customised, ...options], 'value'));
        });
      }),
    [cities, search]
  );

  return (
    <Box className={clsx(classes.root, className)}>
      <Combobox.Root
        icon={<LocationIcon />}
        items={items}
        onSelect={(value) => {
          if (value) {
            onChange(value.name, countryCode(value.country));
          } else {
            onChange(null, null);
          }
        }}
        {...props}
        item={({ item, onSelect }) => (
          <Combobox.Item
            className={classes.item}
            item={item}
            value={item.value}
            onSelect={() => onSelect(item)}
            icon={<CircleFlag countryCode={item.countryCode} width={20} height={20} />}
          >
            <Text size="3" color="gray">
              {item.country}
            </Text>
          </Combobox.Item>
        )}
        input={(props) =>
          city ? (
            <Inset style={{ flex: 1 }}>
              <Card
                size="1"
                style={
                  {
                    '--card-padding': 'var(--space-2)',
                    minHeight: 'var(--text-field-height)',
                  } as CSSProperties
                }
              >
                <Flex gap="3" align="center" className={classes.item}>
                  {country && (
                    <CircleFlag countryCode={country.toLowerCase()} width={20} height={20} />
                  )}
                  <Box flexGrow="1" asChild>
                    <Text truncate>{cityDisplayName(city, country || '', true)}</Text>
                  </Box>
                  {country && (
                    <Text className={classes.countryName} size="3" color="gray">
                      {countryName(country)}
                    </Text>
                  )}
                  <IconButton
                    variant="ghost"
                    size="2"
                    color="gray"
                    radius="full"
                    onClick={() => onChange(null, null)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Flex>
              </Card>
            </Inset>
          ) : (
            <Combobox.Input {...props} />
          )
        }
      />
    </Box>
  );
};
