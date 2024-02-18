import { ElementType, ReactElement } from 'react';

import { Polymorphic, WithDisplayName } from '@/types/polymorphic.types';

// biome-ignore lint/complexity/noBannedTypes: we might want to extend this type in the future
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
