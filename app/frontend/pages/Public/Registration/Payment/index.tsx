import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRegistrationContext } from '../RegistrationContext';
import { RegistrationPhase } from '@/graphql/types';

import Earlybird from './Earlybird';
import General from './General';

import './Payment.css';

export const Component: React.FC = () => {
  const { loading, festival, registration } = useRegistrationContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !registration?.id) {
      navigate(festival ? `/${festival.id}/register` : '/');
    }
  }, [loading, registration, festival, navigate]);

  if (loading) return null;

  return festival.registrationPhase === RegistrationPhase.Earlybird ? <Earlybird /> : <General />;
};

Component.displayName = 'Payment';

export default Component;
