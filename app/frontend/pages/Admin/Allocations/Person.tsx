import { CSSProperties } from 'react';
import { useDraggable } from '@dnd-kit/core';

import Icon from '@/atoms/Icon';
import ContextMenu from '@/molecules/ContextMenu';

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

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform } = useDraggable({
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
    <ContextMenu.Trigger>
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
        {...attributes}
      >
        <span
          className="allocations__position"
          data-position={position || undefined}
          {...listeners}
          ref={setActivatorNodeRef}
        >
          {position || <Icon name="cancel" />}
        </span>
        <span>{registration.name}</span>
        <span className="allocations__person__score">{registration.score}</span>
      </div>
    </ContextMenu.Trigger>
  );
};

export default Person;
