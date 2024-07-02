import { PolymorphicProps, PolymorphicRef } from '@/types/polymorphic.types';
import { Box, Button, Text } from '@radix-ui/themes';
import clsx from 'clsx';
import { ElementType, forwardRef } from 'react';

import classes from './ActionList.module.css';

export type ItemProps = {
  color?: 'neutral' | 'primary';
  icon?: React.ReactNode;
  disabled?: boolean;
};

export const ActionListItem = forwardRef(
  <C extends ElementType = typeof Button>(
    { as, className, color, icon, disabled, children, ...props }: PolymorphicProps<C, ItemProps>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = (as || Button) as ElementType;

    return (
      <Component ref={ref} className={clsx(classes.item, className)} role="menuitem" {...props}>
        <Box className={classes.icon} asChild>
          {icon}
        </Box>
        <Text className={classes.label} truncate>
          {children}
        </Text>
      </Component>
    );

    // return (
    //   <UnstyledButton
    //     component="button"
    //     className={clsx('action-list-item', className)}
    //     {...others}
    //     ref={useMergedRef(itemRef, ref)}
    //     role="menuitem"
    //     disabled={disabled}
    //     data-menu-item
    //     data-disabled={disabled || undefined}
    //     data-color={color}
    //   >
    //     {leftSection && <div data-position="left">{leftSection}</div>}
    //     {children && <div>{children}</div>}
    //     {rightSection && <div data-position="right">{rightSection}</div>}
    //   </UnstyledButton>
    // );
  }
);

ActionListItem.displayName = 'ActionList.Item';
