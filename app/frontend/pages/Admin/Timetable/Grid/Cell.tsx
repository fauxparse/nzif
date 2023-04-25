import React from 'react';

import { CellProps } from '@/molecules/Grid/Grid.types';

import { useGridContext } from './Context';

const Cell: React.FC<CellProps> = ({ row, column, style = {}, ...props }) => {
  const { rows } = useGridContext();

  const { track, tracks, row: group } = rows[row];

  const isLast = track === tracks - 1;

  return (
    <div
      {...props}
      style={{ ...style, gridColumn: column + 2, gridRow: row + 2 }}
      data-row={group}
      data-track={track}
      data-of={tracks}
      data-last-track={isLast || undefined}
    ></div>
  );
};

export default Cell;
