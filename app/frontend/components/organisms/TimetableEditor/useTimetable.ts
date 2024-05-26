import useFestival from '@/hooks/useFestival';
import { useResizeObserver } from '@mantine/hooks';
import { ResultOf } from 'gql.tada';
import { mapValues } from 'lodash-es';
import { DateTime } from 'luxon';
import React, { useCallback, useMemo } from 'react';
import { TimetableQuery } from './queries';
import { Cell, LaidOutSession, normalizeRect } from './types';
import { useDrag } from './useDrag';
import { useLaidOutSessions } from './useLaidOutSessions';
import { useResize } from './useResize';
import { useSelection } from './useSelection';

type UseTimetableOptions = {
  startHour: number;
  endHour: number;
  granularity: number;
};

const defaultOptions = {
  startHour: 9,
  endHour: 1,
  granularity: 4,
} as const;

export const useTimetable = (
  data: ResultOf<typeof TimetableQuery> | undefined,
  options: Partial<UseTimetableOptions> = {}
) => {
  const { startHour, endHour, granularity } = { ...defaultOptions, ...options };

  const festival = useFestival();

  const [startsAt, endsAt] = useMemo(() => {
    const startsAt = festival.startDate.plus({ hours: 0 }).set({ hour: startHour, minute: 0 });
    const endsAt = festival.endDate
      .set({ hour: startHour, minute: 0 })
      .plus({ days: startHour >= endHour ? 1 : 0 });
    return [startsAt, endsAt];
  }, [festival]);

  const rows = useMemo(() => endsAt.diff(startsAt, 'days').days, [startsAt, endsAt]);
  const columns = (endHour - startHour + (startHour >= endHour ? 24 : 0)) * granularity;

  const cellToDateTime = useCallback(
    ({ row, column }: Cell): DateTime =>
      startsAt.plus({
        days: row,
        hours: Math.floor(column / granularity),
        minutes: (column % granularity) * (60 / granularity),
      }),
    [startsAt, granularity]
  );

  const dateTimeToCell = useCallback(
    (time: DateTime): Cell => {
      const row = time.startOf('day').diff(startsAt.startOf('day'), 'days').days;
      const { hours, minutes } = time.diff(startsAt.plus({ days: row }).set({ hour: startHour }), [
        'hours',
        'minutes',
      ]);
      return {
        row,
        column: hours * granularity + Math.floor(minutes / (60 / granularity)),
      };
    },
    [startsAt, granularity]
  );

  const [topLeft, topLeftRect] = useResizeObserver({ box: 'border-box' });
  const [firstColumn, firstColumnRect] = useResizeObserver({ box: 'border-box' });

  const rowHeaderWidth = topLeftRect.width + 1;
  const cellWidth = (firstColumnRect.width + firstColumnRect.x * 2) / granularity;

  const sessions = useMemo(() => data?.festival.timetable.sessions || [], [data]);

  const cellFromMouseEvent = useCallback(
    (event: React.MouseEvent<HTMLDivElement>): Cell => {
      const el = event.currentTarget.closest('.grid__row') as HTMLDivElement;
      const row = parseInt(el.dataset.row || '0', 10);
      const x = event.clientX - el.getBoundingClientRect().left - rowHeaderWidth;
      const column = Math.min(Math.max(0, Math.floor(x / cellWidth)), columns - 1);
      return { row, column };
    },
    [rowHeaderWidth, cellWidth]
  );

  const {
    selection,
    start: startSelection,
    move: moveSelection,
    end: endSelection,
  } = useSelection();

  const { resizing, start: startResize, move: moveResize, end: endResize } = useResize();

  const { dragging, start: startDrag, move: moveDrag, end: endDrag } = useDrag({ columns });

  const rowMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (selection.state === 'selecting') return;

      if (event.button !== 0) return;

      const cell = cellFromMouseEvent(event);
      startSelection(cell);

      const mouseUp = () => {
        endSelection();
        window.removeEventListener('mouseup', mouseUp);
      };

      window.addEventListener('mouseup', mouseUp);
    },
    [selection, cellFromMouseEvent, startSelection, endSelection]
  );

  const rowMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const cell = cellFromMouseEvent(event);

      if (resizing.state === 'resizing') {
        moveResize(cell);
      } else if (dragging.state === 'dragging') {
        moveDrag(cell);
      } else if (selection.state === 'selecting') {
        moveSelection(cell);
      }
    },
    [resizing, dragging, selection, cellFromMouseEvent, moveResize, moveDrag, moveSelection]
  );

  const laidOutSessions = useLaidOutSessions(sessions, { rows, dateTimeToCell });

  const resizeMouseDown = useCallback(
    (laidOutSession: LaidOutSession, e: React.MouseEvent<HTMLDivElement>) => {
      const cell = cellFromMouseEvent(e);
      startResize(laidOutSession, cell);
      const mouseUp = () => {
        endResize();
        window.removeEventListener('mouseup', mouseUp);
      };

      window.addEventListener('mouseup', mouseUp);
      e.stopPropagation();
    },
    [cellFromMouseEvent, startResize, endResize]
  );

  const dragMouseDown = useCallback(
    (laidOutSession: LaidOutSession, e: React.MouseEvent<HTMLDivElement>) => {
      const cell = cellFromMouseEvent(e);
      startDrag(laidOutSession, cell);
      const mouseUp = () => {
        endDrag();
        window.removeEventListener('mouseup', mouseUp);
      };

      window.addEventListener('mouseup', mouseUp);
      e.stopPropagation();
    },
    [cellFromMouseEvent, startDrag, endDrag]
  );

  return {
    startsAt,
    endsAt,
    startHour,
    endHour,
    granularity,
    rows,
    columns,
    dateTimeToCell,
    topLeft,
    firstColumn,
    rowMouseDown,
    rowMouseMove,
    resizeMouseDown,
    dragMouseDown,
    resizing: resizing.state === 'resizing' ? resizing.laidOutSession.session : null,
    dragging: dragging.state === 'dragging' ? dragging : null,
    selection:
      selection.state === 'idle' || (selection.state === 'selecting' && !selection.moved)
        ? null
        : normalizeRect(selection.rect),
    sessions:
      resizing.state === 'resizing'
        ? mapValues(laidOutSessions, (group) =>
            group.map((s) =>
              s.session.id === resizing.laidOutSession.session.id
                ? { ...s, rect: normalizeRect(resizing) }
                : s
            )
          )
        : laidOutSessions,
  };
};
