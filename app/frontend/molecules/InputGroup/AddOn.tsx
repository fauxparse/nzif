import React, { ElementType, forwardRef } from 'react';
import clsx from 'clsx';

import { AddOnComponent } from './InputGroup.types';

export const AddOn: AddOnComponent = forwardRef(({ as, className, children, ...props }, ref) => {
  const Component = (as || 'div') as ElementType;

  return (
    <Component ref={ref} className={clsx('input-group__add-on', className)} {...props}>
      {children}
    </Component>
  );
});

AddOn.displayName = 'InputGroup.AddOn';

export default AddOn;
