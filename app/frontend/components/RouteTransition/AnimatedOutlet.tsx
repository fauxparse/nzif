import { getRouterContext, Outlet } from '@tanstack/react-router';
import { useIsPresent, motion, MotionProps, Variants } from 'framer-motion';
import { cloneDeep } from 'lodash-es';
import { forwardRef, useContext, useRef } from 'react';
import { Direction } from './types';

type AnimatedOutletProps = MotionProps & {
  direction?: Direction;
};

const OFFSET: Record<Direction, 1 | -1> = {
  left: 1,
  right: -1,
  up: 1,
  down: -1,
};

const AXIS: Record<Direction, 'x' | 'y'> = {
  left: 'x',
  right: 'x',
  up: 'y',
  down: 'y',
};

export const RouteTransitionVariants: Variants = {
  initial: (direction: Direction = 'left') => ({
    [AXIS[direction]]: `${OFFSET[direction] * 100}vw`,
    opacity: 0,
  }),
  animate: (direction: Direction = 'left') => ({
    [AXIS[direction]]: 0,
    opacity: 1,
  }),
  exit: (direction: Direction = 'left') => ({
    [AXIS[direction]]: `${OFFSET[direction] * -100}vw`,
    opacity: 0,
  }),
};

export const TransitionProps = {
  variants: RouteTransitionVariants,
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
  transition: {
    type: 'spring',
    bounce: 0.2,
  },
  style: {
    display: 'grid',
    alignSelf: 'stretch',
    justifySelf: 'stretch',
  },
} as const;

const AnimatedOutlet = forwardRef<HTMLDivElement, AnimatedOutletProps>(
  ({ direction, ...props }, ref) => {
    const RouterContext = getRouterContext();

    const routerContext = useContext(RouterContext);

    const renderedContext = useRef(routerContext);

    const isPresent = useIsPresent();

    if (isPresent) {
      renderedContext.current = cloneDeep(routerContext);
    }

    return (
      <motion.div ref={ref} custom={direction} {...TransitionProps} {...props}>
        <RouterContext.Provider value={renderedContext.current}>
          <Outlet />
        </RouterContext.Provider>
      </motion.div>
    );
  }
);

export default AnimatedOutlet;
