import clsx from 'clsx';
import React from 'react';

import Button, { ButtonProps } from '@/atoms/Button';

import { usePopoverContext } from './Context';

const Close: React.FC<ButtonProps> = ({ className, children }) => {
  const { setOpen } = usePopoverContext();

  return (
    <Button
      ghost
      icon="close"
      aria-label="Close"
      className={clsx('popover__close', className)}
      onClick={() => setOpen(false)}
    >
      {children}
    </Button>
  );
};

export default Close;
