import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  Table,
  useReactTable,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';

import Avatar from '@/atoms/Avatar';
import Button from '@/atoms/Button';
import Checkbox from '@/atoms/Checkbox';
import Icon from '@/atoms/Icon';
import Placename from '@/atoms/Placename';
import { PersonDetailsFragment, usePeopleQuery } from '@/graphql/types';
import Breadcrumbs from '@/molecules/Breadcrumbs';

import MergeDialog from './MergeDialog';

const columnHelper = createColumnHelper<PersonDetailsFragment>();

const columns = [
  {
    id: 'select',
    size: 72,
    maxSize: 72,
    header: ({ table }: { table: Table<PersonDetailsFragment> }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }: { row: Row<PersonDetailsFragment> }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        indeterminate={row.getIsSomeSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  columnHelper.accessor('name', {
    header: 'Name',
    sortingFn: 'alphanumeric',
    cell: (name) => (
      <Button
        ghost
        as={Link}
        to={`./${name.row.original.id}`}
        icon={<Avatar name={name.getValue()} url={name.row.original.picture?.small} />}
        text={name.getValue()}
      />
    ),
  }),
  columnHelper.accessor((row) => row.user?.email, {
    header: 'Email',
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('city', {
    header: 'City',
    cell: (city) => {
      const { name, traditionalName } = city.getValue() ?? {
        name: null,
        traditionalName: null,
      };
      return name ? <Placename name={name} traditionalName={traditionalName || undefined} /> : null;
    },
  }),
];

const withSelectedVariants = {
  out: {
    y: '150%',
  },
  in: {
    y: 0,
    transition: { type: 'spring', bounce: 0.2 },
  },
};

const People: React.FC = () => {
  const { data } = usePeopleQuery();

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: data?.people ?? [],
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  const [merging, setMerging] = useState(false);

  const handleMergingOpenChange = (value: boolean) => {
    if (!value) table.resetRowSelection();

    setMerging(value);
  };

  const selectedRows = table.getSelectedRowModel().rows;

  const selectedPeople = selectedRows.map((row) => row.original);

  return (
    <div className="page admin-people">
      <header className="page__header">
        <Breadcrumbs />
        <h1>People</h1>
      </header>
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
      <motion.div
        className="with-selected"
        variants={withSelectedVariants}
        animate={selectedRows.length === 2 ? 'in' : 'out'}
      >
        <Button
          icon="merge"
          text="Merge profiles"
          disabled={selectedRows.length !== 2}
          onClick={() => setMerging(true)}
        />
      </motion.div>
      <MergeDialog people={selectedPeople} open={merging} onOpenChange={handleMergingOpenChange} />
    </div>
  );
};

export default People;
