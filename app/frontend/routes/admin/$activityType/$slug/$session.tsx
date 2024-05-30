import { Text } from '@mantine/core';
import { createFileRoute, useLoaderData, useNavigate } from '@tanstack/react-router';
import { DateTime } from 'luxon';
import { useEffect } from 'react';

const Component = () => {
  const navigate = useNavigate();

  const { activity } = useLoaderData({ from: '/admin/$activityType/$slug' });

  const params = Route.useParams();
  const session = activity.sessions.find((s) => s.startsAt.hasSame(params.session, 'day')) ?? null;

  useEffect(() => {
    if (!session) {
      navigate({ to: '/admin/$activityType/$slug', params });
    }
  }, [session]);

  if (!session) return null;

  return <Text>{session.startsAt.toLocaleString()}</Text>;
};

export const Route = createFileRoute('/admin/$activityType/$slug/$session')({
  parseParams: ({ session }) => ({
    session: DateTime.fromISO(session),
  }),
  stringifyParams: ({ session }) => ({
    session: session.toISODate() || '',
  }),
  component: Component,
  pendingComponent: () => <Text>Loading…</Text>,
});
