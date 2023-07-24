import { Factory } from 'fishery';

import { Placename } from '@/graphql/types';

class CountryFactory extends Factory<Placename> {
  aotearoa() {
    return this.params({});
  }

  australia() {
    return this.params({
      id: 'AU',
      name: 'Australia',
      traditionalName: null,
      raw: 'Australia',
    });
  }
}

const countryFactory = CountryFactory.define(
  () =>
    ({
      __typename: 'Placename',
      id: 'NZ',
      name: 'New Zealand',
      traditionalName: 'Aotearoa',
      raw: 'New Zealand',
    } as const)
);

export default countryFactory;
