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
import { motion } from 'framer-motion';

export interface TabsListProps
  extends BoxProps,
    CompoundStylesApiProps<TabsListFactory>,
    ElementProps<'div'> {
  /** `Tabs.Tab` components */
  children: React.ReactNode;

  /** Determines whether tabs should take all available space, `false` by default */
  grow?: boolean;

  /** Tabs alignment, `flex-start` by default */
  justify?: React.CSSProperties['justifyContent'];
}

export type TabsListFactory = Factory<{
  props: TabsListProps;
  ref: HTMLDivElement;
  compound: true;
}>;

const defaultProps: Partial<TabsListProps> = {};

export const TabsList = factory<TabsListFactory>((_props, ref) => {
  const props = useProps('TabsList', defaultProps, _props);
  const { children, className, grow, justify, classNames, styles, style, mod, ...others } = props;

  const ctx = useTabsContext();

  return (
    <Box
      {...others}
      className={clsx('tabs__list', className)}
      ref={ref}
      role="tablist"
      variant={ctx.variant}
      mod={[
        {
          grow,
          orientation: ctx.orientation,
          placement: ctx.orientation === 'vertical' && ctx.placement,
          inverted: ctx.inverted,
        },
        mod,
      ]}
      aria-orientation={ctx.orientation}
    >
      {children}
      <motion.hr layout className="tabs__highlight" />
    </Box>
  );
});

TabsList.displayName = '@mantine/core/TabsList';
