import React, { forwardRef, useEffect } from 'react';
import ReactRemoveScroll from 'react-remove-scroll/dist/es5/Combination';
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
import CheckEmail from './CheckEmail';
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
  onClose?: () => void;
};

const Authentication = forwardRef<HTMLDivElement, AuthenticationProps>(
  ({ user, onLogIn, onSignUp, onLogOut, onResetPassword, onClose }, ref) => {
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
        <ReactRemoveScroll enabled={isPresent}>
          <motion.div ref={ref} className="authentication">
            <AnimatePresence mode="wait">
              {isPresent && (state.matches('logIn') || state.matches('loggingIn')) && (
                <Login key="logIn" />
              )}
              {isPresent && (state.matches('signUp') || state.matches('signingUp')) && (
                <Signup key="signUp" />
              )}
              {isPresent && state.matches('forgotPassword') && <Forgot key="forgot" />}
              {isPresent && state.matches('nextSteps') && (
                <CheckEmail key="nextSteps" onClose={onClose} />
              )}
              {isPresent && state.matches('loggedIn') && <LoggedIn />}
            </AnimatePresence>
          </motion.div>
        </ReactRemoveScroll>
      </AuthenticationMachineContext.Provider>
    );
  }
);

Authentication.displayName = 'Authentication';

export default Authentication;

export { useAuthentication };
