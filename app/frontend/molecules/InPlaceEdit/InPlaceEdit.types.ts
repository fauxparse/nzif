import { ElementType, ReactElement } from 'react';

import { Polymorphic, WithDisplayName } from '@/types/polymorphic.types';

export type BaseInPlaceEditProps = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void | Promise<string>;
};

export type InPlaceEditProps<C extends ElementType = 'input'> = Polymorphic<
  C,
  BaseInPlaceEditProps
>;

export type InPlaceEditComponent = WithDisplayName<
  <C extends ElementType = 'input'>(props: InPlaceEditProps<C>) => ReactElement | null
>;
