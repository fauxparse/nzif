import { CSSProperties } from 'react';
import { useDraggable } from '@dnd-kit/core';

import Position from './Position';
import { Registration, Session } from './types';

type PersonProps = {
  registration: Registration;
  position: number | null;
  session?: Session | null;
  waitlist?: boolean;
};

const Person: React.FC<PersonProps> = ({
  registration,
  position,
  session = null,
  waitlist = false,
}) => {
  const id = [registration.id, session?.id].filter(Boolean).join('-') as string;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
      registration,
      session,
      waitlist,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        boxShadow: 'var(--shadow-3)',
        zIndex: 10,
        cursor: 'grabbing',
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      className="allocations__person"
      key={registration.id}
      style={
        {
          ...style,
          '--person-border': registration.color,
          '--person-background': registration.background,
        } as CSSProperties
      }
      data-dragging={!!transform || undefined}
      data-registration-id={registration.id}
      data-session-id={session?.id || undefined}
      {...listeners}
      {...attributes}
    >
      <Position position={position} />
      <span>{registration.name}</span>
      <span className="allocations__person__score">{registration.score}</span>
    </div>
  );
};

export default Person;