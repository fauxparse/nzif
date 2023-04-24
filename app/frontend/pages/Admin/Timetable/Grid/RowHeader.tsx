import React from 'react';
import { motion } from 'framer-motion';

import { RowHeaderProps } from '../../../../molecules/Grid/Grid.types';

import { useGridContext } from './Context';

const RowHeader: React.FC<RowHeaderProps> = ({ row, style, ...props }) => {
  const { rows } = useGridContext();
  const { date, track, tracks } = rows[row];

  if (track > 0) return <div style={{ gridColumn: 1, gridRow: row + 2, visibility: 'hidden' }} />;

  return (
    <motion.div
      style={{
        gridColumn: 1,
        gridRow: `${row + 2} / span ${tracks}`,
      }}
      {...props}
    >
      <span className="weekday">{date.toFormat('cccc')}</span>
      <span className="day">{date.toFormat('dd')}</span>
      <span className="month">{date.toFormat('MMMM')}</span>
    </motion.div>
  );
};

export default RowHeader;
