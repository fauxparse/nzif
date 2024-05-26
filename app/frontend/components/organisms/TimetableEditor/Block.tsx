import { getActivityColor } from '@/constants/activityTypes';
import { Box, BoxProps, Text } from '@mantine/core';
import { HTMLMotionProps, motion } from 'framer-motion';
import React, { PropsWithChildren, forwardRef } from 'react';
import { LaidOutSession, Rect, Session } from './types';

type BaseBlockProps = PropsWithChildren<Omit<HTMLMotionProps<'div'>, 'children'>> & {
  session: Session;
  rect: Rect;
  animate?: boolean;
};

type BlockProps = Omit<BaseBlockProps, 'onClick'> & {
  track: number;
  resizing?: boolean;
  dragging?: boolean;
  onStartResize: (laidOutSession: LaidOutSession, e: React.PointerEvent<HTMLDivElement>) => void;
  onStartDrag: (laidOutSession: LaidOutSession, e: React.PointerEvent<HTMLDivElement>) => void;
  onClick: (session: Session) => void;
};

export const BaseBlock = forwardRef<HTMLDivElement, BaseBlockProps>(
  ({ session, rect, style = {}, animate = true, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      layoutId={String(session.id)}
      className="timetable-editor__session"
      style={{
        ...style,
        gridColumnStart: rect.start.column + 2,
        gridColumnEnd: rect.end.column + 3,
      }}
      transition={animate ? { type: 'spring', stiffness: 500, damping: 30 } : { duration: 0 }}
      data-color={getActivityColor(session.activityType)}
      {...props}
    >
      <motion.div layout="position" className="timetable-editor__session__content">
        <Text>{session.activity?.name}</Text>
        <Text className="timetable-editor__session__venue">
          {session.venue
            ? [session.venue.room, session.venue.building].filter(Boolean).join(' @ ')
            : 'Venue TBC'}
        </Text>
        <Text className="timetable-editor__session__time">{formatSessionTime(session)}</Text>
      </motion.div>
      {children}
    </motion.div>
  )
);

export const Block = forwardRef<HTMLDivElement, BlockProps>(
  (
    {
      session,
      rect,
      track,
      resizing = false,
      dragging = false,
      onStartResize,
      onStartDrag,
      onClick,
    },
    ref
  ) => (
    <BaseBlock
      ref={ref}
      session={session}
      rect={rect}
      style={{
        gridRow: track + 1,
      }}
      data-resizing={resizing || undefined}
      data-dragging={dragging || undefined}
      onPointerDown={(e) => onStartDrag({ session, rect, track }, e)}
      onClick={() => {
        if (!dragging && !resizing) onClick(session);
      }}
    >
      <Edge onPointerDown={(e) => onStartResize({ session, rect, track }, e)} />
      <Edge onPointerDown={(e) => onStartResize({ session, rect, track }, e)} />
    </BaseBlock>
  )
);

const Edge: React.FC<BoxProps & { onPointerDown: React.PointerEventHandler<HTMLDivElement> }> = (
  props
) => {
  return <Box className="timetable-editor__session__edge" {...props} />;
};

const formatSessionTime = (session: Session) => {
  const { startsAt, endsAt } = session;
  const straddles = Math.floor(startsAt.hour / 12) !== Math.floor(endsAt.hour / 12);
  const startTime = startsAt.toFormat(
    `h${startsAt.minute === 0 ? '' : ':mm'}${straddles ? 'a' : ''}`
  );
  const endTime = endsAt.toFormat(`h${endsAt.minute === 0 ? '' : ':mm'}a`);
  return `${startTime} – ${endTime}`;
};
