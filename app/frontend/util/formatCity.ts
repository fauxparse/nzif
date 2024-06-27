import { getName } from 'country-list';
import { first } from 'lodash-es';

type City = {
  name: string;
  traditionalNames: string[];
  country: string;
};

export const formatCity = (city: City, useTraditionalName = true) => {
  const cityName = first(
    [useTraditionalName && city.traditionalNames[0], city.name].filter(Boolean)
  );

  const countryName = getName(city.country);

  return [cityName, countryName].filter(Boolean).join(', ');
};
