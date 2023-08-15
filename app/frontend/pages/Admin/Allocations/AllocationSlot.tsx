import { Dispatch, useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  pointerWithin,
  useDroppable,
} from '@dnd-kit/core';

import Icon from '@/atoms/Icon';

import AllocationSession from './AllocationSession';
import Person from './Person';
import { DraggableData, DroppableData, Registration, Session, Slot } from './types';
import { DragAction } from './useAllocation';

type AllocationSlotProps = {
  slot: Slot;
  dispatch: Dispatch<DragAction>;
};

const AllocationSlot: React.FC<AllocationSlotProps> = ({ slot, dispatch }) => {
  const { setNodeRef: setUnassignedRef } = useDroppable({
    id: `${slot.id}-unassigned`,
    data: {
      session: null,
      waitlist: true,
    },
  });

  const [dragging, setDragging] = useState<Registration | null>(null);

  const dragStart = (event: DragStartEvent) => {
    setDragging((event.active.data.current as DraggableData).registration);
  };

  const dragEnd = (event: DragEndEvent) => {
    if (!event.over) return;

    const registration = (event.active.data.current as DraggableData).registration;

    const { session, slot, waitlist = false } = event.over.data.current as DroppableData;

    const previousChoice = registration.choices.get(slot.id);
    const workshopId =
      previousChoice && (registration.preferences.get(slot.id) || [])[previousChoice - 1];
    const previous = workshopId && slot.session(workshopId);

    dispatch({
      type: 'drag',
      registration,
      slot,
      previous: previous || null,
      next: session || null,
      waitlist,
    });

    // console.log(
    //   `Drag ${registration.name} to ${session?.workshop?.name || 'unassigned'} ${
    //     waitlist ? 'waitlist' : ''
    //   }`
    // );

    setDragging(null);
  };

  const zones = useMemo(() => {
    if (!dragging) {
      return new Map();
    } else {
      return (dragging.preferences.get(slot.id) || []).reduce((acc, id, i) => {
        const session = slot.session(id);
        return session ? acc.set(session, i + 1) : acc;
      }, new Map<Session, number>());
    }
  }, [slot, dragging]);

  return (
    <DndContext collisionDetection={pointerWithin} onDragStart={dragStart} onDragEnd={dragEnd}>
      <details key={slot.id} className="allocations__slot">
        <summary>
          <Icon name="chevronRight" />
          <h3>{slot.startsAt.plus(0).toFormat('cccc d h:mm a')}</h3>
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
          <div className="allocations__session allocations__session--unassigned">
            <h4>
              <span>Unassigned</span>
            </h4>
            <div ref={setUnassignedRef} className="allocations__waitlist">
              {slot.unassigned.map((reg) => (
                <Person key={reg.id} registration={reg} position={null} />
              ))}
            </div>
          </div>
        </div>
      </details>
    </DndContext>
  );
};

export default AllocationSlot;
