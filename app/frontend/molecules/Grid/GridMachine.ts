import { isEqual, pick } from 'lodash-es';
import { assign, createMachine } from 'xstate';

import { Cell, Region } from './Grid.types';

type GridContext = {
  rows: number;
  columns: number;
  selection: Region | null;
  selectionOrigin: Cell | null;
};

type PointerDownEvent = { type: 'POINTER_DOWN' } & Cell;
type PointerMoveEvent = { type: 'POINTER_MOVE' } & Cell;
type PointerUpEvent = { type: 'POINTER_UP' } & Cell;
type SetSelectionEvent = { type: 'SET_SELECTION'; selection: Region | null };
type ClearSelectionEvent = { type: 'CLEAR_SELECTION' };

type GridEvent =
  | PointerDownEvent
  | PointerMoveEvent
  | PointerUpEvent
  | SetSelectionEvent
  | ClearSelectionEvent;

const isSetSelectionEvent = (event: GridEvent): event is SetSelectionEvent => 'selection' in event;

const GridMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5RQE4EsIDoMBswGIAFAeQEkA5AFQFEAlAfQBFiB1cgbQAYBdRUABwD2sNABc0ggHZ8QAD0QBaAIwB2JZhUqATABYdANgCcADgDMnYztP6ANCACeircczHtxrQFYvu06cNKpgC+QXaoGNgQeERkVHT0ALLEAGrUXLxIIEIi4lIy8gimrqYGps4qpp6VSp76WnaOCAolOpj6mhZ+XV0hYehYuAQAwgAy1ACCDADK1GNDlKTEHDwy2WIS0pkFRWal5ZXVtfUOiv5abR1m3T2hIOEDUQQzlPQzcwtL6avC63lbiDsSvoym4Dp4anUGoglBZMFofJ4VKCquD9L07v1MLAwHgAMbiSRQGIUGgMJKpL6ZNa5TagApKQxFIxKHScOqeKFNZwuTj+NledH3LE4sD4tCE4lxBgAVUIlIEPxp+UUFVcxnaSjcHJOXMM+guKk61z8gsx2LxBKJz1es2o80WywyCpyG2VhRKmECnh0LKUWjBSlsOuUKkMrkCxk4Bi0+gMOksIVukkEEDgMnu3xdfzpp0MKkw8dMmvhFU43qUnIU8c4nrqKn0gZhmg8aNuQsGmd+tLkpx0YcLxa0pfLlYjmDKvs4mvVhnBnlNEXNostnaV-wQQ5rPrcbM4mn0nC0hkrKk8ntM9Z3-t5kZUiaCQA */
    id: 'grid',
    tsTypes: {} as import('./GridMachine.typegen').Typegen0,
    schema: {
      context: {} as GridContext,
      events: {} as GridEvent,
    },
    predictableActionArguments: true,
    preserveActionOrder: true,

    states: {
      idle: {
        on: {
          POINTER_DOWN: {
            target: 'pointerDown',
            actions: ['clearSelection', 'setSelectionOrigin'],
          },
          CLEAR_SELECTION: {
            target: 'idle',
            actions: ['clearSelection'],
          },
          SET_SELECTION: {
            target: 'idle',
            cond: ({ selection }, { selection: newSelection }) =>
              newSelection !== undefined && !isEqual(selection, newSelection),
            actions: ['setSelection'],
          },
        },
      },

      pointerDown: {
        on: {
          POINTER_MOVE: {
            target: 'selecting',
            internal: true,
            actions: 'setSelection',
          },
          POINTER_UP: {
            target: 'idle',
            actions: ['clearSelection', 'clearSelectionOrigin'],
          },
        },
        after: {
          300: {
            target: 'selecting',
            actions: assign({
              selection: ({ selectionOrigin }) =>
                selectionOrigin && {
                  row: selectionOrigin.row,
                  column: selectionOrigin.column,
                  width: 1,
                  height: 1,
                },
            }),
          },
        },
      },

      selecting: {
        on: {
          POINTER_MOVE: {
            target: 'selecting',
            internal: true,
            actions: 'setSelection',
          },

          POINTER_UP: {
            target: 'idle',
            actions: ['setSelection', 'clearSelectionOrigin'],
          },

          SET_SELECTION: {
            target: 'idle',
            cond: ({ selection }, { selection: newSelection }) =>
              newSelection !== undefined && !isEqual(selection, newSelection),
            actions: ['setSelection'],
          },
        },
      },
    },

    initial: 'idle',
  },
  {
    actions: {
      setSelectionOrigin: assign({
        selectionOrigin: (_, { row, column }) => ({ row, column }),
      }),
      setSelection: assign({
        selectionOrigin: ({ selectionOrigin }, event) => {
          if (isSetSelectionEvent(event)) {
            return event.selection && pick(event.selection, ['row', 'column']);
          }
          const { row, column } = event;
          return selectionOrigin || { row, column };
        },
        selection: ({ selection, selectionOrigin }, event) => {
          if (isSetSelectionEvent(event)) return event.selection;

          const { row, column } = event;
          if (!selectionOrigin) return { row, column, width: 1, height: 1 };
          const { row: row0, column: column0 } = selectionOrigin;
          const newSelection = {
            row: Math.min(row0, row),
            column: Math.min(column0, column),
            width: Math.abs(column0 - column) + 1,
            height: Math.abs(row0 - row) + 1,
          };
          return isEqual(newSelection, selection) ? selection : newSelection;
        },
      }),
      clearSelectionOrigin: assign({ selectionOrigin: null }),
      clearSelection: assign({ selection: null }),
    },
  }
);

export default GridMachine;
