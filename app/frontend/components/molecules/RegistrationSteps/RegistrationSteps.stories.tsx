import { StoryDefault } from '@ladle/react';
import { useState } from 'react';
import { RegistrationSteps } from '.';
import { StepId } from './types';

export const Profile = () => {
  const [step, setStep] = useState<StepId>('yourself');

  return (
    <RegistrationSteps.Root step={step}>
      {({ step, state }) => (
        <RegistrationSteps.Step id={step.id} state={state} onClick={() => setStep(step.id)} />
      )}
    </RegistrationSteps.Root>
  );
};

export default {
  title: 'Molecules/Registration steps',
} satisfies StoryDefault;
