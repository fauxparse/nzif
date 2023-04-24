import React, { ComponentPropsWithoutRef, forwardRef } from 'react';
import clsx from 'clsx';

import { SelectionProps as BaseSelectionProps } from '@/molecules/Grid/Grid.types';

import { useGridContext } from './Context';

type SelectionProps = BaseSelectionProps &
  ComponentPropsWithoutRef<'div'> & {
    className?: string;
    rowOffset?: number;
    columnOffset?: number;
  };

export const Selection = forwardRef<HTMLDivElement, SelectionProps>(
  ({ className, selection, rowOffset, columnOffset, style = {}, ...props }, ref) => {
    const { selectionHeight } = useGridContext();

    const row = selectionHeight(0, selection.row);
    const height = selectionHeight(selection.row, selection.height);

    return (
      <div
        ref={ref}
        className={clsx('grid__selection', className)}
        style={{
          ...style,
          gridRow: `${row + rowOffset + 1} / span ${height}`,
          gridColumn: `${selection.column + columnOffset + 1} / span ${selection.width}`,
        }}
        {...props}
      />
    );
  }
);

Selection.displayName = 'Timetable.Selection';

export default Selection;
