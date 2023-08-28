import { useCallback, useEffect, useRef, useState } from 'react';
import { Active, Over, UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { sortBy } from 'lodash-es';

import { AdminActivitySessionDetailsFragment, SessionParticipantFragment } from '@/graphql/types';

export type Container = 'participants' | 'waitlist';

export type Items = Record<Container, SessionParticipantFragment[]>;

const useParticipants = (session: AdminActivitySessionDetailsFragment) => {
  const [items, setItems] = useState<Items>(() => ({
    participants: sortBy(session.participants, (p) => p.user?.profile?.name),
    waitlist: session.waitlist,
  }));
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
        setItems((items) => {
          const activeItems = items[activeContainer];
          const overItems = items[overContainer];
          const overIndex = overItems.findIndex((p) => p.id === overId);
          const activeIndex = activeItems.findIndex((p) => p.id === active.id);

          let newIndex: number;

          if (overId in items) {
            newIndex = overItems.length + 1;
          } else {
            const isBelowOverItem =
              over &&
              active.rect.current.translated &&
              active.rect.current.translated.top > over.rect.top + over.rect.height;

            const modifier = isBelowOverItem ? 1 : 0;

            newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
          }

          recentlyMovedToNewContainer.current = true;

          return {
            ...items,
            [activeContainer]: items[activeContainer].filter((p) => p.id !== active.id),
            [overContainer]: [
              ...items[overContainer].slice(0, newIndex),
              items[activeContainer][activeIndex],
              ...items[overContainer].slice(newIndex),
            ],
          };
        });
        recentlyMovedToNewContainer.current = true;
      }
    },
    [findContainer]
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

        if (activeIndex !== overIndex) {
          setItems((items) => ({
            ...items,
            [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex),
          }));
        }
      }

      setActive(null);
    },
    [items, findContainer]
  );

  const cancel = useCallback(() => {
    if (clonedItems) {
      // Reset items to their original state in case items have been dragged across containers
      setItems(clonedItems);
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
      session.waitlist.some((p) => p.id === participant.id),
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
