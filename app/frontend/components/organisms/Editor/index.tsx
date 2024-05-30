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
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { EditorState } from 'lexical';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import theme from './theme';

import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useCallback, useRef } from 'react';
import './Editor.css';
import { PeriodicSavePlugin, PeriodicSavePluginRef } from './plugins/PeriodicSavePlugin';

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
  onChange: (value: string) => void;
};

export const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
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

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor">
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <ToolbarPlugin />
        <PeriodicSavePlugin ref={editor} onSave={handleSave} />
        <div className="editor__inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor__input"
                onBlur={() => {
                  editor.current?.save();
                }}
              />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <OnChangePlugin onChange={handleChange} />
        </div>
      </div>
    </LexicalComposer>
  );
};

const Placeholder = () => <div className="editor__placeholder">Enter some rich text...</div>;
