import { RegistrationExplainer } from '@/components/organisms/RegistrationExplainer';
import { useRegistration } from '@/services/Registration';
import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Buttons } from './Buttons';
import { HideExplainerMutation } from './queries';

import classes from './Registration.module.css';

export const Workshops: React.FC = () => {
  const { loading, registration, goToNextStep } = useRegistration();

  const [hideExplainer] = useMutation(HideExplainerMutation, {
    optimisticResponse: registration
      ? {
          updateRegistrationUserDetails: {
            registration: {
              id: registration.id,
              showExplainer: false,
            },
          },
        }
      : undefined,
  });

  const [showExplainer, setShowExplainer] = useState(registration?.showExplainer ?? false);

  useEffect(() => {
    if (registration?.showExplainer) {
      setShowExplainer(true);
    }
  }, [registration]);

  const closeExplainer = (value: boolean, dontShowAgain: boolean) => {
    setShowExplainer(value);
    if (!value && dontShowAgain) {
      hideExplainer();
    }
  };

  const [busy, setBusy] = useState(false);

  return (
    <form
      className={classes.page}
      // onSubmit={(e) => {
      //   e.preventDefault();
      //   e.stopPropagation();
      //   form.handleSubmit();
      // }}
    >
      <RegistrationExplainer open={showExplainer} onOpenChange={closeExplainer} />
      <Buttons disabled />
    </form>
  );
};
