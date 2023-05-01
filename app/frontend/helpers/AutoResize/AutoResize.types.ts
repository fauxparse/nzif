import { ComponentProps, ReactElement } from 'react';

export type Dimension = 'width' | 'height';
export type OffsetDimension = 'offsetWidth' | 'offsetHeight';
export type ScrollDimension = 'scrollWidth' | 'scrollHeight';

export const OFFSET: Record<Dimension, OffsetDimension> = {
  width: 'offsetWidth',
  height: 'offsetHeight',
} as const;

export const SCROLL: Record<Dimension, ScrollDimension> = {
  width: 'scrollWidth',
  height: 'scrollHeight',
} as const;

export type AutoResizeProps<T> = Omit<ComponentProps<'div'>, 'children' | 'onResize'> & {
  children: ReactElement<T>;
  dimension?: Dimension;
  onResize?: (component: HTMLElement) => void;
};
