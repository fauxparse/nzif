import { Spinner } from '@/components/atoms/Spinner';
import { STEPS, useRegistration } from '@/services/Registration';
import { Button, Flex } from '@radix-ui/themes';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import React from 'react';

import classes from './Registration.module.css';

type ButtonsProps = {
  disabled?: boolean;
  busy?: boolean;
};

export const Buttons: React.FC<ButtonsProps> = ({ disabled = false, busy = false }) => {
  const { stepIndex } = useRegistration();

  const previousStep = stepIndex === null ? null : stepIndex > 0 ? STEPS[stepIndex - 1] : null;

  return (
    <Flex justify="end" className={clsx('buttons', classes.buttons)}>
      {previousStep && (
        <Button asChild size={{ initial: '3', lg: '4' }} variant="outline" disabled={busy}>
          <Link to={`/register/${previousStep.id}`} rel="prev">
            Back
          </Link>
        </Button>
      )}
      <Button
        type="submit"
        rel="next"
        size={{ initial: '3', lg: '4' }}
        variant="solid"
        disabled={disabled || busy}
      >
        {busy ? <Spinner /> : 'Next'}
      </Button>
    </Flex>
  );
};
