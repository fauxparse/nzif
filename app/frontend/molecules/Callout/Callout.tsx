import clsx from 'clsx';
import React, { ElementType, forwardRef } from 'react';

import { CalloutComponent } from './Callout.types';

import './Callout.css';

export const Callout: CalloutComponent = forwardRef(({ as, className, ...props }, ref) => {
  const Component = (as || 'div') as ElementType;

  return <Component ref={ref} className={clsx('callout', className)} {...props} />;
});

Callout.displayName = 'Callout';

export default Callout;
