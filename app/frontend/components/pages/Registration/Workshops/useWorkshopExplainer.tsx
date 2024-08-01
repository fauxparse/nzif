import { RegistrationExplainer } from '@/components/organisms/RegistrationExplainer';
import { useRegistration } from '@/services/Registration';
import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { HideExplainerMutation } from '../queries';

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

  return [
    () => <RegistrationExplainer open={showExplainer} onOpenChange={closeExplainer} />,
    { show: () => setShowExplainer(true) },
  ];
};
