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
import { EditorState } from 'lexical';
import { useCallback, useRef, useState } from 'react';
import './Editor.css';
import { FloatingLinkEditorPlugin } from './plugins/FloatingLinkEditorPlugin';
import { PeriodicSavePlugin, PeriodicSavePluginRef } from './plugins/PeriodicSavePlugin';
import { ToolbarPlugin } from './plugins/ToolbarPlugin';
import TreeViewPlugin from './plugins/TreeViewPlugin';

import LinkPlugin from './plugins/LinkPlugin';
import theme from './theme';

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

type EditorProps = {
  value: string;
  debug?: boolean;
  onChange: (value: string) => void;
};

export const Editor: React.FC<EditorProps> = ({ value, debug, onChange }) => {
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
      <div
        className="editor"
        onBlur={(event: React.FocusEvent<HTMLElement>) => {
          if (
            !event.relatedTarget?.closest('.editor') &&
            !event.relatedTarget?.closest('.link-editor')
          ) {
            editor.current?.save();
          }
        }}
      >
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <ToolbarPlugin setLinkEditMode={setIsLinkEditMode} />
        <PeriodicSavePlugin ref={editor} onSave={handleSave} />
        <div ref={onRef} className="editor__inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor__input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <LinkPlugin />
          <ListPlugin />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <OnChangePlugin onChange={handleChange} />
          {floatingAnchorElem && (
            <FloatingLinkEditorPlugin
              anchorElem={floatingAnchorElem}
              isLinkEditMode={isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
            />
          )}
        </div>
      </div>
      {debug && import.meta.env.MODE === 'development' && <TreeViewPlugin />}
    </LexicalComposer>
  );
};

const Placeholder = () => <div className="editor__placeholder">Enter some rich text...</div>;
