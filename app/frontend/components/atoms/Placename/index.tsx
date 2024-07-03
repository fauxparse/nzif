import { City } from '@/graphql/types';
import LocationIcon from '@/icons/LocationIcon';
import { usePlacenames } from '@/services/Placenames';
import { Badge, BadgeProps, Flex, Text } from '@radix-ui/themes';
import { getName } from 'country-list';

type PlacenameProps = BadgeProps & {
  city: Omit<City, '__typename'>;
};

const USE_CITIES = new Set<City['country']>(['NZ', 'AU']);

const Placename = ({ city, ...props }: PlacenameProps) => {
  const { showTraditionalNames } = usePlacenames();

  const displayName = USE_CITIES.has(city.country)
    ? (showTraditionalNames && city.traditionalNames[0]) || city.name
    : getName(city.country);

  return displayName ? (
    <Badge asChild radius="full" size="1">
      <Flex align="center" pr="3">
        <LocationIcon variant="filled" size="1" />
        <Text size="2">{displayName}</Text>
      </Flex>
    </Badge>
  ) : null;
};

export default Placename;
