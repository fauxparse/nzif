import React from 'react';

import { ColumnHeaderProps } from '../../../../molecules/Grid/Grid.types';
import Context from '../Context';

const ColumnHeader: React.FC<ColumnHeaderProps> = ({ column, style, ...props }) => {
  const { startHour, granularity } = React.useContext(Context);

  const hour = Math.floor(column / granularity) + startHour;

  return (
    <div
      style={{
        gridRow: 1,
        gridColumn: `${column + 2} / span ${column % granularity ? 1 : granularity}`,
      }}
      {...props}
    >
      {column % granularity === 0 && `${((hour + 11) % 12) + 1}:00`}
    </div>
  );
};

export default ColumnHeader;
