import React from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';

import Authentication from '../Authentication';

import './Header.css';

const overlay: Variants = {
  open: {
    clipPath: `circle(200vmax at var(--cx) var(--cy))`,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 20,
      restDelta: 2,
    },
  },
  closed: {
    clipPath: 'circle(0rem at var(--cx) var(--cy))',
    opacity: 0,
    transition: {
      delay: 0.5,
      type: 'spring',
      stiffness: 400,
      damping: 40,
      opacity: {
        duration: 0,
        delay: 1,
      },
      when: 'afterChildren',
    },
  },
};

type OverlayProps = {
  open: boolean;
  onToggle: () => void;
};

const Overlay: React.FC<OverlayProps> = ({ open }) => {
  return (
    <motion.div
      className="header__overlay"
      variants={overlay}
      initial={false}
      animate={open ? 'open' : 'closed'}
      aria-expanded={open || undefined}
    >
      <AnimatePresence mode="sync">
        {open && <Authentication key="authentication" />}
      </AnimatePresence>
    </motion.div>
  );
};

export default Overlay;
