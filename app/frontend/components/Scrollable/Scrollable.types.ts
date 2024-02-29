import { ComponentPropsWithoutRef, ElementType, ReactElement } from 'react';

import { WithDisplayName } from '@/types/polymorphic.types';
import { PropsWithVariants } from '@/types/variants';

export type Orientation = 'horizontal' | 'vertical';

export type BaseScrollableProps = { orientation: Orientation };

export type ScrollableProps<C extends ElementType = 'div'> = Omit<
  ComponentPropsWithoutRef<C>,
  keyof BaseScrollableProps
> &
  BaseScrollableProps;

export type ScrollableComponent = WithDisplayName<
  <C extends ElementType = 'div'>(props: ScrollableProps<C>) => ReactElement | null
>;
