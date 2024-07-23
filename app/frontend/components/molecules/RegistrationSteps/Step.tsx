import { Flex, Text } from '@radix-ui/themes';
import { useMemo } from 'react';
import { STEPS, StepDefinition, StepId, StepState } from './types';

import classes from './RegistrationSteps.module.css';

type StepProps = {
  id: StepId;
  state: StepState;
  disabled?: boolean;
  onClick?: (step: StepDefinition) => void;
};

export const Step: React.FC<StepProps> = ({ id, state, disabled, onClick }) => {
  const stepIndex = useMemo(() => STEPS.findIndex((step) => step.id === id), [id]);

  const step = STEPS[stepIndex];

  if (!step) return null;

  const Icon = step.icon;

  return (
    <button
      type="button"
      className={classes.step}
      data-state={state}
      style={{ gridColumn: stepIndex + 1 }}
      disabled={disabled}
      onClick={() => onClick?.(step)}
    >
      <Flex>
        <Icon />
      </Flex>
      <Text className={classes.stepText} truncate>
        {step.title}
      </Text>
    </button>
  );
};
