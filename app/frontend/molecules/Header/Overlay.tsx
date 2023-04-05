import React from 'react';
import './Header.css';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import UserIcon from './UserIcon';

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
    clipPath: 'circle(1.25rem at var(--cx) var(--cy))',
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
    },
  },
};

const form: Variants = {
  open: {
    opacity: 1,
    transition: {
      duration: 0.1,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  closed: {
    opacity: 0,
    transition: {
      duration: 0.1,
      when: 'afterChildren',
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
};

const formItem: Variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      bounce: 0.2,
    },
  },
  closed: {
    y: 200,
    opacity: 0,
    transition: {
      type: 'spring',
      bounce: 0.2,
    },
  },
};

type OverlayProps = {
  open: boolean;
  onToggle: () => void;
};

const Overlay: React.FC<OverlayProps> = ({ open, onToggle }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="header__overlay"
        variants={overlay}
        initial={false}
        animate={open ? 'open' : 'closed'}
        aria-expanded={open || undefined}
      >
        <button className="header__overlay__toggle button" onClick={onToggle}>
          <UserIcon className="button__icon" />
        </button>
        <motion.form className="login" variants={form}>
          <motion.h2 variants={formItem}>Log in</motion.h2>
          <motion.input
            type="email"
            name="email"
            placeholder="Email"
            variants={formItem}
            required
          />
          <motion.input
            type="password"
            name="password"
            placeholder="Password"
            variants={formItem}
            required
          />
          <motion.button className="button" data-variant="primary" variants={formItem}>
            <span className="button__text">Log in</span>
          </motion.button>
          <motion.div className="separator" variants={formItem} />
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
};

export default Overlay;
