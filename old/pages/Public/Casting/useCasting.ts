import { Reference } from '@apollo/client';
import { useCallback } from 'react';

import {
  CastMemberFragment,
  CastMemberFragmentDoc,
  CastingSessionFragment,
  Role,
  useAddSessionCastMutation,
  useRemoveSessionCastMutation,
} from '@/graphql/types';

export type Person = Omit<CastMemberFragment, '__typename'>;

export type Roles = 'hosts' | 'performers' | 'musos' | 'operators';

const useCasting = (session: CastingSessionFragment, role: Roles) => {
  const people = (roles: Roles): Person[] => session[roles];

  const [addCastMember] = useAddSessionCastMutation();

  const [removeCastMember] = useRemoveSessionCastMutation();

  const add = useCallback(
    (person: Person) => {
      addCastMember({
        variables: {
          sessionId: session.id,
          role: role.replace(/s$/, '') as Role,
          profileId: person.id,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          addSessionCast: {
            __typename: 'AddSessionCastPayload',
            cast: {
              __typename: 'Person',
              ...person,
              picture: null,
            },
          },
        },
        update: (cache, { data }) => {
          const person = data?.addSessionCast?.cast;
          if (!person) return;
          const ref = cache.writeFragment({
            id: cache.identify(person),
            fragment: CastMemberFragmentDoc,
            data: person,
          });
          cache.modify({
            id: cache.identify(session),
            fields: {
              [role]: (existing) => [...existing, ref],
            },
          });
        },
      });
    },
    [addCastMember, session, role]
  );

  const remove = useCallback(
    (person: Person) => {
      removeCastMember({
        variables: {
          sessionId: session.id,
          role: role.replace(/s$/, '') as Role,
          profileId: person.id,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          removeSessionCast: true,
        },
        update: (cache) => {
          cache.modify({
            id: cache.identify(session),
            fields: {
              [role]: (existing, { readField }) =>
                existing.filter((p: Reference) => readField('id', p) !== person.id),
            },
          });
        },
      });
    },
    [removeCastMember, session, role]
  );

  const update = useCallback(
    (people: Person[]) => {
      const existing = new Set(session[role].map((p) => p.id));
      const incoming = new Set(people.map((p) => p.id));
      const toAdd = people.filter((p) => !existing.has(p.id));
      const toRemove = session[role].filter((p) => !incoming.has(p.id));

      toAdd.forEach(add);
      toRemove.forEach(remove);
    },
    [add, remove, session, role]
  );

  return { people, update, add, remove };
};

export default useCasting;
