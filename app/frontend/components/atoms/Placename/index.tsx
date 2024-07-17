import { City } from '@/graphql/types';
import LocationIcon from '@/icons/LocationIcon';
import { usePlacenames } from '@/services/Placenames';
import { Badge, BadgeProps, Flex, Text } from '@radix-ui/themes';
import { getName } from 'country-list';
import { CircleFlag } from 'react-circle-flags';

type PlacenameProps = BadgeProps & {
  city: Omit<City, '__typename'>;
};

const USE_CITIES = new Set<City['country']>(['NZ', 'AU']);

const Placename = ({ city, ...props }: PlacenameProps) => {
  const { showTraditionalNames, showPopup } = usePlacenames();

  const showCity = USE_CITIES.has(city.country) || city.traditionalNames.length;

  const displayName = showCity
    ? (showTraditionalNames && city.traditionalNames[0]) || city.name
    : getName(city.country);

  return displayName ? (
    <Badge asChild radius="full" size="1">
      <Flex asChild align="center" pr="3" pl="1">
        <button type="button" onClick={(e) => showPopup({ city, anchor: e.currentTarget })}>
          {city.country ? (
            <CircleFlag
              countryCode={city.country.toLowerCase()}
              width={20}
              height={20}
              style={{ marginInline: '-2px' }}
            />
          ) : (
            <LocationIcon variant="filled" size="1" />
          )}
          <Text size="2">{displayName}</Text>
        </button>
      </Flex>
    </Badge>
  ) : null;
};

export default Placename;
