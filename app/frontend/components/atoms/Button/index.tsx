import type { ColorwayProps, SizeProps, VariantProps } from '@/components/common';
import { Box, ButtonGroup, polymorphicFactory, useProps } from '@mantine/core';
import type { BoxProps, ButtonProps as BaseButtonProps, PolymorphicFactory } from '@mantine/core';
import type { PropsWithChildren, ReactNode } from 'react';

import clsx from 'clsx';
import './Button.css';

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'close';

export type ButtonProps = PropsWithChildren &
  BoxProps &
  ColorwayProps &
  SizeProps &
  VariantProps<ButtonVariant> &
  Pick<BaseButtonProps, 'leftSection' | 'rightSection'>;

type ButtonFactory = PolymorphicFactory<{
  props: ButtonProps;
  defaultRef: HTMLButtonElement;
  defaultComponent: 'button';
  staticComponents: {
    Group: typeof ButtonGroup;
  };
}>;

const defaultProps: Partial<ButtonProps> = {
  variant: 'outline',
  size: 'medium',
  color: 'neutral',
};

const Button = polymorphicFactory<ButtonFactory>(
  // biome-ignore lint/suspicious/noExplicitAny:
  (_props: ButtonProps & { component?: any }, ref) => {
    const {
      component = 'button',
      className,
      size,
      variant,
      color,
      leftSection,
      rightSection,
      children,
      ...props
    } = useProps('Button', defaultProps, _props);

    return (
      <Box
        component={component}
        type={component === 'button' ? 'button' : undefined}
        ref={ref}
        className={clsx('button', className)}
        data-variant={variant}
        data-color={color}
        data-size={size}
        {...props}
      >
        {leftSection && (
          <Box component="span" className="button__left">
            {leftSection}
          </Box>
        )}
        <Box component="span" className="button__content">
          {children}
        </Box>
        {rightSection && (
          <Box component="span" className="button__right">
            {rightSection}
          </Box>
        )}
      </Box>
    );
  }
);

Button.Group = ButtonGroup;

export default Button;
