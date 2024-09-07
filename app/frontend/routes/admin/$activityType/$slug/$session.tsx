import { ActivityDetailsQuery } from '@/components/pages/admin/ActivityEditor/queries';
import { WorkshopSession } from '@/components/pages/admin/WorkshopSession';
import { ActivityType } from '@/graphql/types';
import { useFestival } from '@/hooks/useFestival';
import { useQuery } from '@apollo/client';
import { Text } from '@radix-ui/themes';
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

    const activity = data?.festival?.activity;
    const session =
      activity?.sessions.find((s) => s.startsAt.hasSame(params.session, 'day')) ?? null;

    if (!loading && (!session || !activity)) {
      navigate({ to: '/admin/$activityType/$slug', params });
    }

    if (!session || !activity) return null;

    if (params.activityType === ActivityType.Workshop) {
      return <WorkshopSession workshop={activity} session={session} />;
    }

    return <Text>{session.startsAt.toLocaleString()}</Text>;
  },
});
