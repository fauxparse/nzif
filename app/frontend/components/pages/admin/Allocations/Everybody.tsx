import { ChoiceBadge } from '@/components/atoms/ChoiceBadge';
import { SortIcon } from '@/icons/SortIcon';
import WarningIcon from '@/icons/WarningIcon';
import { Button, Flex, Inset, Table, Text, Tooltip } from '@radix-ui/themes';
import { Link } from '@tanstack/react-router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { first, sortBy } from 'lodash-es';
import { DateTime } from 'luxon';
import { useEffect, useMemo } from 'react';
import { useAllocations } from './AllocationsProvider';
import { Session } from './types';

import tableStyles from '@/components/organisms/RegistrationsList/RegistrationsList.module.css';

type TableRow = {
  id: string;
  name: string;
  score: number;
  placements: {
    date: DateTime;
    period: 'am' | 'pm';
    choice: number | null;
    session: Session | undefined;
  }[];
  showWorkshops: number;
};

const columnHelper = createColumnHelper<TableRow>();

const columns = [
  columnHelper.display({
    id: 'warning',
    header: '',
    size: 20,
    cell: ({ row }) =>
      row.original.showWorkshops > 2 && (
        <Tooltip content={`This person is in ${row.original.showWorkshops} show workshops`}>
          <div style={{ width: '1.25rem' }}>
            <WarningIcon color="red" />
          </div>
        </Tooltip>
      ),
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    sortDescFirst: false,
    size: 400,
  }),
  columnHelper.accessor('placements', {
    header: 'Placements',
    enableSorting: false,
    size: 200,
    cell: ({ getValue }) => (
      <Flex align="center" gap="1">
        {getValue().map(({ date, period, choice, session }, i) => (
          <Link key={i} to="/admin/allocations/$date" params={{ date }}>
            <Tooltip
              key={i}
              content={
                <>
                  {session && <div>{session.workshop.name}</div>}
                  <div>
                    {date.plus({}).toFormat('EEEE d')} ({period === 'pm' ? 'afternoon' : 'morning'})
                  </div>
                </>
              }
            >
              <ChoiceBadge key={i} choice={choice} />
            </Tooltip>
          </Link>
        ))}
      </Flex>
    ),
  }),
  columnHelper.accessor('score', {
    header: 'Score',
    sortDescFirst: true,
    size: 200,
  }),
];

export const Everybody = () => {
  const { registrations, score, placementMap, sort, setSort, showWorkshops, days } =
    useAllocations();

  const rows = useMemo(() => {
    const showWorkshops = days
      .flatMap(([_, sessions]) => sessions)
      .filter((session) => !!session.workshop.show)
      .map((session) => new Set(session.registrations.map((r) => r.id)));

    const sessionsByRegistrationAndSlot = new Map<string, Map<string, Session>>();

    for (const [_, sessions] of days) {
      for (const session of sessions) {
        for (const slot of session.slots) {
          for (const registration of session.registrations) {
            const map =
              sessionsByRegistrationAndSlot.get(registration.id) || new Map<string, Session>();
            sessionsByRegistrationAndSlot.set(registration.id, map.set(slot.id, session));
          }
        }
      }
    }

    return registrations.map((registration) => ({
      id: registration.id,
      name: registration.user?.name || '',
      score: score(registration.id),
      placements: sortBy(Array.from(placementMap(registration.id).entries()), first).map(
        ([key, choice]: [string, number | null]) => {
          const date = DateTime.fromISO(key);
          const period = date.toFormat('a').toLowerCase() as 'am' | 'pm';
          return {
            date,
            period,
            choice,
            session: sessionsByRegistrationAndSlot.get(registration.id)?.get(key),
          };
        }
      ),
      showWorkshops: showWorkshops.filter((set) => set.has(registration.id)).length,
    }));
  }, [registrations, days]);

  const table = useReactTable<TableRow>({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: sort,
          desc: sort === 'score',
        },
      ],
    },
  });

  useEffect(() => {
    table.setSorting([{ id: sort, desc: sort === 'score' }]);
  }, [sort]);

  const headers = table.getLeafHeaders().filter((header) => header.column.getIsVisible());

  return (
    <Table.Root className={tableStyles.table} size="2">
      <Table.Header>
        <Table.Row>
          {headers.map((header) => (
            <Table.ColumnHeaderCell key={header.id} style={{ width: `${header.getSize()}px` }}>
              {header.column.getCanSort() ? (
                <Inset side="x" asChild>
                  <Button
                    variant="ghost"
                    color="gray"
                    size="3"
                    onClick={() => {
                      setSort(header.column.id as 'name' | 'score');
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}

                    <SortIcon sort={header.column.getIsSorted()} />
                  </Button>
                </Inset>
              ) : (
                <Text size="3" weight="regular" color="gray">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </Text>
              )}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {table.getRowModel().rows.map((row) => (
          <Table.Row key={row.id}>
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
        ))}
      </Table.Body>
    </Table.Root>
  );
};
