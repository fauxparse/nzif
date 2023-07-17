import React, { useEffect } from 'react';
import { AnimatePresence, motion, useWillChange, Variants } from 'framer-motion';

import Authentication from '../Authentication';
import { User } from '../Authentication/AuthenticationMachine';
import { useAuthentication } from '../Authentication/AuthenticationProvider';
import Button from '@/atoms/Button';
import {
  LogInMutationVariables,
  ResetPasswordMutationVariables,
  SignUpMutationVariables,
} from '@/graphql/types';

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

const button: Variants = {
  open: {
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.3,
    },
  },
  closed: {
    scale: 0,
    opacity: 0,
  },
};

type OverlayProps = {
  open: boolean;
  user: User | null;
  onToggle: () => void;
};

const Overlay: React.FC<OverlayProps> = ({ open, onToggle }) => {
  const { user, logIn, logOut, signUp, resetPassword } = useAuthentication();

  const willChange = useWillChange();

  const close = <T,>(value: T): T => {
    onToggle();
    return value;
  };

  const onLogIn = (variables: LogInMutationVariables) => logIn(variables).then(close);

  const onSignUp = (variables: SignUpMutationVariables) => signUp(variables).then(close);

  const onLogOut = () => logOut().then(close);

  const onResetPassword = (variables: { email: string }) => resetPassword(variables);

  useEffect(() => {
    const { style } = document.body;
    if (open) {
      style.overflow = 'hidden';
      style.pointerEvents = 'none';
    } else {
      style.removeProperty('overflow');
      style.removeProperty('pointer-events');
    }
  }, [open]);

  return (
    <motion.div
      className="header__overlay"
      variants={overlay}
      initial={false}
      animate={open ? 'open' : 'closed'}
      aria-expanded={open || undefined}
      style={{ willChange }}
    >
      <Button
        ghost
        as={motion.button}
        className="header__close"
        icon="close"
        onClick={onToggle}
        animate={open ? 'open' : 'closed'}
        variants={button}
      />
      <AnimatePresence mode="sync">
        {open && (
          <Authentication
            key="authentication"
            user={user}
            onLogIn={onLogIn}
            onLogOut={onLogOut}
            onSignUp={onSignUp}
            onResetPassword={onResetPassword}
            onClose={onToggle}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Overlay;
