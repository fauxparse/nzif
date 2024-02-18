import { ElementType, ReactElement } from 'react';

import { Polymorphic, WithDisplayName } from '@/types/polymorphic.types';

// biome-ignore lint/complexity/noBannedTypes: we might want to extend this type in the future
export type BaseCardProps = {
  //
};

export type CardProps<C extends ElementType = 'div'> = Polymorphic<C, BaseCardProps>;

export type CardComponent = WithDisplayName<
  <C extends ElementType = 'div'>(props: CardProps<C>) => ReactElement | null
>;
