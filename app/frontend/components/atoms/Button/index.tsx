import {
  Box,
  BoxProps,
  ButtonGroup,
  PolymorphicFactory,
  polymorphicFactory,
  useProps,
} from '@mantine/core';
import { ColorwayProps, SizeProps, VariantProps } from '@/components/common';
import { PropsWithChildren, ReactNode } from 'react';

import './Button.css';
import clsx from 'clsx';

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'close';

export type ButtonProps = PropsWithChildren &
  Omit<BoxProps, 'left' | 'right'> &
  ColorwayProps &
  SizeProps &
  VariantProps<ButtonVariant> & {
    left?: ReactNode;
    right?: ReactNode;
  };

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
      left,
      right,
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
        {left && (
          <Box component="span" className="button__left">
            {left}
          </Box>
        )}
        <Box component="span" className="button__content">
          {children}
        </Box>
        {right && (
          <Box component="span" className="button__right">
            {right}
          </Box>
        )}
      </Box>
    );
  }
);

Button.Group = ButtonGroup;

export default Button;
