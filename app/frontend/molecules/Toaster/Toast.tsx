import React, { forwardRef, useState } from 'react';
import { HTMLMotionProps, motion, Variants } from 'framer-motion';

import Button from '@/atoms/Button';

import { Notification } from './Toaster.types';

type NotificationProps = Notification & {
  index: number;
  onDismiss: (id: string) => void;
};

const DRAG_THRESHOLD = 40;

const toastVariants: Variants = {
  initial: { x: 0, y: 100, opacity: 0, scale: 1 },
  animate: { x: 0, y: 0, opacity: 1, scale: 1, transition: { type: 'spring', bounce: 0.5 } },
  exit: ({ throwing }: { throwing: boolean }) =>
    throwing ? {} : { x: 384, y: 0, opacity: 0, scale: 0.5, transition: { duration: 0.3 } },
};

const Toast = forwardRef<HTMLDivElement, NotificationProps>(
  ({ id, content, options, index, onDismiss }, ref) => {
    const [throwing, setThrowing] = useState(false);

    const [dragAxis, setDragAxis] = useState<'x' | 'y'>('y');

    const dragEnd: HTMLMotionProps<'div'>['onDragEnd'] = (event, { delta, velocity }) => {
      if (options.dismissable && delta[dragAxis] > DRAG_THRESHOLD && velocity[dragAxis] > 0.5) {
        setThrowing(true);
        onDismiss(id);
      }
    };

    return (
      <motion.div
        ref={ref}
        key={id}
        className="toast-wrapper"
        drag
        dragDirectionLock
        dragConstraints={{ top: 0, left: 0 }}
        dragSnapToOrigin={!throwing}
        variants={toastVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        custom={{ throwing }}
        onDragEnd={dragEnd}
        onDirectionLock={setDragAxis}
      >
        <motion.div
          layout="position"
          className="toast"
          transition={{ layout: { type: 'spring', bounce: 0.5, delay: index * 0.025 } }}
        >
          <div className="toast__content">{content}</div>
          {options.dismissable && onDismiss && (
            <Button
              className="toast__dismiss"
              ghost
              icon="close"
              aria-label="Dismiss"
              onClick={() => onDismiss(id)}
            />
          )}
        </motion.div>
      </motion.div>
    );
  }
);

Toast.displayName = 'Toast';

export default Toast;
