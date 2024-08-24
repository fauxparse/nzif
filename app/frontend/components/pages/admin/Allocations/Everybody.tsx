import { SortIcon } from '@/icons/SortIcon';
import { Button, Flex, Inset, Table, Text, Tooltip } from '@radix-ui/themes';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useAllocations } from './AllocationsProvider';

import { ChoiceBadge } from '@/components/atoms/ChoiceBadge';
import tableStyles from '@/components/organisms/RegistrationsList/RegistrationsList.module.css';
import { Link } from '@tanstack/react-router';
import { first, sortBy } from 'lodash-es';
import { DateTime } from 'luxon';
import { useMemo } from 'react';

type TableRow = {
  id: string;
  name: string;
  score: number;
  placements: { date: DateTime; period: 'am' | 'pm'; choice: number | null }[];
};

const columnHelper = createColumnHelper<TableRow>();

const columns = [
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
        {getValue().map(({ date, period, choice }, i) => (
          <Link key={i} to="/admin/allocations/$date" params={{ date }}>
            <Tooltip
              key={i}
              content={`${date.plus({}).toFormat('EEEE d')} (${period === 'pm' ? 'afternoon' : 'morning'})`}
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
  const { registrations, score, placementMap } = useAllocations();

  const rows = useMemo(
    () =>
      registrations.map((registration) => ({
        id: registration.id,
        name: registration.user?.name || '',
        score: score(registration.id),
        placements: sortBy(Array.from(placementMap(registration.id).entries()), first).map(
          ([key, choice]: [string, number | null]) => {
            const [date, period] = key.split(':');
            return { date: DateTime.fromISO(date), period: period as 'am' | 'pm', choice };
          }
        ),
      })),
    [registrations]
  );

  const table = useReactTable<TableRow>({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: 'score',
          desc: true,
        },
      ],
    },
  });

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
                    // onClick={header.column.getToggleSortingHandler()}
                    onClick={() => header.column.toggleSorting()}
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
