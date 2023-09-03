import { useMemo } from 'react';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { sortBy } from 'lodash-es';
import { DateTime } from 'luxon';

import {
  RegistrationPhase,
  RegistrationStatusQuery,
  useRegistrationStatusQuery,
} from '@/graphql/types';
import { ROUTES } from '@/Routes';

import Preferences from './Preferences';

export const Component = () => {
  const { id } = useTypedParams(ROUTES.ADMIN.PERSON);

  const { data } = useRegistrationStatusQuery({ variables: { id } });

  const { registration = null, festival = null } = data || {};

  const registrationPhase = festival?.registrationPhase || RegistrationPhase.Closed;

  if (!registration) return null;

  if (registrationPhase === RegistrationPhase.Earlybird) {
    return <Preferences />;
  }

  return <div className="inset registration-summary"></div>;
};
