import React from 'react';
import {
  Box,
  BoxProps,
  CompoundStylesApiProps,
  ElementProps,
  factory,
  Factory,
  useProps,
} from '@mantine/core';
import { useTabsContext } from './Tabs.context';
import clsx from 'clsx';

export interface TabsPanelProps
  extends BoxProps,
    CompoundStylesApiProps<TabsPanelFactory>,
    ElementProps<'div'> {
  /** Panel content */
  children: React.ReactNode;

  /** If set to `true`, the content will be kept mounted, even if `keepMounted` is set `false` in the parent `Tabs` component */
  keepMounted?: boolean;

  /** Value of associated control */
  value: string;
}

export type TabsPanelFactory = Factory<{
  props: TabsPanelProps;
  ref: HTMLDivElement;
  compound: true;
}>;

const defaultProps: Partial<TabsPanelProps> = {};

export const TabsPanel = factory<TabsPanelFactory>((_props, ref) => {
  const props = useProps('TabsPanel', defaultProps, _props);
  const { children, className, value, classNames, styles, style, mod, ...others } = props;

  const ctx = useTabsContext();

  const active = ctx.value === value;
  const content = ctx.keepMounted || props.keepMounted ? children : active ? children : null;

  return (
    <Box
      {...others}
      className={clsx('tabs__panel', className)}
      ref={ref}
      mod={[{ orientation: ctx.orientation }, mod]}
      role="tabpanel"
      id={ctx.getPanelId(value)}
      aria-labelledby={ctx.getTabId(value)}
    >
      {content}
    </Box>
  );
});

TabsPanel.displayName = '@mantine/core/TabsPanel';
