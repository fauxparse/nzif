import { Spinner } from '@/components/atoms/Spinner';
import Header from '@/components/organisms/Header';
import { activityTypeLabel } from '@/constants/activityTypes';
import { FragmentOf } from '@/graphql';
import { SortIcon } from '@/icons/SortIcon';
import { Button, Inset, Link, Table } from '@radix-ui/themes';
import { Link as RouterLink } from '@tanstack/react-router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import pluralize from 'pluralize';
import { AdminActivityListItemFragment, AdminActivityListQuery } from './queries';

import { ActivityType } from '@/graphql/types';
import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import classes from './ActivityList.module.css';

type Activity = FragmentOf<typeof AdminActivityListItemFragment>;
type ActivityWithSession = Omit<Activity, 'sessions'> & { session: Activity['sessions'][number] };

const columnHelper = createColumnHelper<ActivityWithSession>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    sortDescFirst: false,
    cell: (cell) => (
      <Link asChild>
        <RouterLink
          to="/admin/$activityType/$slug/$session"
          params={{
            activityType: cell.row.original.type,
            slug: cell.row.original.slug,
            session: cell.row.original.session.startsAt,
          }}
        >
          {cell.getValue()}
        </RouterLink>
      </Link>
    ),
  }),
  columnHelper.accessor('session.startsAt', {
    id: 'startsAt',
    header: 'Time',
    sortDescFirst: false,
    cell: (cell) => cell.getValue()?.plus({})?.toFormat('h a EEEE d'),
  }),
  columnHelper.accessor('session.count', {
    header: 'Count',
    sortDescFirst: true,
    cell: (cell) => {
      const capacity = cell.row.original.session.capacity;
      const count = cell.getValue();
      if (capacity === null) return null;
      return `${count} / ${capacity}`;
    },
  }),
];

type ActivityListProps = {
  activityType: ActivityType;
};

export const ActivityList: React.FC<ActivityListProps> = ({ activityType }) => {
  const { loading, data } = useQuery(AdminActivityListQuery, {
    variables: { activityType },
  });

  const rows = useMemo(
    () =>
      (data?.festival?.activities || []).flatMap(({ sessions, ...activity }) =>
        sessions.map((session) => ({ ...activity, session }))
      ),
    [data]
  );

  const table = useReactTable<ActivityWithSession>({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: 'startsAt',
          desc: true,
        },
        {
          id: 'name',
          desc: false,
        },
      ],
    },
  });

  const headers = table.getLeafHeaders().filter((header) => header.column.getIsVisible());

  return (
    <>
      <Header title={pluralize(activityTypeLabel(activityType))} />
      <Table.Root className={classes.table} size={{ initial: '2', sm: '3' }}>
        <Table.Header>
          <Table.Row data-hover>
            {headers.map((header) => (
              <Table.ColumnHeaderCell key={header.id}>
                <Inset side="x" asChild>
                  <Button
                    variant="ghost"
                    color="gray"
                    size="3"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}

                    <SortIcon sort={header.column.getIsSorted()} />
                  </Button>
                </Inset>
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={3}>
                <Spinner size="4" />
              </Table.Cell>
            </Table.Row>
          ) : (
            table.getRowModel().rows.map((row) => (
              <Table.Row
                key={row.id}
                // onClick={() =>
                //   navigate({
                //     to: '/admin/payments/$paymentId',
                //     params: { paymentId: row.original.id },
                //     replace: true,
                //   })
                // }
              >
                {row
                  .getVisibleCells()
                  .map((cell, index) =>
                    index ? (
                      <Table.Cell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Table.Cell>
                    ) : (
                      <Table.RowHeaderCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Table.RowHeaderCell>
                    )
                  )}
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
    </>
  );
};
