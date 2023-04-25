import React, { forwardRef, useContext, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { AnimationDefinition, motion } from 'framer-motion';

import Button from '@/atoms/Button';

import { AuthenticationMachineContext } from './AuthenticationMachine';
import Input from './InputRow';
import { formItem, formPage } from './variants';

type SignupForm = HTMLFormElement & {
  fullName: HTMLInputElement;
  email: HTMLInputElement;
  password: HTMLInputElement;
};

const Signup = forwardRef<SignupForm>((_, ref) => {
  const { machine } = useContext(AuthenticationMachineContext);

  const ownRef = useRef<SignupForm>(null);

  const mergedRefs = mergeRefs([ref, ownRef]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { fullName: nameInput, email: emailInput, password: passwordInput } = event.currentTarget;
    machine.send({
      type: 'SIGN_UP',
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
    });
  };

  const focusEmailInput = (animation: AnimationDefinition) => {
    if (animation === 'in') ownRef.current?.email.focus();
  };

  return (
    <motion.form
      ref={mergedRefs}
      className="authentication__form signup"
      initial="out"
      animate="in"
      exit="out"
      variants={formPage}
      onSubmit={submit}
      onAnimationComplete={focusEmailInput}
    >
      <motion.h2 variants={formItem}>Sign up</motion.h2>

      <Input name="fullName" required placeholder="Full name" icon="user" />
      <Input type="email" name="email" required placeholder="Email address" icon="email" />
      <Input type="password" name="password" placeholder="Password" icon="password" />
      <Button as={motion.button} type="submit" primary stretch variants={formItem} text="Sign up" />
      <motion.p variants={formItem}>
        Already have an account?{' '}
        <Button inline onClick={() => machine.send('LOG_IN_CLICKED')} text="Log in!" />
      </motion.p>
    </motion.form>
  );
});

Signup.displayName = 'Signup';

export default Signup;
