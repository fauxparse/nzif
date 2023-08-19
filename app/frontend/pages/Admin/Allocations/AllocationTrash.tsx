import { useDroppable } from '@dnd-kit/core';
import { lime, red } from '@radix-ui/colors';

import Person from './Person';
import { Slot } from './types';

type AllocationTrashProps = {
  slot: Slot;
};

const AllocationTrash: React.FC<AllocationTrashProps> = ({ slot }) => {
  const { setNodeRef: setTrashRef } = useDroppable({
    id: `${slot.sessions[0].id}-trash`,
    data: {
      slot,
      session: null,
    },
  });

  return (
    <div className="allocations__session">
      <h4>
        <span>Unassigned</span>
        <span
          className="allocations__stat"
          style={{ backgroundColor: slot.unassigned.length ? red.red9 : lime.lime9 }}
        >
          {slot.unassigned.length}
        </span>
      </h4>
      <div ref={setTrashRef} className="allocations__waitlist">
        {slot.unassigned.map((reg) => (
          <Person key={reg.id} registration={reg} position={null} />
        ))}
      </div>
    </div>
  );
};

export default AllocationTrash;
