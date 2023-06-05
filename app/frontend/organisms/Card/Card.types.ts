import { ElementType, ReactElement } from 'react';

import { Polymorphic, WithDisplayName } from '@/types/polymorphic.types';

export type BaseCardProps = {
  //
};

export type CardProps<C extends ElementType = 'div'> = Polymorphic<C, BaseCardProps>;

export type CardComponent = WithDisplayName<
  <C extends ElementType = 'div'>(props: CardProps<C>) => ReactElement | null
>;
