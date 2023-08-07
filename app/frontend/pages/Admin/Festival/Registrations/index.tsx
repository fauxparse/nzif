import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import Avatar from '@/atoms/Avatar';
import Button from '@/atoms/Button';
import Icon from '@/atoms/Icon';
import { RegistrationsListItemFragment, useRegistrationsQuery } from '@/graphql/types';
import Breadcrumbs from '@/molecules/Breadcrumbs';
import PageHeader from '@/molecules/PageHeader';
import { ROUTES } from '@/Routes';

const columnHelper = createColumnHelper<RegistrationsListItemFragment>();

const columns = [
  columnHelper.accessor((row) => row.user?.profile?.name, {
    id: 'name',
    header: 'Name',
    sortingFn: 'alphanumeric',
    cell: (name) =>
      name.row.original.user?.profile && (
        <Button
          ghost
          as={Link}
          to={ROUTES.ADMIN.PERSON.REGISTRATION.buildPath({ id: name.row.original.user.profile.id })}
          icon={
            <Avatar name={name.getValue()} url={name.row.original.user.profile.picture?.small} />
          }
          text={name.getValue()}
        />
      ),
  }),
  columnHelper.accessor((row) => row.workshopsCount, {
    id: 'count',
    header: 'Workshops',
    cell: (workshops) => workshops.getValue(),
  }),
  columnHelper.accessor((row) => row.completedAt, {
    id: 'date',
    header: 'Date',
    cell: (date) => date.getValue()?.toFormat('d MMM, h:mma'),
  }),
];

export const Component: React.FC = () => {
  const { data } = useRegistrationsQuery();

  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);

  const table = useReactTable({
    data: data?.festival?.registrations ?? [],
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  return (
    <div className="page admin-people">
      <PageHeader>
        <Breadcrumbs />
        <h1>Registrations</h1>
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
    </div>
  );
};

Component.displayName = 'PeopleList';

export default Component;
