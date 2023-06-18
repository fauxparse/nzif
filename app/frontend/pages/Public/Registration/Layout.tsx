import { useMemo } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import Button from '@/atoms/Button';
import { useRegistrationStatusQuery } from '@/graphql/types';

import Steps, { REGISTRATION_STEPS } from './Steps';

const RegistrationLayout: React.FC = () => {
  const { loading, data } = useRegistrationStatusQuery();

  const { pathname } = useLocation();

  const { previous, current, next } = useMemo(() => {
    const currentIndex = REGISTRATION_STEPS.findIndex(({ path }) => pathname.endsWith(path));

    return {
      previous: currentIndex > 0 ? REGISTRATION_STEPS[currentIndex - 1] : null,
      current: REGISTRATION_STEPS[currentIndex],
      next:
        currentIndex < REGISTRATION_STEPS.length - 1
          ? REGISTRATION_STEPS[currentIndex + 1]
          : {
              label: 'Finalise registration',
              path: '/thanks',
            },
    };
  }, [pathname]);

  const { festival, registration } = data || {};

  return (
    <div className="registration">
      <h1>Register for NZIF {festival?.id}</h1>
      <Steps />

      <Outlet />

      {registration?.user && (
        <footer className="registration__footer">
          {previous && (
            <Button
              as={Link}
              to={festival ? `/${festival.id}${previous.path}` : '/'}
              className="registration__button"
              icon="chevronLeft"
              data-action="previous"
              text={
                <>
                  <small>Previous</small>
                  <span>{previous.label}</span>
                </>
              }
            />
          )}
          {next && (
            <Button
              className="registration__button"
              icon="chevronRight"
              data-action="next"
              type="submit"
              form="registration-form"
              text={
                <>
                  <small>Next</small>
                  <span>{next.label}</span>
                </>
              }
            />
          )}
        </footer>
      )}
    </div>
  );
};

export default RegistrationLayout;
