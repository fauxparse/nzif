import React, { ComponentPropsWithoutRef } from 'react';
import clsx from 'clsx';

const Separator: React.FC<ComponentPropsWithoutRef<'hr'>> = ({ className, ...props }) => (
  <hr className={clsx('menu__separator', className)} {...props} />
);

export default Separator;
