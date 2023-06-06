import { forwardRef, useEffect, useState } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { motion, Variants } from 'framer-motion';

import DialogContext from './Context';
import { DialogProps } from './Dialog.types';

import './Dialog.css';

type DialogState = 'closed' | 'opening' | 'open' | 'closing';

export const overlayVariants: Variants = {
  closed: {
    opacity: 0,
  },
  closing: {
    opacity: 0,
  },
  opening: {
    opacity: 0.5,
  },
  open: {
    opacity: 0.5,
  },
};

const dialogVariants = {
  closed: {
    opacity: 0,
    scale: 0.9,
  },
  opening: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' },
  },
  open: {
    opacity: 1,
    scale: 1,
  },
  closing: {
    opacity: 0,
    y: 128,
  },
};

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ className, open, modal = true, onOpenChange, onRequestClose, children, ...props }, ref) => {
    const [state, setState] = useState<DialogState>('closed');

    useEffect(() => {
      setState((current) =>
        (open && current === 'closed') || current === 'closing'
          ? 'opening'
          : (!open && current === 'open') || current === 'opening'
          ? 'closing'
          : current
      );
    }, [open]);

    const handleOpenChange = async (open: boolean) => {
      if (open) {
        onOpenChange(true);
      } else {
        if (onRequestClose) {
          const shouldClose = await onRequestClose();
          if (!shouldClose) return;
        }
        setState('closing');
      }
    };

    const handleAnimationComplete = (state: DialogState) => {
      if (state === 'opening') {
        setState('open');
      } else if (state === 'closing') {
        setState('closed');
        onOpenChange(false);
      }
    };

    if (state === 'closed') return null;

    return (
      <DialogContext.Provider value={{ open, setOpen: handleOpenChange }}>
        <RadixDialog.Root open modal={modal} onOpenChange={handleOpenChange}>
          <RadixDialog.Portal>
            <RadixDialog.Overlay asChild>
              <motion.div
                key="overlay"
                className="dialog__overlay"
                variants={overlayVariants}
                initial="closed"
                animate={state}
              />
            </RadixDialog.Overlay>
            <motion.div
              key="dialog"
              className={clsx('dialog', className)}
              variants={dialogVariants}
              initial="closed"
              animate={state}
              onAnimationComplete={handleAnimationComplete}
            >
              <RadixDialog.Content asChild>
                <motion.div className="dialog__content" {...props} ref={ref}>
                  {children}
                </motion.div>
              </RadixDialog.Content>
            </motion.div>
          </RadixDialog.Portal>
        </RadixDialog.Root>
      </DialogContext.Provider>
    );
  }
);

Dialog.displayName = 'Dialog';

export default Dialog;
