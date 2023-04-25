import React, { forwardRef, useContext, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { AnimationDefinition, motion } from 'framer-motion';

import Button from '@/atoms/Button';

import { AuthenticationMachineContext } from './AuthenticationMachine';
import Input from './InputRow';
import { formItem, formPage } from './variants';

type ForgotForm = HTMLFormElement & {
  email: HTMLInputElement;
};

const Forgot = forwardRef<ForgotForm>((_, ref) => {
  const { machine } = useContext(AuthenticationMachineContext);

  const ownRef = useRef<ForgotForm>(null);

  const mergedRefs = mergeRefs([ref, ownRef]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { email: emailInput } = event.currentTarget;
    machine.send({ type: 'RESET_PASSWORD', email: emailInput.value });
  };

  const focusEmailInput = (animation: AnimationDefinition) => {
    if (animation === 'in') ownRef.current?.email.focus();
  };

  return (
    <motion.form
      ref={mergedRefs}
      className="authentication__form forgot"
      initial="out"
      animate="in"
      exit="out"
      variants={formPage}
      onSubmit={submit}
      onAnimationComplete={focusEmailInput}
    >
      <motion.h2 variants={formItem}>Reset password</motion.h2>
      <Input type="email" name="email" required placeholder="Email address" icon="email" />
      <Button
        as={motion.button}
        type="submit"
        primary
        stretch
        variants={formItem}
        text="Reset password"
      />
      <motion.p variants={formItem}>
        <Button inline onClick={() => machine.send('LOG_IN_CLICKED')} text="Back to log in" />
      </motion.p>
    </motion.form>
  );
});

Forgot.displayName = 'Forgot';

export default Forgot;
