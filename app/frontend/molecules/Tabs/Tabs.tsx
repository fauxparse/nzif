import clsx from 'clsx';
import { LayoutGroup } from 'framer-motion';
import React, { ElementType, forwardRef, useId } from 'react';

import Tab from './Tab';
import { TabsComponent } from './Tabs.types';

import './Tabs.css';

const TabsContainer: TabsComponent = forwardRef(({ as, className, children, ...props }, ref) => {
  const Component = (as || 'div') as ElementType;

  const layoutGroupId = useId();

  return (
    <LayoutGroup id={layoutGroupId}>
      <Component ref={ref} className={clsx('tabs', className)} role="tablist" {...props}>
        {children}
      </Component>
    </LayoutGroup>
  );
});

TabsContainer.displayName = 'Tabs';

const Tabs = Object.assign(TabsContainer, { Tab });

export default Tabs;
