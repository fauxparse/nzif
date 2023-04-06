import React, { forwardRef, useContext } from 'react';
import { motion } from 'framer-motion';

import Icon from '../../atoms/Icon';

import { AuthenticationMachineContext } from './AuthenticationMachine';
import Divider from './Divider';
import Input from './Input';
import { formItem, formPage } from './variants';

type LoginForm = HTMLFormElement & {
  email: HTMLInputElement;
  password: HTMLInputElement;
};

const Login = forwardRef<LoginForm>((_, ref) => {
  const { machine } = useContext(AuthenticationMachineContext);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { email: emailInput, password: passwordInput } = event.currentTarget;
    machine.send({ type: 'LOG_IN', email: emailInput.value, password: passwordInput.value });
  };

  return (
    <motion.form
      ref={ref}
      className="login"
      initial="out"
      animate="in"
      exit="out"
      variants={formPage}
      onSubmit={submit}
    >
      <motion.h2 variants={formItem}>Log in</motion.h2>
      <Input
        type="email"
        name="email"
        required
        placeholder="Email address"
        icon={
          <Icon path="M21.5 18L14.8571 12M9.14286 12L2.50003 18M2 7L10.1649 12.7154C10.8261 13.1783 11.1567 13.4097 11.5163 13.4993C11.8339 13.5785 12.1661 13.5785 12.4837 13.4993C12.8433 13.4097 13.1739 13.1783 13.8351 12.7154L22 7M6.8 20H17.2C18.8802 20 19.7202 20 20.362 19.673C20.9265 19.3854 21.3854 18.9265 21.673 18.362C22 17.7202 22 16.8802 22 15.2V8.8C22 7.11984 22 6.27976 21.673 5.63803C21.3854 5.07354 20.9265 4.6146 20.362 4.32698C19.7202 4 18.8802 4 17.2 4H6.8C5.11984 4 4.27976 4 3.63803 4.32698C3.07354 4.6146 2.6146 5.07354 2.32698 5.63803C2 6.27976 2 7.11984 2 8.8V15.2C2 16.8802 2 17.7202 2.32698 18.362C2.6146 18.9265 3.07354 19.3854 3.63803 19.673C4.27976 20 5.11984 20 6.8 20Z" />
        }
      />
      <Input
        type="password"
        name="password"
        placeholder="Password"
        icon={
          <Icon path="M17 8.99994C17 8.48812 16.8047 7.9763 16.4142 7.58579C16.0237 7.19526 15.5118 7 15 7M15 15C18.3137 15 21 12.3137 21 9C21 5.68629 18.3137 3 15 3C11.6863 3 9 5.68629 9 9C9 9.27368 9.01832 9.54308 9.05381 9.80704C9.11218 10.2412 9.14136 10.4583 9.12172 10.5956C9.10125 10.7387 9.0752 10.8157 9.00469 10.9419C8.937 11.063 8.81771 11.1823 8.57913 11.4209L3.46863 16.5314C3.29568 16.7043 3.2092 16.7908 3.14736 16.8917C3.09253 16.9812 3.05213 17.0787 3.02763 17.1808C3 17.2959 3 17.4182 3 17.6627V19.4C3 19.9601 3 20.2401 3.10899 20.454C3.20487 20.6422 3.35785 20.7951 3.54601 20.891C3.75992 21 4.03995 21 4.6 21H7V19H9V17H11L12.5791 15.4209C12.8177 15.1823 12.937 15.063 13.0581 14.9953C13.1843 14.9248 13.2613 14.8987 13.4044 14.8783C13.5417 14.8586 13.7588 14.8878 14.193 14.9462C14.4569 14.9817 14.7263 15 15 15Z" />
        }
      />
      <motion.button type="submit" className="button" data-variant="primary" variants={formItem}>
        <span className="button__text">Log in</span>
      </motion.button>
      <Divider />
      <motion.div className="oauth" variants={formItem}>
        <button className="button" data-variant="secondary">
          <span className="button__text">Google</span>
        </button>
        <button className="button" data-variant="secondary">
          <span className="button__text">Facebook</span>
        </button>
      </motion.div>
      <motion.p variants={formItem}>
        New here? You’ll need to{' '}
        <button type="button" className="inline" onClick={() => machine.send('SIGN_UP_CLICKED')}>
          sign up
        </button>
        .
      </motion.p>
      <motion.p variants={formItem}>
        <button type="button" className="inline" onClick={() => machine.send('FORGOT_CLICKED')}>
          Forgot your password?
        </button>
      </motion.p>
    </motion.form>
  );
});

Login.displayName = 'Login';

export default Login;
