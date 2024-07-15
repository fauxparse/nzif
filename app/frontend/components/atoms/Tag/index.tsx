import { ColorwayProps, SizeProps } from '@/components/common';
import { Box, BoxProps, PolymorphicFactory, polymorphicFactory, useProps } from '@mantine/core';
import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';

import './Tag.css';

export type TagVariant = 'filled' | 'light' | 'outline' | 'ghost' | 'default';

export interface TagProps extends BoxProps, SizeProps, ColorwayProps {
  variant?: TagVariant;

  /** If set, tag `min-width` becomes equal to its `height` and horizontal padding is removed */
  circle?: boolean;

  /** Content displayed on the left side of the tag label */
  leftSection?: React.ReactNode;

  /** Content displayed on the right side of the tag label */
  rightSection?: React.ReactNode;
}

export type TagFactory = PolymorphicFactory<{
  props: PropsWithChildren<TagProps>;
  defaultRef: HTMLDivElement;
  defaultComponent: 'div';
  variant: TagVariant;
}>;

const defaultProps: Partial<TagProps> = {
  variant: 'light',
  color: 'crimson',
  size: 'small',
};

const Tag = polymorphicFactory<TagFactory>((_props, ref) => {
  const props = useProps('Tag', defaultProps, _props);
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
      className={clsx('tag', circle && 'tag--circle', className)}
      data-variant={variant}
      data-color={color}
      data-size={size}
      {...others}
    >
      {leftSection && (
        <span className="tag__section" data-position="left">
          {leftSection}
        </span>
      )}
      <span className="tag__children">{children}</span>
      {rightSection && (
        <span className="tag__section" data-position="right">
          {rightSection}
        </span>
      )}
    </Box>
  );
});

Tag.displayName = 'Tag';

export default Tag;
