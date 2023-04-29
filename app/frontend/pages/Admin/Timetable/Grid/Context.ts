import { createContext, useContext } from 'react';
import { DateTime } from 'luxon';
import { InterpreterFrom } from 'xstate';

import { Cell } from '@/molecules/Grid/Grid.types';

import DragMachine from './DragMachine';
import { Row, Schedule } from './useTimetable';

type GridContextType = {
  rows: Row<Schedule>[];
  columns: number;
  dates: DateTime[];
  selectionHeight: (row: number, height: number) => number;
  cellToTime: (cell: Cell) => DateTime;
  timeToCell: (time: DateTime) => Cell;
  setSelectionElement: (element: HTMLDivElement | null) => void;
  machine: InterpreterFrom<typeof DragMachine>;
};

export const GridContext = createContext<GridContextType>({} as GridContextType);

export const useGridContext = () => useContext(GridContext);
