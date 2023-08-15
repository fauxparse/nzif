import { CSSProperties } from 'react';
import { useDroppable } from '@dnd-kit/core';

import Person from './Person';
import { Session, Slot } from './types';

type AllocationSessionProps = {
  slot: Slot;
  session: Session;
  zone: number | null | undefined;
};

const AllocationSession: React.FC<AllocationSessionProps> = ({ slot, session, zone }) => {
  const { setNodeRef: setAllocatedRef } = useDroppable({
    id: `${session.id}-allocated`,
    disabled: zone === undefined,
    data: {
      slot,
      session,
    },
  });

  const { setNodeRef: setWaitlistRef } = useDroppable({
    id: `${session.id}-waitlist`,
    disabled: zone === undefined,
    data: {
      slot,
      session,
      waitlist: true,
    },
  });

  return (
    <div
      className="allocations__session"
      style={{ '--capacity': session.capacity } as CSSProperties}
      aria-disabled={zone === undefined || undefined}
    >
      <h4>
        <span>{session.workshop.name}</span>
        <span
          data-oversubscribed={session.size > session.capacity || undefined}
        >{`${session.size}/${session.capacity}`}</span>
      </h4>
      <div ref={setAllocatedRef} className="allocations__allocated">
        {session.registrations.map((reg) => (
          <Person
            key={reg.id}
            registration={reg}
            session={session}
            position={reg.workshopPosition(slot, session.workshop.id)}
          />
        ))}
      </div>
      <div ref={setWaitlistRef} className="allocations__waitlist">
        {session.waitlist.map((reg) => (
          <Person
            key={reg.id}
            registration={reg}
            session={session}
            position={reg.workshopPosition(slot, session.workshop.id)}
          />
        ))}
      </div>
      {zone !== null && (
        <div className="allocations__zone">
          <span>{zone}</span>
        </div>
      )}
    </div>
  );
};

export default AllocationSession;
