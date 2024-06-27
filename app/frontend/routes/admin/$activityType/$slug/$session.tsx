import { ActivityDetailsQuery } from '@/components/pages/admin/ActivityEditor/queries';
import useFestival from '@/hooks/useFestival';
import { useQuery } from '@apollo/client';
import { Text } from '@mantine/core';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { DateTime } from 'luxon';

export const Route = createFileRoute('/admin/$activityType/$slug/$session')({
  parseParams: ({ session }) => ({
    session: DateTime.fromISO(session),
  }),
  stringifyParams: ({ session }) => ({
    session: session.toISODate() || '',
  }),
  component: () => {
    const navigate = useNavigate();
    const festival = useFestival();
    const params = Route.useParams();

    const { loading, data } = useQuery(ActivityDetailsQuery, {
      variables: { year: festival.id, type: params.activityType, slug: params.slug },
    });

    const session =
      data?.festival?.activity?.sessions.find((s) => s.startsAt.hasSame(params.session, 'day')) ??
      null;

    if (!loading && !session) {
      navigate({ to: '/admin/$activityType/$slug', params });
    }

    if (!session) return null;

    return <Text>{session.startsAt.toLocaleString()}</Text>;
  },
});
