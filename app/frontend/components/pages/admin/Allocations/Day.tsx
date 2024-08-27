import { DragOverlay, pointerWithin, rectIntersection } from '@dnd-kit/core';
import { Card, Heading } from '@radix-ui/themes';
import { FragmentOf } from 'gql.tada';
import { uniqBy } from 'lodash-es';
import { DateTime } from 'luxon';
import React, { useMemo, useState } from 'react';
import { useAllocations } from './AllocationsProvider';
import { Person, PersonInner } from './Person';
import { Workshop } from './Workshop';
import { CollisionDetection, DndContext, DragEndEvent, DragStartEvent } from './dndkit';
import { WorkshopAllocationSessionDetailsFragment } from './queries';
import { Registration } from './types';

import styles from './Allocations.module.css';
import { Dropzone } from './Dropzone';

type Session = FragmentOf<typeof WorkshopAllocationSessionDetailsFragment>;

type DayProps = {
  date: DateTime;
};

const gridRow = (session: Session) => {
  if (session.slots.length !== 1) {
    return '1 / span 2';
  }
  if (session.slots[0].startsAt.hour < 12) {
    return '1';
  }
  return '2';
};

const collisionDetection: CollisionDetection = (args) => {
  // First, let's see if there are any collisions with the pointer
  const pointerCollisions = pointerWithin(args);

  // Collision detection algorithms return an array of collisions
  if (pointerCollisions.length > 0) {
    return pointerCollisions as ReturnType<CollisionDetection>;
  }

  // If there are no collisions with the pointer, return rectangle intersections
  return rectIntersection(args) as ReturnType<CollisionDetection>;
};

export const Day: React.FC<DayProps> = ({ date }) => {
  const { days, registration, sortRegistrations, active, setActive, move } = useAllocations();

  const [accepted, setAccepted] = useState(false);

  const sessions = useMemo(() => days.find(([d]) => d.equals(date))?.[1] ?? [], [days, date]);

  const slots = useMemo(
    () =>
      uniqBy(
        sessions.flatMap((s) => s.slots),
        'startsAt'
      ),
    [sessions]
  );

  const unassigned = useMemo(() => {
    const unassigned = new Map<string, Set<string>>();
    for (const session of sessions) {
      for (const registration of session.waitlist) {
        for (const slot of session.slots) {
          const set = unassigned.get(slot.id) ?? new Set();
          set.add(registration.id);
          unassigned.set(slot.id, set);
        }
      }
    }
    for (const session of sessions) {
      for (const registration of session.registrations) {
        for (const slot of session.slots) {
          unassigned.get(slot.id)?.delete(registration.id);
        }
      }
    }

    const sorted = new Map<string, Registration[]>();
    for (const [slot, ids] of unassigned) {
      sorted.set(slot, sortRegistrations(Array.from(ids).map(registration)));
    }
    return sorted;
  }, [sessions, sortRegistrations, registration]);

  const dragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;
    if (!data) return;
    setActive(data);
    setAccepted(false);
  };

  const dragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active.data.current || !over?.data?.current) {
      setActive(null);
      return;
    }

    const { registration, session: from } = active.data.current;
    const { session: to, waitlist } = over.data.current;

    try {
      move({
        registration,
        from: from || { id: 'unassigned', slots: active.data.current.slots },
        to: to || { id: 'unassigned', slots: over.data.current.slots },
        waitlist,
      });
      setAccepted(true);
    } catch (e) {
      console.error(e);
    }

    setActive(null);
  };

  const dragCancel = () => {
    setActive(null);
  };

  return (
    <DndContext
      collisionDetection={collisionDetection}
      onDragStart={dragStart}
      onDragEnd={dragEnd}
      onDragCancel={dragCancel}
    >
      <div className={styles.allocations}>
        <div className={styles.schedule}>
          {sessions.map((session) => (
            <Workshop session={session} key={session.id} style={{ gridRow: gridRow(session) }} />
          ))}
          {slots.map((slot) => (
            <Card
              key={slot.id}
              size="1"
              className={styles.session}
              style={{
                gridRow: `${slot.startsAt.hour < 12 ? 1 : 2} / span ${slots.length > 1 ? 1 : -1}`,
                gridColumn: '-2',
              }}
            >
              <Heading as="h4" size="2" color="gray" weight="regular" mb="2">
                Unassigned
              </Heading>
              <Dropzone session={null} slots={[slot]}>
                {Array.from(unassigned.get(slot.id) ?? []).map((r) => (
                  <Person key={r.id} registration={r} session={null} slots={[slot]} />
                ))}
              </Dropzone>
            </Card>
          ))}
        </div>
      </div>
      <DragOverlay dropAnimation={accepted ? null : undefined}>
        {active && (
          <div className={styles.dragOverlay}>
            <PersonInner {...active} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
