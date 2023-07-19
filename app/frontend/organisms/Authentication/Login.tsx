import React, { forwardRef, useContext, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { AnimationDefinition, motion } from 'framer-motion';

import Button from '@/atoms/Button';

import { AuthenticationMachineContext } from './AuthenticationMachine';
import Input from './InputRow';
import { formItem, formPage } from './variants';

type LoginForm = HTMLFormElement & {
  email: HTMLInputElement;
  password: HTMLInputElement;
};

const Login = forwardRef<LoginForm>((_, ref) => {
  const { machine } = useContext(AuthenticationMachineContext);

  const ownRef = useRef<LoginForm>(null);

  const mergedRefs = mergeRefs([ref, ownRef]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { email: emailInput, password: passwordInput } = event.currentTarget;
    machine.send({ type: 'LOG_IN', email: emailInput.value, password: passwordInput.value });
  };

  const focusEmailInput = (animation: AnimationDefinition) => {
    if (animation === 'in') ownRef.current?.email?.focus();
  };

  return (
    <motion.form
      ref={mergedRefs}
      className="authentication__form login"
      initial="out"
      animate="in"
      exit="out"
      variants={formPage}
      onSubmit={submit}
      onAnimationComplete={focusEmailInput}
    >
      <motion.h2 variants={formItem}>Log in</motion.h2>
      <Input type="email" name="email" required placeholder="Email address" icon="email" />
      <Input type="password" name="password" placeholder="Password" icon="password" />
      <Button as={motion.button} type="submit" primary stretch variants={formItem} text="Log in" />
      <motion.p variants={formItem}>
        New here? You’ll need to{' '}
        <Button inline onClick={() => machine.send('SIGN_UP_CLICKED')} text="sign up" />.
      </motion.p>
      <motion.p variants={formItem}>
        <Button
          inline
          onClick={() => machine.send('FORGOT_CLICKED')}
          text="Forgot your password?"
        />
      </motion.p>
    </motion.form>
  );
});

Login.displayName = 'Login';

export default Login;
