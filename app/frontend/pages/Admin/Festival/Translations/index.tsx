import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  RowData,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { isEqual, set, snakeCase } from 'lodash-es';

import Button from '@/atoms/Button';
import Icon from '@/atoms/Icon';
import Input from '@/atoms/Input';
import {
  CreateTranslationMutationVariables,
  DestroyTranslationMutationVariables,
  TranslationDetailsFragment,
  TranslationsDocument,
  UpdateTranslationMutationVariables,
  useCreateTranslationMutation,
  useDestroyTranslationMutation,
  useTranslationsQuery,
  useUpdateTranslationMutation,
} from '@/graphql/types';
import Breadcrumbs from '@/molecules/Breadcrumbs';
import { useCountries } from '@/molecules/CountryPicker';
import Select, { SelectOption } from '@/molecules/Select';
import { useToaster } from '@/molecules/Toaster';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    countries?: Map<string, string>;
    countryOptions?: SelectOption[];
    createTranslation?: (variables: CreateTranslationMutationVariables) => void;
    updateTranslation?: (variables: UpdateTranslationMutationVariables) => void;
    destroyTranslation?: (variables: DestroyTranslationMutationVariables) => void;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    editable?: boolean;
  }
}

const columnHelper = createColumnHelper<TranslationDetailsFragment>();

const defaultColumn: Partial<ColumnDef<TranslationDetailsFragment>> = {
  sortingFn: <T extends TranslationDetailsFragment>(
    rowA: Row<T>,
    rowB: Row<T>,
    columnId: string
  ): number => rowA.getValue<string>(columnId).localeCompare(rowB.getValue<string>(columnId)),
  cell: ({ getValue, row, column: { id }, table }) => {
    const initialValue = getValue();

    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.select();
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const variables = {
        ...row.original,
        [id]: e.target.value,
      };
      if (!isEqual(variables, row.original)) {
        table.options.meta?.updateTranslation?.(variables);
      }
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'Enter':
          e.currentTarget.blur();
          return;
        case 'Escape':
          e.currentTarget.value = initialValue as string;
          e.currentTarget.blur();
          return;
      }
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const input = useRef<HTMLInputElement>(null);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!input.current) return;
      input.current.value = initialValue as string;
    }, [initialValue]);

    return (
      <Input
        ref={input}
        defaultValue={getValue() as string}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    );
  },
};

type NewTranslationForm = HTMLFormElement & {
  country: HTMLInputElement;
  name: HTMLInputElement;
  traditionalName: HTMLInputElement;
};

const columns = [
  columnHelper.accessor('country', {
    header: 'Country',
    cell: ({ getValue, table }) =>
      table.options.meta?.countries?.get(getValue() as string) ?? getValue(),
    footer: ({ table }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [country, setCountry] = useState<string>('NZ');
      return (
        <>
          <input type="hidden" id="country" value={country} form="new-translation" />
          <Select
            options={table.options.meta?.countryOptions}
            value={country}
            onChange={setCountry}
          />
        </>
      );
    },
  }),
  columnHelper.accessor('name', {
    header: 'English',
    meta: {
      editable: true,
    },
    footer: () => (
      <Input type="text" id="name" placeholder="Name" form="new-translation" required />
    ),
  }),
  columnHelper.accessor('traditionalName', {
    header: 'Traditional',
    meta: {
      editable: true,
    },
    footer: () => (
      <Input
        type="text"
        id="traditionalName"
        placeholder="Traditional name"
        form="new-translation"
        required
      />
    ),
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row, table }) => (
      <Button
        icon="trash"
        ghost
        aria-label="Delete"
        onClick={() =>
          table.options.meta?.destroyTranslation?.({
            id: row.original.id,
          })
        }
      />
    ),
    footer: ({ table }) => {
      const submit = (e: React.FormEvent<NewTranslationForm>) => {
        e.preventDefault();
        const { name, traditionalName, country } = e.currentTarget;
        table.options.meta?.createTranslation?.({
          name: name.value,
          traditionalName: traditionalName.value,
          country: country.value,
        });
        name.value = '';
        traditionalName.value = '';
        name.focus();
      };

      return (
        <form id="new-translation" onSubmit={submit}>
          <Button type="submit" text="Add translation" />
        </form>
      );
    },
  }),
];

const Translations: React.FC = () => {
  const { data } = useTranslationsQuery();

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'country', desc: true },
    { id: 'name', desc: false },
  ]);

  const { countries: countryList } = useCountries();

  const countries = useMemo<Map<string, string>>(
    () => countryList.reduce((map, country) => map.set(country.value, country.label), new Map()),
    [countryList]
  );

  const [createTranslation] = useCreateTranslationMutation();

  const [updateTranslation] = useUpdateTranslationMutation();

  const [destroyTranslation] = useDestroyTranslationMutation();

  const { notify } = useToaster();

  const table = useReactTable({
    data: data?.translations ?? [],
    columns,
    defaultColumn,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    meta: {
      createTranslation: (variables: CreateTranslationMutationVariables) => {
        createTranslation({
          variables,
          update: (cache, { data }) => {
            const { createTranslation } = data ?? {};
            if (!createTranslation) return;
            cache.updateQuery({ query: TranslationsDocument }, (existing) => ({
              translations: [...existing.translations, createTranslation.translation],
            }));
          },
        })
          .then(() => {
            notify('Translation added');
          })
          .catch(() => {
            notify('Translation already exists');
          });
      },
      updateTranslation: (variables: UpdateTranslationMutationVariables) => {
        updateTranslation({
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            updateTranslation: {
              __typename: 'UpdateTranslationPayload',
              translation: {
                __typename: 'Translation',
                ...variables,
              },
            },
          },
        }).then(() => {
          notify('Translation updated');
        });
      },
      destroyTranslation: (variables: DestroyTranslationMutationVariables) => {
        destroyTranslation({
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            destroyTranslation: true,
          },
          update: (cache) => {
            cache.evict({ id: cache.identify({ __typename: 'Translation', ...variables }) });
          },
        }).then(() => {
          notify('Translation deleted');
        });
      },
      countries,
      countryOptions: countryList,
    },
  });

  return (
    <div>
      <header className="page__header">
        <Breadcrumbs />
        <h1>Translations</h1>
      </header>
      <div className="inset">
        <div className="data-table__container">
          <table className="data-table editable">
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
                      data-editable={cell.column.columnDef.meta?.editable ?? undefined}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <td
                      key={header.id}
                      data-editable={header.column.columnDef.meta?.editable ?? undefined}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.footer, header.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Translations;
