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
    x: placement === 'right' ? 160 : placement === 'left' ? -160 : 0,
    y: placement === 'bottom' ? 160 : placement === 'top' ? -160 : 0,
    scale: 1,
  }),
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
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
  children,
  ...props
}) => {
  const arrowRef = useRef<SVGSVGElement>(null);

  const { x, y, refs, strategy, context, placement } = useFloating({
    placement: 'right',
    open,
    onOpenChange,
    middleware: [
      offset(24),
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

  return (
    <PopoverContext.Provider value={{ open, setOpen: onOpenChange }}>
      <AnimatePresence>
        {open && (
          <FloatingFocusManager context={context} modal={false} closeOnFocusOut={false}>
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
              custom={placement}
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
