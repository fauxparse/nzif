import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { groupBy, sortBy, sum, values } from 'lodash-es';
import { useMemo } from 'react';
import { mapValues } from 'xstate/lib/utils';

import { WorkshopPreferencesQuery } from '@/graphql/types';

type Activities = WorkshopPreferencesQuery['festival']['activities'];

type Workshop = Activities[number] & { __typename: 'Workshop'; capacity: number };

type PreferencesBySessionProps = {
  data: Activities;
};

type Session = Activities[number]['sessions'][number] & { activities: Activities };

const columnHelper = createColumnHelper<Session | Workshop>();

const columns = [
  columnHelper.accessor(
    (row) => (row.__typename === 'Session' ? row.startsAt : row.sessions[0].startsAt),
    {
      header: 'Date',
      sortingFn: 'alphanumeric',
      cell: (startsAt) => startsAt.getValue().plus({ days: 0 }).toFormat('ccc d'),
    }
  ),
  columnHelper.accessor(
    (row) => (row.__typename === 'Session' ? row.startsAt : row.sessions[0].startsAt),
    {
      header: 'Time',
      sortingFn: 'alphanumeric',
      cell: (startsAt) => startsAt.getValue().toFormat('h:mm a'),
    }
  ),
  columnHelper.accessor((row) => (row.__typename === 'Workshop' ? row.name : ''), {
    header: 'Name',
  }),
  columnHelper.accessor((row) => (row.__typename === 'Workshop' ? row.stats.counts[0] : ''), {
    header: '1st',
  }),
  columnHelper.accessor((row) => (row.__typename === 'Workshop' ? row.stats.counts[1] : ''), {
    header: '2nd',
  }),
  columnHelper.accessor((row) => (row.__typename === 'Workshop' ? row.stats.counts[2] : ''), {
    header: '3rd',
  }),
  columnHelper.accessor((row) => (row.__typename === 'Workshop' ? sum(row.stats.counts) : ''), {
    header: 'Total',
  }),
  columnHelper.accessor(
    (row) =>
      row.__typename === 'Session'
        ? sum(row.activities.map((a) => (isWorkshop(a) && a.stats.counts[0]) || 0))
        : '',
    {
      header: 'In session',
    }
  ),
  columnHelper.accessor(
    (row) =>
      row.__typename === 'Session'
        ? sum(row.activities.flatMap((a) => (isWorkshop(a) && a.capacity) || 0)) -
          sum(row.activities.map((a) => (isWorkshop(a) && a.stats.counts[0]) || 0))
        : '',
    {
      header: 'Free spots',
    }
  ),
];

const isWorkshop = (a: Activities[number]): a is Workshop => a.__typename === 'Workshop';

const PreferencesBySession: React.FC<PreferencesBySessionProps> = ({ data }) => {
  const sessions: Session[] = useMemo(
    () =>
      sortBy(
        values(
          mapValues(
            groupBy(
              data.flatMap((activity) =>
                activity.sessions.map((session) => ({
                  ...session,
                  activities: [{ ...activity, capacity: session.capacity }],
                }))
              ),
              (s) => s.startsAt.toISO()
            ),
            (sessions) => ({ ...sessions[0], activities: sessions.flatMap((s) => s.activities) })
          )
        ),
        'startsAt'
      ),
    [data]
  );

  const table = useReactTable({
    data: sessions,
    columns,
    state: {
      sorting: [{ id: 'startsAt', desc: false }],
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getSubRows: (row) => (row.__typename === 'Session' ? row.activities.filter(isWorkshop) : []),
  });

  return (
    <table className="data-table">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                colSpan={header.colSpan}
                style={{ width: header.column.getSize() }}
                data-column={header.column.id}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => {
          const sessionCells = row.getVisibleCells();
          return row.subRows.map((subRow, j) => {
            const workshopCells = subRow.getVisibleCells();
            return (
              <tr key={subRow.id}>
                {workshopCells.map((cell, i) =>
                  j && (i < 2 || i > 6) ? null : (
                    <td
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                        paddingLeft: i === 2 ? 'var(--medium)' : undefined,
                        textAlign: i > 2 ? 'center' : undefined,
                      }}
                      data-column={cell.column.id}
                      rowSpan={i > 1 && i < 7 ? 1 : row.subRows.length}
                    >
                      {i < 7
                        ? flexRender(cell.column.columnDef.cell, cell.getContext())
                        : flexRender(
                            sessionCells[i].column.columnDef.cell,
                            sessionCells[i].getContext()
                          )}
                    </td>
                  )
                )}
              </tr>
            );
          });
        })}
      </tbody>
    </table>
  );
};

export default PreferencesBySession;
