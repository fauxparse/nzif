import React from 'react';

import { SelectionProps } from './Grid.types';

export const Selection: React.FC<SelectionProps> = ({ selection, rowOffset, columnOffset }) => (
  <div
    className="grid__selection"
    style={{
      gridRow: `${selection.row + rowOffset + 1} / span ${selection.height}`,
      gridColumn: `${selection.column + columnOffset + 1} / span ${selection.width}`,
    }}
  />
);

export default Selection;
