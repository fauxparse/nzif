import { createContext, useContext } from 'react';

import { Row, Schedule } from './useTimetable';

type GridContextType = {
  rows: Row<Schedule>[];
  selectionHeight: (row: number, height: number) => number;
};

export const GridContext = createContext<GridContextType>({} as GridContextType);

export const useGrid = () => useContext(GridContext);
