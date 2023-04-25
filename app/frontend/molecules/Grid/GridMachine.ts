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
    /** @xstate-layout N4IgpgJg5mDOIC5RQE4EsIDoMBswGIAFAeQEkA5AFQFEAlAfQBFiB1cgbQAYBdRUABwD2sNABc0ggHZ8QAD0QBaABwAmTCo0A2AKyaV2gDQgAnoqUAWTKs4BmAIz6Avo6OoMmWGDwBjcZKhEZFR09ACyxABq1Fy8SCBCIuJSMvIIdgCcNpia6XbmnHqGJooqSkqYtukFTi4gbliePn4BJBQ0DACqhDEyCWIS0nGpCgDsWWWaI3ZKI0WmCAoq6ZrZIyOcSjZb21vOtZKCEHAy9b3C-clDJSojVirmKtOzRvMKNpuYdmsbOzvOrugsLgwGdEgMUoovuk7g8nnNIZpLOkHutNr97P86oCPF4wL40P5QRdBqBUnY8phtBltPZ9C8EUiUT90XY9o4gA */
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
            target: 'selecting',
            actions: ['setSelectionOrigin', 'setSelection'],
          },
          POINTER_MOVE: {
            target: 'selecting',
            actions: ['setSelectionOrigin', 'setSelection'],
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
