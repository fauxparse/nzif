import { RegistrationPhase } from '@/graphql/types';
import { useRegistration } from '@/services/Registration';
import { useBeforeUnload } from '@/hooks/useBeforeUnload';
import { Earlybird } from './Earlybird';
import { General } from './General';

export const Payment = () => {
  const { phase, registration } = useRegistration();

  // Warn the user if they try to leave the registration flow before it's
  // been finalised (i.e. before they've hit "Finish").
  useBeforeUnload(!!registration && registration.completedAt == null);

  switch (phase) {
    case RegistrationPhase.Earlybird:
    case RegistrationPhase.Paused:
      return <Earlybird />;
    default:
      return <General />;
  }
};
