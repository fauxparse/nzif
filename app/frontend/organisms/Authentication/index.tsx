import React, { forwardRef, useEffect } from 'react';
import { useInterpret, useSelector } from '@xstate/react';
import { AnimatePresence, motion, usePresence } from 'framer-motion';

import AuthenticationMachine, { AuthenticationContext } from './AuthenticationMachine';
import Forgot from './Forgot';
import Login from './Login';
import Signup from './Signup';

import './Authentication.css';

const Authentication = forwardRef<HTMLDivElement>((_, ref) => {
  const machine = useInterpret(AuthenticationMachine);

  const state = useSelector(machine, (state) => state);

  const [isPresent, safeToRemove] = usePresence();

  useEffect(() => {
    if (!isPresent) {
      setTimeout(() => safeToRemove(), 1000);
    }
  }, [isPresent, safeToRemove]);

  return (
    <AuthenticationContext.Provider value={{ machine }}>
      <motion.div ref={ref} className="authentication">
        <AnimatePresence mode="wait">
          {isPresent && state.matches('logIn') && <Login key="logIn" />}
          {isPresent && state.matches('signUp') && <Signup key="signUp" />}
          {isPresent && state.matches('forgotPassword') && <Forgot key="forgot" />}
        </AnimatePresence>
      </motion.div>
    </AuthenticationContext.Provider>
  );
});

Authentication.displayName = 'Authentication';

export default Authentication;
