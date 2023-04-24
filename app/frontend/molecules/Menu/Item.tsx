import React, { ElementType, forwardRef } from 'react';
import clsx from 'clsx';

import Icon from '@/atoms/Icon';

import { MenuItemComponent } from './Menu.types';

export const MenuItem: MenuItemComponent = forwardRef(
  ({ as, className, icon, label, right, disabled, selected, children, ...props }, ref) => {
    const Component = (as || 'button') as ElementType;

    return (
      <Component
        ref={ref}
        className={clsx('menu__item', className)}
        disabled={disabled || undefined}
        aria-selected={selected}
        {...props}
      >
        {icon && <Icon className="menu__item__icon" name={icon} />}
        <span className="menu__item__label">{label}</span>
        {right && <span className="menu__item__right">{right}</span>}
      </Component>
    );
  }
);

MenuItem.displayName = 'Menu.Item';

export default MenuItem;
