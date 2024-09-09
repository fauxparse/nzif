import { Money } from '@/components/atoms/Money';
import { Spinner } from '@/components/atoms/Spinner';
import Header from '@/components/organisms/Header';
import { SortIcon } from '@/icons/SortIcon';
import { useQuery } from '@apollo/client';
import { Button, Dialog, Flex, Inset, Table } from '@radix-ui/themes';
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
import { PaymentDetails } from './PaymentDetails';
import { PaymentsQuery, PaymentsRowFragment } from './queries';

import { lowerCase, upperFirst } from 'lodash-es';
import { PaymentStateProvider, PaymentStateSelect } from './PaymentStateSelect';
import classes from './PaymentsList.module.css';

type Payment = FragmentOf<typeof PaymentsRowFragment>;

const columnHelper = createColumnHelper<Payment>();

const columns = [
  columnHelper.accessor('registration.user.name', {
    header: 'Name',
    sortDescFirst: false,
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    sortDescFirst: false,
    cell: (cell) => upperFirst(lowerCase(cell.getValue().replace(/Payment$/, ''))),
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: (cell) => <Money cents={cell.getValue()} />,
    sortDescFirst: false,
  }),
  columnHelper.accessor('state', {
    header: 'Status',
    sortDescFirst: false,
    cell: (cell) => <PaymentStateSelect payment={cell.row.original} />,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Date',
    cell: (cell) => cell.getValue()?.toFormat('d MMMM'),
    sortDescFirst: true,
  }),
];

export const PaymentsList = () => {
  const { loading, data } = useQuery(PaymentsQuery);

  const payments = useMemo(() => data?.festival?.payments ?? [], [data]);

  const total = useMemo(
    () => payments.reduce((acc, payment) => acc + payment.amount, 0),
    [payments]
  );

  const { selected, close } = useSelectedPayment(payments);

  const table = useReactTable<Payment>({
    columns,
    data: payments,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: 'createdAt',
          desc: true,
        },
      ],
    },
  });

  const headers = table.getLeafHeaders().filter((header) => header.column.getIsVisible());

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    if (selected) setSelectedPayment(selected);
  }, [selected]);

  const afterFees = total * 0.973 - payments.length * 0.3;

  return (
    <PaymentStateProvider>
      <Header
        title={
          <Flex justify="between" align="center">
            <h1>Payments</h1>
          </Flex>
        }
      />
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
            table
              .getRowModel()
              .rows.map((row) => (
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
              ))
          )}
        </Table.Body>
      </Table.Root>
      <Dialog.Root open={selected !== null} onOpenChange={(isOpen) => !isOpen && close()}>
        {selectedPayment && <PaymentDetails payment={selectedPayment} onClose={close} />}
      </Dialog.Root>
    </PaymentStateProvider>
  );
};

const useSelectedPayment = (payments: Payment[]) => {
  const childMatch = useChildMatches().find(
    (match) => match.routeId === '/admin/payments/$paymentId'
  );

  const navigate = useNavigate();

  const selected =
    (childMatch &&
      payments.find((r) => r.id === (childMatch.params as { paymentId: string }).paymentId)) ||
    null;

  const close = () => navigate({ to: '/admin/payments', replace: true });

  return { selected, close };
};
