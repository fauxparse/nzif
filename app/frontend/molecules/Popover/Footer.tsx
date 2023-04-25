import React, { ComponentPropsWithoutRef } from 'react';
import clsx from 'clsx';

const Footer: React.FC<ComponentPropsWithoutRef<'footer'>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <footer className={clsx('popover__footer', className)} {...props}>
      {children}
    </footer>
  );
};

export default Footer;
