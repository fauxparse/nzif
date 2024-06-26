import { Variants } from 'framer-motion';

export const formPage: Variants = {
  out: {
    opacity: 0,
    transition: {
      duration: 0.1,
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: 'afterChildren',
    },
  },
  in: {
    opacity: 1,
    transition: {
      duration: 0.1,
      staggerChildren: 0.1,
      when: 'beforeChildren',
    },
  },
};

export const formItem: Variants = {
  out: {
    opacity: 0,
    y: '25vh',
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      bounce: 0.2,
    },
  },
};
