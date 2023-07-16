import { useRegistrationContext } from '../RegistrationContext';
import { useRegistrationStatusQuery } from '@/graphql/types';

import LogInForm from './LogInForm';
import PersonalDetailsForm from './PersonalDetailsForm';

import './AboutYou.css';

export const Component: React.FC = () => {
  const { data } = useRegistrationStatusQuery();

  const { registration } = data || {};

  const { next } = useRegistrationContext();

  return !registration?.user ? <LogInForm /> : <PersonalDetailsForm onContinue={next} />;
};

Component.displayName = 'AboutYou';

export default Component;
