import { UniqueIdentifier } from '@dnd-kit/core';
import { AnimateLayoutChanges, defaultAnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { get } from 'lodash-es';
import React from 'react';

import { AdminActivitySessionDetailsFragment, SessionParticipantFragment } from '@/graphql/types';

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

const TITLES = {
  participants: 'Participants',
  waitlist: 'Waitlist',
} as const;

export interface ContainerProps {
  id: UniqueIdentifier;
  session: AdminActivitySessionDetailsFragment;
  children: React.ReactNode;
  disabled?: boolean;
  items: SessionParticipantFragment[];
}

const Container: React.FC<ContainerProps> = ({
  session,
  children,
  disabled,
  id,
  items,
  ...props
}) => {
  const { active, over, setNodeRef } = useSortable({
    id,
    data: {
      type: 'container',
      children: items,
    },
    animateLayoutChanges,
  });

  const isOverContainer = over
    ? (id === over.id && active?.data.current?.type !== 'container') ||
      !!items.find((p) => p.id === over.id)
    : false;

  return (
    <section
      data-over={isOverContainer || undefined}
      data-over-full={
        (id === 'participants' && items.length > (session.capacity || 16)) || undefined
      }
    >
      <motion.h2 key={id} layout layoutId={`${id}`}>
        {get(TITLES, id)}
        <small>{items.length}</small>
      </motion.h2>
      <div ref={disabled ? undefined : setNodeRef} className="session__participants" {...props}>
        {children}
      </div>
    </section>
  );
};

export default Container;
