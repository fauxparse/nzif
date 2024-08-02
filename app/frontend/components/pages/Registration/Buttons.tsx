import { Spinner } from '@/components/atoms/Spinner';
import { STEPS, useRegistration } from '@/services/Registration';
import { Button, Flex } from '@radix-ui/themes';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import React from 'react';

import ChevronLeftIcon from '@/icons/ChevronLeftIcon';
import ChevronRightIcon from '@/icons/ChevronRightIcon';
import classes from './Registration.module.css';

type ButtonsProps = {
  disabled?: boolean;
  busy?: boolean;
};

export const Buttons: React.FC<ButtonsProps> = ({ disabled = false, busy = false }) => {
  const { stepIndex, steps } = useRegistration();

  const previousStep = stepIndex === null ? null : stepIndex > 0 ? STEPS[stepIndex - 1] : null;

  const nextStepLabel = stepIndex !== null && stepIndex >= steps.length - 2 ? 'Finish' : 'Next';

  return (
    <Flex justify="end" className={clsx('buttons', classes.buttons)}>
      {previousStep && (
        <Button asChild size={{ initial: '3', lg: '4' }} variant="outline" disabled={busy}>
          <Link to={`/register/${previousStep.id}`} rel="prev">
            <ChevronLeftIcon />
            <span>Back</span>
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
        {busy ? (
          <Spinner />
        ) : (
          <>
            <span>{nextStepLabel}</span> <ChevronRightIcon />
          </>
        )}
      </Button>
    </Flex>
  );
};
