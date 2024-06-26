import { MotionProps, Variants, motion } from 'framer-motion';
import { PropsWithChildren, forwardRef } from 'react';

type AuthenticationFormItemProps = PropsWithChildren<
  MotionProps & {
    fade?: boolean;
  }
>;

const layoutOnly: Variants = {
  out: {},
  in: {},
} as const;

const fadeTransition: Variants = {
  out: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
} as const;

export const AuthenticationFormItem = forwardRef<HTMLDivElement, AuthenticationFormItemProps>(
  ({ children, fade, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        layout="position"
        variants={fade ? fadeTransition : layoutOnly}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
