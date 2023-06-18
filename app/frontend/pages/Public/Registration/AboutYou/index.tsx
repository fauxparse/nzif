import { useRegistrationStatusQuery } from '@/graphql/types';

import LogInForm from './LogInForm';
import PersonalDetailsForm from './PersonalDetailsForm';

import './AboutYou.css';

const AboutYou: React.FC = () => {
  const { data } = useRegistrationStatusQuery();

  const { registration } = data || {};

  return !registration?.user ? <LogInForm /> : <PersonalDetailsForm />;
};

export default AboutYou;
