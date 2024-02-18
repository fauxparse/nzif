import { useTypedParams } from 'react-router-typesafe-routes/dom';

import { ROUTES } from '@/Routes';
import { RegistrationPhase, useRegistrationStatusQuery } from '@/graphql/types';

import Placements from './Placements';
import Preferences from './Preferences';

import './Registration.css';

export const Component = () => {
  const { id } = useTypedParams(ROUTES.ADMIN.PERSON);

  const { data } = useRegistrationStatusQuery({ variables: { id } });

  const { registration = null, festival = null } = data || {};

  const registrationPhase = festival?.registrationPhase || RegistrationPhase.Closed;

  if (!registration) return null;

  if (registrationPhase === RegistrationPhase.Earlybird) {
    return <Preferences />;
  }
  return <Placements />;
};
