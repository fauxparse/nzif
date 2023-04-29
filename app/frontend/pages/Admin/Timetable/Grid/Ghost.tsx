import { forwardRef, PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { useSelector } from '@xstate/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { clamp, kebabCase } from 'lodash-es';
import { DateTime } from 'luxon';

import { useTimetableContext } from '../Context';
import { TimetableQuery } from '@/graphql/types';
import { Cell } from '@/molecules/Grid/Grid.types';

import { useGridContext } from './Context';

type Slot = TimetableQuery['festival']['timetable']['slots'][0];

type GhostProps = PropsWithChildren<{
  offset: Cell & { x: number; y: number };
  onMove: (params: { slot: Slot; startsAt: DateTime }) => void;
}>;

const Ghost = forwardRef<HTMLDivElement, GhostProps>(({ offset, onMove }, ref) => {
  const { machine, selectionHeight, columns, cellToTime } = useGridContext();

  const { slots } = useTimetableContext();

  const ghost = useRef<HTMLDivElement>(null);

  const dragState = useSelector(machine, (state) => state);

  const element = useRef(dragState.context.element);
  const block = useRef(dragState.context.block);

  element.current = dragState.context.element || element.current;

  const { origin } = dragState.context;

  const position = useMemo(
    () => ({
      row: offset.row + origin.row,
      column: clamp(
        offset.column + (block.current?.column || 0),
        0,
        columns - (block.current?.width || 1)
      ),
    }),
    [offset, origin, block, columns]
  );

  const shadow = useMemo(() => {
    return {
      row: selectionHeight(0, position.row),
      column: position.column,
      width: block.current?.width || 0,
      height: selectionHeight(position.row, 1),
    };
  }, [position, block, selectionHeight]);

  const clashes = useMemo(() => {
    const startsAt = cellToTime(position);
    const endsAt = cellToTime({
      ...position,
      column: position.column + (block.current?.width || 1),
    });

    const b = block.current;
    return b
      ? slots.filter(
          (slot) =>
            slot.startsAt < endsAt &&
            slot.endsAt > startsAt &&
            slot.id !== b.data.id &&
            slot.venue?.id === b.data.venue?.id
        )
      : [];
  }, [block, position, slots, cellToTime]);

  useEffect(() => {
    if (!dragState.context.element || !ghost.current) return;
    const rect = dragState.context.element.getBoundingClientRect();
    const { style } = ghost.current;
    style.position = 'absolute';
    style.left = `${rect.left - 2}px`;
    style.top = `${rect.top + document.documentElement.scrollTop - 2}px`;
    style.width = `${rect.width}px`;
    style.height = `${rect.height}px`;
  }, [dragState.context.element]);

  useEffect(() => {
    if (!dragState.matches('dropped') || !block.current?.data) return;
    if (!clashes.length) onMove({ slot: block.current.data, startsAt: cellToTime(position) });
  }, [dragState, clashes, onMove, cellToTime, position]);

  const data = block.current?.data;

  return (
    <>
      <motion.div
        ref={mergeRefs([ref, ghost])}
        className={clsx('ghost', 'timetable__slot', data?.activity && 'timetable__activity')}
        data-activity-type={kebabCase(data?.activityType || 'activity')}
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
          boxShadow: 'var(--shadow-4)',
        }}
        exit={{ opacity: 0 }}
      >
        <span className="timetable__slot__title">{data?.activity?.name || data?.activityType}</span>
        <span className="timetable__slot__venue">{data?.venue?.room || data?.venue?.building}</span>
      </motion.div>
      {dragState.matches('lifted') && (
        <div
          className="ghost__shadow"
          data-activity-type={kebabCase(data?.activityType || 'activity')}
          style={{
            gridRow: `${shadow.row + 2} / span ${shadow.height}`,
            gridColumn: `${shadow.column + 2} / span ${shadow.width}`,
          }}
        />
      )}
    </>
  );
});

Ghost.displayName = 'Ghost';

export default Ghost;
