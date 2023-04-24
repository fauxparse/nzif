import { ComponentPropsWithoutRef, ElementType, ReactElement } from 'react';

import { WithDisplayName } from '@/types/polymorphic.types';
import { PropsWithVariants } from '@/types/variants';

export enum Orientation {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

export const SCROLLABLE_VARIANTS = {
  orientation: {
    values: Orientation,
    defaultValue: Orientation.VERTICAL,
  },
};

export type BaseScrollableProps = PropsWithVariants<typeof SCROLLABLE_VARIANTS>;

export type ScrollableProps<C extends ElementType = 'div'> = Omit<
  ComponentPropsWithoutRef<C>,
  keyof BaseScrollableProps
> &
  BaseScrollableProps;

export type ScrollableComponent = WithDisplayName<
  <C extends ElementType = 'div'>(props: ScrollableProps<C>) => ReactElement | null
>;
