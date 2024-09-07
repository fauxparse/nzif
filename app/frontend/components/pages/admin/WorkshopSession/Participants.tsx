import React, { useMemo, useState } from 'react';

import TrashIcon from '@/icons/TrashIcon';
import UsersIcon from '@/icons/UsersIcon';
import WaitlistIcon from '@/icons/WaitlistIcon';
import { useDarkMode } from '@/services/Themes';
import {
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card, Flex, Heading, Inset, Separator, Theme } from '@radix-ui/themes';
import { sortBy } from 'lodash-es';
import pluralize from 'pluralize';
import { createPortal } from 'react-dom';
import { DraggablePerson, Person, SortablePerson } from './Person';
import classes from './WorkshopSession.module.css';
import { useWorkshopSessionContext } from './WorkshopSessionProvider';
import {
  CollisionDetection,
  DndContext,
  DragEndEvent,
  DraggableData,
  DroppableData,
  useDroppable,
} from './dndkit';
import type { ListId, Registration } from './types';

export const Participants: React.FC = () => {
  const { session, addToSession, addToWaitlist, removeFromSession, removeFromWaitlist } =
    useWorkshopSessionContext();

  const [active, setActive] = useState<DraggableData | null>(null);
  const [over, setOver] = useState<DroppableData | null>(null);

  const { isDarkMode } = useDarkMode();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { participants, waitlist } = useMemo(() => {
    const lists: Record<ListId, Registration[]> = {
      participants: sortBy(session.participants ?? [], 'user.name'),
      waitlist: [...session.waitlist],
      trash: [],
    };

    if (!active || !over) return lists;

    if (active?.sortable) {
      // coming from waitlist
      if (!over.sortable && !over.waitlist) {
        if (!over.trash) {
          lists.waitlist = lists.waitlist.filter((p) => p.id !== active.registration.id);
          lists.participants = sortBy([...lists.participants, active.registration], 'user.name');
        }
      }
    } else {
      // coming from participants
      if (over.sortable?.containerId === 'waitlist') {
        lists.participants = lists.participants.filter((p) => p.id !== active.registration.id);
        lists.waitlist.push(active.registration);
      }
    }

    return lists;
  }, [session, active, over]);

  const drop = ({ active, over }: DragEndEvent) => {
    setActive(null);
    setOver(null);

    if (!active?.data?.current || !over) return;

    const { registration } = active.data.current;
    if (!registration) return;

    const fromWaitlist = session.waitlist.some((w) => w.id === registration.id);

    if (over.data.current?.sortable || over.id === 'waitlist') {
      if (fromWaitlist) {
        const position = (over.data.current?.sortable?.index ?? waitlist.length) + 1;
        addToWaitlist(registration, position);
      } else {
        const position = (over.data.current?.sortable?.index ?? waitlist.length) + 1;
        addToWaitlist(registration, position);
      }
    } else if (over.data.current?.trash) {
      (fromWaitlist ? removeFromWaitlist : removeFromSession)(registration);
    } else if (fromWaitlist) {
      addToSession(registration);
    }
  };

  return (
    <div className={classes.participants}>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
        onDragStart={({ active, ...rest }) => {
          setActive(active.data.current ?? null);
        }}
        onDragOver={({ over }) => {
          setOver(over?.data.current ?? null);
        }}
        onDragEnd={drop}
      >
        <ParticipantList participants={participants} />
        <Waitlist participants={waitlist} isOver={!!over?.sortable} />
        {createPortal(
          <DragOverlay>
            {active ? (
              <Theme asChild appearance={isDarkMode ? 'dark' : 'light'}>
                <div className={classes.dragOverlay}>
                  <Person
                    registration={active.registration}
                    waitlisted={active.sortable?.containerId === 'waitlist'}
                  />
                </div>
              </Theme>
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

const ParticipantList: React.FC<{ participants: Registration[] }> = ({ participants }) => {
  const { session } = useWorkshopSessionContext();

  const { setNodeRef, isOver } = useDroppable({
    id: 'participants',
    data: { waitlist: false },
  });

  return (
    <Card ref={setNodeRef} className={classes.list} data-over={isOver || undefined}>
      <Flex asChild align="center" gap="2">
        <Heading size="3" as="h3">
          <UsersIcon />
          {`${participants.length}/${session.capacity} participants`}
        </Heading>
      </Flex>
      <Inset side="x">
        <Separator size="4" my="4" />
      </Inset>
      {participants.map((registration) => (
        <DraggablePerson key={registration.id} registration={registration} />
      ))}
    </Card>
  );
};

const Waitlist: React.FC<{ participants: Registration[]; isOver: boolean }> = ({
  participants,
  isOver: isOverWaitlist,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'waitlist',
    data: { waitlist: true },
  });

  return (
    <Card
      ref={setNodeRef}
      className={classes.list}
      data-over={isOver || isOverWaitlist || undefined}
    >
      <Flex asChild align="center" gap="2">
        <Heading size="3" as="h3">
          <WaitlistIcon />
          {pluralize('waitlisted participant', participants.length, true)}
        </Heading>
      </Flex>
      <Inset side="x">
        <Separator size="4" my="4" />
      </Inset>
      <SortableContext id="waitlist" items={participants} strategy={verticalListSortingStrategy}>
        <div style={{ flex: 1 }}>
          {participants.map((registration) => (
            <SortablePerson key={registration.id} registration={registration} waitlisted />
          ))}
        </div>
      </SortableContext>
      <Trash />
    </Card>
  );
};

const Trash = () => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'trash',
    data: { trash: true },
  });

  return (
    <div ref={setNodeRef} className={classes.trash} data-over={isOver || undefined}>
      <TrashIcon size="4" color="gray" />
    </div>
  );
};

const collisionDetection: CollisionDetection = (args) => {
  if (args.pointerCoordinates) {
    const elements = document.elementsFromPoint(
      args.pointerCoordinates.x,
      args.pointerCoordinates.y
    );

    const trash = elements.find((element) => element.classList.contains(classes.trash));

    if (trash) {
      return [
        {
          id: 'trash',
          data: {
            current: { trash: true },
          },
          rect: trash.getBoundingClientRect(),
          disabled: false,
        },
      ];
    }
  }

  // First, let's see if there are any collisions with the pointer
  const pointerCollisions = pointerWithin(args);

  // Collision detection algorithms return an array of collisions
  if (pointerCollisions.length > 0) {
    return pointerCollisions as ReturnType<CollisionDetection>;
  }

  // If there are no collisions with the pointer, return rectangle intersections
  return rectIntersection(args) as ReturnType<CollisionDetection>;
};
