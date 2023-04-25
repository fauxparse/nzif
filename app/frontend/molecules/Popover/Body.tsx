import React, { ComponentPropsWithoutRef } from 'react';
import clsx from 'clsx';

import Scrollable from '@/helpers/Scrollable';

const Body: React.FC<ComponentPropsWithoutRef<'div'>> = ({ className, children, ...props }) => {
  return (
    <Scrollable className={clsx('popover__body', className)} {...props}>
      {children}
    </Scrollable>
  );
};

export default Body;
