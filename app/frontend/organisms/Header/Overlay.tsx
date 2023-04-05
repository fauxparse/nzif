import React from 'react';
import { useApolloClient } from '@apollo/client';
import { AnimatePresence, motion, Variants } from 'framer-motion';

import { saveAuthenticationInfo } from '../../graphql/authentication';
import {
  useLogInMutation,
  useLogOutMutation,
  useResetPasswordMutation,
  useSignUpMutation,
} from '../../graphql/types';
import Authentication from '../Authentication';
import { User } from '../Authentication/AuthenticationMachine';

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

const Overlay: React.FC<OverlayProps> = ({ user, open, onToggle }) => {
  const client = useApolloClient();

  const [logIn] = useLogInMutation({
    update: (_, { data }) => {
      const { credentials } = data?.userLogin || {};
      if (credentials) {
        saveAuthenticationInfo(credentials);
      }
    },
    refetchQueries: ['CurrentUser'],
  });

  const [logOut] = useLogOutMutation();

  const [signUp] = useSignUpMutation({
    update: (_, { data }) => {
      const { credentials } = data?.userRegister || {};
      if (credentials) {
        saveAuthenticationInfo(credentials);
      }
    },
    refetchQueries: ['CurrentUser'],
  });

  const [resetPassword] = useResetPasswordMutation();

  const onLogIn = (variables) =>
    logIn({ variables }).then(
      ({ data }) =>
        new Promise<{ user: User }>((resolve, reject) => {
          const { user, credentials } = data?.userLogin || {};
          if (user && credentials) {
            resolve({ user });
            onToggle();
          } else {
            reject();
          }
        })
    );

  const onSignUp = (variables) =>
    signUp({ variables }).then(
      ({ data }) =>
        new Promise<{ user: User }>((resolve, reject) => {
          const { user, credentials } = data?.userRegister || {};
          if (user && credentials) {
            resolve({ user });
            onToggle();
          } else {
            reject();
          }
        })
    );

  const onLogOut = () =>
    logOut().then(() => {
      onToggle();
      client.resetStore();
      return true;
    });

  const onResetPassword = (variables) => resetPassword({ variables }).then(() => true);

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
