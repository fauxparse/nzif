import { ActionListItem, ActionListItemProps } from '@/components/molecules/ActionList/Item';
import { useDrawerContext } from '@/components/molecules/Drawer/Context';
import { createPolymorphicComponent } from '@mantine/core';
import { forwardRef } from 'react';

type NavigationItemProps = ActionListItemProps & {
  onClick?: React.MouseEventHandler<HTMLElement>;
};

export const NavigationItem = createPolymorphicComponent<'button', NavigationItemProps>(
  forwardRef<HTMLButtonElement, NavigationItemProps>(({ onClick, ...props }, ref) => {
    const { close } = useDrawerContext();

    const clicked = (e: React.MouseEvent<HTMLElement>) => {
      close();
      onClick?.(e);
    };

    return <ActionListItem ref={ref} onClick={clicked} {...props} />;
  })
);
