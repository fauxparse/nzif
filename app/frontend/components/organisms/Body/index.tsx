import clsx from 'clsx';
import { MotionProps, motion } from 'framer-motion';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { TransitionProps } from '../../helpers/RouteTransition/AnimatedOutlet';
import { Direction } from '../../helpers/RouteTransition/types';

import classes from './Body.module.css';

type BodyProps = ComponentPropsWithoutRef<'div'> &
  MotionProps & {
    direction?: Direction;
  };

const Body = forwardRef<HTMLDivElement, BodyProps>(
  ({ direction = 'left', className, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={clsx(classes.body, className)}
      {...TransitionProps}
      custom={direction}
      {...props}
    >
      {children}
    </motion.div>
  )
);

export default Body;
