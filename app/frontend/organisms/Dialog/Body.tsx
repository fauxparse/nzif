import clsx from 'clsx';
import React, { ComponentPropsWithoutRef } from 'react';

const Body: React.FC<ComponentPropsWithoutRef<'div'>> = ({ className, children, ...props }) => {
  return (
    <div className={clsx('dialog__body', className)} {...props}>
      {children}
    </div>
  );
};

export default Body;
