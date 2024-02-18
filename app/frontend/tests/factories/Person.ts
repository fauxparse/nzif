import { Factory } from 'fishery';

import { Person } from '@/graphql/types';

import cityFactory from './City';
import countryFactory from './Country';
import userFactory from './User';

class PersonFactory extends Factory<Person> {
  blank() {
    return this.params({
      name: '',
      bio: '',
      pronouns: '',
      phone: '',
      picture: null,
      city: null,
      country: null,
    });
  }

  registered() {
    return this.associations({
      user: userFactory.build(),
    });
  }
}

const personFactory = PersonFactory.define(
  ({ sequence, associations }) =>
    ({
      __typename: 'Person',
      id: String(sequence),
      name: `Person ${sequence}`,
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      pronouns: 'they/them',
      phone: '+64 12 345 6789',
      picture: null,
      user: associations.user || null,
      city: cityFactory.build(),
      country: countryFactory.build(),
    }) satisfies Person
);

export default personFactory;
