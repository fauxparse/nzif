import { Variants } from 'framer-motion';

export const pageVariants: Variants = {
  from: (direction = -1) => ({
    opacity: 0,
    x: `${direction * -100}vw`,
    transition: { ease: [0.4, 0, 0.2, 1] },
  }),
  in: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', bounce: 0.2 },
  },
  to: (direction = 1) => ({
    opacity: 0,
    x: `${direction * 100}vw`,
    transition: { ease: [0.4, 0, 0.2, 1] },
  }),
};
