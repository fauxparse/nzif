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
    } satisfies Registration)
);

export default registrationFactory;
