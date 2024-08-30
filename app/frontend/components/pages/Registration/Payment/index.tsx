import { RegistrationPhase } from '@/graphql/types';
import { useRegistration } from '@/services/Registration';
import { Earlybird } from './Earlybird';
import { General } from './General';

export const Payment = () => {
  const { phase } = useRegistration();

  switch (phase) {
    case RegistrationPhase.Earlybird:
    case RegistrationPhase.Paused:
      return <Earlybird />;
    default:
      return <General />;
  }
};
