import { createContext, useContext } from 'react';
import { DateTime } from 'luxon';

import { Cell } from '@/molecules/Grid/Grid.types';

import { Row, Schedule } from './useTimetable';

type GridContextType = {
  rows: Row<Schedule>[];
  dates: DateTime[];
  selectionHeight: (row: number, height: number) => number;
  cellToTime: (cell: Cell) => DateTime;
  timeToCell: (time: DateTime) => Cell;
};

export const GridContext = createContext<GridContextType>({} as GridContextType);

export const useGridContext = () => useContext(GridContext);
