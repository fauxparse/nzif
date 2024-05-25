import { Box, BoxProps } from '@mantine/core';
import React, { PropsWithChildren } from 'react';
import { ActionListItem } from './Item';

import clsx from 'clsx';
import './ActionList.css';

type ActionListProps = PropsWithChildren<BoxProps>;

type ActionList = React.FC<ActionListProps> & {
  Item: typeof ActionListItem;
};

export const ActionList: ActionList = Object.assign(
  ({ className, children, ...props }: ActionListProps) => {
    return (
      <Box className={clsx('action-list', className)} {...props}>
        {children}
      </Box>
    );
  },
  {
    Item: ActionListItem,
  }
);
