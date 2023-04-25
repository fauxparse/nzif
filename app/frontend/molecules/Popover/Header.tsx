import React, { ComponentPropsWithoutRef } from 'react';
import clsx from 'clsx';

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
