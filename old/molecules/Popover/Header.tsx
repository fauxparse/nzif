import clsx from 'clsx';
import React, { ComponentPropsWithoutRef } from 'react';

const Header: React.FC<ComponentPropsWithoutRef<'header'>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <header className={clsx('popover__header', className)} {...props}>
      {children}
    </header>
  );
};

export default Header;
