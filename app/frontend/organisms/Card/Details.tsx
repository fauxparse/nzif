import React, { ComponentPropsWithoutRef } from 'react';
import clsx from 'clsx';

export const Details: React.FC<ComponentPropsWithoutRef<'div'>> = ({
  className,
  children,
  ...props
}) => (
  <div className={clsx('card__details', className)} {...props}>
    {children}
  </div>
);

export default Details;
