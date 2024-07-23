import { Spinner } from '@/components/atoms/Spinner';
import { STEPS, useRegistration } from '@/services/Registration';
import { Button, Flex } from '@radix-ui/themes';
import { Link } from '@tanstack/react-router';
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
    <Flex justify="end" className={classes.buttons}>
      {previousStep && (
        <Button asChild className={classes.button} size="4" variant="outline" disabled={busy}>
          <Link to={`/register/${previousStep.id}`}>Back</Link>
        </Button>
      )}
      <Button
        className={classes.button}
        type="submit"
        size="4"
        variant="solid"
        disabled={disabled || busy}
      >
        {busy ? <Spinner /> : 'Next'}
      </Button>
    </Flex>
  );
};
