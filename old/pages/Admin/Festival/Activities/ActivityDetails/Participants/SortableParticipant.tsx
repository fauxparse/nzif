import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';

import { SessionParticipantFragment } from '@/graphql/types';

import Participant from './Participant';

interface SortableParticipantProps {
  registration: SessionParticipantFragment;
  containerId: UniqueIdentifier;
  id: UniqueIdentifier;
  index: number;
  disabled?: boolean;
  fromWaitlist?: boolean;
}

const SortableParticipant: React.FC<SortableParticipantProps> = ({
  registration,
  containerId,
  disabled,
  id,
  index,
  fromWaitlist,
}) => {
  const {
    setNodeRef,
    setActivatorNodeRef,
    listeners,
    isDragging,
    isSorting,
    transform,
    transition,
  } = useSortable({
    id,
    data: {
      registration,
    },
  });

  return (
    <Participant
      ref={disabled ? undefined : setNodeRef}
      registration={registration}
      dragging={isDragging}
      sorting={isSorting}
      handle={setActivatorNodeRef}
      index={index}
      transition={transition}
      transform={transform}
      listeners={listeners}
      fromWaitlist={fromWaitlist && containerId === 'participants'}
    />
  );
};

export default SortableParticipant;
