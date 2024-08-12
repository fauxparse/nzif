import { Spinner } from '@/components/atoms/Spinner';
import { sessionKey } from '@/components/pages/Registration/Workshops/useWorkshopPreferences';
import { SortIcon } from '@/icons/SortIcon';
import { useQuery } from '@apollo/client';
import {
  Button,
  Dialog,
  Flex,
  IconButton,
  Inset,
  Separator,
  Skeleton,
  Table,
  Text,
} from '@radix-ui/themes';
import { Link, useChildMatches, useNavigate } from '@tanstack/react-router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FragmentOf } from 'gql.tada';
import { uniq } from 'lodash-es';
import { DateTime } from 'luxon';
import { useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { RegistrationDetails } from './RegistrationDetails';
import { RegistrationsQuery, RegistrationsRowFragment } from './queries';

import BarChartIcon from '@/icons/BarChartIcon';
import pluralize from 'pluralize';
import Header from '../Header';
import classes from './RegistrationsList.module.css';

type RegistrationRow = FragmentOf<typeof RegistrationsRowFragment>;

type TableRow = {
  id: string;
  name: string;
  email: string;
  workshops: number;
  completedAt: DateTime | null;
};

const columnHelper = createColumnHelper<TableRow>();

const countWorkshops = (registration: RegistrationRow) =>
  uniq(registration.preferences.flatMap((p) => p.session.slots.map((s) => sessionKey(s)))).length;

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    sortDescFirst: false,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    enableHiding: true,
    sortDescFirst: false,
  }),
  columnHelper.accessor('completedAt', {
    header: 'Registered',
    enableHiding: true,
    cell: (cell) => cell.getValue()?.toFormat('d MMMM'),
    sortUndefined: 1,
    sortDescFirst: true,
  }),
  columnHelper.accessor('workshops', {
    header: '#',
    sortUndefined: 1,
    sortDescFirst: true,
  }),
];

export const RegistrationsList = () => {
  const { loading, data } = useQuery(RegistrationsQuery);

  const navigate = useNavigate();

  const registrations = useMemo(
    () =>
      data?.festival.registrations?.map(
        (r) =>
          ({
            id: r.user?.profile?.id || '',
            name: r.user?.name || '',
            email: r.user?.email || '',
            workshops: countWorkshops(r),
            completedAt: r.completedAt,
          }) satisfies TableRow
      ) || [],
    [data]
  );

  const places = useMemo(
    () => registrations.reduce((acc, registration) => acc + registration.workshops, 0),
    [registrations]
  );

  const totalPlaces = useMemo(() => {
    if (!data?.festival.workshops) return 0;
    return data.festival.workshops.reduce(
      (acc, workshop) =>
        acc + workshop.sessions.reduce((acc, session) => acc + (session.capacity ?? 0), 0),
      0
    );
  }, [data]);

  const { selected, close } = useSelectedRegistration(registrations);

  const wide = useMediaQuery('(min-width: 768px)');

  const table = useReactTable<TableRow>({
    columns,
    data: registrations,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: 'name',
          desc: false,
        },
      ],
    },
  });

  useEffect(() => {
    for (const column of table.getAllColumns()) {
      if (column.columnDef.enableHiding) {
        column.toggleVisibility(wide);
      }
    }
  }, [wide, table]);

  const headers = table.getLeafHeaders().filter((header) => header.column.getIsVisible());

  const [selectedRegistration, setSelectedRegistration] = useState<TableRow | null>(null);

  useEffect(() => {
    if (selected) setSelectedRegistration(selected);
  }, [selected]);

  return (
    <>
      <Header
        title="Registrations"
        actions={
          <IconButton asChild variant="ghost" radius="full" size="3">
            <Link to="/admin/registrations/preferences" replace>
              <BarChartIcon />
            </Link>
          </IconButton>
        }
      >
        <Flex asChild gap="2" align="center">
          <Text size="4">
            <Skeleton loading={loading}>
              {loading ? 'Loading…' : pluralize('registration', registrations.length, true)}
            </Skeleton>
            <Separator orientation="vertical" />
            <Skeleton loading={loading}>
              {loading ? 'Loading…' : `${places} / ${pluralize('place', totalPlaces, true)}`}
            </Skeleton>
          </Text>
        </Flex>
      </Header>
      <Table.Root className={classes.table} size="2">
        <Table.Header>
          <Table.Row>
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
                onClick={() =>
                  navigate({
                    to: '/admin/registrations/$registrationId',
                    params: { registrationId: row.original.id },
                    replace: true,
                  })
                }
              >
                {row.getVisibleCells().map((cell, index) =>
                  index ? (
                    <Table.Cell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Cell>
                  ) : (
                    <Table.RowHeaderCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      {!wide && <small>{row.getValue('email')}</small>}
                    </Table.RowHeaderCell>
                  )
                )}
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
      <Dialog.Root open={selected !== null} onOpenChange={(isOpen) => !isOpen && close()}>
        {selectedRegistration && (
          <RegistrationDetails registration={selectedRegistration} onClose={close} />
        )}
      </Dialog.Root>
    </>
  );
};

const useSelectedRegistration = (registrations: TableRow[]) => {
  const childMatch = useChildMatches().find(
    (match) => match.routeId === '/admin/registrations/$registrationId'
  );

  const navigate = useNavigate();

  const selected =
    (childMatch &&
      registrations.find(
        (r) => r.id === (childMatch.params as { registrationId: string }).registrationId
      )) ||
    null;

  const close = () => navigate({ to: '/admin/registrations', replace: true });

  return { selected, close };
};
