import React, { forwardRef, useEffect } from 'react';
import { useInterpret, useSelector } from '@xstate/react';
import { AnimatePresence, motion, usePresence } from 'framer-motion';

import AuthenticationMachine, {
  AuthenticationMachineContext,
  Context,
  LogInAction,
  ResetPasswordAction,
  SignUpAction,
  User,
} from './AuthenticationMachine';
import { useAuthentication } from './AuthenticationProvider';
import Forgot from './Forgot';
import LoggedIn from './LoggedIn';
import Login from './Login';
import Signup from './Signup';

import './Authentication.css';

type AuthenticationProps = {
  user: User | null;
  onLogIn: (attrs: { email: string; password: string }) => Promise<{ user: User }>;
  onSignUp: (attrs: { name: string; email: string; password: string }) => Promise<{ user: User }>;
  onLogOut: () => Promise<boolean>;
  onResetPassword: (attrs: { email: string }) => Promise<boolean>;
};

const Authentication = forwardRef<HTMLDivElement, AuthenticationProps>(
  ({ user, onLogIn, onSignUp, onLogOut, onResetPassword }, ref) => {
    const logIn = (_context: Context, action: LogInAction) => onLogIn(action);
    const signUp = (_context: Context, action: SignUpAction) => onSignUp(action);
    const logOut = () => onLogOut();
    const resetPassword = (_context: Context, action: ResetPasswordAction) =>
      onResetPassword(action);

    const machine = useInterpret(AuthenticationMachine, {
      context: {
        user: user,
      },
      services: { logIn, signUp, logOut, resetPassword },
    });

    const state = useSelector(machine, (state) => state);

    const [isPresent, safeToRemove] = usePresence();

    useEffect(() => {
      if (!isPresent) {
        setTimeout(() => safeToRemove(), 1000);
      }
    }, [isPresent, safeToRemove]);

    return (
      <AuthenticationMachineContext.Provider value={{ machine }}>
        <motion.div ref={ref} className="authentication">
          <AnimatePresence mode="wait">
            {isPresent && state.matches('logIn') && <Login key="logIn" />}
            {isPresent && state.matches('signUp') && <Signup key="signUp" />}
            {isPresent && state.matches('forgotPassword') && <Forgot key="forgot" />}
            {isPresent && state.matches('loggedIn') && <LoggedIn />}
          </AnimatePresence>
        </motion.div>
      </AuthenticationMachineContext.Provider>
    );
  }
);

Authentication.displayName = 'Authentication';

export default Authentication;

export { useAuthentication };
