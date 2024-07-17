import CloseIcon from '@/icons/CloseIcon';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { IconButton } from '@radix-ui/themes';
import { Variants } from 'framer-motion';
import { forwardRef, useState } from 'react';
import { ToastHandle } from './types';

import classes from './Toast.module.css';

const variants: Variants = {
  initial: {
    opacity: 0,
    y: '100%',
  },
  animate: {
    y: 0,
    opacity: 1,
  },
  exit: {
    x: '100%',
    opacity: 0,
  },
} as const;

export const Root = forwardRef<HTMLLIElement, ToastHandle>(
  ({ id, title, description, close }, ref) => {
    const [open, setOpen] = useState(true);

    const openChange = (open: boolean) => {
      setOpen(open);
      if (!open) {
        setTimeout(close, 200);
      }
    };

    return (
      <ToastPrimitive.Root ref={ref} className={classes.root} open={open} onOpenChange={openChange}>
        {title && <ToastPrimitive.Title className={classes.title}>{title}</ToastPrimitive.Title>}
        <ToastPrimitive.Description className={classes.description}>
          {description}
        </ToastPrimitive.Description>
        <ToastPrimitive.Close asChild onClick={close}>
          <IconButton size="2" radius="full" variant="ghost" color="gray">
            <CloseIcon />
          </IconButton>
        </ToastPrimitive.Close>
      </ToastPrimitive.Root>
    );
  }
);
