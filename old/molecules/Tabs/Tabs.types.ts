import { ElementType, ReactElement } from 'react';

import { Polymorphic, WithDisplayName } from '@/types/polymorphic.types';

// biome-ignore lint/complexity/noBannedTypes: we might want to extend this type in the future
export type BaseTabsProps = {
  //
};

export type TabsProps<C extends ElementType = 'div'> = Polymorphic<C, BaseTabsProps>;

export type TabsComponent = WithDisplayName<
  <C extends ElementType = 'div'>(props: TabsProps<C>) => ReactElement | null
>;

export type BaseTabProps = {
  selected?: boolean;
  text?: string;
};

export type TabProps<C extends ElementType = 'button'> = Polymorphic<C, BaseTabProps>;

export type TabComponent = WithDisplayName<
  <C extends ElementType = 'button'>(props: TabProps<C>) => ReactElement | null
>;
