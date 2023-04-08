import { ElementType, ReactElement, ReactNode } from 'react';

import { Polymorphic, WithDisplayName } from '../../types/polymorphic.types';
import { PropsWithVariants } from '../../types/variants';
import { IconName } from '../Icon/icons';

/* c8 ignore next */
export enum ButtonSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

/* c8 ignore next */
export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TOOLBAR = 'toolbar',
  INLINE = 'inline',
}

export const BUTTON_VARIANTS = {
  size: {
    values: ButtonSize,
    defaultValue: ButtonSize.MEDIUM,
  },
  variant: {
    values: ButtonVariant,
    defaultValue: ButtonVariant.SECONDARY,
  },
} as const;

export type AllButtonVariants = PropsWithVariants<typeof BUTTON_VARIANTS>;

export type BaseButtonProps = AllButtonVariants & {
  /**
   * Text content to render inside the button
   * @type string | ReactNode
   */
  text?: string | ReactNode;
  /**
   * Icon to render inside the button
   * @type ReactNode
   */
  icon?: IconName | ReactNode;
  stretch?: boolean;
};

export type ButtonProps<C extends ElementType = 'button'> = Polymorphic<C, BaseButtonProps>;

export type ButtonComponent = WithDisplayName<
  <C extends ElementType = 'button'>(props: ButtonProps<C>) => ReactElement | null
>;
