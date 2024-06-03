/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import BoldIcon from '@/icons/BoldIcon';
import BulletListIcon from '@/icons/BulletListIcon';
import HeadingIcon from '@/icons/HeadingIcon';
import ItalicIcon from '@/icons/ItalicIcon';
import LinkIcon from '@/icons/LinkIcon';
import NumberedListIcon from '@/icons/NumberedListIcon';
import QuoteIcon from '@/icons/QuoteIcon';
import RedoIcon from '@/icons/RedoIcon';
import StrikethroughIcon from '@/icons/StrikethroughIcon';
import UnderlineIcon from '@/icons/UnderlineIcon';
import UndoIcon from '@/icons/UndoIcon';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingTagType,
} from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import { ActionIcon } from '@mantine/core';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { Dispatch, useCallback, useEffect, useRef, useState } from 'react';
import { getSelectedNode } from '../utils/getSelectedNode';

const LowPriority = 1;

const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Checklist',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
} as const;

type ToolbarPluginProps = {
  setLinkEditMode: Dispatch<boolean>;
};

export const ToolbarPlugin: React.FC<ToolbarPluginProps> = ({ setLinkEditMode }) => {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>('paragraph');

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));

      const node = getSelectedNode(selection);
      const parent = node.getParent();
      setIsLink($isLinkNode(parent) || $isLinkNode(node));

      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, $updateToolbar]);

  const insertLink = useCallback(() => {
    if (!isLink) {
      setLinkEditMode(true);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      setLinkEditMode(false);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink, setLinkEditMode]);

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      });
    } else {
      formatParagraph();
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createQuoteNode());
      });
    } else {
      formatParagraph();
    }
  };

  return (
    <div className="editor__toolbar" ref={toolbarRef}>
      <ActionIcon.Group>
        <ActionIcon
          disabled={!canUndo}
          aria-label="Undo"
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
        >
          <UndoIcon />
        </ActionIcon>
        <ActionIcon
          disabled={!canRedo}
          aria-label="Redo"
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined);
          }}
        >
          <RedoIcon />
        </ActionIcon>
      </ActionIcon.Group>
      <ActionIcon.Group>
        <ActionIcon
          aria-label="Heading"
          aria-pressed={blockType === 'h3'}
          onClick={() => formatHeading('h3')}
        >
          <HeadingIcon />
        </ActionIcon>
        <ActionIcon
          aria-label="Bullet list"
          aria-pressed={blockType === 'bullet'}
          onClick={formatBulletList}
        >
          <BulletListIcon />
        </ActionIcon>
        <ActionIcon
          aria-label="Numbered list"
          aria-pressed={blockType === 'number'}
          onClick={formatNumberedList}
        >
          <NumberedListIcon />
        </ActionIcon>
        <ActionIcon aria-label="Quote" aria-pressed={blockType === 'quote'} onClick={formatQuote}>
          <QuoteIcon />
        </ActionIcon>
      </ActionIcon.Group>
      <ActionIcon.Group>
        <ActionIcon
          aria-label="Bold"
          aria-pressed={isBold}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
          }}
        >
          <BoldIcon />
        </ActionIcon>
        <ActionIcon
          aria-label="Italic"
          aria-pressed={isItalic}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
          }}
        >
          <ItalicIcon />
        </ActionIcon>
        <ActionIcon
          aria-label="Underline"
          aria-pressed={isUnderline}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
          }}
        >
          <UnderlineIcon />
        </ActionIcon>
        <ActionIcon
          aria-label="Strikethrough"
          aria-pressed={isStrikethrough}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
          }}
        >
          <StrikethroughIcon />
        </ActionIcon>
      </ActionIcon.Group>
      <ActionIcon.Group>
        <ActionIcon aria-label="Link" aria-pressed={isLink} onClick={insertLink}>
          <LinkIcon />
        </ActionIcon>
      </ActionIcon.Group>
    </div>
  );
};
