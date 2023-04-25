import React, { Fragment, useEffect, useState } from 'react';

import { TimetableQuery } from '@/graphql/types';
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
import useTimetable from './useTimetable';

type Slot = TimetableQuery['festival']['timetable']['slots'][0];

type GridProps = {
  startHour?: number;
  endHour?: number;
  granularity?: number;
  slots: Slot[];
};

const Grid: React.FC<GridProps> = ({ slots, startHour = 9, endHour = 26, granularity = 4 }) => {
  const { dates, rows, selectionHeight, cellToTime, timeToCell } = useTimetable<Slot>(slots);

  const [ghostSelection, setGhostSelection] = useState<Region>({
    row: 0,
    column: 0,
    width: 1,
    height: 1,
  });

  const [selectionVisible, setSelectionVisible] = useState(false);

  const setSelection = (selection: Region | null) => {
    if (selection) {
      setGhostSelection(selection);
      setSelectionVisible(true);
      setPopupOpen(true);
    }
  };

  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    if (!popupOpen) {
      setSelectionVisible(false);
    }
  }, [popupOpen]);

  const [ghost, setGhost] = useState<HTMLDivElement | null>(null);

  return (
    <div className="timetable__grid">
      <GridContext.Provider value={{ dates, rows, selectionHeight, cellToTime, timeToCell }}>
        <BaseGrid
          rows={rows.length}
          columns={(endHour - startHour) * granularity}
          rowHeader={RowHeader}
          columnHeader={ColumnHeader}
          cell={Cell}
          selection={Selection}
          onSelectionChange={setSelection}
          data-selection-visible={selectionVisible}
        >
          {rows.map((row, i) => (
            <Fragment key={i}>
              {row.blocks.map((slot, i) => (
                <TimetableSlot key={i} slot={slot} />
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
  );
};

export default Grid;
