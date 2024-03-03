import React from 'react';
import {
  CompoundStylesApiProps,
  createScopedKeydownHandler,
  ElementProps,
  factory,
  Factory,
  getThemeColor,
  MantineColor,
  useDirection,
  useMantineTheme,
  useProps,
  UnstyledButton,
  UnstyledButtonProps,
} from '@mantine/core';
import { useTabsContext } from './Tabs.context';
import clsx from 'clsx';

export interface TabsTabProps
  extends Omit<UnstyledButtonProps, 'classNames' | 'styles' | 'vars'>,
    ElementProps<'button'> {
  /** Value of associated panel */
  value: string;

  /** Tab label */
  children?: React.ReactNode;

  /** Content displayed on the right side of the label, for example, icon */
  rightSection?: React.ReactNode;

  /** Content displayed on the left side of the label, for example, icon */
  leftSection?: React.ReactNode;

  /** Key of `theme.colors` or any valid CSS color, controls control color based on `variant` */
  color?: MantineColor;
}

export type TabsTabFactory = Factory<{
  props: TabsTabProps;
  ref: HTMLButtonElement;
  compound: true;
}>;

const defaultProps: Partial<TabsTabProps> = {};

export const TabsTab = factory<TabsTabFactory>((_props, ref) => {
  const props = useProps('TabsTab', defaultProps, _props);
  const {
    className,
    children,
    rightSection,
    leftSection,
    value,
    onClick,
    onKeyDown,
    disabled,
    color,
    style,
    mod,
    ...others
  } = props;

  const { dir } = useDirection();
  const ctx = useTabsContext();
  const active = value === ctx.value;
  const activateTab = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    ctx.onChange(ctx.allowTabDeactivation ? (value === ctx.value ? null : value) : value);
    onClick?.(event);
  };

  return (
    <UnstyledButton
      {...others}
      className={clsx('tabs__tab', className)}
      disabled={disabled}
      unstyled={ctx.unstyled}
      variant={ctx.variant}
      mod={[
        {
          active,
          disabled,
          orientation: ctx.orientation,
          inverted: ctx.inverted,
          placement: ctx.orientation === 'vertical' && ctx.placement,
        },
        mod,
      ]}
      ref={ref}
      role="tab"
      id={ctx.getTabId(value)}
      aria-selected={active}
      tabIndex={active || ctx.value === null ? 0 : -1}
      aria-controls={ctx.getPanelId(value)}
      onClick={activateTab}
      onKeyDown={createScopedKeydownHandler({
        siblingSelector: '[role="tab"]',
        parentSelector: '[role="tablist"]',
        activateOnFocus: ctx.activateTabWithKeyboard,
        loop: ctx.loop,
        orientation: ctx.orientation || 'horizontal',
        dir,
        onKeyDown,
      })}
    >
      {leftSection && <span data-position="left">{leftSection}</span>}
      {children && <span>{children}</span>}
      {rightSection && <span data-position="right">{rightSection}</span>}
    </UnstyledButton>
  );
});

TabsTab.displayName = '@mantine/core/TabsTab';
