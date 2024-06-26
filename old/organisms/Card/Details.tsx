import clsx from 'clsx';
import React, { ComponentPropsWithoutRef } from 'react';

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
