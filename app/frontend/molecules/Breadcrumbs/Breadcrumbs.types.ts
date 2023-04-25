import { ElementType, ReactElement } from 'react';

import { Polymorphic, WithDisplayName } from '@/types/polymorphic.types';

export type BaseBreadcrumbsProps = {
  //
};

export type BreadcrumbsProps<C extends ElementType = 'div'> = Polymorphic<C, BaseBreadcrumbsProps>;

export type BreadcrumbsComponent = WithDisplayName<
  <C extends ElementType = 'div'>(props: BreadcrumbsProps<C>) => ReactElement | null
>;

export type Crumb = {
  label: string;
  path: string;
};
