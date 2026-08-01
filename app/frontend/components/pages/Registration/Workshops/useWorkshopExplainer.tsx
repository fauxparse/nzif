import { useRegistration } from '@/services/Registration';
import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { HideExplainerMutation } from '../queries';
import { RegistrationExplainer } from './RegistrationExplainer';

const SESSION_STORAGE_KEY = 'workshopExplainerDismissed';

export const useWorkshopExplainer = (): [React.FC, { show: () => void }] => {
  const { registration } = useRegistration();

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

  const [showExplainer, setShowExplainer] = useState(false);

  useEffect(() => {
    if (
      registration?.showExplainer &&
      sessionStorage.getItem(SESSION_STORAGE_KEY) !== 'true'
    ) {
      setShowExplainer(true);
    }
  }, [registration]);

  const closeExplainer = (value: boolean, dontShowAgain: boolean) => {
    setShowExplainer(value);
    if (!value) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
      if (dontShowAgain) {
        hideExplainer();
      }
    }
  };

  return [
    () => (
      <RegistrationExplainer
        dismissible
        dontShowAgain={registration?.showExplainer === false}
        open={showExplainer}
        onOpenChange={closeExplainer}
      />
    ),
    { show: () => setShowExplainer(true) },
  ];
};
