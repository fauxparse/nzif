import { useCallback, useContext, useMemo } from 'react';
import { map, memoize, partition, range, sortBy } from 'lodash-es';
import { DateTime } from 'luxon';

import { Cell } from '../../../../molecules/Grid/Grid.types';
import Context from '../Context';

export interface Schedule {
  startsAt: DateTime;
  endsAt: DateTime;
}

export interface Block<T extends Schedule = Schedule> {
  row: number;
  column: number;
  width: number;
  height: number;
  track: number;
  data: T;
}

export type Row<T extends Schedule> = {
  date: DateTime;
  row: number;
  track: number;
  tracks: number;
  blocks: Block<T>[];
};

const SCHEDULES = [
  {
    startsAt: DateTime.fromISO('2023-10-09T10:00:00+13:00'),
    endsAt: DateTime.fromISO('2023-10-09T13:00:00+13:00'),
  },
  {
    startsAt: DateTime.fromISO('2023-10-09T10:00:00+13:00'),
    endsAt: DateTime.fromISO('2023-10-09T13:00:00+13:00'),
  },
  {
    startsAt: DateTime.fromISO('2023-10-09T10:00:00+13:00'),
    endsAt: DateTime.fromISO('2023-10-09T13:00:00+13:00'),
  },
  {
    startsAt: DateTime.fromISO('2023-10-09T18:30:00+13:00'),
    endsAt: DateTime.fromISO('2023-10-09T19:30:00+13:00'),
  },
  {
    startsAt: DateTime.fromISO('2023-10-09T19:00:00+13:00'),
    endsAt: DateTime.fromISO('2023-10-09T20:00:00+13:00'),
  },
  {
    startsAt: DateTime.fromISO('2023-10-09T19:30:00+13:00'),
    endsAt: DateTime.fromISO('2023-10-09T20:30:00+13:00'),
  },
  {
    startsAt: DateTime.fromISO('2023-10-10T10:00:00+13:00'),
    endsAt: DateTime.fromISO('2023-10-10T10:00:00+13:00'),
  },
];

const overlaps = (a: Block, b: Block) =>
  a.row === b.row && a.column < b.column + b.width && b.column < a.column + a.width;

const gcd = memoize((x: number, y: number) => (!y ? x : gcd(y, x % y)));

const lcm = (...arr: number[]) => arr.reduce((a, b) => (a * b) / gcd(a, b));

const useTimetable = <T extends Schedule = Schedule>(schedules = SCHEDULES as T[]) => {
  const { startDate, endDate, startHour, granularity } = useContext(Context);

  const dates = useMemo(() => {
    const start = startDate.startOf('day');
    return range(endDate.diff(startDate, 'days').days + 1).map((days) => start.plus({ days }));
  }, [startDate, endDate]);

  const timeToCell = useCallback(
    (time: DateTime): Cell => {
      const early = time.hour < startHour;
      const column =
        (time.hour + (early ? 24 : 0) - startHour) * granularity +
        Math.floor(time.minute / (60 / granularity));
      const date = time.minus({ days: early ? 1 : 0 }).startOf('day');
      const row = date.diff(startDate, 'days').days;
      return { row, column };
    },
    [granularity, startDate, startHour]
  );

  const cellToTime = useCallback(
    (cell: Cell): DateTime => {
      return dates[cell.row].set({ hour: startHour }).plus({
        hours: Math.floor(cell.column / granularity),
        minutes: (cell.column % granularity) * (60 / granularity),
      });
    },
    [dates, granularity, startHour]
  );

  const scheduleToBlock = useCallback(
    (schedule: T): Block<T> => {
      const startCell = timeToCell(schedule.startsAt);
      const endCell = timeToCell(schedule.endsAt);
      return {
        ...startCell,
        width: endCell.column - startCell.column,
        height: 1,
        data: schedule,
        track: 0,
      };
    },
    [timeToCell]
  );

  const arrangeRow = useCallback((row: Block<T>[]) => {
    if (row.length === 0) return [[]];
    const groups = row
      .reduce((groups, block) => {
        const [yes, no] = partition(groups, (g) => g.some((b) => overlaps(b, block)));
        return [[...yes.flat(), block], ...no];
      }, [] as Block<T>[][])
      .map((group) =>
        group.reduce(
          (tracks, block) => {
            const i = tracks.findIndex((track) => !track.some((b) => overlaps(b, block)));
            if (i === -1) {
              tracks.push([block]);
            } else {
              tracks[i].push(block);
            }
            return tracks;
          },
          [[]] as Block<T>[][]
        )
      );
    const total = lcm(...map(groups, 'length'));
    const inflated = groups.flatMap((tracks) => {
      const height = total / tracks.length;
      return tracks.flatMap((track, i) =>
        track.map((block) => ({ ...block, track: i * height, height }))
      );
    });
    return range(total + 1).map((i) => inflated.filter((block) => block.track === i));
  }, []);

  const rows = useMemo(() => {
    const groups = sortBy(schedules, 'startsAt').reduce((groups, schedule) => {
      const block = scheduleToBlock(schedule);
      const group = groups.get(block.row) || [];
      return groups.set(block.row, [...group, block]);
    }, new Map<number, Block<T>[]>(dates.map((_, i) => [i, []])));

    return dates.reduce<Row<T>[]>((acc, date, i) => {
      const tracks = arrangeRow(groups.get(i) || []);
      return [
        ...acc,
        ...tracks.flatMap((blocks, track) => ({
          date,
          row: i,
          track,
          tracks: tracks.length,
          blocks: blocks.map((b) => ({ ...b, row: acc.length + track })),
        })),
      ];
    }, []);
  }, [arrangeRow, dates, scheduleToBlock, schedules]);

  const groupHeights = useMemo(
    () =>
      rows.reduce<Map<number, number>>((acc, { row, tracks }) => acc.set(row, tracks), new Map()),
    [rows]
  );

  const selectionHeight = useMemo(
    () =>
      memoize(
        (row: number, height: number) =>
          range(row, row + height).reduce((total, i) => total + (groupHeights.get(i) ?? 0), 0),
        (row, height) => `${row}-${height}`
      ),
    [groupHeights]
  );

  return { rows, groupHeights, selectionHeight, cellToTime, timeToCell };
};

export default useTimetable;
