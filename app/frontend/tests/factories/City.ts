import { Factory } from 'fishery';

import { Placename } from '@/graphql/types';

class CityFactory extends Factory<Placename> {
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
      __typename: 'Placename',
      id: 'wellington',
      name: 'Wellington',
      traditionalName: 'Te Whanganui-a-Tara',
      raw: 'Wellington',
    }) as const
);

export default cityFactory;
