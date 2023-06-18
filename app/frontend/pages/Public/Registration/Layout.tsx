import { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { DateTime } from 'luxon';

import { useRegistrationStatusQuery } from '@/graphql/types';

import Footer from './Footer';
import { RegistrationContextProvider } from './RegistrationContext';
import Steps, { REGISTRATION_STEPS } from './Steps';

const RegistrationLayout: React.FC = () => {
  const { loading, data } = useRegistrationStatusQuery();

  const { pathname } = useLocation();

  const current = useMemo(
    () => REGISTRATION_STEPS.find(({ path }) => pathname.endsWith(path)) || REGISTRATION_STEPS[0],
    [pathname]
  );

  const {
    festival = {
      __typename: 'Festival',
      id: String(DateTime.now().year),
      startDate: DateTime.now(),
      endDate: DateTime.now(),
      slots: [],
    },
    registration = {
      __typename: 'Registration',
      id: '',
      user: null,
      codeOfConductAcceptedAt: null,
      preferences: [],
    },
  } = data || {};

  return (
    <RegistrationContextProvider step={current} festival={festival} registration={registration}>
      <div className="registration">
        <h1>Register for NZIF {festival?.id}</h1>
        <Steps />

        <Outlet />

        {registration?.user && <Footer />}
      </div>
    </RegistrationContextProvider>
  );
};

export default RegistrationLayout;
