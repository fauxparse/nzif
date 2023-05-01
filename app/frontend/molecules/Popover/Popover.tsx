import React, { useEffect, useRef } from 'react';
import {
  arrow,
  autoUpdate,
  flip,
  FloatingFocusManager,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import clsx from 'clsx';
import { AnimatePresence, motion, Variants } from 'framer-motion';

import PopoverContext from './Context';
import { FloatingArrow } from './FloatingArrow';
import { PopoverProps } from './Popover.types';

import './Popover.css';

const popoverVariants: Variants = {
  initial: (placement) => ({
    opacity: 0,
    x: placement === 'right' ? -80 : placement === 'left' ? 80 : 0,
    y: placement === 'bottom' ? -80 : placement === 'top' ? 80 : 0,
    scale: 1,
  }),
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      bounce: 0.2,
    },
  },
  exit: {
    opacity: 0,
    x: 0,
    y: 0,
    scale: 0.5,
    transition: { ease: [0.4, 0, 0.2, 1], duration: 0.05 },
  },
};

export const Popover: React.FC<PopoverProps> = ({
  className,
  reference,
  open,
  onOpenChange,
  style = {},
  offset: initialOffset = 8,
  placement: initialPlacement = 'right',
  initialFocus = 0,
  children,
  ...props
}) => {
  const arrowRef = useRef<SVGSVGElement>(null);

  const { x, y, refs, strategy, context, placement } = useFloating({
    placement: initialPlacement,
    open,
    onOpenChange,
    middleware: [
      offset(initialOffset),
      flip({ fallbackAxisSideDirection: 'end' }),
      shift({ crossAxis: true }),
      arrow({
        element: arrowRef,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getFloatingProps } = useInteractions([role, dismiss]);

  useEffect(() => {
    refs.setReference(reference);
  }, [refs, reference]);

  // useEffect(() => {
  //   if (open) {
  //     document.getElementById('root')?.setAttribute('inert', 'true');
  //     return () => document.getElementById('root')?.removeAttribute('inert');
  //   } else {
  //     document.getElementById('root')?.removeAttribute('inert');
  //   }
  // }, [open]);

  return (
    <PopoverContext.Provider value={{ open, setOpen: onOpenChange }}>
      <AnimatePresence>
        {open && (
          <FloatingFocusManager
            context={context}
            modal={false}
            closeOnFocusOut={false}
            initialFocus={initialFocus}
          >
            <motion.div
              className={clsx('popover', className)}
              ref={refs.setFloating}
              style={{
                ...style,
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
              }}
              {...getFloatingProps(props)}
              variants={popoverVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              custom={placement.split('-')[0]}
            >
              {children}
              <FloatingArrow ref={arrowRef} context={context} stroke="var(--popover-border)" />
            </motion.div>
          </FloatingFocusManager>
        )}
      </AnimatePresence>
    </PopoverContext.Provider>
  );
};

Popover.displayName = 'Popover';

export default Popover;
