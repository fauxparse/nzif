import { useRegistrationContext } from '../RegistrationContext';
import { RegistrationPhase } from '@/graphql/types';

import Earlybird from './Earlybird';
import General from './General';

import './Payment.css';

export const Component: React.FC = () => {
  const { loading, festival } = useRegistrationContext();

  if (loading) return null;

  return festival.registrationPhase === RegistrationPhase.Earlybird ? <Earlybird /> : <General />;
};

Component.displayName = 'Payment';

export default Component;
