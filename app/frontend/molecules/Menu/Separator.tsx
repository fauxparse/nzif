import React, { ComponentPropsWithoutRef, forwardRef } from 'react';
import clsx from 'clsx';

const Separator = forwardRef<HTMLHRElement, ComponentPropsWithoutRef<'hr'>>(
  ({ className, ...props }, ref) => (
    <hr ref={ref} className={clsx('menu__separator', className)} {...props} />
  )
);

Separator.displayName = 'Menu.Separator';

export default Separator;
