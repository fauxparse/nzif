import { Factory } from 'fishery';

import { Permission, User } from '@/graphql/types';

import personFactory from './Person';

class UserFactory extends Factory<User> {
  admin() {
    return this.params({
      permissions: [Permission.Admin],
    });
  }

  withProfile() {
    return this.associations({
      profile: personFactory.build(),
    });
  }

  withBlankProfile() {
    return this.associations({
      profile: personFactory.blank().build(),
    });
  }
}

const userFactory = UserFactory.define(({ sequence, associations, afterBuild }) => {
  afterBuild((user) => {
    if (user.profile) {
      user.profile.name = user.name;
      user.profile.user = user;
    }
  });

  return {
    __typename: 'User',
    id: String(sequence),
    name: `User ${sequence}`,
    email: `user${sequence}@example.com`,
    profile: associations.profile || null,
    permissions: [],
    settings: [],
  } satisfies User;
});

export default userFactory;
