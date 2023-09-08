import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Active, Over, UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { sortBy } from 'lodash-es';

import {
  AdminActivitySessionDetailsFragment,
  SessionParticipantFragment,
  useDemoteSessionParticipantMutation,
  useMoveWaitlistParticipantMutation,
  usePromoteWaitlistParticipantMutation,
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
  const [clonedItems, setClonedItems] = useState<Items | null>(null);
  const recentlyMovedToNewContainer = useRef(false);

  const findContainer = useCallback(
    (id: UniqueIdentifier) => {
      return (Object.keys(items) as Container[]).find(
        (key) => !!items[key].find((p) => p.id === id)
      );
    },
    [items]
  );

  const start = useCallback(
    ({ active }: { active: Active }) => {
      const { registration = null } = active.data.current || {};
      if (registration) {
        setActive(registration);
        setClonedItems(items);
      }
    },
    [items]
  );

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
        // setItems((items) => {
        //   const activeItems = items[activeContainer];
        //   const overItems = items[overContainer];
        //   const overIndex = overItems.findIndex((p) => p.id === overId);
        //   const activeIndex = activeItems.findIndex((p) => p.id === active.id);

        //   let newIndex: number;

        //   if (overId in items) {
        //     newIndex = overItems.length + 1;
        //   } else {
        //     const isBelowOverItem =
        //       over &&
        //       active.rect.current.translated &&
        //       active.rect.current.translated.top > over.rect.top + over.rect.height;

        //     const modifier = isBelowOverItem ? 1 : 0;

        //     newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        //   }

        //   recentlyMovedToNewContainer.current = true;

        //   return {
        //     ...items,
        //     [activeContainer]: items[activeContainer].filter((p) => p.id !== active.id),
        //     [overContainer]:
        //       overContainer === 'waitlist'
        //         ? [
        //             ...items[overContainer].slice(0, newIndex),
        //             items[activeContainer][activeIndex],
        //             ...items[overContainer].slice(newIndex),
        //           ]
        //         : sortBy(
        //             [...items[overContainer], items[activeContainer][activeIndex]],
        //             (r) => r.user?.profile?.name
        //           ),
        //   };
        // });
        recentlyMovedToNewContainer.current = true;
      }
    },
    [findContainer]
  );

  const [moveWaitlistParticipant] = useMoveWaitlistParticipantMutation();
  const [promoteWaitlistParticipant] = usePromoteWaitlistParticipantMutation();
  const [demoteSessionParticipant] = useDemoteSessionParticipantMutation();

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
          // setItems((items) => ({
          //   ...items,
          //   [overContainer]:
          //     overContainer === 'waitlist'
          //       ? arrayMove(items[overContainer], activeIndex, overIndex)
          //       : sortBy(
          //           arrayMove(items[overContainer], activeIndex, overIndex),
          //           (r) => r.user?.profile?.name
          //         ),
          // }));

          if (activeContainer === 'waitlist') {
            if (overContainer === 'waitlist') {
              moveWaitlistParticipant({
                variables: {
                  sessionId: session.id,
                  registrationId: String(active.id),
                  position: overIndex + 1,
                },
                optimisticResponse: {
                  __typename: 'Mutation',
                  moveWaitlistParticipant: {
                    __typename: 'MoveWaitlistParticipantPayload',
                    waitlist: arrayMove(session.waitlist, activeIndex, overIndex),
                  },
                },
                update: (cache) => {
                  cache.modify({
                    id: cache.identify(session),
                    fields: {
                      waitlist: (existing) => arrayMove(existing, activeIndex, overIndex),
                    },
                  });
                },
              });
            } else {
              const registration = session.waitlist[activeIndex].registration;

              promoteWaitlistParticipant({
                variables: {
                  sessionId: session.id,
                  registrationId: String(active.id),
                },
                optimisticResponse: {
                  __typename: 'Mutation',
                  promoteWaitlistParticipant: {
                    __typename: 'PromoteWaitlistParticipantPayload',
                    registration,
                  },
                },
                update: (cache) => {
                  cache.modify({
                    id: cache.identify(session),
                    fields: {
                      participants: (existing, { readField }) =>
                        sortBy([...existing, { __ref: cache.identify(registration) }], (p) =>
                          readField('user.profile.name', p)
                        ),
                      waitlist: (existing) => [
                        ...existing.slice(0, activeIndex),
                        ...existing.slice(activeIndex + 1),
                      ],
                    },
                  });
                },
              });
            }
          } else {
            demoteSessionParticipant({
              variables: {
                sessionId: session.id,
                registrationId: String(active.id),
                position: overIndex + 1,
              },
              optimisticResponse: {
                __typename: 'Mutation',
                demoteSessionParticipant: {
                  __typename: 'DemoteSessionParticipantPayload',
                  session: {
                    ...session,
                    participants: [
                      ...session.participants.slice(0, activeIndex),
                      ...session.participants.slice(activeIndex + 1),
                    ],
                    waitlist: [
                      ...session.waitlist.slice(0, overIndex),
                      {
                        __typename: 'Waitlist',
                        id: session.participants[activeIndex].id,
                        registration: session.participants[activeIndex],
                        position: overIndex + 1,
                        offeredAt: null,
                      },
                      ...session.waitlist.slice(overIndex).map((w) => ({
                        ...w,
                        position: w.position + 1,
                      })),
                    ],
                  },
                },
              },
            });
          }
        }
      }

      setActive(null);
    },
    [
      items,
      session,
      findContainer,
      moveWaitlistParticipant,
      promoteWaitlistParticipant,
      demoteSessionParticipant,
    ]
  );

  const cancel = useCallback(() => {
    if (clonedItems) {
      // Reset items to their original state in case items have been dragged across containers
      // setItems(clonedItems);
    }

    setActive(null);
    setClonedItems(null);
  }, [clonedItems]);

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
    clonedItems,
    setClonedItems,
    findContainer,
    start,
    drag,
    drop,
    cancel,
    isFromWaitlist,
  };
};

export default useParticipants;
