import { Reference, StoreObject } from '@apollo/client';
import { Active, Over, UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { sortBy } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  AdminActivitySessionDetailsFragment,
  ParticipantRegistrationFragment,
  SessionParticipantFragment,
  SessionParticipantFragmentDoc,
  SessionWaitlistParticipantFragmentDoc,
  useAddSessionParticipantMutation,
  useAddWaitlistParticipantMutation,
  useDemoteSessionParticipantMutation,
  useMoveWaitlistParticipantMutation,
  usePromoteWaitlistParticipantMutation,
  useRemoveSessionParticipantMutation,
  useRemoveWaitlistParticipantMutation,
} from '@/graphql/types';

export type Container = 'participants' | 'waitlist';

export type Items = Record<Container, SessionParticipantFragment[]>;

const useParticipants = (session: AdminActivitySessionDetailsFragment) => {
  const items = useMemo(
    () => ({
      participants: sortBy(session.participants, (p) => p.user?.profile?.name),
      waitlist: session.waitlist.map((w) => w.registration),
    }),
    [session.participants, session.waitlist]
  );
  const [active, setActive] = useState<SessionParticipantFragment | null>(null);
  const recentlyMovedToNewContainer = useRef(false);

  const findContainer = useCallback(
    (id: UniqueIdentifier) => {
      return (Object.keys(items) as Container[]).find(
        (key) => !!items[key].find((p) => p.id === id)
      );
    },
    [items]
  );

  const start = useCallback(({ active }: { active: Active }) => {
    const { registration = null } = active.data.current || {};
    if (registration) {
      setActive(registration);
    }
  }, []);

  const drag = useCallback(
    ({ active, over }: { active: Active; over: Over | null }) => {
      const overId = over?.id;

      if (overId == null) return;

      const overContainer = findContainer(overId);
      const activeContainer = findContainer(active.id);

      if (!overContainer || !activeContainer) {
        return;
      }

      if (activeContainer !== overContainer) {
        recentlyMovedToNewContainer.current = true;
      }
    },
    [findContainer]
  );

  const [moveWaitlistParticipant] = useMoveWaitlistParticipantMutation();
  const [promoteWaitlistParticipant] = usePromoteWaitlistParticipantMutation();
  const [demoteSessionParticipant] = useDemoteSessionParticipantMutation();
  const [addSessionParticipant] = useAddSessionParticipantMutation();
  const [addWaitlistParticipant] = useAddWaitlistParticipantMutation();
  const [removeSessionParticipant] = useRemoveSessionParticipantMutation();
  const [removeWaitlistParticipant] = useRemoveWaitlistParticipantMutation();

  const add = useCallback(
    (registration: ParticipantRegistrationFragment) => {
      addSessionParticipant({
        variables: {
          registrationId: registration.id,
          sessionId: session.id,
        },
        update: (cache, { data }) => {
          const registration = data?.addToSession?.registration;

          if (!registration) return;

          const ref = cache.writeFragment({
            id: cache.identify(registration),
            fragment: SessionParticipantFragmentDoc,
            fragmentName: 'SessionParticipant',
            data: registration,
          });

          cache.modify({
            id: cache.identify(session),
            fields: {
              participants: (existing) => [...existing, ref],
            },
          });
        },
      });
    },
    [addSessionParticipant, session]
  );

  const remove = useCallback(
    (registration: ParticipantRegistrationFragment) =>
      removeSessionParticipant({
        variables: {
          registrationId: registration.id,
          sessionId: session.id,
        },
        update: (cache) => {
          cache.modify({
            id: cache.identify(session),
            fields: {
              participants: (existing, { readField }) =>
                existing.filter(
                  (p: StoreObject | Reference) => readField('id', p) !== registration.id
                ),
            },
          });
        },
      }),
    [removeSessionParticipant, session]
  );

  const promote = useCallback(
    (registration: ParticipantRegistrationFragment) =>
      promoteWaitlistParticipant({
        variables: {
          registrationId: registration.id,
          sessionId: session.id,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          promoteWaitlistParticipant: {
            __typename: 'PromoteWaitlistParticipantPayload',
            registration,
          },
        },
        update: (cache) => {
          const oldPosition =
            session.waitlist.find((w) => w.registration.id === registration.id)?.position ||
            Infinity;
          for (const w of session.waitlist) {
            if (w.position > oldPosition) {
              cache.modify({
                id: cache.identify(w),
                fields: {
                  position: (existing) => existing - 1,
                },
              });
            }
          }

          cache.modify({
            id: cache.identify(session),
            fields: {
              participants: (existing, { readField }) =>
                sortBy([...existing, { __ref: cache.identify(registration) }], (p) =>
                  readField('name', readField('profile', readField('user', p)))
                ),
              waitlist: (existing, { readField }) => {
                return existing.filter(
                  (w: StoreObject | Reference) =>
                    readField('id', readField('registration', w)) !== registration.id
                );
              },
            },
          });
        },
      }),
    [promoteWaitlistParticipant, session]
  );

  const demote = useCallback(
    (registration: ParticipantRegistrationFragment, position = session.waitlist.length + 1) =>
      demoteSessionParticipant({
        variables: {
          registrationId: registration.id,
          sessionId: session.id,
          position,
        },
        update: (cache, { data }) => {
          const waitlist = data?.demoteSessionParticipant?.session?.waitlist?.find(
            (w) => w.registration.id === registration.id
          );
          if (!waitlist) return;

          cache.modify({
            id: cache.identify(session),
            fields: {
              participants: (existing, { readField }) =>
                existing.filter(
                  (p: StoreObject | Reference) => readField('id', p) !== registration.id
                ),
            },
          });
        },
      }),
    [demoteSessionParticipant, session]
  );

  const move = useCallback(
    (registration: ParticipantRegistrationFragment, position: number) => {
      const activeIndex = session.waitlist.findIndex((w) => w.registration.id === registration.id);
      if (activeIndex < 0) return;

      return moveWaitlistParticipant({
        variables: {
          sessionId: session.id,
          registrationId: registration.id,
          position,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          moveWaitlistParticipant: {
            __typename: 'MoveWaitlistParticipantPayload',
            waitlist: arrayMove(session.waitlist, activeIndex, position - 1),
          },
        },
        update: (cache) => {
          cache.modify({
            id: cache.identify(session),
            fields: {
              waitlist: (existing) => arrayMove(existing, activeIndex, position - 1),
            },
          });
        },
      });
    },
    [session, moveWaitlistParticipant]
  );

  const addToWaitlist = useCallback(
    (registration: ParticipantRegistrationFragment) =>
      addWaitlistParticipant({
        variables: {
          registrationId: registration.id,
          sessionId: session.id,
        },
        update: (cache, { data }) => {
          const waitlist = data?.addToWaitlist?.waitlist;

          if (!waitlist) return;

          const ref = cache.writeFragment({
            id: cache.identify(waitlist),
            fragment: SessionWaitlistParticipantFragmentDoc,
            fragmentName: 'SessionWaitlistParticipant',
            data: waitlist,
          });

          cache.modify({
            id: cache.identify(session),
            fields: {
              waitlist: (existing) => [...existing, ref],
            },
          });
        },
      }),
    [addWaitlistParticipant, session]
  );

  const removeFromWaitlist = useCallback(
    (registration: ParticipantRegistrationFragment) =>
      removeWaitlistParticipant({
        variables: {
          registrationId: registration.id,
          sessionId: session.id,
        },
        update: (cache) => {
          cache.modify({
            id: cache.identify(session),
            fields: {
              waitlist: (existing, { readField }) =>
                existing.filter(
                  (w: StoreObject | Reference) =>
                    readField('id', readField('registration', w)) !== registration.id
                ),
            },
          });
        },
      }),
    [removeWaitlistParticipant, session]
  );

  const drop = useCallback(
    ({ active, over }: { active: Active; over: Over | null }) => {
      const activeContainer = findContainer(active.id);

      if (!activeContainer) {
        setActive(null);
        return;
      }

      const overId = over?.id;

      if (overId == null) {
        setActive(null);
        return;
      }

      const overContainer = findContainer(overId);

      if (overContainer) {
        const activeIndex = items[activeContainer].findIndex((p) => p.id === active.id);
        const overIndex = items[overContainer].findIndex((p) => p.id === overId);

        if (activeIndex !== overIndex || activeContainer !== overContainer) {
          if (activeContainer === 'waitlist') {
            if (overContainer === 'waitlist') {
              move(items[activeContainer][activeIndex], overIndex + 1);
            } else {
              const registration = session.waitlist[activeIndex].registration;
              promote(registration);
            }
          } else {
            const registration = items.participants[activeIndex];
            demote(registration);
          }
        }
      }

      setActive(null);
    },
    [findContainer, items, move, session, promote, demote]
  );

  const cancel = useCallback(() => {
    setActive(null);
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [items]);

  const isFromWaitlist = useCallback(
    (participant: SessionParticipantFragment) =>
      session.waitlist.some((p) => p.registration.id === participant.id),
    [session.waitlist]
  );

  return {
    items,
    active,
    findContainer,
    start,
    drag,
    drop,
    cancel,
    isFromWaitlist,
    add,
    remove,
    promote,
    demote,
    move,
    addToWaitlist,
    removeFromWaitlist,
  };
};

export default useParticipants;
