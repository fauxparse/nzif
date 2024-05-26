import { FragmentOf } from 'gql.tada';
import { groupBy, mapValues, range, sortBy } from 'lodash-es';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { TimetableSessionFragment } from './queries';
import { Cell, LaidOutSession } from './types';

export const useLaidOutSessions = (
  sessions: FragmentOf<typeof TimetableSessionFragment>[],
  {
    rows,
    dateTimeToCell,
  }: {
    rows: number;
    dateTimeToCell: (time: DateTime) => Cell;
  }
) => {
  const days: Record<number, LaidOutSession[]> = useMemo(
    () => ({
      ...Object.fromEntries(range(rows).map((row) => [row, []])),
      ...groupBy(
        sessions.map((session) => ({
          session,
          rect: {
            start: dateTimeToCell(session.startsAt),
            end: dateTimeToCell(session.endsAt.minus({ seconds: 1 })),
          },
          track: 0,
        })),
        (session) => session.rect.start.row
      ),
    }),
    [sessions, rows, dateTimeToCell]
  );

  const laidOut = useMemo(
    () =>
      mapValues(days, (sessions) => {
        const sorted = sortBy(
          sessions,
          (session) => session.rect.start.column,
          ({ session }) => session.venue?.position ?? Infinity
        );
        const tracks = sorted.reduce((acc, current) => {
          for (let track = 0; ; track++) {
            current.track = track;
            if (
              !acc.some(
                (s) =>
                  s.track === track &&
                  s.rect.start.column <= current.rect.end.column &&
                  s.rect.end.column >= current.rect.start.column
              )
            ) {
              break;
            }
          }
          acc.push(current);
          return acc;
        }, [] as LaidOutSession[]);
        return tracks;
      }),
    [days]
  );

  return laidOut;
};
