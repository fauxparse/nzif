import { isEqual } from 'lodash-es';
import { useEffect, useReducer } from 'react';
import { Cell, LaidOutSession, Rect, Session } from './types';

type DragState =
  | {
      state: 'idle';
    }
  | {
      state: 'dragging';
      moved: boolean;
      laidOutSession: LaidOutSession;
      offset: number;
      rect: Rect;
    }
  | {
      state: 'ended';
      laidOutSession: LaidOutSession;
      rect: Rect;
    };

type DragAction =
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

type UseDragOptions = {
  columns: number;
  onDrop: (session: Session, rect: Rect) => void;
};

export const useDrag = ({ columns, onDrop }: UseDragOptions) => {
  const [dragging, dispatch] = useReducer(
    (state: DragState, action: DragAction): DragState => {
      switch (action.type) {
        case 'start': {
          const { rect } = action.laidOutSession;
          return {
            state: 'dragging',
            moved: false,
            laidOutSession: action.laidOutSession,
            rect,
            offset: action.cell.column - rect.start.column,
          };
        }
        case 'move': {
          if (state.state !== 'dragging') return state;
          const { row, column } = action.cell;
          const width = state.rect.end.column - state.rect.start.column;
          const left = Math.min(Math.max(0, column - state.offset), columns - width - 1);
          const right = left + width;
          const newState: DragState = {
            ...state,
            moved: true,
            rect: {
              start: { row, column: left },
              end: { row, column: right },
            },
          };
          return isEqual(newState, state) ? state : newState;
        }
        case 'end':
          if (state.state !== 'dragging') return state;
          return { ...state, state: 'ended' };
        case 'cancel':
          return { state: 'idle' };
        default:
          return state;
      }
    },
    { state: 'idle' }
  );

  useEffect(() => {
    if (dragging.state === 'ended') {
      onDrop(dragging.laidOutSession.session, dragging.rect);
      dispatch({ type: 'cancel' });
    }
  }, [dragging, onDrop]);

  return {
    dragging,
    start: (laidOutSession: LaidOutSession, cell: Cell) =>
      dispatch({ type: 'start', laidOutSession, cell }),
    move: (cell: Cell) => dispatch({ type: 'move', cell }),
    end: () => {
      dispatch({ type: 'end' });
    },
    cancel: () => dispatch({ type: 'cancel' }),
  };
};
