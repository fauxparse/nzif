import { map, memoize, partition, range, tap } from 'lodash-es';
import { DateTime } from 'luxon';
import { useCallback, useContext, useMemo } from 'react';

import {
  SessionAttributes,
  TimetableSessionFragment,
  useUpdateSessionMutation,
} from '@/graphql/types';
import { Cell } from '@/molecules/Grid/Grid.types';
import Context from '../Context';

export type Schedule = TimetableSessionFragment;

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

const overlaps = (a: Block, b: Block) =>
  a.row === b.row && a.column < b.column + b.width && b.column < a.column + a.width;

const gcd = (
  (map: Map<number, Map<number, number>>) =>
  (x: number, y: number): number => {
    const xs = map.get(x) ?? tap(new Map(), (m) => map.set(x, m));
    return xs.get(y) ?? tap(!y ? x : gcd(y, x % y), (result) => xs.set(y, result));
  }
)(new Map());

const lcm = (...arr: number[]) => arr.reduce((a, b) => (a * b) / gcd(a, b));

const useTimetable = <T extends Schedule = Schedule>(schedules: T[]) => {
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
        data: schedule as T,
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
    const groups = schedules.reduce(
      (groups, schedule) => {
        const block = scheduleToBlock(schedule);
        const group = groups.get(block.row) || [];
        return groups.set(block.row, [...group, block]);
      },
      new Map<number, Block<T>[]>(dates.map((_, i) => [i, []]))
    );

    return dates.reduce<Row<T>[]>((acc, date, i) => {
      const tracks = arrangeRow(groups.get(i) || []);
      return acc.concat([
        ...tracks.flatMap((blocks, track) => ({
          date,
          row: i,
          track,
          tracks: tracks.length,
          blocks: blocks.map((b) => ({ ...b, row: acc.length + track })),
        })),
      ]);
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

  const [updateSession] = useUpdateSessionMutation();

  const moveSession = useCallback(
    ({ session, startsAt }: { session: T; startsAt: DateTime }) => {
      const endsAt = startsAt.plus(session.endsAt.diff(session.startsAt));
      updateSession({
        variables: {
          id: session.id,
          attributes: { startsAt, endsAt } as SessionAttributes,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateSession: {
            __typename: 'UpdateSessionPayload',
            session: {
              ...session,
              startsAt,
              endsAt,
            },
          },
        },
      });
    },
    [updateSession]
  );

  return { dates, rows, groupHeights, selectionHeight, cellToTime, timeToCell, moveSession };
};

export default useTimetable;
