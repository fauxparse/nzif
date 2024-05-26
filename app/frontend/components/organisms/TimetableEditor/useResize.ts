import { isEqual } from 'lodash-es';
import { useReducer } from 'react';
import { Cell, LaidOutSession } from './types';

type ResizeState =
  | {
      state: 'idle';
    }
  | {
      state: 'resizing';
      laidOutSession: LaidOutSession;
      start: Cell;
      end: Cell;
    };

type ResizeAction =
  | {
      type: 'start';
      laidOutSession: LaidOutSession;
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
      type: 'cancel';
    };

export const useResize = () => {
  const [resizing, dispatch] = useReducer(
    (state: ResizeState, action: ResizeAction): ResizeState => {
      switch (action.type) {
        case 'start': {
          const { rect } = action.laidOutSession;
          const whichEnd = isEqual(action.cell, rect.start) ? 'start' : 'end';
          return {
            state: 'resizing',
            laidOutSession: action.laidOutSession,
            start: whichEnd === 'start' ? rect.end : rect.start,
            end: whichEnd === 'end' ? rect.end : rect.start,
          };
        }
        case 'move':
          if (state.state !== 'resizing' || isEqual(state.end, action.cell)) return state;
          return {
            ...state,
            end: action.cell,
          };
        case 'end':
        case 'cancel':
          return { state: 'idle' };
        default:
          return state;
      }
    },
    { state: 'idle' }
  );

  return {
    resizing,
    start: (laidOutSession: LaidOutSession, cell: Cell) =>
      dispatch({ type: 'start', laidOutSession, cell }),
    move: (cell: Cell) => dispatch({ type: 'move', cell }),
    end: () => dispatch({ type: 'end' }),
    cancel: () => dispatch({ type: 'cancel' }),
  };
};
