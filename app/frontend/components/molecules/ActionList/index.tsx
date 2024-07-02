import { Box, BoxProps } from '@radix-ui/themes';
import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';
import { ActionListItem } from './Item';

import classes from './ActionList.module.css';

type ActionListProps = PropsWithChildren<BoxProps> & {
  variant?: 'default' | 'subtle';
};

type ActionList = React.FC<ActionListProps> & {
  Item: typeof ActionListItem;
};

export const ActionList: ActionList = Object.assign(
  ({ className, variant = 'default', children, ...props }: ActionListProps) => {
    return (
      <Box className={clsx(classes.list, className)} data-variant={variant} {...props}>
        {children}
      </Box>
    );
  },
  {
    Item: ActionListItem,
  }
);
