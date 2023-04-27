import React, { Fragment, useEffect, useState } from 'react';
import { sortBy } from 'lodash-es';

import { TimetableQuery } from '@/graphql/types';
import ContextMenu from '@/molecules/ContextMenu';
import BaseGrid from '@/molecules/Grid';
import { Region } from '@/molecules/Grid/Grid.types';
import Popover from '@/molecules/Popover';

import Cell from './Cell';
import ColumnHeader from './ColumnHeader';
import { GridContext } from './Context';
import NewSlot from './NewSlot';
import RowHeader from './RowHeader';
import { Selection } from './Selection';
import TimetableSlot from './TimetableSlot';
import TimetableSlotContextMenu from './TimetableSlotContextMenu';
import useTimetable from './useTimetable';

type Slot = TimetableQuery['festival']['timetable']['slots'][0];

type GridProps = {
  startHour?: number;
  endHour?: number;
  granularity?: number;
  slots: Slot[];
};

const Grid: React.FC<GridProps> = ({ slots, startHour = 9, endHour = 26, granularity = 4 }) => {
  const sortedSlots = sortBy(slots, ['startsAt', (s) => s.venue?.position ?? Infinity]);

  const { dates, rows, selectionHeight, cellToTime, timeToCell } = useTimetable<Slot>(sortedSlots);

  const [selection, updateSelection] = useState<Region | null>(null);

  const [ghostSelection, setGhostSelection] = useState<Region>({
    row: 0,
    column: 0,
    width: 1,
    height: 1,
  });

  const setSelection = (selection: Region | null) => {
    updateSelection(selection);

    if (selection) {
      setGhostSelection(selection);
      setPopupOpen(true);
    }
  };

  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    if (!popupOpen) {
      setSelection(null);
    }
  }, [popupOpen]);

  const [ghost, setGhost] = useState<HTMLDivElement | null>(null);

  return (
    <ContextMenu.Root>
      <div className="timetable__grid">
        <GridContext.Provider value={{ dates, rows, selectionHeight, cellToTime, timeToCell }}>
          <BaseGrid
            rows={rows.length}
            columns={(endHour - startHour) * granularity}
            selection={selection}
            rowHeader={RowHeader}
            columnHeader={ColumnHeader}
            cell={Cell}
            selectionComponent={Selection}
            onSelectionChange={setSelection}
          >
            {rows.map((row, i) => (
              <Fragment key={i}>
                {row.blocks.map((slot) => (
                  <TimetableSlot key={slot.data.id} slot={slot} />
                ))}
              </Fragment>
            ))}
            <Selection
              className="timetable__selection--ghost"
              selection={ghostSelection}
              rowOffset={1}
              columnOffset={1}
              ref={setGhost}
            />
          </BaseGrid>
          {ghost && (
            <Popover reference={ghost} open={popupOpen} onOpenChange={setPopupOpen}>
              <NewSlot selection={ghostSelection} onClose={() => setPopupOpen(false)} />
            </Popover>
          )}
        </GridContext.Provider>
      </div>
      <TimetableSlotContextMenu />
    </ContextMenu.Root>
  );
};

export default Grid;
