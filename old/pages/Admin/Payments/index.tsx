import {
  ColumnFiltersState,
  FilterFn,
  Row,
  SortingState,
  Table,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '@/Routes';
import Button from '@/atoms/Button';
import Checkbox from '@/atoms/Checkbox';
import Icon from '@/atoms/Icon';
import Money from '@/atoms/Money';
import { PaymentDetailsFragment, PaymentState, usePaymentsQuery } from '@/graphql/types';
import Breadcrumbs from '@/molecules/Breadcrumbs';
import PageHeader from '@/molecules/PageHeader';
import Segmented from '@/molecules/Segmented';
import Dialog from '@/organisms/Dialog';

import {
  PAYMENT_METHOD_ICONS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_STATE_ICONS,
  PAYMENT_STATE_OPTIONS,
  PaymentMethod,
} from './types';

import './Payments.css';

const subsetFilter: FilterFn<PaymentDetailsFragment> = (row, columnId, filterValue: string[]) =>
  filterValue.includes(row.getValue(columnId));

const columnHelper = createColumnHelper<PaymentDetailsFragment>();

const columns = [
  {
    id: 'select',
    size: 72,
    maxSize: 72,
    header: ({ table }: { table: Table<PaymentDetailsFragment> }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }: { row: Row<PaymentDetailsFragment> }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        indeterminate={row.getIsSomeSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  columnHelper.accessor((row) => row.createdAt, {
    id: 'date',
    header: 'Date',
    cell: (date) => date.getValue().toFormat('dd LLL h:mm a'),
  }),
  columnHelper.accessor((row) => row.registration.user?.name, {
    id: 'name',
    header: 'Name',
    sortingFn: 'alphanumeric',
    cell: (name) => (
      <Link to={ROUTES.ADMIN.PAYMENT.buildPath({ id: name.row.original.id })}>
        <span>{name.getValue()}</span>
        <small>{name.row.original.registration.user?.email}</small>
      </Link>
    ),
  }),
  columnHelper.accessor((row) => row.__typename, {
    id: 'method',
    header: 'Method',
    sortingFn: 'alphanumeric',
    filterFn: subsetFilter,
    enableColumnFilter: true,
    cell: (method) => (
      <div className="payments-admin__method" data-state={method.getValue()}>
        <Icon name={PAYMENT_METHOD_ICONS[method.getValue()]} />
        <span>{PAYMENT_METHOD_LABELS[method.getValue()]}</span>
      </div>
    ),
  }),
  columnHelper.accessor('state', {
    header: 'State',
    sortingFn: 'alphanumeric',
    filterFn: subsetFilter,
    enableColumnFilter: true,
    cell: (state) => (
      <div className="payments-admin__state" data-state={state.getValue()}>
        <Icon name={PAYMENT_STATE_ICONS[state.getValue()]} />
        <span>{state.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: (amount) => <Money cents={amount.getValue()} />,
  }),
];

export const Component: React.FC = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { data } = usePaymentsQuery();

  const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    { id: 'state', value: [PaymentState.Approved, PaymentState.Pending] },
    { id: 'method', value: ['CreditCardPayment', 'InternetBankingPayment', 'Voucher'] },
  ]);

  const table = useReactTable({
    data: data?.festival.payments ?? [],
    columns,
    state: {
      sorting,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
  });

  const state = (columnFilters.find((filter) => filter.id === 'state')?.value ||
    []) as PaymentState[];
  const method = (columnFilters.find((filter) => filter.id === 'method')?.value ||
    []) as PaymentMethod[];

  const setFilter = (id: string) => (value: string[]) => table.getColumn(id)?.setFilterValue(value);

  return (
    <div className="payments-admin">
      <PageHeader>
        <Breadcrumbs />
        <h1>Payments</h1>
        <div className="payments-admin__filters">
          <Segmented options={PAYMENT_STATE_OPTIONS} value={state} onChange={setFilter('state')} />
          <Segmented
            options={PAYMENT_METHOD_OPTIONS}
            value={method}
            onChange={setFilter('method')}
          />
        </div>
      </PageHeader>
      <div className="inset">
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

      <Dialog
        className="payments-admin__dialog"
        open={!!id}
        onOpenChange={(isOpen) => {
          if (!isOpen) navigate(ROUTES.ADMIN.PAYMENTS.path, { replace: true });
        }}
      >
        <Outlet />
      </Dialog>
    </div>
  );
};

Component.displayName = 'Payments';

export default Component;
