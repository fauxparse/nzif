import { useRegistrationContext } from '../RegistrationContext';
import { useRegistrationStatusQuery } from '@/graphql/types';

import LogInForm from './LogInForm';
import PersonalDetailsForm from './PersonalDetailsForm';

import './AboutYou.css';

const AboutYou: React.FC = () => {
  const { data } = useRegistrationStatusQuery();

  const { registration } = data || {};

  const { next } = useRegistrationContext();

  return !registration?.user ? <LogInForm /> : <PersonalDetailsForm onContinue={next} />;
};

export default AboutYou;
