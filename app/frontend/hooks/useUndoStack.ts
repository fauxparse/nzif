import { useReducer } from 'react';

type State<T> = {
  undoStack: T[];
  redoStack: T[];
};

type Action<T> = T | 'undo' | 'redo';

type Handler<T> = (move: T) => void;

export const useUndoStack = <T>({
  onExecute,
  onUndo,
}: { onExecute: Handler<T>; onUndo: Handler<T> }) => {
  const [stack, dispatch] = useReducer(
    (stack: State<T>, action: Action<T>) => {
      if (action === 'undo') {
        if (stack.undoStack.length === 0) return stack;
        const [move, ...rest] = stack.undoStack;
        return { ...stack, undoStack: rest, redoStack: [move, ...stack.redoStack] };
      }
      if (action === 'redo') {
        if (stack.redoStack.length === 0) return stack;
        const [move, ...rest] = stack.redoStack;
        return { ...stack, redoStack: rest, undoStack: [move, ...stack.undoStack] };
      }

      return { ...stack, undoStack: [action, ...stack.undoStack], redoStack: [] };
    },
    { undoStack: [], redoStack: [] }
  );

  const canUndo = stack.undoStack.length > 0;
  const canRedo = stack.redoStack.length > 0;

  const undo = () => {
    const move = stack.undoStack[0];
    if (!move) return;
    onUndo(move);
    dispatch('undo');
  };
  const redo = () => {
    const move = stack.redoStack[0];
    if (!move) return;
    onExecute(move);
    dispatch('redo');
  };
  const execute = (move: T) => {
    dispatch(move);
    onExecute(move);
  };

  return { canUndo, canRedo, undo, redo, execute };
};
