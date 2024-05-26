import { ActivityType } from '@/graphql/types';
import { Box, BoxProps, Text } from '@mantine/core';
import { FragmentOf } from 'gql.tada';
import React, { ComponentPropsWithoutRef, forwardRef } from 'react';
import { TimetableSessionFragment } from './queries';
import { LaidOutSession, Rect } from './types';

type BaseBlockProps = BoxProps &
  ComponentPropsWithoutRef<'div'> & {
    session: FragmentOf<typeof TimetableSessionFragment>;
    rect: Rect;
  };

type BlockProps = BaseBlockProps & {
  track: number;
  resizing?: boolean;
  dragging?: boolean;
  onStartResize: (laidOutSession: LaidOutSession, e: React.MouseEvent<HTMLDivElement>) => void;
  onStartDrag: (laidOutSession: LaidOutSession, e: React.MouseEvent<HTMLDivElement>) => void;
};

const BLOCK_COLORS: Record<ActivityType, string> = {
  [ActivityType.Workshop]: 'cyan',
  [ActivityType.Show]: 'magenta',
  [ActivityType.SocialEvent]: 'yellow',
  [ActivityType.Conference]: 'yellow',
};

export const BaseBlock = forwardRef<HTMLDivElement, BaseBlockProps>(
  ({ session, rect, style = {}, children, ...props }, ref) => (
    <Box
      ref={ref}
      className="timetable-editor__session"
      style={{
        ...style,
        gridColumnStart: rect.start.column + 2,
        gridColumnEnd: rect.end.column + 3,
      }}
      data-color={BLOCK_COLORS[session.activityType]}
      {...props}
    >
      <Box className="timetable-editor__session__content">
        <Text>{session.activity?.name}</Text>
        <Text>
          {session.venue
            ? [session.venue.room, session.venue.building].filter(Boolean).join(' @ ')
            : 'Venue TBC'}
        </Text>
      </Box>
      {children}
    </Box>
  )
);

export const Block = forwardRef<HTMLDivElement, BlockProps>(
  (
    { session, rect, track, resizing = false, dragging = false, onStartResize, onStartDrag },
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
      onMouseDown={(e) => onStartDrag({ session, rect, track }, e)}
    >
      <Edge onMouseDown={(e) => onStartResize({ session, rect, track }, e)} />
      <Edge onMouseDown={(e) => onStartResize({ session, rect, track }, e)} />
    </BaseBlock>
  )
);

const Edge: React.FC<BoxProps & { onMouseDown: React.MouseEventHandler<HTMLDivElement> }> = (
  props
) => {
  return <Box className="timetable-editor__session__edge" {...props} />;
};
