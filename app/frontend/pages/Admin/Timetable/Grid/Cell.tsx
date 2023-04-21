import React from 'react';
import { motion } from 'framer-motion';

import { CellProps } from '../../../../molecules/Grid/Grid.types';

import { useGrid } from './Context';

const Cell: React.FC<CellProps> = ({ row, column, style = {}, ...props }) => {
  const { rows } = useGrid();

  const { track, tracks, row: group } = rows[row];

  const isLast = track === tracks - 1;

  return (
    <motion.div
      {...props}
      style={{ ...style, gridColumn: column + 2, gridRow: row + 2 }}
      data-row={group}
      data-track={track}
      data-of={tracks}
      data-last-track={isLast || undefined}
    ></motion.div>
  );
};

export default Cell;
