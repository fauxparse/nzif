import React from 'react';
import { useId, useUncontrolled } from '@mantine/hooks';
import {
  Box,
  BoxProps,
  ElementProps,
  factory,
  Factory,
  getSafeId,
  MantineColor,
  StylesApiProps,
  useProps,
} from '@mantine/core';
import { TabsProvider } from './Tabs.context';
import { TabsList } from './List';
import { TabsPanel } from './Panel';
import { TabsTab } from './Tab';
import { TabsVariant } from './types';

import './Tabs.css';
import clsx from 'clsx';

export interface TabsProps
  extends BoxProps,
    StylesApiProps<TabsFactory>,
    ElementProps<'div', 'defaultValue' | 'value' | 'onChange'> {
  /** Default value for uncontrolled component */
  defaultValue?: string | null;

  /** Value for controlled component */
  value?: string | null;

  /** Called when value changes */
  onChange?: (value: string | null) => void;

  /** Tabs orientation, `'horizontal'` by default */
  orientation?: 'vertical' | 'horizontal';

  /** `Tabs.List` placement relative to `Tabs.Panel`, applicable only when `orientation="vertical"`, `'left'` by default */
  placement?: 'left' | 'right';

  /** Base id, used to generate ids to connect labels with controls, generated randomly by default */
  id?: string;

  /** Determines whether arrow key presses should loop though items (first to last and last to first), `true` by default */
  loop?: boolean;

  /** Determines whether tab should be activated with arrow key press, `true` by default */
  activateTabWithKeyboard?: boolean;

  /** Determines whether tab can be deactivated, `false` by default */
  allowTabDeactivation?: boolean;

  /** Tabs content */
  children: React.ReactNode;

  /** Changes colors of `Tabs.Tab` components when variant is `pills` or `default`, does nothing for other variants */
  color?: MantineColor;

  /** Determines whether tabs should have inverted styles, `false` by default */
  inverted?: boolean;

  /** If set to `false`, `Tabs.Panel` content will be unmounted when the associated tab is not active, `true` by default */
  keepMounted?: boolean;

  /** Determines whether active item text color should depend on `background-color` of the indicator. If luminosity of the `color` prop is less than `theme.luminosityThreshold`, then `theme.white` will be used for text color, otherwise `theme.black`. Overrides `theme.autoContrast`. Only applicable when `variant="pills"` */
  autoContrast?: boolean;
}

export type TabsFactory = Factory<{
  props: TabsProps;
  ref: HTMLDivElement;
  variant: TabsVariant;
  staticComponents: {
    Tab: typeof TabsTab;
    Panel: typeof TabsPanel;
    List: typeof TabsList;
  };
}>;

const VALUE_ERROR =
  'Tabs.Tab or Tabs.Panel component was rendered with invalid value or without value';

const defaultProps: Partial<TabsProps> = {
  keepMounted: true,
  orientation: 'horizontal',
  loop: true,
  activateTabWithKeyboard: true,
  allowTabDeactivation: false,
  unstyled: false,
  inverted: false,
  variant: 'default',
  placement: 'left',
};

export const Tabs = factory<TabsFactory>((_props, ref) => {
  const props = useProps('Tabs', defaultProps, _props);
  const {
    defaultValue,
    value,
    onChange,
    orientation,
    children,
    loop,
    id,
    activateTabWithKeyboard,
    allowTabDeactivation,
    variant,
    color,
    inverted,
    placement,
    keepMounted,
    classNames,
    styles,
    unstyled,
    className,
    style,
    vars,
    autoContrast,
    mod,
    ...others
  } = props;

  const uid = useId(id);

  const [currentTab, setCurrentTab] = useUncontrolled({
    value,
    defaultValue,
    finalValue: null,
    onChange,
  });

  return (
    <TabsProvider
      value={{
        placement,
        value: currentTab,
        orientation,
        id: uid,
        loop,
        activateTabWithKeyboard,
        getTabId: getSafeId(`${uid}-tab`, VALUE_ERROR),
        getPanelId: getSafeId(`${uid}-panel`, VALUE_ERROR),
        onChange: setCurrentTab,
        allowTabDeactivation,
        variant,
        color,
        inverted,
        keepMounted,
        unstyled,
      }}
    >
      <Box
        className={clsx('tabs__root', className)}
        ref={ref}
        id={uid}
        variant={variant}
        mod={[
          {
            orientation,
            inverted: orientation === 'horizontal' && inverted,
            placement: orientation === 'vertical' && placement,
          },
          mod,
        ]}
        {...others}
      >
        {children}
      </Box>
    </TabsProvider>
  );
});

Tabs.displayName = '@mantine/core/Tabs';
Tabs.Tab = TabsTab;
Tabs.Panel = TabsPanel;
Tabs.List = TabsList;

export default Tabs;
