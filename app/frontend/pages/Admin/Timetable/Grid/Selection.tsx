import React from 'react';

import { SelectionProps } from '../../../../molecules/Grid/Grid.types';

import { useGrid } from './Context';

export const Selection: React.FC<SelectionProps> = ({ selection, rowOffset, columnOffset }) => {
  const { selectionHeight } = useGrid();

  const row = selectionHeight(0, selection.row);
  const height = selectionHeight(selection.row, selection.height);

  return (
    <div
      className="grid__selection"
      style={{
        gridRow: `${row + rowOffset + 1} / span ${height}`,
        gridColumn: `${selection.column + columnOffset + 1} / span ${selection.width}`,
      }}
    />
  );
};

export default Selection;
