import { FragmentOf } from 'gql.tada';
import {
  TimetableActivityFragment,
  TimetableCastFragment,
  TimetableSessionFragment,
} from './queries';

export type Session = FragmentOf<typeof TimetableSessionFragment>;
export type Presenter = FragmentOf<typeof TimetableCastFragment>;
export type Activity = FragmentOf<typeof TimetableActivityFragment>;

export type Cell = {
  row: number;
  column: number;
};

export type Rect = {
  start: Cell;
  end: Cell;
};

export type LaidOutSession = {
  session: Session;
  rect: Rect;
  track: number;
};

export const normalizeRect = (rect: Rect): Rect => ({
  start: {
    row: Math.min(rect.start.row, rect.end.row),
    column: Math.min(rect.start.column, rect.end.column),
  },
  end: {
    row: Math.max(rect.start.row, rect.end.row),
    column: Math.max(rect.start.column, rect.end.column),
  },
});

export const rightOf = (cell: Cell) => ({ row: cell.row, column: cell.column + 1 });
