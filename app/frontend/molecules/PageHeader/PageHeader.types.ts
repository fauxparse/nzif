import { ElementType, ReactElement } from 'react';

import { Polymorphic, WithDisplayName } from '@/types/polymorphic.types';

// biome-ignore lint/complexity/noBannedTypes: we might want to extend this type in the future
export type BasePageHeaderProps = {
  //
};

export type PageHeaderProps<C extends ElementType = 'div'> = Polymorphic<C, BasePageHeaderProps>;

export type PageHeaderComponent = WithDisplayName<
  <C extends ElementType = 'div'>(props: PageHeaderProps<C>) => ReactElement | null
>;
