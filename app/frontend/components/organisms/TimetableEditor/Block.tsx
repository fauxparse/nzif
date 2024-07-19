import { activityColor } from '@/constants/activityTypes';
import { Box, BoxProps, Text, Theme } from '@radix-ui/themes';
import { HTMLMotionProps, motion } from 'framer-motion';
import React, { PropsWithChildren, forwardRef } from 'react';
import { LaidOutSession, Rect, Session } from './types';

import { formatSessionTime } from '@/util/formatSessionTime';
import classes from './TimetableEditor.module.css';

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
    <Theme asChild accentColor={activityColor(session.activityType)}>
      <motion.div
        ref={ref}
        layoutId={String(session.id)}
        className={classes.block}
        style={{
          ...style,
          gridColumnStart: rect.start.column + 2,
          gridColumnEnd: rect.end.column + 3,
        }}
        transition={animate ? { type: 'spring', stiffness: 500, damping: 30 } : { duration: 0 }}
        data-color={activityColor(session.activityType)}
        data-empty={!session.activity || undefined}
        {...props}
      >
        <motion.div layout="position" className={classes.blockContent}>
          <Text size="2" as="p" truncate>
            {session.activity?.name}
          </Text>
          <Text size="1" as="p" truncate>
            {session.venue
              ? [session.venue.room, session.venue.building].filter(Boolean).join(' @ ')
              : 'Venue TBC'}
          </Text>
          <Text size="1" as="p" truncate className={classes.blockTime}>
            {formatSessionTime(session)}
          </Text>
        </motion.div>
        {children}
      </motion.div>
    </Theme>
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
