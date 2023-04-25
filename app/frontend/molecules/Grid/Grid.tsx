import React, {
  ElementType,
  forwardRef,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { mergeRefs } from 'react-merge-refs';
import { useInterpret, useSelector } from '@xstate/react';
import clsx from 'clsx';
import { range, throttle } from 'lodash-es';

import { GridComponent, Region } from './Grid.types';
import GridMachine from './GridMachine';
import Selection from './Selection';
import useAutoScroll from './useAutoScroll';

import './Grid.css';

export const Grid: GridComponent = forwardRef(
  (
    {
      as,
      className,
      rows,
      columns,
      children,
      style = {},
      cell: CellComponent,
      columnHeader: ColumnHeaderComponent,
      rowHeader: RowHeaderComponent,
      selection: selectionProp,
      selectionComponent: SelectionComponent = Selection,
      onSelectionChange,
      ...props
    },
    ref
  ) => {
    const container = useRef<HTMLElement>(null);

    const Component = (as || 'div') as ElementType;

    const rowNumbers = useMemo(() => range(rows), [rows]);
    const columnNumbers = useMemo(() => range(columns), [columns]);
    const rowOffset = ColumnHeaderComponent ? 1 : 0;
    const columnOffset = RowHeaderComponent ? 1 : 0;

    const machine = useInterpret(GridMachine);

    const state = useSelector(machine, (state) => state);

    const selection = state.context.selection;

    const currentSelection = useRef<Region | null>(null);

    useEffect(() => {
      currentSelection.current = selection;
    }, [selection]);

    const selecting = state.matches('selecting');

    const rowRef = useRef<number | null>(null);
    const columnRef = useRef<number | null>(null);

    const updateMachine = useMemo(
      () =>
        throttle(
          (e: PointerEvent) => {
            const target = (e.target as HTMLElement).closest('[data-row]');
            if (!target) return;
            const { row: rowString, column: columnString } = (target as HTMLElement).dataset;
            if (!rowString || !columnString) return;
            const row = Number(rowString);
            const column = Number(columnString);
            if (row === rowRef.current && column === columnRef.current) return;
            const type =
              e.type === 'pointerdown'
                ? 'POINTER_DOWN'
                : e.type === 'pointerup'
                ? 'POINTER_UP'
                : 'POINTER_MOVE';
            rowRef.current = row;
            columnRef.current = column;
            machine.send({
              type,
              row,
              column,
            });
          },
          50,
          { leading: true, trailing: true }
        ),
      [machine]
    );

    const pointerDown = useCallback(
      (e: React.PointerEvent) => {
        const el = container.current;
        if (!el) return;

        updateMachine(e.nativeEvent);
        const pointerMove = (e: PointerEvent) => {
          updateMachine(e);
        };
        const pointerUp = () => {
          machine.send({
            type: 'POINTER_UP',
            row: rowRef.current ?? 0,
            column: columnRef.current ?? 0,
          });
          el.removeEventListener('pointermove', pointerMove);
          rowRef.current = null;
          columnRef.current = null;
          onSelectionChange?.(currentSelection.current);
        };

        el.addEventListener('pointermove', pointerMove);
        window.addEventListener('pointerup', pointerUp, { once: true });
      },
      [machine, onSelectionChange, updateMachine]
    );

    useAutoScroll({
      container: container.current || document.documentElement,
      verticalContainer: document.documentElement,
      enabled: selecting,
    });

    const mergedRefs = mergeRefs([ref, container]);

    useEffect(() => {
      if (selectionProp === undefined) return;
      machine.send({ type: 'SET_SELECTION', selection: selectionProp });
    }, [selectionProp, machine]);

    return (
      <Component
        ref={mergedRefs}
        className={clsx('grid', className)}
        style={{
          ...style,
          '--rows': rows,
          '--columns': columns,
          '--row-headers': RowHeaderComponent ? 1 : 0,
          '--column-headers': ColumnHeaderComponent ? 1 : 0,
        }}
        data-selecting={selecting || undefined}
        onPointerDown={pointerDown}
        {...props}
      >
        {ColumnHeaderComponent && (
          <>
            {RowHeaderComponent && <div className="grid__row-header grid__column-header" />}
            {columnNumbers.map((column) => (
              <ColumnHeaderComponent
                key={column}
                column={column}
                role="columnheader"
                className="grid__column-header"
                style={{
                  gridRow: 1,
                  gridColumn: column + columnOffset + 1,
                }}
              />
            ))}
          </>
        )}
        {rowNumbers.map((row) => (
          <div key={row} className="grid__row" role="row">
            {RowHeaderComponent && (
              <RowHeaderComponent
                row={row}
                role="rowheader"
                className="grid__row-header"
                style={{
                  gridRow: row + rowOffset + 1,
                  gridColumn: 1,
                }}
              />
            )}
            {CellComponent &&
              columnNumbers.map((column) => (
                <CellComponent
                  key={`r${row}c${column}`}
                  row={row}
                  column={column}
                  className="grid__cell"
                  role="gridcell"
                  data-row={row}
                  data-column={column}
                />
              ))}
          </div>
        ))}
        {selection && (
          <SelectionComponent
            selection={selection}
            rowOffset={rowOffset}
            columnOffset={columnOffset}
          />
        )}
        {children}
      </Component>
    );
  }
);

Grid.displayName = 'Grid';

export default Grid;
