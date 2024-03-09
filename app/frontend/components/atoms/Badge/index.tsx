import React, { PropsWithChildren } from 'react';
import { Box, BoxProps, polymorphicFactory, PolymorphicFactory, useProps } from '@mantine/core';
import { SizeProps, ColorwayProps } from '@/components/common';
import clsx from 'clsx';

import './Badge.css';

export type BadgeVariant = 'filled' | 'light' | 'outline' | 'dot' | 'ghost' | 'default';

export interface BadgeProps extends BoxProps, SizeProps, ColorwayProps {
  variant?: BadgeVariant;

  /** If set, badge `min-width` becomes equal to its `height` and horizontal padding is removed */
  circle?: boolean;

  /** Content displayed on the left side of the badge label */
  leftSection?: React.ReactNode;

  /** Content displayed on the right side of the badge label */
  rightSection?: React.ReactNode;
}

export type BadgeFactory = PolymorphicFactory<{
  props: PropsWithChildren<BadgeProps>;
  defaultRef: HTMLDivElement;
  defaultComponent: 'div';
  variant: BadgeVariant;
}>;

const defaultProps: Partial<BadgeProps> = {
  variant: 'default',
  color: 'magenta',
  size: 'small',
};

const Badge = polymorphicFactory<BadgeFactory>((_props, ref) => {
  const props = useProps('Badge', defaultProps, _props);
  const {
    className,
    leftSection,
    rightSection,
    children,
    variant,
    color,
    size,
    circle,
    ...others
  } = props;

  return (
    <Box
      ref={ref}
      className={clsx('badge', circle && 'badge--circle', className)}
      data-variant={variant}
      data-color={color}
      data-size={size}
      {...others}
    >
      {leftSection && (
        <span className="badge__section" data-position="left">
          {leftSection}
        </span>
      )}
      <span className="badge__children">{children}</span>
      {rightSection && (
        <span className="badge__section" data-position="right">
          {rightSection}
        </span>
      )}
    </Box>
  );
});

Badge.displayName = 'Badge';

export default Badge;
