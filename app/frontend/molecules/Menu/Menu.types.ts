import { ElementType, ReactElement, ReactNode } from 'react';

import { IconName } from '@/atoms/Icon';
import { Polymorphic, WithDisplayName } from '@/types/polymorphic.types';

// biome-ignore lint/complexity/noBannedTypes: we might want to extend this type in the future
export type BaseMenuProps = {
  //
};

export type MenuProps<C extends ElementType = 'div'> = Polymorphic<C, BaseMenuProps>;

export type MenuComponent = WithDisplayName<
  <C extends ElementType = 'div'>(props: MenuProps<C>) => ReactElement | null
>;

export interface BaseMenuItemProps {
  icon?: IconName;
  label: string;
  right?: string | ReactNode;
  disabled?: boolean;
  selected?: boolean;
}

export type MenuItemProps<C extends ElementType = 'div'> = Polymorphic<C, BaseMenuItemProps>;

export type MenuItemComponent = WithDisplayName<
  <C extends ElementType = 'button'>(props: MenuItemProps<C>) => ReactElement | null
>;
