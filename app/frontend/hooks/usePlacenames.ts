import { uniqBy } from 'lodash-es';

type Placename = {
  id: string | number;
  name: string;
  traditionalName: string | null;
};

type Locatable = {
  city: Placename | null;
  country: Placename | null;
};

const USE_CITIES = new Set<Placename['id']>(['NZ', 'AU']);

export const usePlacenames = (locatables: Locatable[]): Placename[] =>
  uniqBy(
    locatables
      .filter(({ city, country }) => !!city || !!country)
      .map(({ city, country }) => (!country || USE_CITIES.has(country.id) ? city : country))
      .filter(Boolean) as Placename[],
    'id'
  );
