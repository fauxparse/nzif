import { CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';

export type Step = {
  label: string;
  path: string;
};

export const REGISTRATION_STEPS: Step[] = [
  {
    label: 'Your details',
    path: '/register',
  },
  {
    label: 'Workshop selection',
    path: '/workshops',
  },
  {
    label: 'Payment',
    path: '/payment',
  },
];

const Steps: React.FC = () => {
  const { length } = REGISTRATION_STEPS;

  const { pathname } = useLocation();

  const current =
    REGISTRATION_STEPS.find(({ path }) => pathname.endsWith(path)) || REGISTRATION_STEPS[0];

  return (
    <div className="registration__steps" style={{ '--step-count': length } as CSSProperties}>
      {REGISTRATION_STEPS.map(({ label, path }) => (
        <div
          key={path}
          className="registration__step"
          data-step-count={length}
          aria-selected={path === current.path}
        >
          <b>{label}</b>
        </div>
      ))}
    </div>
  );
};

export default Steps;
