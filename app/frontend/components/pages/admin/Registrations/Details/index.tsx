import PaymentIcon from '@/icons/PaymentIcon';
import WorkshopIcon from '@/icons/WorkshopIcon';
import { Outlet, useRouterState } from '@tanstack/react-router';
import { VariablesOf } from 'gql.tada';
import { RegistrationDetailsHeader } from './Header';
import { RegistrationDetailsProvider } from './RegistrationDetailsProvider';
import { RegistrationDetailsQuery } from './queries';

type RegistrationDetailsProps = {
  id: VariablesOf<typeof RegistrationDetailsQuery>['id'];
};

const PAGES = [
  {
    id: 'workshops',
    title: 'Workshops',
    icon: <WorkshopIcon />,
    path: './workshops',
  },
  {
    id: 'payments',
    title: 'Payments',
    icon: <PaymentIcon />,
    path: './payments',
  },
];

const usePage = () => {
  const { matches } = useRouterState();
  const prefix = /^\/admin\/registrations\/\$registrationId\/([^/]+)/;

  return (
    matches.reduce(
      (acc: string | null, { routeId }) => acc || routeId.match(prefix)?.[1] || null,
      null
    ) || 'details'
  );
};

export const RegistrationDetails: React.FC<RegistrationDetailsProps> = ({ id: registrationId }) => {
  const page = usePage();

  return (
    <RegistrationDetailsProvider id={registrationId}>
      <RegistrationDetailsHeader />
      <Outlet />
    </RegistrationDetailsProvider>
  );
};
