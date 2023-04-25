import React, {
  ElementType,
  forwardRef,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { mergeRefs } from 'react-merge-refs';
import { useInterpret, useSelector } from '@xstate/react';
import clsx from 'clsx';
import { range } from 'lodash-es';

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

    const [selecting, setSelecting] = useState(false);

    const startTimer = useRef<number>();
    const selectionStart = useRef<number>(Date.now());

    const updateMachine = useCallback(
      (e: PointerEvent) => {
        const target = e.target as HTMLElement;
        const { row, column } = target.dataset;
        const type =
          e.type === 'pointerdown'
            ? 'POINTER_DOWN'
            : e.type === 'pointerup'
            ? 'POINTER_UP'
            : 'POINTER_MOVE';
        if (row && column) {
          machine.send({
            type,
            row: parseInt(row, 10),
            column: parseInt(column, 10),
          });
        }
      },
      [machine]
    );

    const panEnd = useCallback(
      (e: PointerEvent) => {
        clearTimeout(startTimer.current);
        setSelecting(false);
        updateMachine(e);
        if (Date.now() - selectionStart.current < 300) {
          machine.send('CLEAR_SELECTION');
          onSelectionChange?.(null);
        } else {
          onSelectionChange?.(currentSelection.current);
        }
      },
      [updateMachine, machine, onSelectionChange]
    );

    const panStart = (e: React.PointerEvent) => {
      e.persist();
      selectionStart.current = Date.now();
      window.addEventListener('pointerup', panEnd, { once: true });

      startTimer.current = window.setTimeout(() => {
        setSelecting(true);
        updateMachine(e.nativeEvent);
      }, 300);
    };

    const panMove = (e: PointerEvent) => {
      setSelecting(true);
      updateMachine(e);
    };

    useEffect(() => {
      return () => {
        clearTimeout(startTimer.current);
      };
    }, []);

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
                  onPointerDown={panStart}
                  onPan={panMove}
                  data-row={row}
                  data-column={column}
                  style={{
                    gridRow: row + rowOffset + 1,
                    gridColumn: column + columnOffset + 1,
                  }}
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
