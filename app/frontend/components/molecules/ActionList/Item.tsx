import { BoxProps, UnstyledButton, createPolymorphicComponent } from '@mantine/core';
import { useMergedRef } from '@mantine/hooks';
import clsx from 'clsx';
import { PropsWithChildren, forwardRef, useRef } from 'react';

export type ActionListItemProps = PropsWithChildren<BoxProps> & {
  color?: 'neutral' | 'primary';

  /** Section displayed on the left side of the label */
  leftSection?: React.ReactNode;

  /** Section displayed on the right side of the label */
  rightSection?: React.ReactNode;

  /** Disables item */
  disabled?: boolean;
};

export const ActionListItem = createPolymorphicComponent<'button', ActionListItemProps>(
  forwardRef<HTMLButtonElement, ActionListItemProps>(
    (
      {
        className,
        style,
        color = 'neutral',
        leftSection,
        rightSection,
        children,
        disabled,
        ...others
      },
      ref
    ) => {
      const itemRef = useRef<HTMLButtonElement>();

      return (
        <UnstyledButton
          component="button"
          className={clsx('action-list-item', className)}
          {...others}
          ref={useMergedRef(itemRef, ref)}
          role="menuitem"
          disabled={disabled}
          data-menu-item
          data-disabled={disabled || undefined}
          data-color={color}
        >
          {leftSection && <div data-position="left">{leftSection}</div>}
          {children && <div>{children}</div>}
          {rightSection && <div data-position="right">{rightSection}</div>}
        </UnstyledButton>
      );
    }
  )
);

ActionListItem.displayName = 'ActionList.Item';
