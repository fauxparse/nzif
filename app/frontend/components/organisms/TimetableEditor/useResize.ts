import { isEqual } from 'lodash-es';
import { useEffect, useReducer } from 'react';
import { Cell, LaidOutSession, Rect, Session, normalizeRect } from './types';

type ResizeState =
  | {
      state: 'idle';
    }
  | {
      state: 'resizing' | 'ending';
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

type UseResizeOptions = {
  onResize: (session: Session, rect: Rect) => void;
};

export const useResize = ({ onResize }: UseResizeOptions) => {
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
          if (state.state !== 'resizing') return state;
          return {
            ...state,
            state: 'ending',
          };
        case 'cancel':
          return { state: 'idle' };
        default:
          return state;
      }
    },
    { state: 'idle' }
  );

  useEffect(() => {
    if (resizing.state === 'ending') {
      onResize(resizing.laidOutSession.session, normalizeRect(resizing));
      dispatch({ type: 'cancel' });
    }
  }, [resizing]);

  return {
    resizing,
    start: (laidOutSession: LaidOutSession, cell: Cell) =>
      dispatch({ type: 'start', laidOutSession, cell }),
    move: (cell: Cell) => dispatch({ type: 'move', cell }),
    end: () => dispatch({ type: 'end' }),
    cancel: () => dispatch({ type: 'cancel' }),
  };
};
