import { City } from '@/graphql/types';
import { getName } from 'country-list';
import { uniqBy } from 'lodash-es';

type Placename = {
  name: string;
  traditionalName: string | null;
};

type Locatable = {
  city: Omit<City, '__typename'> | null;
};

const USE_CITIES = new Set<City['country']>(['NZ', 'AU']);

const hasCity = (locatable: Locatable | null): locatable is { city: City } =>
  !!locatable?.city?.name && !!locatable.city?.country;

export const usePlacenames = (locatables: readonly (Locatable | null)[]): Placename[] =>
  uniqBy(
    locatables
      .filter(hasCity)
      .map(({ city }) =>
        USE_CITIES.has(city.country)
          ? { name: city.name, traditionalName: city.traditionalNames[0] || null }
          : { name: getName(city.country || '') || '', traditionalName: null }
      ),
    'name'
  );
