import { City as FullCity } from '@/graphql/types';
import { useQuery } from '@apollo/client';
import { Anchor, Arrow } from '@radix-ui/react-popover';
import { Button, Flex, Popover, Separator, Switch, Text } from '@radix-ui/themes';
import { getName as countryName } from 'country-list';
import { isEmpty } from 'lodash-es';
import { PropsWithChildren, createContext, useCallback, useContext, useRef, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { CitiesQuery } from './queries';

import { Link } from '@tanstack/react-router';
import classes from './Placenames.module.css';

type City = Omit<FullCity, '__typename'>;

const USE_CITIES = new Set<City['country']>(['NZ', 'AU']);

const shouldShowCity = (city: City) => USE_CITIES.has(city.country) || city.traditionalNames.length;

type PlacenamesContextType = {
  showTraditionalNames: boolean;
  showPopup: (props: { city: City; anchor: HTMLElement }) => void;
  displayName: (city: City) => string;
};

const PlacenamesContext = createContext<PlacenamesContextType>({
  showTraditionalNames: true,
  showPopup: () => {},
  displayName: () => '',
});

export const PlacenamesProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { data, loading } = useQuery(CitiesQuery);

  const [showTraditionalNames, setShowTraditionalNames] = useLocalStorage(
    'showTraditionalNames',
    true
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

  return (
    <PlacenamesContext.Provider
      value={{
        showTraditionalNames,
        showPopup,
        displayName,
      }}
    >
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
