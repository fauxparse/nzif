import { ElementType, ReactElement } from 'react';

import { Polymorphic, WithDisplayName } from '@/types/polymorphic.types';

export type BaseMarkdownProps = {
  //
};

export type MarkdownProps<C extends ElementType = 'div'> = Polymorphic<C, BaseMarkdownProps>;

export type MarkdownComponent = WithDisplayName<
  <C extends ElementType = 'div'>(props: MarkdownProps<C>) => ReactElement | null
>;
