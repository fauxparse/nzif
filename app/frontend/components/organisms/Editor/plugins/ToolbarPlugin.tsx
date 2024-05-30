/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import BoldIcon from '@/icons/BoldIcon';
import CenterAlignIcon from '@/icons/CenterAlignIcon';
import ItalicIcon from '@/icons/ItalicIcon';
import LeftAlignIcon from '@/icons/LeftAlignIcon';
import RedoIcon from '@/icons/RedoIcon';
import RightAlignIcon from '@/icons/RightAlignIcon';
import StrikethroughIcon from '@/icons/StrikethroughIcon';
import UnderlineIcon from '@/icons/UnderlineIcon';
import UndoIcon from '@/icons/UndoIcon';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { ActionIcon } from '@mantine/core';
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';

const LowPriority = 1;

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
    }
  }, []);

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
        <ActionIcon
          aria-label="Align left"
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
          }}
        >
          <LeftAlignIcon />
        </ActionIcon>
        <ActionIcon
          aria-label="Align center"
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
          }}
        >
          <CenterAlignIcon />
        </ActionIcon>
        <ActionIcon
          aria-label="Align right"
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
          }}
        >
          <RightAlignIcon />
        </ActionIcon>
      </ActionIcon.Group>
    </div>
  );
}
