import { useQuery } from '@apollo/client';
import { useChildMatches, useNavigate } from '@tanstack/react-router';
import { PropsWithChildren, createContext, useCallback, useContext, useMemo } from 'react';
import { useAuthentication } from '../Authentication';
import { RegistrationQuery } from './queries';
import { Registration } from './types';

import { RegistrationPhase } from '@/graphql/types';
import CheckIcon from '@/icons/CheckIcon';
import CodeOfConductIcon from '@/icons/CodeOfConductIcon';
import PaymentIcon from '@/icons/PaymentIcon';
import ProfileIcon from '@/icons/ProfileIcon';
import WorkshopIcon from '@/icons/WorkshopIcon';

export const STEPS = [
  { id: 'yourself', title: 'About you', icon: ProfileIcon },
  {
    id: 'code-of-conduct',
    title: 'Code of Conduct',
    icon: CodeOfConductIcon,
  },
  {
    id: 'workshops',
    title: 'Workshops',
    icon: WorkshopIcon,
  },
  {
    id: 'payment',
    title: 'Pay later',
    icon: PaymentIcon,
  },
  {
    id: 'completed',
    title: 'Confirmation',
    icon: CheckIcon,
  },
] as const;

export type StepDefinition = (typeof STEPS)[number];

export type StepId = StepDefinition['id'];

export type StepState = 'pending' | 'active' | 'completed';

type RegistrationContext = {
  phase: RegistrationPhase;
  earlybird: boolean;
  steps: typeof STEPS;
  step: StepDefinition | null;
  stepIndex: number | null;
  loading: boolean;
  registration: Registration | null;
  defaultNextStep: StepId;
  stepClicked: (step: StepId) => void;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
};

const RegistrationContext = createContext<RegistrationContext>({
  phase: RegistrationPhase.Closed,
  earlybird: false,
  steps: STEPS,
  step: null,
  stepIndex: null,
  loading: true,
  registration: null,
  defaultNextStep: 'yourself',
  stepClicked: () => {},
  goToPreviousStep: () => {},
  goToNextStep: () => {},
});

export const RegistrationProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const stepId = useChildMatches({
    select: (matches) =>
      matches
        .find((match) => match.id.match(/register\/.+/))
        ?.id.split('/')
        .pop() as StepId | undefined,
  });

  const stepIndex = useMemo(
    () => (stepId && STEPS.findIndex((s) => s.id === stepId)) ?? null,
    [stepId]
  );

  const step = stepIndex === null ? null : STEPS[stepIndex];

  const { loading, data, refetch } = useQuery(RegistrationQuery);

  const { user } = useAuthentication();

  const phase = data?.festival?.registrationPhase ?? RegistrationPhase.Closed;

  const registration = data?.registration ?? null;

  const defaultNextStep = useMemo<StepId>(() => {
    if (!user || !registration || !registration.user) return 'yourself';
    if (!registration.codeOfConductAcceptedAt) return 'code-of-conduct';
    return 'workshops';
  }, [registration, user]);

  const navigate = useNavigate();

  const stepClicked = useCallback(
    (step: StepId) => {
      // TODO: checks
      navigate({ to: `/register/${step}`, replace: true });
    },
    [navigate]
  );

  const goToNextStep = useCallback(() => {
    const newStep = STEPS[(stepIndex ?? 0) + 1];
    if (newStep) {
      navigate({ to: `/register/${newStep.id}` });
    }
  }, [navigate, stepIndex]);

  const goToPreviousStep = useCallback(() => {
    const newStep = STEPS[(stepIndex ?? 0) - 1];
    if (newStep) {
      navigate({ to: `/register/${newStep.id}` });
    }
  }, [navigate, stepIndex]);

  const value = useMemo(
    () => ({
      phase,
      earlybird: phase === RegistrationPhase.Earlybird || phase === RegistrationPhase.Paused,
      steps: STEPS,
      step,
      stepIndex,
      loading,
      registration,
      defaultNextStep,
      stepClicked,
      goToNextStep,
      goToPreviousStep,
    }),
    [
      phase,
      step,
      stepIndex,
      loading,
      registration,
      defaultNextStep,
      stepClicked,
      goToNextStep,
      goToPreviousStep,
    ]
  );

  return <RegistrationContext.Provider value={value}>{children}</RegistrationContext.Provider>;
};

export const useRegistration = () => useContext(RegistrationContext);
