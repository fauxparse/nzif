import Header from '@/components/organisms/Header';
import { Flex, Skeleton, TabNav, Text } from '@radix-ui/themes';
import { Outlet, Link as RouterLink, useRouterState } from '@tanstack/react-router';

import { useQuery } from '@apollo/client';
import classes from './Workshop.module.css';
import { WorkshopProvider } from './WorkshopProvider';
import { MyWorkshopSessionQuery } from './queries';

type WorkshopProps = {
  slug: string;
  sessionId: string;
};

const PAGES = [
  {
    id: 'participants',
    title: 'Participants',
    path: './',
  },
  {
    id: 'messages',
    title: 'Messages',
    path: './messages',
  },
];

export const Workshop: React.FC<WorkshopProps> = ({ slug, sessionId }) => {
  const page = usePage();

  const { loading, data } = useQuery(MyWorkshopSessionQuery, {
    variables: { sessionId },
  });

  const session = data?.session;

  return (
    <>
      <Header
        title={
          <>
            <h1>
              <Skeleton loading={loading}>{session?.activity?.name || 'Workshop'}</Skeleton>
            </h1>
            <Text as="div" size="4" color="gray" weight="regular">
              <Skeleton loading={loading}>
                {session?.startsAt?.plus({}).toFormat('EEEE d MMMM, h:mm a') || 'Loading...'}
              </Skeleton>
            </Text>
          </>
        }
        tabs={
          <TabNav.Root>
            {PAGES.map(({ id, title, path }) => (
              <TabNav.Link asChild key={id} active={page === id}>
                <RouterLink
                  to={path}
                  from="/my/workshops/$slug/$sessionId"
                  params={{ slug, sessionId }}
                >
                  <Flex asChild align="center" gap="2">
                    <Text size="3">{title}</Text>
                  </Flex>
                </RouterLink>
              </TabNav.Link>
            ))}
          </TabNav.Root>
        }
      />
      <div className={classes.main}>
        {session && (
          <WorkshopProvider session={session}>
            <Outlet />
          </WorkshopProvider>
        )}
      </div>
    </>
  );
};

const usePage = () => {
  const { matches } = useRouterState();

  const prefix = /\/my\/\workshops\/\$slug\/\$sessionId\/([^/]+)/;

  return (
    matches.reduce(
      (acc: string | null, { routeId }) => acc || routeId.match(prefix)?.[1] || null,
      null
    ) || 'participants'
  );
};
