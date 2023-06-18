import { Factory } from 'fishery';

import { PlaceName } from '@/graphql/types';

class CountryFactory extends Factory<PlaceName> {
  aotearoa() {
    return this.params({});
  }

  australia() {
    return this.params({
      id: 'AU',
      name: 'Australia',
      traditionalName: null,
    });
  }
}

const countryFactory = CountryFactory.define(
  () =>
    ({
      __typename: 'PlaceName',
      id: 'NZ',
      name: 'New Zealand',
      traditionalName: 'Aotearoa',
    } as const)
);

export default countryFactory;
