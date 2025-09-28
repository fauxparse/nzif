import { Reference, useMutation, useQuery } from '@apollo/client';
import { useChildMatches, useNavigate } from '@tanstack/react-router';
import { createContext, PropsWithChildren, useCallback, useContext, useMemo } from 'react';
import { RegistrationPhase } from '@/graphql/types';
import CheckIcon from '@/icons/CheckIcon';
import CodeOfConductIcon from '@/icons/CodeOfConductIcon';
import PaymentIcon from '@/icons/PaymentIcon';
import ProfileIcon from '@/icons/ProfileIcon';
import WorkshopIcon from '@/icons/WorkshopIcon';
import { useAuthentication } from '../Authentication';
import {
  JoinSessionMutation,
  JoinWaitlistMutation,
  LeaveSessionMutation,
  LeaveWaitlistMutation,
  RegistrationQuery,
} from './queries';
import { Registration } from './types';

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

const notImplemented = () => {
  throw new Error('Not implemented');
};

type RegistrationContext = {
  phase: RegistrationPhase;
  refetch: () => Promise<void>;
  earlybird: boolean;
  steps: typeof STEPS;
  step: StepDefinition | null;
  stepIndex: number | null;
  loading: boolean;
  registration: Registration | null;
  defaultNextStep: StepId;
  count: number;
  stepClicked: (step: StepId) => void;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  leaveSession: (id: string) => Promise<void>;
  leaveWaitlist: (id: string) => Promise<void>;
  joinSession: (id: string) => Promise<void>;
  joinWaitlist: (id: string) => Promise<void>;
};

const RegistrationContext = createContext<RegistrationContext>({
  phase: RegistrationPhase.Closed,
  refetch: notImplemented,
  earlybird: false,
  steps: STEPS,
  step: null,
  stepIndex: null,
  loading: true,
  registration: null,
  count: 0,
  defaultNextStep: 'yourself',
  stepClicked: notImplemented,
  goToPreviousStep: notImplemented,
  goToNextStep: notImplemented,
  leaveSession: notImplemented,
  leaveWaitlist: notImplemented,
  joinSession: notImplemented,
  joinWaitlist: notImplemented,
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

  const [doLeaveSession] = useMutation(LeaveSessionMutation);

  const leaveSession = useCallback(
    async (sessionId: string) => {
      if (!registration) throw new Error('Not registered');

      await doLeaveSession({
        variables: { sessionId },
        optimisticResponse: {
          removeFromSession: {
            registration: {
              id: registration?.id,
              sessions: registration?.sessions.filter((s) => s.id !== sessionId),
            },
            session: {
              id: sessionId,
              full: false,
            },
          },
        },
      });
    },
    [registration, doLeaveSession]
  );

  const [doLeaveWaitlist] = useMutation(LeaveWaitlistMutation);

  const leaveWaitlist = useCallback(
    async (sessionId: string) => {
      if (!registration) throw new Error('Not registered');

      await doLeaveWaitlist({
        variables: { sessionId },
        optimisticResponse: {
          removeFromWaitlist: true,
        },
        update: (cache) => {
          cache.modify({
            id: cache.identify(registration),
            fields: {
              waitlist: (existing, { readField }) =>
                existing.filter((s: Reference) => readField('id', s) !== sessionId),
            },
          });
        },
      });
    },
    [registration, doLeaveSession]
  );

  const [doJoinSession] = useMutation(JoinSessionMutation);

  const joinSession = useCallback(
    async (sessionId: string) => {
      if (!registration) throw new Error('Not registered');

      await doJoinSession({
        variables: { sessionId },
      });
    },
    [registration, doJoinSession]
  );

  const [doJoinWaitlist] = useMutation(JoinWaitlistMutation);

  const joinWaitlist = useCallback(
    async (sessionId: string) => {
      if (!registration) throw new Error('Not registered');

      await doJoinWaitlist({
        variables: { sessionId },
        update: (cache, { data }) => {
          cache.modify({
            id: cache.identify(registration),
            fields: {
              waitlist: (existing) => [...existing, data?.addToWaitlist?.waitlist],
            },
          });
        },
      });
    },
    [registration, doJoinWaitlist]
  );

  const earlybird = phase === RegistrationPhase.Earlybird || phase === RegistrationPhase.Paused;

  const count = useMemo(() => {
    if (!registration) return 0;

    if (earlybird) {
      const slots = registration.preferences
        .flatMap((p) => p.session.slots)
        .reduce((acc, slot) => acc.add(slot.id), new Set());
      return slots.size;
    }
    return registration.sessions.reduce((t, s) => t + s.slots.length, 0);
  }, [registration, earlybird]);

  const value = useMemo(
    () => ({
      phase,
      refetch: async () => {
        await refetch();
      },
      earlybird,
      count,
      steps: STEPS,
      step,
      stepIndex,
      loading,
      registration,
      defaultNextStep,
      stepClicked,
      goToNextStep,
      goToPreviousStep,
      leaveSession,
      leaveWaitlist,
      joinSession,
      joinWaitlist,
    }),
    [
      phase,
      refetch,
      step,
      stepIndex,
      loading,
      registration,
      defaultNextStep,
      stepClicked,
      goToNextStep,
      goToPreviousStep,
      leaveSession,
      leaveWaitlist,
      joinSession,
      joinWaitlist,
    ]
  );

  return <RegistrationContext.Provider value={value}>{children}</RegistrationContext.Provider>;
};

export const useRegistration = () => useContext(RegistrationContext);
