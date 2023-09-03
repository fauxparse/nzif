import { useRegistrationContext } from '../RegistrationContext';
import { RegistrationPhase, useFinaliseRegistrationMutation } from '@/graphql/types';

import Cart from './Cart';
import Earlybird from './Earlybird';
import General from './General';

import './Payment.css';

export const Component: React.FC = () => {
  const { festival } = useRegistrationContext();

  return festival.registrationPhase === RegistrationPhase.Earlybird ? <Earlybird /> : <General />;
};

Component.displayName = 'Payment';

export default Component;
