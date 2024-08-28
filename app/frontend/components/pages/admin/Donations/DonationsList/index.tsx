import { Money } from '@/components/atoms/Money';
import { Spinner } from '@/components/atoms/Spinner';
import Header from '@/components/organisms/Header';
import QuoteIcon from '@/icons/QuoteIcon';
import { SortIcon } from '@/icons/SortIcon';
import { useQuery } from '@apollo/client';
import { Badge, Box, Button, Dialog, Flex, HoverCard, Inset, Table, Text } from '@radix-ui/themes';
import { useChildMatches, useNavigate } from '@tanstack/react-router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FragmentOf } from 'gql.tada';
import { useEffect, useMemo, useState } from 'react';
import { DonationDetails } from './DonationDetails';
import { DonationsQuery, DonationsRowFragment } from './queries';

import classes from './DonationsList.module.css';

type Donation = FragmentOf<typeof DonationsRowFragment>;

const columnHelper = createColumnHelper<Donation>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (cell) => (cell.row.original.anonymous ? '(Anonymous)' : cell.getValue()),
    sortDescFirst: false,
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: (cell) => <Money cents={cell.getValue()} />,
    sortDescFirst: false,
  }),
  columnHelper.accessor('message', {
    header: 'Message',
    cell: (cell) =>
      cell.getValue() ? (
        <HoverCard.Root>
          <HoverCard.Trigger>
            <Box>
              <QuoteIcon />
            </Box>
          </HoverCard.Trigger>
          <HoverCard.Content maxWidth="16rem">
            <Text size="2">{cell.getValue()}</Text>
          </HoverCard.Content>
        </HoverCard.Root>
      ) : null,
    sortUndefined: 1,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Date',
    cell: (cell) => cell.getValue()?.toFormat('d MMMM'),
    sortDescFirst: true,
  }),
];

export const DonationsList = () => {
  const { loading, data } = useQuery(DonationsQuery);

  // const navigate = useNavigate();

  const donations = useMemo(() => data?.donations ?? [], [data]);

  const total = useMemo(
    () => donations.reduce((acc, donation) => acc + donation.amount, 0),
    [donations]
  );

  const { selected, close } = useSelectedDonation(donations);

  const table = useReactTable<Donation>({
    columns,
    data: donations,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: 'date',
          desc: true,
        },
      ],
    },
  });

  const headers = table.getLeafHeaders().filter((header) => header.column.getIsVisible());

  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  useEffect(() => {
    if (selected) setSelectedDonation(selected);
  }, [selected]);

  return (
    <>
      <Header
        title={
          <Flex justify="between" align="center">
            <h1>Donations</h1>
            {!loading && (
              <Badge size="3" color="gray" variant="outline">
                <Text size="6">
                  <Money cents={total} /> from {donations.length} donations
                </Text>
              </Badge>
            )}
          </Flex>
        }
      />
      <Table.Root className={classes.table} size="2">
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
                //     to: '/admin/donations/$donationId',
                //     params: { donationId: row.original.id },
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
      <Dialog.Root open={selected !== null} onOpenChange={(isOpen) => !isOpen && close()}>
        {selectedDonation && <DonationDetails donation={selectedDonation} onClose={close} />}
      </Dialog.Root>
    </>
  );
};

const useSelectedDonation = (donations: Donation[]) => {
  const childMatch = useChildMatches().find(
    (match) => match.routeId === '/admin/donations/$donationId'
  );

  const navigate = useNavigate();

  const selected =
    (childMatch &&
      donations.find((r) => r.id === (childMatch.params as { donationId: string }).donationId)) ||
    null;

  const close = () => navigate({ to: '/admin/donations', replace: true });

  return { selected, close };
};
