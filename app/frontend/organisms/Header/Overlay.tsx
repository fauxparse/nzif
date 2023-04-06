import React from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';

import Authentication from '../Authentication';
import { User } from '../Authentication/AuthenticationMachine';
import { useAuthentication } from '../Authentication/AuthenticationProvider';

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
  user: User | null;
  onToggle: () => void;
};

const Overlay: React.FC<OverlayProps> = ({ open, onToggle }) => {
  const { user, logIn, logOut, signUp, resetPassword } = useAuthentication();

  const close = <T,>(value: T): T => {
    onToggle();
    return value;
  };

  const onLogIn = (variables) => logIn(variables).then(close);

  const onSignUp = (variables) => signUp(variables).then(close);

  const onLogOut = () => logOut().then(close);

  const onResetPassword = (variables) => resetPassword(variables);

  return (
    <motion.div
      className="header__overlay"
      variants={overlay}
      initial={false}
      animate={open ? 'open' : 'closed'}
      aria-expanded={open || undefined}
    >
      <AnimatePresence mode="sync">
        {open && (
          <Authentication
            key="authentication"
            user={user}
            onLogIn={onLogIn}
            onLogOut={onLogOut}
            onSignUp={onSignUp}
            onResetPassword={onResetPassword}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Overlay;
