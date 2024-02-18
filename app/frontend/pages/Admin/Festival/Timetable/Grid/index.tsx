import { useInterpret, useSelector } from '@xstate/react';
import { AnimatePresence } from 'framer-motion';
import { isEqual, sortBy } from 'lodash-es';
import React, { Fragment, useEffect, useRef, useState } from 'react';

import { TimetableSessionFragment } from '@/graphql/types';
import ContextMenu from '@/molecules/ContextMenu';
import BaseGrid from '@/molecules/Grid';
import { Region } from '@/molecules/Grid/Grid.types';
import Popover from '@/molecules/Popover';
import scrollParent from '@/util/scrollParent';

import ActivityPopover from './ActivityPopover';
import Cell from './Cell';
import ColumnHeader from './ColumnHeader';
import { GridContext } from './Context';
import DragMachine from './DragMachine';
import Ghost from './Ghost';
import NewSession from './NewSession';
import RowHeader from './RowHeader';
import { Selection } from './Selection';
import TimetableSession from './TimetableSession';
import TimetableSessionContextMenu from './TimetableSessionContextMenu';
import useTimetable, { Block } from './useTimetable';

type Session = TimetableSessionFragment;

type GridProps = {
  startHour?: number;
  endHour?: number;
  granularity?: number;
  sessions: Session[];
};

const Grid: React.FC<GridProps> = ({ sessions, startHour = 9, endHour = 26, granularity = 4 }) => {
  const sortedSessions = sortBy(sessions, [(s) => s.venue?.position ?? Infinity]);

  const columns = (endHour - startHour) * granularity;

  const { dates, rows, selectionHeight, cellToTime, timeToCell, moveSession } =
    useTimetable<Session>(sortedSessions);

  const [selection, updateSelection] = useState<Region | null>(null);

  const setSelection = (selection: Region | null) => {
    updateSelection(selection);

    setNewSessionOpen(!!selection);
  };

  const [newSessionOpen, setNewSessionOpen] = useState(false);

  useEffect(() => {
    if (!newSessionOpen) {
      setSelection(null);
    }
  }, [newSessionOpen]);

  const [selectionElement, setSelectionElement] = useState<HTMLDivElement | null>(null);

  const [clickedSession, setClickedSession] = useState<HTMLElement | null>(null);

  const machine = useInterpret(DragMachine, {});

  const dragState = useSelector(machine, (state) => state);

  const ghostRef = useRef<HTMLDivElement | null>(null);

  const session = useRef<TimetableSessionFragment | null>(null);

  const blockFromSession = (session: Session | null): Block<Session> | null => {
    if (!session) return null;

    return rows.flatMap((r) => r.blocks).find((b) => b.data.id === session.id) || null;
  };

  const [dragOffset, setDragOffset] = useState<{
    row: number;
    column: number;
    x: number;
    y: number;
  }>({
    row: 0,
    column: 0,
    x: 0,
    y: 0,
  });

  const pointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const { clientX, clientY, pointerType } = event;
    const elements = document.elementsFromPoint(clientX, clientY);
    const sessionElement = elements.find((el) =>
      el.classList.contains('timetable__session')
    ) as HTMLElement;
    const cell = elements.find((el) => el.classList.contains('grid__cell')) as HTMLElement;
    const parent = sessionElement && scrollParent(sessionElement);
    if (!sessionElement || !cell || !parent) return;

    const session = sessions.find((s) => s.id === sessionElement.dataset.id) || null;
    const block = blockFromSession(session);

    if (!block) return;

    const row = parseInt(cell.dataset.row ?? '0', 10);
    const column = parseInt(cell.dataset.column ?? '0', 10);
    const origin = { row, column, x: clientX, y: clientY };
    setDragOffset({ row: 0, column: 0, x: 0, y: 0 });
    const pointerOrigin = { x: clientX, y: clientY };

    let moved = false;

    machine.send({
      type: 'POINTER_DOWN',
      block,
      origin,
      element: sessionElement as HTMLElement,
      pointerType,
    });

    const pointerMove = (event: PointerEvent) => {
      const cell = document
        .elementsFromPoint(event.clientX, event.clientY)
        .find((el) => el.classList.contains('grid__cell')) as HTMLElement;
      if (!cell) return;

      const row = parseInt(cell.dataset.row ?? '0', 10) - origin.row;
      const column = parseInt(cell.dataset.column ?? '0', 10) - origin.column;

      const x = event.clientX - pointerOrigin.x;
      const y = event.clientY - pointerOrigin.y;

      const newPosition = { row, column, x, y };

      setDragOffset((current) => (isEqual(newPosition, current) ? current : newPosition));

      if (moved || Math.abs(x) + Math.abs(y) < 8) return;

      machine.send({
        type: 'POINTER_MOVE',
      });

      moved = true;
    };

    const pointerUp = () => {
      machine.send({ type: 'POINTER_UP' });
      document.removeEventListener('pointermove', pointerMove);
      document.removeEventListener('pointerup', pointerUp);
    };

    document.addEventListener('pointermove', pointerMove);
    document.addEventListener('pointerup', pointerUp, { once: true });
  };

  useEffect(() => {
    if (dragState.matches('clicked')) {
      setClickedSession(dragState.context.element);
      session.current = dragState.context.block?.data || null;
    }
  }, [dragState]);

  return (
    <ContextMenu.Root>
      <div className="timetable__grid">
        <GridContext.Provider
          value={{
            dates,
            rows,
            columns,
            selectionHeight,
            cellToTime,
            timeToCell,
            setSelectionElement,
            machine,
          }}
        >
          <BaseGrid
            rows={rows.length}
            columns={columns}
            selection={selection}
            rowHeader={RowHeader}
            columnHeader={ColumnHeader}
            cell={Cell}
            selectionComponent={Selection}
            onSelectionChange={setSelection}
            onPointerDown={pointerDown}
          >
            {rows.map((row, i) => (
              <Fragment key={i}>
                {row.blocks.map((session) => (
                  <TimetableSession
                    key={session.data.id}
                    session={session}
                    hidden={
                      dragState.matches('lifted') &&
                      dragState.context.block?.data?.id === session.data.id
                    }
                  />
                ))}
              </Fragment>
            ))}
            <AnimatePresence>
              {dragState.matches('lifted') && (
                <>
                  <Ghost ref={ghostRef} offset={dragOffset} onMove={moveSession} />
                </>
              )}
            </AnimatePresence>
          </BaseGrid>
          {selectionElement && selection && (
            <Popover
              reference={selectionElement}
              open={newSessionOpen}
              onOpenChange={setNewSessionOpen}
            >
              <NewSession selection={selection} onClose={() => setNewSessionOpen(false)} />
            </Popover>
          )}
          {clickedSession && session.current && (
            <ActivityPopover
              session={session.current}
              activity={session.current.activity}
              reference={clickedSession}
              open
              onOpenChange={(open) => {
                if (!open) setClickedSession(null);
              }}
            />
          )}
        </GridContext.Provider>
      </div>
      <TimetableSessionContextMenu />
    </ContextMenu.Root>
  );
};

export default Grid;
