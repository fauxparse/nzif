import clsx from 'clsx';
import { MotionProps, motion } from 'framer-motion';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { Direction } from '../../helpers/RouteTransition/types';
import {
  RouteTransitionVariants,
  TransitionProps,
} from '../../helpers/RouteTransition/AnimatedOutlet';

import './Body.css';

type BodyProps = ComponentPropsWithoutRef<'div'> &
  MotionProps & {
    direction?: Direction;
  };

const Body = forwardRef<HTMLDivElement, BodyProps>(
  ({ direction = 'left', className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={clsx('body', className)}
        {...TransitionProps}
        custom={direction}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

export default Body;
