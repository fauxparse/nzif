import { Box, BoxProps, Theme, ThemeProps } from '@radix-ui/themes';
import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';
import { ActionListItem } from './Item';

import classes from './ActionList.module.css';

type ActionListProps = PropsWithChildren<BoxProps> & {
  variant?: 'default' | 'subtle';
  color?: ThemeProps['accentColor'];
};

type ActionList = React.FC<ActionListProps> & {
  Item: typeof ActionListItem;
};

export const ActionList: ActionList = Object.assign(
  ({ className, variant = 'default', color = 'gray', children, ...props }: ActionListProps) => {
    return (
      <Theme asChild accentColor={color}>
        <Box
          className={clsx(classes.list, className)}
          role="menu"
          data-variant={variant}
          {...props}
        >
          {children}
        </Box>
      </Theme>
    );
  },
  {
    Item: ActionListItem,
  }
);
