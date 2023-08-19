import { Dispatch, useMemo, useState } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, pointerWithin } from '@dnd-kit/core';
import { lime, red } from '@radix-ui/colors';

import Icon from '@/atoms/Icon';

import AllocationSession from './AllocationSession';
import AllocationTrash from './AllocationTrash';
import { DraggableData, DroppableData, Session, Slot } from './types';
import { DragAction } from './useAllocation';

type AllocationSlotProps = {
  slot: Slot;
  dispatch: Dispatch<DragAction>;
};

const AllocationSlot: React.FC<AllocationSlotProps> = ({ slot, dispatch }) => {
  const [dragging, setDragging] = useState<DraggableData | null>(null);

  const dragStart = (event: DragStartEvent) => {
    setDragging(event.active.data.current as DraggableData);
  };

  const dragEnd = (event: DragEndEvent) => {
    if (!event.over) {
      setDragging(null);
      return;
    }

    const draggable = event.active.data.current as DraggableData;

    const { registration } = draggable;

    const { session, slot, waitlist = false } = event.over.data.current as DroppableData;

    const previousChoice = registration.choices.get(slot.id);
    const workshopId =
      previousChoice && (registration.preferences.get(slot.id) || [])[previousChoice - 1];
    const previous = (!draggable.waitlist && workshopId && slot.session(workshopId)) || null;
    const wasWaitlist = previous?.waitlist?.includes(registration);

    if (previous !== session || wasWaitlist !== waitlist) {
      if (previous) {
        registration.choices.delete(slot.id);
      }

      if (session && !waitlist) {
        registration.place(slot, session.workshop.id, false);
      }

      dispatch({
        type: 'drag',
        registration,
        slot,
        previous: previous || null,
        next: session || null,
        waitlist,
      });
    }

    setDragging(null);
  };

  const zones = useMemo(() => {
    if (!dragging) {
      return new Map();
    } else if (dragging.waitlist) {
      const pref =
        (dragging.registration.preferences.get(slot.id) || []).indexOf(
          dragging.session.workshop.id
        ) + 1;
      return new Map<Session, number>([[dragging.session, pref]]);
    } else {
      return (dragging.registration.preferences.get(slot.id) || []).reduce((acc, id, i) => {
        const session = slot.session(id);
        return session ? acc.set(session, i + 1) : acc;
      }, new Map<Session, number>());
    }
  }, [slot, dragging]);

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={dragStart}
      onDragEnd={dragEnd}
      onDragCancel={() => setDragging(null)}
    >
      <details key={slot.id} className="allocations__slot">
        <summary>
          <Icon name="chevronRight" />
          <h3>{slot.startsAt.plus(0).toFormat('cccc d h:mm a')}</h3>
          <div className="allocations__stats">
            {slot.sessions.map((s) => (
              <span key={s.id} className="allocations__stat" style={{ backgroundColor: s.color }}>
                {s.registrations.length}
              </span>
            ))}
            <span>+</span>
            <span
              className="allocations__stat"
              style={{ backgroundColor: slot.unassigned.length ? red.red9 : lime.lime9 }}
            >
              {slot.unassigned.length}
            </span>
          </div>
        </summary>
        <div className="allocations__sessions">
          {slot.sessions.map((session) => (
            <AllocationSession
              key={session.id}
              slot={slot}
              session={session}
              zone={dragging ? zones.get(session) : null}
            />
          ))}
          <AllocationTrash slot={slot} />
        </div>
      </details>
    </DndContext>
  );
};

export default AllocationSlot;
