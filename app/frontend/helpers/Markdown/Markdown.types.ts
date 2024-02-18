import { ElementType, ReactElement } from 'react';

import { Polymorphic, WithDisplayName } from '@/types/polymorphic.types';

// biome-ignore lint/complexity/noBannedTypes: we may want to extend this in future
export type BaseMarkdownProps = {
  //
};

export type MarkdownProps<C extends ElementType = 'div'> = Polymorphic<C, BaseMarkdownProps>;

export type MarkdownComponent = WithDisplayName<
  <C extends ElementType = 'div'>(props: MarkdownProps<C>) => ReactElement | null
>;
