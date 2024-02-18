import { Factory } from 'fishery';
import { DateTime } from 'luxon';

import { Registration } from '@/graphql/types';

import userFactory from './User';

class RegistrationFactory extends Factory<Registration> {
  blank() {
    return this.params({
      user: null,
    });
  }

  withUserButNoProfile() {
    return this.associations({
      user: userFactory.withBlankProfile().build(),
    });
  }

  withUserDetails() {
    return this.associations({
      user: userFactory.withProfile().build(),
    });
  }

  readCodeOfConduct() {
    return this.params({
      codeOfConductAcceptedAt: DateTime.now().minus({ days: 1 }),
    });
  }
}

const registrationFactory = RegistrationFactory.define(
  ({ associations, sequence }) =>
    ({
      __typename: 'Registration',
      id: String(sequence),
      user: associations.user || userFactory.withProfile().build(),
      codeOfConductAcceptedAt: null,
      preferences: [],
      completedAt: null,
      workshopsCount: 0,
      cart: {
        __typename: 'Cart',
        id: String(sequence),
        value: 0,
        discount: 0,
        total: 0,
        paid: 0,
        outstanding: 0,
        workshopsCount: 0,
      },
    }) satisfies Registration
);

export default registrationFactory;
