import React, { useMemo } from 'react';

import { RowHeaderProps } from '@/molecules/Grid/Grid.types';

import { useGridContext } from './Context';

const RowHeader: React.FC<RowHeaderProps> = ({ row, style, ...props }) => {
  const { rows } = useGridContext();
  const { date, track, tracks } = rows[row];

  const weekday = useMemo(() => date.toFormat('cccc'), [date]);
  const day = useMemo(() => date.toFormat('dd'), [date]);
  const month = useMemo(() => date.toFormat('MMMM'), [date]);

  if (track > 0) return <div style={{ gridColumn: 1, gridRow: row + 2, visibility: 'hidden' }} />;

  return (
    <div
      style={{
        gridColumn: 1,
        gridRow: `${row + 2} / span ${tracks}`,
      }}
      {...props}
    >
      <span className="weekday">{weekday}</span>
      <span className="day">{day}</span>
      <span className="month">{month}</span>
    </div>
  );
};

export default RowHeader;
