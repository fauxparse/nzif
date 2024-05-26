import { isEqual } from 'lodash-es';
import { useReducer } from 'react';
import { Cell, Rect, normalizeRect } from './types';

type SelectionState =
  | {
      state: 'idle';
    }
  | {
      state: 'selecting';
      moved: boolean;
      rect: Rect;
    }
  | {
      state: 'selected';
      rect: Rect;
    };

type SelectionAction =
  | {
      type: 'start';
      cell: Cell;
    }
  | {
      type: 'move';
      cell: Cell;
    }
  | {
      type: 'end';
    }
  | {
      type: 'clear';
    };

export const useSelection = () => {
  const [selection, dispatch] = useReducer(
    (state: SelectionState, action: SelectionAction): SelectionState => {
      switch (action.type) {
        case 'start':
          return {
            state: 'selecting',
            moved: false,
            rect: { start: action.cell, end: action.cell },
          };
        case 'move':
          if (state.state === 'selecting') {
            const newState: SelectionState = {
              state: 'selecting',
              moved: state.moved || !isEqual(state.rect.start, action.cell),
              rect: { start: state.rect.start, end: action.cell },
            };
            return isEqual(state, newState) ? state : newState;
          }
          return state;
        case 'end':
          if (state.state === 'selecting') {
            return state.moved
              ? { state: 'selected', rect: normalizeRect(state.rect) }
              : { state: 'idle' };
          }
          return state;
        case 'clear':
          return { state: 'idle' };
        default:
          return state;
      }
    },
    { state: 'idle' }
  );

  return {
    selection,
    start: (cell: Cell) => dispatch({ type: 'start', cell }),
    move: (cell: Cell) => dispatch({ type: 'move', cell }),
    end: () => dispatch({ type: 'end' }),
    clear: () => dispatch({ type: 'clear' }),
  };
};
