import { FragmentOf } from 'gql.tada';
import { TimetableSessionFragment } from './queries';

export type Cell = {
  row: number;
  column: number;
};

export type Rect = {
  start: Cell;
  end: Cell;
};

export type LaidOutSession = {
  session: FragmentOf<typeof TimetableSessionFragment>;
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
