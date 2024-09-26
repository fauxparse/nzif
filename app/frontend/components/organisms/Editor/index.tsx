import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  HEADING,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  LINK,
  ORDERED_LIST,
  QUOTE,
  STRIKETHROUGH,
  UNORDERED_LIST,
} from '@lexical/markdown';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { Box, BoxProps } from '@radix-ui/themes';
import clsx from 'clsx';
import { EditorState } from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FloatingLinkEditorPlugin } from './plugins/FloatingLinkEditorPlugin';
import LinkPlugin from './plugins/LinkPlugin';
import { PeriodicSavePlugin, PeriodicSavePluginRef } from './plugins/PeriodicSavePlugin';
import { ToolbarPlugin } from './plugins/ToolbarPlugin';
import TreeViewPlugin from './plugins/TreeViewPlugin';
import theme from './theme';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import classes from './Editor.module.css';

const TRANSFORMERS = [
  UNORDERED_LIST,
  HEADING,
  ORDERED_LIST,
  QUOTE,
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  STRIKETHROUGH,
  LINK,
];

type EditorProps = Omit<BoxProps, 'onChange'> & {
  value: string;
  debug?: boolean;
  placeholder?: string;
  toolbar?: boolean;
  onChange: (value: string) => void;
};

export const Editor: React.FC<EditorProps> = ({
  className,
  placeholder,
  value,
  debug,
  toolbar = true,
  onChange,
  ...props
}) => {
  const initialConfig = {
    editorState: () => {
      $convertFromMarkdownString(value, TRANSFORMERS);
    },
    nodes: [LinkNode, ListNode, ListItemNode, HeadingNode, QuoteNode],
    namespace: 'Editor',
    theme,
    onError: console.error,
  };

  const currentState = useRef<EditorState | null>(null);

  const editor = useRef<PeriodicSavePluginRef>(null);

  const handleSave = useCallback((editorState: EditorState) => {
    editorState.read(() => {
      onChange($convertToMarkdownString(TRANSFORMERS));
    });
  }, []);

  const handleChange = useCallback(
    (editorState: EditorState) => {
      currentState.current = editorState;
    },
    [onChange]
  );

  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Box
        className={clsx(classes.editor, className)}
        onBlur={(event: React.FocusEvent<HTMLElement>) => {
          if (
            !event.relatedTarget?.closest('.editor') &&
            !event.relatedTarget?.closest('.link-editor')
          ) {
            editor.current?.save();
          }
        }}
        {...props}
      >
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <ToolbarPlugin show={toolbar} setLinkEditMode={setIsLinkEditMode} />
        <PeriodicSavePlugin ref={editor} onSave={handleSave} />
        <div ref={onRef} className={classes.inner}>
          <RichTextPlugin
            contentEditable={<ContentEditable className={classes.input} />}
            placeholder={
              <div className={classes.placeholder}>{placeholder || 'Enter some text…'}</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <LinkPlugin />
          <ListPlugin />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <OnChangePlugin onChange={handleChange} />
          <UpdateValuePlugin value={value} />
          {floatingAnchorElem && (
            <FloatingLinkEditorPlugin
              anchorElem={floatingAnchorElem}
              isLinkEditMode={isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
            />
          )}
        </div>
      </Box>
      {debug && import.meta.env.MODE === 'development' && <TreeViewPlugin />}
    </LexicalComposer>
  );
};

const UpdateValuePlugin = ({ value }: { value: string }) => {
  const [editor] = useLexicalComposerContext();

  const stored = useRef<string | null>(value);
  const changed = useRef(false);

  useEffect(() => {
    editor.registerUpdateListener(() => {
      changed.current = true;
    });
  }, [editor]);

  useEffect(() => {
    if (value === stored.current || !changed.current) return;

    stored.current = value;

    editor.update(() => $convertFromMarkdownString(value, TRANSFORMERS));
    changed.current = false;
  }, [value]);

  return null;
};
