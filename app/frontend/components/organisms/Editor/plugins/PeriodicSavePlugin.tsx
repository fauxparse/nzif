import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { EditorState } from 'lexical';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

type PeriodicSavePluginProps = {
  timeout?: number;
  onSave: (editorState: EditorState) => void;
};

export type PeriodicSavePluginRef = {
  save: () => void;
};

export const PeriodicSavePlugin = forwardRef<PeriodicSavePluginRef, PeriodicSavePluginProps>(
  ({ timeout = 2000, onSave }, ref) => {
    const [editor] = useLexicalComposerContext();

    const currentState = useRef<EditorState | null>(null);

    const timer = useRef<ReturnType<typeof setTimeout>>();

    useEffect(
      () =>
        editor.registerUpdateListener(({ editorState }) => {
          currentState.current = editorState;

          if (timer.current) {
            clearTimeout(timer.current);
          }

          timer.current = setTimeout(() => {
            onSave(editorState);
          }, timeout);
        }),
      [editor, timeout, onSave]
    );

    useImperativeHandle(ref, () => ({
      save: () => {
        if (timer.current) {
          clearTimeout(timer.current);
        }

        if (currentState.current) {
          onSave(currentState.current);
        }
      },
    }));

    return null;
  }
);
