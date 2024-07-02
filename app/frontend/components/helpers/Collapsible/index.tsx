import { Box, BoxProps } from '@radix-ui/themes';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import { PropsWithChildren } from 'react';

type CollapsibleProps = PropsWithChildren<
  BoxProps & {
    open: boolean;
    variants?: Variants;
  }
>;

const DEFAULT_VARIANTS: Variants = {
  in: { opacity: 1, height: 'auto' },
  out: { opacity: 0, height: 0 },
} as const;

export const Collapsible: React.FC<CollapsibleProps> = ({
  open,
  variants = DEFAULT_VARIANTS,
  children,
  ...props
}) => (
  <AnimatePresence initial={false}>
    {open && (
      <Box asChild {...props}>
        <motion.div
          variants={variants}
          initial="out"
          animate="in"
          exit="out"
          style={{ overflow: 'clip' }}
        >
          {children}
        </motion.div>
      </Box>
    )}
  </AnimatePresence>
);
