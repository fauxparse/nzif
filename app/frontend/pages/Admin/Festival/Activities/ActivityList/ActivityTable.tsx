import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { first } from 'lodash-es';
import { DateTime } from 'luxon';

import Avatar from '@/atoms/Avatar';
import Button from '@/atoms/Button';
import Icon from '@/atoms/Icon';
import {
  ActivityListActivityFragment,
  ActivityPresenterFragment,
  ActivityType,
  useActivityListQuery,
} from '@/graphql/types';
import Tooltip from '@/helpers/Tooltip';

type ActivityTableProps = {
  type: ActivityType;
};

type ActivityRow = Omit<ActivityListActivityFragment, 'sessions' | 'presenters'> & {
  session: ActivityListActivityFragment['sessions'][number] | null;
  presenters: ActivityPresenterFragment[];
};

const columnHelper = createColumnHelper<ActivityRow>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    sortingFn: 'alphanumeric',
    cell: (name) => (
      <Button ghost as={Link} to={`./${name.row.original.slug}`}>
        <MissingInfo activity={name.row.original} />
        {name.getValue()}
      </Button>
    ),
  }),
  columnHelper.accessor((row) => row.presenters.map((p) => p.name).join(', '), {
    header: 'Presenters',
    sortingFn: 'alphanumeric',
    cell: (presenters) => (
      <>
        {presenters.row.original.presenters.map((presenter) => (
          <Button
            className="presenter"
            key={presenter.id}
            inline
            as={Link}
            to={`/admin/people/${presenter.id}`}
            icon={<Avatar {...presenter} />}
            text={presenter.name}
          />
        ))}
      </>
    ),
  }),
  columnHelper.group({
    id: 'startsAt',
    columns: [
      columnHelper.accessor((row) => row.session?.startsAt, {
        id: 'time',
        header: 'Time',
        size: 100,
        maxSize: 100,
        enableSorting: false,
        cell: (date) => date.getValue()?.toLocaleString(DateTime.TIME_SIMPLE),
      }),
      columnHelper.accessor((row) => row.session?.startsAt?.toJSDate(), {
        id: 'date',
        header: 'Date',
        sortingFn: 'datetime',
        cell: (cell) => {
          const date = cell.getValue();
          if (!date) return null;
          return DateTime.fromJSDate(date).toFormat('cccc d LLLL');
        },
      }),
    ],
  }),
  columnHelper.accessor(
    ({ session }) => {
      const v = session?.venue;
      return first([v?.room, v?.building]);
    },
    {
      id: 'venue',
      header: 'Venue',
      sortingFn: 'alphanumeric',
    }
  ),
];

const MissingInfo: React.FC<{ activity: ActivityRow }> = ({ activity }) => {
  if (!activity.missingInfo.length) return <Icon className="missing-info" />;

  return (
    <Tooltip
      content={
        <ul>
          {activity.missingInfo.map((info) => (
            <li key={info}>{info}</li>
          ))}
        </ul>
      }
    >
      <Icon className="missing-info" name="alert" />
    </Tooltip>
  );
};

const ActivityTable: React.FC<ActivityTableProps> = ({ type }) => {
  const { data } = useActivityListQuery({ variables: { type } });
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);

  const rows = useMemo<ActivityRow[]>(
    () =>
      (data?.festival?.activities || []).flatMap((a) =>
        (a.sessions.length ? a.sessions : [null]).map((session) => ({ ...a, session }))
      ),
    [data]
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  return (
    <div className="activity-list">
      <div className="data-table__container">
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
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <Button
                        ghost
                        onClick={() => header.column.toggleSorting()}
                        data-sort={header.column.getIsSorted()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <Icon>
                          <path d="M7 9L12 4L17 9" />
                          <path d="M7 15L12 20L17 15" />
                        </Icon>
                      </Button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                    data-column={cell.column.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityTable;
