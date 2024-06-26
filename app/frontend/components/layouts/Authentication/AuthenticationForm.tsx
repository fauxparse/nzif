import { Variants, motion } from 'framer-motion';
import { PropsWithChildren, forwardRef } from 'react';

type AuthenticationFormProps = PropsWithChildren;

const variants: Variants = {
  out: {},
  in: {},
} as const;

export const AuthenticationForm = forwardRef<HTMLDivElement, AuthenticationFormProps>(
  ({ children }, ref) => {
    return (
      <motion.div ref={ref} className="authentication__form" variants={variants}>
        {children}
      </motion.div>
    );
  }
);
