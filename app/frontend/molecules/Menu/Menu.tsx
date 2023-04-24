import React, { ElementType, forwardRef } from 'react';
import clsx from 'clsx';

import { MenuComponent } from './Menu.types';

import './Menu.css';

export const Menu: MenuComponent = forwardRef(({ as, className, ...props }, ref) => {
  const Component = (as || 'div') as ElementType;

  return <Component ref={ref} className={clsx('menu', className)} {...props} />;
});

Menu.displayName = 'Menu';

export default Menu;
