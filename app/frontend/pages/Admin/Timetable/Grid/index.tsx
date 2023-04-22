import React, { Fragment } from 'react';

import BaseGrid from '@/molecules/Grid';

import Cell from './Cell';
import ColumnHeader from './ColumnHeader';
import { GridContext } from './Context';
import RowHeader from './RowHeader';
import { Selection } from './Selection';
import useTimetable from './useTimetable';

type GridProps = {
  startHour?: number;
  endHour?: number;
  granularity?: number;
};

const Grid: React.FC<GridProps> = ({ startHour = 9, endHour = 26, granularity = 4 }) => {
  const { rows, selectionHeight } = useTimetable();

  return (
    <div className="timetable__grid">
      <GridContext.Provider value={{ rows, selectionHeight }}>
        <BaseGrid
          rows={rows.length}
          columns={(endHour - startHour) * granularity}
          rowHeader={RowHeader}
          columnHeader={ColumnHeader}
          cell={Cell}
          selection={Selection}
        >
          {rows.map((row, i) => (
            <Fragment key={i}>
              {row.blocks.map((slot, i) => (
                <div
                  key={i}
                  className="timetable__slot"
                  style={{
                    gridRow: `${slot.row + 2} / span ${slot.height}`,
                    gridColumn: `${slot.column + 2} / span ${slot.width}`,
                  }}
                ></div>
              ))}
            </Fragment>
          ))}
        </BaseGrid>
      </GridContext.Provider>
    </div>
  );
};

export default Grid;
