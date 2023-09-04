import { createContext, PropsWithChildren, useCallback, useContext, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

import { RegistrationStatusQuery } from '@/graphql/types';

import { ContinueHandler, Step } from './Registration.types';
import { REGISTRATION_STEPS } from './Steps';

type RegistrationContextProps = {
  loading?: boolean;
  busy: boolean;
  setBusy: (value: boolean) => void;
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
  Omit<RegistrationContextProps, 'next' | 'back' | 'busy' | 'setBusy'>
>;

export const RegistrationContextProvider: React.FC<RegistrationContextProviderProps> = ({
  loading = false,
  step,
  festival,
  registration,
  children,
}) => {
  const navigate = useNavigate();

  const [busy, dispatch] = useReducer(
    (state: number, action: boolean) => state + (action ? 1 : -1),
    0
  );

  const setBusy = (value: boolean) => dispatch(value);

  const next = useCallback(() => {
    const nextStep = REGISTRATION_STEPS[REGISTRATION_STEPS.indexOf(step) + 1] || {
      label: 'Thanks',
      path: '/register/thanks',
    };
    navigate(nextStep.path);
  }, [step, navigate]);

  const back = useCallback(() => {
    const previousStep = REGISTRATION_STEPS[REGISTRATION_STEPS.indexOf(step) + 1];
    if (previousStep) {
      navigate(previousStep.path);
    }
  }, [step, navigate]);

  return (
    <RegistrationContext.Provider
      value={{ loading, step, festival, registration, next, back, busy: busy > 0, setBusy }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistrationContext = () => useContext(RegistrationContext);

export default RegistrationContext;
