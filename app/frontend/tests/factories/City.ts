import { Factory } from 'fishery';

import { PlaceName } from '@/graphql/types';

class CityFactory extends Factory<PlaceName> {
  wellington() {
    return this.params({});
  }

  auckland() {
    return this.params({
      id: 'auckland',
      name: 'Auckland',
      traditionalName: 'Tāmaki Makaurau',
      raw: 'Auckland',
    });
  }
}

const cityFactory = CityFactory.define(
  () =>
    ({
      __typename: 'PlaceName',
      id: 'wellington',
      name: 'Wellington',
      traditionalName: 'Te Whanganui-a-Tara',
      raw: 'Wellington',
    } as const)
);

export default cityFactory;
