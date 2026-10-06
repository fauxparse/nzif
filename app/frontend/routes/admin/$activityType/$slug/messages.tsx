import { Messages } from '@/components/pages/admin/ActivityEditor/Messages';
import { ActivityMessagesQuery } from '@/components/pages/admin/ActivityEditor/queries';
import { ActivityType } from '@/graphql/types';
import { useFestival } from '@/hooks/useFestival';
import { useQuery } from '@apollo/client';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/$activityType/$slug/messages')({
  beforeLoad: ({ params }) => {
    if (params.activityType !== ActivityType.Workshop) {
      throw redirect({ to: '/admin/$activityType/$slug', params, replace: true });
    }
  },
  component: () => {
    const festival = useFestival();
    const { activityType, slug } = Route.useParams();

    const { loading, data } = useQuery(ActivityMessagesQuery, {
      variables: { year: festival.id, type: activityType, slug },
    });

    const activity = data?.festival?.activity;

    if (loading || !activity || activity.type !== ActivityType.Workshop) return null;

    return <Messages activity={activity} />;
  },
});
