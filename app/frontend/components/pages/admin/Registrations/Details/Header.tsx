import Header from '@/components/organisms/Header';
import PaymentIcon from '@/icons/PaymentIcon';
import WorkshopIcon from '@/icons/WorkshopIcon';
import { Flex, Heading, Link, Skeleton, TabNav, Text } from '@radix-ui/themes';
import { Link as RouterLink, useRouterState } from '@tanstack/react-router';
import { VariablesOf } from 'gql.tada';
import { useRegistrationDetails } from './RegistrationDetailsProvider';
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

export const RegistrationDetailsHeader = () => {
  const { loading, registration, id: registrationId } = useRegistrationDetails();

  const page = usePage();

  return (
    <Header
      title={
        <>
          <Heading>
            <Skeleton loading={loading}>{registration?.user?.name ?? 'Loading…'}</Skeleton>
          </Heading>
          <Link href={`mailto:${registration?.user?.email}`}>
            <Skeleton loading={loading}>{registration?.user?.email}</Skeleton>
          </Link>
        </>
      }
      tabs={
        <TabNav.Root>
          {PAGES.map(({ id, title, icon, path }) => (
            <TabNav.Link asChild key={id} active={page === id}>
              <RouterLink
                to={path}
                from="/admin/registrations/$registrationId"
                params={{ registrationId }}
              >
                <Flex asChild align="center" gap="2">
                  <Text size="3">
                    {icon}
                    {title}
                  </Text>
                </Flex>
              </RouterLink>
            </TabNav.Link>
          ))}
        </TabNav.Root>
      }
    />
  );
};
