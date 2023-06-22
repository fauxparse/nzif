import { createContext, PropsWithChildren, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { RegistrationStatusQuery } from '@/graphql/types';

import { ContinueHandler, Step } from './Registration.types';
import { REGISTRATION_STEPS } from './Steps';

type RegistrationContextProps = {
  step: Step;
  festival: RegistrationStatusQuery['festival'];
  registration: RegistrationStatusQuery['registration'];
  next: ContinueHandler;
  back: ContinueHandler;
};

export const RegistrationContext = createContext<RegistrationContextProps>(
  {} as RegistrationContextProps
);

type RegistrationContextProviderProps = PropsWithChildren<
  Pick<RegistrationContextProps, 'step' | 'festival' | 'registration'>
>;

export const RegistrationContextProvider: React.FC<RegistrationContextProviderProps> = ({
  step,
  festival,
  registration,
  children,
}) => {
  const navigate = useNavigate();

  const next = useCallback(() => {
    const nextStep = REGISTRATION_STEPS[REGISTRATION_STEPS.indexOf(step) + 1] || {
      label: 'Thanks',
      path: '/register/thanks',
    };
    navigate(`/${festival.id}${nextStep.path}`);
  }, [step, navigate, festival.id]);

  const back = useCallback(() => {
    const previousStep = REGISTRATION_STEPS[REGISTRATION_STEPS.indexOf(step) + 1];
    if (previousStep) {
      navigate(previousStep.path);
    }
  }, [step, navigate]);

  return (
    <RegistrationContext.Provider value={{ step, festival, registration, next, back }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistrationContext = () => useContext(RegistrationContext);

export default RegistrationContext;
