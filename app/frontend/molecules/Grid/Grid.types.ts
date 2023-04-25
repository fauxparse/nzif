import { ComponentPropsWithoutRef, ElementType, ReactElement } from 'react';

import { Polymorphic, WithDisplayName } from '../../types/polymorphic.types';

export type Cell = {
  row: number;
  column: number;
};

export type Region = {
  row: number;
  column: number;
  width: number;
  height: number;
};

export type RowHeaderProps = ComponentPropsWithoutRef<'div'> & {
  row: number;
};

export type ColumnHeaderProps = ComponentPropsWithoutRef<'div'> & {
  column: number;
};

export type CellProps = ComponentPropsWithoutRef<'div'> & Cell;

export type BaseGridProps = {
  rows: number;
  columns: number;
  selection?: Region | null;
  rowHeader?: React.FC<RowHeaderProps>;
  columnHeader?: React.FC<ColumnHeaderProps>;
  cell?: React.FC<CellProps>;
  selectionComponent?: React.FC<SelectionProps>;
  onSelectionChange?: (selection: Region | null) => void;
};

export type GridProps<C extends ElementType = 'div'> = Polymorphic<C, BaseGridProps>;

export type GridComponent = WithDisplayName<
  <C extends ElementType = 'div'>(props: GridProps<C>) => ReactElement | null
>;

export type SelectionProps = {
  selection: Region;
  rowOffset: number;
  columnOffset: number;
};
