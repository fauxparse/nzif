import clsx from 'clsx';
import React, { ComponentPropsWithoutRef } from 'react';

export const Title: React.FC<ComponentPropsWithoutRef<'h4'>> = ({
  className,
  children,
  ...props
}) => (
  <h4 className={clsx('card__title', className)} {...props}>
    {children}
  </h4>
);

export default Title;
