import { City as FullCity } from '@/graphql/types';
import { useQuery } from '@apollo/client';
import { Anchor, Arrow } from '@radix-ui/react-popover';
import { Button, Flex, Popover, Separator, Switch, Text } from '@radix-ui/themes';
import { Link } from '@tanstack/react-router';
import { getCode, getName } from 'country-list';
import Fuse from 'fuse.js';
import { isEmpty } from 'lodash-es';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { CitiesQuery } from './queries';

import classes from './Placenames.module.css';

export type City = Omit<FullCity, '__typename'>;

const USE_CITIES = new Set<City['country']>(['nz', 'au']);

const FUSE_OPTIONS = {
  keys: ['name', 'traditionalNames'],
  threshold: 0.3,
  isCaseSensitive: false,
};

const shouldShowCity = (city: City) =>
  USE_CITIES.has(city.country.toLowerCase()) || city.traditionalNames.length;

const countryCode = (countryName: string) =>
  countryName.toLowerCase() === 'aotearoa' ? 'nz' : getCode(countryName)?.toLowerCase() || '';

type PlacenamesContextType = {
  showTraditionalNames: boolean;
  showPopup: (props: { city: City; anchor: HTMLElement }) => void;
  displayName: (city: City) => string;
  search: (query: string) => City[];
  countryName: (countryCode: string) => string;
  countryCode: (countryName: string) => string;
  cityDisplayName: (city: string, country: string, includeEnglish?: boolean) => string;
};

const PlacenamesContext = createContext<PlacenamesContextType>({
  showTraditionalNames: true,
  showPopup: () => {},
  displayName: () => '',
  search: () => [],
  countryName: () => '',
  countryCode: () => '',
  cityDisplayName: (s) => s,
});

export const PlacenamesProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { data, loading } = useQuery(CitiesQuery);

  const [showTraditionalNames, setShowTraditionalNames] = useLocalStorage(
    'showTraditionalNames',
    true
  );

  const countryName = useCallback(
    (countryCode: string) => {
      switch (countryCode.toLowerCase()) {
        case 'nz':
          return showTraditionalNames ? 'Aotearoa' : 'New Zealand';
        case 'uk':
        case 'gb':
          return 'United Kingdom';
        case 'us':
          return 'United States';
        default:
          return getName(countryCode.toLowerCase()) || '';
      }
    },
    [showTraditionalNames]
  );

  const displayName = useCallback(
    (city: City) =>
      shouldShowCity(city)
        ? (showTraditionalNames && city.traditionalNames[0]) || city.name
        : countryName(city.country) || '',
    [showTraditionalNames]
  );

  const [city, setCity] = useState<City | null>(null);

  const virtualRef = useRef<HTMLElement | null>(null);

  const showPopup = useCallback(({ city, anchor }: { city: City; anchor: HTMLElement }) => {
    virtualRef.current = anchor;
    setCity(city);
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(data?.cities || [], {
        keys: ['name', 'traditionalNames'],
        threshold: 0.3,
        isCaseSensitive: false,
      }),
    [data]
  );

  const search = useCallback((query: string) => fuse.search(query).map((r) => r.item), [fuse]);

  const cityDisplayName = useCallback(
    (city: string, country: string, includeEnglish = false) => {
      const [result] = search(city).filter((c) => c.country === country);
      if (!result?.traditionalNames?.length) return city;
      return (
        (showTraditionalNames &&
          `${result.traditionalNames[0]}${includeEnglish ? `/${result.name}` : ''}`) ||
        result.name
      );
    },
    [showTraditionalNames, search]
  );

  const value = useMemo(
    () => ({
      showTraditionalNames,
      showPopup,
      displayName,
      search,
      countryName,
      countryCode,
      cityDisplayName,
    }),
    [
      showTraditionalNames,
      showPopup,
      displayName,
      search,
      countryName,
      countryCode,
      cityDisplayName,
    ]
  );

  return (
    <PlacenamesContext.Provider value={value}>
      {children}
      <Popover.Root
        open={!!city}
        onOpenChange={(open) => {
          if (!open) setCity(null);
        }}
      >
        <Anchor virtualRef={virtualRef} />
        <Popover.Content className={classes.popover}>
          {city && !isEmpty(city?.traditionalNames) ? (
            <>
              <Flex direction="column" align="stretch" gap="3">
                {showTraditionalNames ? (
                  <Flex direction="column" align="center">
                    <Text size="4" weight="medium" align="center">
                      {city.traditionalNames[0]}
                    </Text>
                    <Text size="3" align="center">
                      is a traditional name for the area commonly known as {city.name}
                    </Text>
                  </Flex>
                ) : (
                  <Flex direction="column">
                    <Text size="3" align="center">
                      {city.name} is a common name for the area traditionally known as
                    </Text>
                    <Text size="4" weight="medium" align="center">
                      {city.traditionalNames[0]}
                    </Text>
                  </Flex>
                )}
                <Separator size="4" />
                <Text size="2" align="center" color="gray">
                  Where possible, we endeavour to use the traditional names of the places where we
                  live and work. If you find this confusing, you can turn it off.
                </Text>
                <Flex asChild gap="2" align="center">
                  <label>
                    <Switch
                      checked={showTraditionalNames}
                      onCheckedChange={setShowTraditionalNames}
                    />
                    <Text size="2" color="gray">
                      Show traditional names (where available)
                    </Text>
                  </label>
                </Flex>
                <Button asChild size="2" onClick={() => setCity(null)} variant="outline">
                  <Link to="/about/$slug" params={{ slug: 'acknowledgements' }} target="_blank">
                    Read more
                  </Link>
                </Button>
              </Flex>
            </>
          ) : (
            city && (
              <>
                <Text size="3" weight="medium">
                  {city.name}
                </Text>
                <Text size="2">{countryName(city.country)}</Text>
              </>
            )
          )}
          <Arrow width="16" height="8" className={classes.arrow} />
        </Popover.Content>
      </Popover.Root>
    </PlacenamesContext.Provider>
  );
};

export const usePlacenames = () => useContext(PlacenamesContext);
