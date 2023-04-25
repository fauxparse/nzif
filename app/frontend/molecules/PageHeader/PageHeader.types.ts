import { ElementType, ReactElement } from 'react';

import { Polymorphic, WithDisplayName } from '@/types/polymorphic.types';

export type BasePageHeaderProps = {
  //
};

export type PageHeaderProps<C extends ElementType = 'div'> = Polymorphic<C, BasePageHeaderProps>;

export type PageHeaderComponent = WithDisplayName<
  <C extends ElementType = 'div'>(props: PageHeaderProps<C>) => ReactElement | null
>;
