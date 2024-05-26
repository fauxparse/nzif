import { ActivityType } from '@/graphql/types';
import useFestival from '@/hooks/useFestival';
import { useResizeObserver } from '@mantine/hooks';
import { ResultOf } from 'gql.tada';
import { mapValues } from 'lodash-es';
import { DateTime } from 'luxon';
import React, { useCallback, useEffect, useMemo } from 'react';
import { TimetableQuery } from './queries';
import { Cell, LaidOutSession, Session, normalizeRect } from './types';
import { useDrag } from './useDrag';
import { useLaidOutSessions } from './useLaidOutSessions';
import { useResize } from './useResize';
import { useSelection } from './useSelection';

type UseTimetableOptions = {
  startHour: number;
  endHour: number;
  granularity: number;
  onSelect: (session: Session) => void;
};

const defaultOptions = {
  startHour: 9,
  endHour: 1,
  granularity: 4,
  onSelect: () => {},
} as const;

export const useTimetable = (
  data: ResultOf<typeof TimetableQuery> | undefined,
  options: Partial<UseTimetableOptions> = {}
) => {
  const { startHour, endHour, granularity, onSelect } = { ...defaultOptions, ...options };

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

  const cellFromPointerEvent = useCallback(
    (event: React.PointerEvent<HTMLDivElement>): Cell => {
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

  const rowPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (selection.state === 'selecting') return;

      if (event.button !== 0) return;

      const cell = cellFromPointerEvent(event);
      startSelection(cell);

      const pointerUp = () => {
        endSelection();
        window.removeEventListener('pointerup', pointerUp);
      };

      window.addEventListener('pointerup', pointerUp);
    },
    [selection, cellFromPointerEvent, startSelection, endSelection]
  );

  const rowPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const cell = cellFromPointerEvent(event);

      if (resizing.state === 'resizing') {
        moveResize(cell);
      } else if (dragging.state === 'dragging') {
        moveDrag(cell);
      } else if (selection.state === 'selecting') {
        moveSelection(cell);
      }
    },
    [resizing, dragging, selection, cellFromPointerEvent, moveResize, moveDrag, moveSelection]
  );

  const laidOutSessions = useLaidOutSessions(sessions, { rows, dateTimeToCell });

  const resizePointerDown = useCallback(
    (laidOutSession: LaidOutSession, e: React.PointerEvent<HTMLDivElement>) => {
      const cell = cellFromPointerEvent(e);
      startResize(laidOutSession, cell);
      const pointerUp = () => {
        endResize();
        window.removeEventListener('pointerup', pointerUp);
      };

      window.addEventListener('pointerup', pointerUp);
      e.stopPropagation();
    },
    [cellFromPointerEvent, startResize, endResize]
  );

  const dragPointerDown = useCallback(
    (laidOutSession: LaidOutSession, e: React.PointerEvent<HTMLDivElement>) => {
      const cell = cellFromPointerEvent(e);

      const dragEnabled = getComputedStyle(e.currentTarget).getPropertyValue('--drag-enabled');

      if (dragEnabled === 'false') return;

      startDrag(laidOutSession, cell);
      const pointerUp = () => {
        endDrag();
        window.removeEventListener('pointerup', pointerUp);
      };

      window.addEventListener('pointerup', pointerUp);
      e.stopPropagation();
    },
    [cellFromPointerEvent, startDrag, endDrag]
  );

  useEffect(() => {
    if (selection.state !== 'selected') return;

    const startsAt = cellToDateTime(selection.rect.start);
    const endsAt = cellToDateTime({ ...selection.rect.end, column: selection.rect.end.column + 1 });

    console.log(
      startsAt.toLocaleString(DateTime.DATETIME_MED),
      endsAt.toLocaleString(DateTime.DATETIME_MED)
    );

    const session: Session = {
      id: '',
      startsAt,
      endsAt,
      venue: null,
      activity: null,
      activityType: ActivityType.Workshop,
      capacity: 16,
    };

    onSelect(session);
  }, [selection, onSelect]);

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
    rowPointerDown,
    rowPointerMove,
    startResize: resizePointerDown,
    startDrag: dragPointerDown,
    resizing: resizing.state === 'resizing' ? resizing.laidOutSession.session : null,
    dragging: dragging.state === 'dragging' && dragging.moved ? dragging : null,
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
