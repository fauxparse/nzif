import * as RadixDialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import React, { ComponentPropsWithoutRef } from 'react';

const Title: React.FC<ComponentPropsWithoutRef<'h3'>> = ({ className, children, ...props }) => (
  <RadixDialog.Title asChild>
    <h3 className={clsx('dialog__title', className)} {...props}>
      {children}
    </h3>
  </RadixDialog.Title>
);

export default Title;
