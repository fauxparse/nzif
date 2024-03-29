import clsx from 'clsx';
import React, { ComponentPropsWithoutRef, forwardRef } from 'react';
import { mergeRefs } from 'react-merge-refs';

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
    const { selectionHeight, setSelectionElement } = useGridContext();

    const row = selectionHeight(0, selection.row);
    const height = selectionHeight(selection.row, selection.height);

    return (
      <div
        ref={mergeRefs([ref, setSelectionElement])}
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
