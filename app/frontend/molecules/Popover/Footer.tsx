import clsx from 'clsx';
import React, { ComponentPropsWithoutRef } from 'react';

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
