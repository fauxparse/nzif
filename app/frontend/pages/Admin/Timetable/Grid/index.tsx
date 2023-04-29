import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useInterpret, useSelector } from '@xstate/react';
import { AnimatePresence } from 'framer-motion';
import { isEqual, sortBy } from 'lodash-es';

import { TimetableQuery } from '@/graphql/types';
import ContextMenu from '@/molecules/ContextMenu';
import BaseGrid from '@/molecules/Grid';
import { Region } from '@/molecules/Grid/Grid.types';
import Popover from '@/molecules/Popover';
import scrollParent from '@/util/scrollParent';

import Cell from './Cell';
import ColumnHeader from './ColumnHeader';
import { GridContext } from './Context';
import DragMachine from './DragMachine';
import Ghost from './Ghost';
import NewSlot from './NewSlot';
import RowHeader from './RowHeader';
import { Selection } from './Selection';
import TimetableSlot from './TimetableSlot';
import TimetableSlotContextMenu from './TimetableSlotContextMenu';
import useTimetable, { Block } from './useTimetable';

type Slot = TimetableQuery['festival']['timetable']['slots'][0];

type GridProps = {
  startHour?: number;
  endHour?: number;
  granularity?: number;
  slots: Slot[];
};

const Grid: React.FC<GridProps> = ({ slots, startHour = 9, endHour = 26, granularity = 4 }) => {
  const sortedSlots = sortBy(slots, [(s) => s.venue?.position ?? Infinity]);

  const columns = (endHour - startHour) * granularity;

  const { dates, rows, selectionHeight, cellToTime, timeToCell, moveSlot } =
    useTimetable<Slot>(sortedSlots);

  const [selection, updateSelection] = useState<Region | null>(null);

  const setSelection = (selection: Region | null) => {
    updateSelection(selection);

    setPopupOpen(!!selection);
  };

  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    if (!popupOpen) {
      setSelection(null);
    }
  }, [popupOpen]);

  const [selectionElement, setSelectionElement] = useState<HTMLDivElement | null>(null);

  const machine = useInterpret(DragMachine, {});

  const dragState = useSelector(machine, (state) => state);

  const ghostRef = useRef<HTMLDivElement | null>(null);

  const blockFromSlot = (slot: Slot | null): Block<Slot> | null => {
    if (!slot) return null;

    return rows.flatMap((r) => r.blocks).find((b) => b.data.id === slot.id) || null;
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
    const slotElement = elements.find((el) =>
      el.classList.contains('timetable__slot')
    ) as HTMLElement;
    const cell = elements.find((el) => el.classList.contains('grid__cell')) as HTMLElement;
    const parent = slotElement && scrollParent(slotElement);
    if (!slotElement || !cell || !parent) return;

    const slot = slots.find((s) => s.id === slotElement.dataset.id) || null;
    const block = blockFromSlot(slot);

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
      element: slotElement as HTMLElement,
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

      if (moved) return;

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
                {row.blocks.map((slot) => (
                  <TimetableSlot
                    key={slot.data.id}
                    slot={slot}
                    hidden={
                      dragState.matches('lifted') &&
                      dragState.context.block?.data?.id === slot.data.id
                    }
                  />
                ))}
              </Fragment>
            ))}
            <AnimatePresence>
              {dragState.matches('lifted') && (
                <>
                  <Ghost ref={ghostRef} offset={dragOffset} onMove={moveSlot} />
                </>
              )}
            </AnimatePresence>
          </BaseGrid>
          {selectionElement && selection && (
            <Popover reference={selectionElement} open={popupOpen} onOpenChange={setPopupOpen}>
              <NewSlot selection={selection} onClose={() => setPopupOpen(false)} />
            </Popover>
          )}
        </GridContext.Provider>
      </div>
      <TimetableSlotContextMenu />
    </ContextMenu.Root>
  );
};

export default Grid;
