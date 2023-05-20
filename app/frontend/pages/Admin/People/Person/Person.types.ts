import { Maybe, PersonDetailsFragment, PersonUserFragment } from '@/graphql/types';

export type PersonDetails = PersonDetailsFragment & {
  bio: string;
  user: Maybe<PersonUserFragment>;
};
