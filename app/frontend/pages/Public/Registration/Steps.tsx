import { CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Step } from './Registration.types';
import { useRegistrationContext } from './RegistrationContext';

export const REGISTRATION_STEPS: Step[] = [
  {
    label: 'Your details',
    path: '/register/about-you',
  },
  {
    label: 'Workshop selection',
    path: '/register/workshops',
  },
  {
    label: 'Payment',
    path: '/register/payment',
  },
  {
    label: 'Finalise registration',
    path: '/register/thanks',
  },
];

const Steps: React.FC = () => {
  const { length } = REGISTRATION_STEPS;

  const { pathname } = useLocation();

  const currentIndex = Math.max(
    REGISTRATION_STEPS.findIndex(({ path }) => pathname.endsWith(path)),
    0
  );

  const current = REGISTRATION_STEPS[currentIndex];

  const { festival } = useRegistrationContext();

  return (
    <div className="registration__steps" style={{ '--step-count': length - 1 } as CSSProperties}>
      {REGISTRATION_STEPS.slice(0, -1).map(({ label, path }, index) => {
        const attrs = {
          key: path,
          className: 'registration__step',
          'data-step-count': length,
          'aria-selected': path === current.path,
          children: <b>{label}</b>,
        };

        return index < currentIndex ? (
          <Link to={`/${festival?.id}${path}`} {...attrs} />
        ) : (
          <div {...attrs} />
        );
      })}
    </div>
  );
};

export default Steps;
