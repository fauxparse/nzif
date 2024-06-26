import { ElementType, ReactElement } from 'react';

import { Polymorphic, WithDisplayName } from '@/types/polymorphic.types';

export type BasePlacenameProps = {
  name: string;
  traditionalName?: string;
  showTraditionalNameByDefault?: boolean;
};

export type PlacenameProps<C extends ElementType = 'span'> = Polymorphic<C, BasePlacenameProps>;

export type PlacenameComponent = WithDisplayName<
  <C extends ElementType = 'span'>(props: PlacenameProps<C>) => ReactElement | null
>;
